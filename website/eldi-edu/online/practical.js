'use strict';
let practicalWorkspace=null;
function setupTaskBlocks(){
 if(Blockly.Blocks.task_read)return;
 const statement=(type,message,args,colour,extra={})=>({type,message0:message,args0:args,previousStatement:null,nextStatement:null,colour,...extra});
 const text=(name,value)=>({type:'field_input',name,text:value});
 Blockly.defineBlocksWithJsonArray([
  statement('task_read','učitaj cijeli broj u %1',[text('NAME','n')],210),
  statement('task_set','postavi %1 na %2',[text('NAME','s'),text('EXPR','0')],260),
  statement('task_print','ispiši %1',[text('EXPR','s')],160),
  statement('task_if','ako %1',[text('EXPR','n > 0')],30,{message1:'onda %1',args1:[{type:'input_statement',name:'DO'}],message2:'inače %1',args2:[{type:'input_statement',name:'ELSE'}]}),
  statement('task_for','za %1 od %2 do (bez) %3 korak %4',[text('NAME','i'),text('FROM','1'),text('TO','n + 1'),text('STEP','1')],120,{message1:'radi %1',args1:[{type:'input_statement',name:'DO'}]}),
  statement('task_while','dok %1',[text('EXPR','n > 0')],120,{message1:'radi %1',args1:[{type:'input_statement',name:'DO'}]})
 ]);
}
function programHelp(){return `<details><summary>Podržane naredbe i primjer</summary><p>Python — školski režim: brojevi do 10¹², promjenljive, + − * / // % ** (eksponent do 12), poređenja, and / or / not, int(input()), float(input()), print(), abs(), min(), max(), if / elif / else, for … in range(), while, break, continue, pass. Uvlačenje: 4 razmaka. Svaki input() čita jedan broj iz novog reda.</p><p>Ovaj režim nema biblioteke, datoteke, mrežu, liste, tekstualne vrijednosti ni korisničke funkcije. Za puni Python koristi Windows izdanje. Najviše 200 naredbi, 40.000 koraka po ulaznom primjeru; beskonačna petlja se zaustavlja.</p><pre class="program-code">n = int(input())
s = 0
for i in range(1, n + 1):
    s += i
print(s)</pre><p>Blokovi: prevuci naredbe iz lijeve trake i spoji ih u jedan niz. U bijela polja upiši imena i izraze, npr. n % 2 == 0. „do (bez)“ izostavlja krajnju vrijednost, kao range u Pythonu.</p></details>`;}
async function openPractical(a,done){
 if(practicalWorkspace){practicalWorkspace.dispose();practicalWorkspace=null;}
 const locked=Number(a.closed)||(Number(a.due_at)&&Date.now()/1000>Number(a.due_at));
 app.innerHTML=`<button id="back">← Moji zadaci</button><p class="eyebrow">PRAKTIČNA PROVJERA · PYTHON I BLOKOVI</p><h1>${esc(a.title)}</h1><section class="panel"><p class="assignment-text">${esc(a.instructions)}</p>${done?`<h2>Rad je predan.</h2><div class="score">${done.score} / ${done.max_score}</div><p>Ocjena: <b>${esc(done.grade)}</b></p><p>${esc(done.feedback)}</p><h3>Tvoje rješenje (${esc(done.payload.language)})</h3><pre class="program-code">${esc(done.payload.source)}</pre><details><summary>Primjer rješenja</summary><pre class="program-code">${esc(a.practical.reference)}</pre></details>`:locked?'<h2>Predaja je zatvorena.</h2>':`<h2>Probni ulazi</h2><div class="two">${a.practical.examples.map((e,i)=>`<article><b>Primjer ${i+1}</b><p>Ulaz (jedan broj po redu):</p><pre>${esc(e.input.join('\n'))}</pre><p>Očekivani ispis: <b>${esc(e.output.join(' '))}</b></p></article>`).join('')}</div>${programHelp()}<label>Kako želiš riješiti zadatak?<select id="program-language"><option value="python">Python — školski režim</option><option value="blocks">Složi blokove</option></select></label><div id="python-area"><label>Tvoj program<textarea id="program-source" rows="14" maxlength="12000" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></label></div><div id="blocks-area" hidden><div id="program-blockly" aria-label="Radni prostor za blokove"></div></div><p id="program-draft" class="muted" role="status">Skica se čuva u ovom pregledniku.</p><div class="actions"><button id="program-try">Pokreni probne primjere</button><button id="program-submit" class="primary">Predaj i ocijeni</button></div><div id="program-output" role="status"></div>`}</section>`;
 $('back').onclick=wrap(dashboard);if(done){addSectionResult(a,done);return;}if(locked)return;
 const key='eldi3333-program:'+user.id+':'+a.id;let draft={};try{draft=JSON.parse(localStorage.getItem(key)||'{}');}catch{}
 $('program-source').value=draft.source||a.practical.starter;$('program-language').value=draft.language==='blocks'?'blocks':'python';
 const get=()=>({language:$('program-language').value,source:$('program-source').value,workspace:practicalWorkspace?Blockly.serialization.workspaces.save(practicalWorkspace):draft.workspace});
 function save(){try{localStorage.setItem(key,JSON.stringify(get()));$('program-draft').textContent='Skica sačuvana u ovom pregledniku.';}catch{$('program-draft').textContent='Skica se ne može sačuvati. Kopiraj program prije zatvaranja.';}}
 function language(){const blocks=$('program-language').value==='blocks';$('python-area').hidden=blocks;$('blocks-area').hidden=!blocks;
  if(blocks&&!practicalWorkspace){setupTaskBlocks();practicalWorkspace=Blockly.inject('program-blockly',{toolbox:{kind:'flyoutToolbox',contents:['task_read','task_set','task_print','task_if','task_for','task_while'].map(type=>({kind:'block',type}))},media:'../ucionica/renderer/vendor/media/',trashcan:true,scrollbars:true,zoom:{controls:true,wheel:true,startScale:.85}});
   const initial=draft.workspace||{blocks:{languageVersion:0,blocks:[{type:'task_read',x:20,y:20,fields:{NAME:a.practical.starter.startsWith('a =')?'a':'n'}}]}};
   try{Blockly.serialization.workspaces.load(initial,practicalWorkspace);}catch{message('Skica blokova nije učitana. Složi novi program.');}
   practicalWorkspace.addChangeListener(e=>{if(!e.isUiEvent&&$('program-language'))save();});
  }if(blocks)Blockly.svgResize(practicalWorkspace);
 }
 $('program-language').onchange=()=>{language();save();};$('program-source').oninput=save;
 $('program-source').onkeydown=e=>{if(e.key==='Tab'){e.preventDefault();const el=e.target;el.setRangeText('    ',el.selectionStart,el.selectionEnd,'end');save();}};language();
 $('program-try').onclick=wrap(async()=>{save();const r=await api('try_program',{id:a.id,payload:get()});$('program-output').innerHTML=`<h3>Probni rezultat: ${r.passed} / ${r.total}</h3>${r.results.map((x,i)=>`<p><b>Primjer ${i+1}: ${x.passed?'tačno ✓':'pokušaj ponovo'}</b><br>Ispis: ${esc(x.actual.join(' ')||'nema ispisa')} ${esc(x.error)}</p>`).join('')}<p>Ovo još nije konačna ocjena. Pri predaji server provjerava svih 10 ulaza, uključujući rubne slučajeve.</p>`;});
 $('program-submit').onclick=wrap(async()=>{if(!confirm('Predati rad na konačno ocjenjivanje? Ovaj zadatak ima jednu konačnu predaju.'))return;await api('submit',{id:a.id,payload:get()});try{localStorage.removeItem(key);}catch{}await openAssignment(a.id);});
}
