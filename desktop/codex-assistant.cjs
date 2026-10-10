'use strict';

// Official Codex app-server stdio protocol, pinned to rust-v0.161.0.
// The subprocess alone owns ChatGPT credentials. No token is read by ELDI,
// returned over IPC, copied from an existing Codex home or included in exports.
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {StringDecoder} = require('node:string_decoder');

const CODEX_VERSION = '0.161.0';
const REQUESTED_MODEL = 'gpt-6.1-sol';
const REQUESTED_EFFORT = 'ultra';
const LINE_LIMIT = 2 * 1024 * 1024, TEXT_LIMIT = 128 * 1024;
const AUTH_HOSTS = new Set(['chatgpt.com','auth.openai.com','auth.chatgpt.com']);
const ID = /^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,159}$/;
// Stable v0.161 protocol: granular approvals require experimentalApi=true.
// This tutor opts out of experimental APIs and denies every approval instead.
const DENY_APPROVAL = 'never';
const DISABLED_FEATURES = ['shell_tool','unified_exec','deferred_executor','apply_patch_freeform','apps','connectors','plugins','remote_plugin','browser_use','computer_use','in_app_browser','in_app_local_automation','image_generation','imagegenext','view_image','multi_agent','multi_agent_v2','collab','code_mode','code_mode_host','code_mode_only','js_repl','js_repl_tools_only','search_tool','tool_search','tool_suggest','skill_search','memories','memory_tool','request_permissions_tool','request_rule','hooks','codex_hooks','plugin_hooks','goals','sleep_tool','default_mode_request_user_input','send_async_message','send_message_to_user_async','standalone_web_search','web_search','web_search_request','web_search_cached','workspace_dependencies'];
const SAFE_CONFIG = Object.freeze({
  model_provider:'openai',forced_login_method:'chatgpt',cli_auth_credentials_store:'keyring',
  approval_policy:DENY_APPROVAL,sandbox_mode:'read-only',web_search:'disabled',
  features:Object.fromEntries(DISABLED_FEATURES.map(name=>[name,false])),
  agents:{enabled:false},mcp_servers:{},plugins:{},apps:{_default:{enabled:false}},
  tools:{update_plan:{enabled:false},experimental_request_user_input:{enabled:false}},
  skills:{bundled:{enabled:false},include_instructions:false},
  history:{persistence:'none'},analytics:{enabled:false},feedback:{enabled:false},
  include_environment_context:false,include_apps_instructions:false,
  include_collaboration_mode_instructions:false,project_doc_max_bytes:0,
  shell_environment_policy:{inherit:'none'},allow_login_shell:false
});
class CodexError extends Error {constructor(code,message){super(message);this.code=code;}}
function failure(error){return {success:false,error:{code:error instanceof CodexError?error.code:'CHATGPT_CONNECTION',message:error instanceof CodexError?error.message:'Veza s ChatGPT računom nije uspjela. Provjerite internet i prijavu.'}};}
function object(value){return !!value&&typeof value==='object'&&!Array.isArray(value);}
function text(value,max=240){return typeof value==='string'?value.replace(/[\u0000-\u001f]/g,' ').slice(0,max):'';}
function authUrl(value){
  try {const url=new URL(value);if(url.protocol!=='https:'||!AUTH_HOSTS.has(url.hostname)||url.username||url.password||url.port||value.length>8192)throw new Error();return url.href;}
  catch{throw new CodexError('AUTH_URL','ChatGPT je vratio nepodržanu adresu prijave. Prijava je zaustavljena.');}
}
const RPC_STAGES = new Set(['initialize','account/gatewayOAuth/read','account/read','model/list','account/rateLimits/read','account/login/start','account/login/cancel','account/logout','thread/start','turn/start','turn/interrupt','thread/unsubscribe','turn/completed','error']);
function protocolField(message){
  // Return fixed labels only. Never copy provider text, data, paths or tokens.
  if(/readOnly\.access|sandboxPolicy\.access/.test(message))return 'sandboxPolicy.access';
  if(/askForApproval\.granular|approvalPolicy/.test(message))return 'approvalPolicy';
  for(const field of ['sandboxPolicy','baseInstructions','developerInstructions','text_elements','threadId','effort','summary','input'])if(message.includes(field))return field;
  return null;
}
function rpcError(value,stage){
  const message=String(value?.message||'').toLowerCase(),info=value?.data?.codexErrorInfo||value?.codexErrorInfo;
  if(info==='unauthorized'||/unauthor|sign.?in|not.?logged|authentication|401/.test(message))return new CodexError('AUTH','Ponovo se prijavite svojim ChatGPT računom.');
  if(['usageLimitExceeded','rateLimitExceeded'].includes(info)||/usage.?limit|rate.?limit|quota|429/.test(message))return new CodexError('RATE_LIMIT','Dostignuto je ograničenje vaše ChatGPT pretplate. Sačekajte obnovu limita ili provjerite račun.');
  if(/model.*(not|unavailable|unsupported)|unsupported.*(effort|model)|invalid.*effort/.test(message))return new CodexError('MODEL','Odabrani model ili nivo razmišljanja nije dostupan na ovom računu. Osvježite listu i odaberite ponuđenu opciju.');
  if(/keyring|credential.*(stor|sav)/.test(message))return new CodexError('AUTH_STORAGE','Sistemska zaštita ChatGPT prijave nije dostupna. Prijava nije sačuvana.');
  if(info==='serverOverloaded'||/overload/.test(message)||value?.code===-32001)return new CodexError('SERVER','ChatGPT je trenutno preopterećen. Pokušajte kasnije.');
  if(/-32601|unknown method/.test(message)||value?.code===-32601)return new CodexError('PROTOCOL','Ugrađeni ChatGPT servis ne podržava traženu radnju. Instalirajte novije izdanje ELDI EDU.');
  if([-32700,-32600,-32602].includes(value?.code)){
    const field=protocolField(String(value?.message||''));
    const details=[RPC_STAGES.has(stage)?stage:null,String(value.code),field].filter(Boolean).join('; ');
    return new CodexError('PROTOCOL','Ugrađeni ChatGPT servis odbio je zahtjev ('+details+'). Instalirajte najnovije izdanje ELDI EDU.');
  }
  return new CodexError('CHATGPT_REQUEST','ChatGPT nije završio zahtjev. Provjerite prijavu, model i internet pa pokušajte ponovo.');
}
function sanitizedModels(data){
  if(!Array.isArray(data))throw new CodexError('PROTOCOL','ChatGPT nije vratio ispravnu listu modela.');
  return data.filter(item=>object(item)&&!item.hidden&&typeof item.model==='string'&&ID.test(item.model)).slice(0,300).map(item=>({
    id:ID.test(item.id||'')?item.id:item.model,model:item.model,displayName:text(item.displayName)||item.model,
    defaultReasoningEffort:text(item.defaultReasoningEffort,40),isDefault:item.isDefault===true,
    supportedReasoningEfforts:(Array.isArray(item.supportedReasoningEfforts)?item.supportedReasoningEfforts:[]).filter(e=>object(e)&&typeof e.reasoningEffort==='string'&&ID.test(e.reasoningEffort)).slice(0,20).map(e=>({reasoningEffort:e.reasoningEffort,description:text(e.description,400)}))
  }));
}
// Pinned Rust Deserialize rejects legacy restricted readOnly.access even though
// it does not appear in the exported JSON schema. Tool features stay disabled.
function sandbox(){return {type:'readOnly',networkAccess:false};}
function threadParams(workspace,model,instructions){return {model,modelProvider:'openai',cwd:workspace,ephemeral:true,approvalPolicy:DENY_APPROVAL,sandbox:'read-only',config:SAFE_CONFIG,baseInstructions:instructions,developerInstructions:'You are a text-only tutor. No tool use, filesystem access, subprocess, browser, connector, plugin, memory, credentials or external instructions. Use only the educational text provided in this turn.',serviceName:'eldi_edu_tutoring'};}
function turnParams(workspace,threadId,model,effort,prompt){return {threadId,input:[{type:'text',text:prompt}],model,effort,cwd:workspace,approvalPolicy:DENY_APPROVAL,sandboxPolicy:sandbox(),summary:'none'};}
function toml(value){if(typeof value==='string')return JSON.stringify(value);if(typeof value==='boolean'||typeof value==='number')return String(value);if(Array.isArray(value))return '['+value.map(toml).join(', ')+']';if(object(value))return '{ '+Object.entries(value).map(([key,child])=>JSON.stringify(key)+' = '+toml(child)).join(', ')+' }';throw new Error('Unsupported Codex configuration value.');}
function environment(home){
  const allowed=['SYSTEMROOT','WINDIR','COMSPEC','TEMP','TMP','USERPROFILE','APPDATA','LOCALAPPDATA','PATH','PATHEXT','PROGRAMDATA','SYSTEMDRIVE','HOME','LANG','LC_ALL','SSL_CERT_FILE','SSL_CERT_DIR'];
  const result={};for(const [name,value] of Object.entries(process.env))if(allowed.includes(name.toUpperCase()))result[name]=value;
  // Set only for this isolated subprocess, never modify the parent environment.
  result.CODEX_HOME=home;return result;
}

function createCodexAssistant(options={}){
  const home=options.homePath,executable=options.executablePath;
  if(typeof home!=='string'||!path.isAbsolute(home))throw new Error('Codex homePath must be absolute.');
  if(typeof executable!=='string'||!path.isAbsolute(executable))throw new Error('Codex executablePath must be absolute.');
  const workspace=path.join(home,'tutoring-workspace');
  const spawnImpl=options.spawnImpl||spawn,openExternal=options.openExternal;
  const timeoutMs=Math.max(10,Math.min(300000,Number(options.timeoutMs)||180000));
  const rpcTimeoutMs=Math.max(10,Math.min(60000,Number(options.rpcTimeoutMs)||30000));
  let processHandle=null,starting=null,pending=new Map(),nextId=1,buffer='',decoder=new StringDecoder('utf8'),disposed=false;
  let account=null,models=[],rateLimits=null,lastError=null,login=null,loginStarting=false,active=null,refreshing=null,refreshAfter=false;
  let selectedModel=REQUESTED_MODEL,selectedEffort=REQUESTED_EFFORT;
  const listeners=new Set();
  function selectionError(){const model=models.find(item=>item.model===selectedModel);if(!account)return null;if(!model)return 'Traženi model '+selectedModel+' nije ponuđen za ovaj ChatGPT račun. Odaberite dostupan model.';if(!model.supportedReasoningEfforts.some(item=>item.reasoningEffort===selectedEffort))return 'Nivo '+selectedEffort+' nije ponuđen uz '+model.displayName+'. Odaberite jedan od dostupnih nivoa.';return null;}
  function status(){const selection=selectionError();return {available:!!options.spawnImpl||fs.existsSync(executable),signedIn:!!account,account:account?{email:account.email,planType:account.planType}:null,model:selectedModel,effort:selectedEffort,requestedModel:REQUESTED_MODEL,requestedEffort:REQUESTED_EFFORT,models:models.map(item=>({...item,supportedReasoningEfforts:item.supportedReasoningEfforts.map(e=>({...e}))})),rateLimits,login:login?{type:login.type,pending:true,...(login.userCode?{userCode:login.userCode}:{}),...(login.error?{error:login.error}:{})}:null,configured:!!account&&!selection&&!lastError&&models.length>0,busy:!!active,error:lastError||selection};}
  function emit(){const current=status();for(const listener of listeners)try{listener(current);}catch{}}
  function write(message){if(!processHandle?.stdin?.writable)throw new CodexError('CHATGPT_CONNECTION','Ugrađeni ChatGPT servis nije dostupan. Pokušajte ponovo.');processHandle.stdin.write(JSON.stringify(message)+'\n');}
  function stop(error){const old=processHandle;processHandle=null;buffer='';decoder=new StringDecoder('utf8');for(const job of pending.values()){clearTimeout(job.timer);job.reject(error);}pending.clear();if(active)active.finish(error);login=null;if(old){old.removeAllListeners?.('exit');try{old.kill();}catch{}}lastError=error.message;emit();}
  function rpc(method,params={},waitMs=rpcTimeoutMs){return new Promise((resolve,reject)=>{const id=nextId++,timer=setTimeout(()=>{pending.delete(id);reject(new CodexError('TIMEOUT','ChatGPT nije odgovorio na vrijeme. Pokušajte ponovo.'));},waitMs);pending.set(id,{resolve,reject,timer,method});try{write({id,method,params});}catch(error){clearTimeout(timer);pending.delete(id);reject(error);}});}
  function message(value){
    if(!object(value))return;
    if(value.id!==undefined&&!value.method){const job=pending.get(value.id);if(!job)return;pending.delete(value.id);clearTimeout(job.timer);if(value.error)job.reject(rpcError(value.error,job.method));else job.resolve(value.result);return;}
    if(value.id!==undefined&&value.method){
      // ELDI does not implement file, shell, plugin, permission or dynamic tools.
      // Approval requests are declined; every other server request fails closed.
      if(['item/commandExecution/requestApproval','item/fileChange/requestApproval'].includes(value.method))write({id:value.id,result:{decision:'decline'}});
      else if(value.method==='item/permissions/requestApproval')write({id:value.id,result:{permissions:{},scope:'turn'}});
      else write({id:value.id,error:{code:-32601,message:'ELDI tutoring assistant does not support tools or credential exchange.'}});
      return;
    }
    const p=value.params||{};
    if(value.method==='account/login/completed'){
      if(login&&p.loginId===login.id){login=null;if(!p.success)lastError='ChatGPT prijava nije završena. Pokušajte ponovo.';else {lastError=null;refreshAfter=!!refreshing;refresh().catch(()=>{});}emit();}return;
    }
    if(value.method==='account/updated'){refreshAfter=!!refreshing;refresh().catch(()=>{});return;}
    if(value.method==='account/rateLimits/updated'){rateLimits=sanitizeLimits(p.rateLimits);emit();return;}
    const job=active;if(!job||p.threadId!==job.threadId)return;
    if(value.method==='turn/started'&&p.turn?.id){if(!job.turnId)job.turnId=p.turn.id;}
    if(job.turnId&&p.turnId&&job.turnId!==p.turnId)return;
    if(value.method==='item/completed'&&p.item?.type==='agentMessage'&&typeof p.item.text==='string'){
      if(!storeMessage(job,p.item))return;
    }
    if(value.method==='turn/completed'&&p.turn?.id){
      if(job.turnId&&job.turnId!==p.turn.id)return;job.turnId=p.turn.id;
      for(const item of p.turn.items||[])if(item?.type==='agentMessage'&&typeof item.text==='string'&&!storeMessage(job,item))return;
      if(p.turn.status==='interrupted')job.finish(new CodexError('CANCELED','AI zahtjev je zaustavljen.'));
      else if(p.turn.status==='failed'||p.turn.error)job.finish(rpcError(p.turn.error,'turn/completed'));
      else if(p.turn.status==='completed')job.finish(null,[...job.messages.values()].join('\n\n'));
      else job.finish(new CodexError('PROTOCOL','ChatGPT je vratio nepotvrđeno stanje završetka odgovora. Pokušajte ponovo.'));
    }
    if(value.method==='error'&&p.willRetry!==true)job.finish(rpcError(p.error,'error'));
  }
  function storeMessage(job,item){
    const key=item.id||'message-'+job.messages.size,bytes=Buffer.byteLength(item.text,'utf8');
    const previous=job.messages.get(key),total=[...job.messages.values()].reduce((sum,value)=>sum+Buffer.byteLength(value,'utf8')+2,0)+bytes-(previous?Buffer.byteLength(previous,'utf8')+2:0);
    if(bytes>TEXT_LIMIT||total>TEXT_LIMIT||(!previous&&job.messages.size>=64)){
      job.finish(new CodexError('RESPONSE_TOO_LARGE','AI odgovor je prevelik. Postavite kraće pitanje.'));
      if(job.threadId&&job.turnId)rpc('turn/interrupt',{threadId:job.threadId,turnId:job.turnId}).catch(()=>{});return false;
    }
    job.messages.set(key,item.text);return true;
  }
  function sanitizeLimits(value){
    if(!object(value))return null;
    const window=item=>object(item)&&Number.isFinite(item.usedPercent)?{usedPercent:Math.min(100,Math.max(0,item.usedPercent)),windowDurationMins:Number.isFinite(item.windowDurationMins)?item.windowDurationMins:null,resetsAt:Number.isSafeInteger(item.resetsAt)?item.resetsAt:null}:null;
    return {primary:window(value.primary),secondary:window(value.secondary),limitName:text(value.limitName),rateLimitReachedType:text(value.rateLimitReachedType)};
  }
  function data(chunk){buffer+=decoder.write(chunk);if(Buffer.byteLength(buffer,'utf8')>LINE_LIMIT&&!buffer.includes('\n')){stop(new CodexError('PROTOCOL','ChatGPT servis je vratio preveliku poruku.'));return;}
    let index;while((index=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,index);buffer=buffer.slice(index+1);if(!line.trim())continue;if(Buffer.byteLength(line,'utf8')>LINE_LIMIT){stop(new CodexError('PROTOCOL','ChatGPT servis je vratio preveliku poruku.'));return;}try{message(JSON.parse(line));}catch{stop(new CodexError('PROTOCOL','Ugrađeni ChatGPT servis je vratio neispravnu poruku.'));return;}}
    if(Buffer.byteLength(buffer,'utf8')>LINE_LIMIT)stop(new CodexError('PROTOCOL','ChatGPT servis je vratio preveliku poruku.'));
  }
  async function start(){
    if(disposed)throw new CodexError('CLOSED','AI servis je zatvoren.');if(starting)return starting;if(processHandle)return;
    starting=(async()=>{
      if(!options.spawnImpl&&!fs.existsSync(executable))throw new CodexError('RUNTIME_MISSING','Ugrađeni ChatGPT servis nedostaje. Instalirajte kompletno Windows izdanje ELDI EDU 11.');
      fs.mkdirSync(workspace,{recursive:true,mode:0o700});
      // Isolated profile is app-owned. CLI overrides also prevent a changed
      // configuration from enabling file/shell/connector capabilities.
      const args=['app-server','--listen','stdio://','--strict-config'];
      for(const [key,value] of Object.entries(SAFE_CONFIG))args.push('-c',key+'='+toml(value));
      processHandle=spawnImpl(executable,args,{cwd:workspace,env:environment(home),stdio:['pipe','pipe','pipe'],windowsHide:true,shell:false});
      processHandle.stdout.on('data',data);processHandle.stderr.on('data',()=>{});processHandle.stdin.on('error',()=>stop(new CodexError('CHATGPT_CONNECTION','Veza s ugrađenim ChatGPT servisom je prekinuta.')));
      processHandle.once('error',()=>stop(new CodexError('RUNTIME_MISSING','Ugrađeni ChatGPT servis nije pokrenut. Provjerite kompletno izdanje aplikacije.')));
      processHandle.once('exit',()=>stop(new CodexError('CHATGPT_CONNECTION','ChatGPT servis je zatvoren. Ponovo otvorite AI asistenta.')));
      try{await rpc('initialize',{clientInfo:{name:'eldi_edu',title:'ELDI EDU',version:options.appVersion||'33.33.0'},capabilities:{experimentalApi:false,explicitGatewayOauth:true}});write({method:'initialized',params:{}});const gateway=await rpc('account/gatewayOAuth/read');if(gateway?.required)throw new CodexError('PROVIDER','ELDI EDU podržava službenu ChatGPT prijavu; ovaj servis zahtijeva drugu prijavu.');lastError=null;}
      catch(error){stop(error);throw error;}
    })();try{await starting;}finally{starting=null;}
  }
  async function listModels(){let cursor=null,list=[],pages=0;do{const response=await rpc('model/list',{limit:100,includeHidden:false,...(cursor?{cursor}:{})});list.push(...sanitizedModels(response?.data));cursor=typeof response?.nextCursor==='string'?response.nextCursor:null;if(++pages>=5&&cursor)throw new CodexError('PROTOCOL','Lista ChatGPT modela je neočekivano duga.');}while(cursor);models=[...new Map(list.map(item=>[item.model,item])).values()];return models;}
  async function refresh(){
    if(refreshing)return refreshing;
    refreshing=(async()=>{try{await start();const info=await rpc('account/read',{refreshToken:false});const a=info?.account;account=a?.type==='chatgpt'?{email:text(a.email,254)||null,planType:text(a.planType,60)||'chatgpt'}:null;lastError=null;
      if(account){await listModels();try{const result=await rpc('account/rateLimits/read');rateLimits=sanitizeLimits(result?.rateLimits);}catch{};}else{models=[];rateLimits=null;}emit();return status();
    }catch(error){lastError=error instanceof CodexError?error.message:'Provjera ChatGPT prijave nije uspjela.';emit();return status();}})();try{return await refreshing;}finally{refreshing=null;if(refreshAfter&&!disposed){refreshAfter=false;queueMicrotask(()=>refresh().catch(()=>{}));}}
  }
  async function loginStart(type='chatgpt'){
    if(!['chatgpt','chatgptDeviceCode'].includes(type))return failure(new CodexError('INVALID_REQUEST','Odaberite prijavu u pregledniku ili kod za uređaj.'));
    if(active||login||loginStarting)return failure(new CodexError('BUSY','Sačekajte trenutni zahtjev ili zaustavite prijavu.'));
    loginStarting=true;
    try{await start();const result=await rpc('account/login/start',type==='chatgpt'?{type,useHostedLoginSuccessPage:true,appBrand:'chatgpt'}:{type});if(!result||result.type!==type||!ID.test(result.loginId||''))throw new CodexError('PROTOCOL','ChatGPT nije vratio ispravnu prijavu.');
      login={id:result.loginId,type,...(type==='chatgptDeviceCode'?{userCode:text(result.userCode,40)}:{})};const url=authUrl(type==='chatgpt'?result.authUrl:result.verificationUrl);if(type==='chatgptDeviceCode'&&!/^[A-Z0-9-]{4,40}$/.test(login.userCode))throw new CodexError('PROTOCOL','ChatGPT nije vratio ispravan kod za prijavu.');emit();
      if(typeof openExternal!=='function')throw new CodexError('BROWSER','Preglednik se ne može otvoriti. Ponovo pokušajte prijavu.');await openExternal(url);return {success:true,status:status()};
    }catch(error){if(login){try{await rpc('account/login/cancel',{loginId:login.id});}catch{}login=null;}lastError=error instanceof CodexError?error.message:'ChatGPT prijava nije pokrenuta.';emit();return failure(error);}finally{loginStarting=false;}
  }
  async function loginCancel(){const previous=login;login=null;if(previous)try{await rpc('account/login/cancel',{loginId:previous.id});}catch(error){lastError=failure(error).error.message;emit();return failure(error);}emit();return {success:true,status:status()};}
  async function logout(){if(active||loginStarting)return failure(new CodexError('BUSY','Zaustavite AI odgovor ili sačekajte pokretanje prijave prije odjave.'));try{await start();await loginCancel();await rpc('account/logout');account=null;models=[];rateLimits=null;lastError=null;emit();return {success:true,status:status()};}catch(error){return failure(error);}}
  function configure(value,{validateOnly=false}={}){if(active)return failure(new CodexError('BUSY','Sačekajte odgovor prije promjene modela.'));if(!object(value)||Object.keys(value).some(k=>!['model','effort'].includes(k))||!ID.test(value.model||'')||!ID.test(value.effort||''))return failure(new CodexError('INVALID_SETTINGS','Odaberite model i nivo razmišljanja iz ponuđene liste.'));const model=models.find(item=>item.model===value.model);if(account&&(!model||!model.supportedReasoningEfforts.some(item=>item.reasoningEffort===value.effort)))return failure(new CodexError('MODEL','Ovaj model ili nivo razmišljanja nije ponuđen na vašem računu.'));if(!validateOnly){selectedModel=value.model;selectedEffort=value.effort;lastError=null;emit();}return {success:true,status:status()};}
  async function ask(request){
    if(active)return failure(new CodexError('BUSY','AI već priprema odgovor.'));
    // Validated educational request is supplied by ai-assistant.cjs.
    if(!object(request)||typeof request.question!=='string'||typeof request.instructions!=='string')return failure(new CodexError('INVALID_REQUEST','Neispravan zahtjev za AI pomoć.'));
    let job;
    const promise=new Promise((resolve,reject)=>{job={threadId:null,turnId:null,messages:new Map(),finished:false,finish(error,response){if(job.finished)return;job.finished=true;clearTimeout(job.timer);error?reject(error):resolve(response);}};job.timer=setTimeout(()=>{cancel('TIMEOUT');},timeoutMs);});
    promise.catch(()=>{});active=job;emit();
    try{await refresh();if(job.finished)return failure(await promise.then(()=>null,error=>error));if(!account)throw new CodexError('UNCONFIGURED','Prijavite se svojim ChatGPT računom. API ključ nije potreban.');if(selectionError())throw new CodexError('MODEL',selectionError());
      const thread=await rpc('thread/start',threadParams(workspace,selectedModel,request.instructions));
      job.threadId=thread?.thread?.id;if(!ID.test(job.threadId||''))throw new CodexError('PROTOCOL','ChatGPT nije otvorio ispravan razgovor.');if(thread.model!==selectedModel)throw new CodexError('MODEL','ChatGPT je ponudio drugi model. Odaberite model iz liste prije novog pitanja.');if(job.finished)throw new CodexError('CANCELED','AI zahtjev je zaustavljen.');
      const history=(request.history||[]).map(item=>`${item.role==='assistant'?'RANIJI ODGOVOR':'RANIJE PITANJE'}:\n${item.content}`).join('\n\n');
      const prompt=[history,request.context?`KONTEKST ZADATKA:\n${request.context}`:'',`PITANJE UČENIKA:\n${request.question}`].filter(Boolean).join('\n\n');
      const turn=await rpc('turn/start',turnParams(workspace,job.threadId,selectedModel,selectedEffort,prompt));if(turn?.turn?.id&&!job.turnId)job.turnId=turn.turn.id;
      const response=await promise;if(!response?.trim())throw new CodexError('EMPTY_RESPONSE','ChatGPT je završio bez tekstualnog odgovora. Preformulišite pitanje.');if(Buffer.byteLength(response,'utf8')>TEXT_LIMIT)throw new CodexError('RESPONSE_TOO_LARGE','AI odgovor je prevelik. Postavite kraće pitanje.');return {success:true,provider:'chatgpt',model:selectedModel,effort:selectedEffort,text:response,incomplete:false};
    }catch(error){return failure(error);}finally{if(job){clearTimeout(job.timer);if(!job.finished)job.finish(new CodexError('CANCELED','AI zahtjev je zaustavljen.'));if(job.threadId&&processHandle)rpc('thread/unsubscribe',{threadId:job.threadId}).catch(()=>{});if(active===job)active=null;emit();}}
  }
  function cancel(reason='CANCELED'){const job=active;if(!job)return {success:true,canceled:false};job.finish(new CodexError(reason,reason==='TIMEOUT'?'ChatGPT nije odgovorio na vrijeme. Pokušajte s kraćim pitanjem.':'AI zahtjev je zaustavljen.'));if(job.threadId&&job.turnId)rpc('turn/interrupt',{threadId:job.threadId,turnId:job.turnId}).catch(()=>{});else{const handle=processHandle;if(handle)stop(new CodexError(reason,'AI zahtjev je zaustavljen.'));}return {success:true,canceled:true};}
  function dispose(){disposed=true;const handle=processHandle;processHandle=null;if(active)active.finish(new CodexError('CLOSED','AI servis je zatvoren.'));for(const job of pending.values()){clearTimeout(job.timer);job.reject(new CodexError('CLOSED','AI servis je zatvoren.'));}pending.clear();if(handle)try{handle.kill();}catch{}listeners.clear();}
  return Object.freeze({status,refresh,loginStart,loginCancel,logout,configure,ask,cancel,dispose,subscribe(listener){listeners.add(listener);return ()=>listeners.delete(listener);}});
}

module.exports={createCodexAssistant,CODEX_VERSION,REQUESTED_MODEL,REQUESTED_EFFORT,SAFE_CONFIG,authUrl,sanitizedModels,threadParams,turnParams,toml};
