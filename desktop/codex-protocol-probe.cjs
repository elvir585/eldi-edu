'use strict';

// Native build check for the pinned app-server request boundary. It never signs
// in or submits a turn to a loaded thread. An unknown UUID allows turn parsing
// and dispatch to be checked without starting model generation.
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const {randomUUID}=require('node:crypto');
const {spawn}=require('node:child_process');
const {StringDecoder}=require('node:string_decoder');
const {CODEX_VERSION,REQUESTED_MODEL,REQUESTED_EFFORT,SAFE_CONFIG,threadParams,turnParams,toml}=require('./codex-assistant.cjs');

const LINE_LIMIT=2*1024*1024;
const LEGACY_APPROVAL=Object.freeze({granular:{sandbox_approval:false,rules:false,skill_approval:false,request_permissions:false,mcp_elicitations:false}});
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function object(value){return value!==null&&typeof value==='object'&&!Array.isArray(value);}
function fail(label,code){return new Error('Codex protocol probe failed: '+label+(Number.isInteger(code)?' (RPC '+code+')':'')+'.');}
function isolatedEnvironment(root){
  const env={};
  // Retain system runtime settings only. Never inherit API credentials, user
  // configuration locations, proxies, auth helpers or a user's Codex home.
  const allowed=new Set(['SYSTEMROOT','WINDIR','COMSPEC','PATH','PATHEXT','PROGRAMDATA','SYSTEMDRIVE','LANG','LC_ALL']);
  for(const [key,value] of Object.entries(process.env))if(allowed.has(key.toUpperCase()))env[key]=value;
  Object.assign(env,{
    CODEX_HOME:path.join(root,'codex-home'),HOME:path.join(root,'profile'),USERPROFILE:path.join(root,'profile'),
    APPDATA:path.join(root,'appdata'),LOCALAPPDATA:path.join(root,'local-appdata'),
    XDG_CONFIG_HOME:path.join(root,'config'),XDG_CACHE_HOME:path.join(root,'cache'),
    XDG_DATA_HOME:path.join(root,'data'),XDG_STATE_HOME:path.join(root,'state'),
    TEMP:path.join(root,'temp'),TMP:path.join(root,'temp')
  });
  return env;
}

async function probeCodexProtocol({binaryPath,timeoutMs=30000,spawnImpl=spawn}={}){
  if(typeof binaryPath!=='string'||!path.isAbsolute(binaryPath))throw fail('binary must have an absolute path');
  const deadline=Math.max(20,Math.min(60000,Number(timeoutMs)||30000));
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'eldi-codex-protocol-'));
  const env=isolatedEnvironment(root),workspace=path.join(root,'workspace'),unknownId=randomUUID();
  let child=null,ended=false,buffer='',nextId=1,decoder=new StringDecoder('utf8');
  const pending=new Map();
  let fatal=null,closePromise=null;
  function abort(error){
    if(!fatal)fatal=error;
    for(const item of pending.values()){clearTimeout(item.timer);item.reject(fatal);}
    pending.clear();
    try{child?.kill();}catch{}
  }
  function write(message){
    if(fatal)throw fatal;
    if(!child?.stdin?.writable)throw fail('stdio unavailable');
    // Guard the safety invariant independently of the server/fixture behavior.
    if(message.method==='turn/start'&&message.params?.threadId!==unknownId)throw fail('loaded thread turn forbidden');
    child.stdin.write(JSON.stringify(message)+'\n');
  }
  function request(method,params={}){
    if(fatal)return Promise.reject(fatal);
    return new Promise((resolve,reject)=>{
      const id=nextId++,timer=setTimeout(()=>abort(fail(method+' timeout')),deadline);
      pending.set(id,{resolve,reject,timer});
      try{write({id,method,params});}catch(error){clearTimeout(timer);pending.delete(id);reject(error);}
    });
  }
  function onMessage(value){
    if(!object(value)){abort(fail('invalid message shape'));return;}
    if(value.id!==undefined&&!value.method){
      const item=pending.get(value.id);if(!item)return;
      pending.delete(value.id);clearTimeout(item.timer);
      // Keep raw response local to the assertions. Neither messages nor error
      // data are returned, logged or interpolated into exceptions.
      item.resolve(value);return;
    }
    if(value.method==='turn/started'||value.method==='item/started'||value.method==='item/completed'||value.method==='turn/completed'){
      abort(fail('unexpected generation notification'));return;
    }
    if(value.id!==undefined&&value.method){
      try{write({id:value.id,error:{code:-32601,message:'Protocol probe does not provide tools or credentials.'}});}catch{}
      abort(fail('unexpected server request'));
    }
  }
  function onData(chunk){
    buffer+=decoder.write(chunk);
    if(Buffer.byteLength(buffer,'utf8')>LINE_LIMIT&&!buffer.includes('\n')){abort(fail('stdout limit'));return;}
    let index;
    while((index=buffer.indexOf('\n'))>=0){
      const line=buffer.slice(0,index);buffer=buffer.slice(index+1);if(!line.trim())continue;
      if(Buffer.byteLength(line,'utf8')>LINE_LIMIT){abort(fail('stdout limit'));return;}
      try{onMessage(JSON.parse(line));}catch{abort(fail('invalid stdout JSON'));return;}
      if(fatal)return;
    }
    if(Buffer.byteLength(buffer,'utf8')>LINE_LIMIT)abort(fail('stdout limit'));
  }
  function result(response,label){
    if(response?.error)throw fail(label,response.error.code);
    if(!object(response?.result))throw fail(label+' result');
    return response.result;
  }
  function expectedError(response,label,code,pattern){
    if(!object(response?.error)||response.error.code!==code||!pattern.test(String(response.error.message||'')))throw fail(label,response?.error?.code);
  }
  try{
    for(const directory of new Set([workspace,...Object.values(env).filter(value=>typeof value==='string'&&value.startsWith(root+path.sep))]))await fs.mkdir(directory,{recursive:true,mode:0o700});
    const args=['app-server','--listen','stdio://','--strict-config'];
    for(const [key,value] of Object.entries(SAFE_CONFIG))args.push('-c',key+'='+toml(value));
    child=spawnImpl(binaryPath,args,{cwd:workspace,env,stdio:['pipe','pipe','ignore'],shell:false,windowsHide:true});
    closePromise=new Promise(resolve=>child.once('close',()=>{ended=true;resolve();}));
    child.stdout.on('data',onData);
    child.stdin.on('error',()=>abort(fail('stdin closed')));
    child.once('error',()=>abort(fail('binary could not start')));
    child.once('exit',()=>{ended=true;if(pending.size)abort(fail('binary exited'));});
    result(await request('initialize',{clientInfo:{name:'eldi_protocol_probe',title:'ELDI protocol probe',version:CODEX_VERSION},capabilities:{experimentalApi:false,explicitGatewayOauth:true}}),'initialize');
    write({method:'initialized',params:{}});
    const account=result(await request('account/read',{refreshToken:false}),'isolated account read');
    if(account.account!==null)throw fail('isolated account must be absent');

    const stableThread=threadParams(workspace,REQUESTED_MODEL,'Protocol validation only. Do not generate an answer or use tools.');
    expectedError(await request('thread/start',{...stableThread,approvalPolicy:LEGACY_APPROVAL}),'legacy granular rejection',-32600,/askForApproval\.granular.*experimental|experimental.*askForApproval\.granular/i);

    const stableTurn=turnParams(workspace,unknownId,REQUESTED_MODEL,REQUESTED_EFFORT,'Protocol validation only.');
    expectedError(await request('turn/start',{...stableTurn,sandboxPolicy:{type:'readOnly',access:{type:'restricted',includePlatformDefaults:false,readableRoots:[workspace]}}}),'legacy restricted sandbox rejection',-32600,/readOnly\.access is no longer supported/);

    const opened=result(await request('thread/start',stableThread),'stable thread open');
    if(!UUID.test(opened.thread?.id||'')||opened.thread.id===unknownId)throw fail('stable thread identifier');
    // The opened thread is deliberately never used for turn/start.
    expectedError(await request('turn/start',stableTurn),'stable turn semantic validation',-32600,new RegExp('^thread not found: '+unknownId+'$','i'));
    result(await request('thread/unsubscribe',{threadId:opened.thread.id}),'thread cleanup');
    if(fatal)throw fatal;
    return Object.freeze({version:CODEX_VERSION,signedIn:false,legacyGranularRejected:true,legacyRestrictedRejected:true,stableThreadOpened:true,stableTurnValidated:true,inferenceRequested:false});
  }finally{
    for(const item of pending.values()){clearTimeout(item.timer);item.reject(fail('probe closed'));}pending.clear();
    if(child&&!ended){try{child.stdin.end();child.kill();}catch{}}
    if(closePromise){let timer;await Promise.race([closePromise,new Promise(resolve=>{timer=setTimeout(resolve,2000);})]);clearTimeout(timer);}
    await fs.rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:200});
  }
}

module.exports={probeCodexProtocol};
