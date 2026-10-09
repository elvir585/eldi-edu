'use strict';
window.ELDIWorkspace = (() => {
 const names={home:'Moj pregled',paths:'Moj put učenja',notebook:'Matematička sveska',collection:'Zbirka i radni listovi',courses:'Cjeline i vještine',books:'Knjige i rješenja',math:'Matematički laboratorij',scratch:'Scratch studio',blocks:'Blockly projekti',assessment:'Programerski izazovi',code:'Slobodni editor',teacher:'Nastavnički centar',exams:'Provjere i ocjene',awards:'Značke i diplome',progress:'Moj napredak',lessons:'Dodatne lekcije',maintenance:'Kopije i nova izdanja',about:'O aplikaciji'};
 let focus=false;
 function setFocus(value){focus=!!value;document.body.classList.toggle('workspace-focus',focus);const button=document.getElementById('workspace-focus');button.setAttribute('aria-pressed',String(focus));button.textContent=focus?'↙ Izađi iz fokusa':'Fokus';button.title='Fokus na zadatak · F9';window.dispatchEvent(new Event('resize'));}
 function navigate(page){
  document.getElementById('workspace-location').textContent=names[page]||'ELDI EDU';
  document.querySelectorAll('.workspace-nav [data-page]').forEach(button=>{const active=button.dataset.page===page;button.setAttribute('aria-current',active?'page':'false');if(active){const group=button.closest('details');if(group)group.open=true;}});
  document.querySelectorAll('.workspace-nav details').forEach(group=>group.classList.toggle('has-current',!!group.querySelector('[aria-current="page"]')));
 }
 function saveState(status){const node=document.getElementById('workspace-save');if(!node)return;node.dataset.status=status;node.textContent={saving:'Čuvanje…',saved:'Sačuvano na računaru',error:'Čuvanje nije uspjelo',local:'Lokalni profil'}[status]||'Lokalni profil';}
 document.getElementById('workspace-focus').addEventListener('click',()=>setFocus(!focus));
 window.addEventListener('keydown',event=>{if(event.key==='F9'&&!event.ctrlKey&&!event.altKey&&!event.metaKey){event.preventDefault();setFocus(!focus);}else if(event.key==='Escape'&&focus&&!event.defaultPrevented&&!document.querySelector('dialog[open],.cm-search')){setFocus(false);document.getElementById('workspace-focus').focus();}});
 return Object.freeze({navigate,saveState,setFocus,names});
})();
