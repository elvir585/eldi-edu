'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {spawn}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');let browser,server;
(async()=>{
 const base='http://127.0.0.1:18438/eldi-edu/online/';
 server=spawn('php',['-S','127.0.0.1:18438','-t',path.join(root,'website')],{env:{...process.env,ELDI3333_CONFIG:path.join(root,'.qa-config.php')},stdio:'ignore'});
 for(let i=0;i<50;i++){try{await fetch(base);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const f=JSON.parse(fs.readFileSync(path.join(root,'.qa-online.json'),'utf8'));
 await page.goto(base+'#nastavnik');await page.locator('#username').fill(f.teacher.username);await page.locator('#password').fill(f.teacher.password);await page.locator('#login button').click();
 const title='Brisanje odjeljenja web QA',task='Zadatak brisanje web QA';
 await page.locator('#class-title').fill(title);await page.locator('#class-form button').click();await page.getByRole('button',{name:title,exact:true}).waitFor();
 await page.locator('#new-assignment').click();await page.locator('#class-select').selectOption({label:title});await page.locator('#assignment-title').fill(task);await page.locator('#instructions').fill('Probni projektni zadatak');await page.locator('#assignment-form > button.primary').click();
 const card=()=>page.locator('article.panel').filter({has:page.getByRole('heading',{name:task,exact:true})});
 await card().locator('[data-delete-assignment]').click();await page.locator('#deletion-dialog').waitFor();assert.match(await page.locator('#deletion-dialog').innerText(),/Predaje učenika: 0/);await page.locator('#deletion-cancel').click();assert(await card().isVisible());
 await card().locator('[data-assignment]').click();await page.locator('#delete-assignment').click();await page.locator('#deletion-confirm').click();await page.locator('#class-form').waitFor();assert.equal(await card().count(),0);
 await page.locator('#open-trash').click();await page.locator('[data-restore-kind="assignment"]').click();await page.waitForFunction(()=>document.getElementById('message').textContent.includes('Stavka je vraćena'));await page.locator('#trash-back').click();await card().waitFor();
 await page.getByRole('button',{name:title,exact:true}).click();await page.locator('#delete-class').click();await page.locator('#deletion-dialog').waitFor();assert.match(await page.locator('#deletion-dialog').innerText(),/Povezani zadaci: 1/);
 fs.mkdirSync(path.join(root,'.qa-sections'),{recursive:true});
 for(const width of [1366,390]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2));const rect=await page.locator('#deletion-dialog').boundingBox();assert(rect.x>=0&&rect.x+rect.width<=width+1);await page.screenshot({path:path.join(root,'.qa-sections/cleanup-confirm-'+width+'.png')});}
 await page.locator('#deletion-confirm').click();await page.locator('#class-form').waitFor();assert.equal(await page.getByRole('button',{name:title,exact:true}).count(),0);assert.equal(await card().count(),0);
 await page.locator('#open-trash').click();await page.locator('[data-restore-kind="class"]').click();await page.waitForFunction(()=>document.getElementById('message').textContent.includes('Stavka je vraćena'));await page.locator('#trash-back').click();await page.getByRole('button',{name:title,exact:true}).waitFor();await card().waitFor();
 await page.getByRole('button',{name:'Obriši odjeljenje '+title,exact:true}).click();await page.locator('#deletion-cancel').click();
 await page.locator('#logout').click();await page.locator('#username').fill(f.student.username);await page.locator('#password').fill(f.student.password);await page.locator('#login button').click();await page.locator('#student-refresh').waitFor();assert.equal(await page.locator('#open-trash,[data-delete-class],[data-delete-assignment]').count(),0);
 assert.deepEqual(errors,[]);console.log('Cleanup browser: cancel, delete from card/detail, counts, class deletion, task/class restore, student controls hidden and mobile confirmation: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.kill();});
