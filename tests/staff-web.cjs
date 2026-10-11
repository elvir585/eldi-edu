'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {spawn}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');let browser,server;
(async()=>{
 const base='http://127.0.0.1:18437/eldi-edu/online/';
 server=spawn('php',['-S','127.0.0.1:18437','-t',path.join(root,'website')],{env:{...process.env,ELDI3333_CONFIG:path.join(root,'.qa-config.php')},stdio:'ignore'});
 for(let i=0;i<50;i++){try{await fetch(base);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const owner=await browser.newPage({viewport:{width:1366,height:900}}),colleague=await browser.newPage(),errors=[];
 for(const p of [owner,colleague])p.on('pageerror',e=>errors.push(e.message));
 const fixture=JSON.parse(fs.readFileSync(path.join(root,'.qa-online.json'),'utf8'));
 const login=async(page,username,password)=>{await page.goto(base+'#nastavnik');await page.locator('#username').fill(username);await page.locator('#password').fill(password);await page.locator('#login button').click();await page.waitForSelector('#class-form');};
 await login(owner,fixture.teacher.username,fixture.teacher.password);
 await owner.locator('#manage-staff').click();await owner.waitForSelector('#staff-create');
 await owner.locator('#staff-name').fill('Novi nastavnik web QA');await owner.locator('#staff-username').fill('teacher.web.qa');await owner.locator('#staff-password').fill('Teacher-Web-QA-2026');await owner.locator('#staff-confirm').fill('Different-Web-QA-2026');
 await owner.locator('#staff-create button').click();await owner.waitForFunction(()=>document.getElementById('message').textContent.includes('ne podudaraju'));
 await owner.locator('#staff-confirm').fill('Teacher-Web-QA-2026');await owner.locator('#staff-create button').click();await owner.waitForFunction(()=>document.getElementById('message').textContent.includes('je kreiran'));
 assert.equal(await owner.locator('#staff-password').inputValue(),'');
 await login(colleague,'teacher.web.qa','Teacher-Web-QA-2026');assert.equal(await colleague.locator('#manage-staff').count(),0);assert.equal(await colleague.locator('[data-class]').count(),0);
 await colleague.locator('#class-title').fill('Moje odjeljenje web QA');await colleague.locator('#class-form button').click();await colleague.getByRole('button',{name:'Moje odjeljenje web QA',exact:true}).waitFor();
 owner.on('dialog',d=>d.accept());
 let row=owner.locator('.staff-card').filter({hasText:'teacher.web.qa'});await row.locator('[data-staff-role]').click();await owner.waitForFunction(()=>document.getElementById('message').textContent.includes('je sačuvana'));
 await colleague.reload();await colleague.locator('#manage-staff').click();await colleague.waitForSelector('#staff-create');
 await colleague.locator('#staff-name').fill('Administrator web QA');await colleague.locator('#staff-username').fill('admin.web.qa');await colleague.locator('#staff-password').fill('Admin-Web-QA-2026');await colleague.locator('#staff-confirm').fill('Admin-Web-QA-2026');await colleague.locator('#staff-role').selectOption('admin');await colleague.locator('#staff-create button').click();await colleague.waitForFunction(()=>document.getElementById('message').textContent.includes('je kreiran'));
 await owner.locator('#staff-back').click();await owner.locator('#manage-staff').click();
 row=owner.locator('.staff-card').filter({hasText:'teacher.web.qa'});await row.locator('[data-staff-role]').click();await owner.waitForFunction(()=>document.getElementById('message').textContent.includes('je sačuvana'));
 await colleague.reload();await colleague.waitForSelector('#class-form');assert.equal(await colleague.locator('#manage-staff').count(),0);assert(await colleague.getByRole('button',{name:'Moje odjeljenje web QA',exact:true}).isVisible());
 row=owner.locator('.staff-card').filter({hasText:'teacher.web.qa'});await row.locator('[data-staff-reset]').click();await owner.locator('#staff-reset-password').fill('Reset-Teacher-Web-QA-2026');await owner.locator('#staff-reset-confirm').fill('Reset-Teacher-Web-QA-2026');await owner.locator('#staff-reset-form button').click();await owner.waitForFunction(()=>document.getElementById('message').textContent.includes('Nova lozinka je sačuvana'));
 await colleague.reload();await colleague.waitForSelector('#login');await login(colleague,'teacher.web.qa','Reset-Teacher-Web-QA-2026');
 assert(await colleague.getByRole('button',{name:'Moje odjeljenje web QA',exact:true}).isVisible());
 fs.mkdirSync(path.join(root,'.qa-sections'),{recursive:true});
 for(const width of [1366,390]){await owner.setViewportSize({width,height:900});assert(await owner.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2));await owner.screenshot({path:path.join(root,'.qa-sections/staff-'+width+'.png'),fullPage:true});}
 assert.deepEqual(errors,[]);console.log('Staff browser: add teacher/admin, password confirmation, immediate permissions, separate classes, reset and re-login, mobile layout: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.kill();});
