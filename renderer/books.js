'use strict';
/* Original local books, worked exercises and learner-owned collections. */
window.ELDIBooks = (() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const text = value => typeof value === 'string' ? value : value == null ? '' : String(value);
  const paragraphs = value => Array.isArray(value) ? value.filter(v => typeof v === 'string') : typeof value === 'string' && value ? [value] : [];
  const lower = value => text(value).toLocaleLowerCase('bs').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const uid = prefix => prefix + '-' + (globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2));
  const builtinSources = {'pztk-matematika':'content/books/matematika-pztk.pdf','programiranje-elvir-cajic':'content/books/programiranje.pdf'};
  const languages = {python:'Python',cpp:'C++',c:'C',java:'Java'};
  let context, selected = {book:'all', grade:'all', chapter:'all', search:'', offset:0, kind:'tasks'};
  let active = null, hinted = 0, language = 'python', assisted = false;
  const $ = id => context.root.querySelector('#' + id);
  const on = (id, event, fn) => { const element = $(id); if (element) element[event] = fn; };
  const currentProfile = () => typeof context.profile === 'function' ? context.profile() : context.profile;
  function work() {
    const profile = currentProfile();
    profile.bookWork ||= {};
    const w = profile.bookWork;
    for (const key of ['notes','completed','answers','results']) w[key] ||= {};
    w.customSections ||= []; w.customTasks ||= [];
    return w;
  }
  function validateOwnSections(sections) {
    const packs=window.ELDIContentPacks;
    if(!packs?.validatePack||!window.ELDIProfiles?.validateProfile)throw new Error('Provjera sekcija i profila nije dostupna.');
    const normalized=packs.validatePack({format:'ELDI-LEARNING-PACK',version:1,books:sections}).books;
    const candidate={...currentProfile(),bookWork:{...work(),customSections:normalized}};
    window.ELDIProfiles.validateProfile(candidate);
    const wrapper={app:'ELDI EDU 10.2',schema:3,profile:candidate};
    if(packs.bytes(JSON.stringify(wrapper))>window.ELDIProfiles.MAX_PROFILE_BYTES)throw new Error('Profil sa svim bilješkama i sekcijama smije imati do 30 MB.');
    return normalized;
  }
  const bookPages = book => Number(book.pageCount || book.sourcePages || 0);
  function chapters(book) {
    return (book.chapters || []).map((chapter, index) => ({...chapter, id:text(chapter.id ?? chapter.number ?? index + 1), title:text(chapter.title), grade:Number(chapter.grade || 0)}));
  }
  function tasks(book) {
    return (book.tasks || []).map((task, index) => ({
      ...task, id:text(task.id || book.id + '-task-' + (index + 1)), title:text(task.title || 'Zadatak ' + (task.number || index + 1)),
      subject:task.subject || book.subject, grade:Number(task.grade || 0), chapterId:text(task.chapterId ?? task.chapter ?? ''),
      page:Number(task.page || task.sourcePage || task.source?.page || 0), help:paragraphs(task.help),
      steps:paragraphs(task.steps || task.solution), statement:text(task.statement || task.prompt || task.goal)
    }));
  }
  function books() {
    const own = work().customSections.filter(book => book && typeof book === 'object' && Array.isArray(book.tasks));
    const legacy = work().customTasks;
    const all = [...(window.ELDI_BOOKS || []), ...own];
    if (legacy.length) all.push({id:'moji-stariji-zadaci',title:'Moji ranije dodani zadaci',subject:'informatics',tasks:legacy,chapters:[],custom:true});
    return all;
  }
  function subjectLabel(subject) { return subject === 'math' ? 'Matematika' : 'Informatika'; }
  function scope() { return books().filter(book => selected.book === 'all' || book.id === selected.book); }
  function chapterTitle(book, task) { return chapters(book).find(chapter => chapter.id === task.chapterId)?.title || text(task.topic || 'Praktični rad'); }
  function theoryChapterId(book,item) { return text(item.chapterId || chapters(book).find(chapter=>chapter.number===Number(item.chapter))?.id || item.chapter); }
  function status(task) {
    const completion = work().completed[task.id];
    return completion ? completion.verified ? '✓ Odgovor provjeren' : '✓ Vježbanje označeno' : 'Otvoreno za vježbanje';
  }
  function filteredTasks() {
    const term = lower(selected.search);
    return scope().flatMap(book => tasks(book).map(task => ({book,task}))).filter(({book,task}) =>
      (selected.grade === 'all' || (selected.grade === 'advanced' ? !task.grade : task.grade === Number(selected.grade))) &&
      (selected.chapter === 'all' || book.id + ':' + task.chapterId === selected.chapter) &&
      lower([task.title,task.statement,task.topic,chapterTitle(book,task),...(task.tags || [])].join(' ')).includes(term));
  }
  function filteredTheory() {
    const term=lower(selected.search);
    return scope().flatMap(book=>(book.theory||[]).map(item=>({book,item}))).filter(({book,item})=>
      (selected.grade==='all'||selected.grade==='advanced')&&(selected.chapter==='all'||book.id+':'+theoryChapterId(book,item)===selected.chapter)&&lower(item.title+' '+item.body).includes(term));
  }
  function mount(options) { context = options; active = null; catalog(); }
  function catalog() {
    active = null;
    const all = books(), originals = all.filter(book => builtinSources[book.id]), count = all.reduce((n,book) => n + tasks(book).length, 0);
    if(selected.book!=='all'&&!all.some(book=>book.id===selected.book)){selected.book='all';selected.chapter='all';selected.offset=0;}
    const done = Object.keys(work().completed).length;
    context.root.innerHTML = `<div class="books-shell"><div class="books-heading"><div><div class="eyebrow">ZBIRKE / POSTUPCI / IZVORNI KOD</div><h1>Zadatak. Postupak. Rješenje.</h1><p>Originalne knjige uz razrađene vježbe. Kreni od pomoći, provjeri račun ili otvori program u editoru.</p></div><span class="books-edition">ELDI · RADNA BIBLIOTEKA</span></div><div class="books-stats"><div><strong>${originals.length}</strong><span>originalne PDF zbirke</span></div><div><strong>${originals.reduce((n,b)=>n+bookPages(b),0)}</strong><span>stranica izvornog materijala</span></div><div><strong>${count}</strong><span>obrađenih vježbi u sekciji</span></div><div><strong>${done}</strong><span>označenih / provjerenih radova</span></div></div><div class="books-shelves">${originals.map(book => bookCard(book)).join('')}</div><div class="books-packbar card"><div><strong>Materijali spremni za preuzimanje i dopunu</strong><p>ZIP s izvornim knjigama i dostupnim rješenjima. Svoje zadatke organizuj u nove sekcije i uvezi JSON ili ZIP paket.</p></div><div class="books-button-row"><button id="books-export-zip" class="primary">↓ ZIP sa zadacima i rješenjima</button><button id="books-new-section">＋ Nova sekcija</button><button id="books-new-task">＋ Moj zadatak</button><label class="books-import-button">↑ Uvezi JSON / ZIP<input id="books-import" type="file" accept=".json,.zip" aria-label="Uvezi zbirku iz JSON ili ZIP paketa"></label>${work().customSections.length?'<button id="books-export-own">↓ Moje sekcije</button>':''}</div></div><p id="books-pack-status" class="books-status" role="status" aria-live="polite"></p><div id="books-form-host"></div><div class="books-filters card"><label>Zbirka<select id="books-book"><option value="all">Sve zbirke i moje sekcije</option>${all.map(book=>`<option value="${esc(book.id)}">${esc(book.title)}</option>`).join('')}</select></label><label>Razred<select id="books-grade"><option value="all">Svi nivoi</option>${[5,6,7,8,9].map(grade=>`<option value="${grade}">${grade}. razred</option>`).join('')}<option value="advanced">Programiranje / bez razreda</option></select></label><label>Cjelina<select id="books-chapter"></select></label><label class="books-search">Pretraži zadatke i PDF stranice<input id="books-search" type="search" value="${esc(selected.search)}" placeholder="NZD, petlje, nizovi, razlomci…"></label></div><div class="books-material-tabs"><button id="books-show-tasks">Vježbe i rješenja</button><button id="books-show-theory">Teorija programiranja · ${all.reduce((n,book)=>n+(book.theory||[]).length,0)}</button></div><div class="books-list-heading"><h2 id="books-material-title">Vježbe s pomoći i rješenjima</h2><span id="books-result-count" class="tag" role="status"></span></div><p class="books-catalog-note">Broj obrađenih vježbi odnosi se na zadatke prikazane ispod. Preostali sadržaj knjiga dostupan je u originalnom PDF-u; nije predstavljen kao automatski riješen.</p><div id="books-task-list" class="books-task-grid"></div><div id="books-pagination" class="books-pagination"></div><div id="books-pdf-hits"></div></div>`;
    $('books-book').value = selected.book; $('books-grade').value = selected.grade;
    on('books-book','onchange',event=>{selected.book=event.target.value;selected.chapter='all';selected.offset=0;listChapters();list();});
    on('books-grade','onchange',event=>{selected.grade=event.target.value;selected.offset=0;list();});
    on('books-chapter','onchange',event=>{selected.chapter=event.target.value;selected.offset=0;const match=scope().flatMap(book=>chapters(book).map(chapter=>({book,chapter}))).find(({book,chapter})=>book.id+':'+chapter.id===selected.chapter);if(match?.chapter.kind==='theory')selected.kind='theory';else if(match?.chapter.kind)selected.kind='tasks';list();});
    on('books-search','oninput',event=>{selected.search=event.target.value;selected.offset=0;list();});
    on('books-show-tasks','onclick',()=>{selected.kind='tasks';selected.offset=0;list();});
    on('books-show-theory','onclick',()=>{selected.kind='theory';selected.offset=0;list();});
    context.root.querySelectorAll('[data-books-focus]').forEach(button=>button.onclick=()=>{selected.book=button.dataset.booksFocus;selected.grade='all';selected.chapter='all';selected.search='';selected.offset=0;selected.kind='tasks';catalog();$('books-task-list').scrollIntoView({block:'start',behavior:'smooth'});});
    context.root.querySelectorAll('[data-books-pdf]').forEach(button=>button.onclick=()=>reader(button.dataset.booksPdf,1));
    on('books-export-zip','onclick',()=>savePack());
    on('books-new-section','onclick',()=>sectionForm()); on('books-new-task','onclick',()=>taskForm());
    on('books-import','onchange',event=>importFile(event.target.files?.[0]));
    on('books-export-own','onclick',()=>savePack({format:'ELDI-LEARNING-PACK',version:1,books:work().customSections}));
    listChapters(); list();
  }
  function bookCard(book) {
    const programming = book.subject !== 'math', available = tasks(book).length;
    const author = text(book.author || (programming ? 'Elvir Čajić' : 'Pedagoški zavod Tuzlanskog kantona'));
    return `<article class="books-cover-card ${programming?'books-programming':'books-mathematics'}"><div class="books-cover-art" aria-hidden="true"><span>${programming?'&lt;/&gt;':'∑'}</span><div class="books-cover-lines"></div><small>${programming?'PY + C++':'MATEMATIKA'}</small></div><div class="books-cover-copy"><span class="books-kicker">${esc(subjectLabel(book.subject))} · ${bookPages(book)} PDF stranice</span><h2>${esc(book.title)}</h2><p>${esc(author)}${book.publicationYear?' · '+esc(book.publicationYear):''}</p><div class="books-cover-count"><strong>${available}</strong> obrađenih vježbi${programming?' · Python i C++':''}</div><div class="books-button-row"><button data-books-focus="${esc(book.id)}" class="primary">Vježbaj s rješenjima →</button><button data-books-pdf="${esc(book.id)}">Otvori originalni PDF</button></div></div></article>`;
  }
  function listChapters() {
    const options = scope().flatMap(book => chapters(book).map(chapter => ({value:book.id+':'+chapter.id,title:(selected.book==='all'?book.title+' · ':'')+chapter.title})));
    $('books-chapter').innerHTML = '<option value="all">Sve cjeline</option>'+options.map(chapter=>`<option value="${esc(chapter.value)}">${esc(chapter.title)}</option>`).join('');
    $('books-chapter').value = selected.chapter; if (!$('books-chapter').value) { selected.chapter='all';$('books-chapter').value='all'; }
  }
  function list() {
    $('books-show-tasks').classList.toggle('primary',selected.kind==='tasks');$('books-show-theory').classList.toggle('primary',selected.kind==='theory');
    $('books-show-tasks').setAttribute('aria-pressed',String(selected.kind==='tasks'));$('books-show-theory').setAttribute('aria-pressed',String(selected.kind==='theory'));
    if(selected.kind==='theory'){listTheory();return;}
    $('books-material-title').textContent='Vježbe s pomoći i rješenjima';
    const results = filteredTasks(), pageSize = 18;
    selected.offset = Math.min(selected.offset,Math.max(0,Math.floor((results.length-1)/pageSize)*pageSize));
    $('books-result-count').textContent = `${results.length} vježbi · prikaz ${results.length?selected.offset+1:0}–${Math.min(selected.offset+pageSize,results.length)}`;
    $('books-task-list').innerHTML = results.slice(selected.offset,selected.offset+pageSize).map(({book,task})=>`<article class="books-task-card card"><div class="books-task-top"><span class="books-task-number">${esc(task.number || task.taskNumber || task.id.match(/\d+$/)?.[0] || '•')}</span><span class="tag">${task.grade?task.grade+'. razred':esc(subjectLabel(task.subject))}${task.page?' · str. '+task.page:''}</span></div><p class="books-task-chapter">${esc(chapterTitle(book,task))}</p><h3>${esc(task.title)}</h3><p class="books-task-excerpt">${esc(task.statement.slice(0,190))}${task.statement.length>190?'…':''}</p><div class="books-task-bottom"><span class="books-progress ${work().completed[task.id]?'is-done':''}">${esc(status(task))}</span><button data-books-task="${esc(task.id)}" data-books-source="${esc(book.id)}">Otvori zadatak →</button></div></article>`).join('') || '<div class="books-empty card"><h3>Nema zadataka u ovom izboru.</h3><p>Promijeni cjelinu, razred ili pojam. Izvorne PDF knjige uvijek su dostupne iznad.</p></div>';
    context.root.querySelectorAll('[data-books-task]').forEach(button=>button.onclick=()=>open(button.dataset.booksSource,button.dataset.booksTask));
    $('books-pagination').innerHTML=`<button id="books-prev" ${selected.offset===0?'disabled':''}>← Prethodni</button><span>Stranica ${Math.floor(selected.offset/pageSize)+1} / ${Math.max(1,Math.ceil(results.length/pageSize))}</span><button id="books-next" ${selected.offset+pageSize>=results.length?'disabled':''}>Sljedeći →</button>`;
    on('books-prev','onclick',()=>{selected.offset-=pageSize;list();}); on('books-next','onclick',()=>{selected.offset+=pageSize;list();});
    pdfHits();
  }
  function listTheory(){
    const results=filteredTheory(),size=18;selected.offset=Math.min(selected.offset,Math.max(0,Math.floor((results.length-1)/size)*size));
    $('books-material-title').textContent='Razumij ideju prije pisanja koda';
    $('books-result-count').textContent=results.length+' teorijskih lekcija';
    $('books-task-list').innerHTML=results.slice(selected.offset,selected.offset+size).map(({book,item})=>`<article class="books-task-card card"><div class="books-task-top"><span class="books-task-number">&lt;/&gt;</span><span class="tag">Teorija${item.sourcePage?' · str. '+Number(item.sourcePage):''}</span></div><p class="books-task-chapter">${esc(chapters(book).find(chapter=>chapter.id===theoryChapterId(book,item))?.title||'Programiranje')}</p><h3>${esc(item.title)}</h3><p class="books-task-excerpt">${esc(text(item.body).slice(0,180))}…</p><div class="books-task-bottom"><button data-books-theory="${esc(item.id)}" data-books-source="${esc(book.id)}">Čitaj i pogledaj primjere →</button></div></article>`).join('')||'<div class="books-empty card"><h3>Nema teorijskih lekcija u ovom izboru.</h3><p>Odaberi knjigu programiranja i nivo „Svi nivoi“ ili „Programiranje / bez razreda“.</p></div>';
    context.root.querySelectorAll('[data-books-theory]').forEach(button=>button.onclick=()=>openTheory(button.dataset.booksSource,button.dataset.booksTheory));
    $('books-pagination').innerHTML=`<button id="books-prev" ${selected.offset===0?'disabled':''}>← Prethodne</button><span>Stranica ${Math.floor(selected.offset/size)+1} / ${Math.max(1,Math.ceil(results.length/size))}</span><button id="books-next" ${selected.offset+size>=results.length?'disabled':''}>Sljedeće →</button>`;
    on('books-prev','onclick',()=>{selected.offset-=size;list();});on('books-next','onclick',()=>{selected.offset+=size;list();});pdfHits();
  }
  function openTheory(bookId,theoryId){
    const book=books().find(book=>book.id===bookId),item=book?.theory?.find(item=>item.id===theoryId);if(!book||!item)return;active=null;
    const examples=Array.isArray(item.codeExamples)?item.codeExamples:[],w=work();
    context.root.innerHTML=`<div class="books-shell books-detail"><div class="books-backbar"><button id="books-back">← Teorijske lekcije</button><span class="tag">${esc(book.title)} · str. ${Number(item.sourcePage)||1}</span>${builtinSources[book.id]?'<button id="books-open-pdf">Otvori lekciju u PDF-u ↗</button>':''}</div><div class="books-heading"><div><div class="eyebrow">TEORIJA PROGRAMIRANJA / ${esc(chapters(book).find(chapter=>chapter.id===theoryChapterId(book,item))?.title||'LEKCIJA')}</div><h1>${esc(item.title)}</h1></div></div><article class="card books-theory-body"><div class="books-section-label"><span>01</span><h2>Objašnjenje i primjena</h2></div>${text(item.body).split(/\n\s*\n/).map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}</article>${examples.length?`<h2 class="books-theory-example-heading">Primjeri iz lekcije</h2>${examples.map((example,index)=>`<article class="card books-code-card"><div class="books-section-label"><span>${String(index+2).padStart(2,'0')}</span><h2>${esc(example.label||example.language||'Primjer koda')}</h2></div><p class="books-catalog-note">${example.runnable?'Potpuni primjer označen u knjizi. Provjeri potrebni ulaz prije pokretanja.':'Isječak ili vođeni primjer. Može zahtijevati ranije definisane varijable i dodatni kod.'}</p><pre class="books-source-code" tabindex="0">${esc(example.code)}</pre><div class="books-button-row"><button data-books-theory-code="${index}" class="primary">Otvori ${example.runnable?'program':'isječak'} u editoru</button><button data-books-theory-export="${index}">↓ Sačuvaj kod</button></div></article>`).join('')}`:''}<article class="card books-theory-notes"><label class="books-notes-label">Moje bilješke<textarea id="books-notes" maxlength="20000" placeholder="Sažmi ideju, zapiši pitanje ili vlastiti primjer…">${esc(w.notes[item.id]||'')}</textarea></label></article><p class="books-attribution">${esc(item.note||'Teorijska lekcija iz knjige Elvira Čajića.')}</p></div>`;
    on('books-back','onclick',catalog);on('books-open-pdf','onclick',()=>reader(book.id,Number(item.sourcePage)||1,()=>openTheory(book.id,item.id)));
    on('books-notes','oninput',event=>{work().notes[item.id]=event.target.value.slice(0,20000);context.save();});
    const lang=example=>/c\+\+|^cpp$/i.test(example.language||'')?'cpp':/java/i.test(example.language||'')?'java':/^c(?:\s|\d|$)/i.test(example.language||'')?'c':'python';
    context.root.querySelectorAll('[data-books-theory-code]').forEach(button=>button.onclick=()=>{const example=examples[Number(button.dataset.booksTheoryCode)];context.openCode?.(lang(example),text(example.code),'');});
    context.root.querySelectorAll('[data-books-theory-export]').forEach(button=>button.onclick=()=>{const example=examples[Number(button.dataset.booksTheoryExport)];context.exportFile?.(codeFilename(item.id+'-'+button.dataset.booksTheoryExport,lang(example)),text(example.code));});
    window.scrollTo(0,0);
  }
  function pdfHits() {
    const term=lower(selected.search.trim());
    if(term.length<2){$('books-pdf-hits').innerHTML='';return;}
    const hits=scope().filter(book=>builtinSources[book.id]).flatMap(book=>(book.pages||[]).map(page=>({book,page}))).filter(({book,page})=>
      (selected.grade==='all'||Number(page.grade)===Number(selected.grade))&&(selected.chapter==='all'||book.id+':'+text(page.chapterId)===selected.chapter)&&lower(page.searchText||'').includes(term));
    if(!hits.length){$('books-pdf-hits').innerHTML='';return;}
    $('books-pdf-hits').innerHTML=`<div class="books-list-heading"><h2>Stranice izvornog PDF-a</h2><span class="tag">${hits.length} pronađenih stranica</span></div><p class="books-catalog-note">Rezultati iz teksta originala. Geometrijske slike, raspored formula i potpuna izvorna rješenja pogledaj na stranici PDF-a.</p><div class="books-pdf-results">${hits.slice(0,12).map(({book,page})=>`<button data-books-hit-book="${esc(book.id)}" data-books-hit-page="${Number(page.page)||1}"><strong>${esc(book.title)} · str. ${Number(page.page)||1}</strong><span>${esc(text(page.searchText).replace(/\s+/g,' ').slice(0,180))}…</span></button>`).join('')}</div>${hits.length>12?'<p class="books-catalog-note">Prikazano prvih 12 stranica. Suzi pretragu za precizniji izbor.</p>':''}`;
    context.root.querySelectorAll('[data-books-hit-book]').forEach(button=>button.onclick=()=>reader(button.dataset.booksHitBook,Number(button.dataset.booksHitPage)));
  }
  function open(bookId,taskId) {
    const book=books().find(book=>book.id===bookId);if(!book)return;
    if(!taskId){selected.book=bookId;selected.chapter='all';selected.offset=0;catalog();return;}
    const task=tasks(book).find(task=>task.id===taskId);if(!task)return;
    active={book,task};hinted=0;assisted=!!work().results[task.id]?.assisted;language=Object.keys(languages).find(lang=>task.solutions?.[lang]?.code)||'python';
    detail();
  }
  function detail() {
    const {book,task}=active,w=work(),examples=Array.isArray(task.examples)?task.examples:[],programming=Object.keys(languages).some(lang=>task.solutions?.[lang]?.code);
    const official=builtinSources[book.id],own=w.customSections.some(item=>item.id===book.id);
    context.root.innerHTML=`<div class="books-shell books-detail"><div class="books-backbar"><button id="books-back">← Zbirke i rješenja</button><span class="tag">${esc(book.title)}${task.page?' · str. '+task.page:''}</span>${official?'<button id="books-open-pdf">Pogledaj zadatak u PDF-u ↗</button>':''}${own?'<button id="books-edit-task">Uredi moj zadatak</button>':''}</div><div class="books-heading"><div><div class="eyebrow">${esc(chapterTitle(book,task))}</div><h1>${esc(task.title)}</h1></div><span id="books-task-progress" class="books-progress ${w.completed[task.id]?'is-done':''}">${esc(status(task))}</span></div><div class="books-solving-grid"><article class="card books-problem"><div class="books-section-label"><span>01</span><h2>Razumij zadatak</h2></div><p class="books-statement">${esc(task.statement)}</p>${task.goal&&task.goal!==task.statement?`<p class="books-goal"><strong>Cilj:</strong> ${esc(task.goal)}</p>`:''}${task.input?`<details class="books-spec" open><summary>Ulaz</summary><p>${esc(task.input)}</p></details>`:''}${task.output?`<details class="books-spec" open><summary>Izlaz</summary><p>${esc(task.output)}</p></details>`:''}${task.limits?`<p class="books-limits"><strong>Ograničenja:</strong> ${esc(task.limits)}</p>`:''}${examples.length?`<h3>Primjer${examples.length>1?'i':''}</h3><div class="books-examples">${examples.map((example,i)=>`<div class="books-example"><span>Primjer ${i+1}</span><div><section><h4>Ulaz</h4><pre>${esc(example.input)}</pre></section><section><h4>Izlaz</h4><pre>${esc(example.output)}</pre></section></div></div>`).join('')}</div>`:''}${answerForm(task)}<label class="books-notes-label">Moj postupak / bilješke<textarea id="books-notes" maxlength="20000" placeholder="Zapiši račun, ideju algoritma ili pitanje koje želiš razjasniti…">${esc(w.notes[task.id]||'')}</textarea></label><label class="books-completion"><input id="books-complete" type="checkbox" ${w.completed[task.id]?'checked':''}> Označi da sam vježbao/la ovaj zadatak</label><p class="books-catalog-note">Ova oznaka je lični napredak. Automatski provjeren odgovor prikazuje se zasebno.</p></article><aside class="card books-support"><div class="books-section-label"><span>02</span><h2>Pomoć korak po korak</h2></div><p>Prvo pokušaj samostalno. Otvori samo onoliko pomoći koliko ti treba.</p><button id="books-hint" ${!task.help.length?'disabled':''}>${task.help.length?'Otkrij prvi savjet':'Savjet nije dodan'}</button><ol id="books-hints" class="books-hints"></ol><div class="books-support-divider"></div><button id="books-solution" class="primary">Prikaži postupak i ${programming?'izvorni kod':'rješenje'}</button><div id="books-worked" hidden><h3>Postupak rješavanja</h3>${task.steps.length?`<ol class="books-steps">${task.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:'<p>Prati priloženi izvorni kod i primjer ulaza/izlaza.</p>'}${task.answer?`<div class="books-answer-display"><span>Rješenje</span><strong>${esc(task.answerDisplay || displayAnswer(task.answer))}</strong></div>`:''}${task.complexity?`<p class="books-complexity"><strong>Složenost:</strong> ${esc(task.complexity)}</p>`:''}</div><p id="books-help-status" class="books-status" role="status"></p></aside></div>${programming?`<article id="books-code-card" class="books-code-card card" hidden><div class="books-code-header"><div class="books-section-label"><span>03</span><h2>Izvorni kod</h2></div><label>Jezik<select id="books-code-language">${Object.entries(languages).filter(([lang])=>task.solutions?.[lang]?.code).map(([lang,label])=>`<option value="${lang}">${label}</option>`).join('')}</select></label></div><p id="books-code-verification" class="books-catalog-note"></p><pre id="books-source-code" class="books-source-code" tabindex="0" aria-label="Izvorni kod rješenja"></pre><div class="books-button-row"><button id="books-open-editor" class="primary">▶ Otvori u editoru i pokreni</button><button id="books-copy-code">Kopiraj kod</button><button id="books-export-code">↓ Sačuvaj datoteku koda</button>${examples.length>1?`<label>Primjer za ulaz<select id="books-code-example">${examples.map((_,i)=>`<option value="${i}">Primjer ${i+1}</option>`).join('')}</select></label>`:''}</div><p id="books-code-status" class="books-status" role="status" aria-live="polite"></p></article>`:''}<p class="books-attribution">${esc(task.sourceAttribution || text(book.author || book.title))}${task.page?' · izvorna PDF stranica '+task.page:''}${task.source?.solutionPage?' · izvorno rješenje na str. '+Number(task.source.solutionPage):''}</p></div>`;
    if(task.editorialNote){const note=document.createElement('p');note.className='books-editorial-note';note.textContent='Napomena uz izvor: '+text(task.editorialNote);context.root.querySelector('.books-statement').after(note);}
    for(const [heading,value] of [['Na šta obrati pažnju',task.checks],['Dodatne provjere',task.subtasks]]){
      if(!value)continue;const section=document.createElement('section'),title=document.createElement('h3'),body=document.createElement('p');title.textContent=heading;body.textContent=text(value);body.className='books-checks';section.append(title,body);$('books-worked').append(section);
    }
    const sourceNotes=(task.notes||[]).filter(note=>note&&typeof note==='object');
    if(sourceNotes.length){const details=document.createElement('details'),summary=document.createElement('summary');details.className='books-source-notes';summary.textContent='Napomene uz digitalni prijepis ('+sourceNotes.length+')';details.append(summary);for(const note of sourceNotes){const paragraph=document.createElement('p');paragraph.textContent=(note.page?'Str. '+note.page+': ':'')+text(note.restored||note.original)+' '+text(note.reason);details.append(paragraph);}context.root.querySelector('.books-attribution').before(details);}
    on('books-back','onclick',catalog);on('books-open-pdf','onclick',()=>reader(book.id,task.page||1,()=>detail()));
    on('books-edit-task','onclick',()=>{catalog();taskForm({bookId:book.id,task});});
    on('books-notes','oninput',event=>{work().notes[task.id]=event.target.value.slice(0,20000);context.save();});
    on('books-complete','onchange',event=>{if(event.target.checked)work().completed[task.id]={date:new Date().toISOString(),assisted,verified:!!work().results[task.id]?.correct};else delete work().completed[task.id];context.save();updateProgress();});
    on('books-hint','onclick',()=>{if(hinted>=task.help.length)return;assisted=true;rememberHelp(task.id);const li=document.createElement('li');li.textContent=task.help[hinted++];$('books-hints').appendChild(li);$('books-hint').textContent=hinted>=task.help.length?'Svi savjeti su otvoreni':`Otkrij sljedeći savjet (${hinted}/${task.help.length})`;$('books-hint').disabled=hinted>=task.help.length;});
    on('books-solution','onclick',()=>{assisted=true;rememberHelp(task.id);$('books-worked').hidden=false;if($('books-code-card')){$('books-code-card').hidden=false;renderCode();}$('books-help-status').textContent='Postupak je otvoren. Uporedi ga sa svojim radom i pokušaj ponovo.';$('books-solution').textContent='Postupak i rješenje su otvoreni';});
    if(task.answer && task.answer.type!=='manual')on('books-check','onclick',()=>checkAnswer(task));
    context.root.querySelectorAll('[data-books-answer]').forEach(input=>input.oninput=()=>{work().answers[task.id]||={};work().answers[task.id][input.dataset.booksAnswer]=input.value.slice(0,2000);context.save();});
    on('books-code-language','onchange',event=>{language=event.target.value;renderCode();});
    on('books-open-editor','onclick',()=>{const code=task.solutions?.[language]?.code;if(!code)return;const index=Number($('books-code-example')?.value||0);context.openCode?.(language,code,text(examples[index]?.input||''));});
    on('books-copy-code','onclick',()=>copyCode());
    on('books-export-code','onclick',()=>context.exportFile?.(codeFilename(task.id,language),task.solutions?.[language]?.code||''));
    window.scrollTo(0,0);
  }
  function rememberHelp(id){const w=work();w.results[id]||={};w.results[id].assisted=true;if(w.completed[id])w.completed[id].assisted=true;context.save();}
  function updateProgress(){if(!active)return;const node=$('books-task-progress');if(node){node.textContent=status(active.task);node.classList.toggle('is-done',!!work().completed[active.task.id]);}}
  function displayAnswer(answer){if(Array.isArray(answer.value))return answer.type==='set'?'{'+answer.value.join('; ')+'}':answer.value.join('; ');return text(answer.value);}
  function answerForm(task){
    if(!task.answer)return '';
    if(task.answer.type==='manual')return `<div class="books-answer-box"><h3>Samostatni rad</h3><p>${esc(task.answerPrompt||'Zapiši svoj dokaz ili postupak u bilješke. Ovaj zadatak pregledaj s nastavnikom; nema automatske provjere dokaza.')}</p></div>`;
    const saved=work().answers[task.id]||{},tuple=task.answer.type==='tuple',count=tuple?(Array.isArray(task.answer.value)?task.answer.value.length:0):1;
    return `<div class="books-answer-box"><h3>Probaj svoje rješenje</h3><p>${esc(task.answerPrompt||(tuple?'Unesi svaki traženi rezultat.':task.answer.type==='set'?'Brojeve odvoji znakom ;. Redoslijed nije važan.':task.answer.type==='fraction'?'Unesi broj ili razlomak u obliku a/b.':'Unesi traženi rezultat.'))}</p><div class="books-answer-fields">${Array.from({length:count},(_,i)=>`<label>${esc(tuple?(task.answer.labels?.[i]||'Rezultat '+(i+1)):'Odgovor')}${!tuple&&task.answer.unit?' ('+esc(task.answer.unit)+')':''}<input id="books-answer-${i}" data-books-answer="${i}" value="${esc(saved[i]||'')}" autocomplete="off" placeholder="${task.answer.type==='fraction'?'npr. 3/4':task.answer.type==='set'?'npr. 2; 3; 5':'Upiši odgovor'}"></label>`).join('')}</div><button id="books-check" class="primary">Provjeri odgovor</button><p id="books-answer-status" class="books-status" role="status" aria-live="polite"></p></div>`;
  }
  function number(value){
    const normalized=text(value).trim().replace(/−/g,'-').replace(/,/g,'.').replace(/\s+/g,'');
    if(!normalized)return NaN;
    const fraction=normalized.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/);
    if(fraction){const divisor=Number(fraction[2]);return divisor?Number(fraction[1])/divisor:NaN;}
    return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)?Number(normalized):NaN;
  }
  function matches(answer,values){
    const expected=answer.value,explicitTolerance=Number.isFinite(answer.tolerance),tolerance=explicitTolerance?Math.abs(answer.tolerance):1e-8;
    const equal=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tolerance*(explicitTolerance?1:Math.max(1,Math.abs(b)));
    if(answer.type==='number'||answer.type==='fraction')return equal(number(values[0]),number(expected));
    if(answer.type==='tuple'){
      if(!Array.isArray(expected)||expected.length!==values.length)return false;
      const actual=values.map(number),target=expected.map(number);
      if(answer.orderSensitive===false){actual.sort((a,b)=>a-b);target.sort((a,b)=>a-b);}
      return target.every((value,i)=>equal(actual[i],value));
    }
    if(answer.type==='set'){
      const raw=text(values[0]).trim().replace(/^[{\[]|[}\]]$/g,'').split(/[;\s]+/).filter(Boolean).map(number);
      if(raw.some(value=>!Number.isFinite(value)))return false;
      const actual=[...new Set(raw)].sort((a,b)=>a-b),target=[...new Set((Array.isArray(expected)?expected:[]).map(number))].sort((a,b)=>a-b);
      return actual.length===target.length&&actual.every((value,i)=>equal(value,target[i]));
    }
    if(answer.type==='text')return [expected,...(answer.accepted||[])].some(value=>text(value).trim().replace(/\s+/g,' ')===text(values[0]).trim().replace(/\s+/g,' '));
    return false;
  }
  function checkAnswer(task){
    const inputs=[...context.root.querySelectorAll('[data-books-answer]')],values=inputs.map(input=>input.value),result=matches(task.answer,values),w=work(),old=w.results[task.id]||{};
    w.results[task.id]={...old,correct:!!(old.correct||result),lastCorrect:result,attempts:(old.attempts||0)+1,date:new Date().toISOString(),assisted:!!(old.assisted||assisted)};
    if(result){w.completed[task.id]={date:new Date().toISOString(),assisted:w.results[task.id].assisted,verified:true};$('books-complete').checked=true;}
    context.save();$('books-answer-status').textContent=result?'✓ Traženi odgovor je tačan. Provjera ne ocjenjuje zapisani postupak.':'Odgovor još nije tačan. Provjeri račun i format ili otvori sljedeći savjet.';
    $('books-answer-status').className='books-status '+(result?'success':'error');updateProgress();
  }
  function renderCode(){
    if(!active||!$('books-source-code'))return;const solution=active.task.solutions?.[language];if(!solution)return;
    $('books-code-language').value=language;$('books-source-code').textContent=text(solution.code);
    const verification=solution.verification;
    $('books-code-verification').textContent=typeof verification==='string'?verification:verification&&typeof verification==='object'?Number.isInteger(verification.examplesTotal)?`${verification.examplesPassed}/${verification.examplesTotal} primjera iz knjige prošlo provjeru. ${text(verification.scope||'Provjera obuhvata priložene primjere.')}`:text(verification.summary||verification.description||verification.status)||'Provjera i primjeri dokumentovani su u paketu.':solution.status==='verified'?'Provjereno rješenje iz priloženog paketa.':'Kod je priložen za učenje. Pokreni ga na primjerima ulaza i provjeri izlaz.';
  }
  async function copyCode(){
    const code=active?.task.solutions?.[language]?.code||'';try{await navigator.clipboard.writeText(code);$('books-code-status').textContent='Kod je kopiran.';}catch(error){$('books-code-status').textContent='Kopiranje nije dostupno. Označi kod i pritisni Ctrl+C ili sačuvaj datoteku.';const range=document.createRange();range.selectNodeContents($('books-source-code'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);}
  }
  function filename(value){return text(value).replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,100)||'ELDI-zadatak';}
  function codeFilename(value,lang){return lang==='java'?'Main.java':filename(value)+'.'+({python:'py',cpp:'cpp',c:'c'}[lang]||'txt');}
  function reader(bookId,page=1,back=catalog){
    const book=books().find(book=>book.id===bookId),source=builtinSources[bookId];if(!book||!source)return;
    const maximum=Math.max(1,bookPages(book));page=Math.max(1,Math.min(maximum,Math.trunc(page)||1));
    context.root.innerHTML=`<div class="books-shell books-reader"><div class="books-backbar"><button id="books-reader-back">← Nazad</button><span class="tag">IZVORNI PDF · ${maximum} stranica</span></div><div class="books-heading"><div><div class="eyebrow">ČITAJ ORIGINAL</div><h1>${esc(book.title)}</h1></div></div><div class="books-reader-toolbar card"><button id="books-reader-prev" aria-label="Prethodna PDF stranica">←</button><label>PDF stranica<input id="books-reader-page" type="number" min="1" max="${maximum}" value="${page}"></label><span>/ ${maximum}</span><button id="books-reader-go" class="primary">Otvori stranicu</button><button id="books-reader-next" aria-label="Sljedeća PDF stranica">→</button><label>Cjelina<select id="books-reader-chapter"><option value="">Skoči na cjelinu…</option>${chapters(book).filter(ch=>ch.pageStart||ch.pageFrom).map(ch=>`<option value="${Number(ch.pageStart||ch.pageFrom)}">${esc(ch.title)}</option>`).join('')}</select></label></div><p class="books-catalog-note">Broj označava stranicu PDF datoteke. Izvorni prijelom, slike i formule prikazuju se bez izmjena. Zumiranje i štampanje dostupni su u PDF prikazu.</p><iframe id="books-reader-frame" class="books-reader-frame" src="../${source}#page=${page}" title="${esc(book.title)} — originalni PDF"></iframe></div>`;
    on('books-reader-back','onclick',back);
    const jump=target=>{page=Math.max(1,Math.min(maximum,Math.trunc(target)||1));$('books-reader-page').value=page;$('books-reader-frame').src='../'+source+'#page='+page;$('books-reader-prev').disabled=page===1;$('books-reader-next').disabled=page===maximum;};
    on('books-reader-go','onclick',()=>{const input=$('books-reader-page');if(input.reportValidity())jump(Number(input.value));});
    on('books-reader-page','onkeydown',event=>{if(event.key==='Enter')$('books-reader-go').click();});
    on('books-reader-prev','onclick',()=>jump(page-1));on('books-reader-next','onclick',()=>jump(page+1));
    on('books-reader-chapter','onchange',event=>{if(event.target.value)jump(Number(event.target.value));});jump(page);window.scrollTo(0,0);
  }
  function packStatus(message,error=false){const target=$('books-pack-status');if(target){target.textContent=message;target.className='books-status'+(error?' error':'');}}
  async function savePack(pack){
    if(!context.savePack){packStatus('Spremanje ZIP paketa dostupno je u desktop aplikaciji.',true);return;}
    packStatus('Pripremam ZIP paket…');
    try{const result=await context.savePack(pack);if(result?.canceled||result?.cancelled)packStatus('Spremanje je otkazano.');else if(result?.success)packStatus('ZIP paket je sačuvan'+(result.path?': '+result.path:'.'));else packStatus(text(result?.error||'Paket nije sačuvan.'),true);}catch(error){packStatus('Paket nije sačuvan: '+error.message,true);}
  }
  async function importFile(file){
    if(!file)return;
    if(file.size>30*1024*1024){packStatus('Paket je prevelik. Najviše 30 MB.',true);return;}
    packStatus('Čitam i provjeravam paket…');
    try{
      let pack;
      if(/\.zip$/i.test(file.name)){if(!context.readPack)throw new Error('ZIP uvoz je dostupan u desktop aplikaciji.');const result=await context.readPack(new Uint8Array(await file.arrayBuffer()));pack=result?.pack;if(!pack)throw new Error('ZIP ne sadrži ispravan ELDI paket.');}
      else if(/\.json$/i.test(file.name))pack=JSON.parse(await file.text());
      else throw new Error('Odaberi .json ili .zip datoteku.');
      if(!window.ELDIContentPacks?.validatePack)throw new Error('Provjera paketa nije dostupna.');
      const validated=window.ELDIContentPacks.validatePack(pack),w=work(),candidate=[...w.customSections];let imported=0,count=0;
      const builtinIds=new Set((window.ELDI_BOOKS||[]).map(book=>book.id));
      for(const source of validated.books){
        // Imported content belongs to this profile; it cannot replace a bundled book or load arbitrary PDFs.
        const book=JSON.parse(JSON.stringify(source));delete book.sourceFile;
        const oldId=book.id;book.id=uid('moja-zbirka');book.custom=true;
        book.tasks=(book.tasks||[]).map(task=>({...task,id:uid('moj-zadatak'),sourceAttribution:task.sourceAttribution||('Uvezeno iz: '+source.title)}));
        book.theory=(book.theory||[]).map(item=>({...item,id:uid('moja-lekcija')}));
        if(builtinIds.has(oldId))book.title+=' — moja kopija';
        candidate.push(book);imported++;count+=book.tasks.length;
      }
      const checked=validateOwnSections(candidate);
      w.customSections=checked;
      context.save();selected.book='all';selected.chapter='all';selected.offset=0;catalog();packStatus(`Uvezeno: ${imported} sekcija i ${count} zadataka. Izvorni kod pokreće se tek kada ga otvoriš i pokreneš u editoru.`);
    }catch(error){packStatus('Uvoz nije izvršen: '+error.message,true);}
  }
  function sectionForm(){
    $('books-form-host').innerHTML=`<form id="books-section-form" class="card books-own-form"><div class="books-list-heading"><h2>Nova moja sekcija</h2><button id="books-form-cancel" type="button">Zatvori</button></div><div class="books-form-row"><label>Naziv sekcije<input id="books-section-title" required maxlength="120" placeholder="Npr. Takmičarski algoritmi"></label><label>Predmet<select id="books-section-subject"><option value="informatics">Informatika</option><option value="math">Matematika</option></select></label></div><label>Opis<textarea id="books-section-description" maxlength="2000" rows="3" placeholder="Za koga je sekcija i šta se vježba…"></textarea></label><button id="books-form-save" type="submit" class="primary">Sačuvaj sekciju</button></form>`;
    on('books-form-cancel','onclick',()=>$('books-form-host').innerHTML='');
    on('books-section-form','onsubmit',event=>{event.preventDefault();const title=$('books-section-title').value.trim();if(!title)return;const book={id:uid('moja-zbirka'),title,subject:$('books-section-subject').value,description:$('books-section-description').value.trim(),chapters:[{id:'moji-zadaci',title:'Moji zadaci'}],tasks:[],custom:true};try{const checked=validateOwnSections([...work().customSections,book]);work().customSections=checked;context.save();selected.book=book.id;selected.chapter='all';catalog();packStatus('Sekcija je sačuvana. Dodaj prvi zadatak.');}catch(error){packStatus('Sekcija nije sačuvana: '+error.message,true);}});
    $('books-section-title').focus();$('books-form-host').scrollIntoView({block:'start',behavior:'smooth'});
  }
  function taskForm(edit=null){
    const sections=work().customSections,task=edit?.task||{},examples=task.examples||[],py=task.solutions?.python?.code||'',cpp=task.solutions?.cpp?.code||'';
    $('books-form-host').innerHTML=`<form id="books-task-form" class="card books-own-form"><div class="books-list-heading"><h2>${edit?'Uredi moj zadatak':'Dodaj svoj zadatak'}</h2><button id="books-form-cancel" type="button">Zatvori</button></div><p>Dodaj vlastito objašnjenje i kod. Uvezeni ili ručno dodani kod nije automatski označen kao provjeren.</p><div class="books-form-row"><label>Sekcija<select id="books-task-section">${sections.length?sections.map(book=>`<option value="${esc(book.id)}">${esc(book.title)}</option>`).join(''):'<option value="">Nova sekcija „Moji zadaci“</option>'}</select></label><label>Predmet<select id="books-task-subject"><option value="informatics">Informatika</option><option value="math">Matematika</option></select></label><label>Nivo<select id="books-task-grade"><option value="0">Bez razreda / programiranje</option>${[5,6,7,8,9].map(grade=>`<option value="${grade}">${grade}. razred</option>`).join('')}</select></label></div><label>Naziv zadatka<input id="books-task-title" required maxlength="160" value="${esc(task.title)}" placeholder="Npr. Najveći zajednički djelilac"></label><label>Tekst zadatka<textarea id="books-task-statement" required maxlength="12000" rows="5">${esc(task.statement||'')}</textarea></label><div class="books-form-row"><label>Pomoć — svaki savjet u novom redu<textarea id="books-task-help" maxlength="12000" rows="5">${esc(paragraphs(task.help).join('\n'))}</textarea></label><label>Postupak / rješenje — svaki korak u novom redu<textarea id="books-task-steps" maxlength="16000" rows="5">${esc(paragraphs(task.steps||task.solution).join('\n'))}</textarea></label></div><div class="books-form-row"><label>Primjer ulaza<textarea id="books-task-input" maxlength="4000" rows="3">${esc(examples[0]?.input||'')}</textarea></label><label>Očekivani izlaz<textarea id="books-task-output" maxlength="4000" rows="3">${esc(examples[0]?.output||'')}</textarea></label></div><div class="books-form-row"><label>Python rješenje (opcionalno)<textarea id="books-task-python" class="books-form-code" spellcheck="false" maxlength="60000" rows="9">${esc(py)}</textarea></label><label>C++ rješenje (opcionalno)<textarea id="books-task-cpp" class="books-form-code" spellcheck="false" maxlength="60000" rows="9">${esc(cpp)}</textarea></label></div><div class="books-button-row"><button id="books-form-save" type="submit" class="primary">${edit?'Sačuvaj izmjene':'Sačuvaj zadatak'}</button></div><p id="books-form-status" class="books-status" role="status"></p></form>`;
    const initialBook=sections.find(book=>book.id===(edit?.bookId||selected.book))||sections[0];
    $('books-task-subject').value=task.subject||initialBook?.subject||'informatics';$('books-task-grade').value=String(task.grade||0);if(initialBook)$('books-task-section').value=initialBook.id;
    on('books-form-cancel','onclick',()=>$('books-form-host').innerHTML='');
    on('books-task-section','onchange',event=>{const book=sections.find(book=>book.id===event.target.value);if(book)$('books-task-subject').value=book.subject;});
    on('books-task-form','onsubmit',event=>{
      event.preventDefault();let book=work().customSections.find(book=>book.id===$('books-task-section').value);
      const subject=$('books-task-subject').value,title=$('books-task-title').value.trim(),statement=$('books-task-statement').value.trim();if(!title||!statement)return;
      const lines=value=>value.split('\n').map(line=>line.trim()).filter(Boolean);
      const solutions={},python=$('books-task-python').value,cxx=$('books-task-cpp').value;for(const lang of ['c','java'])if(task.solutions?.[lang])solutions[lang]=task.solutions[lang];if(python.trim())solutions.python={code:python,status:'user-provided'};if(cxx.trim())solutions.cpp={code:cxx,status:'user-provided'};
      const item={...task,id:edit?task.id:uid('moj-zadatak'),title,subject,grade:Number($('books-task-grade').value),chapterId:task.chapterId||'moji-zadaci',statement,help:lines($('books-task-help').value),steps:lines($('books-task-steps').value),examples:[{input:$('books-task-input').value,output:$('books-task-output').value}],solutions,sourceAttribution:'Korisnički zadatak · moj profil'};
      try{
        const candidate=book?{...book,chapters:[...book.chapters]}:{id:uid('moja-zbirka'),title:'Moji zadaci',subject,chapters:[{id:'moji-zadaci',title:'Moji zadaci'}],tasks:[],custom:true};
        const ids=chapters(candidate).map(chapter=>chapter.id);
        if(!ids.includes(item.chapterId))item.chapterId=ids[0]||'moji-zadaci';
        if(!ids.length)candidate.chapters=[{id:'moji-zadaci',title:'Moji zadaci'}];
        const statementChanged=!!edit&&statement!==task.statement;
        if(statementChanged){delete item.answer;delete item.answerPrompt;delete item.answerDisplay;}
        const updated={...candidate,tasks:[...candidate.tasks.filter(old=>old.id!==item.id),item]};
        const next=work().customSections.map(old=>old.id===candidate.id?updated:edit&&old.id===edit.bookId?{...old,tasks:old.tasks.filter(previous=>previous.id!==item.id)}:old);
        if(!next.some(old=>old.id===candidate.id))next.push(updated);
        const checked=validateOwnSections(next);
        work().customSections=checked;
        if(statementChanged){delete work().answers[item.id];delete work().results[item.id];delete work().completed[item.id];}
        context.save();selected.book=candidate.id;selected.chapter='all';selected.offset=0;catalog();packStatus(statementChanged?'Izmjene su sačuvane. Automatska provjera starog odgovora je uklonjena jer je tekst zadatka promijenjen.':edit?'Izmjene su sačuvane.':'Zadatak je sačuvan u tvojoj sekciji.');
      }catch(error){$('books-form-status').textContent='Zadatak nije sačuvan: '+error.message;}
    });
    $('books-task-title').focus();$('books-form-host').scrollIntoView({block:'start',behavior:'smooth'});
  }
  function summary(profile){const w=profile?.bookWork||{},done=Object.values(w.completed||{});return{practised:done.length,verified:done.filter(item=>item.verified).length,assisted:done.filter(item=>item.assisted).length,sections:(w.customSections||[]).length};}
  return {mount,catalog,open,openTheory,reader,summary};
})();
