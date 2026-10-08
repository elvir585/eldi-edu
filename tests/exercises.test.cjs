'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../app/exercise-engine.js');
const M=require('../app/math-engine.js');
const levels=['easy','medium','hard'];
const sampleSeeds=[1,2,19,73,129,200];
const canonicalAnswers=task=>Object.fromEntries(task.fields.map(field=>[field.key,Array.isArray(field.answer)?(field.answer.length?field.answer.join(' '):'nema'):field.answer]));
const answer=(task,key='answer')=>task.fields.find(field=>field.key===key).answer;
const abs=n=>n<0n?-n:n;
const independentGcd=(a,b)=>{a=abs(BigInt(a));b=abs(BigInt(b));while(b){const t=a%b;a=b;b=t;}return a;};
function rational(n,d=1n){n=BigInt(n);d=BigInt(d);if(d<0n){n=-n;d=-d;}const g=independentGcd(n,d);return[n/g,d/g];}
const text=([n,d])=>d===1n?String(n):n+'/'+d;
const plus=(a,b)=>rational(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const minus=(a,b)=>rational(a[0]*b[1]-b[0]*a[1],a[1]*b[1]);
const times=(a,b)=>rational(a[0]*b[0],a[1]*b[1]);
const divide=(a,b)=>rational(a[0]*b[1],a[1]*b[0]);
function literal(raw){
  raw=String(raw).replace(',','.');
  if(raw.includes('/')){const[n,d]=raw.split('/');return rational(n,d);}
  const negative=raw.startsWith('-');raw=raw.replace(/^[+-]/,'');
  const [whole,fraction='']=raw.split('.');return rational((negative?-1n:1n)*BigInt((whole||'0')+fraction),10n**BigInt(fraction.length));
}
const numeric=(task,key='answer')=>M.rational(answer(task,key));
const trialPrime=n=>{if(n<2)return false;for(let p=2;p*p<=n;p++)if(n%p===0)return false;return true;};

test('Catalog has 95 substantive topics, all five grades, and 19,000 indexed variants',()=>{
  assert.equal(E.topics.length,95);
  assert.equal(E.variantsPerTopic,200);
  assert.equal(E.topics.length*E.variantsPerTopic,19000);
  assert.deepEqual([...new Set(E.topics.map(topic=>topic.grade))],[5,6,7,8,9]);
  assert.equal(new Set(E.topics.map(topic=>topic.id)).size,E.topics.length);
  for(const topic of E.topics){assert.equal(topic.variantCount,200);assert(topic.title&&topic.description);}
});

test('All 57,000 level/index combinations have valid answers and 200 distinct mathematical prompts per topic',()=>{
  for(const topic of E.topics)for(const difficulty of levels){
    const prompts=new Set();
    for(let seed=1;seed<=200;seed++){
      const task=E.generate(topic.id,seed,difficulty);
      prompts.add(task.prompt);
      assert(task.fields.length&&task.steps.length&&task.hint,topic.id);
      assert.equal(task.variant,seed);
      assert(E.check(task,canonicalAnswers(task)).correct,`${topic.id}/${difficulty}/${seed}`);
    }
    assert.equal(prompts.size,200,`${topic.id}/${difficulty}: duplicate mathematical prompt`);
  }
});

test('Seeds are deterministic, indexing wraps and levels change each topic',()=>{
  for(const topic of E.topics){
    assert.deepEqual(E.generate(topic.id,17,'hard'),E.generate(topic.id,17,'hard'));
    assert.deepEqual(E.generate(topic.id,'škola','medium'),E.generate(topic.id,'škola','medium'));
    assert.deepEqual(E.generate(topic.id,201),E.generate(topic.id,1));
    assert.notEqual(E.generate(topic.id,27,'easy').prompt,E.generate(topic.id,27,'hard').prompt,topic.id);
  }
  assert.throws(()=>E.generate('missing',1),/Nepoznata/);
  assert.throws(()=>E.generate('gcd',1,'invalid'),/Težina/);
});

test('Natural operations, including beyond Number.MAX_SAFE_INTEGER, independently satisfy arithmetic',()=>{
  for(const difficulty of levels)for(const seed of sampleSeeds){
    for(const [id,op] of [['natural-add','+'],['natural-subtract','−'],['natural-multiply','·'],['natural-divide',':']]){
      const task=E.generate(id,seed,difficulty),match=/^(\d+) [＋+−·:] (\d+) =/.exec(task.prompt);
      assert(match,task.prompt);const a=BigInt(match[1]),b=BigInt(match[2]);
      const expected=op==='+'?a+b:op==='−'?a-b:op==='·'?a*b:a/b;
      assert.equal(answer(task),String(expected));
      if(id==='natural-add'&&difficulty==='hard')assert(a>BigInt(Number.MAX_SAFE_INTEGER));
    }
    const task=E.generate('natural-remainder',seed,difficulty),match=/Podijeli (\d+) sa (\d+)/.exec(task.prompt),a=BigInt(match[1]),d=BigInt(match[2]);
    assert.equal(BigInt(answer(task,'q')),a/d);assert.equal(BigInt(answer(task,'r')),a%d);
    assert(BigInt(answer(task,'r'))>=0n&&BigInt(answer(task,'r'))<d);
  }
});

test('All required divisibility rules, NZD and NZS independently agree with integer arithmetic',()=>{
  for(const seed of sampleSeeds)for(const difficulty of levels){
    for(const d of [2,4,5,6,9,10,15,25]){
      const task=E.generate('divisibility-'+d,seed,difficulty),n=BigInt(/Da li je (\d+)/.exec(task.prompt)[1]);
      assert.equal(answer(task,'decision'),n%BigInt(d)===0n?'da':'ne');
      assert.equal(BigInt(answer(task,'remainder')),n%BigInt(d));
    }
    for(const id of ['gcd','lcm']){
      const task=E.generate(id,seed,difficulty),[,a,b]=/\((\d+), (\d+)\)/.exec(task.prompt),g=independentGcd(a,b);
      assert.equal(BigInt(answer(task)),id==='gcd'?g:BigInt(a)*BigInt(b)/g);
    }
  }
});

test('Prime classification, intervals and prime-factor multiplicities are mathematically valid',()=>{
  for(const difficulty of levels)for(let seed=1;seed<=200;seed++){
    const task=E.generate('prime-classification',seed,difficulty),n=Number(/broj (\d+)/.exec(task.prompt)[1]);
    assert.equal(answer(task,'classification'),n===1?'ni prost ni složen':trialPrime(n)?'prost':'složen');
    const interval=E.generate('prime-interval',seed,difficulty),[,lo,hi]=/od (\d+) do (\d+)/.exec(interval.prompt),expected=[];
    for(let n=Number(lo);n<=Number(hi);n++)if(trialPrime(n))expected.push(String(n));
    assert.deepEqual(answer(interval,'primes'),expected);
    const factorsTask=E.generate('prime-factors',seed,difficulty),value=BigInt(/Rastavi (\d+)/.exec(factorsTask.prompt)[1]),factors=answer(factorsTask,'factors');
    assert(factors.every(v=>trialPrime(Number(v))));
    assert.equal(factors.reduce((product,v)=>product*BigInt(v),1n),value);
  }
});

test('Fraction operations and double fractions independently match reduced rational arithmetic',()=>{
  for(const seed of sampleSeeds)for(const difficulty of levels){
    for(const [id,operation]of[['fraction-add',plus],['fraction-subtract',minus],['fraction-multiply',times],['fraction-divide',divide]]){
      const task=E.generate(id,seed,difficulty),[,a,b,p,q]=/^(\d+)\/(\d+) [＋+−·:] (\d+)\/(\d+)/.exec(task.prompt);
      assert.equal(answer(task),text(operation(rational(a,b),rational(p,q))),task.prompt);
      if(id==='fraction-subtract')assert(numeric(task).n>=0n);
    }
    const task=E.generate('fraction-complex',seed,difficulty),[,a,b,p,q]=/\((\d+)\/(\d+) \+ 1\/3\) \/ \((\d+)\/(\d+)\)/.exec(task.prompt);
    assert.equal(answer(task),text(divide(plus(rational(a,b),rational(1n,3n)),rational(p,q))));
  }
});

test('Decimals are exact, with comma notation accepted for final answers',()=>{
  for(const seed of sampleSeeds)for(const difficulty of levels){
    for(const [id,operation]of[['decimal-add',plus],['decimal-subtract',minus],['decimal-multiply',times],['decimal-divide',divide]]){
      const task=E.generate(id,seed,difficulty),[,a,b]=/^(\d+(?:,\d+)?) [＋+−·:] (\d+(?:,\d+)?)/.exec(task.prompt);
      assert.equal(answer(task),text(operation(literal(a),literal(b))),task.prompt);
    }
  }
  assert(E.checkField({type:'number',answer:'3/10'},'0,30').correct);
  assert(E.checkField({type:'number',answer:'-3/2'},'-1,5').correct);
  assert(E.checkField({type:'number',answer:'10000000000000001'},'10000000000000001').correct);
  assert(!E.checkField({type:'number',answer:'10000000000000001'},'10000000000000000').correct);
});

test('Checking requires a final answer, rejects repeated expressions and never executes code',()=>{
  const field={type:'number',answer:'5/6'};
  assert(E.checkField(field,'10/12').correct);
  for(const value of ['1/2+1/3','(5/6)','Math.random()','alert(1)','1/0','NaN','Infinity','5e-1',''])assert(!E.checkField(field,value).correct,value);
  assert(E.checkField({type:'number',answer:'-3/2'},'3/-2').correct);
  const list={type:'list',answer:['2','3']};
  assert(!E.checkField(list,'1+1, 3').correct);
});

test('Reducing a fraction requires a reduced form, while other operations accept equivalent fractions',()=>{
  for(const seed of sampleSeeds)for(const difficulty of levels){
    const task=E.generate('fraction-reduce',seed,difficulty),field=task.fields[0],original=/(\d+\/\d+)/.exec(task.prompt)[1];
    assert.equal(field.format,'reducedFraction');
    assert(E.checkField(field,field.answer).correct);
    assert(!E.checkField(field,original).correct);
    const reduced=M.rational(field.answer);
    assert(!E.checkField(field,reduced.n*2n+'/'+(reduced.d*2n)).correct);
  }
  assert(!E.checkField({type:'number',answer:'1/2',format:'reducedFraction'},'0.5').correct);
  assert(!E.checkField({type:'number',answer:'1/2',format:'reducedFraction'},'-1/-2').correct);
  assert(E.checkField({type:'number',answer:'1/2'},'2/4').correct);
});

test('Lists compare unordered numeric multisets and preserve repeated prime factors',()=>{
  const field={type:'list',answer:['2','2','3']};
  for(const value of ['3 2 2','3, 2, 2','3;2;2','[3,2,2]',['3','2','2']])assert(E.checkField(field,value).correct);
  assert(!E.checkField(field,'2 3').correct);
  assert(!E.checkField(field,'2 3 3').correct);
  assert(!E.checkField({...field,ordered:true},'3 2 2').correct);
  assert(E.checkField({type:'list',answer:[]},'nema').correct);
  assert(E.checkField({type:'list',answer:[]},[]).correct);
  assert(E.checkField({type:'list',answer:['1/2','1/4']},'0,5; 0,25').correct);
});

test('Percentage, proportion and ratio-sharing answers independently satisfy the stated conditions',()=>{
  for(const seed of sampleSeeds)for(const difficulty of levels){
    const percent=E.generate('percent-of',seed,difficulty),[,p,total]=/Koliko iznosi ([\d,]+)% od (\d+)/.exec(percent.prompt);
    assert.equal(answer(percent),text(divide(times(literal(p),rational(total)),rational(100))));
    const proportion=E.generate('proportion',seed,difficulty),[,a,b,d]=/(\d+) : (\d+) = x : (\d+)/.exec(proportion.prompt);
    assert.equal(answer(proportion,'x'),text(rational(BigInt(a)*BigInt(d),b)));
    const sharing=E.generate('ratio-sharing',seed,difficulty),[,total2,a2,b2]=/Podijeli (\d+) KM .*razmjeri (\d+):(\d+)/.exec(sharing.prompt);
    assert.equal(BigInt(answer(sharing,'first'))+BigInt(answer(sharing,'second')),BigInt(total2));
    assert.equal(BigInt(answer(sharing,'first'))*BigInt(b2),BigInt(answer(sharing,'second'))*BigInt(a2));
  }
});

test('Generated linear equations and systems satisfy substitution and consistent classifications',()=>{
  for(const seed of sampleSeeds)for(const difficulty of levels){
    const task=E.generate('linear-equation',seed,difficulty),[,a,sign,b,right]=/(\d+)x ([+−]) (\d+) = (-?\d+)/.exec(task.prompt),x=numeric(task,'x');
    assert(x.mul(a).add(sign==='−'?-Number(b):Number(b)).equals(right));
    const system=E.generate('g9-sistemi-jedinstveni',seed,difficulty),match=/sistem: (\d+)x \+ (\d+)y = ([^;]+); (\d+)x \+ (\d+)y = (.+)\./.exec(system.prompt);
    assert(match,system.prompt);const[,A,B,C,D,F,G]=match,sx=numeric(system,'x'),sy=numeric(system,'y');
    assert(sx.mul(A).add(sy.mul(B)).equals(C));assert(sx.mul(D).add(sy.mul(F)).equals(G));
    const classification=E.generate('g9-sistemi-klasifikacija',seed,difficulty),m=/sistem (\d+)x \+ (\d+)y = (-?\d+); (\d+)x \+ (\d+)y = (-?\d+)/.exec(classification.prompt);
    const[,aa,bb,cc,dd,ee,ff]=m.map(String),det=BigInt(aa)*BigInt(ee)-BigInt(bb)*BigInt(dd);
    const expected=det!==0n?'jedno':BigInt(aa)*BigInt(ff)===BigInt(cc)*BigInt(dd)&&BigInt(bb)*BigInt(ff)===BigInt(cc)*BigInt(ee)?'beskonačno':'nijedno';
    assert.equal(answer(classification,'vrsta'),expected);
  }
});

test('Inequality grading accepts equivalent numeric boundaries and reversed writing without changing the relation',()=>{
  const field={type:'text',answer:'x ≤ -3'};
  assert(E.checkField(field,'X <= -3').correct);
  assert(E.checkField(field,'x ≤ -6/2').correct);
  assert(E.checkField(field,'-3 ≥ x').correct);
  assert(!E.checkField(field,'x < -3').correct);
  assert(!E.checkField(field,'x ≥ -3').correct);
  assert(!E.checkField(field,'x ≤ -1-2').correct);
  assert(E.checkField({type:'text',answer:'složen'},'SLOZEN').correct);
});

test('Pythagoras and principal roots have valid positive geometric or root answers',()=>{
  for(const seed of sampleSeeds)for(const difficulty of levels){
    const hyp=E.generate('pythagoras-hypotenuse',seed,difficulty),[,a,b]=/su (\d+) cm i (\d+) cm/.exec(hyp.prompt),h=BigInt(answer(hyp));
    assert.equal(h*h,BigInt(a)**2n+BigInt(b)**2n);
    const root=E.generate('square-roots',seed,difficulty),value=/korijen broja (.+)\./.exec(root.prompt)[1],r=numeric(root);
    assert(r.n>=0n);assert(r.mul(r).equals(value));
    const estimate=E.generate('root-estimation',seed,difficulty),n=BigInt(/√(\d+)/.exec(estimate.prompt)[1]),lo=BigInt(answer(estimate,'lower')),hi=BigInt(answer(estimate,'upper'));
    assert.equal(hi,lo+1n);assert(lo*lo<n&&n<hi*hi);
  }
});

test('Plane figures, solids and diedars independently obey their geometric formulas',()=>{
  for(const seed of sampleSeeds)for(const difficulty of levels){
    const rectangle=E.generate('rectangle-measures',seed,difficulty),[,a,b]=/a = (\d+) cm i b = (\d+) cm/.exec(rectangle.prompt);
    assert.equal(answer(rectangle,'area'),String(Number(a)*Number(b)));
    assert.equal(answer(rectangle,'perimeter'),String(2*(Number(a)+Number(b))));
    const cube=E.generate('g9-kocka',seed,difficulty),side=M.rational(/a = (.+) cm\./.exec(cube.prompt)[1]);
    assert(numeric(cube,'p').equals(side.pow(2).mul(6)));assert(numeric(cube,'v').equals(side.pow(3)));
    const pyramid=E.generate('g9-piramida',seed,difficulty),[,sa,sh,ss]=/a = (.+) cm, visinu h = (.+) cm i apotemu bočne strane s = (.+) cm\./.exec(pyramid.prompt),aa=M.rational(sa),hh=M.rational(sh),s=M.rational(ss);
    assert(s.pow(2).equals(hh.pow(2).add(aa.div(2).pow(2))));
    assert(numeric(pyramid,'p').equals(aa.pow(2).add(aa.mul(s).mul(2))));
    assert(numeric(pyramid,'v').equals(aa.pow(2).mul(hh).div(3)));
    const diedar=E.generate('g9-diedar',seed,difficulty);
    assert(numeric(diedar,'alpha').add(numeric(diedar,'beta')).equals(180));
    assert(numeric(diedar,'alpha').n>0n&&numeric(diedar,'beta').n>0n);
  }
});

test('Approximate π tasks state precision, accept rounded values and reject larger errors',()=>{
  for(const id of ['g9-valjak','g9-kupa','g9-lopta'])for(const seed of sampleSeeds)for(const difficulty of levels){
    const task=E.generate(id,seed,difficulty);
    assert(/dvije decimale/.test(task.prompt));assert(/π s kalkulatora/.test(task.prompt));
    for(const field of task.fields){
      assert.equal(field.tolerance,0.0051);
      assert(E.checkField(field,Number(field.answer).toFixed(2).replace('.',',')).correct);
      assert(!E.checkField(field,String(Number(field.answer)+0.02)).correct);
    }
  }
});

test('Statistics and probability respect their definitions and domain',()=>{
  for(const seed of sampleSeeds)for(const difficulty of levels){
    const mean=E.generate('g9-aritmeticka-sredina',seed,difficulty),data=mean.prompt.split(': ')[1].replace(/\.$/,'').split(', ').map(Number),sum=data.reduce((a,b)=>a+b,0);
    assert.equal(answer(mean,'sredina'),text(rational(sum,data.length)));
    const median=E.generate('g9-medijan',seed,difficulty),sorted=median.prompt.split(': ')[1].replace(/\.$/,'').split(', ').map(Number).sort((a,b)=>a-b),n=sorted.length;
    const med=n%2?rational(sorted[(n-1)/2]):rational(sorted[n/2-1]+sorted[n/2],2);
    assert.equal(answer(median,'medijan'),text(med));
    const probability=E.generate('g9-vjerovatnoca',seed,difficulty),[,red,blue,green]=/su (\d+) crvene, (\d+) plave i (\d+) zelene/.exec(probability.prompt),total=Number(red)+Number(blue)+Number(green);
    assert.equal(answer(probability,'crvena'),text(rational(red,total)));
    for(const field of probability.fields){const r=M.rational(field.answer);assert(r.n>=0n&&r.n<=r.d);}
  }
});
