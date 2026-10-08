'use strict';
// The collection keeps answers and written working separate from lesson quizzes.
window.ELDICollection = (() => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let context, selection = {grade:5, topic:'', difficulty:'medium', search:''};
  const engine = () => window.EduPractice;
  const projects = () => window.ELDI_MATH_PROJECTS || [];
  function work() {
    const p = context.profile();
    p.mathWork ||= {answers:{}, notes:{}, results:{}, session:[], sheets:[]};
    for (const key of ['answers','notes','results']) p.mathWork[key] ||= {};
    p.mathWork.session ||= []; p.mathWork.sheets ||= [];
    return p.mathWork;
  }
  function taskFor(ref) {
    if (ref.projectId) return projects().find(task => task.id === ref.projectId);
    return engine().generate(ref.topicId, ref.seed, ref.difficulty);
  }
  const variants = () => engine().variantsPerTopic || 200;
  const total = () => engine().topics.length * variants();
  function mount(options) { context = options; if(options.grade)selection.grade=options.grade; catalog(); }
  function catalog() {
    const current = work();
    const done = Object.values(current.results).filter(r => r.correct).length;
    context.root.innerHTML = `<div class="eyebrow">ZBIRKA / SAMOSTALNO RJEŠAVANJE</div><h1>Računaj. Zapiši postupak.<br>Provjeri svoje rješenje.</h1><p>${engine().topics.length} oblasti · ${total().toLocaleString('bs-BA')} indeksiranih generisanih varijanti (${variants()} po oblasti) · ${projects().length} složenih tekstualnih zadataka. Svaki zadatak ima provjeru unesenog odgovora i razrađen postupak.</p><div class="collection-toolbar card"><div class="row"><label>Razred<select id="collection-grade">${[5,6,7,8,9].map(g=>`<option value="${g}" ${g===selection.grade?'selected':''}>${g}. razred</option>`).join('')}</select></label><label>Težina<select id="collection-level"><option value="easy">Osnovni</option><option value="medium">Srednji</option><option value="hard">Napredni</option></select></label><label>Pretraga<input id="collection-search" type="search" placeholder="Razlomci, jednačine, geometrija…" value="${escape(selection.search)}"></label><button id="collection-mixed">Mješoviti radni list</button>${current.session.length?'<button id="collection-resume" class="primary">Nastavi otvoreni rad</button>':''}</div><p>${done} riješenih zadataka na ovom profilu. Varijante mijenjaju brojeve i podatke; tematske cjeline su različiti ciljevi učenja.</p></div><div id="collection-topics" class="lessongrid"></div><h2>Problemski zadaci — više povezanih koraka</h2><div id="collection-projects" class="lessongrid"></div><div id="collection-sheet-dialog"></div>${current.sheets.length?'<h2>Sačuvani radni listovi</h2><div class="row">'+current.sheets.map((sheet,i)=>`<button data-resume-sheet="${i}">${escape(sheet.name)} · ${sheet.refs.length} zadataka</button>`).join('')+'</div>':''}`;
    document.getElementById('collection-level').value=selection.difficulty;
    document.getElementById('collection-grade').onchange=e=>{selection.grade=+e.target.value; context.onGrade?.(selection.grade); listTopics();};
    document.getElementById('collection-level').onchange=e=>{selection.difficulty=e.target.value;};
    document.getElementById('collection-search').oninput=e=>{selection.search=e.target.value; listTopics();};
    document.getElementById('collection-mixed').onclick=()=>sheetOptions();
    const resume=document.getElementById('collection-resume'); if(resume)resume.onclick=()=>renderSession();
    document.querySelectorAll('[data-resume-sheet]').forEach(b=>b.onclick=()=>{work().session=work().sheets[+b.dataset.resumeSheet].refs;context.save();renderSession();});
    listTopics();
  }
  function listTopics() {
    const term=selection.search.toLocaleLowerCase('bs');
    const list=engine().topics.filter(t=>t.grade===selection.grade && (t.title+' '+t.description).toLocaleLowerCase('bs').includes(term));
    document.getElementById('collection-topics').innerHTML=list.map(t=>`<article class="card lesson-card"><span class="tag">${t.grade}. razred · ${variants()} varijanti</span><h3>${escape(t.title)}</h3><p>${escape(t.description)}</p><div class="row"><button data-collection-topic="${escape(t.id)}" class="primary">Rješavaj</button><button data-topic-sheet="${escape(t.id)}">Radni list</button></div></article>`).join('') || '<p>Nema oblasti za ovu pretragu.</p>';
    document.querySelectorAll('[data-collection-topic]').forEach(b=>b.onclick=()=>startTopic(b.dataset.collectionTopic));
    document.querySelectorAll('[data-topic-sheet]').forEach(b=>b.onclick=()=>sheetOptions(b.dataset.topicSheet));
    document.getElementById('collection-projects').innerHTML=projects().filter(t=>t.grade===selection.grade && (t.title+' '+t.prompt).toLocaleLowerCase('bs').includes(term)).map(t=>`<article class="card lesson-card"><span class="tag">${t.grade}. razred · ${t.fields.length} dijela</span><h3>${escape(t.title)}</h3><p>${escape(t.prompt.slice(0,170))}…</p><button data-project="${escape(t.id)}">Otvori zadatak</button></article>`).join('');
    document.querySelectorAll('[data-project]').forEach(b=>b.onclick=()=>{work().session=[{projectId:b.dataset.project}];context.save();renderSession();});
  }
  function startTopic(id, seed=1) { selection.topic=id; work().session=[{topicId:id,seed,difficulty:selection.difficulty}]; context.save(); renderSession(); }
  function sheetOptions(topicId='') {
    const host=document.getElementById('collection-sheet-dialog');
    host.innerHTML=`<div class="card worksheet-options"><h2>Pripremi radni list</h2><p>${topicId?'Odabrana oblast':'Mješavina oblasti '+selection.grade+'. razreda'} · ${escape({easy:'osnovni',medium:'srednji',hard:'napredni'}[selection.difficulty])} nivo. Broj lista omogućava da nastavnik i učenik dobiju iste zadatke.</p><div class="row"><label>Broj zadataka<select id="sheet-count">${[5,10,15,20,25,30,40,50].map(n=>`<option ${n===10?'selected':''}>${n}</option>`).join('')}</select></label><label>Broj lista<input id="sheet-number" type="number" min="1" max="9999" value="1"></label><button id="sheet-create" class="primary">Napravi list</button><button id="sheet-cancel">Odustani</button></div></div>`;
    document.getElementById('sheet-cancel').onclick=()=>host.innerHTML='';
    document.getElementById('sheet-create').onclick=()=>{
      const count=+document.getElementById('sheet-count').value, number=+document.getElementById('sheet-number').value;
      if(!Number.isInteger(number)||number<1||number>9999){document.getElementById('sheet-number').reportValidity();return;}
      const topics=engine().topics.filter(t=>topicId?t.id===topicId:t.grade===selection.grade);
      const refs=[]; const seen=new Set();
      for(let i=0;refs.length<count && i<500;i++){
        const t=topics[(number*7+i)%topics.length], seed=1+((number*37+i*17)%variants());
        const key=t.id+':'+seed; if(seen.has(key))continue;seen.add(key); refs.push({topicId:t.id,seed,difficulty:selection.difficulty});
      }
      const w=work(); w.session=refs; w.sheets.unshift({name:`${selection.grade}. razred — list ${number}`,date:new Date().toISOString(),refs});w.sheets=w.sheets.slice(0,30);context.save();renderSession();
    };
    host.scrollIntoView({block:'center',behavior:'smooth'});
  }
  function renderSession() {
    const refs=work().session, tasks=refs.map(taskFor).filter(Boolean);
    if(!tasks.length){catalog();return;}
    const single=tasks.length===1, ref=refs[0];
    context.root.innerHTML=`<div class="row collection-actions"><button id="collection-back">← Zbirka</button><button id="sheet-check" class="primary">Provjeri ${single?'rješenje':'cijeli list'}</button><button id="sheet-print">Štampaj zadatke</button><button id="sheet-print-solutions">Štampaj s postupcima</button><button id="sheet-export">Sačuvaj list i rješenja</button>${single&&!ref.projectId?`<button id="collection-next">Sljedeći zadatak →</button><label>Varijanta (1–${variants()})<input id="collection-variant" type="number" min="1" max="${variants()}" value="${ref.seed}"></label><button id="collection-jump">Otvori broj</button>`:''}</div><div class="worksheet-header"><div class="eyebrow">${tasks[0].grade}. RAZRED / ${single?'SAMOSTALNI RAD':'RADNI LIST'}</div><h1>${single?escape(tasks[0].title):tasks.length+' zadataka za rješavanje'}</h1><p>Učenik: ${escape(context.profile().name)}. Odgovor može biti broj, decimalni broj ili razlomak (npr. 3/4). U polje za postupak zapiši kako si došao do rješenja; provjera ocjenjuje upisani rezultat.</p></div><p id="sheet-status" role="status" aria-live="polite"></p><div id="worksheet-tasks">${tasks.map((task,i)=>taskHTML(task,i,refs[i])).join('')}</div><div class="row collection-actions"><button id="sheet-check-bottom" class="primary">Provjeri ${single?'rješenje':'cijeli list'}</button><button id="collection-back-bottom">← Sve oblasti</button></div>`;
    document.getElementById('collection-back').onclick=catalog;document.getElementById('collection-back-bottom').onclick=catalog;
    const next=document.getElementById('collection-next');if(next)next.onclick=()=>startTopic(ref.topicId,ref.seed%variants()+1);
    const jump=document.getElementById('collection-jump');if(jump)jump.onclick=()=>{const n=+document.getElementById('collection-variant').value;if(Number.isInteger(n)&&n>=1&&n<=variants())startTopic(ref.topicId,n);else document.getElementById('collection-variant').reportValidity();};
    document.querySelectorAll('[data-answer]').forEach(input=>input.oninput=()=>{const w=work();w.answers[input.dataset.task]||={};w.answers[input.dataset.task][input.dataset.answer]=input.value.slice(0,512);context.save();});
    document.querySelectorAll('[data-notes]').forEach(input=>input.oninput=()=>{work().notes[input.dataset.notes]=input.value.slice(0,6000);context.save();});
    document.querySelectorAll('[data-hint]').forEach(b=>b.onclick=()=>{const i=+b.dataset.hint;document.getElementById('task-hint-'+i).hidden=false;});
    document.querySelectorAll('[data-solution]').forEach(b=>b.onclick=()=>{const i=+b.dataset.solution,task=tasks[i],w=work();w.results[task.id]||={};if(!w.results[task.id].correct)w.results[task.id].assisted=true;context.save();document.getElementById('task-solution-'+i).hidden=false;});
    document.querySelectorAll('[data-check-task]').forEach(b=>b.onclick=()=>checkTasks(tasks,[+b.dataset.checkTask]));
    const checkAll=()=>checkTasks(tasks,tasks.map((_,i)=>i));document.getElementById('sheet-check').onclick=checkAll;document.getElementById('sheet-check-bottom').onclick=checkAll;
    document.getElementById('sheet-print').onclick=()=>printTasks(false);
    document.getElementById('sheet-print-solutions').onclick=()=>printTasks(true);
    document.getElementById('sheet-export').onclick=()=>exportSheet(tasks);
  }
  function taskHTML(task,i,ref) {
    const w=work(),answers=w.answers[task.id]||{},saved=w.results[task.id];
    return `<article class="card solving-task" data-task-id="${escape(task.id)}"><div class="row between"><span class="tag">Zadatak ${i+1} · ${escape(task.title)}${ref.seed?' · varijanta '+ref.seed:''}</span><span class="task-saved-status">${saved?.correct?'✓ Riješeno'+(saved.assisted?' uz postupak':' samostalno'):''}</span></div><p class="task-prompt">${escape(task.prompt)}</p><div class="task-fields">${task.fields.map((f,j)=>`<label>${escape(f.label)}<input id="task-${i}-field-${j}" data-answer="${escape(f.key)}" data-task="${escape(task.id)}" value="${escape(answers[f.key]||'')}" autocomplete="off" spellcheck="false" placeholder="${f.type==='list'?'Brojevi odvojeni razmakom ili ;':'Upiši rješenje'}"><span id="task-${i}-feedback-${j}" class="field-feedback" role="status"></span><span class="print-answer-line">________________________________</span></label>`).join('')}</div><label class="working-label">Moj postupak / bilješke<textarea data-notes="${escape(task.id)}" class="working-notes" placeholder="Zapiši račun, međurezultate ili obrazloženje…">${escape(w.notes[task.id]||'')}</textarea></label><div class="row task-actions"><button data-check-task="${i}" class="primary">Provjeri zadatak</button><button data-hint="${i}">Pomoć</button><button data-solution="${i}">Prikaži postupak</button></div><p id="task-hint-${i}" class="notice task-hint" hidden>${escape(task.hint)}</p><div id="task-solution-${i}" class="worked-solution" hidden><h3>Postupak rješavanja</h3><ol>${task.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol><p>${task.fields.map(f=>`${escape(f.label)}: <strong>${escape(f.answer)}</strong>`).join(' · ')}</p></div><p id="task-${i}-status" class="task-status" role="status"></p></article>`;
  }
  function checkTasks(tasks,indices) {
    const w=work();let correct=0;
    for(const i of indices){
      const task=tasks[i],answers=w.answers[task.id]||{},result=engine().check(task,answers),old=w.results[task.id]||{};
      if(result.correct)correct++;
      result.fields.forEach((r,j)=>{const node=document.getElementById(`task-${i}-feedback-${j}`);node.textContent=(r.correct?'✓ ':'')+r.message;node.className='field-feedback '+(r.correct?'success':'error');});
      w.results[task.id]={...old,correct:!!(old.correct||result.correct),lastCorrect:result.correct,attempts:(old.attempts||0)+1,grade:task.grade,title:task.title,date:new Date().toISOString()};
      document.getElementById(`task-${i}-status`).textContent=result.correct?'✓ Svi dijelovi su tačni. Zadatak je riješen.':'Provjeri označene dijelove. Možeš pokušati ponovo ili pogledati pomoć.';
    }
    context.save();document.getElementById('sheet-status').textContent=`Ova provjera: ${correct}/${indices.length} potpuno tačnih zadataka.`;
  }
  async function printTasks(solutions) {
    document.body.classList.add('printing-worksheet');if(solutions)document.body.classList.add('printing-solutions');
    try{await context.print();}finally{document.body.classList.remove('printing-worksheet','printing-solutions');}
  }
  function exportSheet(tasks) {
    const w=work();let body=`ELDI EDU — radni list\nUčenik: ${context.profile().name}\n\n`;
    tasks.forEach((t,i)=>{body+=`${i+1}. ${t.title}\n${t.prompt}\n`;t.fields.forEach(f=>body+=`${f.label}: ${w.answers[t.id]?.[f.key]||'________________'}\n`);body+=`Moj postupak:\n${w.notes[t.id]||''}\n\n`;});
    body+='POSTUPCI I RJEŠENJA\n\n';tasks.forEach((t,i)=>{body+=`${i+1}. ${t.title}\n${t.steps.map((s,j)=>`${j+1}) ${s}`).join('\n')}\n${t.fields.map(f=>f.label+': '+f.answer).join('\n')}\n\n`;});
    context.exportFile('ELDI-radni-list.txt',body);
  }
  function summary(profile) {
    const r=Object.values(profile.mathWork?.results||{});return {solved:r.filter(x=>x.correct).length,independent:r.filter(x=>x.correct&&!x.assisted).length,attempts:r.reduce((n,x)=>n+(x.attempts||0),0)};
  }
  return {mount,startTopic,summary,total,renderSession};
})();
