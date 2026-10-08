'use strict';
async function runScratchSmoke({stage,capture,evaluate,window}){
  const frame=()=>window.webContents.mainFrame.framesInSubtree.find(item=>item.url.includes('/vendor/scratch/index.html'));
  const inFrame=async code=>{const item=frame();if(!item)throw new Error('Scratch iframe nije pronađen.');return item.executeJavaScript('(async()=>{const ensure=(condition,message)=>{if(!condition)throw new Error(message);};const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));'+code+'})()');};
  await stage('official offline Scratch editor startup',`
    await go('scratch');const deadline=Date.now()+60000;while(!ELDIScratchStudio.ready()&&Date.now()<deadline)await wait(100);
    ensure(ELDIScratchStudio.ready(),'Službeni Scratch editor nije spreman: '+$('scratch-status').innerText);
    await ELDIScratchStudio.chooseExample('strelice');ensure(state().scratchWork?.exampleId==='strelice','Scratch primjer nije sačuvan u profilu.');
    const box=$('scratch-viewport').getBoundingClientRect();ensure(box.width>=600,'Scratch radni prostor je preuzak: '+box.width);ensure(box.top>=0&&box.bottom<=innerHeight+4,'Cijeli Scratch editor mora biti vidljiv: '+box.top+'–'+box.bottom+'/'+innerHeight);
  `);
  await inFrame(`
    ensure(window.ELDI_SCRATCH_READY,'Iframe nije javio spremnost.');const vm=window.ELDI_SCRATCH_VM;ensure(vm?.runtime?.renderer,'Nije pokrenut pravi Scratch VM sa renderom.');
    const sprite=vm.runtime.targets.find(target=>!target.isStage);ensure(sprite,'Nedostaje Scratch lik.');ensure(sprite.getCostumes().length===2,'Primjer nema dva kostima.');ensure(sprite.getCostumes().every(costume=>costume.asset?.data?.length>0),'Kostimi nemaju stvarne lokalne podatke.');ensure(sprite.getSounds()[0]?.asset?.data?.length>0,'Zvuk nema stvarne lokalne podatke.');
    vm.stopAll();vm.greenFlag();await wait(150);const x=sprite.x;vm.postIOData('keyboard',{key:'ArrowRight',keyCode:39,isDown:true});await wait(180);vm.postIOData('keyboard',{key:'ArrowRight',keyCode:39,isDown:false});ensure(sprite.x===x+10,'Scratch događaj tastature nije pomjerio lik: '+x+' → '+sprite.x);vm.stopAll();
    const exported=await vm.saveProjectSb3();ensure(exported instanceof Blob&&exported.size>1000,'Pravi VM nije izvezao .sb3 sa materijalima.');const bytes=new Uint8Array(await exported.arrayBuffer());ensure(bytes[0]===80&&bytes[1]===75,'.sb3 nije ZIP datoteka.');await vm.loadProject(bytes);vm.stopAll();const restored=vm.runtime.targets.find(target=>!target.isStage);ensure(restored.x===x+10,'Scratch .sb3 roundtrip je promijenio stanje lika.');ensure(restored.getSounds()[0]?.asset?.data?.length>0,'Zvuk nije sačuvan u .sb3 roundtripu.');
  `);
  await capture('18-scratch-studio');
  await stage('Scratch profile flush before navigation',`
    await ELDIScratchStudio.flush();await ELDIStorage.flush();window.__scratchSavedBase64=state().scratchWork.base64;ensure(window.__scratchSavedBase64.startsWith('UEsD'),'Profil nije sačuvao stvarni .sb3.');
    await go('notebook');await go('scratch');const deadline=Date.now()+60000;while((!ELDIScratchStudio.ready()||$('scratch-status').textContent.includes('Otvaranje'))&&Date.now()<deadline)await wait(100);ensure(ELDIScratchStudio.ready(),'Scratch nije ponovo otvoren.');await wait(200);ensure(state().scratchWork.exampleId==='strelice','Profil nije sačuvao odabrani Scratch primjer.');
  `);
  await inFrame(`
    const vm=window.ELDI_SCRATCH_VM;const deadline=Date.now()+10000;let sprite=vm.runtime.targets.find(target=>!target.isStage);while((!sprite||!Object.values(sprite.blocks._blocks).some(block=>block.opcode==='event_whenkeypressed'))&&Date.now()<deadline){await wait(100);sprite=vm.runtime.targets.find(target=>!target.isStage);}
    ensure(sprite&&Object.values(sprite.blocks._blocks).some(block=>block.opcode==='event_whenkeypressed'),'Sačuvani blokovi nisu vraćeni.');ensure(vm.runtime.threads.length===0,'Uvoz sačuvanog .sb3 ne smije automatski pokrenuti program.');
    vm.setEditingTarget(sprite.id);const tab=[...document.querySelectorAll('[role="tab"]')].find(item=>/kostim|costume/i.test(item.textContent));ensure(tab,'Nedostaje kartica kostima.');tab.click();await wait(700);
    ensure(window.ELDI_SCRATCH_EDITOR.store.getState().scratchGui.editorTab.activeTabIndex===1,'Službeni editor kostima nije otvoren.');const paintDeadline=Date.now()+8000;let canvas=document.querySelector('canvas[class*="paper-canvas"]');while(!canvas&&Date.now()<paintDeadline){await wait(100);canvas=document.querySelector('canvas[class*="paper-canvas"]');}ensure(canvas&&canvas.width>0&&canvas.height>0,'Službeni Paper editor nema aktivno platno.');ensure(canvas.getContext('2d'),'Platno za uređivanje kostima nema stvarni kontekst.');
  `);
  await capture('19-scratch-costumes');
  await inFrame(`
    const tab=[...document.querySelectorAll('[role="tab"]')].find(item=>/zvuk|sound/i.test(item.textContent));ensure(tab,'Nedostaje kartica zvukova.');tab.click();await wait(500);ensure(window.ELDI_SCRATCH_EDITOR.store.getState().scratchGui.editorTab.activeTabIndex===2,'Službeni editor zvukova nije otvoren.');ensure(document.querySelector('[class*="sound-editor"]'),'Službeni editor zvukova nije prikazan.');
  `);
  await capture('19b-scratch-sounds');
  await stage('Scratch solved learning example files',`
    await ELDIScratchStudio.chooseExample('klikovi');ensure(state().scratchWork.exampleId==='klikovi','Igra s bodovima nije učitana.');
  `);
  await inFrame(`
    const vm=window.ELDI_SCRATCH_VM;vm.greenFlag();await wait(150);const stage=vm.runtime.getTargetForStage(),sprite=vm.runtime.targets.find(target=>!target.isStage);ensure(stage.variables.bodovi.value===0,'Bodovi nisu vraćeni na nulu.');vm.runtime.startHats('event_whenthisspriteclicked',null,sprite);await wait(180);ensure(stage.variables.bodovi.value===1,'Klik na lik nije izvršio Scratch brojač.');vm.stopAll();
  `);
  await stage('Scratch current VM material for contextual assistant',`
    const context=await ELDIScratchStudio.getContext();ensure(context.kind==='scratch'&&context.language==='Scratch 3 (.sb3)','Scratch nije izložio svoj materijal za asistenta.');ensure(context.code.length<=50000,'Scratch materijal prelazi dozvoljenu dužinu.');
    const actual=JSON.parse(context.code),actualStage=actual.targets.find(target=>target.isStage);ensure(actualStage.variables.bodovi[1]===1,'Materijal asistenta nije trenutno stanje pravog VM-a.');ensure(actual.targets.some(target=>Object.values(target.blocks).some(block=>block.opcode==='event_whenthisspriteclicked')),'Materijalu asistenta nedostaju stvarni Scratch blokovi.');
    await $('ask-ai').onclick();ensure($('ai-dialog')?.open,'Glavno dugme nije otvorilo kontekstualnog asistenta za Scratch.');const headerCode=$('ai-context-preview').querySelector('pre')?.textContent;ensure(headerCode&&JSON.parse(headerCode).targets.find(target=>target.isStage).variables.bodovi[1]===1,'Glavno dugme nije sačekalo aktuelni Scratch materijal.');$('ai-close').click();
    await $('scratch-ai').onclick();ensure($('ai-dialog')?.open,'Scratch Pomoć nije otvorila asistenta.');const helpCode=$('ai-context-preview').querySelector('pre')?.textContent;ensure(helpCode&&JSON.parse(helpCode).targets.find(target=>target.isStage).variables.bodovi[1]===1,'Scratch Pomoć nije koristila isti aktuelni materijal.');$('ai-close').click();
  `);
  await stage('Scratch flush before global search opens selected course',`
    const lesson=ELDI_MATH_CATALOG[0];globalSearch();fill($('global-search-input'),lesson.title);const result=$('global-search-results').querySelector('[data-result="0"]');ensure(result,'Globalna pretraga nije pronašla traženu cjelinu.');await result.onclick();
    ensure(page==='courses'&&$('course-check'),'Globalna pretraga nije sačekala Scratch čuvanje prije otvaranja cjeline.');ensure($('view').querySelector('h1').textContent===lesson.title,'Pretraga nije otvorila odabranu cjelinu.');ensure(state().scratchWork.exampleId==='klikovi','Pretraga je izgubila sačuvani Scratch projekat.');
  `);
  await stage('Scratch flush before opening Python code',`
    await go('scratch');const deadline=Date.now()+60000;while((!ELDIScratchStudio.ready()||$('scratch-status').textContent.includes('Otvaranje'))&&Date.now()<deadline)await wait(100);ensure(ELDIScratchStudio.ready(),'Scratch nije ponovo otvoren za provjeru programiranja.');await wait(200);
    await openCode('python','print(3)','');ensure(page==='code','Otvaranje koda nije sačekalo Scratch čuvanje.');ensure($('lang').value==='python'&&$('editor').value==='print(3)'&&$('input').value==='','Python editor nije prikazao odabrani jezik, program i ulaz.');ensure(state().scratchWork.exampleId==='klikovi','Otvaranje koda je izgubilo sačuvani Scratch projekat.');
  `);
  await stage('Scratch save and safe close',`await ELDIScratchStudio.flush();await ELDIStorage.flush();await go('home');ensure((window.__eldiErrors||[]).length===0,'Scratch roditeljske greške: '+JSON.stringify(window.__eldiErrors));`);
  return{officialScratch:true,version:'15.2.0',keyboard:true,sb3Roundtrip:true,costumes:true,sounds:true,profileRestore:true,solvedExamples:6,contextualAssistant:true,globalSearch:true,openCode:true};
}
module.exports={runScratchSmoke};
