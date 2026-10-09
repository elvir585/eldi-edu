'use strict';
window.ELDIProgramAssessment=(()=>{
  const E=()=>window.ELDIProgramAssessmentEngine;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const languageNames={python:'Python',c:'C',cpp:'C++',java:'Java'};
  const statuses={'passed':'Tačno','wrong-answer':'Netačan izlaz','compile-error':'Greška kompajliranja','runtime-error':'Greška pri izvršavanju',timeout:'Prekoračeno vrijeme','output-limit':'Previše izlaza','not-run':'Nije pokrenut',cancelled:'Prekinut'};
  let context=null,currentId='pa-zbir',language='python',generation=0,busy=false,gradeLevel='all',category='all',query='',lastResult=null;
  const p=()=>typeof context.profile==='function'?context.profile():context.profile;
  const $=id=>context?.root.querySelector('#'+id);
  const task=()=>E().tasks.find(t=>t.id===currentId)||E().tasks[0];
  function state(){const profile=p();profile.programAssessment||=E().normalizeState();return profile.programAssessment;}
  function mount(options){destroy();context=options;if(!context?.root)throw Error('Nedostaje prostor programerske zbirke.');state();render();}
  function destroy(){window.ELDICodeEditor?.destroy('pa-code');generation++;if(busy)context?.cancelGrade?.();busy=false;context=null;lastResult=null;}
  function render(){
    const s=state(),progress=E().progress(s);
    context.root.innerHTML=`<section class="pa-hero"><div><div class="eyebrow">PROGRAMERSKA ZBIRKA / 5–9</div><h1>Od ideje do programa.</h1><p>55 originalnih zadataka · četiri jezika · provjera javnih i skrivenih testova</p></div><div class="pa-stat"><strong>${progress.completed}<span>/55</span></strong><span>potpuno riješeno</span><small>${progress.independent} samostalno · ${progress.attempts} pokušaja</small></div></section><div class="pa-filters card"><label>Razred<select id="pa-grade-filter"><option value="all">Svi razredi</option>${[5,6,7,8,9].map(g=>`<option value="${g}" ${gradeLevel===String(g)?'selected':''}>${g}. razred</option>`).join('')}</select></label><label>Oblast<select id="pa-category"><option value="all">Sve oblasti</option>${[...new Set(E().tasks.map(t=>t.category))].map(c=>`<option ${c===category?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label class="pa-search">Pronađi zadatak<input id="pa-search" maxlength="100" placeholder="Naziv, oblast ili pojam…" value="${esc(query)}"></label><button id="pa-history-toggle">Moji pokušaji</button></div><div class="pa-layout"><aside class="card pa-sidebar"><div class="pa-list-heading"><strong>Izaberi zadatak</strong><span id="pa-visible-count"></span></div><div id="pa-task-list" class="pa-task-list" role="list"></div></aside><article class="card pa-workbench"><div id="pa-statement"></div><div class="pa-editor-controls"><label>Programski jezik<select id="pa-language">${E().LANGUAGES.map(l=>`<option value="${l}" ${language===l?'selected':''}>${languageNames[l]}</option>`).join('')}</select></label><button id="pa-starter">Početni nacrt</button><button id="pa-solution">Riješen primjer</button><button id="pa-ai">Pitaj asistenta</button></div><label class="pa-code-label" for="pa-code">Moj programski kod</label><textarea id="pa-code" class="pa-code" spellcheck="false" aria-label="Programski kod"></textarea><div class="pa-run-bar"><button id="pa-grade" class="primary">Predaj i provjeri 8 testova</button><button id="pa-cancel" disabled>Zaustavi</button><span id="pa-status" role="status">Kod se čuva u tvom profilu.</span></div><div id="pa-result" class="pa-result" aria-live="polite"></div></article></div><section id="pa-history" class="card pa-history" hidden></section>`;
    $('pa-grade-filter').value=gradeLevel;
    $('pa-grade-filter').onchange=()=>{gradeLevel=$('pa-grade-filter').value;renderList();};
    $('pa-category').onchange=()=>{category=$('pa-category').value;renderList();};
    $('pa-search').oninput=()=>{query=$('pa-search').value;renderList();};
    $('pa-language').onchange=()=>{language=$('pa-language').value;loadEditor();};
    $('pa-code').oninput=saveDraft;
    $('pa-code').onkeydown=event=>{if(event.key==='Tab'){event.preventDefault();const e=event.target,a=e.selectionStart,b=e.selectionEnd;e.setRangeText('    ',a,b,'end');saveDraft();}if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){event.preventDefault();run();}};
    $('pa-starter').onclick=()=>{if(busy)return;$('pa-code').value=task().starters[language];saveDraft();$('pa-status').textContent='Početni nacrt je učitan.';};
    $('pa-grade').onclick=run;$('pa-cancel').onclick=()=>context.cancelGrade?.();
    $('pa-solution').onclick=showSolution;$('pa-ai').onclick=askAI;
    $('pa-history-toggle').onclick=()=>{const h=$('pa-history');h.hidden=!h.hidden;if(!h.hidden)renderHistory();};
    renderList();loadTask();window.ELDICodeEditor?.attach($('pa-code'),{language:()=>language,key:()=>task().id+':'+language,onRun:()=>run()});
  }
  function renderList(){
    const norm=x=>String(x).toLocaleLowerCase('bs');
    const list=E().tasks.filter(t=>(gradeLevel==='all'||t.grade===+gradeLevel)&&(category==='all'||t.category===category)&&(!query||norm(t.title+' '+t.category+' '+t.concepts.join(' ')).includes(norm(query))));
    $('pa-visible-count').textContent=String(list.length);
    const solved=new Set(state().attempts.filter(a=>a.passed===a.total).map(a=>a.taskId));
    $('pa-task-list').innerHTML=list.map(t=>`<button class="pa-task ${t.id===currentId?'selected':''}" data-pa-task="${t.id}" aria-pressed="${t.id===currentId}"><span class="pa-task-grade">${t.grade}</span><span><strong>${esc(t.title)}</strong><small>${esc(t.category)} · nivo ${t.difficulty}/5</small></span><span class="pa-task-done">${solved.has(t.id)?'✓':'↗'}</span></button>`).join('')||'<p>Nema zadataka za ove filtere.</p>';
    $('pa-task-list').querySelectorAll('[data-pa-task]').forEach(b=>{b.disabled=busy;b.onclick=()=>{currentId=b.dataset.paTask;lastResult=null;renderList();loadTask();};});
  }
  function loadTask(){
    const t=task();
    $('pa-statement').innerHTML=`<div class="pa-task-title"><span class="tag">${t.grade}. razred · nivo ${t.difficulty}/5${t.enrichment?' · napredna dopuna':''}</span><h2>${esc(t.title)}</h2></div><p>${esc(t.statement)}</p><details class="pa-task-details" open><summary>Ulaz, izlaz i javni primjeri</summary><div class="pa-formats"><p><strong>Ulaz</strong><br>${esc(t.inputFormat)}</p><p><strong>Izlaz i ograničenja</strong><br>${esc(t.outputFormat)}</p></div><div class="pa-samples">${t.sampleTests.map((sample,i)=>`<div><strong>Primjer ${i+1}</strong><div class="pa-sample-columns"><div><small>Ulaz</small><pre>${esc(sample.input)}</pre></div><div><small>Izlaz</small><pre>${esc(sample.output)}</pre></div></div></div>`).join('')}</div></details><details class="pa-hints"><summary>Kako da razmislim?</summary><ul>${t.concepts.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></details>`;
    $('pa-grade').textContent=`Predaj i provjeri ${t.testCount} testova`;
    $('pa-result').replaceChildren();loadEditor();
  }
  function loadEditor(){$('pa-code').value=state().drafts[task().id+':'+language]??task().starters[language];$('pa-result').replaceChildren();$('pa-status').textContent=state().assisted[task().id]?'Za ovaj zadatak korištena je pomoć.':'Kod se čuva u tvom profilu.';}
  function saveDraft(){
    const code=$('pa-code').value;if(new TextEncoder().encode(code).length>E().MAX_SOURCE){$('pa-status').textContent='Kod prelazi ograničenje od 128 KB; skrati ga prije čuvanja i predaje.';return;}
    const s=state(),key=task().id+':'+language,previous=s.drafts[key];s.drafts[key]=code;
    try{E().normalizeState(s);context.save?.();}catch(error){if(previous===undefined)delete s.drafts[key];else s.drafts[key]=previous;$('pa-status').textContent=error.message;}
  }
  function setBusy(value){busy=value;for(const id of ['pa-grade','pa-language','pa-starter','pa-solution','pa-ai','pa-grade-filter','pa-category','pa-search'])$(id).disabled=value;$('pa-code').readOnly=value;$('pa-cancel').disabled=!value;$('pa-task-list').querySelectorAll('button').forEach(b=>b.disabled=value);}
  async function run(){
    if(busy||!context)return;if(typeof context.runGrade!=='function'){$('pa-status').textContent='Provjera programa dostupna je u desktop EXE aplikaciji.';return;}
    const token=generation,profile=p(),t=task(),lang=language,code=$('pa-code').value;
    saveDraft();setBusy(true);$('pa-status').textContent='Izvršavanje javnih i skrivenih testova…';$('pa-result').replaceChildren();
    try{
      const result=await context.runGrade({taskId:t.id,language:lang,code});
      if(token!==generation||!context||p()!==profile)return;
      if(!result||result.error)throw Error(result?.error||'Provjera nije uspjela.');
      const s=state();E().record(s,result,!!s.assisted[t.id]);if(!result.cancelled)context.save?.();lastResult=result;renderResult(result);renderList();
      $('pa-status').textContent=result.cancelled?(result.deadline?'Prekoračeno ukupno vrijeme provjere; rezultat nije sačuvan.':'Provjera je prekinuta; rezultat nije sačuvan.'):'Rezultat je sačuvan u tvom profilu.';
    }catch(error){if(token===generation&&context)$('pa-status').textContent=error.message||'Provjera nije uspjela.';}
    finally{if(token===generation&&context)setBusy(false);}
  }
  function renderResult(result){
    $('pa-result').innerHTML=`<div class="pa-score"><div><strong>${result.passed}/${result.total}</strong><span>prošlih testova · ${result.percentage.toFixed(1)}%</span></div><div><strong>${result.cancelled?'—':result.grade}</strong><span>${result.cancelled?'prekinuta provjera':'ocjena u aplikaciji'}</span></div></div><p class="pa-result-note">${state().assisted[result.taskId]?'Pokušaj uz pomoć.':'Samostalan pokušaj.'} Skala: 2 od 50%, 3 od 65%, 4 od 80%, 5 od 90%. Skriveni testovi pokazuju rezultat provjere.</p><div class="pa-test-grid">${result.tests.map(r=>`<div class="pa-test ${r.passed?'passed':''}"><span>${r.public?'Javni':'Skriveni'} test ${r.index}</span><strong>${esc(statuses[r.status]||r.status)}</strong>${r.public?`<details><summary>Pregled izlaza</summary><pre>Ulaz:\n${esc(r.input||'')}\nOčekivano:\n${esc(r.expected||'')}\nDobijeno:\n${esc(r.actual||'')}${r.error?'\nPoruka:\n'+esc(r.error):''}</pre></details>`:''}</div>`).join('')}</div><div class="pa-result-actions"><button id="pa-export-result">Sačuvaj izvještaj</button><button id="pa-print-result">Štampaj rezultat</button></div>`;
    $('pa-export-result').onclick=exportReport;$('pa-print-result').onclick=async()=>{document.body.classList.add('printing-program-assessment');try{await context.print?.();}finally{document.body.classList.remove('printing-program-assessment');}};
  }
  function markAssisted(id=task()?.id){if(!context||!E().tasks.some(t=>t.id===id))return;state().assisted[id]=true;context.save?.();if(task().id===id)$('pa-status').textContent='Pomoć je korištena; naredni pokušaj se bilježi uz pomoć.';}
  async function showSolution(){
    if(busy||!context)return;
    if(typeof context.getSolution!=='function'){$('pa-status').textContent='Riješeni primjer dostupan je u desktop aplikaciji.';return;}
    if(!['python','cpp'].includes(language)){$('pa-status').textContent='Odaberi Python ili C++ za referentno rješenje. Svoj program možeš predati u sva četiri jezika.';return;}
    const token=generation,id=task().id,lang=language;setBusy(true);
    try{const response=await context.getSolution({taskId:id,language:lang});if(token!==generation||!context)return;if(!response?.code||response.error)throw Error(response?.error||'Primjer nije dostupan.');
      $('pa-result').innerHTML=`<section class="pa-reference"><span class="tag">RIJEŠEN PRIMJER / ${languageNames[lang]}</span><h3>Pročitaj, objasni, pa pokušaj sam.</h3><p>Ovaj primjer koristi se kao pomoć u učenju. Ne pokreće se automatski.</p><pre>${esc(response.code)}</pre><button id="pa-use-solution">Učitaj u editor</button></section>`;markAssisted(id);
      $('pa-use-solution').onclick=()=>{$('pa-code').value=response.code;saveDraft();$('pa-code').focus();};
    }catch(error){if(token===generation&&context)$('pa-status').textContent=error.message;}
    finally{if(token===generation&&context)setBusy(false);}
  }
  function getContext(){if(!context)return{title:'Programerska zbirka',subject:'informatics'};const t=task();return{title:t.title,subject:'Informatika — programiranje',grade:t.grade,statement:t.statement+'\nUlaz: '+t.inputFormat+'\nIzlaz: '+t.outputFormat,language,code:$('pa-code')?.value||'',input:t.sampleTests[0].input,output:lastResult?.tests?.find(r=>r.public)?.actual||''};}
  function askAI(){const t=task(),token=generation;if(!context.askAI){$('pa-status').textContent='Asistent nije dostupan.';return;}context.askAI(getContext(),()=>{if(token===generation)markAssisted(t.id);});}
  function renderHistory(){const rows=state().attempts.slice().reverse();$('pa-history').innerHTML=`<h2>Moji posljednji pokušaji</h2>${rows.length?`<div class="pa-history-scroll"><table><thead><tr><th>Zadatak</th><th>Jezik</th><th>Testovi</th><th>Ocjena</th><th>Rad</th><th>Datum</th></tr></thead><tbody>${rows.map(a=>`<tr><td>${esc(E().tasks.find(t=>t.id===a.taskId).title)}</td><td>${languageNames[a.language]}</td><td>${a.passed}/${a.total}</td><td>${a.grade}</td><td>${a.assisted?'Uz pomoć':'Samostalno'}</td><td>${esc(new Date(a.date).toLocaleString('bs-BA'))}</td></tr>`).join('')}</tbody></table></div>`:'<p>Još nema predatih programa.</p>'}`;}
  async function exportReport(){if(!lastResult)return;const t=E().tasks.find(t=>t.id===lastResult.taskId),r=lastResult,text=`ELDI EDU — programerska provjera\nUčenik: ${p().name}\nZadatak: ${t.title}\nJezik: ${languageNames[r.language]}\nTestovi: ${r.passed}/${r.total}\nProcenat: ${r.percentage.toFixed(1)}%\nOcjena: ${r.grade}\nPomoć: ${state().assisted[t.id]?'korištena':'nije korištena'}\n\n${r.tests.map(x=>`${x.public?'Javni':'Skriveni'} test ${x.index}: ${statuses[x.status]||x.status}`).join('\n')}\n`;if(context.exportFile)await context.exportFile(`ELDI-program-${t.id}.txt`,text,'text/plain;charset=utf-8');else{const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`ELDI-program-${t.id}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}}
  function selectTask(id){if(!context||busy||!E().tasks.some(t=>t.id===id))return false;currentId=id;lastResult=null;renderList();loadTask();return true;}
  return{mount,destroy,run,markAssisted,getContext,selectTask};
})();
