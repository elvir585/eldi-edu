'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../app/program-assessment.js');
const bank=require('../desktop/program-assessment-data.cjs');
const {createGradeService}=require('../desktop/program-assessment.cjs');
const good=(stdout)=>({ok:true,phase:'run',stdout,stderr:'',durationMs:3});
test('Original task bank covers five grades with distinct problems, two public examples and eight private tests',()=>{
  assert.equal(E.tasks.length,55);assert.equal(new Set(E.tasks.map(t=>t.id)).size,55);assert.equal(new Set(E.tasks.map(t=>t.title)).size,55);
  for(const g of[5,6,7,8,9])assert.equal(E.tasks.filter(t=>t.grade===g).length,11);
  for(const t of E.tasks){assert.equal(t.sampleTests.length,2);assert.equal(t.testCount,8);assert.equal(bank[t.id].tests.length,8);assert(t.statement&&t.inputFormat&&t.outputFormat&&t.concepts.length);assert.deepEqual(t.sampleTests,bank[t.id].tests.slice(0,2));assert.equal(new Set(bank[t.id].tests.map(x=>x.input)).size,8,t.id);for(const language of E.LANGUAGES)assert(t.starters[language]);assert(bank[t.id].solutions.python&&bank[t.id].solutions.cpp);assert(!('tests'in t));assert(!('solutions'in t));}
});
test('Grade service uses private inputs and does not return hidden data, stdout or stderr',async()=>{
  const calls=[];const secret=bank['pa-zbir'].tests;const service=createGradeService({runner:{runCode:async request=>{calls.push(request);const i=calls.length-1;return{...good(secret[i].output),stderr:'hidden input: '+request.input};},cancel(){}}});
  const result=await service.run({taskId:'pa-zbir',language:'python',code:'print(0)'});assert.equal(calls.length,8);assert.equal(result.passed,8);assert.equal(result.grade,5);assert(result.completed);assert.deepEqual(calls.map(c=>c.input),secret.map(c=>c.input));
  for(const row of result.tests.slice(2)){assert.deepEqual(Object.keys(row).sort(),['durationMs','index','passed','public','status']);assert(!JSON.stringify(row).includes('hidden input'));}
  const publicBank=service.catalog();publicBank[0].sampleTests[0].input='mutated';assert.notEqual(service.catalog()[0].sampleTests[0].input,'mutated');assert(!JSON.stringify(service.catalog()).includes(secret[2].input.replace(/\n/g,'\\n')));
});
test('Hardcoded public answers fail hidden tests and produce partial score',async()=>{
  let i=0;const service=createGradeService({runner:{runCode:async()=>good(i++<2?bank['pa-zbir'].tests[i-1].output:'wrong'),cancel(){}}});
  const result=await service.run({taskId:'pa-zbir',language:'cpp',code:'int main(){}'});assert.equal(result.passed,2);assert.equal(result.percentage,25);assert.equal(result.grade,1);assert.equal(result.tests.filter(x=>x.status==='wrong-answer').length,6);
});
test('Compiler errors stop all further native executions; whitespace is ignored but output tokens remain ordered and case sensitive',async()=>{
  let count=0;const service=createGradeService({runner:{runCode:async()=>{count++;return{ok:false,phase:'compile',stderr:'syntax error',stdout:''};},cancel(){}}});
  const result=await service.run({taskId:'pa-zbir',language:'cpp',code:'broken'});assert.equal(count,1);assert.equal(result.tests[0].status,'compile-error');assert.equal(result.tests[1].status,'not-run');assert.equal(result.passed,0);assert(result.completed);
  assert(E.compareOutput(' 1\r\n 2\t3\n','1 2 3'));assert(!E.compareOutput('3 2 1','1 2 3'));assert(!E.compareOutput('da','DA'));assert(E.compareOutput('','\n'));
});
test('Timeout, runtime error and output cap are classified without leaking hidden diagnostics',async()=>{
  let i=0;const service=createGradeService({runner:{runCode:async()=>{i++;return i===3?{ok:false,phase:'run',timedOut:true,stdout:'secret',stderr:'secret'}:i===4?{ok:false,phase:'run',truncated:true,stdout:'secret'}:i===5?{ok:false,phase:'run',stdout:'secret',stderr:'secret'}:good(bank['pa-zbir'].tests[i-1].output);},cancel(){}}});
  const r=await service.run({taskId:'pa-zbir',language:'python',code:'print(1)'});assert.equal(r.tests[2].status,'timeout');assert.equal(r.tests[3].status,'output-limit');assert.equal(r.tests[4].status,'runtime-error');assert.equal(r.passed,5);assert(!JSON.stringify(r).includes('secret'));
});
test('Cancel interrupts sequential grading, prevents overlapping submissions and does not record a result',async()=>{
  let resolve,stops=0;const service=createGradeService({runner:{runCode:()=>new Promise(r=>{resolve=r;}),cancel(){stops++;resolve({ok:false,cancelled:true,stdout:''});}}});
  const pending=service.run({taskId:'pa-zbir',language:'python',code:'pass'});assert(service.busy);await assert.rejects(()=>service.run({taskId:'pa-zbir',language:'python',code:'pass'}),/toku/);assert(service.cancel().cancelled);const result=await pending;assert(result.cancelled);assert(!result.completed);assert.equal(stops,1);assert(!service.busy);assert.equal(service.cancel().cancelled,false);const s=E.normalizeState();assert.equal(E.record(s,result,false),null);assert.equal(s.attempts.length,0);
});
test('Service validates requests before native execution and serves solutions only for supported reference languages',async()=>{
  let calls=0;const s=createGradeService({runner:{runCode:async()=>{calls++;return good('0');},cancel(){}}});
  for(const request of[null,{}, {taskId:'unknown',language:'python',code:'pass'}, {taskId:'pa-zbir',language:'shell',code:'x'},{taskId:'pa-zbir',language:'python',code:''}])await assert.rejects(()=>s.run(request));
  assert.equal(calls,0);assert.throws(()=>s.solution({taskId:'pa-zbir',language:'java'}));assert.equal(s.solution({taskId:'pa-zbir',language:'cpp'}).code,bank['pa-zbir'].solutions.cpp);
});
test('Programming profile normalization bounds drafts and recomputes scores; assistance changes independent progress',()=>{
  const state=E.normalizeState({drafts:{'pa-zbir:python':'print(0)'},assisted:{'pa-zbir':true},attempts:[]});
  E.record(state,{taskId:'pa-zbir',language:'python',passed:8,total:8,completed:true,percentage:1,grade:1},true);assert.equal(state.attempts[0].grade,5);assert.equal(state.attempts[0].percentage,100);assert.deepEqual(E.progress(state),{attempts:1,completed:1,independent:0});
  E.record(state,{taskId:'pa-zbir',language:'cpp',passed:8,total:8,completed:true},false);assert.equal(E.progress(state).independent,1);
  for(const bad of[{drafts:{'missing:python':'pass'}},{drafts:{'pa-zbir:sh':'echo'}},{drafts:{'pa-zbir:python':'č'.repeat(E.MAX_SOURCE)}},{assisted:{'pa-zbir':'yes'}},{attempts:[{taskId:'pa-zbir',language:'python',passed:9,total:8,assisted:false,date:new Date().toISOString()}]},{attempts:[{taskId:'pa-zbir',language:'python',passed:8,total:8,assisted:false,date:'bad'}]}])assert.throws(()=>E.normalizeState(bad));
});
test('Study ZIP contains all statements, four language starters and verified-language solutions without hidden test data',()=>{
  const fs=require('node:fs'),path=require('node:path');const report=require('../scripts/build-assessment-pack.cjs')();const files=require('../desktop/learning-packs.cjs').readZip(fs.readFileSync(path.resolve(__dirname,'..','content','packs',report.filename))).files;
  assert.equal(report.tasks,55);assert.equal(report.files,608);const manifest=JSON.parse(files.get('manifest.json').toString('utf8'));assert.equal(manifest.hiddenTestsIncluded,false);assert.equal(manifest.tasks.length,55);
  for(const t of E.tasks){const folder=`${t.grade}-razred/${t.id}`;assert(files.has(`${folder}/rjesenja/main.py`));assert(files.has(`${folder}/rjesenja/main.cpp`));assert(files.has(`${folder}/nacrti/Main.java`));assert(![...files.keys()].some(x=>x.includes('hidden')||x.includes('skriven')));}
});
