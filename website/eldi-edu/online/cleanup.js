'use strict';
function cleanupDashboard(){
 if(user.role!=='teacher')return;
 const button=document.createElement('button');button.id='open-trash';button.textContent='Obrisane stavke';button.onclick=wrap(trashScreen);app.querySelector('.heading').append(button);
 app.querySelectorAll('[data-delete-class]').forEach(b=>b.onclick=wrap(()=>deletionDialog('class',b.dataset.deleteClass)));
 app.querySelectorAll('[data-delete-assignment]').forEach(b=>b.onclick=wrap(()=>deletionDialog('assignment',b.dataset.deleteAssignment)));
}
async function deletionDialog(kind,id){
 const preview=await api('deletion_preview',{kind,id}),isClass=kind==='class';
 const dialog=document.createElement('dialog');dialog.id='deletion-dialog';dialog.className='deletion-dialog';dialog.setAttribute('aria-labelledby','deletion-heading');
 dialog.innerHTML=`<p class="eyebrow">POTVRDA BRISANJA</p><h2 id="deletion-heading">Obrisati ${isClass?'odjeljenje':'zadatak'}?</h2><h3>${esc(preview.item.title)}</h3>${!isClass?`<p>Odjeljenje: ${esc(preview.item.class_title)}</p>`:''}<ul>${isClass?`<li>Povezani zadaci: <b>${preview.counts.assignments}</b></li><li>Učenici u odjeljenju: <b>${preview.counts.students}</b></li>`:''}<li>Predaje učenika: <b>${preview.counts.submissions}</b></li></ul><p>${isClass?'Odjeljenje i njegovi zadaci nestaju iz aktivnog pregleda nastavnika i učenika. Link za registraciju u ovo odjeljenje prestaje važiti dok je obrisano.':'Zadatak i njegove predaje, ocjene i diplome nestaju iz aktivnog pregleda.'}</p><p>Stavka se premješta u <b>Obrisane stavke</b>, odakle je možeš vratiti zajedno s povezanim podacima. Učenički računi ostaju sačuvani.</p><p id="deletion-error" role="alert"></p><div class="actions"><button id="deletion-cancel" autofocus>Odustani</button><button id="deletion-confirm" class="danger">Potvrdi brisanje</button></div>`;
 document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove());$('deletion-cancel').onclick=()=>dialog.close();
 $('deletion-confirm').onclick=async()=>{
  const button=$('deletion-confirm');button.disabled=true;$('deletion-error').textContent='';
  try{await api('move_to_trash',{kind,id,snapshot:preview.snapshot});dialog.close();await dashboard();message((isClass?'Odjeljenje je obrisano':'Zadatak je obrisan')+' iz aktivnog pregleda. Možeš ga vratiti kroz Obrisane stavke.');window.scrollTo(0,0);}
  catch(e){if(dialog.isConnected)$('deletion-error').textContent=e.message;else message(e.message);}
  finally{if(button.isConnected)button.disabled=false;}
 };
 dialog.showModal();
}
async function trashScreen(){
 const {items}=await api('trash_list',{});message();
 app.innerHTML=`<button id="trash-back">← Pregled</button><h1>Obrisane stavke</h1><p>Ovdje su odjeljenja i pojedinačno obrisani zadaci. Vraćanjem odjeljenja ponovo postaju dostupni njegovi učenici, zadaci i rezultati. Zadatak koji je zasebno obrisan vraća se zasebno.</p><div class="cards">${items.map(x=>`<article class="panel"><span class="badge">${x.kind==='class'?'ODJELJENJE':'ZADATAK'}</span><h2>${esc(x.title)}</h2>${x.kind==='assignment'?`<p>Odjeljenje: ${esc(x.class_title)}</p>`:''}<p>Obrisano: ${date(x.deleted_at)}</p><button data-restore-kind="${x.kind}" data-restore-id="${x.id}" class="primary" ${Number(x.parent_deleted)?'disabled':''}>Vrati ${x.kind==='class'?'odjeljenje':'zadatak'}</button>${Number(x.parent_deleted)?'<p>Prvo vrati pripadajuće odjeljenje.</p>':''}</article>`).join('')||'<section class="panel"><p>Nema obrisanih stavki.</p></section>'}</div>`;
 $('trash-back').onclick=wrap(dashboard);
 app.querySelectorAll('[data-restore-id]').forEach(b=>b.onclick=wrap(async()=>{await api('restore_item',{kind:b.dataset.restoreKind,id:b.dataset.restoreId});await trashScreen();message('Stavka je vraćena. Otvori Pregled da je vidiš.');window.scrollTo(0,0);}));
 window.scrollTo(0,0);
}
