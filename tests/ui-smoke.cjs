'use strict';
// Meaningful renderer smoke tests. Run with Playwright installed or set
// CODEX_PRIMARY_RUNTIME_NODE_MODULES to the shared development dependencies.
// ELDI_UI_URL may point at an already running renderer; otherwise a temporary
// loopback static server is created. ELDI_UI_NATIVE=1 exercises local runtimes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createRunner } = require('../desktop/runner.cjs');
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES || '', 'playwright')); }
const root = path.resolve(__dirname, '..');
let server, browser;
async function main() {
  let url = process.env.ELDI_UI_URL;
  if (!url) {
    server = http.createServer((req, res) => {
      const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (process.env.ELDI_UI_TEMP_CONTENT === '1' && relative === '/content/data.js') {
        res.setHeader('Content-Type', 'text/javascript');
        const curriculum = fs.readFileSync(path.join(root, 'content/curriculum.json'), 'utf8');
        const tasks = fs.readFileSync(path.join(root, 'content/tasks.json'), 'utf8');
        res.end('window.ELDI_CONTENT=' + curriculum + ';window.ELDI_TASKS=' + tasks + ';');
        return;
      }
      const file = path.resolve(root, '.' + relative);
      if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
      fs.readFile(file, (error, bytes) => {
        if (error) { res.writeHead(404); res.end(); return; }
        const types = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml' };
        res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
        res.end(bytes);
      });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    url = `http://127.0.0.1:${server.address().port}/renderer/index.html`;
  }
  browser = await playwright.chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  if (process.env.ELDI_UI_NATIVE === '1') {
    const runner = createRunner({ allowSystem: true });
    await page.exposeFunction('__testRun', request => runner.runCode(request));
    await page.exposeFunction('__testCancel', () => runner.cancel());
    await page.exposeFunction('__testStatus', () => runner.runtimeStatus());
    await page.addInitScript(() => {
      window.eldiDesktop = { runCode: request => window.__testRun(request), cancelRun: () => window.__testCancel(), runtimeStatus: () => window.__testStatus(), printPage: () => Promise.resolve({ success: true }) };
    });
  }
  await page.goto(url);
  await page.locator('h1').waitFor();
  assert.ok(await page.evaluate(() => window.ELDI_CONTENT?.length > 0), 'Lesson content failed to load.');
  assert.equal(await page.evaluate(() => EduMath.evaluate('(1/2+1/3)/(3/4)').exact), '10/9');
  await page.locator('[data-page="lessons"]').click();
  for (const grade of [5,6,7,8,9]) {
    await page.locator(`[data-g="${grade}"]`).click();
    for (const subject of ['sm','si']) {
      await page.locator('#' + subject).click();
      assert.ok(await page.locator('.lesson-card').count() > 0, `${grade}/${subject} has no lessons.`);
    }
  }
  const lessonId = await page.locator('.lesson-card button').first().getAttribute('data-id');
  await page.locator('.lesson-card button').first().click();
  const correct = await page.evaluate(id => window.ELDI_CONTENT.find(l => l.id === id).questions.map(q => q.correct), lessonId);
  for (let i=0; i<correct.length; i++) await page.locator(`input[name="q${i}"][value="${correct[i]}"]`).check();
  await page.locator('#submit').click();
  await assertText(page, '#qresult', '100%');
  await page.locator('[data-page="math"]').click();
  await page.locator('#calculate').click();
  await assertText(page, '#result', '10/9');
  await page.locator('[data-tool="div"]').click();
  await page.locator('#calculate').click();
  await assertText(page, '#result', 'NZD = 24');
  await assertText(page, '#result', 'NZS = 720');
  await page.locator('[data-tool="bases"]').click();
  await page.locator('#calculate').click();
  await assertText(page, '#result', '= 255');
  await page.locator('[data-tool="eq"]').click();
  await page.locator('#calculate').click();
  await assertText(page, '#result', 'x: 2');
  await page.locator('#eqtype').selectOption('system');
  await page.locator('#calculate').click();
  await assertText(page, '#result', 'x: 2');
  await page.locator('[data-tool="geo"]').click();
  for (const shape of ['rectangle','square','triangle','circle','cuboid','cube','prism','pyramid','cylinder','cone','sphere']) {
    await page.locator('#shape').selectOption(shape);
    await page.locator('#calculate').click();
    const result = await page.locator('#result').innerText();
    assert.match(result, /(Površina|Zapremina)/, `Geometry ${shape}: ${result}`);
  }
  await page.locator('[data-page="blocks"]').click();
  await page.locator('#square').click();
  await assertText(page, '#blockcode', 'move(80)');
  await page.locator('#brun').click();
  await page.waitForFunction(() => /Program sastavljen|Program završen/.test(document.querySelector('#blockout').innerText), { timeout: 10000 });
  assert.doesNotMatch(await page.locator('#blockout').innerText(), /Greška|unsafe-eval|nije dozvoljen/);
  await page.locator('#count').click();
  await page.locator('#brun').click();
  await page.waitForFunction(() => document.querySelector('#blockout').innerText.includes('Učim!'));
  await page.locator('#blocklang').selectOption('py');
  await assertText(page, '#blockcode', 'import turtle');
  await page.locator('[data-page="code"]').click();
  const tasksCount = await page.locator('#task option').count();
  assert.ok(tasksCount > 1, 'Programming tasks did not load.');
  if (process.env.ELDI_UI_NATIVE === '1') {
    for (const language of ['python','c','cpp','java']) {
      const status = await page.evaluate(() => window.eldiDesktop.runtimeStatus());
      if (!status[language].available) continue;
      await page.locator('#lang').selectOption(language);
      await page.locator('#input').fill('1000000000 1000000000');
      await page.locator('#run').click();
      await page.waitForFunction(() => document.querySelector('#output').innerText.includes('Program završen.'), { timeout: 30000 });
      await assertText(page, '#output', '2000000000');
    }
  }
  await page.locator('[data-page="progress"]').click();
  await assertText(page, 'table', '100%');
  await page.locator('[data-page="about"]').click();
  for (const author of ['Dino Isanović','Elvir Čajić','Damir Bajrić','Jasmin Suljkanović']) await assertText(page, '#view', author);
  assert.deepEqual(errors, [], 'Renderer produced unhandled errors.');
  console.log(`UI smoke passed: lessons, quiz, exact mathematics, geometry, Blockly, ${tasksCount-1} programming tasks, progress and authors.`);
}
async function assertText(page, selector, text) { assert.ok((await page.locator(selector).innerText()).includes(text), `${selector} missing ${text}`); }
main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; }).finally(async () => { await browser?.close(); await new Promise(resolve => server ? server.close(resolve) : resolve()); });
