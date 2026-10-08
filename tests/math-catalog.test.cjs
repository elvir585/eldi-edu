'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const catalog=require('../content/math-catalog.json');
const {items}=require('../scripts/build-math-catalog.cjs');
const byTitle=t=>{const item=catalog.find(x=>x.title===t);assert.ok(item,'Missing skill: '+t);return item;};

test('Mathematics catalog contains exactly 500 distinct substantive learning skills',()=>{
 assert.equal(catalog.length,500);
 assert.equal(new Set(catalog.map(x=>x.id)).size,500);
 assert.equal(new Set(catalog.map(x=>x.title)).size,500);
 assert.equal(new Set(catalog.map(x=>x.body.join('\n'))).size,500);
 for(const grade of [5,6,7,8,9]){
  const group=catalog.filter(x=>x.grade===grade);
  assert.equal(group.length,100);
  assert.deepEqual(group.map(x=>x.id),Array.from({length:100},(_,i)=>`m${grade}-${String(i+1).padStart(3,'0')}`));
 }
 for(const x of catalog){
  assert.equal(x.subject,'math');
  assert.ok(x.title.length>5&&x.category.length>5);
  assert.ok(x.description.length>45&&x.example.length>8);
  assert.equal(x.body.length,4);
  assert.ok(x.body.every(p=>p.length>=50));
  assert.ok(x.hint.length>60);
  assert.ok(/^[a-z][a-zA-Z]*$/.test(x.practice.family));
  assert.ok(/^[a-z][a-z-]*$/.test(x.practice.mode));
  assert.equal(typeof x.practice.params,'object');
 }
});

test('Catalog build is reproducible and required divisibility skills are genuinely separate',()=>{
 assert.deepEqual(items,catalog);
 for(const divisor of [2,3,4,5,6,9,10,15,25]){
  const skills=catalog.filter(x=>x.practice.family==='divisibility'&&x.practice.params.divisor===divisor);
  assert.equal(skills.length,2);
  assert.deepEqual(skills.map(x=>x.practice.mode).sort(),['digit','test']);
 }
 assert.ok(byTitle('Dvojni razlomak s razlikom u nazivniku').practice.params.pattern==='difference-bottom');
 assert.ok(byTitle('Procentni poeni i relativna promjena').practice.params.target==='percentage-points');
 assert.ok(byTitle('Zašto kosi presjek ne određuje diedar').practice.params.target==='definition');
});

test('Independent arithmetic audit of selected worked examples with carrying, exact fractions and units',()=>{
 const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
 const reduced=(a,b)=>{const g=gcd(a,b);return `${a/g}/${b/g}`;};
 assert.equal(28785+14697,43482);
 assert.match(byTitle('Sabiranje s višestrukim prenosom').example,/43 482/);
 assert.equal(4000000-1234567,2765433);
 assert.match(byTitle('Razlika velikih brojeva preko miliona').example,/2 765 433/);
 assert.equal(124*203,25172);
 assert.match(byTitle('Množenje trocifrenim faktorom').example,/25 172/);
 assert.equal(8736/24,364);
 assert.match(byTitle('Dijeljenje dvocifrenim djeliocem').example,/364/);
 assert.equal(reduced(14*25,15*21),'10/9');
 assert.match(byTitle('Skraćivanje prije množenja').example,/10\/9/);
 assert.equal(reduced(5*4-1*6,6*4),'7/12');
 assert.match(byTitle('Oduzimanje različitih nazivnika').example,/7\/12/);
 assert.equal(reduced(1*20-2*4-1*5,20),'7/20');
 assert.match(byTitle('Preostali dio cjeline').example,/7\/20/);
 assert.equal(2*60+35,155);
 assert.match(byTitle('Sati i minute u minute').example,/155 min/);
 assert.equal(2*100*100,20000);
 assert.match(byTitle('Kvadratni metri u kvadratne centimetre').example,/20 000/);
});

test('Independent algebra and geometry audit of worked examples',()=>{
 assert.equal(180-48.5-72.25,59.25);
 assert.match(byTitle('Treći ugao s decimalnim mjerama').example,/59,25/);
 assert.equal(2*(-2)**2-3*(-2)+1,15);
 assert.match(byTitle('Vrijednost kvadratnog polinoma').example,/=15/);
 assert.equal(103**2-97**2,1200);
 assert.match(byTitle('Računanje razlike kvadrata bez dugog množenja').example,/1 200/);
 assert.equal(Math.hypot(3,4,12),13);
 assert.match(byTitle('Prostorna dijagonala kvadra').example,/=13 cm/);
 assert.equal(3*4+2*3*5+2*4*5,82);
 assert.match(byTitle('Površina otvorene pravougaone posude').example,/82 cm²/);
 assert.equal(6**2+2*6*5,96);
 assert.match(byTitle('Površina pravilne četverostrane piramide').example,/96 cm²/);
 assert.equal((4*3.14*3**2).toFixed(2),'113.04');
 assert.match(byTitle('Površina sfere').example,/113,04/);
 assert.equal((4*3.14*3**3/3).toFixed(2),'113.04');
 assert.match(byTitle('Zapremina lopte').example,/113,04/);
});

test('Independent statistics, probability and rates audit of worked examples',()=>{
 assert.equal((2*3+3*5)/5,4.2);
 assert.match(byTitle('Ponderisana aritmetička sredina').example,/4,2/);
 assert.equal((18+10)/4,7);
 assert.match(byTitle('Promjena sredine dodavanjem podatka').example,/=7/);
 assert.equal((100*.8*.9).toFixed(2),'72.00');
 assert.match(byTitle('Dva uzastopna popusta').example,/72 KM/);
 assert.equal((25-20)/20*100,25);
 assert.match(byTitle('Procentni poeni i relativna promjena').example,/5 procentnih poena.*25%/);
 assert.equal(3/8*2/7,3/28);
 assert.match(byTitle('Dvije uzastopne kuglice bez vraćanja').example,/3\/28/);
 assert.equal(5*4,20);
 assert.match(byTitle('Uređeni izbor bez ponavljanja').example,/20 uređenih/);
 assert.equal(6*4+4*7,52);
 assert.match(byTitle('Broj ulaznica dvije cijene').example,/x=6,y=4/);
});
