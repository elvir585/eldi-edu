'use strict';
/* Build the separate offline Scratch component from pinned, unmodified official releases. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),source=path.join(root,'scratch-editor'),output=path.join(root,'renderer','vendor','scratch');
const VERSION='15.2.0',COMMIT='5fe823510f3ae0cc7291d49bc824cc5c54fe7723';
const md5=bytes=>crypto.createHash('md5').update(bytes).digest('hex'),sha256=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function download(url,retries=3){let last;for(let attempt=0;attempt<retries;attempt++){try{const response=await fetch(url,{signal:AbortSignal.timeout(90000)});if(!response.ok)throw new Error('HTTP '+response.status+' '+url);return Buffer.from(await response.arrayBuffer());}catch(error){last=error;}}throw last;}
function cp(dir,dest,filter){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const from=path.join(dir,entry.name),to=path.join(dest,entry.name);if(!filter(from,entry))continue;if(entry.isDirectory()){fs.mkdirSync(to,{recursive:true});cp(from,to,filter);}else{fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);}}}
async function buildScratch({install=true,sourceArchive=true}={}) {
  const modulePath=path.join(source,'node_modules','@scratch','scratch-gui');
  if(!fs.existsSync(path.join(modulePath,'package.json'))){if(!install)throw new Error('Pokreni npm ci u scratch-editor prije izgradnje.');const result=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['ci','--ignore-scripts','--no-audit','--no-fund'],{cwd:source,stdio:'inherit',shell:process.platform==='win32'});if(result.status!==0)throw new Error('Instalacija službene Scratch komponente nije uspjela.');}
  const pkg=JSON.parse(fs.readFileSync(path.join(modulePath,'package.json')));if(pkg.version!==VERSION)throw new Error('Scratch verzija nije očekivana '+VERSION+'.');
  fs.mkdirSync(output,{recursive:true});
  cp(path.join(modulePath,'dist'),output,(from,entry)=>!entry.name.startsWith('scratch-gui.js')&&entry.name!=='types');
  // The official standalone webpack build has a root-absolute publicPath. Its regular
  // GUI build uses "auto", but this standalone build does not. Relocate only that
  // runtime path for file:// deployment, preserving the unmodified original alongside it.
  const original=fs.readFileSync(path.join(output,'scratch-gui-standalone.js'),'utf8');
  const pathAssignments=(original.match(/\.p="\/"/g)||[]).length;
  if(pathAssignments!==2)throw new Error('Službeni webpack publicPath se promijenio; lokalnu relokaciju treba pregledati.');
  fs.writeFileSync(path.join(output,'scratch-gui-standalone.original.js'),original);
  fs.writeFileSync(path.join(output,'scratch-gui-standalone.js'),original.replace(/\.p="\/"/g,'.p=new URL("./",document.currentScript&&document.currentScript.src||location.href).href'));
  for(const name of ['index.html','bootstrap.js','offline.css'])fs.copyFileSync(path.join(source,name),path.join(output,name));
  fs.copyFileSync(path.join(root,'app','scratch-projects.js'),path.join(output,'scratch-projects.js'));
  for(const name of ['LICENSE','TRADEMARK'])fs.copyFileSync(path.join(modulePath,name),path.join(output,name));
  const libraries=['sprites','costumes','backdrops','sounds'].map(name=>JSON.parse(fs.readFileSync(path.join(modulePath,'dist','libraries',name+'.json'))));
  const assets=new Map();function scan(value){if(!value||typeof value!=='object')return;if(value.assetId&&value.dataFormat){const ext=value.assetId+'.'+value.dataFormat;if(/^[a-f0-9]{32}\.(svg|png|jpg|jpeg|wav|mp3)$/.test(ext))assets.set(ext,{id:value.assetId,format:value.dataFormat});}for(const item of Object.values(value))if(typeof item==='object')if(Array.isArray(item))item.forEach(scan);else scan(item);}
  libraries.forEach(scan);
  const P=require('../app/scratch-projects.js');scan(P.defaultProject());
  fs.mkdirSync(path.join(output,'assets'),{recursive:true});fs.mkdirSync(path.join(output,'asset-data'),{recursive:true});
  let completed=0;const queue=[...assets.entries()],assetRecords=[];
  await Promise.all(Array.from({length:12},async()=>{while(queue.length){const [name,asset]=queue.shift(),file=path.join(output,'assets',name);let bytes=fs.existsSync(file)?fs.readFileSync(file):null;if(!bytes||md5(bytes)!==asset.id){bytes=await download('https://assets.scratch.mit.edu/internalapi/asset/'+name+'/get/');if(md5(bytes)!==asset.id)throw new Error('Scratch materijal nema očekivani MD5: '+name);fs.writeFileSync(file,bytes);}fs.writeFileSync(path.join(output,'asset-data',name+'.js'),"window.ELDI_SCRATCH_ASSETS["+JSON.stringify(name)+"]="+JSON.stringify(bytes.toString('base64'))+";\n");assetRecords.push({file:name,bytes:bytes.length,sha256:sha256(bytes)});if(++completed%250===0)console.log('Scratch offline materijali: '+completed+'/'+assets.size);}}));
  const JSZip=require(path.join(source,'node_modules','jszip'));
  fs.mkdirSync(path.join(output,'examples'),{recursive:true});
  for(const example of P.examples){const project=P.buildProject(example.id),zip=new JSZip();zip.file('project.json',JSON.stringify(project));for(const asset of P.assetsForProject(project))zip.file(asset,fs.readFileSync(path.join(output,'assets',asset)));const bytes=await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:9}});fs.writeFileSync(path.join(output,'examples',example.id+'.sb3'),bytes);fs.writeFileSync(path.join(output,'examples',example.id+'.js'),'window.ELDI_SCRATCH_EXAMPLES['+JSON.stringify(example.id)+']='+JSON.stringify(bytes.toString('base64'))+';\n');}
  const lock=JSON.parse(fs.readFileSync(path.join(source,'package-lock.json')));
  const manifest={component:'Official Scratch editor with documented local webpack publicPath relocation',version:VERSION,sourceCommit:COMMIT,license:'AGPL-3.0-only',sourceUrl:'https://github.com/scratchfoundation/scratch-editor/tree/'+COMMIT,sourceArchive:'https://github.com/scratchfoundation/scratch-editor/archive/'+COMMIT+'.zip',npm:{package:'@scratch/scratch-gui',version:VERSION,integrity:lock.packages['node_modules/@scratch/scratch-gui'].integrity},adapterSource:'scratch-editor/bootstrap.js in elvir585/eldi-edu release source',adapterLicense:'AGPL-3.0-only',modifications:[{date:'2026-10-08',file:'scratch-gui-standalone.js',description:'Two webpack runtime publicPath assignments relocated from / to local script directory. Exact transformation is in scripts/build-scratch.cjs.'}],assetOrigin:'https://assets.scratch.mit.edu',assets:assetRecords.sort((a,b)=>a.file.localeCompare(b.file)),examples:P.examples.length,originalBundleSha256:sha256(Buffer.from(original)),bundleSha256:sha256(fs.readFileSync(path.join(output,'scratch-gui-standalone.js')))};
  fs.writeFileSync(path.join(output,'SOURCE.json'),JSON.stringify(manifest,null,2)+'\n');
  fs.writeFileSync(path.join(source,'SOURCE.json'),JSON.stringify({...manifest,assets:undefined},null,2)+'\n');
  fs.copyFileSync(path.join(modulePath,'LICENSE'),path.join(source,'LICENSE'));fs.copyFileSync(path.join(modulePath,'TRADEMARK'),path.join(source,'TRADEMARK'));
  const packDir=path.join(root,'content','packs');fs.mkdirSync(packDir,{recursive:true});const examplesZip=new JSZip();for(const example of P.examples){examplesZip.file(example.id+'/'+example.id+'.sb3',fs.readFileSync(path.join(output,'examples',example.id+'.sb3')));examplesZip.file(example.id+'/UPUTE.txt',example.title+'\n'+example.goal+'\n\n'+example.steps.map((step,index)=>(index+1)+'. '+step).join('\n')+'\n');}fs.writeFileSync(path.join(packDir,'ELDI-EDU-11.0.0-Scratch-primjeri.zip'),await examplesZip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:9}}));
  if(sourceArchive){const cache=path.join(source,'upstream-'+COMMIT+'.zip');if(!fs.existsSync(cache))fs.writeFileSync(cache,await download('https://codeload.github.com/scratchfoundation/scratch-editor/zip/'+COMMIT));const zip=new JSZip();zip.file('upstream-scratch-editor-'+COMMIT+'.zip',fs.readFileSync(cache));for(const name of ['index.html','bootstrap.js','offline.css','package.json','package-lock.json','SOURCE.json','LICENSE','TRADEMARK'])zip.file('scratch-editor/'+name,fs.readFileSync(path.join(source,name)));zip.file('scripts/build-scratch.cjs',fs.readFileSync(__filename));zip.file('app/scratch-projects.js',fs.readFileSync(path.join(root,'app','scratch-projects.js')));if(fs.existsSync(path.join(root,'docs','SCRATCH.md')))zip.file('README.md',fs.readFileSync(path.join(root,'docs','SCRATCH.md')));const name='ELDI-EDU-11.0.0-Scratch-izvori.zip';fs.writeFileSync(path.join(packDir,name),await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}}));}
  console.log('Scratch editor '+VERSION+' spreman: '+assets.size+' offline materijala, '+P.examples.length+' .sb3 primjera.');return {version:VERSION,assets:assets.size,examples:P.examples.length,output};
}
module.exports={buildScratch,VERSION,COMMIT};
if(require.main===module)buildScratch().catch(error=>{console.error(error);process.exitCode=1;});
