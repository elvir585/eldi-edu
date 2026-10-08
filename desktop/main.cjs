'use strict';
const { app, BrowserWindow, ipcMain, Menu, session, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL, fileURLToPath } = require('node:url');
const { createRunner } = require('./runner.cjs');
const learningPacks = require('./learning-packs.cjs');

const smokeTest = process.argv.includes('--smoke-test');
const rendererRoot = path.resolve(__dirname, '..', 'renderer');
const assetRoots = [rendererRoot, path.resolve(__dirname, '..', 'app'), path.resolve(__dirname, '..', 'content')];
const entry = path.join(rendererRoot, 'index.html');
const entryURL = pathToFileURL(entry).href;
const runtimeRoot = app.isPackaged ? path.join(process.resourcesPath, 'runtimes') : path.resolve(__dirname, '..', 'runtimes');
const runner = createRunner({ runtimeRoot, allowSystem: !app.isPackaged });
const bundledPackFilename = 'ELDI-EDU-10.4.0-Zbirke-i-rjesenja.zip';
const bundledPackPath = path.resolve(__dirname, '..', 'content', 'packs', bundledPackFilename);
let mainWindow;

app.setName('ELDI EDU');
// Development and packaged checks must each start with an empty test profile.
// Production upgrades keep the normal userData directory and existing work.
if (smokeTest) {
  app.setPath('userData', fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'eldi-smoke-')));
}
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => { if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); } });
  app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
      let allowed = details.url.startsWith('data:') || details.url.startsWith('blob:') || details.url.startsWith('devtools:');
      // Chromium's built-in PDF viewer is an internal extension. Its resources
      // are needed for local books; no external websites are enabled here.
      if (details.url.startsWith('chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai/')) allowed = true;
      if (details.url.startsWith('chrome://resources/') && (details.initiatorOrigin === 'chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai' || details.frame?.url.startsWith('chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai/'))) allowed = true;
      if (details.url.startsWith('file:')) {
        try { const target = fileURLToPath(new URL(details.url)); allowed = assetRoots.some(root => target.startsWith(root + path.sep)); } catch {}
      }
      callback({ cancel: !allowed });
    });
    mainWindow = new BrowserWindow({
      width: 1440, height: 940, minWidth: 900, minHeight: 640, backgroundColor: '#080f20',
      title: 'ELDI EDU 10.4.0 — Zbirke i rješenja', show: !smokeTest,
      icon: path.join(rendererRoot, 'assets', 'eldi.ico'),
      webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true, allowRunningInsecureContent: false, spellcheck: false, plugins: true, backgroundThrottling: !smokeTest }
    });
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      { label: 'ELDI EDU', submenu: [{ label: 'Zatvori', role: 'quit' }] },
      { label: 'Uredi', submenu: [{ label: 'Kopiraj', role: 'copy' }, { label: 'Zalijepi', role: 'paste' }, { label: 'Označi sve', role: 'selectAll' }] },
      { label: 'Prikaz', submenu: [{ label: 'Uvećaj', role: 'zoomIn' }, { label: 'Umanji', role: 'zoomOut' }, { label: 'Izvorna veličina', role: 'resetZoom' }, { label: 'Cijeli ekran', role: 'togglefullscreen' }] }
    ]));
    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    mainWindow.webContents.on('will-navigate', (event, url) => { if (url.split('#')[0] !== entryURL) event.preventDefault(); });
    mainWindow.webContents.on('will-attach-webview', event => event.preventDefault());
    let closeAllowed = false, closing = false;
    mainWindow.on('close', event => {
      if (closeAllowed) return;
      event.preventDefault();
      if (closing) return;
      closing = true; runner.cancel();
      const window = mainWindow;
      window.webContents.executeJavaScript('window.ELDIStorage?.flush()').catch(error => console.error('Čuvanje pri zatvaranju:', error.message)).finally(() => {
        closeAllowed = true;
        if (!window.isDestroyed()) window.close();
      });
    });
    mainWindow.on('closed', () => { runner.cancel(); mainWindow = null; });
    function trusted(event) { if (!mainWindow || event.sender !== mainWindow.webContents || !event.senderFrame || event.senderFrame.url.split('#')[0] !== entryURL) throw new Error('Zahtjev nije iz glavnog prozora.'); }
    ipcMain.handle('eldi:run-code', async (event, request) => { trusted(event); try { return await runner.runCode(request); } catch (error) { return { ok: false, phase: 'validation', stdout: '', stderr: error.message, exitCode: null, timedOut: false, truncated: false, cancelled: false }; } });
    ipcMain.handle('eldi:cancel-run', event => { trusted(event); return runner.cancel(); });
    ipcMain.handle('eldi:runtime-status', event => { trusted(event); return runner.runtimeStatus(); });
    ipcMain.handle('eldi:read-learning-pack', (event, bytes) => {
      trusted(event);
      return learningPacks.readPack(bytes);
    });
    ipcMain.handle('eldi:save-learning-pack', async (event, pack) => {
      trusted(event);
      // Validation precedes the dialog. Renderer data cannot supply a path.
      const bytes = pack == null ? await fs.promises.readFile(bundledPackPath) : learningPacks.createPackZip(pack);
      const filename = pack == null ? bundledPackFilename : 'ELDI-EDU-Moja-zbirka.zip';
      const selection = await dialog.showSaveDialog(mainWindow, { title: 'Sačuvaj zbirku i rješenja', defaultPath: path.join(app.getPath('documents'), filename), filters: [{ name: 'ELDI EDU ZIP paket', extensions: ['zip'] }], properties: ['showOverwriteConfirmation'] });
      if (selection.canceled || !selection.filePath) return { success: false, canceled: true };
      await fs.promises.writeFile(selection.filePath, bytes);
      return { success: true, path: selection.filePath };
    });
    ipcMain.handle('eldi:print-page', async event => {
      trusted(event);
      const landscape = await mainWindow.webContents.executeJavaScript("document.body.classList.contains('printing-certificate')");
      return new Promise(resolve => mainWindow.webContents.print({ silent: false, printBackground: true, landscape, pageSize: 'A4' }, (success, failureReason) => resolve({ success, failureReason })));
    });
    ipcMain.handle('eldi:save-certificate-pdf', async (event, filename) => {
      trusted(event);
      if (typeof filename !== 'string' || filename.length > 160 || path.basename(filename) !== filename || /[\\/:*?"<>|\u0000-\u001f]/.test(filename) || !filename.toLowerCase().endsWith('.pdf')) throw new Error('Naziv PDF fajla nije ispravan.');
      const certificate = await mainWindow.webContents.executeJavaScript("document.body.classList.contains('printing-certificate') && !!document.querySelector('.certificate-sheet')");
      if (!certificate) throw new Error('Prvo otvorite diplomu ili potvrdu rezultata.');
      const selection = await dialog.showSaveDialog(mainWindow, { title: 'Sačuvaj ELDI EDU priznanje', defaultPath: path.join(app.getPath('documents'), filename), filters: [{ name: 'PDF dokument', extensions: ['pdf'] }], properties: ['showOverwriteConfirmation'] });
      if (selection.canceled || !selection.filePath) return { cancelled: true };
      const bytes = await mainWindow.webContents.printToPDF({ printBackground: true, pageSize: 'A4', landscape: true, preferCSSPageSize: true });
      await fs.promises.writeFile(selection.filePath, bytes);
      return { cancelled: false, saved: true };
    });
    mainWindow.loadFile(entry).catch(error => { console.error(error); if (smokeTest) app.exit(1); });
    if (smokeTest) {
      const timer = setTimeout(() => { console.error('Desktop smoke test timeout.'); app.exit(1); }, 180000);
      mainWindow.webContents.once('did-finish-load', async () => {
        try {
          const result = await runDesktopSmoke(mainWindow);
          clearTimeout(timer);
          console.log('Desktop smoke test passed:', JSON.stringify(result));
          app.exit(0);
        } catch (error) { console.error(error); app.exit(1); }
      });
    }
  });
}
app.on('window-all-closed', () => app.quit());
app.on('before-quit', () => runner.cancel());

async function runDesktopSmoke(window) {
  window.showInactive();
  const output = path.join(process.cwd(), 'smoke-previews', app.isPackaged ? 'packaged' : 'development');
  await fs.promises.mkdir(output, { recursive: true });
  const bundledBytes = await fs.promises.readFile(bundledPackPath);
  const bundled = learningPacks.readPack(bundledBytes);
  const programBook = bundled.pack.books.find(book => book.subject === 'informatics');
  const mathBook = bundled.pack.books.find(book => book.subject === 'math');
  if (bundled.pack.books.length !== 2 || programBook?.tasks.length !== 162 || mathBook?.tasks.length !== 53) throw new Error('Ugrađeni ZIP mora sadržati obje zbirke, 162 programerska i 53 matematička zadatka.');
  for (const task of programBook.tasks) for (const language of ['python', 'cpp']) {
    if (typeof task.solutions?.[language]?.code !== 'string' || !task.solutions[language].code.trim()) throw new Error('U ZIP paketu nedostaje rješenje: ' + task.id + '/' + language);
  }
  for (const book of [mathBook, programBook]) {
    if (!bundled.report.filePaths.includes(book.sourceFile)) throw new Error('U ZIP paketu nedostaje cijela PDF knjiga: ' + book.title);
    const filename = path.resolve(__dirname, '..', book.sourceFile);
    const handle = await fs.promises.open(filename, 'r');
    try {
      const header = Buffer.alloc(4);
      await handle.read(header, 0, 4, 0);
      if (header.toString() !== '%PDF' || (await handle.stat()).size < 1000) throw new Error('U aplikaciji nedostaje izvorna PDF knjiga: ' + book.title);
    } finally { await handle.close(); }
  }
  const helpers = `
    const ensure=(condition,message)=>{if(!condition)throw new Error(message);};
    const $=id=>document.getElementById(id);
    const answer=field=>Array.isArray(field.answer)?field.answer.length?field.answer.join('; '):'nema':String(field.answer);
    const fill=(element,value)=>{ensure(element,'Nedostaje polje za odgovor.');element.value=value;element.dispatchEvent(new Event('input',{bubbles:true}));};
    const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const rgb=colour=>{const values=String(colour).match(/[\\d.]+/g);ensure(values&&values.length>=3,'Nije prikazana RGB boja: '+colour);return values.slice(0,3).map(Number);};
    const brightness=colour=>rgb(colour).reduce((sum,value)=>sum+value,0)/3;
    const luminance=colour=>rgb(colour).map(value=>{value/=255;return value<=0.04045?value/12.92:Math.pow((value+0.055)/1.055,2.4);}).reduce((sum,value,i)=>sum+value*[0.2126,0.7152,0.0722][i],0);
    const contrast=(foreground,background)=>{const a=luminance(foreground),b=luminance(background);return(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);};
  `;
  const evaluate = code => window.webContents.executeJavaScript(`(async()=>{${helpers}${code}})()`);
  async function stage(name, code) {
    console.log('Desktop smoke stage:', name);
    return evaluate(code);
  }
  async function capture(name) {
    await evaluate('window.scrollTo(0,0);await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));await wait(200);');
    const screenshot = await window.webContents.capturePage();
    if (screenshot.isEmpty()) throw new Error('Prazna slika desktop prozora: ' + name);
    await fs.promises.writeFile(path.join(output, name + '.png'), screenshot.toPNG());
  }
  const initial = await stage('startup and all pages', `
    const deadline=Date.now()+5000;
    while(!window.__eldiReady&&Date.now()<deadline)await wait(50);
    ensure(window.__eldiReady,'Početni podaci i profil nisu učitani.');
    ensure(document.body.classList.contains('dark'),'Dark Edition mora se pokrenuti u tamnoj temi.');
    ensure($('theme').getAttribute('aria-pressed')==='true','Dugme teme mora prikazati aktivnu tamnu temu.');
    const bodyStyle=getComputedStyle(document.body);
    ensure(brightness(bodyStyle.backgroundColor)<60,'Pozadina aplikacije nije tamna: '+bodyStyle.backgroundColor);
    ensure(contrast(bodyStyle.color,bodyStyle.backgroundColor)>=7,'Tekst aplikacije nema dovoljan kontrast u tamnoj temi.');
    for(const key of ['eldiDesktop','EduMath','EduPractice','ELDICollection','ELDIBlocks','ELDICourses','ELDIExams','ELDIAwards','ELDIExamEngine','ELDIStorage','ELDIBooks','ELDIContentPacks'])ensure(window[key],'Nije učitano: '+key);
    ensure(ELDI_MATH_CATALOG.length===500&&ELDI_INFORMATICS_CATALOG.length===500,'Katalog mora imati 500 matematičkih i 500 informatičkih cjelina.');
    ensure(EduPractice.topics.length===500,'Praktična matematika mora imati 500 vještina.');
    const visited=[];
    for(const name of ['home','courses','books','lessons','collection','math','blocks','code','exams','awards','progress','about']){
      go(name);ensure($('view').innerText.length>20,'Prazna stranica: '+name);ensure(document.body.dataset.page===name,'Nije primijenjen izgled stranice: '+name);visited.push(name);
    }
    ensure(EduMath.evaluate('1/2+1/3').exact==='5/6','Računanje razlomaka nije tačno.');
    ensure(ELDI_MATH_PROJECTS.length>=35&&ELDI_BLOCK_CHALLENGES.length>=60,'Prošireni praktični sadržaj nije učitan.');
    go('home');
    return {title:document.title,math:ELDI_MATH_CATALOG.length,informatics:ELDI_INFORMATICS_CATALOG.length,programming:ELDI_TASKS.length,visited};
  `);
  await capture('01-home');
  await stage('catalog navigation and practical course work', `
    go('courses');
    ensure(document.querySelectorAll('.course-card').length===24,'Prva stranica kataloga nije prikazala 24 cjeline.');
    $('course-next').click();ensure($('course-pages').innerText.includes('2 od'),'Katalog se nije prebacio na sljedeću stranicu.');
    $('course-prev').click();
    for(const grade of [5,6,7,8,9])for(const subject of ['math','informatics']){
      $('course-grade').value=grade;$('course-subject').value=subject;$('course-subject').onchange();
      ensure($('course-count').textContent.includes('100 cjelina'),'Nedostaju cjeline '+grade+'/'+subject);
    }
    $('course-grade').value=5;$('course-subject').value='math';$('course-subject').onchange();
  `);
  await capture('02-courses');
  await stage('course answer check and stored notes', `
    const lesson=ELDI_MATH_CATALOG.find(l=>l.grade===5);
    ELDICourses.open(lesson.id);$('course-check').click();
    ensure(!$('course-result').textContent.includes('je riješen'),'Prazan praktični rad ne smije biti tačan.');
    const task=EduPractice.generate(lesson.id,1,'medium');
    task.fields.forEach((field,index)=>fill($('course-answer-'+index),answer(field)));
    fill($('course-notes'),'Moj postupak u novom katalogu.');$('course-check').click();
    ensure(state().courseResults[lesson.id]?.correct,'Praktični rad iz kataloga nije tačno provjeren.');
    ensure(state().courseNotes[lesson.id]==='Moj postupak u novom katalogu.','Bilješke iz cjeline nisu sačuvane.');
  `);
  await capture('03-course-detail');
  await stage('worksheet answers, notes and 50-task sheets', `
    go('collection');
    const topic=EduPractice.topics.find(t=>t.grade===5);ELDICollection.startTopic(topic.id,17);
    $('sheet-check').click();ensure($('sheet-status').textContent.includes('0/1'),'Prazni odgovori nisu odbijeni.');
    const exercise=EduPractice.generate(topic.id,17,'medium');
    exercise.fields.forEach((field,index)=>fill($('task-0-field-'+index),answer(field)));
    fill(document.querySelector('[data-notes]'),'Moj račun: provjera paketa');$('sheet-check').click();
    ensure($('sheet-status').textContent.includes('1/1')&&state().mathWork.results[exercise.id].correct,'Provjera matematičkog odgovora nije uspjela.');
    go('collection');$('collection-resume').click();ensure(document.querySelector('[data-notes]').value==='Moj račun: provjera paketa','Pisani postupak nije sačuvan.');
    go('collection');$('collection-mixed').click();$('sheet-count').value='50';ensure($('sheet-count').value==='50','Nedostaje radni list od 50 zadataka.');$('sheet-create').click();
    const refs=state().mathWork.session;
    ensure(refs.length===50&&document.querySelectorAll('.solving-task').length===50,'Radni list od 50 zadataka nije napravljen.');
    ensure(new Set(refs.map(ref=>ref.topicId)).size>1,'Mješoviti list ponavlja samo jednu vještinu.');
    refs.forEach((ref,i)=>EduPractice.generate(ref.topicId,ref.seed,ref.difficulty).fields.forEach((field,j)=>fill($('task-'+i+'-field-'+j),answer(field))));
    $('sheet-check').click();ensure($('sheet-status').textContent.includes('50/50'),'Radni list od 50 zadataka nije tačno provjeren.');
    await ELDIStorage.flush();
  `);
  await stage('Blockly runtime, challenge and drawing', `
    go('blocks');
    const challenge=ELDI_BLOCK_CHALLENGES.find(c=>c.check.type==='output');ensure(challenge,'Nedostaje izvršiv blokovski izazov.');
    $('block-challenge').value=challenge.id;$('block-challenge').onchange();$('challenge-solution').click();
    const checked=await ELDIBlocks.run({input:challenge.input||'',speed:0});
    ensure(checked.ok&&checked.challenge?.correct&&state().blockResults[challenge.id]?.correct,'Blokovski izazov nije provjeren: '+JSON.stringify(checked));
    ELDIBlocks.example('square');
    const squareCode=ELDIBlocks.code('js');
    const actions=await new Promise((resolve,reject)=>{
      const worker=new Worker('block-worker.js'),actions=[];
      const timer=setTimeout(()=>{worker.terminate();reject(new Error('Blokovski program nije završen.'));},7000);
      worker.onerror=event=>{clearTimeout(timer);worker.terminate();reject(new Error(event.message));};
      worker.onmessage=event=>{
        if(event.data.type==='actions')actions.push(...event.data.actions);
        if(event.data.type==='error'){clearTimeout(timer);worker.terminate();reject(new Error(event.data.message));}
        if(event.data.type==='done'){clearTimeout(timer);worker.terminate();resolve(actions);}
      };
      worker.postMessage({code:squareCode,keys:[],sprite:0});
    });
    ensure(actions.filter(a=>a.type==='move').length===4&&actions.filter(a=>a.type==='turn').length===4,'Crtanje kvadrata nije uspjelo.');
    $('challenge-free').click();ELDIBlocks.example('square');await ELDIBlocks.run({input:'',speed:0});
    ensure(document.querySelectorAll('.blocklyToolboxCategoryLabel').length>=14,'Kategorije blokova nisu vidljive.');
    $('block-challenge-panel').open=false;
    const rect=$('blocklyDiv').getBoundingClientRect();ensure(rect.width>300&&rect.height>=360,'Radni prostor za blokove nema dovoljnu veličinu.');
    ensure(rect.top<250,'Blokovski radni prostor potisnut je ispod uvodnih panela: '+rect.top);
    for(const id of ['stage','blockcode','blockout']){
      const box=$(id).getBoundingClientRect();ensure(box.top>=rect.top&&box.bottom<=innerHeight+100,'Pozornica, kod i konzola moraju biti u prvom prikazu: '+id+' '+box.bottom+'/'+innerHeight);
      ensure(box.left>=rect.right,'Izvršavanje i kod moraju ostati desno od blokova: '+id);
    }
  `);
  await capture('04-blocks');
  await stage('dark Blockly colors and reversible theme choice', `
    const workspace=document.querySelector('#blocklyDiv .blocklySvg'),toolbox=document.querySelector('#blocklyDiv .blocklyToolbox');
    ensure(workspace&&toolbox,'Nedostaje prikaz Blockly radnog prostora ili kategorija.');
    ensure(brightness(getComputedStyle(workspace).backgroundColor)<95,'Blokovski radni prostor nije tamno obojen.');
    ensure(brightness(getComputedStyle(toolbox).backgroundColor)<95,'Kategorije blokova nisu na tamnoj pozadini.');
    for(const id of ['blocklang','blockinput']){
      const style=getComputedStyle($(id));
      ensure(brightness(style.backgroundColor)<110,'Kontrola nije tamna: '+id);
      ensure(contrast(style.color,style.backgroundColor)>=4.5,'Kontrola nije čitljiva u tamnoj temi: '+id);
    }
    await wait(100);await ELDIStorage.flush();
    window.__themeWorkspaceSnapshot=JSON.stringify(ELDIBlocks.serialize());
    window.__themeProfileSnapshot=JSON.stringify(store);
    $('theme').click();await wait(100);
    ensure(!document.body.classList.contains('dark')&&$('theme').getAttribute('aria-pressed')==='false','Prelazak na svijetlu temu nije uspio.');
    ensure(brightness(getComputedStyle(workspace).backgroundColor)>150,'Blockly nije prešao na svijetlu temu.');
    ensure(JSON.stringify(ELDIBlocks.serialize())===window.__themeWorkspaceSnapshot,'Promjena teme izmijenila je složeni blokovski program.');
    ensure(JSON.stringify(store)===window.__themeProfileSnapshot,'Promjena teme izmijenila je rad učenika.');
  `);
  await capture('04-blocks-light');
  await stage('dark theme restored without changing program', `
    $('theme').click();await wait(100);
    ensure(document.body.classList.contains('dark')&&$('theme').getAttribute('aria-pressed')==='true','Povratak na tamnu temu nije uspio.');
    ensure(brightness(getComputedStyle(document.querySelector('#blocklyDiv .blocklySvg')).backgroundColor)<95,'Blockly nije vratio tamnu pozadinu.');
    ensure(JSON.stringify(ELDIBlocks.serialize())===window.__themeWorkspaceSnapshot,'Povratak na tamnu temu izmijenio je program.');
    ensure(JSON.stringify(store)===window.__themeProfileSnapshot,'Povratak na tamnu temu izmijenio je profil.');
    delete window.__themeWorkspaceSnapshot;delete window.__themeProfileSnapshot;
  `);
  await stage('profile creation and all mathematics laboratories', `
    go('home');$('new-profile').click();$('profile-name').value='Provjera paketa';$('profile-create').click();
    ensure($('profile').selectedOptions[0].textContent==='Provjera paketa','Kreiranje profila nije uspjelo.');
    go('math');mathTool('div');$('calculate').click();ensure($('result').textContent.includes('NZD = 24'),'Laboratorij nije prikazao NZD.');
    mathTool('geo');
    for(const shape of ['rectangle','square','triangle','circle','cuboid','cube','prism','pyramid','cylinder','cone','sphere']){
      $('shape').value=shape;$('calculate').click();ensure(/(Površina|Zapremina)/.test($('result').textContent),'Geometrijski alat: '+shape+' '+$('result').textContent);
    }
  `);
  await stage('native Python C C++ Java execution', `
    go('code');
    const status=await eldiDesktop.runtimeStatus();
    for(const language of ['python','c','cpp','java']){
      ensure(status[language]?.available,'Nije dostupan ugrađeni '+language);
      $('lang').value=language;$('lang').onchange();fill($('editor'),$('editor').value);$('input').value='1000000000 1000000000';$('run').click();
      const deadline=Date.now()+25000;
      while($('output').textContent==='Pokretanje…'&&Date.now()<deadline)await wait(50);
      ensure($('output').textContent.includes('2000000000')&&$('output').textContent.includes('Program završen.'),'Desktop '+language+': '+$('output').textContent);
    }
  `);
  await stage('book catalog, search and worked programming help', `
    go('books');
    ensure(Array.isArray(ELDI_BOOKS)&&ELDI_BOOKS.length===2,'Dvije PDF zbirke nisu učitane u posebnu sekciju.');
    const programming=ELDI_BOOKS.find(book=>book.subject==='informatics'),mathematics=ELDI_BOOKS.find(book=>book.subject==='math');
    ensure(programming.tasks.length===162&&mathematics.tasks.length===53,'Katalog zbirki ne prikazuje pripremljene zadatke.');
    ensure((programming.pageCount||programming.sourcePages)===464&&(mathematics.pageCount||mathematics.sourcePages)===203,'Katalog mora zadržati obje cijele izvorne knjige.');
    $('books-book').value=programming.id;$('books-book').dispatchEvent(new Event('change',{bubbles:true}));
    fill($('books-search'),programming.tasks[0].title);
    ensure(document.querySelector('[data-books-task]'),'Pretraga programerske zbirke nije vratila zadatak.');
    fill($('books-search'),'');
  `);
  await capture('07-books');
  await stage('progressive help and saved book notes', `
    const book=ELDI_BOOKS.find(book=>book.subject==='informatics'),task=book.tasks[0];
    ELDIBooks.open(book.id,task.id);
    ensure($('view').innerText.includes(task.title),'Zadatak iz zbirke nije otvoren.');
    $('books-hint').click();$('books-solution').click();
    const hint=Array.isArray(task.help)?task.help[0]:task.help;
    ensure(typeof hint==='string'&&hint.length>10&&$('view').innerText.includes(hint),'Pripremljena pomoć nije prikazana.');
    ensure($('view').innerText.includes(task.solutions.python.code.slice(0,40)),'Python rješenje nije prikazano.');
    fill($('books-notes'),'Moj postupak iz knjige: ulaz, račun, provjera rezultata.');
    await ELDIStorage.flush();
    go('books');ELDIBooks.open(book.id,task.id);
    ensure($('books-notes').value==='Moj postupak iz knjige: ulaz, račun, provjera rezultata.','Postupak iz zbirke nije sačuvan uz profil.');
    $('books-solution').click();
  `);
  await capture('08-book-task');
  await stage('book solutions transfer to real Python and C++ editor', `
    const book=ELDI_BOOKS.find(book=>book.subject==='informatics');
    for(const task of [book.tasks[0],book.tasks.at(-1)])for(const language of ['python','cpp']){
      go('books');ELDIBooks.open(book.id,task.id);
      ensure(task.examples?.length&&task.solutions[language]?.code,'Nedostaje program ili primjer za '+task.id+'/'+language);
      $('books-solution').click();
      $('books-code-language').value=language;$('books-code-language').dispatchEvent(new Event('change',{bubbles:true}));
      $('books-open-editor').click();
      ensure(document.body.dataset.page==='code'&&$('lang').value===language,'Rješenje nije otvoreno u odgovarajućem editoru.');
      ensure($('editor').value===task.solutions[language].code,'Rješenje pri prenosu u editor promijenilo je kod.');
      ensure($('input').value===task.examples[0].input,'Primjer ulaza nije prenesen u editor.');
      $('run').click();
      const deadline=Date.now()+25000;while($('output').textContent==='Pokretanje…'&&Date.now()<deadline)await wait(50);
      const actual=$('output').textContent.replace(/\\s+/g,' ').trim(),expected=task.examples[0].output.replace(/\\s+/g,' ').trim();
      ensure(actual.includes('Program završen.')&&actual.includes(expected),'Program iz zbirke nije izvršen tačno: '+task.id+'/'+language+' '+actual);
    }
  `);
  await stage('embedded original PDF book reader', `
    const book=ELDI_BOOKS.find(book=>book.subject==='math');
    go('books');ELDIBooks.open(book.id,book.tasks[0].id);$('books-open-pdf').click();
    const reader=$('books-reader-frame');ensure(reader&&reader.tagName==='IFRAME','Knjiga nije otvorena u unutrašnjem PDF čitaču.');
    ensure(reader.src.includes('/content/books/matematika-pztk.pdf#page='),'Čitač nije otvorio odgovarajuću PDF knjigu i stranicu.');
    ensure($('books-reader-page'),'Čitač nema odabir stranice.');
  `);
  const pdfDeadline = Date.now() + 15000;
  let pdfReader = null, pdfFrames = [];
  while (Date.now() < pdfDeadline && !pdfReader) {
    pdfFrames = [];
    for (const frame of window.webContents.mainFrame.framesInSubtree) {
      if (!frame.url.includes('.pdf') && !frame.url.startsWith('chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai/')) continue;
      try {
        const status = await frame.executeJavaScript("(()=>{const viewer=document.querySelector('pdf-viewer');return {url:location.href,viewer:!!viewer,loaded:!!viewer&&(typeof viewer.getLoadSucceededForTesting==='function'?viewer.getLoadSucceededForTesting():viewer.loadProgress_===100),pages:viewer?(viewer.documentDimensions?.pageDimensions?.length||viewer.docLength_||0):0};})()");
        pdfFrames.push(status);
        if (status.loaded && status.pages === 203) pdfReader = status;
      } catch {}
    }
    if (!pdfReader) await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!pdfReader) throw new Error('Unutrašnji PDF čitač nije potvrdio učitavanje cijele knjige od 203 stranice: ' + JSON.stringify(pdfFrames));
  console.log('Desktop PDF reader passed:', JSON.stringify({ loaded: pdfReader.loaded, pages: pdfReader.pages }));
  await capture('09-book-reader');
  await stage('book mathematical answer and learner-owned section', `
    const book=ELDI_BOOKS.find(book=>book.subject==='math'),task=book.tasks.find(task=>task.answer?.type==='number');
    ensure(task,'Matematička zbirka nema zadatak s provjerljivim brojevnim odgovorom.');
    go('books');ELDIBooks.open(book.id,task.id);$('books-check').click();
    ensure(state().bookWork.results[task.id]?.lastCorrect===false,'Prazan odgovor iz zbirke mora biti odbijen.');
    fill($('books-answer-0'),String(task.answer.value));$('books-check').click();
    ensure(state().bookWork.results[task.id]?.lastCorrect&&state().bookWork.completed[task.id]?.verified,'Tačan odgovor iz matematičke zbirke nije provjeren.');
    fill($('books-notes'),'Moj matematički postupak iz izvorne zbirke.');
    go('books');$('books-new-section').click();fill($('books-section-title'),'Moja sekcija iz Windows provjere');
    $('books-section-subject').value='informatics';fill($('books-section-description'),'Programerski zadaci koje dodaje korisnik.');$('books-form-save').click();
    const own=state().bookWork.customSections.find(book=>book.title==='Moja sekcija iz Windows provjere');
    ensure(own,'Nova korisnička sekcija nije sačuvana.');
    $('books-new-task').click();$('books-task-section').value=own.id;$('books-task-section').dispatchEvent(new Event('change',{bubbles:true}));
    fill($('books-task-title'),'Dvostruki broj iz moje sekcije');fill($('books-task-statement'),'Učitaj cijeli broj i ispiši dvostruku vrijednost.');
    fill($('books-task-help'),'Učitaj jedan broj.');fill($('books-task-steps'),'Pomnoži broj sa 2.');
    fill($('books-task-input'),'7');fill($('books-task-output'),'14');fill($('books-task-python'),'n = int(input())\\nprint(2 * n)\\n');$('books-form-save').click();
    const saved=state().bookWork.customSections.find(book=>book.id===own.id);
    ensure(saved.tasks.length===1&&saved.tasks[0].solutions.python.status==='user-provided','Korisnički zadatak nije sačuvan ili je netačno označen kao provjeren.');
    await ELDIStorage.flush();
    window.__learningPackSmoke={format:'ELDI-LEARNING-PACK',version:1,books:[saved]};
    const parsed=await eldiDesktop.readLearningPack(new TextEncoder().encode(JSON.stringify(window.__learningPackSmoke)));
    ensure(parsed.report.books===1&&parsed.report.tasks===1&&parsed.pack.books[0].tasks[0].title===saved.tasks[0].title,'Nativna provjera JSON paketa nije sačuvala zadatak.');
    let rejected=false;try{await eldiDesktop.readLearningPack(new Uint8Array([80,75,0,0]));}catch{rejected=true;}ensure(rejected,'Neispravan ZIP nije odbijen.');
  `);
  const originalSaveDialog = dialog.showSaveDialog;
  const ownExportPath = path.join(output, 'Moja-zbirka-smoke.zip');
  const defaultExportPath = path.join(output, bundledPackFilename);
  let dialogsOpened = 0;
  try {
    dialog.showSaveDialog = async () => { dialogsOpened++; return { canceled: false, filePath: ownExportPath }; };
    await stage('native custom ZIP export and bounded importer', `
      const result=await eldiDesktop.saveLearningPack(window.__learningPackSmoke);
      ensure(result.success&&result.path,'Korisnička zbirka nije izvezena u ZIP.');
    `);
    const ownBytes = await fs.promises.readFile(ownExportPath);
    const ownRoundtrip = learningPacks.readPack(ownBytes);
    if (ownRoundtrip.report.books !== 1 || ownRoundtrip.report.tasks !== 1 || ownRoundtrip.report.solutions !== 1) throw new Error('ZIP izvoz nije sačuvao korisnički zadatak i kod.');
    await stage('native ZIP round trip imported through actual UI', `
      go('books');
      const bytes=new Uint8Array(${JSON.stringify([...ownBytes])}),transfer=new DataTransfer();
      transfer.items.add(new File([bytes],'Moja-zbirka-smoke.zip',{type:'application/zip'}));
      $('books-import').files=transfer.files;$('books-import').dispatchEvent(new Event('change',{bubbles:true}));
      const deadline=Date.now()+5000;
      while(state().bookWork.customSections.length<2&&Date.now()<deadline)await wait(50);
      ensure(state().bookWork.customSections.length===2,'ZIP nije uvezen kroz stvarnu formu.');
      const imported=state().bookWork.customSections[1],original=state().bookWork.customSections[0];
      ensure(imported.id!==original.id&&imported.tasks[0].id!==original.tasks[0].id,'Uvoz mora dobiti vlastite oznake i zadržati postojeći rad.');
      ensure(imported.tasks[0].solutions.python.code===original.tasks[0].solutions.python.code,'ZIP povratni uvoz izmijenio je izvorni kod.');
      await ELDIStorage.flush();
    `);
    dialog.showSaveDialog = async () => { dialogsOpened++; return { canceled: true }; };
    await stage('canceled ZIP export and invalid data do not write', `
      const result=await eldiDesktop.saveLearningPack(window.__learningPackSmoke);
      ensure(result.canceled&&!result.success,'Otkazan ZIP izvoz ne smije prikazati uspjeh.');
      let rejected=false;try{await eldiDesktop.saveLearningPack({format:'invalid',version:1,books:[]});}catch{rejected=true;}ensure(rejected,'Izvoz neispravnog paketa nije odbijen prije dijaloga.');
    `);
    if (dialogsOpened !== 2) throw new Error('Neispravni paket ne smije otvoriti dijalog za spremanje.');
    dialog.showSaveDialog = async () => { dialogsOpened++; return { canceled: false, filePath: defaultExportPath }; };
    await stage('native original books ZIP export', `
      const result=await eldiDesktop.saveLearningPack();ensure(result.success,'Ugrađeni ZIP zbirki nije izvezen.');
      delete window.__learningPackSmoke;
    `);
    if (!(await fs.promises.readFile(defaultExportPath)).equals(bundledBytes)) throw new Error('Izvoz ugrađenog ZIP paketa promijenio je knjige ili rješenja.');
    await fs.promises.unlink(defaultExportPath);
  } finally { dialog.showSaveDialog = originalSaveDialog; }
  await stage('109 digital programming lessons and validated profile backup', `
    const book=ELDI_BOOKS.find(book=>book.subject==='informatics');
    ensure(Array.isArray(book.theory)&&book.theory.length===109,'Programerska zbirka mora imati 109 digitalnih teorijskih lekcija.');
    go('books');$('books-book').value=book.id;$('books-book').dispatchEvent(new Event('change',{bubbles:true}));
    $('books-grade').value='all';$('books-grade').dispatchEvent(new Event('change',{bubbles:true}));
    $('books-chapter').value='all';$('books-chapter').dispatchEvent(new Event('change',{bubbles:true}));
    fill($('books-search'),'');$('books-show-theory').click();
    ensure($('books-show-theory').getAttribute('aria-pressed')==='true'&&$('books-result-count').textContent.includes('109'),'Teorijski katalog nije prikazao 109 lekcija.');
    const first=document.querySelector('[data-books-theory]');ensure(first,'Teorijski katalog nema otvorivu lekciju.');
    const lesson=book.theory.find(item=>item.id===first.dataset.booksTheory);ensure(lesson&&lesson.body.length>100,'Teorijska lekcija nema sadržajno objašnjenje.');
    first.click();
    const normalized=value=>String(value).replace(/\\s+/g,' ').trim();
    ensure($('view').innerText.includes(lesson.title)&&normalized(document.querySelector('.books-theory-body')?.innerText).includes(normalized(lesson.body.slice(0,100))),'Odabrana teorijska lekcija nije prikazala izvorno objašnjenje.');
    fill($('books-notes'),'Moje bilješke teorijske lekcije: ideja, primjer, samostalna primjena.');
    await ELDIStorage.flush();
    const backup=ELDIProfiles.exportProfile(state());
    ensure(backup.profile.bookWork.notes[lesson.id]==='Moje bilješke teorijske lekcije: ideja, primjer, samostalna primjena.','Validirani izvoz profila nije sačuvao bilješke teorijske lekcije.');
    go('books');ELDIBooks.openTheory(book.id,lesson.id);
    ensure($('books-notes').value===backup.profile.bookWork.notes[lesson.id],'Bilješke teorijske lekcije nisu vraćene pri ponovnom otvaranju.');
  `);
  await capture('10-programming-theory');
  for (const [subject, count] of [['math', 50], ['informatics', 10]]) {
    await stage(`actual ${subject} ${count}-task exam`, `
      go('exams');$('exam-subject').value=${JSON.stringify(subject)};$('exam-subject').onchange();$('exam-count').value=${JSON.stringify(String(count))};$('exam-start').click();
      const session=state().examSession;ensure(session?.total===${count},'Provjera nije počela: '+($('exam-setup-error')?.textContent||''));
      session.refs.map(ELDIExamEngine.resolve).forEach((task,i)=>task.fields.forEach((field,j)=>fill($('exam-'+i+'-field-'+j),answer(field))));
      fill(document.querySelector('[data-exam-notes]'),'Samostalna provjera: zapis rješenja.');
      $('exam-finish').click();
      const result=state().exams.at(-1);
      ensure(result.correct===${count}&&result.gradeResult.grade===5,'Tačni odgovori nisu dobili ocjenu 5.');
      ensure(state().certificates.some(c=>c.examId===result.id&&c.grade===5),'Priznanje nije sačuvano uz provjeru.');
      await ELDIStorage.flush();
    `);
  }
  await capture('05-exam-result');
  await stage('earned badges and actual diploma preview', `
    go('awards');
    const badges=ELDIAwards.badgeProgress(state());
    ensure(badges.find(b=>b.id==='math-50')?.earned&&badges.find(b=>b.id==='informatics-10')?.earned&&badges.find(b=>b.id==='perfect-1')?.earned,'Značke nisu pratile stvarno riješene provjere.');
    const record=state().certificates.find(c=>c.subject==='math');ELDIAwards.preview(record);
    ensure(document.querySelectorAll('.signature-name').length===4&&document.querySelector('svg.certificate-seal'),'Nedostaju četiri imena autora ili pečat aplikacije.');
    for(const author of ELDIAwards.AUTHORS)ensure($('view').innerText.includes(author),'Diploma nema ime autora: '+author);
    ensure($('view').innerText.includes('50 / 50'),'Diploma ne prikazuje tačne bodove.');
    ensure(document.body.classList.contains('dark'),'Pregled diplome ne smije promijeniti odabranu temu.');
    const sheetStyle=getComputedStyle(document.querySelector('.certificate-sheet'));
    ensure(brightness(sheetStyle.backgroundColor)>220&&contrast(sheetStyle.color,sheetStyle.backgroundColor)>=7,'Diploma mora zadržati čitljiv svijetli papir unutar tamne aplikacije.');
    ensure(typeof eldiDesktop.savePdf==='function','PDF preuzimanje nije dostupno.');
    let rejected=false;try{await eldiDesktop.savePdf('../smoke.pdf');}catch{rejected=true;}ensure(rejected,'PDF naziv s putanjom nije odbijen.');
  `);
  await capture('06-diploma');
  await evaluate("document.body.classList.add('printing-certificate');await document.fonts.ready;");
  try {
    const bytes = await window.webContents.printToPDF({ printBackground: true, pageSize: 'A4', landscape: true, preferCSSPageSize: true });
    if (bytes.subarray(0, 4).toString() !== '%PDF' || bytes.length < 3000) throw new Error('Diploma nije proizvela ispravan PDF.');
    const pages = bytes.toString('latin1').match(/\/Type\s*\/Page\b/g) || [];
    if (pages.length !== 1) throw new Error('Diploma mora stati na jednu A4 stranicu: ' + pages.length);
    await fs.promises.writeFile(path.join(output, 'ELDI-diploma-smoke.pdf'), bytes);
  } finally { await evaluate("document.body.classList.remove('printing-certificate');"); }
  await stage('saved exams, lesson and final error check', `
    ensure(state().exams.length===2&&state().certificates.length===2,'Završene provjere nisu ostale sačuvane.');
    go('lessons');openLesson(ELDI_CONTENT[0].id);ensure($('view').innerText.includes(ELDI_CONTENT[0].title),'Lekcija nije otvorena.');
    go('about');for(const author of ELDIAwards.AUTHORS)ensure($('view').innerText.includes(author),'Autori nisu prikazani.');
    ensure((window.__eldiErrors||[]).length===0,'Greške prikaza: '+JSON.stringify(window.__eldiErrors));
    await ELDIStorage.flush();go('home');
  `);
  await stage('light theme preference stored before reload', `
    $('theme').click();
    ensure(!document.body.classList.contains('dark'),'Ručni izbor svijetle teme nije primijenjen.');
    ensure(localStorage.getItem('eldi-theme-v2')==='light','Ručni izbor teme nije sačuvan.');
  `);
  const snapshot = 'return JSON.stringify(store);';
  const beforeReload = await evaluate(snapshot);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Ponovno učitavanje desktop prozora nije završeno.')), 10000);
    window.webContents.once('did-finish-load', () => { clearTimeout(timer); resolve(); });
    window.webContents.reload();
  });
  await stage('IndexedDB reload retains work and selected profile', `
    const deadline=Date.now()+5000;while(!window.__eldiReady&&Date.now()<deadline)await wait(50);
    ensure(window.__eldiReady,'Sačuvani profil nije učitan nakon ponovnog otvaranja.');
    ensure($('profile').selectedOptions[0].textContent==='Provjera paketa','Odabrani profil nije sačuvan.');
    ensure(!document.body.classList.contains('dark')&&$('theme').getAttribute('aria-pressed')==='false','Ručni izbor svijetle teme nije preživio ponovno otvaranje.');
    ensure(state().bookWork?.customSections?.length===2,'Moja sekcija i uvezeni ZIP nisu preživjeli ponovno otvaranje.');
    const book=ELDI_BOOKS.find(book=>book.subject==='informatics');
    ensure(state().bookWork.notes[book.tasks[0].id]==='Moj postupak iz knjige: ulaz, račun, provjera rezultata.','Bilješke iz knjige nisu preživjele ponovno otvaranje.');
    ensure(book.theory.some(lesson=>state().bookWork.notes[lesson.id]==='Moje bilješke teorijske lekcije: ideja, primjer, samostalna primjena.'),'Bilješke teorijske lekcije nisu preživjele ponovno otvaranje.');
  `);
  if (await evaluate(snapshot) !== beforeReload) throw new Error('Ponovno učitavanje promijenilo je sačuvane profile, odgovore, bilješke, programe ili priznanja.');
  await stage('dark edition final theme restored', `
    $('theme').click();
    ensure(document.body.classList.contains('dark')&&localStorage.getItem('eldi-theme-v2')==='dark','Tamna tema nije sačuvana nakon povratka.');
    ensure((window.__eldiErrors||[]).length===0,'Greške prikaza nakon promjene teme: '+JSON.stringify(window.__eldiErrors));
  `);
  return { ...initial, theme: 'Dark Edition', themeTogglePreservesWork: true, themePreferenceRetained: true, worksheet: 50, exams: [50, 10], certificates: 2, books: 2, workedMath: 53, workedProgramming: 162, programmingTheory: 109, bookEditorExecutions: 4, zipRoundtrip: true, pdfReader: { loaded: true, pages: pdfReader.pages }, screenshotDirectory: output };
}
