'use strict';
/* Real service-backed assistant. Context and conversation live in memory only. */
window.ELDIAssistant = (() => {
  const LIMITS = {title:240, subject:80, grade:20, statement:12000, code:24000, language:40, input:8000, output:8000, error:3000};
  const LABELS = {title:'Tema', subject:'Predmet', grade:'Razred', statement:'Zadatak / materijal', code:'Kod', language:'Programski jezik', input:'Ulaz', output:'Dobijeni izlaz', error:'Poruka greške'};
  const MODES = [{id:'hint',label:'Savjet',icon:'✧'},{id:'explain',label:'Objasni',icon:'↳'},{id:'solve',label:'Rješenje',icon:'✓'},{id:'debug',label:'Pronađi grešku',icon:'⌘'}];
  const LANGUAGES = {python:'python',py:'python',cpp:'cpp','c++':'cpp',c:'c',java:'java'};
  let dialog = null, opener = null, options = {}, context = {}, originalContext = {}, history = [], mode = 'hint', contextTruncated = false, service = null, busy = false, requestToken = 0, session = 0, settingBusy = false, unsubscribe = null, refreshTimer = null;
  const $ = id => dialog?.querySelector('#'+id);
  const api = () => window.eldiDesktop;
  const providerName = provider => provider === 'chatgpt' ? 'ChatGPT · pretplata' : provider === 'ollama' ? 'Ollama · lokalni model' : 'OpenAI API';
  const messageText = error => typeof error?.message === 'string' ? error.message : typeof error === 'string' ? error : 'Zahtjev nije uspio. Pokušaj ponovo.';
  function configure(config) { options = {...options,...config}; }
  function cleanContext(value) {
    const result = {}; contextTruncated=false;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
    for (const [key,limit] of Object.entries(LIMITS)) {
      if (typeof value[key] === 'string' || typeof value[key] === 'number') { const raw=String(value[key]); result[key]=raw.slice(0,limit);if(raw.length>limit)contextTruncated=true; }
    }
    return result;
  }
  function make() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.id = 'ai-dialog'; dialog.className = 'ai-dialog';
    dialog.setAttribute('aria-labelledby','ai-heading'); dialog.setAttribute('aria-describedby','ai-intro');
    dialog.innerHTML = `<div class="ai-shell"><header class="ai-top"><div class="ai-brand-symbol" aria-hidden="true">✦</div><div class="ai-top-copy"><div class="ai-eyebrow">ELDI / ASISTENT ZA UČENJE</div><h2 id="ai-heading">Razumij ideju. Nastavi sam.</h2><p id="ai-intro">Postavi pitanje i odaberi koliko pomoći želiš.</p></div><button id="ai-close" class="ai-icon-button" aria-label="Zatvori AI asistenta">×</button></header><div class="ai-service-row"><span id="ai-provider-badge" class="ai-service-badge">Povezivanje nije podešeno</span><button id="ai-settings-toggle" class="ai-text-button" aria-expanded="false" aria-controls="ai-settings">Podesi asistenta</button></div><section id="ai-settings" class="ai-settings" aria-label="Postavke AI usluge" hidden><div class="ai-section-heading"><h3>Poveži svoju AI uslugu</h3><span>Jednom podesi · koristi u svim zadacima</span></div><div class="ai-settings-fields"><label>Usluga<select id="ai-provider"><option value="chatgpt">ChatGPT pretplata — bez API ključa</option><option value="openai">OpenAI API — napredna opcija</option><option value="ollama">Ollama — lokalni model</option></select></label><label id="ai-api-model-field">Model<input id="ai-model" type="text" maxlength="120" autocomplete="off" placeholder="gpt-5.4-mini"></label></div><div id="ai-chatgpt-fields" class="ai-chatgpt-fields"><div class="ai-account-card"><div><strong>Prijava svojim ChatGPT računom</strong><p id="ai-account-status">Koristi svoju pretplatu. API ključ nije potreban.</p></div><span class="ai-account-emblem" aria-hidden="true">✦</span></div><div class="ai-login-actions"><button id="ai-login" class="primary" type="button">Prijavi se u ChatGPT ↗</button><button id="ai-device-login" type="button">Prijava kodom</button><button id="ai-login-cancel" type="button" hidden>Zaustavi prijavu</button><button id="ai-logout" type="button" hidden>Odjavi račun</button><button id="ai-refresh-models" type="button">Osvježi</button></div><p id="ai-device-code" class="ai-device-code" hidden></p><div class="ai-settings-fields"><label>Model s tvog računa<select id="ai-chatgpt-model"></select></label><label>Nivo razmišljanja<select id="ai-effort"></select></label></div><p id="ai-model-availability" class="ai-help"></p><p id="ai-rate-limits" class="ai-help"></p><p class="ai-help">Prijava se završava u službenom pregledniku; lozinku ne unosiš u ELDI EDU. Dostupni modeli i ograničenja ovise o tvom računu. GPT-6.1 Sol i ultra koriste se samo ako ih usluga ponudi.</p></div><div id="ai-openai-fields"><label class="ai-key-label">Tvoj API ključ<input id="ai-key" type="password" maxlength="1000" autocomplete="new-password" spellcheck="false" placeholder="Unesi ključ za svoj API račun"></label><label class="ai-check"><input id="ai-remember-key" type="checkbox"> Zapamti ključ uz sistemsku zaštitu ovog računara</label><p id="ai-key-storage" class="ai-help">Ključ se ne dodaje profilu niti ZIP paketima.</p><p class="ai-help">OpenAI API se obračunava na tvom API računu. ChatGPT pretplata ne uključuje API potrošnju.</p></div><p id="ai-ollama-info" class="ai-help" hidden>Pokreni Ollama servis na ovom računaru i upiši naziv preuzetog modela. Zahtjev ide samo na lokalni servis 127.0.0.1:11434.</p><div class="ai-settings-actions"><button id="ai-save-settings" class="primary">Sačuvaj postavke</button><button id="ai-remove-key">Ukloni sačuvani ključ</button></div><p id="ai-connection-status" class="ai-status" role="status" aria-live="polite"></p></section><div class="ai-main"><div class="ai-scroll-body"><div id="ai-mode" class="ai-mode-bar" role="group" aria-label="Vrsta pomoći">${MODES.map(item=>`<button id="ai-mode-${item.id}" data-ai-mode="${item.id}" aria-pressed="${item.id==='hint'}"><span aria-hidden="true">${item.icon}</span>${item.label}</button>`).join('')}</div><details id="ai-context-toggle" class="ai-context" open><summary><span class="ai-context-mark" aria-hidden="true">▧</span><span id="ai-context-title">Materijal za ovaj razgovor</span><span class="ai-context-chevron" aria-hidden="true">⌄</span></summary><label class="ai-check"><input id="ai-context-include" type="checkbox" checked> Uz pitanje pošalji samo ovaj prikazani materijal</label><div id="ai-context-preview" class="ai-context-preview"></div><p id="ai-context-disclosure" class="ai-help"></p></details><div id="ai-history" class="ai-history" role="log" aria-live="polite" aria-label="Razgovor s AI asistentom"><div id="ai-welcome" class="ai-welcome"><div class="ai-welcome-symbol" aria-hidden="true">✦</div><h3>Učenje uz malo više podrške.</h3><p>Traži prvi trag, objašnjenje postupka ili analizu svog koda. Ti biraš sljedeći korak.</p><div class="ai-suggestions"><button data-ai-suggestion="Objasni mi osnovnu ideju ovog zadatka. Ne otkrivaj cijelo rješenje.">Kako da počnem? <span>↗</span></button><button data-ai-suggestion="Objasni ovaj materijal korak po korak, uz jednostavan primjer.">Objasni na primjeru <span>↗</span></button><button data-ai-suggestion="Predloži kako da provjerim svoje rješenje, uključujući rubne slučajeve.">Kako da provjerim? <span>↗</span></button></div></div></div></div><div id="ai-busy" class="ai-busy" role="status" hidden><span class="ai-busy-dots" aria-hidden="true">•••</span><span>Asistent priprema odgovor…</span><button id="ai-cancel" class="ai-text-button">Zaustavi</button></div><p id="ai-error" class="ai-error" role="alert" hidden></p><form id="ai-form" class="ai-compose"><label for="ai-question">Tvoje pitanje</label><textarea id="ai-question" maxlength="4000" rows="3" placeholder="Napiši šta ti nije jasno ili gdje je tvoj pokušaj zastao…"></textarea><div class="ai-compose-actions"><span id="ai-question-count" class="ai-count">0 / 4000</span><span class="ai-shortcut">Ctrl + Enter za slanje</span><button id="ai-send" type="submit" class="primary">Pitaj asistenta <span aria-hidden="true">↗</span></button></div></form><div class="ai-bottom"><p>AI odgovor je prijedlog za učenje. Provjeri račun i testiraj kod prije upotrebe.</p><button id="ai-clear" class="ai-text-button">Očisti razgovor</button></div></div></div>`;
    document.body.appendChild(dialog);
    // Keep the sign-in action in the first visible part of the compact panel.
    $('ai-settings').insertBefore($('ai-chatgpt-fields'),$('ai-provider').closest('.ai-settings-fields'));
    $('ai-close').onclick = close;
    dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
    dialog.addEventListener('click',event=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)close();}});
    $('ai-settings-toggle').onclick = () => toggleSettings($('ai-settings').hidden);
    $('ai-provider').onchange = () => {const provider=$('ai-provider').value;$('ai-model').value=service?.provider===provider?service.model:(provider==='ollama'?'qwen2.5-coder:7b':'gpt-5.4-mini');providerFields();};
    $('ai-chatgpt-model').onchange = () => fillEfforts($('ai-chatgpt-model').value);
    $('ai-login').onclick = () => login('chatgpt');
    $('ai-device-login').onclick = () => login('chatgptDeviceCode');
    $('ai-login-cancel').onclick = () => accountAction('aiLoginCancel');
    $('ai-logout').onclick = () => accountAction('aiLogout');
    $('ai-refresh-models').onclick = () => status(true);
    if(api()?.onAIStatus)unsubscribe=api().onAIStatus(value=>{if(dialog?.open&&value&&typeof value==='object')applyStatus(value);});
    $('ai-save-settings').onclick = saveSettings;
    $('ai-remove-key').onclick = removeKey;
    $('ai-form').onsubmit = event=>{event.preventDefault();send();};
    $('ai-question').oninput = () => {$('ai-question-count').textContent=$('ai-question').value.length+' / 4000';updateSend();};
    $('ai-question').onkeydown = event=>{if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){event.preventDefault();send();}};
    $('ai-context-include').onchange = updateDisclosure;
    $('ai-cancel').onclick = cancel;
    $('ai-clear').onclick = () => {if(busy)return;history=[];renderWelcome();clearError();};
    dialog.querySelectorAll('[data-ai-mode]').forEach(button=>button.onclick=()=>setMode(button.dataset.aiMode));
    dialog.querySelectorAll('[data-ai-suggestion]').forEach(button=>button.onclick=()=>suggest(button.dataset.aiSuggestion));
  }
  function toggleSettings(show) {
    $('ai-settings').hidden=!show;
    $('ai-settings-toggle').setAttribute('aria-expanded',String(show));
    $('ai-settings-toggle').textContent=show?'Zatvori postavke':service?.configured?'Postavke':'Podesi asistenta';
    if(show){const target=$('ai-provider').value==='chatgpt'&&!$('ai-login').hidden?$('ai-login'):$('ai-provider');target.focus({preventScroll:true});$('ai-settings').scrollTop=0;}
  }
  function providerFields() {
    const provider=$('ai-provider').value,local=provider==='ollama',chatgpt=provider==='chatgpt';
    const chatgptWasHidden=$('ai-chatgpt-fields').hidden;
    $('ai-chatgpt-fields').hidden=!chatgpt;$('ai-api-model-field').hidden=chatgpt;
    $('ai-openai-fields').hidden=provider!=='openai'; $('ai-ollama-info').hidden=!local;
    $('ai-remove-key').hidden=provider!=='openai'||!service?.hasKey;
    $('ai-key').placeholder=service?.hasKey?'Ključ je već postavljen; unesi novi samo za promjenu':'Unesi ključ za svoj API račun';
    $('ai-remember-key').disabled=!service?.capabilities?.encryptedStorage;
    if($('ai-remember-key').disabled)$('ai-remember-key').checked=false;
    const protection=service?.keyStorage==='encrypted'?'Ključ je sačuvan uz sistemsku zaštitu.':service?.keyStorage==='session'?'Ključ je dostupan samo dok je aplikacija otvorena.':'Ključ se ne dodaje profilu niti ZIP paketima.';
    $('ai-key-storage').textContent=protection+(service&&!service.capabilities?.encryptedStorage?' Sistemska zaštita nije dostupna; ključ ostaje samo za ovu sesiju.':'');
    if(chatgpt&&chatgptWasHidden)$('ai-settings').scrollTop=0;
    updateDisclosure();
  }
  function applyStatus(status) {
    service=status;
    $('ai-provider').value=['chatgpt','ollama','openai'].includes(status.provider)?status.provider:'chatgpt';
    $('ai-model').value=status.model||($('ai-provider').value==='ollama'?'qwen2.5-coder:7b':'gpt-5.4-mini');
    $('ai-provider-badge').textContent=status.configured?providerName(status.provider)+' · '+status.model+(status.effort?' / '+status.effort:''):status.provider==='chatgpt'?(status.chatgpt?.signedIn?'ChatGPT · odaberi dostupan model':'ChatGPT · prijavi svoj račun'):'AI usluga nije podešena';
    renderAccount(status.chatgpt);
    $('ai-provider-badge').classList.toggle('is-ready',!!status.configured);
    $('ai-settings-toggle').textContent=$('ai-settings').hidden?(status.configured?'Postavke':'Podesi asistenta'):'Zatvori postavke';
    $('ai-remember-key').checked=status.keyStorage==='encrypted';providerFields(); updateSend();
  }
  function addOption(select,value,label) {const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);}
  function fillEfforts(modelName,selected) {
    const field=$('ai-effort'),model=service?.chatgpt?.models?.find(item=>item.model===modelName),efforts=model?.supportedReasoningEfforts||[];
    field.replaceChildren();
    const requested=selected||model?.defaultReasoningEffort||'';
    if(requested&&!efforts.some(item=>item.reasoningEffort===requested))addOption(field,requested,requested+' — nije dostupno');
    for(const item of efforts)addOption(field,item.reasoningEffort,item.reasoningEffort);
    if(!field.options.length)addOption(field,'','Prvo se prijavi i odaberi model');
    if(requested)field.value=requested;
    field.disabled=busy||settingBusy||!efforts.length;
  }
  function renderAccount(account) {
    const signInWasHidden=$('ai-login').hidden;
    const models=account?.models||[],select=$('ai-chatgpt-model');select.replaceChildren();
    const selected=account?.model||'gpt-6.1-sol';
    if(!models.some(item=>item.model===selected))addOption(select,selected,account?.signedIn?selected+' — nije ponuđen':'Modeli se učitavaju nakon prijave');
    for(const model of models)addOption(select,model.model,model.displayName+' ('+model.model+')');
    select.value=selected;select.disabled=busy||settingBusy||!models.length;fillEfforts(selected,account?.effort||'ultra');
    $('ai-account-status').textContent=account?.signedIn?[account.account?.email,account.account?.planType].filter(Boolean).join(' · '):account?.login?.pending?'Završi prijavu u otvorenom pregledniku.':'Koristi svoju ChatGPT pretplatu. API ključ nije potreban.';
    $('ai-login').hidden=!!account?.signedIn||!!account?.login?.pending;$('ai-device-login').hidden=$('ai-login').hidden;
    if(signInWasHidden&&!$('ai-login').hidden&&$('ai-provider').value==='chatgpt')$('ai-settings').scrollTop=0;
    $('ai-login-cancel').hidden=!account?.login?.pending;$('ai-logout').hidden=!account?.signedIn;
    $('ai-device-code').hidden=!account?.login?.userCode;$('ai-device-code').textContent=account?.login?.userCode?'Kod za prijavu: '+account.login.userCode:'';
    $('ai-model-availability').textContent=account?.error||(!account?.available?'Ugrađeni ChatGPT servis je dostupan u kompletnom Windows izdanju.':'Lista prikazuje stvarno ponuđene modele i nivoe razmišljanja.');
    const limits=account?.rateLimits,windows=[limits?.primary,limits?.secondary].filter(Boolean);
    $('ai-rate-limits').textContent=windows.map(item=>'Iskorišteno '+Math.round(item.usedPercent)+'%'+(item.resetsAt?' · obnova '+new Date(item.resetsAt*1000).toLocaleString('bs-BA'):'')).join(' | ');
    for(const id of ['ai-login','ai-device-login','ai-login-cancel','ai-logout','ai-refresh-models'])$(id).disabled=busy||settingBusy||!api()?.aiLogin;
  }
  async function login(type) {
    if(settingBusy||busy||!api()?.aiLogin)return;
    settingBusy=true;settingsBusy(true);const current=session;$('ai-connection-status').textContent='Otvaranje službene ChatGPT prijave…';
    try{const response=await api().aiLogin(type);if(current!==session||!dialog.open)return;if(response.status)applyStatus(response.status);$('ai-connection-status').textContent=response.success?'Završi prijavu u pregledniku. Aplikacija će prepoznati prijavu.':messageText(response.error);}
    catch(error){if(current===session&&dialog.open)$('ai-connection-status').textContent=messageText(error);}
    finally{if(current===session){settingBusy=false;if(dialog.open){settingsBusy(false);renderAccount(service?.chatgpt);}}}
  }
  async function accountAction(method) {
    if(settingBusy||busy||!api()?.[method])return;
    settingBusy=true;settingsBusy(true);const current=session;
    try{const response=await api()[method]();if(current!==session||!dialog.open)return;if(response.status)applyStatus(response.status);$('ai-connection-status').textContent=response.success?(method==='aiLogout'?'ChatGPT račun je odjavljen.':'Prijava je zaustavljena.'):messageText(response.error);if(method==='aiLogout'){history=[];renderWelcome();}}
    catch(error){if(current===session&&dialog.open)$('ai-connection-status').textContent=messageText(error);}
    finally{if(current===session){settingBusy=false;if(dialog.open){settingsBusy(false);renderAccount(service?.chatgpt);}}}
  }
  async function status(refresh = false) {
    const current=session;
    if(!api()?.aiStatus){showError('AI integracija je dostupna u desktop izdanju aplikacije.');$('ai-connection-status').textContent='Desktop AI usluga nije dostupna.';updateSend();return;}
    try{const response=await (refresh&&api().aiRefreshStatus?api().aiRefreshStatus():api().aiStatus());if(current!==session||!dialog.open)return;applyStatus(response);if(response.error)$('ai-connection-status').textContent=messageText(response.error);if(!response.configured)toggleSettings(true);}
    catch(error){if(current===session&&dialog.open){showError(messageText(error));updateSend();}}
  }
  async function saveSettings() {
    if(settingBusy||busy||!api()?.aiSaveSettings)return;
    const provider=$('ai-provider').value,model=provider==='chatgpt'?$('ai-chatgpt-model').value:$('ai-model').value.trim();
    if(!model){$('ai-connection-status').textContent='Upiši naziv modela.';$('ai-model').focus();return;}
    const settings={provider,model,...(provider==='chatgpt'?{effort:$('ai-effort').value}:{rememberKey:$('ai-remember-key').checked})};
    const key=$('ai-key').value.trim(); if(provider==='openai'&&key)settings.apiKey=key;
    settingBusy=true;settingsBusy(true);const current=session;
    $('ai-connection-status').textContent='Čuvanje postavki…';
    $('ai-key').value='';
    try{const response=await api().aiSaveSettings(settings);if(current!==session||!dialog.open)return;if(!response.success){$('ai-connection-status').textContent=messageText(response.error);return;}applyStatus(response.status);$('ai-connection-status').textContent=response.status.configured?'Postavke su sačuvane. Veza se koristi kada pošalješ pitanje.':(provider==='chatgpt'?'Postavke su sačuvane. Prijavi se svojim ChatGPT računom.':'Postavke su sačuvane. Dodaj API ključ da uključiš asistenta.');clearError();}
    catch(error){if(current===session&&dialog.open)$('ai-connection-status').textContent=messageText(error);}
    finally{delete settings.apiKey;if(current===session){settingBusy=false;if(dialog.open)settingsBusy(false);}}
  }
  async function removeKey() {
    if(settingBusy||busy||!api()?.aiSaveSettings)return;
    settingBusy=true;settingsBusy(true);const current=session;$('ai-key').value='';
    try{const response=await api().aiSaveSettings({provider:service?.provider||'openai',model:service?.model||'gpt-5.4-mini',clearKey:true});if(current!==session||!dialog.open)return;if(response.success){applyStatus(response.status);$('ai-connection-status').textContent='API ključ je uklonjen.';}else $('ai-connection-status').textContent=messageText(response.error);}
    catch(error){if(current===session&&dialog.open)$('ai-connection-status').textContent=messageText(error);}
    finally{if(current===session){settingBusy=false;if(dialog.open)settingsBusy(false);}}
  }
  function settingsBusy(value) {$('ai-save-settings').disabled=value;$('ai-remove-key').disabled=value;$('ai-provider').disabled=value;$('ai-model').disabled=value;for(const id of ['ai-login','ai-device-login','ai-login-cancel','ai-logout','ai-refresh-models','ai-chatgpt-model','ai-effort'])$(id).disabled=value||busy;updateSend();}
  function setMode(value) {if(busy)return;mode=MODES.some(item=>item.id===value)?value:'hint';dialog.querySelectorAll('[data-ai-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.aiMode===mode)));}
  function renderContext() {
    const preview=$('ai-context-preview');preview.replaceChildren();
    const entries=Object.entries(context).filter(([,value])=>value);
    $('ai-context-title').textContent=context.title||'Materijal za ovaj razgovor';
    if(!entries.length){const paragraph=document.createElement('p');paragraph.textContent='Nema dodatnog materijala. Poslat će se samo tvoje pitanje i prethodne poruke ovog razgovora.';preview.append(paragraph);$('ai-context-include').checked=false;$('ai-context-include').disabled=true;}
    else{$('ai-context-include').disabled=false;$('ai-context-include').checked=true;for(const [key,value] of entries){const section=document.createElement('section'),label=document.createElement('strong'),content=document.createElement(key==='code'||key==='input'||key==='output'||key==='error'?'pre':'p');label.textContent=LABELS[key];content.textContent=value;section.append(label,content);preview.append(section);}}
    updateDisclosure();
  }
  function updateDisclosure() {
    if(!$('ai-context-disclosure'))return;
    const provider=service?.provider||$('ai-provider')?.value,local=provider==='ollama';
    $('ai-context-disclosure').textContent=($('ai-context-include').checked?'Pitanje, prikazani materijal i prethodne poruke ovog razgovora':'Pitanje i prethodne poruke ovog razgovora')+' šalju se '+(local?'lokalnom Ollama servisu.':provider==='chatgpt'?'ChatGPT usluzi preko tvoje prijave.':'odabranoj OpenAI API usluzi.')+' Profil i ostali radovi se ne šalju.'+(contextTruncated?' Dugačak materijal je skraćen na tačno prikazani tekst.':'');
  }
  function suggest(question) {$('ai-question').value=question;$('ai-question').oninput();$('ai-question').focus();}
  function renderWelcome() {
    const historyNode=$('ai-history'),welcome=document.createElement('div');welcome.id='ai-welcome';welcome.className='ai-welcome';
    const symbol=document.createElement('div');symbol.className='ai-welcome-symbol';symbol.setAttribute('aria-hidden','true');symbol.textContent='✦';
    const title=document.createElement('h3');title.textContent='Učenje uz malo više podrške.';
    const text=document.createElement('p');text.textContent='Traži prvi trag, objašnjenje postupka ili analizu svog koda. Ti biraš sljedeći korak.';
    const suggestions=document.createElement('div');suggestions.className='ai-suggestions';
    for(const [label,question] of [['Kako da počnem?','Objasni mi osnovnu ideju ovog zadatka. Ne otkrivaj cijelo rješenje.'],['Objasni na primjeru','Objasni ovaj materijal korak po korak, uz jednostavan primjer.'],['Kako da provjerim?','Predloži kako da provjerim svoje rješenje, uključujući rubne slučajeve.']]){const button=document.createElement('button');button.textContent=label+' ↗';button.onclick=()=>suggest(question);suggestions.append(button);}
    welcome.append(symbol,title,text,suggestions);historyNode.replaceChildren(welcome);
  }
  function appendMessage(role,content,meta) {
    $('ai-welcome')?.remove();
    const article=document.createElement('article');article.className='ai-message ai-message-'+role;
    const header=document.createElement('div');header.className='ai-message-heading';
    const author=document.createElement('strong');author.textContent=role==='user'?'Tvoje pitanje':role==='assistant'?'AI asistent':'Status';header.append(author);
    if(role==='assistant'){const badge=document.createElement('span');badge.textContent='AI prijedlog · nije provjeren';badge.className='ai-unverified';header.append(badge);}
    article.append(header);
    if(role==='assistant')renderReply(article,content);else{const paragraph=document.createElement('p');paragraph.className='ai-message-text';paragraph.textContent=content;article.append(paragraph);}
    if(meta){const detail=document.createElement('small');detail.className='ai-message-meta';detail.textContent=meta;article.append(detail);}
    $('ai-history').append(article);article.scrollIntoView({block:'nearest'});
  }
  function renderReply(node,content) {
    const pattern=/```([^\n`]*)\n([\s\S]*?)```/g;let match,offset=0;
    while((match=pattern.exec(content))){plainReply(node,content.slice(offset,match.index));codeReply(node,match[1].trim(),match[2].replace(/\n$/,''));offset=pattern.lastIndex;}
    plainReply(node,content.slice(offset));
  }
  function inlineReply(node,text) {
    const pattern=/\*\*([^*\n]{1,800})\*\*|`([^`\n]{1,800})`/g;let match,offset=0;
    while((match=pattern.exec(text))){node.append(document.createTextNode(text.slice(offset,match.index)));const marked=document.createElement(match[1]?'strong':'code');marked.textContent=match[1]||match[2];node.append(marked);offset=pattern.lastIndex;}
    node.append(document.createTextNode(text.slice(offset)));
  }
  function plainReply(node,content) {
    if(!content.trim())return;
    for(const block of content.trim().split(/\n\s*\n/)) {
      const heading=block.match(/^#{1,4}\s+([^\n]+)$/),lines=block.split('\n');
      if(heading){const title=document.createElement('h4');title.className='ai-reply-heading';inlineReply(title,heading[1]);node.append(title);}
      else if(lines.every(line=>/^\s*(?:[-*]|\d+[.)])\s+/.test(line))){const list=document.createElement(/^\s*\d+[.)]/.test(lines[0])?'ol':'ul');list.className='ai-reply-list';for(const line of lines){const item=document.createElement('li');inlineReply(item,line.replace(/^\s*(?:[-*]|\d+[.)])\s+/,''));list.append(item);}node.append(list);}
      else{const paragraph=document.createElement('p');paragraph.className='ai-message-text';inlineReply(paragraph,block);node.append(paragraph);}
    }
  }
  function codeReply(node,label,code) {
    const box=document.createElement('section');box.className='ai-code-block';
    const header=document.createElement('div');header.className='ai-code-heading';
    const name=document.createElement('strong');name.textContent=(label||'Kod').slice(0,50);header.append(name);
    const actions=document.createElement('div');actions.className='ai-code-actions';
    const copy=document.createElement('button');copy.type='button';copy.textContent='Kopiraj';copy.onclick=async()=>{try{await navigator.clipboard.writeText(code);copy.textContent='Kopirano';}catch{copy.textContent='Označi i kopiraj kod';}};actions.append(copy);
    const language=LANGUAGES[label.toLowerCase().split(/\s+/)[0]];
    if(options.exportFile){const save=document.createElement('button');save.type='button';save.textContent='↓ Sačuvaj';save.onclick=()=>options.exportFile('ai-prijedlog.'+({python:'py',cpp:'cpp',c:'c',java:'java'}[language]||'txt'),code);actions.append(save);}
    if(language&&options.openCode){const open=document.createElement('button');open.type='button';open.textContent='Otvori u editoru';open.onclick=()=>{close();options.openCode(language,code,context.input||'');};actions.append(open);}
    header.append(actions);const pre=document.createElement('pre');pre.tabIndex=0;pre.textContent=code;box.append(header,pre);node.append(box);
  }
  function setBusy(value) {
    busy=value;$('ai-busy').hidden=!value;$('ai-question').disabled=value;$('ai-clear').disabled=value;$('ai-settings-toggle').disabled=value;
    $('ai-context-include').disabled=value||!Object.values(context).some(Boolean);
    dialog.querySelectorAll('[data-ai-mode]').forEach(button=>button.disabled=value);
    $('ai-save-settings').disabled=value||settingBusy;$('ai-remove-key').disabled=value||settingBusy;
    $('ai-provider').disabled=value||settingBusy;$('ai-model').disabled=value||settingBusy;$('ai-key').disabled=value||settingBusy;$('ai-remember-key').disabled=value||settingBusy||!service?.capabilities?.encryptedStorage;
    for(const id of ['ai-login','ai-device-login','ai-login-cancel','ai-logout','ai-refresh-models','ai-chatgpt-model','ai-effort'])$(id).disabled=value||settingBusy;
    updateSend();
  }
  function updateSend() {if(!$('ai-send'))return;$('ai-send').disabled=busy||settingBusy||!service?.configured||!$('ai-question').value.trim()||!api()?.aiAsk;}
  function showError(value) {$('ai-error').textContent=value;$('ai-error').hidden=false;}
  function clearError() {$('ai-error').textContent='';$('ai-error').hidden=true;}
  function boundedHistory() {
    const encode=new TextEncoder(),previous=history.slice(-12).map(item=>({...item}));
    for(const item of previous){if(encode.encode(item.content).length<=15000)continue;let low=0,high=item.content.length;while(low<high){const middle=Math.ceil((low+high)/2);if(encode.encode(item.content.slice(0,middle)).length<=14950)low=middle;else high=middle-1;}item.content=item.content.slice(0,low)+'\n[Duži raniji odgovor je skraćen.]';}
    while(previous.length&&encode.encode(JSON.stringify(previous)).length>45000)previous.shift();return previous;
  }
  async function send() {
    if(busy||settingBusy||!api()?.aiAsk)return;
    const question=$('ai-question').value.trim();if(!question)return;
    if(!service?.configured){toggleSettings(true);$('ai-connection-status').textContent='Podesi uslugu i model prije slanja pitanja.';return;}
    clearError();const previous=boundedHistory(),request={question,context:$('ai-context-include').checked?{...context}:{},history:previous,language:'bs',mode};
    appendMessage('user',question);history.push({role:'user',content:request.question});
    $('ai-question').value='';$('ai-question-count').textContent='0 / 4000';setBusy(true);const token=++requestToken,current=session;
    try{
      const response=await api().aiAsk(request);
      if(token!==requestToken||current!==session||!dialog.open)return;
      if(!response.success){showError(messageText(response.error));history.pop();return;}
      if(typeof response.text!=='string'||!response.text.trim()){showError('Usluga nije vratila tekst odgovora. Pokušaj ponovo.');history.pop();return;}
      history.push({role:'assistant',content:response.text});history=history.slice(-12);
      const meta=providerName(response.provider)+' · '+response.model+(response.effort?' / '+response.effort:'')+(response.incomplete?' · odgovor je prekinut; zatraži nastavak':'');
      appendMessage('assistant',response.text,meta);
      try{options.onAnswer?.(originalContext,request.mode);}catch{}
    }catch(error){if(token===requestToken&&current===session&&dialog.open){history.pop();showError(messageText(error));}}
    finally{if(token===requestToken&&current===session&&dialog.open){setBusy(false);$('ai-question').focus();}}
  }
  async function cancel() {
    if(!busy)return;
    ++requestToken;setBusy(false);if(history.at(-1)?.role==='user')history.pop();appendMessage('system','Zahtjev je zaustavljen. Možeš preformulisati pitanje i pokušati ponovo.');
    try{await api()?.aiCancel?.();}catch{}$('ai-question').focus();
  }
  function open(value) {
    make();opener=document.activeElement;
    if(busy){++requestToken;api()?.aiCancel?.().catch(()=>{});}
    ++session;settingBusy=false;originalContext=value&&typeof value==='object'?{...value}:{};context=cleanContext(value);history=[];service=null;
    settingsBusy(false);setBusy(false);setMode('hint');$('ai-question').value='';$('ai-question-count').textContent='0 / 4000';$('ai-key').value='';$('ai-remember-key').checked=false;
    $('ai-connection-status').textContent='';clearError();renderWelcome();renderContext();toggleSettings(false);
    $('ai-provider-badge').textContent='Provjera postavki…';$('ai-provider-badge').classList.remove('is-ready');
    if(!dialog.open)dialog.showModal();status(true);refreshTimer=setInterval(()=>{if(dialog?.open&&service?.chatgpt?.login?.pending&&!settingBusy)status(true);},2500);$('ai-question').focus();
  }
  function close() {
    if(!dialog)return;
    ++session;++requestToken;
    if(refreshTimer){clearInterval(refreshTimer);refreshTimer=null;}
    if(busy)api()?.aiCancel?.().catch(()=>{});
    busy=false;settingBusy=false;$('ai-key').value='';
    if(dialog.open)dialog.close();opener?.isConnected&&opener.focus?.();
  }
  function reset() {close();context={};originalContext={};history=[];service=null;if(dialog){renderWelcome();renderContext();clearError();}}
  return {open,close,reset,configure,isOpen:()=>!!dialog?.open};
})();
