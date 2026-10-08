'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { DOMImplementation, DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const api=require('../app/block-project-catalog.js');
const catalog=JSON.parse(read('content/block-projects.json'));

function harness(){
  const paint=new Proxy({},{get:()=>()=>{},set:()=>true});
  const elements={stage:{getContext:()=>paint},blockcode:{textContent:''},blocklang:{value:'js'},blockout:{textContent:''},sprite:{value:'0'},blockinput:{value:''},blocktrace:{textContent:''},blockcheck:{textContent:''}};
  const document=new DOMImplementation().createDocument(null,'html',null);document.getElementById=id=>elements[id];document.addEventListener=()=>{};document.removeEventListener=()=>{};document.body={classList:{contains:()=>true}};
  const studio=vm.createContext({console,setTimeout,clearTimeout,navigator:{},document,DOMParser,XMLSerializer});studio.window=studio;
  for(const name of ['blockly_compressed.js','blocks_compressed.js','javascript_compressed.js','python_compressed.js','bs.js'])vm.runInContext(read('renderer/vendor/'+name),studio,{filename:name});
  vm.runInContext(read('renderer/blocks.js'),studio,{filename:'blocks.js'});studio.Blockly.inject=()=>new studio.Blockly.Workspace();studio.ELDIBlocks.init({onSave(){}});
  let messages=[];const worker=vm.createContext({console,Date,self:{postMessage:message=>messages.push(message)}});worker.importScripts=file=>vm.runInContext(read('renderer/'+file),worker,{filename:file});vm.runInContext(read('renderer/block-worker.js'),worker,{filename:'block-worker.js'});
  return {blocks:studio.ELDIBlocks,run(code,input){messages=[];worker.self.onmessage({data:{code,input,sprite:0,keys:[]}});const last=messages.at(-1);return {last,result:{...last.result,actions:messages.flatMap(m=>m.actions||[])}};}};
}

test('Catalog contains 100 algorithm families and 1000 projects balanced over grades with three checks each',()=>{
  assert.equal(api.validateCatalog(catalog),catalog);assert.equal(catalog.projects.length,1000);assert.equal(catalog.families.length,100);
  assert.equal(Buffer.byteLength(JSON.stringify(catalog))<api.MAX_BYTES,true);
  const summary=api.summary(catalog);assert.deepEqual(summary.grades,{5:200,6:200,7:200,8:200,9:200});assert.equal(summary.families,100);
  const signatures=new Set();for(const p of catalog.projects){assert.equal(p.tests.length,3,p.id);assert.ok(p.statement.length>=35,p.id);assert.ok(p.hints.length>=3,p.id);assert.notDeepEqual(p.solution,p.starter,p.id);assert.equal(p.input,p.tests[0].input);assert.deepEqual(p.check,p.tests[0].check);assert.equal(signatures.has(JSON.stringify(p.solution)),false,'identical serializedsolution '+p.id);signatures.add(JSON.stringify(p.solution));}
  for(const f of catalog.families)assert.equal(catalog.projects.filter(p=>p.familyId===f.id).length,10,f.id);
  const guides=catalog.families.map(f=>catalog.projects.find(p=>p.familyId===f.id).steps.join('\n'));
  assert.equal(new Set(guides).size,100,'Every algorithm family needs its own substantial guide.');
  assert.equal(catalog.projects.some(p=>p.steps.includes('Primijeni navedeno pravilo pomoću odgovarajućih blokova.')),false,'No generic placeholder guidance.');
});

test('Search filters and pagination work, and catalog validation rejects malformed or unbounded imports',()=>{
  assert.equal(api.search(catalog,{grade:5}).total,200);assert.equal(api.search(catalog,{familyId:'nzd',limit:100}).items.length,10);assert.equal(api.search(catalog,{query:'Čajić'}).total,0);
  assert.equal(api.search(catalog,{query:'razlomaka'}).total>=40,true);assert.equal(api.get(catalog,catalog.projects[0].id).id,catalog.projects[0].id);assert.equal(api.get(catalog,'absent'),null);
  const partial={...catalog,projects:[catalog.projects[0]],families:[catalog.families[0]],title:'Vlastita zbirka'};assert.equal(api.validateCatalog(partial).title,'Vlastita zbirka');
  assert.throws(()=>api.validateCatalog({...partial,projects:[partial.projects[0],partial.projects[0]]}),/ponovljena/);
  assert.throws(()=>api.validateCatalog({...partial,version:2}),/format/);
  assert.throws(()=>api.validateCatalog({...partial,projects:[{...partial.projects[0],grade:10}]}),/Razred/);
  assert.throws(()=>api.validateCatalog({...partial,projects:[{...partial.projects[0],solution:{format:'ELDI-BLOCKS-1',workspace:{blocks:{blocks:[{type:'__proto__'}]}}}}]}),/tip/);
  assert.throws(()=>api.validateCatalog({...partial,projects:[{...partial.projects[0],check:{type:'output',expected:12}}]}),/polje/);
  assert.throws(()=>api.validateCatalog({...partial,metadata:JSON.parse('{"__proto__":{"polluted":true}}')}),/nedozvoljeno/);
  assert.throws(()=>api.validateCatalog({...partial,metadata:{count:Infinity}}),/broj/);
  assert.throws(()=>api.validateCatalog({...partial,projects:[{...partial.projects[0],familyId:'unknown'}]}),/porodica/);
  assert.throws(()=>api.validateCatalog({...partial,families:[partial.families[0],partial.families[0]]}),/ponovljena/);
  assert.throws(()=>api.validateCheck({type:'stage'}),/Prazna/);
  assert.throws(()=>api.validateCheck({type:'actions',counts:{}}),/naredbi/);
  assert.throws(()=>api.validateCheck({type:'stage',segmentLengths:[Infinity]}),/segmenti/);
  assert.throws(()=>api.validateCheck({type:'stage',shapes:[{kind:'rectangle',x:0,y:0,w:20,h:10}]}),/geometrija/);
  assert.throws(()=>api.validateCheck({type:'output',expected:'1',extraStage:{type:'stage'}}),/Prazna/);
  let deep={type:'math_number',fields:{NUM:1}};for(let i=0;i<130;i++)deep={type:'edu_print',inputs:{TEXT:{block:deep}}};assert.throws(()=>api.validateWorkspace({format:'ELDI-BLOCKS-1',workspace:{blocks:{blocks:[deep]}}},'deep'),/složen/);
});

test('All 1000 solved projects generate actual Blockly JS and pass 3000 production worker checks with variable input',()=>{
  const {blocks,run}=harness(),codeHashes=new Set();let runs=0,maxSteps=0,maxActions=0;
  try{for(const p of catalog.projects){blocks.load(p.solution);const plain=blocks.code('js'),code=blocks.code('js',true);assert.match(plain,/readNumber|readInput/,p.id+' mustreadinput');const hash=crypto.createHash('sha256').update(plain).digest('hex');assert.equal(codeHashes.has(hash),false,p.id+' mustnotmerelyrenameanidenticalprogram');codeHashes.add(hash);
    for(const sample of p.tests){const {last,result}=run(code,sample.input);assert.equal(last.type,'done',p.id+': '+JSON.stringify(last));assert.equal(result.ok,true,p.id);assert.equal(blocks.matchCheck(sample.check,result).correct,true,p.id+': expected '+JSON.stringify(sample.check)+' actual '+JSON.stringify(result));assert.equal(result.inputUsed,sample.input.split('\n').length,p.id+' mustconsumeallinput');assert.equal(blocks.matchCheck(sample.check,{...result,ok:false}).correct,false,p.id);assert.equal(blocks.matchCheck(sample.check,{...result,output:'BROKEN ANSWER'}).correct,false,p.id);maxSteps=Math.max(maxSteps,result.steps);maxActions=Math.max(maxActions,result.actions.length);runs++;}
  }}finally{blocks.destroy();}
  assert.equal(runs,3000);assert.equal(codeHashes.size,1000);assert.ok(maxSteps<2000000);assert.ok(maxActions<10000);
  console.log('Block project verification: '+JSON.stringify({projects:1000,families:100,cases:runs,uniqueGeneratedPrograms:codeHashes.size,maxSteps,maxActions}));
});
