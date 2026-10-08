'use strict';
const { app, BrowserWindow, ipcMain, Menu, session, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL, fileURLToPath } = require('node:url');
const { createRunner } = require('./runner.cjs');

const smokeTest = process.argv.includes('--smoke-test');
const rendererRoot = path.resolve(__dirname, '..', 'renderer');
const assetRoots = [rendererRoot, path.resolve(__dirname, '..', 'app'), path.resolve(__dirname, '..', 'content')];
const entry = path.join(rendererRoot, 'index.html');
const entryURL = pathToFileURL(entry).href;
const runtimeRoot = app.isPackaged ? path.join(process.resourcesPath, 'runtimes') : path.resolve(__dirname, '..', 'runtimes');
const runner = createRunner({ runtimeRoot, allowSystem: !app.isPackaged });
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
      if (details.url.startsWith('file:')) {
        try { const target = fileURLToPath(new URL(details.url)); allowed = assetRoots.some(root => target.startsWith(root + path.sep)); } catch {}
      }
      callback({ cancel: !allowed });
    });
    mainWindow = new BrowserWindow({
      width: 1440, height: 940, minWidth: 900, minHeight: 640, backgroundColor: '#080f20',
      title: 'ELDI EDU 10.2.1 — Matematika i informatika', show: !smokeTest,
      icon: path.join(rendererRoot, 'assets', 'eldi.ico'),
      webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true, allowRunningInsecureContent: false, spellcheck: false, backgroundThrottling: !smokeTest }
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
  const helpers = `
    const ensure=(condition,message)=>{if(!condition)throw new Error(message);};
    const $=id=>document.getElementById(id);
    const answer=field=>Array.isArray(field.answer)?field.answer.length?field.answer.join('; '):'nema':String(field.answer);
    const fill=(element,value)=>{ensure(element,'Nedostaje polje za odgovor.');element.value=value;element.dispatchEvent(new Event('input',{bubbles:true}));};
    const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
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
    for(const key of ['eldiDesktop','EduMath','EduPractice','ELDICollection','ELDIBlocks','ELDICourses','ELDIExams','ELDIAwards','ELDIExamEngine','ELDIStorage'])ensure(window[key],'Nije učitano: '+key);
    ensure(ELDI_MATH_CATALOG.length===500&&ELDI_INFORMATICS_CATALOG.length===500,'Katalog mora imati 500 matematičkih i 500 informatičkih cjelina.');
    ensure(EduPractice.topics.length===500,'Praktična matematika mora imati 500 vještina.');
    const visited=[];
    for(const name of ['home','courses','lessons','collection','math','blocks','code','exams','awards','progress','about']){
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
  `);
  if (await evaluate(snapshot) !== beforeReload) throw new Error('Ponovno učitavanje promijenilo je sačuvane profile, odgovore, bilješke, programe ili priznanja.');
  return { ...initial, worksheet: 50, exams: [50, 10], certificates: 2, screenshotDirectory: output };
}
