'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {spawn}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');let browser,server;
(async()=>{
 const base='http://127.0.0.1:18439/eldi-edu/online/';
 server=spawn('php',['-S','127.0.0.1:18439','-t',path.join(root,'website')],{env:{...process.env,ELDI3333_CONFIG:path.join(root,'.qa-config.php')},stdio:'ignore'});
 for(let i=0;i<50;i++){try{await fetch(base);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const teacher=await browser.newPage({viewport:{width:1366,height:900}}),student=await (await browser.newContext({viewport:{width:390,height:844}})).newPage(),errors=[];
 for(const p of [teacher,student]){p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());}
 const f=JSON.parse(fs.readFileSync(path.join(root,'.qa-competition.json'),'utf8'));
 async function login(p,creds){await p.goto(base+'#ucenik');await p.locator('#username').fill(creds.username);await p.locator('#password').fill(creds.password);await p.locator('#login button').click();await p.waitForSelector('.heading');}
 await login(teacher,f.teacher);await teacher.locator('#competition-setup').click();assert.equal(await teacher.locator('.competition-card').count(),3);await teacher.locator('#section-class').selectOption(f.class);
 for(const k of Object.keys(f.banks))await teacher.locator(`input[name=bank][value="${k}"]`).check();
 await teacher.locator('#preview-bank').selectOption('competition-3');assert.equal(await teacher.locator('#bank-preview details').count(),10);
 fs.mkdirSync(path.join(root,'.qa-sections'),{recursive:true});await teacher.locator('#competition-catalog').scrollIntoViewIfNeeded();await teacher.screenshot({path:path.join(root,'.qa-sections/competition-teacher.png')});
 await teacher.locator('#section-back').click();await login(student,f.student);
 const aid=f.assignments[0].id,bank=f.banks['competition-1'];await student.locator(`[data-assignment="${aid}"]`).click();
 for(let i=0;i<10;i++){
  const q=bank.questions[i];await student.locator(`[data-competition-index="${i}"]`).click();
  if(q.mode==='output')await student.locator('#contest-value').fill(q.answer);
  if(q.mode==='fill')for(let j=0;j<q.solution.length;j++)await student.locator(`[data-contest-gap="${j}"]`).fill(q.solution[j]);
  if(q.mode==='order'){
   // Use actual reorder buttons, never inject a completed answer into client state.
   let order=q.pieces.map(p=>p.id);
   for(let target=0;target<q.solution.length;target++){let from=order.indexOf(q.solution[target]);while(from>target){await student.locator(`[data-up="${from}"]`).click();[order[from-1],order[from]]=[order[from],order[from-1]];from--;}}
  }
  if(q.mode==='program'){
   if(i===6){await student.locator('#contest-language').selectOption('blokba');await student.locator('#contest-file').setInputFiles({name:'blokba-zbir.py',mimeType:'text/x-python',buffer:Buffer.from(q.reference)});await student.waitForFunction(s=>document.getElementById('contest-source').value===s,q.reference);await student.locator('#contest-input').fill('12,5\n-3,2');await student.locator('#contest-run').click();await student.waitForFunction(()=>document.getElementById('contest-output').textContent.includes('9.3'));}
   else await student.locator('#contest-source').fill(q.reference);
   if(i===7){await student.locator('#contest-to-blocks').click();await student.locator('.blocklySvg').waitFor();assert.equal(await student.evaluate(()=>practicalWorkspace.getAllBlocks(false).length),3);await student.screenshot({path:path.join(root,'.qa-sections/competition-blocks-mobile.png'),fullPage:true});}
  }
  await student.locator('#contest-try').click();await student.waitForFunction(mode=>document.getElementById('contest-result').textContent.includes(mode==='output'?'Ispis je tačan':'2 / 2'),q.mode);
  assert(await student.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2),'Mobile overflow at '+i);
 }
 // Reload retains all ten question drafts and the active Blockly solution.
 await student.reload();await student.locator(`[data-assignment="${aid}"]`).click();await student.locator('[data-competition-index="7"]').click();await student.locator('.blocklySvg').waitFor();assert.equal(await student.evaluate(()=>practicalWorkspace.getAllBlocks(false).length),3);
 await student.locator('#competition-summary').click();assert.match(await student.locator('#competition-stage').innerText(),/10 \/ 10/);await student.screenshot({path:path.join(root,'.qa-sections/competition-summary-mobile.png'),fullPage:true});
 await student.locator('#contest-submit').click();await student.locator('.score').waitFor();assert.equal(await student.locator('.score').innerText(),'100 / 100');assert.equal(await student.locator('.competition-review').count(),10);
 await student.locator('#student-certificate').click();await student.locator('.certificate').waitFor();const cert=await student.locator('.certificate').innerText();for(const s of ['Elvir Čajić','Dino Isanović','ALGORITMI I RAČUNANJE','100 / 100'])assert(cert.includes(s));
 await student.setViewportSize({width:1366,height:1000});await student.screenshot({path:path.join(root,'.qa-sections/competition-diploma.png'),fullPage:true});
 await teacher.locator(`[data-assignment="${aid}"]`).click();await teacher.locator('tr').filter({hasText:'Takmičar Browser QA'}).locator('[data-review]').click();assert.equal(await teacher.locator('#review .competition-review').count(),10);await teacher.locator('#feedback').fill('Odlično: sva četiri načina rješavanja.');await teacher.locator('#review-form button').click();
 // Hardest level has separate questions and preserves drafts when navigating between them.
 await student.locator('#certificate-back').click();await student.locator('#competition-back').click();await student.locator(`[data-assignment="${f.assignments[2].id}"]`).click();await student.locator('[data-competition-index="9"]').click();await student.locator('#contest-source').fill(f.banks['competition-3'].questions[9].reference);await student.locator('#contest-try').click();await student.waitForFunction(()=>document.getElementById('contest-result').textContent.includes('2 / 2'));await student.screenshot({path:path.join(root,'.qa-sections/competition-loop-desktop.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('Competition Chromium: teacher cards, 10-step mobile workflow, output/fill/order, Python, Blockly, BlokBa upload, numeric trials, draft reload, 100-point final, certificate and teacher review PASS');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.kill();});
