'use strict';
async function runScratchSmoke({stage,capture,evaluate,window}){
  const frame=()=>window.webContents.mainFrame.framesInSubtree.find(item=>item.url.includes('/vendor/scratch/index.html'));
  const frameHelpers=`const ensure=(condition,message)=>{if(!condition)throw new Error(message);};const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    if(!window.__ELDI_SCRATCH_QA_ERRORS){window.__ELDI_SCRATCH_QA_ERRORS=[];const record=value=>{if(window.__ELDI_SCRATCH_QA_ERRORS.length<20)window.__ELDI_SCRATCH_QA_ERRORS.push(String(value).slice(0,1500));};window.addEventListener('error',event=>record(event.error?.stack||event.message));window.addEventListener('unhandledrejection',event=>record(event.reason?.stack||event.reason));const previous=console.error;console.error=(...args)=>{record(args.map(value=>String(value?.stack||value)).join(' '));previous.apply(console,args);};}
  `;
  const inFrame=async code=>{const item=frame();if(!item)throw new Error('Scratch iframe nije pronađen.');try{return await item.executeJavaScript('(async()=>{'+frameHelpers+code+'})()');}catch(error){try{await capture('FAILED-Scratch-frame');}catch(captureError){console.error('Scratch failure screenshot:',captureError.message);}throw error;}};
  await stage('official offline Scratch editor startup',`
    await go('scratch');const deadline=Date.now()+60000;while(!ELDIScratchStudio.ready()&&Date.now()<deadline)await wait(100);
    ensure(ELDIScratchStudio.ready(),'Službeni Scratch editor nije spreman: '+$('scratch-status').innerText);
    await ELDIScratchStudio.chooseExample('strelice');ensure(state().scratchWork?.exampleId==='strelice','Scratch primjer nije sačuvan u profilu: '+$('scratch-status').textContent);
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
    const paintedOrange=()=>{const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let orange=0;for(let i=0;i<pixels.length;i+=8)if(pixels[i]>180&&pixels[i+1]>65&&pixels[i+1]<200&&pixels[i+2]<95&&pixels[i+3]>150)orange++;return orange;};let orange=paintedOrange();while(orange<20&&Date.now()<paintDeadline){await wait(100);orange=paintedOrange();}ensure(orange>=20,'Paper editor nije iscrtao stvarni narandžasti kostim: '+orange+' piksela; '+JSON.stringify((window.__ELDI_SCRATCH_QA_ERRORS||[]).slice(-4)));
  `);
  await capture('19-scratch-costumes');
  const soundTabPoint=await inFrame(`
    const tab=[...document.querySelectorAll('[role="tab"]')].find(item=>/zvuk|sound/i.test(item.textContent));ensure(tab,'Nedostaje kartica zvukova.');const box=tab.getBoundingClientRect();return{x:box.left+box.width/2,y:box.top+box.height/2};
  `);
  const iframePoint=await evaluate("const box=$('scratch-frame').getBoundingClientRect();return{x:box.left,y:box.top};");
  const soundPoint={x:Math.round(iframePoint.x+soundTabPoint.x),y:Math.round(iframePoint.y+soundTabPoint.y),button:'left',clickCount:1};
  // Scratch's shared sound-editor AudioContext initializes on actual mousedown,
  // touchstart or keydown. HTMLElement.click() skips these input events.
  window.webContents.sendInputEvent({type:'mouseMove',...soundPoint});window.webContents.sendInputEvent({type:'mouseDown',...soundPoint});window.webContents.sendInputEvent({type:'mouseUp',...soundPoint});
  await inFrame(`
    const vm=window.ELDI_SCRATCH_VM,deadline=Date.now()+8000;let editor=document.querySelector('[class*="sound-editor_editor-container"]');while(!editor&&Date.now()<deadline){await wait(100);editor=document.querySelector('[class*="sound-editor_editor-container"]');}
    const target=vm.editingTarget,sounds=target?.getSounds()||[],buffer=sounds.length?vm.getSoundBuffer(0):null,diagnostic=JSON.stringify({target:target?.getName(),sounds:sounds.map(sound=>({name:sound.name,soundId:sound.soundId,assetBytes:sound.asset?.data?.length})),audio:!!vm.runtime.audioEngine,audioState:vm.runtime.audioEngine?.audioContext?.state,decodedSamples:buffer?.length,errors:(window.__ELDI_SCRATCH_QA_ERRORS||[]).slice(-4),dom:document.body.innerText.slice(-800)});
    ensure(window.ELDI_SCRATCH_EDITOR.store.getState().scratchGui.editorTab.activeTabIndex===2,'Službeni editor zvukova nije otvoren: '+diagnostic);ensure(editor,'Službeni editor zvukova nije prikazan: '+diagnostic);ensure(buffer?.length>1000,'Zvuk nema stvarne dekodirane uzorke: '+diagnostic);const waveform=editor.querySelector('[class*="waveform_waveform-path"]');ensure(waveform?.getAttribute('d')?.length>30,'Editor nema nacrtan valni oblik zvuka: '+diagnostic);
  `);
  await capture('19b-scratch-sounds');
  await stage('Scratch solved learning example files',`
    await ELDIScratchStudio.chooseExample('klikovi');ensure(state().scratchWork.exampleId==='klikovi','Igra s bodovima nije učitana.');
  `);
  await inFrame(`
    const vm=window.ELDI_SCRATCH_VM;vm.greenFlag();await wait(150);const stage=vm.runtime.getTargetForStage(),sprite=vm.runtime.targets.find(target=>!target.isStage);ensure(String(stage.variables.bodovi.value)==='0','Bodovi nisu vraćeni na nulu: '+JSON.stringify(stage.variables.bodovi.value));vm.runtime.startHats('event_whenthisspriteclicked',null,sprite);await wait(180);ensure(String(stage.variables.bodovi.value)==='1','Klik na lik nije izvršio Scratch brojač: '+JSON.stringify(stage.variables.bodovi.value));vm.stopAll();
  `);
  await stage('Scratch current VM material for contextual assistant',`
    const context=await ELDIScratchStudio.getContext();ensure(context.kind==='scratch'&&context.language==='Scratch 3 (.sb3)','Scratch nije izložio svoj materijal za asistenta.');ensure(context.code.length<=50000,'Scratch materijal prelazi dozvoljenu dužinu.');
    const actual=JSON.parse(context.code),actualStage=actual.targets.find(target=>target.isStage);ensure(String(actualStage.variables.bodovi[1])==='1','Materijal asistenta nije trenutno stanje pravog VM-a.');ensure(actual.targets.some(target=>Object.values(target.blocks).some(block=>block.opcode==='event_whenthisspriteclicked')),'Materijalu asistenta nedostaju stvarni Scratch blokovi.');
    await $('ask-ai').onclick();ensure($('ai-dialog')?.open,'Glavno dugme nije otvorilo kontekstualnog asistenta za Scratch.');const headerCode=$('ai-context-preview').querySelector('pre')?.textContent;ensure(headerCode&&String(JSON.parse(headerCode).targets.find(target=>target.isStage).variables.bodovi[1])==='1','Glavno dugme nije sačekalo aktuelni Scratch materijal.');$('ai-close').click();
    await $('scratch-ai').onclick();ensure($('ai-dialog')?.open,'Scratch Pomoć nije otvorila asistenta.');const helpCode=$('ai-context-preview').querySelector('pre')?.textContent;ensure(helpCode&&String(JSON.parse(helpCode).targets.find(target=>target.isStage).variables.bodovi[1])==='1','Scratch Pomoć nije koristila isti aktuelni materijal.');$('ai-close').click();
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
