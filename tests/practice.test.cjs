'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../app/practice-engine.js');
const Old=require('../app/exercise-engine.js');
const M=require('../app/math-engine.js');
const C=require('../content/math-catalog.json');
const levels=['easy','medium','hard'];
const answer=(task,key='answer')=>task.fields.find(x=>x.key===key).answer;
const rational=(task,key='answer')=>M.rational(answer(task,key));
const answers=task=>Object.fromEntries(task.fields.map(f=>[f.key,f.answer]));
const gcd=(a,b)=>{a=BigInt(a);b=BigInt(b);while(b)[a,b]=[b,a%b];return a<0n?-a:a;};

test('500 curriculum skills have 100 per grade, unique identities, worked examples and declared practice modes',()=>{
  assert.equal(E.topics.length,500);assert.equal(C.length,500);assert.equal(new Set(C.map(x=>x.id)).size,500);assert.equal(new Set(C.map(x=>x.title)).size,500);
  assert.equal(E.variantsPerTopic,200);
  for(const grade of [5,6,7,8,9])assert.equal(C.filter(x=>x.grade===grade).length,100);
  for(const t of C){assert(t.title&&t.description&&t.example);assert(t.body.length>=4);assert(t.practice.family&&t.practice.mode);assert.equal(E.topics.find(x=>x.id===t.id).variantCount,200);}
});

test('Every skill, difficulty and all 200 selectable indices generate valid checkable final answers',()=>{
  let generated=0;
  for(const t of C)for(const difficulty of levels)for(let seed=1;seed<=200;seed++){
    const task=E.generate(t.id,seed,difficulty);assert.equal(task.variant,seed);assert.equal(task.grade,t.grade);assert.equal(task.topicId,t.id);assert(task.prompt&&task.fields.length&&task.steps.length&&task.hint,`${t.id}/${difficulty}/${seed}`);
    assert(E.check(task,answers(task)).correct,`${t.id}/${difficulty}/${seed}`);
    for(const field of task.fields){assert(!/NaN|Infinity|undefined/.test(String(field.answer)));if(field.type==='number')assert(Number.isFinite(M.rational(field.answer).toNumber()));}
    generated++;
  }
  assert.equal(generated,300000);
});

test('Numeric seeds wrap deterministically and existing 95 topic identities remain compatible',()=>{
  for(const t of C){assert.deepEqual(E.generate(t.id,17,'hard'),E.generate(t.id,217,'hard'));assert.deepEqual(E.generate(t.id,'škola','medium'),E.generate(t.id,'škola','medium'));}
  for(const t of Old.topics)assert.deepEqual(E.generate(t.id,73,'hard'),Old.generate(t.id,73,'hard'));
  assert.throws(()=>E.generate('missing'),/Nepoznata/);assert.throws(()=>E.generate('m5-001',1,'bad'),/Težina/);
});

test('Grade-five outputs stay within natural-number arithmetic; subtraction does not become negative',()=>{
  for(const t of C.filter(x=>x.grade===5))for(const difficulty of levels)for(const seed of [1,19,73,129,200]){
    const task=E.generate(t.id,seed,difficulty);
    for(const f of task.fields)if(f.type==='number'){const r=M.rational(f.answer);assert.equal(r.d,1n,t.id);assert(r.n>=0n,t.id);}
  }
});

test('Carry, borrowing, digit lengths and three-term arithmetic preserve their intended goals independently',()=>{
  for(const difficulty of levels)for(const seed of [1,17,129,200]){
    for(const id of ['m5-016','m5-017','m5-018','m5-019','m5-020','m5-021','m5-022','m5-023','m5-024','m5-025','m5-026','m5-027','m5-028','m5-029','m5-030','m5-031']){
      const t=E.generate(id,seed,difficulty),parts=t.prompt.replace('Izračunaj ','').replace(/\.$/,'').split(/[+−·:]/).map(BigInt),mode=C.find(x=>x.id===id).practice.mode;
      const expected=mode==='add'?parts.reduce((a,b)=>a+b):mode==='subtract'?parts[0]-parts[1]:mode==='multiply'?parts.reduce((a,b)=>a*b):parts[0]/parts[1];assert.equal(BigInt(answer(t)),expected,id);
      if(id==='m5-019')assert.equal(parts.length,3);
      if(['m5-025','m5-026','m5-027'].includes(id))assert.equal(String(parts[1]).length,Number(id.slice(-1))-4);
      if(id==='m5-016'){const [a,b]=parts.map(x=>String(x).padStart(4,'0'));for(let j=0;j<a.length;j++)assert(Number(a[j])+Number(b[j])<10);}
      if(id==='m5-021'){const[a,b]=parts.map(x=>String(x).padStart(4,'0'));for(let j=0;j<a.length;j++)assert(Number(a[j])>=Number(b[j]));}
    }
  }
});

test('Number-theory outputs satisfy divisibility, primality and divisor counts independently',()=>{
  for(const t of C.filter(x=>x.practice.family==='divisibility'&&x.practice.mode==='test'))for(const seed of [1,73,200]){
    const task=E.generate(t.id,seed),n=BigInt(/Je li (\d+)/.exec(task.prompt)[1]),d=BigInt(t.practice.params.divisor);assert.equal(answer(task,'decision'),n%d===0n?'da':'ne');assert.equal(BigInt(answer(task,'remainder')),n%d);
  }
  for(const id of ['m6-027','m6-028'])for(const seed of [1,17,200]){
    const task=E.generate(id,seed),n=Number(/Broj (\d+)/.exec(task.prompt)[1]);let divisors=0,primes=[];
    for(let d=1;d<=n;d++)if(n%d===0){divisors++;if(d>1){let prime=true;for(let q=2;q*q<=d;q++)if(d%q===0)prime=false;if(prime)primes.push(d);}}
    assert.equal(Number(answer(task)),id==='m6-027'?primes.length:divisors);
  }
  for(const seed of [1,73,200]){const t=E.generate('m6-032',seed),m=/NZD\((\d+),(\d+)\)/.exec(t.prompt);assert.equal(gcd(m[1],m[2]),1n);}
});

test('Fraction targets, negative signs, missing numbers and remaining quantities match their descriptions',()=>{
  for(const level of levels)for(const seed of [1,19,129,200]){
    const remain=E.generate('m6-077',seed,level);assert(rational(remain).n>0n);assert(rational(remain).n<rational(remain).d);
    const same=E.generate('m6-051',seed,level);assert(same.prompt.startsWith('Uporedi'));
    const repr=E.generate('m6-039',seed,level);assert(/jednakih dijelova/.test(repr.prompt));
    const mixed=E.generate('m6-064',seed,level);assert(/\+/.test(mixed.prompt));assert(rational(mixed).n>=0n);
    for(const id of ['m7-021','m7-025'])assert(rational(E.generate(id,seed,level)).n<0n);
    assert(rational(E.generate('m7-024',seed,level)).n>0n);
    const unknown=E.generate('m6-078',seed,level),m=/x \+ ([\d/]+) = ([\d/]+)/.exec(unknown.prompt);assert(rational(unknown).add(m[1]).equals(m[2]));
  }
  assert.equal(E.generate('m6-046').fields[0].type,'text');assert.equal(E.generate('m6-054').fields[0].ordered,true);
});

test('Perimeter inverses, right triangles, circle inverses and solid inverses produce physical positive values',()=>{
  for(const level of levels)for(const seed of [1,17,200]){
    const range=E.generate('m6-084',seed,level),m=/Uz stranice (\d+) cm i (\d+) cm/.exec(range.prompt),a=Number(m[1]),b=Number(m[2]);assert.equal(Number(answer(range,'min')),Math.abs(a-b)+1);assert.equal(Number(answer(range,'max')),a+b-1);
    const endpoint=E.generate('m7-095',seed,level),match=/A\((-?\d+);(-?\d+)\), M\((-?\d+);(-?\d+)\)/.exec(endpoint.prompt),[,ax,ay,mx,my]=match.map(Number);assert.equal(Number(answer(endpoint,'x')),2*mx-ax);assert.equal(Number(answer(endpoint,'y')),2*my-ay);
    const cube=E.generate('m9-058',seed,level),volume=/zapreminu ([\d/]+) cm³/.exec(cube.prompt)[1];assert(rational(cube).pow(3).equals(volume));
    const cone=E.generate('m9-077',seed,level),cm=/poluprečnik ([\d/]+) cm i visinu ([\d/]+) cm/.exec(cone.prompt);assert(rational(cone).pow(2).equals(M.rational(cm[1]).pow(2).add(M.rational(cm[2]).pow(2))));
    for(const id of ['m8-070','m8-072','m9-059']){const task=E.generate(id,seed,level),field=task.fields[0];assert.equal(field.tolerance,0.0051);assert(/dvije decimale/.test(task.prompt));assert(E.checkField(field,Number(field.answer).toFixed(2)).correct);assert(!E.checkField(field,String(Number(field.answer)+0.02)).correct);}
  }
});

test('Scientific notation respects normalization, positive/negative exponents and coefficient arithmetic',()=>{
  for(const level of levels)for(const seed of [1,73,200]){
    const small=E.generate('m8-012',seed,level),coef=rational(small,'coefficient'),exp=Number(answer(small,'exponent'));assert(coef.toNumber()>=1&&coef.toNumber()<10);assert(exp<0);
    const product=E.generate('m8-093',seed,level),coeff=rational(product,'coefficient'),e=Number(answer(product,'exponent'));assert(coeff.toNumber()>=1&&coeff.toNumber()<10);const m=/\(([\d,]+)·10\^(\d+)\)\(([\d,]+)·10\^(\d+)\)/.exec(product.prompt);assert(coeff.mul(M.rational(10).pow(e)).equals(M.rational(m[1]).mul(m[3]).mul(M.rational(10).pow(Number(m[2])+Number(m[4])))));
    assert(rational(E.generate('m8-002',seed,level)).n>0n);assert(rational(E.generate('m8-003',seed,level)).n<0n);
  }
});

test('Systems satisfy both equations, classifications and word-model constraints',()=>{
  for(const level of levels)for(const seed of [1,17,200]){
    for(const id of ['m9-025','m9-026','m9-027']){const task=E.generate(id,seed,level),m=/sistem ([\d/]+)x\+([\d/]+)y=([^;]+); ([\d/]+)x\+([\d/]+)y=([^ .]+)\./.exec(task.prompt);assert(m,task.prompt);const[,a,b,u,d,e,v]=m,x=rational(task,'x'),y=rational(task,'y');assert(x.mul(a).add(y.mul(b)).equals(u));assert(x.mul(d).add(y.mul(e)).equals(v));}
    assert.equal(answer(E.generate('m9-028',seed,level)),'nijedno');assert.equal(answer(E.generate('m9-029',seed,level)),'beskonačno');
    const rect=E.generate('m9-034',seed,level),o=Number(/je (\d+) cm/.exec(rect.prompt)[1]);assert.equal((Number(answer(rect,'long'))+Number(answer(rect,'short')))*2,o);
  }
});

test('Statistics and probabilities use correct denominators, overlaps and selection without repetition',()=>{
  for(const level of levels)for(const seed of [1,19,200]){
    const median=E.generate('m9-083',seed,level),data=median.prompt.split(': ')[1].replace(/\.$/,'').split('; ').map(Number).sort((a,b)=>a-b);assert(rational(median).equals((data[1]+data[2])/2));
    const union=E.generate('m9-098',seed,level),m=/Među (\d+).*A ima (\d+), B ima (\d+), a A∩B ima (\d+)/.exec(union.prompt);assert(rational(union).equals(M.rational(Number(m[2])+Number(m[3])-Number(m[4])).div(m[1])));
    const counting=E.generate('m9-100',seed,level),n=Number(/Od (\d+) učenika/.exec(counting.prompt)[1]);assert.equal(Number(answer(counting)),n*(n-1));
    for(const t of C.filter(x=>x.practice.family==='probability'&&x.practice.mode!=='counting')){const x=rational(E.generate(t.id,seed,level));assert(x.n>=0n&&x.n<=x.d,t.id);}
  }
});
