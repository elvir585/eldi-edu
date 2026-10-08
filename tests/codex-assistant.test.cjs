'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {EventEmitter}=require('node:events');
const {PassThrough,Writable}=require('node:stream');
const {createCodexAssistant,SAFE_CONFIG,authUrl}=require('../desktop/codex-assistant.cjs');
const {createAssistant}=require('../desktop/ai-assistant.cjs');
// Simulated stdio protocol, never a real sign-in or inference request.
function fixture(t,options={}){
  const home=fs.mkdtempSync(path.join(os.tmpdir(),'eldi-chatgpt-test-'));t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
  let handle,spawnCalls=0,account=options.signedIn===false?null:{type:'chatgpt',email:'teacher@example.test',planType:'pro'};
  const requests=[],opened=[];
  const models=options.models||[{id:'gpt-6.1-sol',model:'gpt-6.1-sol',displayName:'GPT-6.1 Sol',defaultReasoningEffort:'medium',supportedReasoningEfforts:[{reasoningEffort:'medium',description:'Standard'},{reasoningEffort:'ultra',description:'Deep reasoning'}],isDefault:true}];
  const send=value=>handle.stdout.write(JSON.stringify(value)+'\n');
  function spawnImpl(executable,args,spawnOptions){
    spawnCalls++;handle=new EventEmitter();handle.stdout=new PassThrough();handle.stderr=new PassThrough();handle.kill=()=>{handle.killed=true;handle.emit('exit',0);};
    handle.stdin=new Writable({write(chunk,_encoding,done){for(const line of chunk.toString().split('\n').filter(Boolean)){const request=JSON.parse(line);requests.push(request);queueMicrotask(()=>{
      if(options.intercept?.(request,{send,handle})===true)return;
      if(request.id===undefined)return;
      const respond=result=>send({id:request.id,result});
      if(!request.method)return;
      switch(request.method){
        case 'initialize':respond({userAgent:'fixture'});break;
        case 'account/gatewayOAuth/read':respond({required:false,status:null});break;
        case 'account/read':respond({account,requiresOpenaiAuth:true,accessToken:'MUST_NOT_LEAK'});break;
        case 'account/rateLimits/read':respond({rateLimits:{primary:{usedPercent:23,windowDurationMins:300,resetsAt:1800000000},secret:'MUST_NOT_LEAK'}});break;
        case 'model/list':respond({data:models,nextCursor:null});break;
        case 'account/login/start':respond(request.params.type==='chatgptDeviceCode'?{type:'chatgptDeviceCode',loginId:'login-123',verificationUrl:options.authUrl||'https://auth.openai.com/codex/device',userCode:'ABCD-1234'}:{type:'chatgpt',loginId:'login-123',authUrl:options.authUrl||'https://chatgpt.com/auth/login?redirect_uri=http%3A%2F%2Flocalhost%3A1455%2Fauth%2Fcallback'});break;
        case 'account/login/cancel':respond({});break;
        case 'account/logout':account=null;respond({});break;
        case 'thread/start':respond({thread:{id:'thread-123'},model:options.returnedModel||request.params.model});break;
        case 'turn/start':respond({turn:{id:'turn-123',status:'inProgress'}});if(!options.holdTurn)queueMicrotask(()=>{
          send({method:'item/completed',params:{threadId:'thread-123',turnId:'turn-123',item:{id:'answer-123',type:'agentMessage',text:options.answer||'Saberi 7 i 5. Rezultat je 12.'}}});
          send({method:'turn/completed',params:{threadId:'thread-123',turn:{id:'turn-123',status:'completed',items:[]}}});
        });break;
        case 'turn/interrupt':respond({});send({method:'turn/completed',params:{threadId:'thread-123',turn:{id:'turn-123',status:'interrupted',items:[]}}});break;
        case 'thread/unsubscribe':respond({status:'unsubscribed'});break;
        default:send({id:request.id,error:{code:-32601,message:'unsupported fixture method'}});
      }
    });}done();}});
    fixture.spawnCapture={executable,args,spawnOptions};return handle;
  }
  const service=createCodexAssistant({homePath:home,executablePath:path.join(home,'codex.exe'),spawnImpl,openExternal:async url=>opened.push(url),rpcTimeoutMs:options.rpcTimeoutMs||500,timeoutMs:options.timeoutMs||1000});t.after(()=>service.dispose());
  return {service,requests,opened,send,get handle(){return handle;},get spawnCalls(){return spawnCalls;},completeLogin(){account={type:'chatgpt',email:'teacher@example.test',planType:'pro'};send({method:'account/login/completed',params:{loginId:'login-123',success:true,error:null}});}};
}
const request=()=>({question:'Kako sabrati?',context:'Zbir 7 i 5',history:[{role:'user',content:'Prvi pokušaj'}],instructions:'You are an educational tutor.'});

test('Private stdio handshake discovers actual account/models/efforts without leaking tokens',async t=>{
  const f=fixture(t),state=await f.service.refresh();assert.equal(state.configured,true);assert.equal(state.account.planType,'pro');assert.equal(state.effort,'ultra');assert.equal(state.models[0].model,'gpt-6.1-sol');assert.equal(state.rateLimits.primary.usedPercent,23);assert.equal(JSON.stringify(state).includes('MUST_NOT_LEAK'),false);
  assert.equal(f.requests[0].method,'initialize');assert.equal(f.requests[1].method,'initialized');assert.equal(f.requests[2].method,'account/gatewayOAuth/read');
  const capture=fixture.spawnCapture;assert.equal(capture.spawnOptions.shell,false);assert.equal(capture.spawnOptions.cwd,path.join(capture.spawnOptions.env.CODEX_HOME,'tutoring-workspace'));assert.ok(capture.args.includes('stdio://'));assert.equal(capture.spawnOptions.env.OPENAI_API_KEY,undefined);assert.equal(capture.spawnOptions.env.CODEX_AUTH_TOKEN,undefined);
  assert.ok(capture.args.includes('cli_auth_credentials_store="keyring"'));assert.equal(SAFE_CONFIG.features.shell_tool,false);assert.equal(SAFE_CONFIG.features.apps,false);assert.equal(SAFE_CONFIG.agents.enabled,false);
  const copy=state.models;copy[0].supportedReasoningEfforts[0].reasoningEffort='tampered';assert.equal(f.service.status().models[0].supportedReasoningEfforts[0].reasoningEffort,'medium');assert.equal(f.opened.length,0);
});
test('Requested model and ultra are never silently replaced by another advertised model',async t=>{
  const f=fixture(t,{models:[{model:'other-model',displayName:'Available model',defaultReasoningEffort:'medium',supportedReasoningEfforts:[{reasoningEffort:'medium'}]}]});
  const state=await f.service.refresh();assert.equal(state.configured,false);assert.match(state.error,/gpt-6.1-sol/);assert.equal((await f.service.ask(request())).error.code,'MODEL');assert.equal(f.requests.some(r=>r.method==='thread/start'),false);
  assert.equal(f.service.configure({model:'other-model',effort:'ultra'}).success,false);assert.equal(f.service.configure({model:'other-model',effort:'medium'}).success,true);assert.equal((await f.service.ask(request())).model,'other-model');
});
test('Browser and device login are explicit, allowlisted, cancelable, and use account notifications',async t=>{
  const f=fixture(t,{signedIn:false});await f.service.refresh();assert.equal(f.opened.length,0);assert.equal((await f.service.ask(request())).error.code,'UNCONFIGURED');
  const login=await f.service.loginStart('chatgpt');assert.equal(login.success,true);assert.equal(f.opened.length,1);assert.match(f.opened[0],/^https:\/\/chatgpt.com/);assert.equal(login.status.login.pending,true);assert.equal(JSON.stringify(login).includes('redirect_uri'),false);
  f.completeLogin();await new Promise(resolve=>setImmediate(resolve));await f.service.refresh();assert.equal(f.service.status().signedIn,true);assert.equal(f.service.status().login,null);
  assert.equal((await f.service.logout()).success,true);assert.equal(f.service.status().signedIn,false);
  const device=await f.service.loginStart('chatgptDeviceCode');assert.equal(device.status.login.userCode,'ABCD-1234');assert.match(f.opened.at(-1),/^https:\/\/auth.openai.com\/codex\/device$/);assert.equal((await f.service.loginCancel()).success,true);assert.equal(f.service.status().login,null);
});
test('Auth URLs reject unsafe schemes, credentials, unknown hosts, ports and impersonating subdomains',async t=>{
  for(const url of ['http://chatgpt.com/auth','file:///tmp/token','https://chatgpt.com.evil.test/','https://evil.test/','https://user:pass@chatgpt.com/','https://auth.openai.com:8000/'])assert.throws(()=>authUrl(url));
  const f=fixture(t,{signedIn:false,authUrl:'https://evil.test/'});const login=await f.service.loginStart();assert.equal(login.error.code,'AUTH_URL');assert.equal(f.opened.length,0);
});
test('Tutor creates ephemeral thread, sends only explicit text, declines tool approvals and rejects tool requests',async t=>{
  const f=fixture(t);const response=await f.service.ask(request());assert.equal(response.success,true);assert.match(response.text,/12/);assert.equal(response.model,'gpt-6.1-sol');assert.equal(response.effort,'ultra');
  const thread=f.requests.find(r=>r.method==='thread/start'),turn=f.requests.find(r=>r.method==='turn/start');assert.equal(thread.params.ephemeral,true);assert.equal(thread.params.config.features.shell_tool,false);assert.equal(thread.params.approvalPolicy.granular.request_permissions,false);assert.equal(turn.params.sandboxPolicy.type,'readOnly');assert.equal(turn.params.sandboxPolicy.access.readableRoots.length,1);assert.equal(turn.params.effort,'ultra');assert.match(turn.params.input[0].text,/Prvi pokušaj/);assert.match(turn.params.input[0].text,/Zbir 7 i 5/);assert.equal(turn.params.input.length,1);
  f.send({id:800,method:'item/commandExecution/requestApproval',params:{command:'cat auth.json'}});f.send({id:801,method:'item/fileChange/requestApproval',params:{}});f.send({id:802,method:'item/tool/call',params:{name:'shell'}});await new Promise(resolve=>setImmediate(resolve));
  assert.equal(f.requests.find(r=>r.id===800).result.decision,'decline');assert.equal(f.requests.find(r=>r.id===801).result.decision,'decline');assert.equal(f.requests.find(r=>r.id===802).error.code,-32601);
});
test('Concurrent requests, cancellation and timeout leave later tutoring requests reusable',async t=>{
  const f=fixture(t,{holdTurn:true}),first=f.service.ask(request());assert.equal((await f.service.ask(request())).error.code,'BUSY');await new Promise(resolve=>setImmediate(resolve));assert.equal(f.service.configure({model:'gpt-6.1-sol',effort:'medium'}).error.code,'BUSY');assert.equal(f.service.cancel().canceled,true);assert.equal((await first).error.code,'CANCELED');assert.equal(f.service.status().busy,false);
  const second=f.service.ask(request());await new Promise(resolve=>setImmediate(resolve));f.send({method:'item/completed',params:{threadId:'thread-123',turnId:'turn-123',item:{type:'agentMessage',id:'response2',text:'Drugi odgovor'}}});f.send({method:'turn/completed',params:{threadId:'thread-123',turn:{id:'turn-123',status:'completed'}}});assert.equal((await second).success,true);
  const timed=fixture(t,{holdTurn:true,timeoutMs:20});assert.equal((await timed.service.ask(request())).error.code,'TIMEOUT');assert.equal(timed.service.status().busy,false);
});
test('Model substitution, malformed stdout, stream overflow and process exit fail without fabricated answers',async t=>{
  const changed=fixture(t,{returnedModel:'different-model'});assert.equal((await changed.service.ask(request())).error.code,'MODEL');assert.equal(changed.requests.some(r=>r.method==='turn/start'),false);
  const malformed=fixture(t,{holdTurn:true}),answer=malformed.service.ask(request());await new Promise(resolve=>setImmediate(resolve));malformed.handle.stdout.write('this is not json\n');assert.equal((await answer).error.code,'PROTOCOL');
  const overflow=fixture(t,{holdTurn:true}),large=overflow.service.ask(request());await new Promise(resolve=>setImmediate(resolve));overflow.handle.stdout.write('x'.repeat(2*1024*1024+1));assert.equal((await large).error.code,'PROTOCOL');
  const exited=fixture(t,{holdTurn:true}),gone=exited.service.ask(request());await new Promise(resolve=>setImmediate(resolve));exited.handle.emit('exit',1);assert.equal((await gone).error.code,'CHATGPT_CONNECTION');
});
test('Provider rate limit errors are redacted and no raw backend error/token enters UI',async t=>{
  const f=fixture(t,{intercept(r,{send}){if(r.method==='turn/start'){send({id:r.id,error:{code:429,message:'usage limit MUST_NOT_LEAK access_token abc'}});return true;}}});const result=await f.service.ask(request());assert.equal(result.error.code,'RATE_LIMIT');assert.equal(JSON.stringify(result).includes('MUST_NOT_LEAK'),false);assert.equal(f.service.status().busy,false);
});
test('Completion status and total output bounds are enforced before returning an answer',async t=>{
  const unknown=fixture(t,{holdTurn:true}),pending=unknown.service.ask(request());await new Promise(resolve=>setImmediate(resolve));unknown.send({method:'turn/completed',params:{threadId:'thread-123',turn:{id:'turn-123',status:'mystery',items:[{id:'msg',type:'agentMessage',text:'Unconfirmed'}]}}});assert.equal((await pending).error.code,'PROTOCOL');
  const large=fixture(t,{holdTurn:true}),answer=large.service.ask(request());await new Promise(resolve=>setImmediate(resolve));for(const id of ['first','second'])large.send({method:'item/completed',params:{threadId:'thread-123',turnId:'turn-123',item:{type:'agentMessage',id,text:'x'.repeat(70000)}}});assert.equal((await answer).error.code,'RESPONSE_TOO_LARGE');
  const empty=fixture(t,{holdTurn:true}),noText=empty.service.ask(request());await new Promise(resolve=>setImmediate(resolve));empty.send({method:'turn/completed',params:{threadId:'thread-123',turn:{id:'turn-123',status:'completed',items:[]}}});assert.equal((await noText).error.code,'EMPTY_RESPONSE');
});
test('ELDI defaults to subscription, preserves advanced API/Ollama, validates educational input and persists no ChatGPT token',async t=>{
  const f=fixture(t),settings=path.join(fixture.spawnCapture?.spawnOptions?.env?.CODEX_HOME||os.tmpdir(),'eldi-ai-settings.json');await f.service.refresh();
  const assistant=createAssistant({codexAssistant:f.service,settingsPath:settings,fetchImpl:async()=>{throw new Error('No REST expected');}});assert.equal(assistant.status().provider,'chatgpt');assert.equal(assistant.status().hasKey,false);
  assert.equal((await assistant.ask({question:'P',history:[{role:'system',content:'hack'}]})).error.code,'INVALID_REQUEST');
  assert.equal((await assistant.ask({question:'Objasni zbir.',context:{code:'print(7+5)'}})).success,true);
  assert.equal(assistant.saveSettings({provider:'chatgpt',model:'gpt-6.1-sol',effort:'medium'}).success,true);assert.equal(fs.readFileSync(settings,'utf8').includes('MUST_NOT_LEAK'),false);assert.equal(assistant.status().effort,'medium');assert.equal(assistant.saveSettings({provider:'ollama',model:'local:7b'}).success,true);
});
