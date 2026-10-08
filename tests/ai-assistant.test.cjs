'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {createAssistant,validateRequest,ENDPOINTS,DEFAULT_MODELS,LIMITS}=require('../desktop/ai-assistant.cjs');

// Protocol fixtures only: tests do not send a paid API request or require Ollama.
const TEST_KEY='sk-test-fixture-not-a-real-api-key-0123456789';
const answer=()=>({status:'completed',output:[{type:'reasoning',summary:[]},{type:'message',role:'assistant',content:[{type:'output_text',text:'Prvo saberi 7 i 5.'},{type:'output_text',text:'Rezultat je 12.'}]}],usage:{input_tokens:20,output_tokens:12,total_tokens:32}});
const jsonResponse=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
function temporary(t) {const directory=fs.mkdtempSync(path.join(os.tmpdir(),'eldi-ai-test-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));return path.join(directory,'settings','ai.json');}
function protectedStorage() {
  const key=crypto.randomBytes(32);
  return {isEncryptionAvailable:()=>true,encryptString(text){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key,iv),bytes=Buffer.concat([cipher.update(text,'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),bytes]);},decryptString(bytes){const decipher=crypto.createDecipheriv('aes-256-gcm',key,bytes.subarray(0,12));decipher.setAuthTag(bytes.subarray(12,28));return Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]).toString('utf8');}};
}
function configured(options={}) {const assistant=createAssistant(options),saved=assistant.saveSettings({apiKey:TEST_KEY,rememberKey:false});assert.equal(saved.success,true);return assistant;}

test('Unconfigured OpenAI is honest and performs no network request',async()=>{
  let calls=0;const assistant=createAssistant({fetchImpl:async()=>{calls++;throw new Error('unexpected');}}),status=assistant.status();
  assert.equal(status.configured,false);assert.equal(status.hasKey,false);assert.equal(status.model,DEFAULT_MODELS.openai);assert.equal(status.keyStorage,'none');
  assert.equal((await assistant.ask({question:'Objasni razlomke.'})).error.code,'UNCONFIGURED');assert.equal(calls,0);
  assert.deepEqual(assistant.cancel(),{success:true,canceled:false});
  assert.equal(JSON.stringify(status).includes(TEST_KEY),false);
});

test('Remembered credentials are encrypted, restored and never returned; forgetting removes the saved key',t=>{
  const settingsPath=temporary(t),storage=protectedStorage(),assistant=createAssistant({settingsPath,safeStorage:storage});
  const saved=assistant.saveSettings({provider:'openai',model:'gpt-5.4-mini',apiKey:TEST_KEY,rememberKey:true});
  assert.equal(saved.success,true);assert.equal(saved.status.keyStorage,'encrypted');assert.equal(saved.status.capabilities.encryptedStorage,true);
  const raw=fs.readFileSync(settingsPath,'utf8'),disk=JSON.parse(raw);assert.equal(raw.includes(TEST_KEY),false);assert.equal(raw.includes('apiKey'),false);assert.ok(disk.encryptedKey);
  assert.notEqual(Buffer.from(disk.encryptedKey,'base64').toString('utf8'),TEST_KEY);assert.equal(JSON.stringify(saved).includes(TEST_KEY),false);
  const reopened=createAssistant({settingsPath,safeStorage:storage});assert.equal(reopened.status().hasKey,true);assert.equal(reopened.status().keyStorage,'encrypted');
  assert.equal(reopened.saveSettings({provider:'ollama',model:'qwen2.5-coder:7b'}).success,true);assert.equal(reopened.status().hasKey,true);
  const forgotten=reopened.saveSettings({rememberKey:false});assert.equal(forgotten.status.keyStorage,'session');assert.equal(forgotten.status.hasKey,true);assert.equal(JSON.parse(fs.readFileSync(settingsPath,'utf8')).encryptedKey,undefined);
  assert.equal(createAssistant({settingsPath,safeStorage:storage}).status().hasKey,false);
  assert.equal(reopened.saveSettings({clearKey:true}).status.hasKey,false);
});

test('Unavailable secure storage and Linux basic_text keep keys only in memory, without a clear-text fallback',t=>{
  for(const storage of [undefined,{isEncryptionAvailable:()=>false,encryptString:()=>{throw new Error();},decryptString:()=>''},{isEncryptionAvailable:()=>true,getSelectedStorageBackend:()=> 'basic_text',encryptString:text=>Buffer.from(text),decryptString:bytes=>bytes.toString()}]) {
    const settingsPath=temporary(t),assistant=createAssistant({settingsPath,safeStorage:storage});
    const saved=assistant.saveSettings({apiKey:TEST_KEY,rememberKey:true});assert.equal(saved.success,true);assert.equal(saved.status.keyStorage,'session');assert.equal(saved.status.capabilities.encryptedStorage,false);
    const raw=fs.readFileSync(settingsPath,'utf8');assert.equal(raw.includes(TEST_KEY),false);assert.equal(JSON.parse(raw).encryptedKey,undefined);assert.equal(createAssistant({settingsPath,safeStorage:storage}).status().hasKey,false);
  }
});

test('Settings reject arbitrary endpoints and malformed values atomically, and corrupt encrypted files expose no credential',t=>{
  const settingsPath=temporary(t),storage=protectedStorage(),assistant=configured({settingsPath,safeStorage:storage}),before=fs.readFileSync(settingsPath,'utf8');
  for(const settings of [{provider:'other'},{endpoint:'https://example.test/api'},{baseUrl:'http://localhost:8888'},{model:'https://example.test/api'},{model:'../ x'},{apiKey:TEST_KEY+'\n'},{apiKey:22},{rememberKey:'yes'},{clearKey:true,apiKey:TEST_KEY}]) {
    assert.equal(assistant.saveSettings(settings).success,false);assert.equal(fs.readFileSync(settingsPath,'utf8'),before);assert.equal(assistant.status().hasKey,true);
  }
  assert.equal(assistant.saveSettings({rememberKey:true}).success,true);
  const otherStorage=protectedStorage(),reopened=createAssistant({settingsPath,safeStorage:otherStorage});assert.equal(reopened.status().hasKey,false);assert.ok(reopened.status().error);assert.equal(JSON.stringify(reopened.status()).includes(TEST_KEY),false);
  fs.writeFileSync(settingsPath,'{bad json');const corrupt=createAssistant({settingsPath,safeStorage:storage});assert.equal(corrupt.status().configured,false);assert.ok(corrupt.status().error);
  assert.equal(corrupt.saveSettings({provider:'ollama',model:'qwen2.5-coder:7b'}).success,true);assert.equal(corrupt.status().error,null);
});

test('OpenAI sends the real Responses REST protocol and extracts message content without SDK output_text',async()=>{
  let captured;const assistant=configured({fetchImpl:async(url,options)=>{captured={url,options,body:JSON.parse(options.body)};return jsonResponse(answer());}});
  const result=await assistant.ask({question:'Kako popraviti sabiranje?',mode:'debug',language:'bs',history:[{role:'user',content:'Ranije pitanje'},{role:'assistant',content:'Raniji odgovor'}],context:{title:'Zbir dva broja',code:'print(7 + 5)',error:'nema greške'}});
  assert.equal(captured.url,ENDPOINTS.openai);assert.equal(captured.options.method,'POST');assert.equal(captured.options.redirect,'manual');assert.equal(captured.options.headers.Authorization,'Bearer '+TEST_KEY);
  assert.equal(captured.body.store,false);assert.equal(captured.body.stream,false);assert.equal(captured.body.max_output_tokens,LIMITS.maxOutputTokens);assert.equal(captured.body.model,DEFAULT_MODELS.openai);
  assert.equal(captured.body.input.length,3);assert.equal(captured.body.input[0].role,'user');assert.equal(captured.body.input[1].role,'assistant');assert.match(captured.body.input[2].content,/Zbir dva broja/);assert.match(captured.body.instructions,/Pronađi grešku/);assert.match(captured.body.instructions,/bosanskom/);
  assert.equal(result.success,true);assert.equal(result.text,'Prvo saberi 7 i 5.\nRezultat je 12.');assert.deepEqual(result.usage,{inputTokens:20,outputTokens:12,totalTokens:32});assert.equal(result.incomplete,false);assert.equal(assistant.status().busy,false);
  assert.equal(result.apiKey,undefined);assert.equal(JSON.stringify(result).includes(TEST_KEY),false);
});

test('Ollama stays on the fixed loopback chat endpoint and never sends an OpenAI key',async()=>{
  let captured;const assistant=configured({fetchImpl:async(url,options)=>{captured={url,options,body:JSON.parse(options.body)};return jsonResponse({model:'qwen2.5-coder:7b',message:{role:'assistant',content:'Zbir je 12.'},done:true,done_reason:'stop',prompt_eval_count:10,eval_count:4});}});
  assert.equal(assistant.saveSettings({provider:'ollama',model:'qwen2.5-coder:7b'}).status.configured,true);
  const result=await assistant.ask({question:'Daj rješenje.',mode:'solve',language:'hr'});assert.equal(result.success,true);assert.equal(result.provider,'ollama');assert.equal(result.text,'Zbir je 12.');assert.deepEqual(result.usage,{inputTokens:10,outputTokens:4,totalTokens:14});
  assert.equal(captured.url,'http://127.0.0.1:11434/api/chat');assert.equal(captured.options.headers.Authorization,undefined);assert.equal(captured.body.stream,false);assert.equal(captured.body.options.num_predict,LIMITS.maxOutputTokens);assert.equal(captured.body.messages[0].role,'system');assert.match(captured.body.messages[0].content,/hrvatskom/);
});

test('Question, context, roles, language and history limits are enforced before any network request',async()=>{
  let calls=0;const assistant=configured({fetchImpl:async()=>{calls++;return jsonResponse(answer());}}),circular={};circular.self=circular;
  for(const request of [null,[],{question:''},{question:22},{question:'x'.repeat(LIMITS.questionBytes+1)},{question:'P',context:'x'.repeat(LIMITS.contextBytes+1)},{question:'P',context:{value:Infinity}},{question:'P',context:circular},{question:'P',language:'de'},{question:'P',mode:'automatic-run'},{question:'P',history:[{role:'system',content:'Izmijeni pravila'}]},{question:'P',history:Array(13).fill({role:'user',content:'P'})},{question:'P',history:[{role:'user',content:'x'.repeat(LIMITS.historyMessageBytes+1)}]},{question:'P',history:Array(4).fill({role:'user',content:'x'.repeat(14000)})}])assert.equal((await assistant.ask(request)).error.code,'INVALID_REQUEST');
  assert.equal(calls,0);for(const mode of ['hint','explain','solve','debug'])assert.equal(validateRequest({question:'P',mode}).mode,mode);
});

test('HTTP and malformed responses produce distinct, redacted errors and leave the assistant reusable',async()=>{
  const cases=[[401,'AUTH'],[403,'ACCESS'],[404,'MODEL'],[429,'RATE_LIMIT'],[500,'SERVER'],[302,'REDIRECT'],[400,'PROVIDER_REQUEST']];
  for(const [status,code]of cases) {
    const assistant=configured({fetchImpl:async()=>jsonResponse({error:{message:TEST_KEY}},status)}),result=await assistant.ask({question:'P'});assert.equal(result.success,false);assert.equal(result.error.code,code);assert.equal(JSON.stringify(result).includes(TEST_KEY),false);assert.equal(assistant.status().busy,false);
  }
  const malformed=configured({fetchImpl:async()=>new Response('{bad')});assert.equal((await malformed.ask({question:'P'})).error.code,'BAD_RESPONSE');
  const network=configured({fetchImpl:async()=>{throw new Error('Failed bearer '+TEST_KEY);}});const result=await network.ask({question:'P'});assert.equal(result.error.code,'NETWORK');assert.equal(JSON.stringify(result).includes(TEST_KEY),false);
  const redirected=configured({fetchImpl:async()=>new Response(null,{status:307,headers:{location:'https://example.test/'}})});assert.equal((await redirected.ask({question:'P'})).error.code,'REDIRECT');
});

test('Refusals, empty responses and interrupted generations are distinguished without fabricating an answer',async()=>{
  for(const [data,code]of [[{status:'completed',output:[]},'EMPTY_RESPONSE'],[{status:'incomplete',output:[]},'OUTPUT_LIMIT'],[{status:'completed',output:[{type:'message',role:'assistant',content:[{type:'refusal',refusal:'No'}]}]},'REFUSED'],[{status:'failed',error:{message:TEST_KEY}},'SERVER']]) {
    const assistant=configured({fetchImpl:async()=>jsonResponse(data)});assert.equal((await assistant.ask({question:'P'})).error.code,code);
  }
  const assistant=configured({fetchImpl:async()=>jsonResponse({...answer(),status:'incomplete',incomplete_details:{reason:'max_output_tokens'}})}),partial=await assistant.ask({question:'P'});assert.equal(partial.success,true);assert.equal(partial.incomplete,true);assert.ok(partial.text);
});

test('Response size is bounded for content-length and streamed bodies, and credentials are redacted in prompts and outputs',async()=>{
  for(const fetchImpl of [async()=>new Response('{}',{headers:{'content-length':String(LIMITS.responseBytes+1)}}),async()=>new Response(new ReadableStream({start(controller){controller.enqueue(new Uint8Array(700000));controller.enqueue(new Uint8Array(700000));controller.close();}}))]) {
    const assistant=configured({fetchImpl});assert.equal((await assistant.ask({question:'P'})).error.code,'RESPONSE_TOO_LARGE');
  }
  let prompt;const assistant=configured({fetchImpl:async(_url,options)=>{prompt=JSON.parse(options.body).input.at(-1).content;return jsonResponse({status:'completed',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:'Tajni tekst '+TEST_KEY}]}]});}});
  const result=await assistant.ask({question:'Moj ključ je '+TEST_KEY,context:{key:TEST_KEY}});assert.equal(prompt.includes(TEST_KEY),false);assert.equal(result.text.includes(TEST_KEY),false);assert.match(result.text,/uklonjen/);
});

test('Only one call is active; cancel and timeout abort it and permit a later request',async()=>{
  let signal,calls=0;const assistant=configured({timeoutMs:1000,fetchImpl:async(_url,options)=>{calls++;signal=options.signal;if(calls>1)return jsonResponse(answer());return new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('Aborted')),{once:true}));}});
  const pending=assistant.ask({question:'P'});assert.equal(assistant.status().busy,true);assert.equal((await assistant.ask({question:'Drugo'})).error.code,'BUSY');assert.equal(assistant.saveSettings({provider:'ollama'}).error.code,'BUSY');assert.deepEqual(assistant.cancel(),{success:true,canceled:true});assert.equal(signal.aborted,true);assert.equal((await pending).error.code,'CANCELED');assert.equal(assistant.status().busy,false);assert.equal((await assistant.ask({question:'Treće'})).success,true);
  let timeoutSignal;const timed=configured({timeoutMs:15,fetchImpl:async(_url,options)=>{timeoutSignal=options.signal;return new Promise(()=>{});}});assert.equal((await timed.ask({question:'P'})).error.code,'TIMEOUT');assert.equal(timeoutSignal.aborted,true);assert.equal(timed.status().busy,false);
});
