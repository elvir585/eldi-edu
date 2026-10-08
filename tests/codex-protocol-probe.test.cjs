'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {EventEmitter}=require('node:events');
const {PassThrough,Writable}=require('node:stream');
const {probeCodexProtocol}=require('../desktop/codex-protocol-probe.cjs');
const {CODEX_VERSION,SAFE_CONFIG,threadParams,turnParams}=require('../desktop/codex-assistant.cjs');
const OPENED_ID='11111111-2222-4333-8444-555555555555';
// Unit fixtures verify safety/failure handling. Windows build-codex separately
// invokes this same helper with the real SHA-256-pinned executable.
function fixture(options={}){
  const requests=[];let child,capture;
  function spawnImpl(binary,args,spawnOptions){
    capture={binary,args,options:spawnOptions};
    child=new EventEmitter();child.stdout=new PassThrough();child.killed=false;
    child.kill=()=>{if(child.killed)return;child.killed=true;child.emit('exit',0);child.emit('close',0);};
    const send=value=>child.stdout.write(JSON.stringify(value)+'\n');
    child.stdin=new Writable({write(chunk,_encoding,done){
      for(const line of chunk.toString().split('\n').filter(Boolean)){
        const request=JSON.parse(line);requests.push(request);
        queueMicrotask(()=>{
          if(options.intercept?.(request,{send,child})===true)return;
          if(request.id===undefined)return;
          const result=value=>send({id:request.id,result:value});
          const error=(code,message)=>send({id:request.id,error:{code,message,data:{secret:'MUST_NOT_LEAK'}}});
          switch(request.method){
            case 'initialize':result({userAgent:'fixture'});break;
            case 'account/read':result({account:options.account||null,requiresOpenaiAuth:true});break;
            case 'thread/start':
              if(request.params.approvalPolicy?.granular)error(-32600,'askForApproval.granular requires experimentalApi capability');
              else result({thread:{id:OPENED_ID},model:request.params.model});
              break;
            case 'turn/start':
              if(request.params.sandboxPolicy?.access)error(-32600,'Invalid request: readOnly.access is no longer supported; use permissionProfile for restricted reads');
              else error(-32600,'thread not found: '+request.params.threadId);
              break;
            case 'thread/unsubscribe':result({status:'unsubscribed'});break;
            default:error(-32601,'Unknown method');
          }
        });
      }
      done();
    }});
    return child;
  }
  return {spawnImpl,requests,get child(){return child;},get capture(){return capture;}};
}
function options(f,extra={}){return {binaryPath:path.join(os.tmpdir(),'codex-probe-unit.exe'),spawnImpl:f.spawnImpl,timeoutMs:200,...extra};}

test('Probe shares production requests, reproduces both boundaries and never turns on the loaded thread',async()=>{
  const f=fixture(),proof=await probeCodexProtocol(options(f));
  assert.deepEqual(proof,{version:CODEX_VERSION,signedIn:false,legacyGranularRejected:true,legacyRestrictedRejected:true,stableThreadOpened:true,stableTurnValidated:true,inferenceRequested:false});
  const threads=f.requests.filter(r=>r.method==='thread/start'),turns=f.requests.filter(r=>r.method==='turn/start');
  assert.equal(threads.length,2);assert.equal(turns.length,2);assert.equal(turns[0].params.threadId,turns[1].params.threadId);assert.notEqual(turns[1].params.threadId,OPENED_ID);
  const stableThread=threads[1].params,stableTurn=turns[1].params;
  assert.deepEqual(stableThread,threadParams(stableThread.cwd,stableThread.model,stableThread.baseInstructions));
  assert.deepEqual(stableTurn,turnParams(stableTurn.cwd,stableTurn.threadId,stableTurn.model,stableTurn.effort,stableTurn.input[0].text));
  assert.equal(f.requests[0].params.capabilities.experimentalApi,false);
  assert.equal(f.requests.some(r=>/login|logout|model\/list/.test(r.method||'')),false);
  assert.equal(f.child.killed,true);
});

test('Fresh home, all profile paths and keyring configuration are isolated and stderr is discarded',async()=>{
  const f=fixture();await probeCodexProtocol(options(f));
  const {args,options:spawnOptions}=f.capture,env=spawnOptions.env;
  assert.deepEqual(spawnOptions.stdio,['pipe','pipe','ignore']);assert.equal(spawnOptions.shell,false);assert.ok(args.includes('--strict-config'));
  assert.ok(args.includes('cli_auth_credentials_store="keyring"'));assert.ok(args.includes('approval_policy="never"'));assert.equal(SAFE_CONFIG.features.shell_tool,false);
  const root=path.dirname(env.CODEX_HOME);assert.match(path.basename(root),/^eldi-codex-protocol-/);
  for(const name of ['HOME','USERPROFILE','APPDATA','LOCALAPPDATA','XDG_CONFIG_HOME','XDG_CACHE_HOME','XDG_DATA_HOME','XDG_STATE_HOME','TEMP','TMP'])assert.equal(path.dirname(env[name]),root,name);
  for(const name of ['OPENAI_API_KEY','CODEX_API_KEY','CODEX_AUTH_TOKEN','CHATGPT_TOKEN','HTTP_PROXY','HTTPS_PROXY'])assert.equal(env[name],undefined,name);
  assert.equal(fs.existsSync(root),false);
});

test('Unexpected account aborts before any thread or turn request and removes isolated files',async()=>{
  const f=fixture({account:{type:'chatgpt',email:'MUST_NOT_LEAK'}});
  await assert.rejects(probeCodexProtocol(options(f)),error=>/isolated account must be absent/.test(error.message)&&!error.message.includes('MUST_NOT_LEAK'));
  assert.equal(f.requests.some(r=>r.method==='thread/start'||r.method==='turn/start'),false);
  assert.equal(f.child.killed,true);assert.equal(fs.existsSync(path.dirname(f.capture.options.env.CODEX_HOME)),false);
});

test('Semantic unknown-thread error is required: a parse rejection cannot be recorded as successful validation',async()=>{
  const f=fixture({intercept(r,{send}){
    if(r.method==='turn/start'&&!r.params.sandboxPolicy.access){send({id:r.id,error:{code:-32600,message:'Invalid request: missing field MUST_NOT_LEAK',data:{token:'MUST_NOT_LEAK'}}});return true;}
  }});
  await assert.rejects(probeCodexProtocol(options(f)),error=>/stable turn semantic validation.*RPC -32600/.test(error.message)&&!error.message.includes('MUST_NOT_LEAK'));
  assert.equal(f.child.killed,true);
});

test('Unexpected generation, tool request and malformed stdout fail closed',async()=>{
  for(const event of ['generation','tool','malformed']){
    const f=fixture({intercept(r,{send,child}){
      if(r.method==='thread/start'&&r.params.approvalPolicy==='never'){
        if(event==='generation')send({method:'turn/started',params:{turn:{id:'MUST_NOT_LEAK'}}});
        else if(event==='tool')send({id:990,method:'item/tool/call',params:{secret:'MUST_NOT_LEAK'}});
        else child.stdout.write('MUST_NOT_LEAK invalid JSON\n');
        return true;
      }
    }});
    await assert.rejects(probeCodexProtocol(options(f)),error=>/unexpected generation|unexpected server request|invalid stdout JSON/.test(error.message)&&!error.message.includes('MUST_NOT_LEAK'));
    assert.equal(f.child.killed,true);
    assert.equal(f.requests.some(r=>r.method==='turn/start'&&!r.params.sandboxPolicy.access),false);
  }
});

test('Timeout and process exit stop the process and clean up without returning server text',async()=>{
  for(const action of ['timeout','exit']){
    const f=fixture({intercept(r,{child}){if(r.method==='initialize'){if(action==='exit')child.kill();return true;}}});
    await assert.rejects(probeCodexProtocol(options(f,{timeoutMs:20})),/initialize timeout|binary exited/);
    assert.equal(f.child.killed,true);assert.equal(fs.existsSync(path.dirname(f.capture.options.env.CODEX_HOME)),false);
  }
});

test('Native protocol probe is opt-in locally; Windows release build invokes it unconditionally',{
  skip:!process.env.ELDI_TEST_CODEX_BINARY,timeout:180000
},async()=>{
  const proof=await probeCodexProtocol({binaryPath:path.resolve(process.env.ELDI_TEST_CODEX_BINARY),timeoutMs:30000});
  assert.equal(proof.stableThreadOpened,true);assert.equal(proof.stableTurnValidated,true);assert.equal(proof.inferenceRequested,false);
});
