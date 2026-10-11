'use strict';
function staffDashboardLink(){
 if(!user?.is_admin)return;
 const panel=document.createElement('section');panel.className='panel';
 panel.innerHTML='<p class="eyebrow">ADMINISTRACIJA</p><h2>Nastavnici i administratori</h2><p>Dodaj kolegu, odredi njegovu ulogu ili obnovi nastavničku lozinku.</p><button id="manage-staff" class="primary">Upravljaj nastavnicima →</button>';
 app.querySelector('.heading').after(panel);$('manage-staff').onclick=wrap(staffScreen);
}
async function staffScreen(){
 const {staff}=await api('staff_list',{});
 app.innerHTML=`<button id="staff-back">← Pregled</button><div class="heading"><div><p class="eyebrow">ELDI EDU · ADMINISTRACIJA</p><h1>Nastavnici i administratori</h1><p>Svaki nastavnik vodi svoja odjeljenja, učenike i zadatke. Administrator dodatno upravlja nastavničkim računima.</p></div></div><div class="two"><section class="panel"><h2>Dodaj nastavnika</h2><form id="staff-create">${field('staff-name','Ime i prezime','text','required maxlength="100" autocomplete="name"')}${field('staff-username','Korisničko ime — slova bez kvačica, brojevi, tačka ili crtica','text','required minlength="3" maxlength="60" pattern="[A-Za-z0-9._-]{3,60}" autocomplete="off"')}${field('staff-password','Lozinka — najmanje 12 znakova','password','required minlength="12" maxlength="128" autocomplete="new-password"')}${field('staff-confirm','Ponovi lozinku','password','required minlength="12" maxlength="128" autocomplete="new-password"')}<label class="check-line"><input id="staff-show" type="checkbox"> Prikaži unesenu lozinku</label><label>Uloga<select id="staff-role"><option value="teacher">Nastavnik</option><option value="admin">Administrator + nastavnik</option></select></label><button class="primary">Kreiraj nastavnički račun</button><p class="muted">Kolegi daj odabrano korisničko ime i lozinku. Prijavljuje se kroz „Administrator / nastavnik“, a lozinku može promijeniti kroz „Moj račun“.</p></form></section><section class="panel"><h2>Postojeći računi (${staff.length})</h2><div class="staff-list">${staff.map(t=>`<article class="staff-card"><h3>${esc(t.display_name)}</h3><p>${esc(t.username)}${t.id===user.id?' · tvoj račun':''}</p><span class="badge">${t.is_owner?'Glavni administrator':t.is_admin?'Administrator + nastavnik':'Nastavnik'}</span>${!t.is_owner&&t.id!==user.id?`<div class="actions"><button data-staff-role="${esc(t.id)}">${t.is_admin?'Postavi za nastavnika':'Dodijeli administratorska prava'}</button><button data-staff-reset="${esc(t.id)}">Nova lozinka</button></div>`:'<p class="muted">Svoju lozinku mijenjaš kroz Moj račun.</p>'}</article>`).join('')}</div></section></div>`;
 $('staff-back').onclick=wrap(dashboard);
 $('staff-show').onchange=()=>{for(const id of ['staff-password','staff-confirm'])$(id).type=$('staff-show').checked?'text':'password';};
 $('staff-create').onsubmit=wrap(async()=>{
  window.scrollTo(0,0);
  if($('staff-password').value!==$('staff-confirm').value)throw Error('Lozinke se ne podudaraju.');
  const result=await api('create_teacher',{name:$('staff-name').value,username:$('staff-username').value,password:$('staff-password').value,role:$('staff-role').value});
  await staffScreen();message('Račun '+result.teacher.username+' je kreiran. Kolega se sada može prijaviti.');window.scrollTo(0,0);
 });
 app.querySelectorAll('[data-staff-role]').forEach(b=>b.onclick=wrap(async()=>{
  const t=staff.find(x=>x.id===b.dataset.staffRole),role=t.is_admin?'teacher':'admin';
  if(!confirm((t.is_admin?'Ukloniti administratorska prava računu ':'Dodijeliti upravljanje nastavničkim računima korisniku ')+t.username+'?'))return;
  await api('set_teacher_role',{id:t.id,role});await staffScreen();message('Uloga računa '+t.username+' je sačuvana.');window.scrollTo(0,0);
 }));
 app.querySelectorAll('[data-staff-reset]').forEach(b=>b.onclick=()=>staffPasswordForm(staff.find(t=>t.id===b.dataset.staffReset)));
}
function staffPasswordForm(t){
 message();app.innerHTML=`<button id="staff-back">← Nastavnici i administratori</button><section class="panel login"><h1>Nova nastavnička lozinka</h1><p>${esc(t.display_name)} · ${esc(t.username)}</p><form id="staff-reset-form">${field('staff-reset-password','Nova lozinka — najmanje 12 znakova','password','required minlength="12" maxlength="128" autocomplete="new-password"')}${field('staff-reset-confirm','Ponovi novu lozinku','password','required minlength="12" maxlength="128" autocomplete="new-password"')}<button class="primary">Sačuvaj novu lozinku</button></form><p class="muted">Prethodna lozinka prestaje važiti, a postojeće prijave ovog nastavnika se prekidaju. Njegovi učenici i zadaci ostaju sačuvani.</p></section>`;
 $('staff-back').onclick=wrap(staffScreen);window.scrollTo(0,0);
 $('staff-reset-form').onsubmit=wrap(async()=>{
  window.scrollTo(0,0);
  if($('staff-reset-password').value!==$('staff-reset-confirm').value)throw Error('Lozinke se ne podudaraju.');
  await api('reset_teacher_password',{id:t.id,password:$('staff-reset-password').value});await staffScreen();message('Nova lozinka je sačuvana za '+t.username+'.');
 });
}
