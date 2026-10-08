'use strict';
const { app, BrowserWindow, ipcMain, Menu, session } = require('electron');
const path = require('node:path');
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
  const fs = require('node:fs');
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
      title: 'ELDI EDU 10.1 — Matematika i informatika', show: !smokeTest,
      webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true, allowRunningInsecureContent: false, spellcheck: false }
    });
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      { label: 'ELDI EDU', submenu: [{ label: 'Zatvori', role: 'quit' }] },
      { label: 'Uredi', submenu: [{ label: 'Kopiraj', role: 'copy' }, { label: 'Zalijepi', role: 'paste' }, { label: 'Označi sve', role: 'selectAll' }] },
      { label: 'Prikaz', submenu: [{ label: 'Uvećaj', role: 'zoomIn' }, { label: 'Umanji', role: 'zoomOut' }, { label: 'Izvorna veličina', role: 'resetZoom' }, { label: 'Cijeli ekran', role: 'togglefullscreen' }] }
    ]));
    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    mainWindow.webContents.on('will-navigate', (event, url) => { if (url.split('#')[0] !== entryURL) event.preventDefault(); });
    mainWindow.webContents.on('will-attach-webview', event => event.preventDefault());
    mainWindow.on('closed', () => { runner.cancel(); mainWindow = null; });
    function trusted(event) { if (!mainWindow || event.sender !== mainWindow.webContents || !event.senderFrame || event.senderFrame.url.split('#')[0] !== entryURL) throw new Error('Zahtjev nije iz glavnog prozora.'); }
    ipcMain.handle('eldi:run-code', async (event, request) => { trusted(event); try { return await runner.runCode(request); } catch (error) { return { ok: false, phase: 'validation', stdout: '', stderr: error.message, exitCode: null, timedOut: false, truncated: false, cancelled: false }; } });
    ipcMain.handle('eldi:cancel-run', event => { trusted(event); return runner.cancel(); });
    ipcMain.handle('eldi:runtime-status', event => { trusted(event); return runner.runtimeStatus(); });
    ipcMain.handle('eldi:print-page', event => { trusted(event); return new Promise(resolve => mainWindow.webContents.print({ silent: false, printBackground: true }, (success, failureReason) => resolve({ success, failureReason }))); });
    mainWindow.loadFile(entry).catch(error => { console.error(error); if (smokeTest) app.exit(1); });
    if (smokeTest) {
      const timer = setTimeout(() => { console.error('Desktop smoke test timeout.'); app.exit(1); }, 60000);
      mainWindow.webContents.once('did-finish-load', async () => {
        try {
          const result = await mainWindow.webContents.executeJavaScript(`(async () => {
            if (!window.eldiDesktop || !window.EduMath || !window.EduExercises || !window.ELDICollection || !window.ELDIBlocks) throw new Error('Desktop API ili laboratorij nisu učitani.');
            if (!window.ELDI_CONTENT || window.ELDI_CONTENT.length < 100 || !window.ELDI_TASKS || window.ELDI_TASKS.length < 10) throw new Error('Lekcije ili zadaci nisu učitani.');
            const visited = [];
            for (const name of ['home', 'lessons', 'collection', 'math', 'blocks', 'code', 'progress', 'about']) {
              go(name);
              if (document.getElementById('view').innerText.length < 20) throw new Error('Prazna stranica: ' + name);
              visited.push(name);
            }
            if (window.EduMath.evaluate('1/2+1/3').exact !== '5/6') throw new Error('Računanje razlomaka nije tačno.');
            if(EduExercises.topics.length < 70 || ELDI_MATH_PROJECTS.length < 35 || ELDI_BLOCK_CHALLENGES.length < 50) throw new Error('Proširena zbirka nije učitana.');
            go('collection');
            const topic=EduExercises.topics.find(t=>t.grade===5);
            ELDICollection.startTopic(topic.id,17);
            document.getElementById('sheet-check').click();
            if(!document.getElementById('sheet-status').textContent.includes('0/1')) throw new Error('Prazni odgovori nisu odbijeni.');
            const exercise=EduExercises.generate(topic.id,17,'medium');
            exercise.fields.forEach((field,index)=>{const input=document.getElementById('task-0-field-'+index);input.value=field.answer;input.oninput();});
            const notes=document.querySelector('[data-notes]');notes.value='Moj račun: provjera paketa';notes.oninput();
            document.getElementById('sheet-check').click();
            if(!document.getElementById('sheet-status').textContent.includes('1/1') || !state().mathWork.results[exercise.id].correct) throw new Error('Provjera unesenih matematičkih odgovora nije uspjela.');
            go('collection');document.getElementById('collection-resume').click();
            if(document.querySelector('[data-notes]').value !== 'Moj račun: provjera paketa') throw new Error('Pisani postupak nije sačuvan.');
            go('collection');document.getElementById('collection-mixed').click();document.getElementById('sheet-create').click();
            const worksheet=state().mathWork.session;
            if(worksheet.length!==10 || document.querySelectorAll('.solving-task').length!==10) throw new Error('Radni list nije napravljen.');
            worksheet.forEach((ref,i)=>{const task=EduExercises.generate(ref.topicId,ref.seed,ref.difficulty);task.fields.forEach((field,j)=>{const input=document.getElementById('task-'+i+'-field-'+j);input.value=field.answer;input.oninput();});});
            document.getElementById('sheet-check').click();
            if(!document.getElementById('sheet-status').textContent.includes('10/10')) throw new Error('Mješoviti radni list nije ispravno provjeren.');
            go('blocks');
            const challenge=ELDI_BLOCK_CHALLENGES.find(c=>c.check.type==='output');
            document.getElementById('block-challenge').value=challenge.id;document.getElementById('block-challenge').onchange();
            document.getElementById('challenge-solution').click();
            const blockResult=await ELDIBlocks.run({input:challenge.input||'',speed:0});
            if(!blockResult.ok || !blockResult.challenge?.correct || !state().blockResults[challenge.id]?.correct) throw new Error('Praktični blokovski izazov nije provjeren: '+JSON.stringify(blockResult));
            window.ELDIBlocks.example('square');
            const squareCode = window.ELDIBlocks.code('js');
            const squareActions = await new Promise((resolve,reject) => {
              const worker = new Worker('block-worker.js');
              const actions = [];
              const timeout = setTimeout(() => {worker.terminate();reject(new Error('Blokovski program nije završen.'));},7000);
              worker.onerror = event => {clearTimeout(timeout);worker.terminate();reject(new Error(event.message));};
              worker.onmessage = event => {
                if (event.data.type === 'actions') actions.push(...event.data.actions);
                if (event.data.type === 'error') {clearTimeout(timeout);worker.terminate();reject(new Error(event.data.message));}
                if (event.data.type === 'done') {clearTimeout(timeout);worker.terminate();resolve(actions);}
              };
              worker.postMessage({code:squareCode,keys:[],sprite:0});
            });
            if (squareActions.filter(action => action.type === 'move').length !== 4 || squareActions.filter(action => action.type === 'turn').length !== 4) throw new Error('Blokovsko crtanje kvadrata nije uspjelo.');
            go('home');
            document.getElementById('new-profile').click();
            document.getElementById('profile-name').value='Provjera paketa';
            document.getElementById('profile-create').click();
            if(document.getElementById('profile').selectedOptions[0].textContent!=='Provjera paketa') throw new Error('Kreiranje profila nije uspjelo.');
            go('math'); mathTool('div'); document.getElementById('calculate').click();
            if(!document.getElementById('result').textContent.includes('NZD = 24')) throw new Error('Matematički laboratorij nije prikazao NZD.');
            mathTool('geo');
            for(const shape of ['rectangle','square','triangle','circle','cuboid','cube','prism','pyramid','cylinder','cone','sphere']) {
              document.getElementById('shape').value=shape;document.getElementById('calculate').click();
              if(!/(Površina|Zapremina)/.test(document.getElementById('result').textContent)) throw new Error('Geometrijski alat: '+shape+' '+document.getElementById('result').textContent);
            }
            go('code');
            for(const language of ['python','c','cpp','java']) {
              document.getElementById('lang').value=language;document.getElementById('lang').onchange();
              document.getElementById('input').value='1000000000 1000000000';
              document.getElementById('run').click();
              const deadline=Date.now()+25000;
              while(document.getElementById('output').textContent==='Pokretanje…'&&Date.now()<deadline) await new Promise(resolve=>setTimeout(resolve,50));
              if(!document.getElementById('output').textContent.includes('2000000000')||!document.getElementById('output').textContent.includes('Program završen.')) throw new Error('Desktop '+language+': '+document.getElementById('output').textContent);
            }
            go('lessons');
            openLesson(window.ELDI_CONTENT[0].id);
            if (!document.getElementById('view').innerText.includes(window.ELDI_CONTENT[0].title)) throw new Error('Lekcija nije otvorena.');
            go('home');
            return {title:document.title, lessons:window.ELDI_CONTENT.length, tasks:window.ELDI_TASKS.length, visited, errors:window.__eldiErrors || []};
          })()`);
          if (result.errors.length) throw new Error(JSON.stringify(result));
          console.log('Desktop smoke test passed:', result.title);
          clearTimeout(timer); app.exit(0);
        } catch (error) { console.error(error); app.exit(1); }
      });
    }
  });
}
app.on('window-all-closed', () => app.quit());
app.on('before-quit', () => runner.cancel());
