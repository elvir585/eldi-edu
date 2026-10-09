'use strict';
window.ELDIScratchStudio=(()=>{
  let current=null;
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const bytesToBase64=bytes=>{let text='';for(let i=0;i<bytes.length;i+=0x8000)text+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(text);};
  const fromBase64=text=>Uint8Array.from(atob(text),char=>char.charCodeAt(0));
  const p=()=>typeof current.options.profile==='function'?current.options.profile():current.options.profile;
  const status=(message,error=false)=>{if(!current)return;current.status.textContent=message;current.status.classList.toggle('is-error',error);};
  function send(type,data={}){current?.frame.contentWindow?.postMessage({channel:'ELDI-SCRATCH',token:current.token,type,...data},'*');}
  function request(type,data={}) {
    if(!current?.ready)return Promise.reject(new Error('Sačekaj da se Scratch editor učita.'));
    const session=current,requestId=++session.sequence;
    return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{session.pending.delete(requestId);reject(new Error('Scratch editor nije odgovorio na vrijeme. Pokušaj ponovo.'));},60000);session.pending.set(requestId,{resolve,reject,timer});send(type,{requestId,...data});});
  }
  function saveSnapshot(message) {
    if(!current||typeof message.base64!=='string')return;
    const draft=window.ELDIScratchProjects.validDraft({base64:message.base64,name:current.name.value,savedAt:new Date().toISOString(),exampleId:current.exampleId});
    if(!draft){status('Rad je prevelik za profil. Koristi Čuvaj .sb3.',true);return;}
    p().scratchWork=draft;current.options.save?.();current.lastSummary=String(message.summary||'');status('Rad sačuvan u ovom profilu · '+new Date(draft.savedAt).toLocaleTimeString('bs-BA',{hour:'2-digit',minute:'2-digit'}));
  }
  function fit(){if(!current)return;const top=current.viewport.getBoundingClientRect().top;current.viewport.style.height=Math.max(420,window.innerHeight-top-14)+'px';}
  function setReady(ready){current.ready=ready;for(const button of current.root.querySelectorAll('[data-scratch-needs-ready]'))button.disabled=!ready;}
  function recipe(id){const item=window.ELDIScratchProjects.examples.find(example=>example.id===id);current.exampleId=item?.id||null;current.recipe.innerHTML=item?`<strong>${esc(item.title)}</strong><span>${esc(item.goal)}</span><ol>${item.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:'<strong>Tvoj slobodan projekat</strong><span>Dodaj likove, nacrtaj kostime i pozadine, uredi zvukove i sastavi događaje. Zelena zastavica pokreće projekat.</span>';}
  function exampleBytes(id){
    window.ELDI_SCRATCH_EXAMPLES||=Object.create(null);
    if(window.ELDI_SCRATCH_EXAMPLES[id])return Promise.resolve(window.ELDI_SCRATCH_EXAMPLES[id]);
    if(!window.ELDIScratchProjects.examples.some(example=>example.id===id))return Promise.reject(new Error('Nepoznat primjer.'));
    return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='vendor/scratch/examples/'+id+'.js';script.onload=()=>{script.remove();typeof window.ELDI_SCRATCH_EXAMPLES[id]==='string'?resolve(window.ELDI_SCRATCH_EXAMPLES[id]):reject(new Error('Primjer nije uključen u paket.'));};script.onerror=()=>{script.remove();reject(new Error('Scratch primjer nije moguće otvoriti.'));};document.head.appendChild(script);});
  }
  async function loadBytes(base64,name,id=null){
    window.ELDIScratchProjects.validateArchive(base64);
    status('Otvaranje projekta…');await request('load',{base64});current.name.value=String(name||'Moj Scratch projekat').slice(0,120);recipe(id);await request('snapshot');status('Projekat je otvoren. Pokreni ga zelenom zastavicom.');
  }
  async function chooseExample(id){if(!current?.ready)return;try{const item=window.ELDIScratchProjects.examples.find(example=>example.id===id);await request('snapshot');await loadBytes(await exampleBytes(id),item.title,id);}catch(error){status(error.message,true);}}
  function handleMessage(event){
    if(!current||event.source!==current.frame.contentWindow)return;const message=event.data;if(!message||message.channel!=='ELDI-SCRATCH'||message.token!==current.token)return;
    if(message.type==='snapshot')saveSnapshot(message);
    if(message.requestId&&current.pending.has(message.requestId)){const entry=current.pending.get(message.requestId);current.pending.delete(message.requestId);clearTimeout(entry.timer);if(message.type==='request-error'||message.type==='snapshot-limit')entry.reject(new Error(message.message||'Rad je prevelik za profil. Koristi meni Datoteka u Scratch editoru za čuvanje .sb3.'));else entry.resolve(message);}
    if(message.type==='ready'){
      clearTimeout(current.bootTimer);setReady(true);status('Scratch 15.2.0 · editor spreman za rad bez interneta');
      const session=current,draft=window.ELDIScratchProjects.validDraft(p().scratchWork);if(draft){session.name.value=draft.name;recipe(draft.exampleId);loadBytes(draft.base64,draft.name,draft.exampleId).catch(error=>status('Sačuvani Scratch rad nije moguće otvoriti: '+error.message,true));}
      fit();
    }else if(message.type==='error')status(message.message,true);
    else if(message.type==='snapshot-limit')status('Rad je prevelik za profil. Sačuvaj ga kroz meni Datoteka → Spremi na računalo u Scratch editoru.',true);
    else if(message.type==='about'){current.root.querySelector('#scratch-examples').hidden=false;current.root.querySelector('#scratch-examples-toggle').setAttribute('aria-expanded','true');current.legal.open=true;fit();current.legal.scrollIntoView({block:'nearest'});}
  }
  async function flush(){if(!current?.ready)return;try{return await request('snapshot');}catch(error){status(error.message,true);throw error;}}
  async function getContext(){
    const session=current;if(!session?.ready)throw new Error('Sačekaj da se Scratch editor učita.');
    const reply=await request('context');if(current!==session)throw new Error('Scratch radni prostor je promijenjen.');
    const example=window.ELDIScratchProjects.examples.find(item=>item.id===session.exampleId);
    return {kind:'scratch',title:session.name.value,subject:'informatics',statement:'Objasni Scratch projekat i njegove blokove. '+(example?.goal||''),code:String(reply.summary||'').slice(0,50000),language:'Scratch 3 (.sb3)',source:'Scratch studio',onAnswer:()=>{}};
  }
  function destroy(){
    if(!current)return;send('dispose');clearTimeout(current.bootTimer);for(const entry of current.pending.values()){clearTimeout(entry.timer);entry.reject(new Error('Scratch studio je zatvoren.'));}window.removeEventListener('message',handleMessage);window.removeEventListener('resize',fit);current.observer?.disconnect();current=null;
  }
  function mount(options){
    destroy();const root=options.root;
    root.innerHTML=`<div class="scratch-studio"><div class="scratch-heading"><div><span class="scratch-kicker">KREATIVNI STUDIO · .SB3</span><h1>Scratch projekti</h1></div><button id="scratch-focus" aria-pressed="false">⛶ Veliki studio</button></div><div class="scratch-toolbar"><label>Naziv rada<input id="scratch-name" value="Moj Scratch projekat" maxlength="120"></label><button id="scratch-save" data-scratch-needs-ready disabled>Sačuvaj rad</button><button id="scratch-export" data-scratch-needs-ready disabled>↓ Čuvaj .sb3</button><button id="scratch-import" data-scratch-needs-ready disabled>↑ Otvori .sb3</button><button id="scratch-examples-toggle" aria-expanded="false">Riješeni primjeri</button><button id="scratch-ai" data-scratch-needs-ready disabled>✦ Pomoć</button><input id="scratch-file" type="file" accept=".sb3" hidden></div><div class="scratch-status-row"><p id="scratch-status" role="status">Učitavanje službenog lokalnog Scratch editora…</p><span>Likovi · kostimi · pozadine · zvukovi</span></div><section id="scratch-examples" class="scratch-examples" hidden><div class="scratch-example-grid">${window.ELDIScratchProjects.examples.map(item=>`<button data-scratch-example="${item.id}" data-scratch-needs-ready disabled><small>${item.grade}. razred · ${esc(item.category)}</small><strong>${esc(item.title)}</strong><span>${esc(item.goal)}</span></button>`).join('')}</div><div id="scratch-recipe" class="scratch-recipe"></div><details id="scratch-legal" class="scratch-legal"><summary>Scratch komponenta: autori, licenca i izvorni kod</summary><p>Scratch editor © Scratch Foundation i Massachusetts Institute of Technology. Službena komponenta 15.2.0 i ELDI adapter komponente dostupni su pod AGPL-3.0-only, bez garancije. Licenca dopušta kopiranje, izmjenu i distribuciju pod svojim uslovima. Scratch naziv, logotip i likovi pripadaju Scratch Foundation; ova aplikacija nije službeno Scratch izdanje.</p><p>Potpuna licenca nalazi se u <code>renderer/vendor/scratch/LICENSE</code>. Odgovarajući izvorni kod i upute nalaze se u GitHub izdanju ELDI EDU, u paketu <code>ELDI-EDU-12.0.0-Scratch-izvori.zip</code>. Službeni izvor: <code>scratchfoundation/scratch-editor</code>, revizija <code>5fe823510f3ae0cc7291d49bc824cc5c54fe7723</code>.</p></details></section><div id="scratch-viewport" class="scratch-viewport"><iframe id="scratch-frame" title="Scratch blokovski editor, kostimi i zvukovi" allow="autoplay" referrerpolicy="no-referrer"></iframe></div></div>`;
    const get=id=>root.querySelector('#'+id),token=crypto.randomUUID();
    current={options,root,token,frame:get('scratch-frame'),viewport:get('scratch-viewport'),name:get('scratch-name'),status:get('scratch-status'),recipe:get('scratch-recipe'),legal:get('scratch-legal'),sequence:0,pending:new Map(),ready:false,exampleId:null,lastSummary:''};
    window.addEventListener('message',handleMessage);window.addEventListener('resize',fit);
    current.frame.src='vendor/scratch/index.html?session='+encodeURIComponent(token);
    current.bootTimer=setTimeout(()=>{if(current&&!current.ready)status('Scratch se još učitava. Ako editor ostane prazan, ponovo otvori studio ili provjeri da je instalirano kompletno izdanje.',true);},30000);
    get('scratch-save').onclick=()=>flush().catch(()=>{});
    get('scratch-export').onclick=async()=>{try{const snapshot=await request('export');const name=current.name.value.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g,'_')||'Moj-Scratch-projekat';await options.exportFile(name+'.sb3',fromBase64(snapshot.base64),'application/x.scratch.sb3');status('Scratch .sb3 datoteka je pripremljena za čuvanje.');}catch(error){status(error.message,true);}};
    get('scratch-import').onclick=()=>get('scratch-file').click();
    get('scratch-file').onchange=async event=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;try{if(!/\.sb3$/i.test(file.name))throw new Error('Odaberi Scratch .sb3 projekat.');if(file.size>window.ELDIScratchProjects.MAX_PROJECT_BYTES)throw new Error('Scratch projekat smije imati do 12 MB.');await request('snapshot');await loadBytes(bytesToBase64(new Uint8Array(await file.arrayBuffer())),file.name.replace(/\.sb3$/i,''));}catch(error){status(error.message,true);}};
    get('scratch-examples-toggle').onclick=()=>{const panel=get('scratch-examples');panel.hidden=!panel.hidden;get('scratch-examples-toggle').setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)recipe(current.exampleId);fit();};
    for(const button of root.querySelectorAll('[data-scratch-example]'))button.onclick=()=>chooseExample(button.dataset.scratchExample);
    get('scratch-ai').onclick=async()=>{const session=current;try{const context=await getContext();if(current===session)await session.options.askAI?.(context);}catch(error){if(current===session)status(error.message,true);}};
    get('scratch-focus').onclick=()=>{const studio=root.querySelector('.scratch-studio'),active=!studio.classList.contains('scratch-focused');studio.classList.toggle('scratch-focused',active);get('scratch-focus').setAttribute('aria-pressed',String(active));get('scratch-focus').textContent=active?'↙ Vrati prikaz':'⛶ Veliki studio';fit();};
    current.name.onchange=()=>flush().catch(()=>{});
    if(typeof ResizeObserver==='function'){current.observer=new ResizeObserver(fit);current.observer.observe(root);}
    fit();
  }
  return {mount,destroy,flush,getContext,chooseExample,loadBytes,ready:()=>!!current?.ready,frame:()=>current?.frame||null};
})();
