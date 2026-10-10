'use strict';
module.exports.runStudio33Smoke=async({stage,capture})=>{
const result=await stage('Studio 33 isolated profile, blocks and 3D',`
 window.__studio33Original=store.active;
 $('new-profile').click();fill($('profile-name'),'Studio 33 — provjera');$('profile-create').click();await wait(100);await go('studio33');
 ensure(ELDIStudio33.debug().work.scene.length===1,'Početna scena nije otvorena.');
 fill($('s33-speed'),'20');$('s33-run').click();
 let until=Date.now()+10000;while(!$('s33-status').textContent.includes('Program završen')&&Date.now()<until)await wait(50);
 ensure(ELDIStudio33.debug().work.scene.find(o=>o.id==='valjak')?.h===10,'Blokovi nisu promijenili visinu valjka.');
 $('s33-check').click();ensure($('s33-status').textContent.includes('100/100'),'Vizuelni kriterij nije bodovan.');
 $('s33-cut').click();fill($('s33-tiltx'),'30');ensure($('s33-scene-info').textContent.includes('Površina presjeka'),'Kosi presjek nije izračunat.');
 $('s33-type').value='cube';$('s33-type').dispatchEvent(new Event('change'));$('s33-net').click();fill($('s33-unfold'),'100');
 ensure($('s33-scene-info').textContent.includes('šarki'),'Nedostaje animirana mreža.');
 const thumb=await ELDIStudio33.debug().thumbnail();ensure(thumb.startsWith('data:image/png'),'PNG izvoz scene nije uspio.');
 $('s33-save-project').click();await wait(200);ensure(ELDIStudio33.debug().work.projects.length===1,'Projekat nije sačuvan.');
 return {profileId:store.active};
`);await capture('33-studio-mreza');
await stage('Studio 33 Python scene bridge uses bundled runtime',`
 ELDIStudio33.debug().switch('scene');document.querySelector('[data-st-tab="python"]').click();
 $('s33-run').click();let until=Date.now()+18000;while(!$('s33-status').textContent.includes('Python je izvršen')&&Date.now()<until)await wait(100);
 ensure($('s33-status').textContent.includes('Python je izvršen'),'Python scena nije izvršena: '+$('s33-status').textContent);
 ensure(ELDIStudio33.debug().work.scene.find(o=>o.id==='valjak')?.h===10,'Python scena nije tačna.');
`);
await stage('Studio 33 robot, genuine SQLite and isolated web preview',`
 ELDIStudio33.debug().switch('robot');fill($('s33-speed'),'20');$('s33-run').click();let until=Date.now()+10000;
 while(!$('s33-status').textContent.includes('Program završen')&&Date.now()<until)await wait(50);
 ensure($('s33-robot-info').textContent.includes('Cilj dostignut'),'Robot nije stigao do cilja.');
 ELDIStudio33.debug().switch('sql');until=Date.now()+10000;while(!$('s33-sql-result').textContent.includes('Mali princ')&&Date.now()<until)await wait(100);
 ensure($('s33-sql-result').textContent.includes('Mali princ'),'Stvarna SQLite baza nije otvorena: '+$('s33-status').textContent);
 $('s33-sql-check').click();until=Date.now()+5000;while(!$('s33-status').textContent.includes('očekivane')&&Date.now()<until)await wait(100);
 ensure($('s33-status').textContent.includes('očekivane'),'SQL kriterij nije provjeren.');
 ELDIStudio33.debug().switch('web');until=Date.now()+8000;while(!$('s33-web-console').textContent.includes('ready')&&Date.now()<until)await wait(100);
 ensure($('s33-web-console').textContent.includes('ready'),'Izolovani web pregled nije učitan.');
 ELDIStudio33.debug().work.web.js='document.getElementById("odgovor").textContent="Windows provjera"; console.log("ELDI WEB PASS");';$('s33-web-run').click();until=Date.now()+6000;
 while(!$('s33-web-console').textContent.includes('ELDI WEB PASS')&&Date.now()<until)await wait(100);
 ensure($('s33-web-console').textContent.includes('ELDI WEB PASS'),'JavaScript u web radionici nije izvršen.');
`);await capture('34-studio-web');
await stage('Studio 33 programming tests, contest, report and portable work',`
 ELDIStudio33.debug().switch('debug');fill($('s33-debug-code'),'var a=read33(),b=read33();print33(a+b);');$('s33-debug-test').click();let until=Date.now()+8000;
 while(!$('s33-status').textContent.includes('4/4')&&Date.now()<until)await wait(50);ensure($('s33-status').textContent.includes('4/4'),'Programerske provjere nisu prošle.');
 for(const module of ['algorithms','logic','network','data','projects','reports']){ELDIStudio33.debug().switch(module);ensure($('s33-body').textContent.length>100,'Prazna radionica: '+module);}
 ELDIStudio33.debug().switch('contest');$('s33-contest-start').click();$('s33-contest-finish').click();ensure($('s33-contest-result').textContent.includes('Rezultat'),'Provjera nema rezultat.');
 const p=ELDIProfiles.importProfile(ELDIProfiles.exportProfile(state()));ensure(p.studio33Work.reports.length>=4,'Izvještaji nisu u prenosivom profilu.');ensure(p.studio33Work.projects.length===1,'Projekat nije u profilu.');ensure(p.studio33Work.database.length>0,'Baza nije sačuvana.');
 for(const module of ['start','lessons','practice','arena','help']){ELDIStudio33.debug().switch(module);ensure($('s33-body').textContent.length>100,'Prazan novi modul: '+module);}
 ELDIStudio33.debug().switch('lessons');const newWork=ELDIStudio33.debug().work.extra.edition3333;const newQuestion=ELDI3333.task(newWork.lesson,newWork.level,newWork.seed);fill($('e33-answer'),String(newQuestion.answer));$('e33-answer-form').dispatchEvent(new Event('submit',{cancelable:true}));ensure($('e33-feedback').textContent.startsWith('Tačno'),'Nova nastavna provjera nije bodovana.');
 ELDIStudio33.debug().switch('arena');$('e33-round-start').click();ensure(document.querySelectorAll('[data-round-answer]').length===10,'Takmičarski krug nema deset zadataka.');$('e33-round-finish').click();ensure($('s33-body').textContent.includes('tačnih'),'Nema rezultata izazova.');
 ELDIStudio33.debug().switch('scene');$('s33-type').value='cube';$('s33-type').dispatchEvent(new Event('change'));fill($('s33-prop-a'),'2');ensure($('e33-measures').textContent.includes('8 j³'),'Zapremina kocke nije tačna.');
 const exported=ELDIStudio33Engine.project(state().studio33Work);ensure(exported.database&&exported.workspace,'Projektni paket nema bazu i blokove.');
 await ELDIStorage.flush();$('profile').value=window.__studio33Original;await $('profile').onchange();await ELDIStorage.flush();delete window.__studio33Original;
`);return result;
};
