'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const P=require('../app/scratch-projects.js'),root=path.resolve(__dirname,'..'),dir=path.join(root,'renderer','vendor','scratch');
const hash=(bytes,algorithm='sha256')=>crypto.createHash(algorithm).update(bytes).digest('hex');
let count=0;const test=async(name,run)=>{await run();count++;console.log('✓ Scratch: '+name);};
async function main(){
  const manifest=JSON.parse(fs.readFileSync(path.join(dir,'SOURCE.json'),'utf8'));
  await test('službeni standalone bundle sa preciznom lokalnom relokacijom i pripadajućim izvorom',()=>{
    assert.equal(manifest.version,'15.2.0');assert.equal(manifest.sourceCommit,'5fe823510f3ae0cc7291d49bc824cc5c54fe7723');
    const bundle=fs.readFileSync(path.join(dir,'scratch-gui-standalone.js'));assert.equal(hash(bundle),manifest.bundleSha256);
    const original=fs.readFileSync(path.join(root,'scratch-editor','node_modules','@scratch','scratch-gui','dist','scratch-gui-standalone.js'),'utf8');assert.equal(hash(Buffer.from(original)),manifest.originalBundleSha256);
    assert.equal(bundle.toString('utf8'),original.replace(/\.p="\/"/g,'.p=new URL("./",document.currentScript&&document.currentScript.src||location.href).href'));assert.equal(manifest.modifications.length,1);
    assert.ok(fs.existsSync(path.join(dir,'scratch-gui-standalone.js.map')));assert.ok(fs.existsSync(path.join(dir,'scratch-gui-standalone.js.LICENSE.txt')));
  });
  await test('licence i službeni trademark sačuvani',()=>{
    assert.match(fs.readFileSync(path.join(dir,'LICENSE'),'utf8'),/GNU AFFERO GENERAL PUBLIC LICENSE/);
    assert.equal(hash(fs.readFileSync(path.join(dir,'LICENSE'))),hash(fs.readFileSync(path.join(root,'scratch-editor','LICENSE'))));
    assert.match(fs.readFileSync(path.join(dir,'TRADEMARK'),'utf8'),/Scratch Foundation/);
  });
  await test('sva 1348 offline materijala imaju provjeren MD5 i SHA-256 i lokalne bajtove',()=>{
    assert.equal(manifest.assets.length,1348);assert.equal(new Set(manifest.assets.map(x=>x.file)).size,1348);
    for(const asset of manifest.assets){const bytes=fs.readFileSync(path.join(dir,'assets',asset.file));assert.equal(bytes.length,asset.bytes);assert.equal(hash(bytes),asset.sha256);assert.equal(hash(bytes,'md5'),asset.file.split('.')[0]);const script=fs.readFileSync(path.join(dir,'asset-data',asset.file+'.js'),'utf8');const encoded=JSON.parse(script.slice(script.indexOf('=')+1).replace(/;\s*$/,''));assert.equal(hash(Buffer.from(encoded,'base64')),asset.sha256);}
  });
  await test('izvorni projekti imaju potpune i ispravno povezane blokove',()=>{
    assert.equal(P.examples.length,6);assert.equal(new Set(P.examples.map(x=>x.id)).size,6);
    for(const item of P.examples){const project=P.buildProject(item.id);assert.equal(project.targets.filter(x=>x.isStage).length,1);assert.ok(project.targets.length>=2);assert.ok(item.steps.length>=4);for(const target of project.targets){for(const [id,block] of Object.entries(target.blocks)){for(const ref of [block.next,block.parent])if(ref!==null)assert.ok(Object.hasOwn(target.blocks,ref),item.id+' '+id+' '+ref);for(const input of Object.values(block.inputs))for(const value of input.slice(1))if(typeof value==='string')assert.ok(Object.hasOwn(target.blocks,value),item.id+' '+id+' '+value);if(block.topLevel)assert.equal(block.parent,null);}}}
    assert.equal(P.buildProject('prica').targets[0].broadcasts.poruka,'Odgovori');assert.deepEqual(P.buildProject('zvijezda').extensions,['pen']);
  });
  const JSZip=require(path.join(root,'scratch-editor','node_modules','jszip'));
  await test('šest stvarnih .sb3 ZIP projekata uključuje sve kostime i zvukove',async()=>{
    for(const item of P.examples){const bytes=fs.readFileSync(path.join(dir,'examples',item.id+'.sb3'));const budget=P.validateArchive(bytes);assert.ok(budget.files>=4&&budget.expandedBytes>0&&budget.projectBytes>0);const zip=await JSZip.loadAsync(bytes,{checkCRC32:true});const project=JSON.parse(await zip.file('project.json').async('string'));assert.deepEqual(project,P.buildProject(item.id));for(const asset of P.assetsForProject(project)){assert.ok(zip.file(asset));assert.equal(hash(await zip.file(asset).async('nodebuffer'),'md5'),asset.split('.')[0]);}const script=fs.readFileSync(path.join(dir,'examples',item.id+'.js'),'utf8');const base64=JSON.parse(script.slice(script.indexOf('=')+1).replace(/;\s*$/,''));assert.equal(hash(Buffer.from(base64,'base64')),hash(bytes));}
  });
  await test('normalizacija profila ograničava veliki i neispravan sadržaj',()=>{
    const base64=fs.readFileSync(path.join(dir,'examples','kviz.sb3')).toString('base64');assert.equal(P.normalizeState({name:'Test',base64,exampleId:'kviz'}).name,'Test');assert.throws(()=>P.normalizeState({base64:'dGV4dA=='}),/neispravan/);assert.throws(()=>P.normalizeState({base64:'UEsDinvalid!'}),/neispravan/);assert.throws(()=>P.normalizeState({base64:'UEsD'+'A'.repeat(P.MAX_PROJECT_BYTES*2)}),/prevelik/);assert.equal(P.normalizeState(null),null);assert.equal(P.normalizeState(undefined),null);assert.equal(P.validDraft({base64:'bad'}),null);assert.equal(P.normalizeState({base64,exampleId:'bad',extra:'ignored'}).exampleId,null);assert.equal(P.normalizeState({base64,name:'A'.repeat(1000)}).name.length,120);
  });
  await test('ZIP budžet odbija bombe, šifriranje, simboličke veze i lažna lokalna zaglavlja',()=>{
    const original=fs.readFileSync(path.join(dir,'examples','kviz.sb3'));const end=original.length-22,central=original.readUInt32LE(end+16),next=central+46+original.readUInt16LE(central+28)+original.readUInt16LE(central+30)+original.readUInt16LE(central+32);
    const mutate=change=>{const bytes=Buffer.from(original);change(bytes);return bytes;};
    assert.throws(()=>P.validateArchive(mutate(bytes=>bytes.writeUInt32LE(P.MAX_PROJECT_JSON_BYTES+1,central+24))),/5 MB/);
    assert.throws(()=>P.validateArchive(mutate(bytes=>bytes.writeUInt32LE(P.MAX_EXPANDED_BYTES+1,next+24))),/100 MB/);
    assert.throws(()=>P.validateArchive(mutate(bytes=>{bytes.writeUInt16LE(2501,end+8);bytes.writeUInt16LE(2501,end+10);})),/previše/);
    assert.throws(()=>P.validateArchive(mutate(bytes=>bytes.writeUInt16LE(1,central+8))),/šifriran/);
    assert.throws(()=>P.validateArchive(mutate(bytes=>bytes.writeUInt32LE(0xa1ff0000,central+38))),/simboličke/);
    assert.throws(()=>P.validateArchive(mutate(bytes=>bytes.writeUInt16LE(99,central+10))),/nepodržan/);
    assert.throws(()=>P.validateArchive(mutate(bytes=>bytes.writeUInt32LE(1,18))),/neusaglašene/);
    assert.throws(()=>P.validateArchive(mutate(bytes=>bytes.writeUInt32LE(0xffffffff,central+42))),/ZIP64/);
    assert.throws(()=>P.validateArchive(Buffer.concat([original,Buffer.from('trailing')])),/direktorij/);
    assert.throws(()=>P.normalizeState({base64:mutate(bytes=>bytes.writeUInt32LE(P.MAX_EXPANDED_BYTES+1,next+24)).toString('base64')}),/neispravan/);
  });
  await test('ZIP odbija traversal, duplikate i nedostajući project.json',async()=>{
    const rootZip=new JSZip();rootZip.file('../project.json','{}',{createFolders:false});
    const traversal=await rootZip.generateAsync({type:'nodebuffer',compression:'DEFLATE'});assert.throws(()=>P.validateArchive(traversal),/korijenu/);
    const missing=new JSZip();missing.file('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.svg','<svg/>');const missingBytes=await missing.generateAsync({type:'nodebuffer'});assert.throws(()=>P.validateArchive(missingBytes),/nedostaje/);
    const duplicate=new JSZip();duplicate.file('project.json','{}');duplicate.file('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.svg','<svg/>');duplicate.file('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.svg','<svg/>');const bytes=await duplicate.generateAsync({type:'nodebuffer'});const end=bytes.length-22;let cursor=bytes.readUInt32LE(end+16);const entries=[];for(let i=0;i<3;i++){entries.push(cursor);cursor+=46+bytes.readUInt16LE(cursor+28)+bytes.readUInt16LE(cursor+30)+bytes.readUInt16LE(cursor+32);}const firstName=bytes.subarray(entries[1]+46,entries[1]+46+36);firstName.copy(bytes,entries[2]+46);assert.throws(()=>P.validateArchive(bytes),/ponovljeno/);
  });
  await test('komponenta koristi stvarni VM import/export i zatvara programe',()=>{
    const bootstrap=fs.readFileSync(path.join(root,'scratch-editor','bootstrap.js'),'utf8');assert.match(bootstrap,/vm\.loadProject\(bytes\)/);assert.match(bootstrap,/vm\.saveProjectSb3\(\)/);assert.match(bootstrap,/vm\.stopAll\(\)/);assert.match(bootstrap,/event\.source!==parent/);assert.match(bootstrap,/message\.token!==token/);assert.doesNotMatch(bootstrap,/https?:\/\//);
    const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');assert.match(html,/connect-src 'self' data: blob:/);assert.doesNotMatch(html,/https?:\/\//);
  });
  await test('native QA evaluirani programi se ispravno kompajliraju',()=>{
    const source=fs.readFileSync(path.join(root,'desktop','scratch-smoke.cjs'),'utf8'),AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
    const frames=[...source.matchAll(/await inFrame\(`([\s\S]*?)`\);/g)].map(match=>match[1]),stages=[...source.matchAll(/await stage\('[^']*',`([\s\S]*?)`\);/g)].map(match=>match[1]);assert.ok(frames.length>=4&&stages.length>=4);for(const program of [...frames,...stages])assert.doesNotThrow(()=>new AsyncFunction(program));
  });
  await test('objavljivi paket izvora sadrži tačan upstream i adapter',async()=>{
    const zip=await JSZip.loadAsync(fs.readFileSync(path.join(root,'content','packs','ELDI-EDU-11.0.0-Scratch-izvori.zip')),{checkCRC32:true});assert.ok(zip.file('upstream-scratch-editor-'+manifest.sourceCommit+'.zip'));for(const name of ['index.html','bootstrap.js','offline.css','package.json','package-lock.json','SOURCE.json','LICENSE','TRADEMARK'])assert.ok(zip.file('scratch-editor/'+name));assert.ok(zip.file('README.md'));assert.ok(zip.file('scripts/build-scratch.cjs'));assert.ok(zip.file('app/scratch-projects.js'));assert.equal(await zip.file('scratch-editor/bootstrap.js').async('string'),fs.readFileSync(path.join(root,'scratch-editor','bootstrap.js'),'utf8'));
  });
  console.log('Scratch provjere: '+count+' grupa, 6 .sb3 projekta, 1348 offline materijala.');return {groups:count,projects:6,assets:1348};
}
module.exports=main;if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
