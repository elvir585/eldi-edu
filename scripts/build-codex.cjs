'use strict';
// Windows CI bundles the official, SHA-256-pinned Codex executable. End users
// do not install npm, run a terminal, download CLI tools or provide an API key.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const {createCodexAssistant,CODEX_VERSION} = require('../desktop/codex-assistant.cjs');
const RELEASE = 'rust-v'+CODEX_VERSION;
const URL = `https://github.com/openai/codex/releases/download/${RELEASE}/codex-x86_64-pc-windows-msvc.exe`;
const SHA256 = 'a0f89acca07a511734cac7fddee26b2106fab68918717bc90df16104a0760a30';
const EXPECTED_BYTES = 332179248;

async function main(){
  if(process.platform!=='win32'||process.arch!=='x64')throw new Error('Prepare bundled Codex on Windows x64 CI.');
  const destination=path.resolve(__dirname,'../runtimes/codex');
  await fs.mkdir(destination,{recursive:true});
  const target=path.join(destination,'codex.exe'),partial=target+'.partial';
  const response=await fetch(URL,{signal:AbortSignal.timeout(180000)});
  if(!response.ok||!response.body)throw new Error('Official Codex download failed: HTTP '+response.status);
  const handle=await fs.open(partial,'w'),hash=crypto.createHash('sha256');let size=0;
  try{for await(const chunk of response.body){size+=chunk.length;if(size>EXPECTED_BYTES)throw new Error('Unexpected Codex binary size.');hash.update(chunk);await handle.write(chunk);}await handle.close();if(size!==EXPECTED_BYTES||hash.digest('hex')!==SHA256)throw new Error('Official Codex SHA-256/size verification failed.');await fs.rename(partial,target);}
  catch(error){try{await handle.close();}catch{}await fs.rm(partial,{force:true});throw error;}
  const version=execFileSync(target,['--version'],{encoding:'utf8',windowsHide:true,timeout:30000,stdio:['ignore','pipe','pipe']}).trim();
  if(!version.includes(CODEX_VERSION))throw new Error('Bundled Codex version differs from pinned version.');
  for(const filename of ['LICENSE','NOTICE']){
    const result=await fetch(`https://raw.githubusercontent.com/openai/codex/${RELEASE}/${filename}`,{signal:AbortSignal.timeout(30000)});
    if(!result.ok)throw new Error('Official Codex '+filename+' could not be included.');const bytes=Buffer.from(await result.arrayBuffer());if(bytes.length>100000)throw new Error('Unexpected license size.');await fs.writeFile(path.join(destination,filename),bytes);
  }
  // Real binary handshake and account/schema read, using a newly isolated home.
  // No sign-in, token copying, model inference or paid request is performed.
  const probeHome=path.join(destination,'build-probe-home');
  const assistant=createCodexAssistant({executablePath:target,homePath:probeHome,rpcTimeoutMs:30000,appVersion:'11.0.0'});
  try{const state=await assistant.refresh();if(state.error)throw new Error(state.error);if(state.signedIn)throw new Error('Build probe unexpectedly has a ChatGPT account.');}
  finally{assistant.dispose();await fs.rm(probeHome,{recursive:true,force:true,maxRetries:5,retryDelay:200});}
  await fs.writeFile(path.join(destination,'manifest.json'),JSON.stringify({source:'https://github.com/openai/codex',release:RELEASE,version:CODEX_VERSION,url:URL,sha256:SHA256,bytes:size,platform:'win32',arch:'x64',protocol:'app-server stdio',credentials:'isolated OS keyring',liveInferenceVerified:false},null,2)+'\n');
  console.log('Bundled official Codex '+CODEX_VERSION+': SHA-256, version and stdio handshake verified.');
}
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={main,URL,SHA256,EXPECTED_BYTES};
