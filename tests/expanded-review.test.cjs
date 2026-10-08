'use strict';
// Independent collection review: answers are recalculated from displayed
// operands rather than trusting the generator's own answer or worked steps.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const E=require('../app/exercise-engine.js');
const P=require('../content/math-projects.js');

function blockReview(){
  const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
  const context=vm.createContext({console,setTimeout,clearTimeout,navigator:{}});context.window=context;
  for(const file of ['blockly_compressed.js','blocks_compressed.js','javascript_compressed.js','python_compressed.js','bs.js'])vm.runInContext(read('renderer/vendor/'+file),context,{filename:file});
  vm.runInContext(read('renderer/blocks.js'),context,{filename:'blocks.js'});
  vm.runInContext(read('content/block-challenges.js'),context,{filename:'block-challenges.js'});
  return {blocks:context.ELDIBlocks,challenges:context.ELDI_BLOCK_CHALLENGES,execute(code,input=''){
    const messages=[],worker=vm.createContext({console,Date,self:{postMessage:message=>messages.push(message)}});
    worker.importScripts=file=>vm.runInContext(read('renderer/'+file),worker,{filename:file});
    vm.runInContext(read('renderer/block-worker.js'),worker,{filename:'block-worker.js'});
    worker.self.onmessage({data:{code,input,sprite:0}});
    const last=messages.at(-1);assert.equal(last.type,'done',JSON.stringify(last));
    return {...last.result,actions:messages.flatMap(message=>message.actions||[])};
  }};
}

function gcd(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b){const r=a%b;a=b;b=r;}return a;}
class Q{
  constructor(n,d=1n){n=BigInt(n);d=BigInt(d);if(!d)throw Error('zero denominator');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);this.n=n/g;this.d=d/g;}
  static from(text){text=String(text).replace(',','.');if(text.includes('/')){const[a,b]=text.split('/');return new Q(a,b);}const neg=text.startsWith('-');if(neg)text=text.slice(1);const[a,b='']=text.split('.');return new Q(BigInt((a||'0')+b)*(neg?-1n:1n),10n**BigInt(b.length));}
  add(q){return new Q(this.n*q.d+q.n*this.d,this.d*q.d);}
  sub(q){return new Q(this.n*q.d-q.n*this.d,this.d*q.d);}
  mul(q){return new Q(this.n*q.n,this.d*q.d);}
  div(q){return new Q(this.n*q.d,this.d*q.n);}
  string(){return this.d===1n?String(this.n):`${this.n}/${this.d}`;}
}
function answer(task,key=task.fields[0].key){return task.fields.find(f=>f.key===key).answer;}
function equalAnswer(task,value,key){assert.equal(Q.from(answer(task,key)).string(),Q.from(value).string(),`${task.id}: ${task.prompt}`);}
const levels=['easy','medium','hard'];
const stringifyField=f=>Array.isArray(f.answer)?f.answer.length?f.answer.join(' '):'nema':String(f.answer);

test('Every collection topic has genuine medium-level variation and valid reachable answers',()=>{
  assert.ok(E.topics.length>=70);
  assert.equal(new Set(E.topics.map(t=>t.id)).size,E.topics.length);
  for(const grade of [5,6,7,8,9])assert.ok(E.topics.some(t=>t.grade===grade));
  for(const topic of E.topics){
    const prompts=new Set(),ids=new Set();
    for(let seed=1;seed<=E.variantsPerTopic;seed++){
      const task=E.generate(topic.id,seed,'medium');
      prompts.add(task.prompt);ids.add(task.id);
      assert.equal(task.grade,topic.grade);assert.ok(task.fields.length&&task.steps.length&&task.hint);
      assert.equal(new Set(task.fields.map(f=>f.key)).size,task.fields.length);
      const answers=Object.fromEntries(task.fields.map(f=>[f.key,stringifyField(f)]));
      assert.equal(E.check(task,answers).correct,true,task.id);
      assert.equal(E.check(task,{}).correct,false,`${task.id} accepted blank answers`);
    }
    assert.equal(prompts.size,E.variantsPerTopic,`${topic.id} repeats displayed problems`);
    assert.equal(ids.size,E.variantsPerTopic);
    assert.notEqual(E.generate(topic.id,1,'easy').id,E.generate(topic.id,1,'hard').id);
  }
});

test('Large arithmetic and decimal operations agree with independent exact rational arithmetic',()=>{
  for(const difficulty of levels)for(const seed of [1,2,17,89,200]){
    for(const id of ['natural-add','natural-subtract','natural-multiply','natural-divide','decimal-add','decimal-subtract','decimal-multiply','decimal-divide']){
      const task=E.generate(id,seed,difficulty);
      const m=task.prompt.match(/^([\d,.]+)\s*([+−·:])\s*([\d,.]+) = \?$/);assert.ok(m,task.prompt);
      const a=Q.from(m[1]),b=Q.from(m[3]);
      const value={'+':()=>a.add(b),'−':()=>a.sub(b),'·':()=>a.mul(b),':':()=>a.div(b)}[m[2]]();
      equalAnswer(task,value.string());
    }
    const addition=E.generate('natural-add',seed,'hard');
    assert.ok(BigInt(addition.prompt.match(/^\d+/)[0])>BigInt(Number.MAX_SAFE_INTEGER));
    assert.equal(E.checkField(addition.fields[0],Q.from(answer(addition)).add(new Q(1)).string()).correct,false);
  }
});

test('Fraction operations, including double fractions, use the displayed operands correctly',()=>{
  for(const difficulty of levels)for(const seed of [1,2,17,89,200]){
    for(const id of ['fraction-add','fraction-subtract','fraction-multiply','fraction-divide']){
      const task=E.generate(id,seed,difficulty);
      const m=task.prompt.match(/^(\d+\/\d+)\s*([+−·:])\s*(\d+\/\d+) = \?$/);assert.ok(m,task.prompt);
      const a=Q.from(m[1]),b=Q.from(m[3]);const value={'+':()=>a.add(b),'−':()=>a.sub(b),'·':()=>a.mul(b),':':()=>a.div(b)}[m[2]]();
      equalAnswer(task,value.string());
      assert.equal(E.checkField(task.fields[0],`${value.n*2n}/${value.d*2n}`).correct,true);
      assert.equal(E.checkField(task.fields[0],value.add(new Q(1)).string()).correct,false);
    }
    const task=E.generate('fraction-complex',seed,difficulty),m=task.prompt.match(/\((\d+\/\d+) \+ 1\/3\) \/ \((\d+\/\d+)\)/);assert.ok(m,task.prompt);
    equalAnswer(task,Q.from(m[1]).add(new Q(1,3)).div(Q.from(m[2])).string());
  }
});

test('NZD, NZS, divisibility and prime classification agree with integer definitions',()=>{
  const prime=n=>{if(n<2n)return false;for(let p=2n;p*p<=n;p++)if(n%p===0n)return false;return true;};
  for(const difficulty of levels)for(const seed of [1,2,17,89,200]){
    for(const id of ['gcd','lcm']){const task=E.generate(id,seed,difficulty),[,a,b]=task.prompt.match(/\((\d+), (\d+)\)/),A=BigInt(a),B=BigInt(b),G=gcd(A,B);equalAnswer(task,id==='gcd'?G:(A/G)*B);}
    for(const divisor of [2,4,5,6,9,10,15,25]){const task=E.generate('divisibility-'+divisor,seed,difficulty),n=BigInt(task.prompt.match(/je (\d+) djeljiv/)[1]),r=n%BigInt(divisor);equalAnswer(task,r,'remainder');assert.equal(answer(task,'decision'),r===0n?'da':'ne');}
    const task=E.generate('prime-classification',seed,difficulty),n=BigInt(task.prompt.match(/broj (\d+)/)[1]);
    assert.equal(answer(task),n===1n?'ni prost ni složen':prime(n)?'prost':'složen');
  }
});

test('Numeric grading accepts decimal comma, keeps exactness and rejects incomplete multisets',()=>{
  assert.equal(E.checkField({type:'number',answer:'8.4'},'8,4').correct,true);
  assert.equal(E.checkField({type:'number',answer:'1/3'},'2/6').correct,true);
  assert.equal(E.checkField({type:'number',answer:'9007199254740993'},'9007199254740992').correct,false);
  assert.equal(E.checkField({type:'number',answer:'3.14159',tolerance:0.0051},'3.14').correct,true);
  assert.equal(E.checkField({type:'number',answer:'300000',tolerance:0.0051},'300001').correct,false);
  assert.equal(E.checkField({type:'list',answer:['2','2','3']},'3; 2; 2').correct,true);
  assert.equal(E.checkField({type:'list',answer:['2','2','3']},'2 3').correct,false);
  assert.equal(E.checkField({type:'list',answer:['2','2','3']},'2 3 3').correct,false);
  assert.equal(E.checkField({type:'list',answer:[]},'nema').correct,true);
  assert.equal(E.checkField({type:'list',answer:[]},'').correct,false);
  assert.equal(E.checkField({type:'text',answer:'složen'},'SLOZEN').correct,true);
});

test('Projects keep all requested answer fields and validate a completed multi-step response',()=>{
  assert.equal(new Set(P.map(t=>t.id)).size,P.length);
  for(const task of P){
    assert.ok(task.prompt.length>80&&task.steps.length>=3&&task.fields.length>=2,task.id);
    const answers=Object.fromEntries(task.fields.map(f=>[f.key,stringifyField(f)]));
    assert.equal(E.check(task,answers).correct,true,task.id);
    assert.equal(E.check(task,{}).correct,false,task.id);
    for(const field of task.fields){
      const missing={...answers};delete missing[field.key];assert.equal(E.check(task,missing).correct,false,`${task.id}/${field.key}`);
    }
  }
});

test('Selected practical projects use the independently recalculated quantities',()=>{
  const byId=id=>{const p=P.find(t=>t.id===id);assert.ok(p,id);return p;};
  const expect=(id,values)=>{const p=byId(id);for(const[key,value]of Object.entries(values))equalAnswer(p,value,key);};
  expect('project-5-biblioteka',{pocetno:14*32,nabavka:14*32+175,konacno:14*32+175-129-3*80});
  expect('project-5-budzet',{uredjaji:18*27500,trosak:18*27500+85600,ostatak:1500000-(18*27500+85600)});
  expect('project-5-autobusi',{autobusi:Math.ceil(287/48),prazna:Math.ceil(287/48)*48-287,najam:Math.ceil(287/48)*650});
  expect('project-5-stampanje',{listovi:3850*24/2,pakovanja:Math.ceil(3850*24/2/500),visak:Math.ceil(3850*24/2/500)*500-3850*24/2});
  expect('project-6-kompleti',{kompleti:42,crvene:84/42,plave:126/42,bijele:210/42});
  const total=new Q(3,4).add(new Q(2,3));expect('project-6-napitak',{ukupno:total.string(),case:8,ostatak:total.sub(new Q(8,6)).string()});
  const glaze=new Q(3,4).add(new Q(1,6));expect('project-6-glazura',{masa:glaze.string(),kolicnik:glaze.div(new Q(5,8)).string(),kolaci:1,ostatak:glaze.sub(new Q(5,8)).string()});
});

test('Reduction and inequality tasks assess the requested mathematical form',()=>{
  for(const difficulty of levels)for(const seed of [1,17,89,200]){
    const reduced=E.generate('fraction-reduce',seed,difficulty),original=reduced.prompt.match(/razlomak (\d+\/\d+)/)[1];
    assert.equal(E.checkField(reduced.fields[0],original).correct,false,reduced.id);
    assert.equal(E.checkField(reduced.fields[0],answer(reduced)).correct,true);
    const arithmetic=E.generate('natural-add',seed,difficulty);
    assert.equal(E.checkField(arithmetic.fields[0],arithmetic.prompt.replace(/ = \?$/,'')).correct,false);
    const subtraction=E.generate('fraction-subtract',seed,difficulty);
    assert.ok(Q.from(answer(subtraction)).n>=0n,subtraction.id);
  }
  const field={type:'text',answer:'x ≤ -3'};
  assert.equal(E.checkField(field,'x <= -6/2').correct,true);
  assert.equal(E.checkField(field,'-3 >= x').correct,true);
  assert.equal(E.checkField(field,'x >= -3').correct,false);
});

test('Generated systems satisfy both displayed equations and classify determinant-zero cases correctly',()=>{
  for(const difficulty of levels)for(const seed of [1,2,3,17,89,200]){
    const unique=E.generate('g9-sistemi-jedinstveni',seed,difficulty);
    const equations=Array.from(unique.prompt.matchAll(/(\d+)x ([+−]) (\d+)y = ([+-]?\d+(?:\/\d+)?)/g));
    assert.equal(equations.length,2,unique.prompt);
    const x=Q.from(answer(unique,'x')),y=Q.from(answer(unique,'y'));
    for(const[,a,sign,b,rhs]of equations){const left=new Q(a).mul(x).add(new Q(BigInt(b)*(sign==='−'?-1n:1n)).mul(y));assert.equal(left.string(),Q.from(rhs).string(),unique.id);}
    const classified=E.generate('g9-sistemi-klasifikacija',seed,difficulty);
    const rows=Array.from(classified.prompt.matchAll(/(\d+)x ([+−]) (\d+)y = ([+-]?\d+(?:\/\d+)?)/g));assert.equal(rows.length,2,classified.prompt);
    const [a,b,u]=[BigInt(rows[0][1]),BigInt(rows[0][3]),BigInt(rows[0][4])],[d,e,v]=[BigInt(rows[1][1]),BigInt(rows[1][3]),BigInt(rows[1][4])];
    const determinant=a*e-b*d,expected=determinant!==0n?'jedno':a*v===d*u&&b*v===e*u?'beskonačno':'nijedno';
    assert.equal(answer(classified),expected,classified.id);
  }
});

test('Solid geometry uses consistent dimensions, cubic units and rounded calculator π',()=>{
  for(const difficulty of levels)for(const seed of [1,17,89,200]){
    const cube=E.generate('g9-kocka',seed,difficulty),edge=Q.from(cube.prompt.match(/a = ([\d/]+) cm/)[1]);
    equalAnswer(cube,edge.mul(edge).mul(new Q(6)).string(),'p');equalAnswer(cube,edge.mul(edge).mul(edge).string(),'v');
    const pyramid=E.generate('g9-piramida',seed,difficulty),a=Q.from(pyramid.prompt.match(/a = ([\d/]+) cm/)[1]),h=Q.from(pyramid.prompt.match(/h = ([\d/]+) cm/)[1]),s=Q.from(pyramid.prompt.match(/s = ([\d/]+) cm/)[1]);
    assert.equal(s.mul(s).string(),h.mul(h).add(a.div(new Q(2)).mul(a.div(new Q(2)))).string(),pyramid.id);
    equalAnswer(pyramid,a.mul(a).add(a.mul(s).mul(new Q(2))).string(),'p');equalAnswer(pyramid,a.mul(a).mul(h).div(new Q(3)).string(),'v');
    const sphere=E.generate('g9-lopta',seed,difficulty),q=Q.from(sphere.prompt.match(/r = ([\d/]+) cm/)[1]),r=Number(q.n)/Number(q.d);
    const values={p:4*Math.PI*r*r,v:4*Math.PI*r*r*r/3};
    for(const[key,value]of Object.entries(values)){
      assert.ok(Math.abs(Number(answer(sphere,key))-value)<1e-7,sphere.id);
      assert.equal(E.checkField(sphere.fields.find(f=>f.key===key),value.toFixed(2)).correct,true,sphere.id);
      assert.equal(E.checkField(sphere.fields.find(f=>f.key===key),(value+0.02).toFixed(2)).correct,false,sphere.id);
    }
    const angles=E.generate('g9-diedar',seed,difficulty),alpha=Q.from(answer(angles,'alpha')),beta=Q.from(answer(angles,'beta'));
    assert.equal(alpha.add(beta).string(),'180');assert.ok(alpha.n>0n&&beta.n>0n);
  }
});

test('Final projects cover every grade and preserve positional list answers',()=>{
  assert.ok(P.length>=40);
  for(const grade of [5,6,7,8,9])assert.ok(P.filter(t=>t.grade===grade).length>=8);
  for(const task of P)for(const field of task.fields.filter(f=>f.type==='list'&&f.ordered)){
    const expected=String(field.answer).split(/\s+/),reverse=[...expected].reverse().join(' ');
    assert.equal(E.checkField(field,expected.join(' ')).correct,true,task.id);
    if(reverse!==expected.join(' '))assert.equal(E.checkField(field,reverse).correct,false,task.id);
  }
});

test('Remaining applied projects independently verify percentages, linear models, units and solids',()=>{
  const expect=(id,values)=>{const p=P.find(t=>t.id===id);assert.ok(p,id);for(const[key,value]of Object.entries(values))equalAnswer(p,value,key);};
  expect('project-7-dvostruka-promjena',{poskupljenje:480*1125/1000,popust:540*8/10,procenat:(480-432)*100/480});
  expect('project-7-odjeljenje',{prije:18*100/30,poslije:18*100/36,odsutni:9*100/36});
  expect('project-7-radnici',{radniksati:6*4*8,dani:(6*4*8)/(8*6),isplata:8*4*55});
  expect('project-7-raspodjela',{prvi:360*5/20,drugi:360*7/20,treci:360*8/20});
  expect('project-7-taksi',{put:5,racun:4+18*5/10,razlika:(4+18*20/10)-(7+12*20/10)});
  expect('project-7-transverzala',{x:(180-20)/8,alfa:3*20+10,beta:5*20+10,komplement:90-(3*20+10)});
  expect('project-7-statistika',{sredina:(6+8+6+9+11+6+10)/7,medijana:8,mod:6,nova:68/8});
  expect('project-7-kuglice',{prije:new Q(4,10).string(),poslije:new Q(9,15).string(),plave:9*2-15});
  expect('project-8-dijagonalni-put',{dijagonala:Math.hypot(9,12),rub:9+12,usteda:9+12-Math.hypot(9,12)});
  expect('project-8-ukrute',{dijagonala:13,komad:new Q(13).mul(new Q(6,5)).string(),ukupno:new Q(13).mul(new Q(6,5)).mul(new Q(4)).string()});
  expect('project-8-prosirenje-bazena',{x:(68-8)/6,povrsina:14*12,obim:2*(14+12)});
  expect('project-8-memorija',{lokacije:2**12,kib:2**12*16/1024,vrijeme:2**12*16/4096});
  expect('project-8-slicni-trouglovi',{kateta:8*9/6,hipotenuza:Math.hypot(6,8)*9/6,povrsina:9*12/2});
  expect('project-8-vektorski-put',{x:-3+5-1,y:2-4+5});
  expect('project-8-kopirnica',{plakati:Math.floor((60-14)/0.75),cijena:new Q(14).add(new Q(3,4).mul(new Q(61))).string(),ostatak:new Q(60).sub(new Q(14).add(new Q(3,4).mul(new Q(61)))).string()});
  expect('project-8-pravougaonik-u-trouglu',{visina:Math.sqrt(13**2-5**2),sirina:10*(12-6)/12,povrsina:10*(12-6)/12*6});
  expect('project-9-ulaznice',{odrasli:(770-85*7)/(12-7),djeca:85-35,prihod:35*12});
  expect('project-9-energetske-tarife',{potrosnja:100,racun:6+12,razlika:2+24-(6+18)});
  expect('project-9-rezervoari',{k:-18,n:240,jednako:(240-60)/(18+12),kolicina:240-18*6,prazan:new Q(240,18).string()});
  expect('project-9-kutije',{litri:30*20*15/1000,broj:90/30*60/20*45/15,karton:new Q(2*(30*20+30*15+20*15)*27,10000).string()});
  expect('project-9-cisterna',{kapacitet:942,zaliha:new Q(942).mul(new Q(3,4)).string(),dani:15});
  expect('project-9-kupasti-sator',{izvodnica:Math.hypot(3,4),platno:new Q(314,100).mul(new Q(3*5)).mul(new Q(11,10)).string(),zapremina:new Q(314,100).mul(new Q(3*3*4)).div(new Q(3)).string()});
  expect('project-9-piramida',{apotema:Math.hypot(4,3),povrsina:6*6+4*6*5/2,zapremina:6*6*4/3,masa:new Q(4,5).mul(new Q(48)).string()});
  expect('project-9-lopte',{zapremina:1570,litri:new Q(1570,1000).string(),povrsina:3*314,premaz:new Q(3*314,200).string()});
  expect('project-9-krov-diedar',{diedar:90,zapremina:8*4/2*10});
  for(const[id,key,value]of [['project-8-vektorski-put','udaljenost',Math.sqrt(17)],['project-9-krov-diedar','krak',Math.hypot(4,4)],['project-9-krov-diedar','povrsina',2*10*Math.hypot(4,4)]]){
    const task=P.find(t=>t.id===id),field=task.fields.find(f=>f.key===key);
    assert.equal(E.checkField(field,value.toFixed(3)).correct,true,`${id}/${key}`);
    assert.equal(E.checkField(field,(value+0.002).toFixed(3)).correct,false,`${id}/${key}`);
  }
});

test('Drawing checks independently verify real segment lengths and directions instead of only endpoints',()=>{
  const {blocks,challenges,execute}=blockReview();
  const cases=[
    ['blocks-5-kvadrat','for(var i=0;i<4;i++){move(80);turn(90);}'],
    ['blocks-5-pravougaonik','for(var i=0;i<2;i++){move(120);turn(90);move(60);turn(90);}'],
    ['blocks-5-trougao','for(var i=0;i<3;i++){move(80);turn(120);}'],
    ['blocks-5-olovka','pen(0);move(80);pen(1);turn(90);move(40);'],
    ['blocks-5-stepenice','for(var i=0;i<4;i++){move(30);turn(-90);move(20);turn(90);}'],
    ['blocks-6-sestougao','for(var i=0;i<6;i++){move(50);turn(60);}'],
    ['blocks-7-spirala','var korak=40;for(var i=0;i<6;i++){move(korak);turn(90);korak+=10;}']
  ];
  for(const[id,code]of cases){
    const challenge=challenges.find(c=>c.id===id);assert.ok(challenge,id);
    assert.ok(challenge.check.segmentLengths?.length,id+' needs explicit lengths');
    assert.ok(challenge.check.segmentAngles?.length,id+' needs explicit directions');
    const actual=execute(code);assert.equal(blocks.matchCheck(challenge.check,actual).correct,true,id);
    const wrong=structuredClone(actual);wrong.stage.trail.find(line=>line.kind==='line').x2+=5;
    assert.equal(blocks.matchCheck(challenge.check,wrong).correct,false,id+' altered segment');
  }
  const degenerate=execute('for(var i=0;i<4;i++){move(0);turn(90);}');
  for(const id of ['blocks-5-kvadrat','blocks-5-pravougaonik'])assert.equal(blocks.matchCheck(challenges.find(c=>c.id===id).check,degenerate).correct,false,id);
  const square=execute(cases[0][1]);
  assert.equal(blocks.matchCheck(challenges.find(c=>c.id==='blocks-5-pravougaonik').check,square).correct,false,'A square cannot satisfy the requested 120×60 rectangle.');
  const sum=challenges.find(c=>c.id==='blocks-5-zbir');
  assert.equal(blocks.matchCheck(sum.check,execute('printOutput(500);',sum.input)).correct,false,'Unconsumed input must not pass.');
  assert.equal(blocks.matchCheck(sum.check,execute('var a=readNumber("A"),b=readNumber("B");printOutput(a+b);',sum.input)).correct,true);
});
