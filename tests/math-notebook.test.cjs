'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const N=require('../app/math-notebook.js');
const M=require('../app/math-engine.js');

test('Linear notebook compares exact solution sets, including zero equations',()=>{
  const start='3x + 5 = 20';
  for(const line of ['3x = 15','x = 5','20 = 3x + 5','6x + 10 = 40','(3x+5)/2 = 10'])assert.equal(N.checkLinearStep(start,line).valid,true,line);
  for(const line of ['3x = 25','x = 15','0x = 0','0x = 1','3x + 5 = 0'])assert.equal(N.checkLinearStep(start,line).valid,false,line);
  assert.equal(N.linearEquation('0x+4=4').type,'infinite');
  assert.equal(N.linearEquation('x-x=1').type,'none');
  assert.equal(N.checkLinearStep('0x+4=4','2x=2x').valid,true);
  assert.equal(N.checkLinearStep('0x+4=5','0=2').valid,true);
  assert.equal(N.checkLinearStep('0x+4=5','x=2').valid,false);
  assert.equal(N.checkLinearStep('0x+4=4','0x+4=5').valid,false);
  assert.equal(N.linearEquation('3(x+2)/2=15').x,'8');
  assert.equal(N.linearEquation('(x/3-1/7)/2=5/11').x,'243/77');
});

test('Parser never evaluates code or discards restrictions from variable denominators',()=>{
  for(const expression of ['x*x','x^2','x^0','1/x','x/(x+1)','x/x','x/(x-x)','2**3','globalThis.process','alert(1)','x;1','x[0]','2 3','1/0','1/0x','x = 2'])assert.throws(()=>N.parseLinear(expression),undefined,expression);
  assert.throws(()=>N.parseLinear('('.repeat(55)+'x'+')'.repeat(55)),/ugniježđenih/);
  assert.throws(()=>N.parseLinear('1'.repeat(81)+'x'),/predug/);
  assert.throws(()=>N.linearEquation('x=1=2'),/jednakost/);
  assert.throws(()=>N.parseLinear('2^100'),/eksponent/);
  assert.deepEqual(Object.fromEntries(Object.entries(N.parseLinear('3x + 2(x-1) - x/2')).map(([k,v])=>[k,String(v)])),{a:'9/2',b:'-2'});
  assert.equal(N.linearEquation('0,1x + 0.2 = 0.3').x,'1');
});

test('Changing both sides of an equation by exact rational operations preserves all tested roots',()=>{
  for(let a=-5;a<=5;a++)for(let b=-3;b<=3;b++)for(let x=-4;x<=4;x++){
    if(a===0)continue;
    const c=a*x+b,original=`${a}x + ${b} = ${c}`;
    const transformed=`(${a}x + ${b}) * (-7/13) + 2/11 = ${c} * (-7/13) + 2/11`;
    const result=N.checkLinearStep(original,transformed);
    assert.equal(result.valid,true,transformed);assert.equal(result.solution.x,String(x));
  }
});

test('Final answer earns 40 points while distinct correct intermediate work earns the remaining 60',()=>{
  const task=N.generateTask(6,'linear',1);
  assert.equal(task.source,'2x + 3 = 7');
  const onlyAnswer=N.gradeSteps(task,['x=2']);
  assert.equal(onlyAnswer.answerPoints,40);assert.equal(onlyAnswer.processPoints,0);assert.equal(onlyAnswer.complete,false);
  const solved=N.gradeSteps(task,['2x=4','x=2']);
  assert.equal(solved.score,100);assert.equal(solved.complete,true);
  const repeated=N.gradeSteps(task,['2x + 3 = 7','2x + 3 = 7','x=2']);
  assert.equal(repeated.score,40);assert.match(repeated.rows[1].message,/Ponovljen/);
  const broken=N.gradeSteps(task,['2x=10','2x=4','x=2']);
  assert.equal(broken.score,40);assert.equal(broken.complete,false);assert.equal(broken.hasError,true);
  const partial=N.gradeSteps(N.generateTask(8,'linear',1),['2x+3=7']);
  assert.equal(partial.processPoints,30);assert.equal(partial.answerCorrect,false);
  assert.equal(N.gradeSteps(task,['2x=4','x=2','x=9']).answerCorrect,false);
  assert.equal(N.gradeSteps(task,['2x=4','x=2','','']).complete,true);
  const wrongMiddle=N.gradeSteps(task,['2x=4','2x=9','x=2']);
  assert.equal(wrongMiddle.complete,false);assert.equal(wrongMiddle.score,70);
});

test('Fractions and arithmetic steps retain exact values without floating point tolerance',()=>{
  const task=N.generateTask(6,'fractions',1);
  assert.equal(task.source,'2/6 + 3/9');
  const valid=N.gradeSteps(task,['6/18+6/18','2/3']);
  assert.equal(valid.complete,true);
  const wrong=N.gradeSteps(task,['(2+3)/(6+9)','2/3']);
  assert.equal(wrong.rows[0].valid,false);assert.equal(wrong.score,40);
  const almost=N.gradeSteps(task,['0.666666666666666666666666','2/3']);
  assert.equal(almost.rows[0].valid,false);
  const chain=N.gradeSteps(task,['6/18 + 6/18 = 12/18','2/3']);
  assert.equal(chain.complete,true);
  const badChain=N.gradeSteps(task,['2/6 + 3/9 = 2/3 = 3/2']);
  assert.equal(badChain.rows[0].valid,false);
  assert.throws(()=>N.gradeSteps(task,Array(41).fill('2/3')),/40/);
});

test('Euclidean steps must use the previous divisor and a remainder in range',()=>{
  const task=N.generateTask(6,'gcd',1);
  assert.deepEqual(task.solution,['24 = 1 * 18 + 6','18 = 3 * 6 + 0','NZD = 6']);
  assert.equal(N.gradeSteps(task,task.solution).complete,true);
  assert.equal(N.gradeSteps(task,['NZD = 6']).score,40);
  const outOfOrder=N.gradeSteps(task,['18 = 3 * 6 + 0','NZD = 6']);
  assert.equal(outOfOrder.score,40);assert.equal(outOfOrder.rows[0].valid,false);
  const badRemainder=N.gradeSteps(task,['24 = 0 * 18 + 24','NZD = 6']);
  assert.equal(badRemainder.rows[0].valid,false);
  const incorrectCarry=N.gradeSteps(task,['24 = 1 * 18 + 6','12 = 2 * 6 + 0','NZD = 6']);
  assert.equal(incorrectCarry.rows[1].valid,false);assert.equal(incorrectCarry.processPoints,30);assert.equal(incorrectCarry.complete,false);
  const lcm=N.generateTask(6,'lcm',1);
  assert.equal(lcm.answer,'72');assert.equal(N.gradeSteps(lcm,lcm.solution).complete,true);
  assert.equal(N.gradeSteps(lcm,['NZD = 72']).answerCorrect,false);
});

test('Required divisors all generate and check an actual division row and a decision',()=>{
  const divisors=[];
  for(let seed=1;seed<=8;seed++){
    const task=N.generateTask(6,'divisibility',seed);divisors.push(task.divisor);
    assert.equal(task.answer,task.n%task.divisor===0?'da':'ne');
    assert.equal(N.gradeSteps(task,task.solution).complete,true);
    assert.equal(N.gradeSteps(task,[task.answer]).score,40);
    assert.equal(N.gradeSteps(task,[task.solution[0],task.answer==='da'?'ne':'da']).answerCorrect,false);
  }
  assert.deepEqual(divisors,[2,4,5,6,9,10,15,25]);
});

test('Every supported grade and task family produces reproducible fully checked worked examples',()=>{
  let checked=0;
  for(const type of N.types)for(const grade of type.grades)for(let seed=1;seed<=80;seed++){
    const task=N.generateTask(grade,type.id,seed);assert.deepEqual(task,N.generateTask(grade,type.id,seed));
    const graded=N.gradeSteps(task,task.solution);assert.equal(graded.complete,true,task.id+': '+JSON.stringify(graded));assert.equal(graded.score,100,task.id);
    if(task.mode==='expression')assert.equal(M.evaluate(task.source).exact,task.answer);
    if(task.mode==='linear')assert.equal(N.linearEquation(task.source).x,task.answer);
    checked++;
  }
  assert.equal(checked,2560);
  assert.throws(()=>N.generateTask(5,'fractions',1),/dostupna/);
  assert.throws(()=>N.generateTask(6,'arithmetic',0),/varijante/);
  assert.throws(()=>N.generateTask(10,'arithmetic',1),/Razred/);
});

test('State normalizer preserves working and rejects invalid imported shapes without trusting scores',()=>{
  const original={grade:6,type:'fractions',seed:17,attempts:{'notebook-6-fractions-17':{lines:[' 5/6 ',''],notes:'Moj postupak',assisted:true,updatedAt:'2026-10-08T13:00:00Z',score:100}},geometry:{mode:'graph',slope:-1.5,intercept:2,points:[{x:1.5,y:-2}]}};
  const normal=N.normalizeState(original);assert.equal(normal.attempts['notebook-6-fractions-17'].lines[0],'5/6');assert.equal(normal.attempts['notebook-6-fractions-17'].score,undefined);assert.deepEqual(normal.geometry.points,[{x:1.5,y:-2}]);
  original.geometry.points[0].x=9;assert.equal(normal.geometry.points[0].x,1.5);
  assert.equal(N.normalizeState().grade,5);
  for(const raw of [[],{grade:10},{grade:5,type:'fractions'},{seed:10000},{attempts:[]},{attempts:{'notebook-5-fractions-1':{lines:[]}}},{attempts:{'notebook-5-arithmetic-1':{lines:['a'.repeat(701)]}}},{attempts:{'notebook-5-arithmetic-1':{lines:[],notes:'a'.repeat(4001)}}},{attempts:{'notebook-5-arithmetic-1':{lines:[],assisted:'yes'}}},{geometry:{mode:'sphere'}},{geometry:{a:Infinity}},{geometry:{points:[{x:11,y:0}]}},{geometry:{points:Array(31).fill({x:0,y:0})}}])assert.throws(()=>N.normalizeState(raw),undefined,JSON.stringify(raw));
  const bad=JSON.parse('{"attempts":{"__proto__":{"lines":[]}}}');assert.throws(()=>N.normalizeState(bad));assert.equal({}.lines,undefined);
});

test('Geometry uses selected dimensions and exact graph values, not decorative labels',()=>{
  const rectangle=N.calculateFigure('rectangle',{a:6,b:4});assert.equal(rectangle.results.find(r=>r.label==='Površina').value,24);assert.equal(rectangle.results.find(r=>r.label==='Obim').value,20);
  assert.equal(N.calculateFigure('triangle',{a:6,b:4}).results[0].value,12);
  assert.ok(Math.abs(N.calculateFigure('circle',{r:3}).results.find(r=>r.label==='Površina').value-Math.PI*9)<1e-10);
  const graph=N.calculateFigure('graph',{slope:0.5,intercept:-0.25});assert.equal(graph.points.find(p=>p.x==='1').y,'1/4');assert.match(graph.results[0].value,/y = 1\/2x - 1\/4/);
  assert.throws(()=>N.calculateFigure('rectangle',{a:-1,b:4}),/pozitivna/);
});
