'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {spawn}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');let browser,server;
(async()=>{
 const base='http://127.0.0.1:18435/eldi-edu/online/';
 server=spawn('php',['-S','127.0.0.1:18435','-t',path.join(root,'website')],{env:{...process.env,ELDI3333_CONFIG:path.join(root,'.qa-config.php')},stdio:'ignore'});
 for(let i=0;i<50;i++){try{await fetch(base);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const teacher=await browser.newPage({viewport:{width:1366,height:900}}),student=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 for(const page of [teacher,student])page.on('pageerror',e=>errors.push(e.message));
 const fixture=JSON.parse(fs.readFileSync(path.join(root,'.qa-online.json'),'utf8'));
 await teacher.goto(base+'#nastavnik');await teacher.locator('#username').fill(fixture.teacher.username);await teacher.locator('#password').fill(fixture.teacher.password);await teacher.locator('#login button').click();
 await teacher.locator('#class-title').fill('Sekcija web provjera');await teacher.locator('#class-form button').click();await teacher.getByRole('button',{name:'Sekcija web provjera',exact:true}).click();
 await teacher.locator('#toggle-invite').click();const invite=await teacher.locator('#invite-link').inputValue();
 await teacher.locator('#roster-tests').click();await teacher.locator('input[name=bank][value=python]').check();await teacher.locator('input[name=bank][value=blocks]').check();
 const date=new Date(Date.now()+86400000*2).toISOString().slice(0,10);await teacher.locator('#section-date').fill(date);await teacher.locator('#section-form > button.primary').click();
 await teacher.getByRole('button',{name:'Sekcija web provjera',exact:true}).click();
 await student.goto(invite);await student.locator('#join-name').fill('Učenik web registracija');await student.locator('#join-school').selectOption({index:1});await student.locator('#join-username').fill('web.registracija.qa');await student.locator('#join-password').fill('Web-registration-QA-2026');await student.locator('#join-confirm').fill('Web-registration-QA-2026');
 await student.locator('#registration-form button').click();await student.waitForSelector('#login');await student.locator('#password').fill('Web-registration-QA-2026');await student.locator('#login button').click();await student.waitForSelector('#student-refresh');assert.match(await student.locator('#app').innerText(),/čeka se nastavnikovo odobrenje/);assert.equal(await student.locator('[data-assignment]').count(),0);
 await teacher.locator('#refresh-requests').click();await teacher.locator('[data-approve]').click();
 await student.locator('#student-refresh').click();await student.waitForSelector('[data-assignment]');assert.equal(await student.locator('[data-assignment]').count(),2);
 await student.locator('article').filter({hasText:'Python · 20 programskih izazova'}).locator('[data-assignment]').click();
 await student.waitForSelector('#step-progress');assert.equal(await student.locator('.question:visible').count(),1);assert.match(await student.locator('.program-code').first().innerText(),/print\(a \+ b\)/);
 const answers=[12,11,3,2,20,5,10,20,9,4,2,16,9,6,8,14,24,8,18,10];
 for(let i=0;i<20;i++){await student.locator('[data-answer="'+i+'"]').fill(String(answers[i]));if(i<19)await student.locator('#next-question').click();}
 student.on('dialog',d=>d.accept());await student.locator('#submit-form button.primary').click();await student.waitForSelector('#student-certificate');assert.match(await student.locator('.score').innerText(),/100 \/ 100/);await student.locator('#student-certificate').click();await student.waitForSelector('.certificate');assert.match(await student.locator('.certificate').innerText(),/Ocjena aktivnosti: 5/);assert.match(await student.locator('.certificate').innerText(),/Dino Isanović/);assert.match(await student.locator('.certificate').innerText(),/Elvir Čajić/);
 for(const width of [390,1366]){await student.setViewportSize({width,height:900});assert(await student.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2));}
 fs.mkdirSync(path.join(root,'.qa-sections'),{recursive:true});await student.screenshot({path:path.join(root,'.qa-sections/diploma.png'),fullPage:true});const pdf=await student.pdf({path:path.join(root,'.qa-sections/diploma.pdf'),preferCSSPageSize:true,printBackground:true});assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,1,'Diploma must fit on one printed A4 page');
 await student.locator('#certificate-back').click();await student.locator('#back').click();await student.locator('article').filter({hasText:'Blokovi · 20 algoritamskih izazova'}).locator('[data-assignment]').click();await student.waitForSelector('.logic-block');await student.screenshot({path:path.join(root,'.qa-sections/blocks.png'),fullPage:true});
 await teacher.locator('#demo-student').click();await teacher.waitForSelector('#student-refresh');assert.match(await teacher.locator('h1').innerText(),/Elvir Čajić/);assert(await teacher.locator('#return-teacher').isVisible());await teacher.locator('#return-teacher').click();await teacher.waitForSelector('#class-form');assert.equal(await teacher.locator('#return-teacher:visible').count(),0);
 assert.deepEqual(errors,[]);console.log('Browser: registration, pending access, approval, 20-step Python test, server grade, certificate, blocks, preview/return, responsive layout: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.kill();});
