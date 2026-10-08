'use strict';
const catalog=require('../content/program-assessments.js');
const bank=require('./program-assessment-data.cjs');
const {validateRequest}=require('./runner.cjs');
const {compareOutput,grade}=require('../app/program-assessment.js');
const MAX_CASES=8;
function createGradeService({runner,maxDurationMs=90000}={}){
  if(!runner||typeof runner.runCode!=='function'||typeof runner.cancel!=='function')throw Error('Nedostaje lokalni izvršivač.');
  let busy=false,cancelled=false;
  function task(request){if(!request||typeof request!=='object'||Array.isArray(request)||typeof request.taskId!=='string')throw Error('Odaberi programerski zadatak.');const found=catalog.find(t=>t.id===request.taskId);if(!found)throw Error('Nepoznat programerski zadatak.');return found;}
  function getCatalog(){return JSON.parse(JSON.stringify(catalog));}
  function solution(request){const found=task(request);if(!['python','cpp'].includes(request.language))throw Error('Referentna rješenja su dostupna za Python i C++. Nacrti su dostupni za sva četiri jezika.');return{taskId:found.id,language:request.language,code:bank[found.id].solutions[request.language],concepts:found.concepts.slice()};}
  function cancel(){if(!busy)return{cancelled:false};cancelled=true;runner.cancel();return{cancelled:true};}
  async function run(request){
    const found=task(request);const validated=validateRequest({language:request.language,code:request.code,input:''});
    if(busy)throw Error('Provjera drugog programa je u toku.');
    const cases=bank[found.id].tests;if(!Array.isArray(cases)||cases.length>MAX_CASES||cases.length!==found.testCount)throw Error('Neispravni testovi zadatka.');
    busy=true;cancelled=false;const started=Date.now(),rows=[];let passed=0,compileError=false,deadline=false;
    const timer=setTimeout(()=>{deadline=true;cancelled=true;runner.cancel();},Math.max(100,Math.min(maxDurationMs,120000)));
    try{
      for(let i=0;i<cases.length;i++){
        if(cancelled)break;
        const test=cases[i],result=await runner.runCode({...validated,input:test.input});
        if(result.cancelled||cancelled){cancelled=true;break;}
        const status=result.phase==='compile'?'compile-error':result.timedOut?'timeout':result.truncated?'output-limit':!result.ok?'runtime-error':compareOutput(result.stdout,test.output)?'passed':'wrong-answer';
        if(status==='passed')passed++;
        const row={index:i+1,public:i<found.sampleTests.length,status,passed:status==='passed',durationMs:Math.max(0,Number(result.durationMs)||0)};
        // Hidden input/output and process errors may contain the test data: only public examples reveal these fields.
        if(row.public){row.input=test.input;row.expected=test.output;row.actual=String(result.stdout||'').slice(0,8192);row.error=String(result.stderr||result.compileStderr||'').slice(0,8192);}
        rows.push(row);
        if(status==='compile-error'){compileError=true;break;}
      }
      const notRunStatus=cancelled?'cancelled':compileError?'not-run':'not-run';
      while(rows.length<cases.length)rows.push({index:rows.length+1,public:rows.length<found.sampleTests.length,status:notRunStatus,passed:false,durationMs:0});
      const percentage=passed*100/cases.length;
      return{taskId:found.id,language:validated.language,completed:!cancelled,cancelled,deadline,passed,total:cases.length,percentage,grade:grade(percentage),durationMs:Date.now()-started,tests:rows};
    }finally{clearTimeout(timer);busy=false;}
  }
  return{catalog:getCatalog,run,cancel,solution,get busy(){return busy;}};
}
module.exports={createGradeService,MAX_CASES};
