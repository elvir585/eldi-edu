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
  await page.locator('[data-page="collection"]').click();
  await page.locator('#collection-grade').selectOption('5');
  const topic = await page.evaluate(() => EduExercises.topics.find(t => t.grade === 5).id);
  await page.evaluate(id => ELDICollection.startTopic(id, 17), topic);
  await page.locator('#sheet-check').click();
  await assertText(page, '#sheet-status', '0/1');
  const exercise = await page.evaluate(id => EduExercises.generate(id,17,'medium'), topic);
  for (let j=0; j<exercise.fields.length; j++) await page.locator(`#task-0-field-${j}`).fill(answerInput(exercise.fields[j]));
  await page.locator('[data-notes]').fill('Moj račun: provjera zapisanog postupka');
  await page.locator('#sheet-check').click();
  await assertText(page, '#sheet-status', '1/1');
  await page.locator('[data-page="home"]').click();
  await page.locator('[data-page="collection"]').click();
  await page.locator('#collection-resume').click();
  assert.equal(await page.locator('[data-notes]').inputValue(), 'Moj račun: provjera zapisanog postupka');
  assert.equal(await page.locator('#task-0-field-0').inputValue(), answerInput(exercise.fields[0]));
  await page.locator('#collection-back').click();
  await page.locator('#collection-mixed').click();
  await page.locator('#sheet-create').click();
  const refs = await page.evaluate(() => state().mathWork.session);
  assert.equal(refs.length,10);
  assert.equal(await page.locator('.solving-task').count(),10);
  assert.ok(new Set(refs.map(ref => ref.topicId)).size > 1, 'Mixed worksheet uses only one topic.');
  const sheetTasks = await page.evaluate(refs => refs.map(ref => EduExercises.generate(ref.topicId,ref.seed,ref.difficulty)), refs);
  for (let i=0; i<sheetTasks.length; i++) for (let j=0; j<sheetTasks[i].fields.length; j++) await page.locator(`#task-${i}-field-${j}`).fill(answerInput(sheetTasks[i].fields[j]));
  await page.locator('#sheet-check').click();
  await assertText(page, '#sheet-status', '10/10');
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
  const challenge = await page.evaluate(() => ELDI_BLOCK_CHALLENGES.find(c => c.check.type === 'output'));
  assert.ok(challenge,'No executable Blockly challenge.');
  await page.locator('#block-challenge').selectOption(challenge.id);
  await page.locator('#challenge-solution').click();
  assert.equal(await page.locator('#blockinput').inputValue(), challenge.input || '');
  await page.locator('#blockspeed').selectOption('0');
  await page.locator('#brun').click();
  await page.waitForFunction(id => state().blockResults?.[id]?.lastCorrect, challenge.id, { timeout:15000 });
  await assertText(page,'#blockcheck','TAČNO');
  assert.doesNotMatch(await page.locator('#blockout').innerText(), /Greška|unsafe-eval/);
  await page.locator('#challenge-free').click();
  await page.locator('#square').click();
  await assertText(page,'#blockcode','move(80)');
  await page.locator('#brun').click();
  await page.waitForFunction(() => !ELDIBlocks.getState().running, undefined, {timeout:15000});
  assert.doesNotMatch(await page.locator('#blockout').innerText(), /Greška|unsafe-eval/);
  await page.locator('#blocklang').selectOption('py');
  await assertText(page,'#blockcode','import turtle');
  await page.locator('#count').click();
  await page.locator('#blocklang').selectOption('js');
  await page.locator('#brun').click();
  await page.waitForFunction(() => !ELDIBlocks.getState().running, undefined, {timeout:15000});
  await assertText(page,'#blockout','Učim!');
  await page.locator('#blocklang').selectOption('py');
  assert.doesNotMatch(await page.locator('#blockcode').innerText(), /import turtle/);
  await assertText(page,'#blockcode','print(');
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
      await page.waitForFunction(() => document.querySelector('#output').innerText.includes('Program završen.'), undefined, { timeout:30000 });
      await assertText(page, '#output', '2000000000');
    }
  }
  await page.locator('[data-page="progress"]').click();
  await assertText(page, '#view', '100%');
  await page.locator('[data-page="about"]').click();
  for (const author of ['Dino Isanović','Elvir Čajić','Damir Bajrić','Jasmin Suljkanović']) await assertText(page, '#view', author);
  assert.deepEqual(errors, [], 'Renderer produced unhandled errors.');
  console.log(`UI smoke passed: lessons, quiz, collection answer checks, notes/resume, mixed worksheet, exact mathematics, geometry, Blockly challenge, ${tasksCount-1} programming tasks, progress and authors.`);
}
function answerInput(field) { return Array.isArray(field.answer) ? field.answer.length ? field.answer.join('; ') : 'nema' : String(field.answer); }
async function assertText(page, selector, text) { assert.ok((await page.locator(selector).innerText()).includes(text), `${selector} missing ${text}`); }
main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; }).finally(async () => { await browser?.close(); await new Promise(resolve => server ? server.close(resolve) : resolve()); });
