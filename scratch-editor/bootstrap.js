'use strict';
/* ELDI EDU Scratch adapter. Copyright (c) 2026 ELDI EDU authors.
 * This separate Scratch component adapter is distributed under AGPL-3.0-only.
 * Official Scratch standalone webpack publicPath is relocated for local assets.
 * The exact relocation patch and original bundle hash are in build-scratch.cjs and SOURCE.json. */
(() => {
  const token=new URLSearchParams(location.search).get('session')||'';
  const status=document.getElementById('scratch-boot-message');
  const GUI=window.GUI;
  let vm=null,root=null,editor=null,ready=false,loading=false,disposed=false,saveTimer=null;
  const send=(type,data={})=>parent.postMessage({channel:'ELDI-SCRATCH',token,type,...data},'*');
  const error=message=>{status.hidden=false;status.textContent=String(message);send('error',{message:String(message)});};
  const bytesToBase64=bytes=>{let text='';for(let i=0;i<bytes.length;i+=0x8000)text+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(text);};
  const fromBase64=text=>Uint8Array.from(atob(text),char=>char.charCodeAt(0));
  const assetLoads=new Map();window.ELDI_SCRATCH_ASSETS=Object.create(null);
  function loadLocalAsset(md5ext) {
    if(!/^[a-f0-9]{32}\.(svg|png|jpg|jpeg|wav|mp3)$/.test(md5ext))return Promise.reject(new Error('Nepodržana lokalna datoteka.'));
    if(assetLoads.has(md5ext))return assetLoads.get(md5ext);
    const promise=new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src='asset-data/'+md5ext+'.js';
      script.onload=()=>{script.remove();const encoded=window.ELDI_SCRATCH_ASSETS[md5ext];delete window.ELDI_SCRATCH_ASSETS[md5ext];if(typeof encoded!=='string'){reject(new Error('Nedostaje lokalni Scratch materijal.'));return;}resolve(fromBase64(encoded));};
      script.onerror=()=>{script.remove();assetLoads.delete(md5ext);reject(new Error('Lokalni Scratch materijal nije pronađen: '+md5ext));};document.head.appendChild(script);
    });assetLoads.set(md5ext,promise);return promise;
  }
  async function snapshot(requestId,automatic=false,exportOnly=false) {
    if(!vm||!ready||loading||disposed)return;
    const blob=await vm.saveProjectSb3();
    if(blob.size>(exportOnly?64:12)*1024*1024){send('snapshot-limit',{requestId,size:blob.size});return;}
    const bytes=new Uint8Array(await blob.arrayBuffer());
    send(exportOnly?'export-snapshot':'snapshot',{requestId,automatic,base64:bytesToBase64(bytes),bytes:bytes.length,summary:exportOnly?'':vm.toJSON()});
  }
  function scheduleSave(){if(loading||!ready||disposed)return;clearTimeout(saveTimer);saveTimer=setTimeout(()=>snapshot(null,true).catch(cause=>send('error',{message:'Čuvanje Scratch rada nije uspjelo: '+cause.message})),1500);}
  async function loadProject(bytes,requestId) {
    if(!ready||loading||disposed)throw new Error('Scratch editor još nije spreman.');
    window.ELDIScratchProjects.validateArchive(bytes);
    loading=true;clearTimeout(saveTimer);vm.stopAll();editor.dispatch(GUI.requestProjectUpload());
    try {
      await vm.loadProject(bytes);vm.stopAll();editor.dispatch(GUI.onLoadedProject('LOADING_VM_FILE_UPLOAD',false,true));
      loading=false;send('loaded',{requestId,targets:vm.runtime.targets.length});await snapshot(null,true);
    } catch(cause){editor.dispatch(GUI.onLoadedProject('LOADING_VM_FILE_UPLOAD',false,false));loading=false;throw cause;}
  }
  window.addEventListener('message',async event=>{
    const message=event.data;if(event.source!==parent||!message||message.channel!=='ELDI-SCRATCH'||message.token!==token)return;
    try {
      switch(message.type){
        case 'load':await loadProject(fromBase64(message.base64),message.requestId);break;
        case 'snapshot':await snapshot(message.requestId);break;
        case 'export':await snapshot(message.requestId,false,true);break;
        case 'run':if(ready)vm.greenFlag();break;
        case 'stop':if(vm)vm.stopAll();break;
        case 'context':send('context',{requestId:message.requestId,summary:vm?vm.toJSON():''});break;
        case 'dispose':disposed=true;clearTimeout(saveTimer);vm?.stopAll();vm?.quit();root?.unmount();window.ELDI_SCRATCH_READY=false;break;
      }
    }catch(cause){send('request-error',{requestId:message.requestId,message:cause.message||'Scratch projekat nije moguće otvoriti.'});}
  });
  try {
    if(!GUI?.createStandaloneRoot||!GUI?.EditorState||!GUI?.ScratchStorage)throw new Error('Službeni Scratch editor nije uključen u ovaj paket.');
    const storage=new GUI.ScratchStorage();
    for(const asset of GUI.buildDefaultProject())storage.builtinHelper._store(storage.AssetType[asset.assetType],storage.DataFormat[asset.dataFormat],asset.data,asset.id);
    class LocalAssetHelper extends GUI.Helper {
      load(type,id,format){if(type===storage.AssetType.Project)return null;const ext=id+'.'+format;return loadLocalAsset(ext).then(data=>new GUI.Asset(type,id,format,data,false));}
    }
    storage.addHelper(new LocalAssetHelper(storage));
    const localConfig={storage:{scratchStorage:storage,getLibraryAssetUrl:(id,format)=>'assets/'+id+'.'+format,saveProject:()=>Promise.reject(new Error('Koristi Čuvaj .sb3 ili Sačuvaj rad u ELDI EDU.'))}};
    editor=new GUI.EditorState({locale:'hr',showTelemetryModal:false},()=>localConfig);
    root=GUI.createStandaloneRoot(editor,document.getElementById('scratch-root'));GUI.setAppElement(document.getElementById('scratch-root'));
    root.render({canEditTitle:true,canSave:false,canCreateNew:true,canShare:false,canRemix:false,canUseCloud:false,canSaveToMyStuff:false,backpackVisible:false,showComingSoon:false,showNewFeatureCallouts:false,platform:'DESKTOP',basePath:'./',projectId:'0',onClickLogo:()=>send('about'),onVmInit:value=>{vm=value;const originalLoadProject=vm.loadProject.bind(vm);vm.loadProject=bytes=>{if(bytes instanceof ArrayBuffer||ArrayBuffer.isView(bytes))window.ELDIScratchProjects.validateArchive(bytes);return originalLoadProject(bytes);};window.ELDI_SCRATCH_VM=vm;vm.on('PROJECT_CHANGED',scheduleSave);},onProjectLoaded:()=>{if(!ready){ready=true;status.hidden=true;window.ELDI_SCRATCH_READY=true;window.ELDI_SCRATCH_EDITOR=editor;send('ready',{version:'15.2.0'});}}});
  }catch(cause){error('Scratch nije moguće pokrenuti: '+cause.message);}
})();
