'use strict';
// Real Chromium interactions with the desktop renderer; output is review evidence, not fixtures.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
let playwright;try{playwright=require('playwright');}catch{playwright=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||'','playwright'));}
const {chromium}=playwright;
const root=path.resolve(__dirname,'..'),out=path.join(root,'smoke-previews/workspace');
let server,browser;
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,bytes)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(bytes);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,...(process.env.ELDI_CHROMIUM_PATH?{executablePath:process.env.ELDI_CHROMIUM_PATH}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/renderer/index.html`);
 await page.waitForFunction(()=>window.__eldiReady);assert.deepEqual(errors,[]);
 assert.equal(await page.locator('.ws-subject').count(),3);assert.match(await page.locator('.ws-empty').first().innerText(),/Ovdje počinje/);
 await page.screenshot({path:path.join(out,'01-pregled-1366.png'),fullPage:true,animations:'disabled'});
 // Every existing destination remains reachable through the grouped menu.
 const navIds=await page.locator('nav [data-page]').evaluateAll(nodes=>nodes.map(n=>n.dataset.page));assert.equal(new Set(navIds).size,20);
 await page.locator('[data-nav-group=math] summary').click();await page.locator('[data-page=notebook]').click();
 await page.locator('#mn-line-0').fill('2 + 2');await page.locator('#mn-notes').fill('Sačuvani postupak prije promjene izgleda.');
 const notebookBefore=await page.evaluate(()=>JSON.stringify(state().mathNotebook));
 await page.locator('#workspace-focus').click();assert.equal(await page.locator('body>aside').isVisible(),false);assert.equal(await page.locator('#mn-line-0').inputValue(),'2 + 2');assert.equal(await page.evaluate(()=>JSON.stringify(state().mathNotebook)),notebookBefore);
 await page.keyboard.press('F9');assert.equal(await page.locator('body>aside').isVisible(),true);
 await page.locator('[data-nav-group=code] summary').click();await page.locator('[data-page=code]').click();
 const cm=page.locator('.cm-content');await cm.fill('print("Čajić — test")\n');assert.equal(await page.locator('#editor').inputValue(),'print("Čajić — test")\n');
 await page.waitForFunction(()=>document.getElementById('workspace-save').dataset.status==='saved');
 assert.equal(await page.evaluate(()=>state().drafts.python),'print("Čajić — test")\n');
 // Language documents have independent histories, including intentionally empty drafts.
 await page.locator('#lang').selectOption('cpp');assert.match(await cm.innerText(),/include/);await page.keyboard.press('Control+z');assert.match(await cm.innerText(),/include/);
 await page.locator('#lang').selectOption('python');assert.match(await cm.innerText(),/Čajić/);await cm.fill('');await page.locator('#lang').selectOption('java');await page.locator('#lang').selectOption('python');assert.equal(await page.locator('#editor').inputValue(),'');
 await cm.fill('for i in range(3):\n    print(i)\n');
 await cm.press('End');await cm.press('x');await cm.press('Control+z');assert(!await page.locator('#editor').inputValue().then(t=>t.endsWith('x')));
 await page.locator('[data-editor=find]').click();assert.equal(await page.locator('.cm-search').isVisible(),true);await page.locator('.cm-search input[name=search]').fill('print');assert.equal(await page.locator('.cm-search input[name=search]').inputValue(),'print');await page.keyboard.press('Escape');
 await page.locator('[data-editor=simple]').click();await page.locator('#editor').fill('print(42)\n');await page.locator('[data-editor=simple]').click();assert.match(await cm.innerText(),/print\(42\)/);
 // Native bridge setters still reach the enhanced view (imports, AI code and examples).
 await page.evaluate(()=>{$('editor').value='a, b = map(int, input().split())\nprint(a + b)\n';$('editor').dispatchEvent(new Event('input',{bubbles:true}));});assert.match(await cm.innerText(),/a \+ b/);
 await page.locator('#workspace-focus').click();await page.screenshot({path:path.join(out,'02-editor-fokus-1366.png'),fullPage:true,animations:'disabled'});await page.keyboard.press('Escape');
 await page.locator('#theme').click();await page.screenshot({path:path.join(out,'03-editor-svijetli-1366.png'),fullPage:true,animations:'disabled'});assert.equal(await page.locator('body:not(.dark) .cm-editor').count(),1);await page.locator('#theme').click();
 // Profile changes retain and isolate the original code and notebook.
 await page.locator('#new-profile').click();await page.locator('#profile-name').fill('Drugi profil · provjera');await page.locator('#profile-create').click();
 await page.waitForFunction(()=>state().name==='Drugi profil · provjera');await page.locator('.cm-content').fill('print("drugi profil")\n');
 await page.locator('#profile').selectOption('default');assert.match(await page.locator('.cm-content').innerText(),/a \+ b/);assert.equal(await page.evaluate(()=>state().mathNotebook.attempts[Object.keys(state().mathNotebook.attempts)[0]].notes),'Sačuvani postupak prije promjene izgleda.');
 // Program assessment documents also change independently; read-only prevents editing during execution.
 await page.locator('[data-page=assessment]').click();await page.locator('.cm-content').fill('print("zbir")\n');const firstTask=await page.evaluate(()=>ELDI_PROGRAM_ASSESSMENTS[0].id);
 const second=await page.locator('[data-pa-task]').nth(1).getAttribute('data-pa-task');await page.locator(`[data-pa-task="${second}"]`).click();await page.keyboard.press('Control+z');assert(!await page.locator('#pa-code').inputValue().then(t=>t.includes('zbir')));
 await page.locator(`[data-pa-task="${firstTask}"]`).click();assert.equal(await page.locator('#pa-code').inputValue(),'print("zbir")\n');
 await page.evaluate(()=>{$('pa-code').readOnly=true;});assert.equal(await page.locator('.cm-content').getAttribute('contenteditable'),'false');await page.evaluate(()=>{$('pa-code').readOnly=false;});
 await page.screenshot({path:path.join(out,'04-programerski-izazovi-1366.png'),fullPage:true,animations:'disabled'});
 // Fresh reload restores real data and rebuilds views with no duplicate editor instances.
 await page.evaluate(()=>ELDIStorage.flush());await page.reload();await page.waitForFunction(()=>window.__eldiReady);await page.locator('[data-nav-group=code] summary').click();await page.locator('[data-page=code]').click();assert.match(await page.locator('.cm-content').innerText(),/a \+ b/);assert.equal(await page.locator('.cm-editor').count(),1);
 // Run the current enhanced-editor document through the existing local runner.
 const runner=require('../desktop/runner.cjs').createRunner({allowSystem:true});
 if(!runner.runtimeStatus().python.available)throw Error('Python is required for the editor execution check.');
 await page.exposeFunction('__workspaceRun',request=>runner.runCode(request));
 await page.evaluate(()=>{window.eldiDesktop={runCode:request=>window.__workspaceRun(request),cancelRun:async()=>{}};});
 await page.locator('#input').fill('7 5');await page.locator('.cm-content').press('Control+Enter');
 await page.waitForFunction(()=>document.getElementById('output').textContent.includes('Program završen.'));assert.match(await page.locator('#output').innerText(),/^12/);
 // CSS viewport equivalents of a 1366px screen at 125% and 150%; verify no horizontal page overflow.
 const sizes=[{width:1366,height:768},{width:1093,height:614},{width:911,height:512}];
 for(const size of sizes){await page.setViewportSize(size);for(const destination of ['home','notebook','assessment','code','teacher']){
  await page.evaluate(destination=>go(destination),destination);
  const dimensions=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));assert(dimensions.scroll<=dimensions.width+2,`${destination} overflow at ${size.width}: ${JSON.stringify(dimensions)}`);
  assert(await page.locator('#workspace-focus').isVisible());
 }await page.evaluate(()=>go('home'));await page.screenshot({path:path.join(out,`05-pregled-${size.width}.png`),fullPage:true,animations:'disabled'});}
 await page.setViewportSize({width:1366,height:768});await page.evaluate(()=>go('home'));await page.locator('[data-ws-recent]').first().click();assert.match(await page.locator('body').getAttribute('data-page'),/notebook/);
 const lesson=await page.evaluate(()=>{const id=ELDILearningPlan.catalog[0].id;ELDILearningPlan.lessonWork(state(),id).updatedAt=new Date(Date.now()+1000).toISOString();return id;});
 await page.evaluate(()=>go('home'));await page.locator('#start').click();await page.waitForFunction(()=>document.body.dataset.page==='paths');assert.equal(await page.evaluate(()=>state().learningPathWork.lastLessonId),lesson);
 assert.deepEqual(errors,[]);assert.deepEqual(await page.evaluate(()=>window.__eldiErrors),[]);
 const result={passed:true,viewports:sizes,checks:['grouped navigation','focus preserves notebook','rich editor input and history','per-language empty drafts','search','simple editor fallback','native value bridge','theme','profile isolation','per-task history','read-only','reload persistence','Ctrl+Enter executes actual Python document','15 page/viewport overflow checks','recent notebook and unfinished lesson navigation'],screenshots:fs.readdirSync(out).filter(f=>f.endsWith('.png'))};fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.close();});
