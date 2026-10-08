'use strict';
window.ELDIMathNotebook=(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const engine=()=>window.EduMathNotebook;
  const pointName=index=>index<26?String.fromCharCode(65+index):'P'+(index+1);
  let context,task,tab='working',currentResult=null;
  const q=id=>context.root.querySelector('#'+id);
  const state=()=>context.profile().mathNotebook;
  function mount(options){
    context=options;
    context.profile().mathNotebook=engine().normalizeState(context.profile().mathNotebook);
    tab='working';currentResult=null;render();
  }
  function attempt(){
    const s=state();
    if(!s.attempts[task.id]){
      if(Object.keys(s.attempts).length>=200){const oldest=Object.keys(s.attempts).sort((a,b)=>String(s.attempts[a].updatedAt).localeCompare(String(s.attempts[b].updatedAt)))[0];delete s.attempts[oldest];}
      s.attempts[task.id]={lines:['',''],notes:'',assisted:false,updatedAt:new Date().toISOString()};
    }
    return s.attempts[task.id];
  }
  function persist(){attempt().updatedAt=new Date().toISOString();context.save();}
  function savedInfo(){const total=summary(context.profile());return `${total.complete} završenih postupaka · ${total.independent} samostalno · rad ostaje na ovom profilu`;}
  function render(){
    const s=state();task=engine().generateTask(s.grade,s.type,s.seed);
    context.root.innerHTML=`<div class="math-notebook"><div class="mn-interactive"><div class="mn-hero"><div><div class="eyebrow">MATEMATIKA / DIGITALNA SVESKA</div><h1>Svaki korak ima smisla.</h1><p>Piši postupak, provjeri jednakost i nacrtaj ono što računaš.</p></div><div class="mn-hero-score"><strong>${summary(context.profile()).complete}</strong><span>završenih postupaka</span></div></div><div class="mn-tabs row" role="group" aria-label="Dijelovi sveske"><button id="mn-tab-working" class="${tab==='working'?'primary':''}">✎ Moji koraci</button><button id="mn-tab-geometry" class="${tab==='geometry'?'primary':''}">◇ Crtanje i grafikoni</button><button id="mn-tab-history" class="${tab==='history'?'primary':''}">◷ Sačuvani radovi</button></div><div id="mn-content"></div><p id="mn-message" role="status" aria-live="polite"></p><p class="mn-storage-note">${esc(savedInfo())}. Uvoz profila čuva i svesku.</p></div><div id="mn-print-sheet" class="mn-print-sheet"></div></div>`;
    q('mn-tab-working').onclick=()=>{tab='working';render();};
    q('mn-tab-geometry').onclick=()=>{tab='geometry';render();};
    q('mn-tab-history').onclick=()=>{tab='history';render();};
    if(tab==='working')renderWorking();else if(tab==='geometry')renderGeometry();else renderHistory();
  }
  function renderWorking(){
    const s=state(),work=attempt();currentResult=null;
    q('mn-content').innerHTML=`<div class="mn-selection card"><div class="row"><label>Razred<select id="mn-grade">${[5,6,7,8,9].map(g=>`<option value="${g}" ${g===s.grade?'selected':''}>${g}. razred</option>`).join('')}</select></label><label>Oblast<select id="mn-type">${engine().types.filter(t=>t.grades.includes(s.grade)).map(t=>`<option value="${t.id}" ${t.id===s.type?'selected':''}>${esc(t.title)}</option>`).join('')}</select></label><label>Varijanta<input id="mn-seed" type="number" min="1" max="9999" value="${s.seed}"></label><button id="mn-jump">Otvori</button><button id="mn-next">Sljedeći →</button></div></div><div class="mn-work-grid"><article class="card mn-pad"><span class="tag">${s.grade}. razred · ${esc(task.title)} · ${s.seed}</span><h2>${esc(task.prompt)}</h2><div class="mn-source">${esc(task.source)}</div><p class="mn-instruction">${esc(task.hint)}</p><div id="mn-lines"></div><div class="row mn-row-actions"><button id="mn-add-line">+ Dodaj korak</button><button id="mn-check" class="primary">Provjeri postupak</button></div><div id="mn-result" role="status" aria-live="polite"></div><label class="mn-notes-label">Obrazloženje i bilješke<textarea id="mn-notes" maxlength="4000" placeholder="Zašto si uradio ovu operaciju? Šta ti je bilo teško?">${esc(work.notes)}</textarea></label><p class="mn-limits">Automatski se provjeravaju prikazani računski koraci i linearne jednačine. Tekstualno obrazloženje i dokaze pregleda nastavnik.</p></article><aside class="mn-help"><article class="card"><div class="eyebrow">OD IDEJE DO RJEŠENJA</div><h3>Kako se boduje?</h3><div class="mn-point-row"><strong>60</strong><span>bodova za različite tačne međukorake</span></div><div class="mn-point-row"><strong>40</strong><span>bodova za konačan odgovor</span></div><p>Ponavljanje istog reda ne donosi dodatne bodove. Sam konačan odgovor donosi 40/100. Poslije greške bodovi za naredne međukorake čekaju ispravku.</p><p>Za ovaj zadatak treba najmanje <strong>${task.minIntermediate}</strong> međukorak${task.minIntermediate===1?'':'a'}.</p></article><article class="card"><h3>Pomoć pri učenju</h3><button id="mn-hint">Prikaži smjernicu</button><p id="mn-hint-body" hidden>${esc(task.hint)}</p><button id="mn-solution">Pogledaj riješen primjer</button><div id="mn-solution-body" hidden><ol>${task.solution.map(line=>`<li><code>${esc(line)}</code></li>`).join('')}</ol><p>Pregled primjera označava ovaj rad kao rad uz pomoć.</p></div>${typeof context.askAI==='function'?'<button id="mn-ai">✦ Pitaj AI asistenta</button>':''}<p class="mn-assistance">${work.assisted?'Ovaj rad je označen: uz pomoć.':'Trenutno: samostalan rad.'}</p></article><article class="card mn-file-actions"><h3>Moj radni list</h3><button id="mn-export">Sačuvaj svesku (JSON)</button><label class="mn-import-label">Uvezi svesku<input id="mn-import" type="file" accept="application/json,.json"></label><button id="mn-print">Štampaj zadatak</button><button id="mn-print-solutions">Štampaj s postupkom</button></article></aside></div>`;
    renderLines();
    q('mn-grade').onchange=e=>{s.grade=Number(e.target.value);if(!engine().types.some(t=>t.id===s.type&&t.grades.includes(s.grade)))s.type='arithmetic';context.save();render();};
    q('mn-type').onchange=e=>{s.type=e.target.value;context.save();render();};
    const jump=()=>{const value=Number(q('mn-seed').value);if(!Number.isInteger(value)||value<1||value>9999){q('mn-seed').reportValidity();return;}s.seed=value;context.save();render();};
    q('mn-jump').onclick=jump;q('mn-seed').onkeydown=e=>{if(e.key==='Enter')jump();};
    q('mn-next').onclick=()=>{s.seed=s.seed%9999+1;context.save();render();};
    q('mn-add-line').onclick=()=>{if(work.lines.length>=40){message('Sveska podržava najviše 40 redova po zadatku.');return;}work.lines.push('');persist();renderLines();q('mn-line-'+(work.lines.length-1)).focus();};
    q('mn-check').onclick=()=>{currentResult=engine().gradeSteps(task,work.lines);renderFeedback();persist();};
    q('mn-notes').oninput=e=>{work.notes=e.target.value;persist();};
    q('mn-hint').onclick=()=>{q('mn-hint-body').hidden=!q('mn-hint-body').hidden;};
    q('mn-solution').onclick=()=>{work.assisted=true;persist();q('mn-solution-body').hidden=!q('mn-solution-body').hidden;q('mn-content').querySelector('.mn-assistance').textContent='Ovaj rad je označen: uz pomoć.';};
    if(q('mn-ai'))q('mn-ai').onclick=()=>{
      const origin=context,originTask=task,originProfile=context.profile();
      origin.askAI({title:originTask.title,grade:originTask.grade,subject:'math',statement:originTask.prompt+'\n'+originTask.source,input:'Moji koraci:\n'+work.lines.join('\n')+'\nBilješke: '+work.notes},()=>{work.assisted=true;origin.save();if(context===origin&&context.profile()===originProfile&&task.id===originTask.id&&q('mn-content')?.querySelector('.mn-assistance'))q('mn-content').querySelector('.mn-assistance').textContent='Ovaj rad je označen: uz pomoć.';});
    };
    q('mn-export').onclick=exportNotebook;q('mn-import').onchange=importNotebook;
    q('mn-print').onclick=()=>printWorksheet(false);q('mn-print-solutions').onclick=()=>printWorksheet(true);
  }
  function renderLines(){
    const work=attempt();
    q('mn-lines').innerHTML=work.lines.map((line,i)=>`<div class="mn-step" data-row="${i}"><label for="mn-line-${i}" class="mn-step-number">${i+1}</label><div class="mn-step-field"><input id="mn-line-${i}" data-mn-line="${i}" maxlength="700" autocomplete="off" spellcheck="false" aria-label="Korak ${i+1}" placeholder="${esc(i===0?'Napiši prvi ekvivalentan korak':'Sljedeća jednakost ili konačan rezultat')}" value="${esc(line)}"><span id="mn-feedback-${i}" class="mn-feedback" role="status"></span></div><button data-mn-remove="${i}" class="mn-remove" aria-label="Ukloni korak ${i+1}" title="Ukloni korak">×</button></div>`).join('');
    q('mn-lines').querySelectorAll('[data-mn-line]').forEach(input=>{input.oninput=()=>{work.lines[Number(input.dataset.mnLine)]=input.value;currentResult=null;q('mn-result').innerHTML='';q('mn-lines').querySelectorAll('.mn-feedback').forEach(n=>{n.textContent='';n.className='mn-feedback';});persist();};input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();const i=Number(input.dataset.mnLine);if(i===work.lines.length-1)q('mn-add-line').click();else q('mn-line-'+(i+1)).focus();}};});
    q('mn-lines').querySelectorAll('[data-mn-remove]').forEach(button=>button.onclick=()=>{work.lines.splice(Number(button.dataset.mnRemove),1);if(!work.lines.length)work.lines.push('');currentResult=null;q('mn-result').innerHTML='';persist();renderLines();});
  }
  function renderFeedback(){
    currentResult.rows.forEach((row,i)=>{const node=q('mn-feedback-'+i);if(!node)return;node.textContent=(row.valid===null?'':row.valid?'✓ ':'! ')+row.message;node.className='mn-feedback '+(row.valid===null?'':row.valid?'success':'error');});
    q('mn-result').innerHTML=`<div class="mn-result ${currentResult.complete?'mn-complete':''}"><strong>${currentResult.score}<small>/100</small></strong><div><b>${esc(currentResult.message)}</b><p>Postupak ${currentResult.processPoints}/60 · odgovor ${currentResult.answerPoints}/40${attempt().assisted?' · uz pomoć':''}</p></div></div>`;
    context.root.querySelector('.mn-storage-note').textContent=savedInfo()+'. Uvoz profila čuva i svesku.';
  }
  function message(text){q('mn-message').textContent=text;}
  function exportNotebook(){
    context.exportFile?.('ELDI-matematicka-sveska.json',JSON.stringify({app:'ELDI Math Notebook',version:1,student:context.profile().name,state:engine().normalizeState(state())},null,2));
  }
  async function importNotebook(event){
    const origin=context,profile=context.profile(),file=event.target.files?.[0];if(!file)return;
    try{
      if(file.size>6*1024*1024)throw new Error('JSON sveske može imati najviše 6 MB.');
      const data=JSON.parse(await file.text());if(data.app!=='ELDI Math Notebook'||data.version!==1)throw new Error('Odaberi izvezeni JSON matematičke sveske.');
      const imported=engine().normalizeState(data.state);
      if(context!==origin||context.profile()!==profile)return;
      const merged={...profile.mathNotebook.attempts,...imported.attempts};if(Object.keys(merged).length>200)throw new Error('Zajedno ima više od 200 radova. Uvezi manju svesku.');
      profile.mathNotebook={...imported,attempts:merged};origin.save();render();message('Sveska je uvezena. Radovi iz datoteke zamjenjuju iste varijante; ostali radovi su sačuvani.');
    }catch(error){if(context===origin&&context.profile()===profile)message(error.message);}
  }
  async function printWorksheet(solutions){
    const work=attempt();q('mn-print-sheet').innerHTML=`<h1>ELDI EDU — matematička sveska</h1><p>Učenik: ${esc(context.profile().name)} · ${task.grade}. razred · varijanta ${task.seed}</p><h2>${esc(task.title)}</h2><p>${esc(task.prompt)}</p><p><strong>${esc(task.source)}</strong></p>${solutions?'<h3>Postupak rješavanja</h3><ol>'+task.solution.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>':'<h3>Moj postupak</h3>'+Array.from({length:8},(_,i)=>`<p class="mn-print-line">${i+1}. ____________________________________________________________</p>`).join('')}<p>Bilješka nastavnika: __________________________________________________</p><p>Postupak: ____/60 · Odgovor: ____/40 · Ukupno: ____/100</p><footer>Dino Isanović · Elvir Čajić · Damir Bajrić · Jasmin Suljkanović</footer>`;
    document.body.classList.add('printing-notebook');try{if(context.print)await context.print();else window.print();}finally{document.body.classList.remove('printing-notebook');}
  }
  function renderHistory(){
    const rows=Object.entries(state().attempts).map(([id,work])=>{const match=/^notebook-([5-9])-([A-Za-z]+)-(\d+)$/.exec(id);const t=engine().generateTask(Number(match[1]),match[2],Number(match[3]));return {id,task:t,work,result:engine().gradeSteps(t,work.lines)};}).sort((a,b)=>b.work.updatedAt.localeCompare(a.work.updatedAt));
    q('mn-content').innerHTML=`<article class="card"><div class="row between"><div><h2>Sačuvani radovi</h2><p>Do 200 zadataka na ovom profilu. Rezultati se ponovo provjeravaju iz sačuvanih koraka.</p></div><button id="mn-history-export">Sačuvaj svesku (JSON)</button></div>${rows.length?'<div class="mn-history-list">'+rows.map(row=>`<button class="mn-history-row" data-mn-open="${row.id}"><span><b>${esc(row.task.title)}</b><small>${row.task.grade}. razred · varijanta ${row.task.seed} · ${row.work.assisted?'uz pomoć':'samostalno'}</small></span><strong>${row.result.score}/100 ${row.result.complete?'✓':''}</strong></button>`).join('')+'</div>':'<p>Prvi postupak će se pojaviti ovdje čim otvoriš zadatak i počneš pisati.</p>'}</article>`;
    q('mn-history-export').onclick=exportNotebook;
    q('mn-content').querySelectorAll('[data-mn-open]').forEach(button=>button.onclick=()=>{const match=/^notebook-([5-9])-([A-Za-z]+)-(\d+)$/.exec(button.dataset.mnOpen);openTask(Number(match[1]),match[2],Number(match[3]));});
  }
  function renderGeometry(){
    const g=state().geometry;
    q('mn-content').innerHTML=`<div class="mn-geometry-grid"><article class="card mn-drawing"><div class="row between"><h2>Geometrijska skica</h2><span class="tag">Mijenjaj podatke · prati rezultat</span></div><svg id="mn-svg" class="mn-svg" viewBox="0 0 500 400" role="img" aria-label="Interaktivna geometrijska skica ili koordinatni sistem"></svg><p id="mn-drawing-help">${g.mode==='graph'?'Klikni na mrežu za novu tačku. Postojeću tačku možeš povući. Koordinate se zaokružuju na pola jedinice.':'Skica je razmjerna; dimenzije mijenjaj klizačima. Dužine su u istim izabranim jedinicama.'}</p></article><aside class="mn-help"><article class="card"><label>Figura ili grafikon<select id="mn-figure"><option value="rectangle">Pravougaonik</option><option value="triangle">Trougao — baza i visina</option><option value="circle">Krug</option><option value="graph">Linearna funkcija i tačke</option></select></label><div id="mn-dimensions"></div><div id="mn-geometry-results"></div></article><article class="card"><h3>Skica u svesci</h3><p>Promjene se čuvaju na ovom profilu. Površina trougla koristi izabranu bazu i visinu; nacrtan je jednakokraki primjer sa tim dimenzijama.</p><button id="mn-sketch-export">Sačuvaj svesku i skicu</button>${g.mode==='graph'?'<div class="mn-add-point row"><label>x<input id="mn-point-x" type="number" min="-10" max="10" step="0.5" value="0"></label><label>y<input id="mn-point-y" type="number" min="-10" max="10" step="0.5" value="0"></label></div><button id="mn-point-add">+ Dodaj tačku</button><button id="mn-points-clear">Obriši tačke</button><div id="mn-point-list"></div>':''}</article></aside></div>`;
    q('mn-figure').value=g.mode;q('mn-figure').onchange=e=>{g.mode=e.target.value;context.save();renderGeometry();};
    const fields=g.mode==='graph'?[['slope','Koeficijent a',-5,5,.5],['intercept','Odsječak b',-10,10,.5]]:g.mode==='circle'?[['r','Poluprečnik r',1,10,.5]]:[['a',g.mode==='triangle'?'Baza a':'Stranica a',1,20,.5],['b',g.mode==='triangle'?'Visina h':'Stranica b',1,20,.5]];
    q('mn-dimensions').innerHTML=fields.map(([key,label,min,max,step])=>`<label class="mn-slider-label">${esc(label)} <output id="mn-value-${key}">${g[key]}</output><input type="range" data-mn-dimension="${key}" min="${min}" max="${max}" step="${step}" value="${g[key]}"></label>`).join('');
    q('mn-dimensions').querySelectorAll('[data-mn-dimension]').forEach(input=>input.oninput=()=>{g[input.dataset.mnDimension]=Number(input.value);q('mn-value-'+input.dataset.mnDimension).textContent=input.value;context.save();drawGeometry();});
    q('mn-sketch-export').onclick=exportNotebook;
    if(q('mn-points-clear'))q('mn-points-clear').onclick=()=>{g.points=[];context.save();drawGeometry();};
    if(q('mn-point-add'))q('mn-point-add').onclick=()=>{
      const x=q('mn-point-x'),y=q('mn-point-y');
      if(!x.reportValidity()||!y.reportValidity())return;
      if(!x.value.trim()||!y.value.trim()){message('Unesi obje koordinate tačke.');return;}
      if(g.points.length>=30){message('Na skici može biti najviše 30 tačaka.');return;}
      g.points.push({x:Number(x.value),y:Number(y.value)});context.save();drawGeometry();
    };
    drawGeometry();
  }
  function drawGeometry(){
    const g=state().geometry,svg=q('mn-svg');let shapes='';
    if(g.mode==='graph'){
      for(let i=-10;i<=10;i++){shapes+=`<line class="mn-grid-line" x1="${250+i*20}" y1="0" x2="${250+i*20}" y2="400"/><line class="mn-grid-line" x1="50" y1="${200+i*20}" x2="450" y2="${200+i*20}"/>`;if(i!==0&&i%2===0)shapes+=`<text class="mn-axis-label" x="${250+i*20+2}" y="214">${i}</text><text class="mn-axis-label" x="254" y="${200-i*20-3}">${i}</text>`;}
      shapes+='<line class="mn-axis" x1="40" y1="200" x2="462" y2="200"/><line class="mn-axis" x1="250" y1="0" x2="250" y2="400"/><text class="mn-axis-label" x="468" y="195">x</text><text class="mn-axis-label" x="256" y="14">y</text>';
      shapes+=`<line class="mn-function" x1="50" y1="${200-(-10*g.slope+g.intercept)*20}" x2="450" y2="${200-(10*g.slope+g.intercept)*20}"/>`;
      shapes+=g.points.map((p,i)=>`<circle data-mn-point="${i}" class="mn-point" cx="${250+p.x*20}" cy="${200-p.y*20}" r="6"/><text class="mn-point-label" x="${258+p.x*20}" y="${192-p.y*20}">${pointName(i)}</text>`).join('');
    }else if(g.mode==='rectangle'){
      const w=g.a*17,h=g.b*17,x=250-w/2,y=200-h/2;
      shapes=`<rect class="mn-shape" x="${x}" y="${y}" width="${w}" height="${h}"/><text class="mn-dimension-text" x="250" y="${y+h+24}" text-anchor="middle">a = ${g.a}</text><text class="mn-dimension-text" x="${x+w+12}" y="205">b = ${g.b}</text>`;
    }else if(g.mode==='triangle'){
      const w=g.a*17,h=g.b*17,x=250-w/2,y=200+h/2;
      shapes=`<polygon class="mn-shape" points="${x},${y} ${x+w},${y} 250,${y-h}"/><line class="mn-height" x1="250" y1="${y}" x2="250" y2="${y-h}"/><path class="mn-height" d="M250 ${y-10} h10 v10"/><text class="mn-dimension-text" x="250" y="${y+24}" text-anchor="middle">a = ${g.a}</text><text class="mn-dimension-text" x="260" y="200">h = ${g.b}</text>`;
    }else{
      shapes=`<circle class="mn-shape" cx="250" cy="200" r="${g.r*17}"/><line class="mn-height" x1="250" y1="200" x2="${250+g.r*17}" y2="200"/><circle class="mn-center" cx="250" cy="200" r="3"/><text class="mn-dimension-text" x="${250+g.r*8.5}" y="188" text-anchor="middle">r = ${g.r}</text>`;
    }
    svg.innerHTML=shapes;
    const data=engine().calculateFigure(g.mode,g);
    q('mn-geometry-results').innerHTML=data.results.map(r=>`<div class="mn-measure"><span>${esc(r.label)}</span><strong>${esc(typeof r.value==='number'?Number(r.value.toFixed(5)):r.value)} ${esc(r.unit)}</strong><small>${esc(r.formula)}</small></div>`).join('')+(data.points?'<p class="mn-coordinate-table">'+data.points.map(p=>`(${esc(p.x)}; ${esc(p.y)})`).join(' · ')+'</p>':'');
    if(g.mode==='graph'){
      q('mn-point-list').innerHTML=g.points.map((p,i)=>`<div class="mn-point-entry"><span>${pointName(i)}(${p.x}; ${p.y})</span><button data-mn-remove-point="${i}" aria-label="Ukloni tačku ${pointName(i)}">×</button></div>`).join('');
      q('mn-point-list').querySelectorAll('[data-mn-remove-point]').forEach(button=>button.onclick=()=>{g.points.splice(Number(button.dataset.mnRemovePoint),1);context.save();drawGeometry();});
      let dragIndex=null,moved=false;
      const coordinates=e=>{const point=svg.createSVGPoint();point.x=e.clientX;point.y=e.clientY;const matrix=svg.getScreenCTM();if(!matrix)return null;const p=point.matrixTransform(matrix.inverse());return {x:Math.max(-10,Math.min(10,Math.round((p.x-250)/10)/2)),y:Math.max(-10,Math.min(10,Math.round((200-p.y)/10)/2))};};
      svg.onpointerdown=e=>{const index=e.target.getAttribute?.('data-mn-point');if(index!==null&&index!==undefined){dragIndex=Number(index);moved=false;svg.setPointerCapture?.(e.pointerId);}};
      svg.onpointermove=e=>{if(dragIndex===null)return;const p=coordinates(e);if(!p)return;g.points[dragIndex]=p;moved=true;const circle=svg.querySelector(`[data-mn-point="${dragIndex}"]`);circle.setAttribute('cx',String(250+p.x*20));circle.setAttribute('cy',String(200-p.y*20));};
      svg.onpointerup=e=>{if(dragIndex!==null){const index=dragIndex;dragIndex=null;context.save();drawGeometry();if(!moved)message('Tačka '+pointName(index)+' — povuci za promjenu koordinata.');}else if(!e.target.getAttribute?.('data-mn-point')){const p=coordinates(e);if(!p)return;if(g.points.length>=30){message('Na skici može biti najviše 30 tačaka.');return;}g.points.push(p);context.save();drawGeometry();}};
      svg.onpointercancel=()=>{dragIndex=null;context.save();drawGeometry();};
    }else{svg.onpointerdown=null;svg.onpointermove=null;svg.onpointerup=null;svg.onpointercancel=null;}
  }
  function openTask(grade,type,seed){engine().generateTask(grade,type,seed);Object.assign(state(),{grade,type,seed});tab='working';context.save();render();}
  function summary(profile){
    let complete=0,independent=0,attempted=0;
    for(const [id,work] of Object.entries(profile.mathNotebook?.attempts||{})){
      try{const match=/^notebook-([5-9])-([A-Za-z]+)-(\d+)$/.exec(id);if(!match)continue;const result=engine().gradeSteps(engine().generateTask(Number(match[1]),match[2],Number(match[3])),work.lines);if(work.lines.some(s=>s.trim()))attempted++;if(result.complete){complete++;if(!work.assisted)independent++;}}catch(_){/* invalid imports are rejected by normalizeState */}
    }
    return {complete,independent,attempted};
  }
  function markAssisted(){if(!context||!task)return;attempt().assisted=true;persist();const label=context.root.querySelector('.mn-assistance');if(label)label.textContent='Ovaj rad je označen: uz pomoć.';}
  function getContext(){return{title:task?.title||'Matematička sveska',subject:'math',grade:task?.grade,statement:task?task.prompt+'\n'+task.source:'',input:task?'Moji koraci:\n'+attempt().lines.join('\n')+'\nBilješke: '+attempt().notes:''};}
  return Object.freeze({mount,openTask,summary,markAssisted,getContext});
})();
