'use strict';
/* The project library and the workbench share one live Blockly workspace. */
window.ELDIBlockStudio = (() => {
  let current = null;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const $ = id => document.getElementById(id);
  const list = value => Array.isArray(value) ? value : value ? [String(value)] : [];
  const difficulty = value => ({1:'1 · Uvodni',2:'2 · Početni',3:'3 · Srednji',4:'4 · Zahtjevni',5:'5 · Napredni',easy:'Početni',medium:'Srednji',hard:'Napredni'}[value] || value || 'Početni');
  const emptyCatalog = () => ({format:'ELDI-BLOCK-PROJECTS',version:1,families:[],projects:[]});
  const builtins = () => window.ELDI_BLOCK_PROJECTS || emptyCatalog();
  function profile() { return typeof current.options.profile === 'function' ? current.options.profile() : current.options.profile; }
  function work() {
    const p = profile();
    p.blockLibrary ||= {packs:[],results:{},selectedId:null,input:'',selectedAssisted:false};
    p.blockLibrary.packs ||= []; p.blockLibrary.results ||= {};
    return p.blockLibrary;
  }
  function catalog() {
    const packs = current ? work().packs : [];
    return {...builtins(),families:[...(builtins().families || []),...packs.flatMap(pack => pack.families || [])],projects:[...(builtins().projects || []),...packs.flatMap(pack => pack.projects || [])]};
  }
  function summary() {
    const all = catalog(), results = current ? work().results : {};
    return {projects:all.projects.length,builtinProjects:(builtins().projects || []).length,customProjects:all.projects.length-(builtins().projects || []).length,families:all.families.length,solved:all.projects.filter(project => results[project.id]?.correct).length,independent:all.projects.filter(project => results[project.id]?.independent).length};
  }
  function save() { current.options.save?.(); }
  function fitWorkbench() {
    const root = current?.options.root;
    const layout = root?.querySelector('.block-layout');
    if (!layout || current.mode !== 'studio') return;
    if (window.innerWidth >= 900) {
      const top = Math.ceil(layout.getBoundingClientRect().top + window.scrollY);
      const available = Math.floor(window.innerHeight - top - 12);
      root.style.setProperty('--workbench-height',Math.max(300,Math.min(850,available))+'px');
    } else root.style.removeProperty('--workbench-height');
    window.ELDIBlocks.resize?.();
  }
  function scheduleWorkbenchFit() {
    if (!current || current.fitFrame) return;
    const session = current;
    session.fitFrame = requestAnimationFrame(() => {
      session.fitFrame = null;
      if (current === session) fitWorkbench();
    });
  }
  function setStatus(message, isError = false) {
    if (!$('blpack-status')) return;
    $('blpack-status').textContent = message;
    $('blpack-status').classList.toggle('is-error', isError);
  }
  function showMode(mode) {
    if (!current) return;
    window.ELDIBlocks.stop();
    current.mode = mode;
    const library = mode === 'library';
    $('block-studio-section').hidden = library;
    $('block-library-section').hidden = !library;
    for (const [id, active] of [['block-tab-studio',!library],['block-tab-library',library]]) {
      $(id).classList.toggle('selected',active); $(id).setAttribute('aria-selected',String(active));
    }
    if (library) renderLibrary();
    else scheduleWorkbenchFit();
  }
  function chosenDescription() { return current.chosen?.statement || current.chosen?.description || ''; }
  function projectTests(project) {
    if (Array.isArray(project?.tests) && project.tests.length) return project.tests;
    return project ? [{input:project.input || '',check:project.check}] : [];
  }
  function describe() {
    const chosen = current.chosen;
    window.ELDIBlocks.stop(); window.ELDIBlocks.setChallenge(chosen ? {...chosen,tests:projectTests(chosen)} : null);
    $('challenge-hints').hidden = true;
    $('blockcheck').textContent = '';
    $('block-panel-summary').textContent = chosen ? `${chosen.grade}. razred / ${chosen.title} — zadatak i pomoć` : 'Slobodan projekat — izaberi zadatak ili otvori biblioteku';
    $('block-task-brief').textContent = chosenDescription();
    $('block-task-brief').hidden = !chosen;
    $('block-objective').innerHTML = chosen ? `<div class="bst-task-heading"><span class="bst-chip">${chosen.grade}. razred</span><span class="bst-chip">${esc(chosen.category)}</span>${chosen.difficulty ? `<span class="bst-chip">${esc(difficulty(chosen.difficulty))}</span>` : ''}</div><h2>${esc(chosen.title)}</h2><p class="task-prompt">${esc(chosenDescription())}</p>${chosen.goal ? `<p class="bst-task-goal">Cilj: ${esc(chosen.goal)}</p>` : ''}${chosen.expected ? `<details class="bst-expected"><summary>Očekivani rezultat glavnog primjera</summary><pre>${esc(chosen.expected)}</pre></details>` : ''}` : '<h2>Slobodan projekat</h2><p>Sastavi vlastiti algoritam. Izbor zadatka čuva tvoje blokove; početne blokove ili rješenje učitavaš zasebno.</p>';
    for (const id of ['challenge-starter','challenge-hint','challenge-solution']) $(id).disabled = !chosen;
    const tests = projectTests(chosen);
    $('block-test-case').innerHTML = '<option value="">Vlastiti ulaz</option>' + tests.map((test,index) => `<option value="${index}">Primjer ${index+1}</option>`).join('');
    $('block-test-label').hidden = !chosen;
    selectInputExample();
    $('block-ai').textContent = chosen ? '✦ Pitaj AI asistenta' : '✦ AI pomoć';
    scheduleWorkbenchFit();
  }
  function selectInputExample() {
    if (!current || !$('block-test-case')) return;
    const normalize = input => String(input).replace(/\r\n/g,'\n').trim();
    const index = projectTests(current.chosen).findIndex(test => normalize(test.input) === normalize($('blockinput').value));
    $('block-test-case').value = index < 0 ? '' : String(index);
  }
  function chooseLegacy(id) {
    current.chosen = current.challenges.find(challenge => challenge.id === id) || null;
    profile().blockChallengeId = current.chosen?.id || null;
    work().selectedId = null; work().selectedAssisted = false;
    describe(); save();
  }
  function challengeList() {
    const filtered = current.challenges.filter(challenge => ($('block-grade').value === 'all' || challenge.grade === +$('block-grade').value) && ($('block-category').value === 'all' || challenge.category === $('block-category').value));
    $('block-challenge').innerHTML = '<option value="">Slobodan projekat / biblioteka</option>' + filtered.map(challenge => `<option value="${esc(challenge.id)}">${challenge.grade}. ${esc(challenge.title)}</option>`).join('');
    if (current.chosen && filtered.includes(current.chosen)) $('block-challenge').value = current.chosen.id;
    else if (current.chosen && !work().selectedId) chooseLegacy('');
  }
  function markAssisted(id = current?.chosen?.id) {
    const chosen = id === current?.chosen?.id ? current.chosen : catalog().projects.find(project => project.id === id) || current?.challenges.find(project => project.id === id);
    if (!chosen) return;
    if (chosen.id === current.chosen?.id) work().selectedAssisted = true;
    if (catalog().projects.some(project => project.id === chosen.id)) {
      work().results[chosen.id] ||= {correct:false,attempts:0};
      work().results[chosen.id].assisted = true;
    } else {
      profile().blockResults ||= {};
      profile().blockResults[chosen.id] ||= {correct:false,attempts:0};
      if (!profile().blockResults[chosen.id].correct) profile().blockResults[chosen.id].assisted = true;
    }
    save();
  }
  function loadChosen(solution) {
    const chosen = current.chosen;
    if (!chosen) return;
    if (solution) markAssisted();
    else work().selectedAssisted = false;
    window.ELDIBlocks.load(solution ? chosen.solution : chosen.starter || {format:'ELDI-BLOCKS-1',workspace:{blocks:{languageVersion:0,blocks:[]}}});
    $('blockinput').value = chosen.input || '';
    work().input = $('blockinput').value;
    $('block-challenge-panel').open = false;
    $('blockcheck').textContent = solution ? 'Rješenje je učitano. Ovaj pokušaj se bilježi kao rad uz pomoć.' : 'Početni blokovi su učitani. Dovrši program i provjeri jedan od primjera.';
    selectInputExample(); save(); showMode('studio');
  }
  function openProject(id, options = {}) {
    const project = catalog().projects.find(item => item.id === id);
    if (!project) throw new Error('Projekat nije pronađen u biblioteci.');
    current.chosen = project;
    work().selectedId = id; work().selectedAssisted = false;
    profile().blockChallengeId = null;
    $('block-challenge').value = '';
    describe();
    loadChosen(options.solution === true);
    return project;
  }
  function onRun(result) {
    if (!result.challenge || !current) return;
    const project = catalog().projects.find(item => item.id === result.challenge.id);
    const legacy = current.challenges.find(item => item.id === result.challenge.id);
    if (!project && !legacy) return;
    const store = project ? work().results : (profile().blockResults ||= {});
    const old = store[result.challenge.id] || {};
    const assisted = !!work().selectedAssisted;
    store[result.challenge.id] = {...old,correct:!!(old.correct || result.challenge.correct),lastCorrect:!!result.challenge.correct,attempts:(old.attempts || 0)+1,assisted:!!(old.assisted || assisted),grade:(project || legacy).grade,date:new Date().toISOString()};
    if (project) store[result.challenge.id].independent = !!(old.independent || (result.challenge.correct && !assisted));
    if (project && result.challenge.correct && assisted) $('blockcheck').textContent += ' Rad uz pomoć; samostalno rješenje se bilježi zasebno.';
    scheduleWorkbenchFit();
    save();
  }
  function run(options = {}) {
    work().input = $('blockinput').value.slice(0,20000); save();
    return window.ELDIBlocks.run({input:$('blockinput').value,speed:+$('blockspeed').value,...options});
  }
  function getContext(project = current?.chosen) {
    if (!current) return null;
    const isCurrent = !project || project.id === current.chosen?.id;
    const statement = [project?.statement || project?.description || 'Pomozi mi razumjeti i popraviti ovaj blokovski program.',project?.goal ? `Cilj: ${project.goal}` : '',project?.expected ? `Očekivani rezultat glavnog primjera: ${project.expected}` : ''].filter(Boolean).join('\n\n');
    return {title:project?.title || 'Moj blokovski projekat',subject:'informatics',grade:project?.grade || 5,statement:statement.slice(0,12000),language:'javascript',code:isCurrent ? window.ELDIBlocks.code('js').slice(0,24000) : '',input:(isCurrent ? $('blockinput').value : project?.input || '').slice(0,8000),output:isCurrent ? $('blockout').textContent.slice(0,8000) : ''};
  }
  function askAI(project = current.chosen) {
    if (typeof current.options.askAI !== 'function') { setStatus('AI integracija nije dostupna u ovoj verziji aplikacije.',true); return; }
    const isCurrent = project?.id === current.chosen?.id;
    current.options.askAI(getContext(project),isCurrent && project ? () => markAssisted(project.id) : () => {});
  }
  function filteredProjects() {
    const term = $('bl-search').value.trim().toLocaleLowerCase('bs');
    const source = $('bl-source')?.value || 'all';
    const originalIds = new Set((builtins().projects || []).map(project => project.id));
    return catalog().projects.filter(project => (source === 'all' || (source === 'builtin' ? originalIds.has(project.id) : !originalIds.has(project.id))) && ($('bl-grade').value === 'all' || project.grade === +$('bl-grade').value) && ($('bl-category').value === 'all' || project.category === $('bl-category').value) && ($('bl-difficulty').value === 'all' || project.difficulty === +$('bl-difficulty').value) && (!term || [project.title,project.statement,project.goal,project.category].join(' ').toLocaleLowerCase('bs').includes(term)));
  }
  function renderLibrary() {
    if (!$('bl-list')) return;
    const all = catalog(), stats = summary();
    const selectedCategory = $('bl-category').value || 'all';
    $('bl-category').innerHTML = '<option value="all">Sve teme</option>' + [...new Set(all.projects.map(project => project.category))].sort((a,b) => a.localeCompare(b,'bs')).map(category => `<option value="${esc(category)}">${esc(category)}</option>`).join('');
    $('bl-category').value = [...$('bl-category').options].some(option => option.value === selectedCategory) ? selectedCategory : 'all';
    const rows = filteredProjects(), size = 18;
    current.libraryPage = Math.max(0,Math.min(current.libraryPage,Math.max(0,Math.ceil(rows.length/size)-1)));
    const start = current.libraryPage*size;
    $('bl-total').textContent = `${rows.length.toLocaleString('bs-BA')} projekata`;
    $('bl-page').textContent = rows.length ? `${start+1}–${Math.min(start+size,rows.length)} od ${rows.length}` : 'Nema rezultata';
    $('bl-prev').disabled = current.libraryPage === 0;
    $('bl-next').disabled = start+size >= rows.length;
    $('block-library-count').textContent = stats.projects.toLocaleString('bs-BA');
    $('bl-metric-projects').textContent = stats.builtinProjects.toLocaleString('bs-BA');
    $('bl-metric-families').textContent = (builtins().families || []).length;
    $('bl-metric-solved').textContent = stats.solved;
    $('bl-metric-independent').textContent = stats.independent;
    $('blpack-export-custom').disabled = work().packs.length === 0;
    $('bl-list').innerHTML = rows.slice(start,start+size).map(project => {
      const result = work().results[project.id], status = result?.independent ? 'Samostalno riješen' : result?.correct ? 'Riješen uz pomoć' : result?.attempts ? 'U toku' : 'Spreman za rad';
      const family = all.families.find(item => item.id === project.familyId);
      return `<article class="bl-project-card ${result?.correct ? 'bl-is-complete' : ''}"><div class="bl-card-top"><span class="bl-card-grade">${project.grade}</span><div><span class="bst-chip">${esc(project.category)}</span><span class="bst-chip">${esc(difficulty(project.difficulty))}</span></div><span class="bl-card-state ${result?.correct ? 'is-complete' : ''}">${esc(status)}</span></div><h3>${esc(project.title)}</h3><p>${esc(project.statement || project.description || project.goal)}</p><div class="bl-family">${esc(family?.title || 'Projekat')}${project.variant ? ` · varijanta ${project.variant}` : ''}</div><div class="bl-card-actions"><button data-bl-detail="${esc(project.id)}">Zadatak i pomoć</button><button class="primary" data-bl-start="${esc(project.id)}">U studiju ↗</button></div></article>`;
    }).join('') || '<div class="bl-empty"><h3>Nema projekata za ovaj izbor.</h3><p>Promijeni razred, temu ili riječ za pretragu.</p><button id="bl-reset-filters">Očisti filtere</button></div>';
    for (const button of $('bl-list').querySelectorAll('[data-bl-detail]')) button.onclick = () => showProject(button.dataset.blDetail);
    for (const button of $('bl-list').querySelectorAll('[data-bl-start]')) button.onclick = () => openProject(button.dataset.blStart);
    if ($('bl-reset-filters')) $('bl-reset-filters').onclick = () => { for (const id of ['bl-grade','bl-category','bl-difficulty','bl-source']) $(id).value = 'all'; $('bl-search').value = ''; current.libraryPage = 0; renderLibrary(); };
    $('bl-imported-packs').innerHTML = work().packs.map((pack,index) => `<div class="bl-imported-pack"><span><strong>${esc(pack.title || 'Vlastita zbirka '+(index+1))}</strong><small>${pack.projects.length} projekata</small></span><button data-bl-remove-pack="${index}" aria-label="Ukloni ${esc(pack.title || 'vlastitu zbirku')}">Ukloni</button></div>`).join('');
    for (const button of $('bl-imported-packs').querySelectorAll('[data-bl-remove-pack]')) button.onclick = () => removePack(+button.dataset.blRemovePack);
  }
  function showProject(id) {
    const project = catalog().projects.find(item => item.id === id);
    if (!project) return;
    $('bl-project-dialog')?.remove();
    const dialog = document.createElement('dialog'); dialog.id = 'bl-project-dialog'; dialog.className = 'bl-project-dialog';
    const examples = projectTests(project);
    dialog.innerHTML = `<div class="bl-dialog-header"><div><span class="bst-chip">${project.grade}. razred</span><span class="bst-chip">${esc(project.category)}</span><span class="bst-chip">${esc(difficulty(project.difficulty))}</span></div><button id="bl-detail-close" aria-label="Zatvori zadatak">✕</button></div><h2>${esc(project.title)}</h2><p class="bl-detail-goal">${esc(project.goal)}</p><p class="bl-detail-statement">${esc(project.statement || project.description)}</p><h3>Primjeri za provjeru</h3><div class="bl-example-grid">${examples.map((test,index) => `<section><h4>Primjer ${index+1}</h4><span>Ulaz</span><pre>${esc(test.input || '(nema ulaza)')}</pre><span>Očekivani rezultat</span><pre>${esc(test.check?.type === 'output' ? test.check.expected : project.expected || 'Crtež i stanje pozornice prema zadatku.')}</pre></section>`).join('')}</div><details class="bl-detail-help"><summary>Otvori pomoć po koracima</summary><h3>Smjernice</h3><ol>${list(project.hints).map(hint => `<li>${esc(hint)}</li>`).join('')}</ol><h3>Postupak rješenja</h3><ol>${list(project.steps).map(step => `<li>${esc(step)}</li>`).join('')}</ol></details><div class="bl-dialog-footer"><button id="bl-detail-start" class="primary">Učitaj početne blokove</button><button id="bl-detail-solution">Učitaj riješen projekat</button><button id="bl-detail-ai">✦ Pitaj AI asistenta</button></div><p class="bl-detail-note">Riješen projekat služi za učenje i bilježi se kao rad uz pomoć. Samostalni pokušaji imaju poseban rezultat.</p>`;
    current.options.root.append(dialog);
    $('bl-detail-close').onclick = () => dialog.remove();
    $('bl-detail-start').onclick = () => { dialog.remove(); openProject(id); };
    $('bl-detail-solution').onclick = () => { dialog.remove(); openProject(id,{solution:true}); };
    $('bl-detail-ai').onclick = () => { dialog.remove(); askAI(project); };
    dialog.addEventListener('cancel',() => dialog.remove());
    dialog.showModal();
  }
  function importCatalog(value, name = 'Uvezena zbirka') {
    const catalogValue = window.ELDIBlockCatalog.validateCatalog(value);
    const previous = work().packs;
    if (previous.length >= 30) throw new Error('Profil može sadržavati do 30 uvezenih zbirki.');
    if (previous.reduce((sum,pack) => sum+pack.projects.length,0)+catalogValue.projects.length > 1500) throw new Error('Vlastite zbirke zajedno mogu sadržavati do 1500 projekata. Ukloni zbirku prije novog uvoza.');
    const prefix = 'custom-'+crypto.randomUUID()+'-';
    const pack = window.ELDIBlockCatalog.validateCatalog({...catalogValue,title:String(name).slice(0,120),families:(catalogValue.families || []).map(family => ({...family,id:prefix+family.id})),projects:catalogValue.projects.map(project => ({...project,id:prefix+project.id,...(project.familyId ? {familyId:prefix+project.familyId} : {})}))});
    const candidateLibrary = {...work(),packs:[...previous,pack]};
    const candidateProfile = {...profile(),blockLibrary:candidateLibrary};
    if (new TextEncoder().encode(JSON.stringify(candidateLibrary)).length > 20*1024*1024) throw new Error('Vlastita biblioteka može sadržavati do 20 MB podataka.');
    if (new TextEncoder().encode(JSON.stringify(candidateProfile)).length > 30*1024*1024) throw new Error('Profil s novom zbirkom prelazi ograničenje od 30 MB. Izvezi ili ukloni dio sadržaja.');
    window.ELDIProfiles.validateProfile(candidateProfile);
    // Validation and remapping finish before any profile mutation; import never runs code.
    profile().blockLibrary = candidateLibrary; save();
    current.libraryPage = 0; renderLibrary();
    setStatus(`Uvezeno ${pack.projects.length} projekata. Pronađi ih u biblioteci i učitaj željeni projekat.`);
    return {projects:pack.projects.length,families:pack.families.length};
  }
  function removePack(index) {
    const pack = work().packs[index];
    if (!pack || !confirm(`Ukloniti zbirku „${pack.title || 'Vlastita zbirka'}” i njene rezultate iz ovog profila?`)) return;
    const removed = new Set(pack.projects.map(project => project.id));
    work().packs.splice(index,1);
    for (const id of removed) delete work().results[id];
    if (removed.has(work().selectedId)) { work().selectedId = null; current.chosen = null; work().selectedAssisted = false; describe(); }
    save(); renderLibrary(); setStatus('Vlastita zbirka je uklonjena.');
  }
  async function importFile(file) {
    if (!file) return;
    if (file.size > 30*1024*1024) throw new Error('ZIP ili JSON paket smije imati do 30 MB.');
    if (file.name.toLowerCase().endsWith('.json')) {
      const value = JSON.parse(await file.text());
      if (value?.format === 'ELDI-BLOCKS-1') {
        if (file.size > 2000000) throw new Error('Pojedinačni projekat smije imati do 2 MB.');
        window.ELDIBlocks.load(value); chooseLegacy(''); showMode('studio');
        $('blockcheck').textContent = 'Pojedinačni projekat je uvezen. Pokreni ga kada želiš.';
        return;
      }
      importCatalog(value,file.name.replace(/\.(json|zip)$/i,'')); return;
    }
    if (!window.eldiDesktop?.readBlockPack) throw new Error('Uvoz ZIP paketa dostupan je u Windows aplikaciji.');
    const result = await window.eldiDesktop.readBlockPack(new Uint8Array(await file.arrayBuffer()));
    importCatalog(result.catalog || result.pack,file.name.replace(/\.(json|zip)$/i,''));
  }
  async function downloadPack(custom = false) {
    const button = $(custom ? 'blpack-export-custom' : 'blpack-download');
    button.disabled = true;
    try {
      if (!window.eldiDesktop?.saveBlockPack) throw new Error('Preuzimanje ZIP paketa dostupno je u Windows aplikaciji.');
      let pack;
      if (custom) {
        pack = {...emptyCatalog(),title:'Moje blokovske zbirke',families:work().packs.flatMap(item => item.families),projects:work().packs.flatMap(item => item.projects)};
        pack = window.ELDIBlockCatalog.validateCatalog(pack);
      }
      const result = await window.eldiDesktop.saveBlockPack(pack);
      if (result?.success) setStatus(custom ? 'ZIP s vlastitim zbirkama je sačuvan.' : 'ZIP sa svih 1000 riješenih projekata je sačuvan.');
    } catch (error) { setStatus(error.message,true); }
    finally { button.disabled = custom && work().packs.length === 0; }
  }
  function mount(options) {
    current?.layoutObserver?.disconnect();
    const p = typeof options.profile === 'function' ? options.profile() : options.profile;
    current = {options,challenges:window.ELDI_BLOCK_CHALLENGES || [],chosen:null,mode:'studio',libraryPage:0};
    work();
    current.chosen = catalog().projects.find(project => project.id === work().selectedId) || current.challenges.find(challenge => challenge.id === p.blockChallengeId) || null;
    options.root.innerHTML = `<div class="block-studio-header"><div><span class="bst-eyebrow">DARK EDITION / STVARAJ I ISTRAŽUJ</span><h1>Blokovski studio<span class="bst-title-dot">.</span></h1></div><button id="block-ai" class="bst-ai-button">✦ Pitaj AI asistenta</button></div><div class="bst-mode-bar" role="tablist" aria-label="Blokovski studio i biblioteka"><button id="block-tab-studio" class="selected" role="tab" aria-selected="true" aria-controls="block-studio-section">◈ Radni prostor</button><button id="block-tab-library" role="tab" aria-selected="false" aria-controls="block-library-section">▦ Biblioteka <span id="block-library-count">${(builtins().projects || []).length}</span></button><span class="bst-mode-note">Uči kroz stvarne programe.</span></div><section id="block-studio-section" role="tabpanel" aria-labelledby="block-tab-studio"><details class="card block-challenge-panel" id="block-challenge-panel"><summary id="block-panel-summary">Izazovi i pomoć</summary><div class="row bst-legacy-filters"><label>Razred<select id="block-grade"><option value="all">Svi razredi</option>${[5,6,7,8,9].map(grade => `<option value="${grade}">${grade}. razred</option>`).join('')}</select></label><label>Oblast<select id="block-category"><option value="all">Sve oblasti</option>${[...new Set(current.challenges.map(challenge => challenge.category))].map(category => `<option value="${esc(category)}">${esc(category)}</option>`).join('')}</select></label><label>Početni izazovi · ${current.challenges.length}<select id="block-challenge"></select></label></div><div id="block-objective"></div><div class="row"><button id="challenge-starter">Učitaj početne blokove</button><button id="challenge-hint">Pokaži pomoć</button><button id="challenge-solution">Učitaj riješen primjer</button><button id="challenge-free">Slobodan projekat</button></div><div id="challenge-hints" class="block-hints" hidden></div></details><p id="block-task-brief" class="block-task-brief" hidden></p><p id="blockcheck" class="block-check-status" role="status" aria-live="polite"></p><div class="row tools block-toolbar"><button id="brun" class="primary">▶ Pokreni i provjeri</button><button id="bpause">Ⅱ Pauza / nastavi</button><button id="bstep">▸ Korak prikaza</button><button id="bstop">■ Zaustavi</button><label>Brzina<select id="blockspeed"><option value="20">Normalno</option><option value="150">Polako</option><option value="0">Odmah</option></select></label><button id="square">Kvadrat</button><button id="count">Brojanje</button><button id="bclear">Novi projekat</button><button id="bsave">Sačuvaj projekat</button><label>Uvezi JSON <input id="bimport" type="file" accept=".json" style="width:138px"></label></div><div class="block-layout"><div id="blocklyDiv"></div><div class="block-side"><div class="workspace-panel"><div class="stage"><canvas id="stage" width="480" height="360" aria-label="Pozornica likova i crteža"></canvas></div><div class="row"><label>Aktivni lik<select id="sprite"><option value="0">Lik 1</option><option value="1">Lik 2</option><option value="2">Lik 3</option></select></label></div><h3>Vrijednosti i trag</h3><pre id="blocktrace" class="block-trace">Pokreni program da pratiš vrijednosti.</pre></div><div class="block-notebook"><label id="block-test-label" class="bst-input-example" hidden>Primjer<select id="block-test-case"></select></label><label>Ulaz — jedan podatak po redu<textarea id="blockinput" maxlength="20000" aria-label="Ulaz za blokovski program"></textarea></label><h3>Konzola</h3><div id="blockout" class="terminal" role="status">Složi program i klikni Pokreni.</div></div><div class="block-code-panel"><div class="row"><label>Kod uživo<select id="blocklang"><option value="js">JavaScript</option><option value="py" selected>Python</option></select></label><button id="bcode">Izvezi kod</button><button id="bpython">Otvori Python u editoru</button></div><pre id="blockcode" class="result compact"></pre></div></div></div><details class="card block-guide"><summary>Kako raditi u studiju</summary><ol><li>Biblioteka sadrži 1000 riješenih projekata s jasno označenim algoritamskim porodicama i varijantama.</li><li>Otvori zadatak, prouči ulaz i izlaz pa učitaj početne blokove. Povuci naredbe iz kategorija i dovrši algoritam.</li><li>Pokreni svaki ponuđeni primjer. Za vlastiti ulaz program radi bez automatskog ocjenjivanja.</li><li>Riješen projekat otkriva cijeli postupak. Rezultati uz pomoć i samostalna rješenja bilježe se odvojeno.</li><li>Sačuvaj projekat kao JSON, preuzmi ZIP zbirku ili prenesi konzolni Python u ugrađeni editor.</li></ol></details><p class="notice">Scratch .sb3 nije podržan. Tipke se očitavaju pri pokretanju; pauza i korak upravljaju prikazom na pozornici. Grafički Python traži punu instalaciju s Tkinterom. AI pomoć se povezuje kroz zasebne postavke i internet.</p></section><section id="block-library-section" role="tabpanel" aria-labelledby="block-tab-library" hidden><div class="bl-library-hero"><div><span class="bl-hero-label">ZBIRKA KOJA SE MOŽE UČITATI</span><h2>Hiljadu projekata.<br>Od prve petlje do algoritma.</h2><p>Početni blokovi, riješen program, pomoć po koracima i primjeri za provjeru — za 5–9. razred.</p><div class="bl-hero-actions"><button id="blpack-download" class="primary">↓ ZIP · 1000 rješenja</button><label class="bl-import-button" for="bpackimport">↑ Uvezi ZIP / JSON<input id="bpackimport" type="file" accept=".zip,.json"></label><button id="blpack-export-custom">Izvezi vlastite zbirke</button></div></div><div class="bl-hero-art" aria-hidden="true"><div class="bl-art-block bl-art-a">ponovi <strong>10</strong> puta</div><div class="bl-art-block bl-art-b">ako <strong>ideja</strong> onda</div><div class="bl-art-block bl-art-c">napravi <strong>program ↗</strong></div><span>{ }</span></div></div><div class="bl-library-metrics"><div><strong id="bl-metric-projects">1000</strong><span>riješenih projekata</span></div><div><strong id="bl-metric-families">—</strong><span>algoritamskih porodica</span></div><div><strong id="bl-metric-solved">0</strong><span>uspješnih projekata</span></div><div><strong id="bl-metric-independent">0</strong><span>samostalnih rješenja</span></div></div><p id="blpack-status" class="bl-pack-status" role="status" aria-live="polite"></p><div id="bl-imported-packs" class="bl-imported-packs"></div><div class="bl-library-filters"><label class="bl-search-label">Pronađi projekat<input id="bl-search" type="search" placeholder="npr. razlomci, petlje, nizovi…" maxlength="200"></label><label>Razred<select id="bl-grade"><option value="all">Svi razredi</option>${[5,6,7,8,9].map(grade => `<option value="${grade}">${grade}. razred</option>`).join('')}</select></label><label>Tema<select id="bl-category"><option value="all">Sve teme</option></select></label><label>Nivo<select id="bl-difficulty"><option value="all">Svi nivoi</option><option value="1">1 · Uvodni</option><option value="2">2 · Početni</option><option value="3">3 · Srednji</option><option value="4">4 · Zahtjevni</option><option value="5">5 · Napredni</option></select></label></div><div class="bl-results-heading"><strong id="bl-total">1000 projekata</strong><label class="bl-source-filter">Prikaz<select id="bl-source"><option value="all">Sve zbirke</option><option value="builtin">Ugrađenih 1000</option><option value="custom">Vlastite zbirke</option></select></label><span>Varijante unutar porodice dijele osnovni algoritam.</span></div><div id="bl-list" class="bl-project-grid"></div><div class="bl-pagination"><button id="bl-prev">← Prethodni</button><span id="bl-page"></span><button id="bl-next">Sljedeći →</button></div></section>`;
    window.ELDIBlocks.init({initial:p.blocks,onSave:data => {p.blocks = data; save();},onRun});
    current.layoutObserver = new MutationObserver(scheduleWorkbenchFit);
    current.layoutObserver.observe($('blockcheck'),{childList:true,characterData:true,subtree:true});
    $('block-challenge-panel').addEventListener('toggle',scheduleWorkbenchFit);
    $('block-tab-studio').onclick = () => showMode('studio'); $('block-tab-library').onclick = () => showMode('library');
    $('block-ai').onclick = () => askAI();
    $('block-grade').onchange = challengeList; $('block-category').onchange = challengeList;
    $('block-challenge').onchange = () => chooseLegacy($('block-challenge').value);
    $('challenge-starter').onclick = () => loadChosen(false); $('challenge-solution').onclick = () => loadChosen(true);
    $('challenge-hint').onclick = () => {
      if (!current.chosen) return;
      markAssisted();
      $('challenge-hints').innerHTML = '<ol>'+list(current.chosen.hints).map(hint => `<li>${esc(hint)}</li>`).join('')+'</ol>' + (current.chosen.steps?.length ? '<details><summary>Postupak rješenja</summary><ol>'+list(current.chosen.steps).map(step => `<li>${esc(step)}</li>`).join('')+'</ol></details>' : '');
      $('challenge-hints').hidden = false;
    };
    $('challenge-free').onclick = () => { chooseLegacy(''); $('block-challenge-panel').open = false; };
    $('brun').onclick = () => run(); $('bpause').onclick = () => window.ELDIBlocks.getState().paused ? window.ELDIBlocks.resume() : window.ELDIBlocks.pause();
    $('bstep').onclick = () => window.ELDIBlocks.step(); $('bstop').onclick = () => window.ELDIBlocks.stop();
    $('square').onclick = () => { chooseLegacy(''); window.ELDIBlocks.example('square'); };
    $('count').onclick = () => { chooseLegacy(''); window.ELDIBlocks.example('count'); };
    $('bclear').onclick = () => { if (confirm('Očistiti trenutni projekat? Sačuvaj ga prvo ako je potreban.')) { chooseLegacy(''); window.ELDIBlocks.clear(); } };
    $('bsave').onclick = () => options.exportFile('ELDI-projekat.json',JSON.stringify(window.ELDIBlocks.serialize(),null,2),'application/json');
    $('bimport').onchange = async () => { try { await importFile($('bimport').files[0]); } catch (error) { alert(error.message); } finally { $('bimport').value = ''; } };
    $('sprite').onchange = () => window.ELDIBlocks.select(+$('sprite').value); $('blocklang').onchange = window.ELDIBlocks.update;
    $('bcode').onclick = () => options.exportFile('blokovi.'+($('blocklang').value === 'py' ? 'py' : 'js'),window.ELDIBlocks.code($('blocklang').value));
    $('bpython').onclick = () => options.openPython(window.ELDIBlocks.code('py'),$('blockinput').value);
    $('blockinput').oninput = () => { work().input = $('blockinput').value; selectInputExample(); save(); };
    $('block-test-case').onchange = () => { const test = projectTests(current.chosen)[+$('block-test-case').value]; if ($('block-test-case').value !== '' && test) { $('blockinput').value = test.input; work().input = test.input; $('blockcheck').textContent = ''; save(); } };
    for (const id of ['bl-grade','bl-category','bl-difficulty','bl-source']) $(id).onchange = () => { current.libraryPage = 0; renderLibrary(); };
    $('bl-search').oninput = () => { current.libraryPage = 0; renderLibrary(); };
    $('bl-prev').onclick = () => { current.libraryPage--; renderLibrary(); }; $('bl-next').onclick = () => { current.libraryPage++; renderLibrary(); };
    $('blpack-download').onclick = () => downloadPack(); $('blpack-export-custom').onclick = () => downloadPack(true);
    $('bpackimport').onchange = async () => { try { setStatus('Provjeravam i uvozim paket…'); await importFile($('bpackimport').files[0]); } catch (error) { setStatus(error.message,true); } finally { $('bpackimport').value = ''; } };
    challengeList();
    $('blockinput').value = work().selectedId ? work().input : current.chosen?.input || '';
    describe(); renderLibrary();
    return {openProject,showLibrary:() => showMode('library'),showStudio:() => showMode('studio'),run,importCatalog,catalog,summary,getContext,markAssisted,fitWorkbench};
  }
  window.addEventListener('resize',scheduleWorkbenchFit);
  return {mount,openProject,showLibrary:() => showMode('library'),showStudio:() => showMode('studio'),run,importCatalog,catalog,summary,getContext,markAssisted,fitWorkbench};
})();
