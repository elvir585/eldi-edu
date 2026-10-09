'use strict';
async function runLabSmoke({stage,capture}){
 const profileId=await stage('edition 12 isolated learner profile',`
  window.__labOriginalProfile=store.active;
  $('new-profile').click();fill($('profile-name'),'Laboratorij — provjera 12.0');$('profile-create').click();
  ensure(store.active!==window.__labOriginalProfile,'Nije kreiran zaseban probni profil.');return store.active;
 `);
 await stage('edition 12 function graphs and dynamic constructions',`
  go('laboratory');document.querySelector('[data-lab-mode="functions"]').click();await wait(150);
  await wait(1200);ensure($('lab-board').clientHeight>400,'Grafička ploča se smanjuje pri automatskoj promjeni veličine.');
  const graph=$('lab-board').querySelector('path[stroke="#28b9aa"]');ensure(graph?.getAttribute('d').length>100,'Graf funkcije nije nacrtan.');
  fill($('lab-param-a'),'2');ensure(state().labWork.params.a===2,'Parametar nije sačuvan.');
  ensure($('lab-values').querySelectorAll('tbody tr').length===5,'Nema tabele vrijednosti.');
  const originalURL=URL.createObjectURL,originalClick=HTMLAnchorElement.prototype.click,blobs=[];
  URL.createObjectURL=blob=>{blobs.push(blob);return originalURL.call(URL,blob);};HTMLAnchorElement.prototype.click=function(){};
  try{await $('lab-svg').onclick();await $('lab-png').onclick();const png=blobs.find(b=>b?.type==='image/png');ensure(png&&png.size>1000,'PNG nije izvezen: '+$('lab-status').textContent);const svg=blobs.find(b=>b?.type==='image/svg+xml');ensure(svg&&!new DOMParser().parseFromString(await svg.text(),'image/svg+xml').querySelector('parsererror'),'SVG nije ispravan XML.');}
  finally{URL.createObjectURL=originalURL;HTMLAnchorElement.prototype.click=originalClick;}

  document.querySelector('[data-lab-mode="triangle"]').click();const field=document.querySelector('[data-point="2"][data-axis="1"]');field.value='4';field.dispatchEvent(new Event('change'));
  ensure(state().labWork.triangle[2][1]===4,'Konstrukcija nije pratila pomjeranje vrha.');
  for(const box of document.querySelectorAll('[data-construction]')){box.checked=true;box.dispatchEvent(new Event('change'));}
  ensure($('lab-triangle-values').textContent.includes('Površina'),'Mjerenja trougla nedostaju.');
 `);await capture('19-lab-triangle');
 await stage('edition 12 seven solids nets and dihedral',`
  document.querySelector('[data-lab-mode="solid"]').click();
  for(const type of ['cube','cuboid','prism','pyramid','cylinder','cone','sphere']){
   $('lab-solid-type').value=type;$('lab-solid-type').dispatchEvent(new Event('change'));await wait(20);
   ensure($('lab-three').querySelectorAll('path').length>0,'Tijelo nije nacrtano: '+type);ensure(!$('lab-solid-values').textContent.includes('NaN'),'Neispravno mjerenje: '+type);
  }
  ensure($('lab-net-help').textContent.includes('nema tačnu ravnu mrežu'),'Lopta ne smije imati lažnu ravnu mrežu.');
  $('lab-solid-type').value='cone';$('lab-solid-type').dispatchEvent(new Event('change'));fill($('lab-cut'),'50');ensure(state().labWork.solid.cut===.5,'Presjek nije sačuvan.');
  document.querySelector('[data-lab-mode="dihedral"]').click();fill($('lab-dihedral-angle'),'110');ensure($('lab-dihedral-result').textContent.includes('110'),'Ugao nije ažuriran.');
  $('lab-notes').value='Normalni presjek';$('lab-notes').dispatchEvent(new Event('input'));$('lab-name').value='Diedar 110';$('lab-save').click();
  document.querySelector('[data-lab-mode="history"]').click();document.querySelector('[data-lab-open]').click();ensure(state().labWork.solid.angle===110,'Verzija nije vraćena.');
  const exported=ELDIProfiles.exportProfile(state());ensure(exported.profile.labWork.saved.length>0,'Profil ne čuva laboratorij.');
 `);await capture('20-lab-dihedral');
 await stage('edition 12 actual block debugger and project versions',`
  go('blocks');$('square').click();const workspace=ELDIBlocks.getWorkspace(),block=workspace.getTopBlocks(false)[0];block.select();await wait(50);
  $('bp-details').open=true;$('bp-pack').click();ensure(state().studioWork.backpack.length===1,'Grupa nije sačuvana.');
  const count=workspace.getAllBlocks(false).length;$('bp-backpack').value='0';$('bp-append').click();await wait(50);ensure(workspace.getAllBlocks(false).length===2*count,'Ruksak nije dodao grupu.');
  $('bp-undo').click();ensure(workspace.getAllBlocks(false).length===count,'Poništavanje grupe nije uspjelo.');
  $('bp-snapshot').click();ensure(state().studioWork.versions.length===1,'Verzija nije sačuvana.');
  ELDIBlocks.clear();$('bp-versions').value='0';$('bp-restore').click();ensure(workspace.getAllBlocks(false).length===count,'Verzija nije vraćena.');
  window.__labBlockRun=ELDIBlocks.run({debug:true,paused:true});for(let i=0;i<100&&!$('bp-status').textContent.includes('Zaustavljeno prije');i++)await wait(20);
  ensure(ELDIBlocks.getState().paused&&$('bp-status').textContent.includes('Zaustavljeno prije'),'Debugger nije zaustavio interpreter.');
  ELDIBlocks.step();await wait(80);ensure(ELDIBlocks.getState().paused,'Korak nije stao na narednom bloku.');
  ELDIBlocks.resume();const result=await window.__labBlockRun;ensure(result.ok&&result.stage.trailCount===4,'Izvršavanje nakon koraka nije nacrtalo kvadrat.');delete window.__labBlockRun;
 `);
 await stage('edition 12 teacher tests scores and report persistence',`
  ELDIBlocks.load({format:'ELDI-BLOCKS-1',workspace:{blocks:{languageVersion:0,blocks:[{type:'edu_print',inputs:{TEXT:{block:{type:'text',fields:{TEXT:'zdravo'}}}}}]}}});
  $('bp-teacher').click();fill($('bp-title'),'Nastavnički test');fill($('bp-statement'),'Ispiši pozdrav.');
  fill(document.querySelector('[data-output]'),'zdravo');$('bp-add-test').click();fill(document.querySelectorAll('[data-output]')[1],'drugi pozdrav');$('bp-save-challenge').click();
  ensure(state().studioWork.challenges.length===1,'Izazov nije sačuvan.');await ELDIBlocksPlus.allTests();
  const report=state().studioWork.reports[0];ensure(report.tests[0].passed&&!report.tests[1].passed,'Svi testovi moraju biti nezavisno provjereni.');ensure(report.tests.reduce((n,t)=>n+t.points,0)===10,'Djelimični bodovi nisu tačni.');
  fill($('bp-grade'),'3');fill($('bp-notes'),'Pregledano');$('bp-report-save').click();
  const valid=ELDIProfiles.exportProfile(state());ensure(valid.profile.studioWork.reports[0].manualGrade==='3','Nastavnička ocjena nije sačuvana.');
  $('bp-details').open=false;await ELDIStorage.flush();
 `);await capture('21-block-studio');
 await stage('edition 12 restore existing learner without changing their selected project',`
  await ELDIStorage.flush();$('profile').value=window.__labOriginalProfile;$('profile').dispatchEvent(new Event('change',{bubbles:true}));
  ensure(store.active===window.__labOriginalProfile,'Prethodni profil nije vraćen.');delete window.__labOriginalProfile;await ELDIStorage.flush();
 `);
 return{profileId,lab:true,debugger:true,backpack:true,versions:true,teacherTests:true};
}
module.exports={runLabSmoke};
