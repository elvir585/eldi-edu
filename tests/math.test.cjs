'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const m = require('../app/math-engine.js');

test('Large integer arithmetic never passes through a floating point number', () => {
  assert.equal(m.evaluate('999999999999999999999999 + 1').exact,'1000000000000000000000000');
  assert.equal(m.evaluate('9007199254740993 * 7 - 1').exact,'63050394783186950');
  assert.throws(() => m.rational(9007199254740992),/tekst/);
});

test('Fractions, complex fractions, comma decimals and operation order are exact', () => {
  assert.equal(m.evaluate('(1/2 + 1/3)/(3/4)').exact,'10/9');
  assert.equal(m.evaluate('0,1 + 0.2').exact,'3/10');
  assert.equal(m.evaluate('3/4 ÷ (−2/5)').exact,'-15/8');
  assert.equal(m.evaluate('2+3*4').exact,'14');
  assert.equal(m.evaluate('-2^2').exact,'-4');
  assert.equal(m.evaluate('(-2)^2').exact,'4');
  assert.equal(m.evaluate('2^3^2').exact,'512');
  assert.equal(m.evaluate('2^-3').exact,'1/8');
  assert.equal(m.evaluate('10:4').exact,'5/2');
  assert.equal(m.parse('1/3').toDecimal(6),'0.333333');
  assert.equal(m.parse('-2/3').toDecimal(6),'-0.666667');
  assert.equal(m.parse('999/1000').toDecimal(2),'1');
  assert.equal(m.parse('-1/1000').toDecimal(2),'0');
});

test('Parser rejects invalid inputs and division by zero without executing code', () => {
  for (const value of ['', '1/0','(1+2','1 2','2(3+4)','alert(1)','1;2','1..2','0^0','0^-1','2^(1/2)','2^101']) assert.throws(() => m.evaluate(value));
  assert.throws(() => m.evaluate('('.repeat(130)+'1'+')'.repeat(130)),/zagrada/);
});

test('Rationals normalize signs and reduce; arithmetic respects identities', () => {
  assert.equal(new m.Rational(12n,-18n).toString(),'-2/3');
  assert.equal(new m.Rational(0n,-5n).toString(),'0');
  for (let a = -8; a <= 8; a++) for (let b = 1; b <= 7; b++) {
    const x = new m.Rational(BigInt(a),BigInt(b));
    assert(x.add('7/13').sub('7/13').equals(x));
    assert(x.mul('-5/11').div('-5/11').equals(x));
  }
});

test('NZD, NZS and divisibility handle zero and signed integers', () => {
  assert.equal(m.gcd(-84n,126n),42n);
  assert.equal(m.gcd(0n,0n),0n);
  assert.equal(m.lcm(-12n,18n),36n);
  assert.equal(m.lcm(0n,18n),0n);
  assert(m.divisibility(900).every(item=>item.divisible));
  assert(m.divisibility(0).every(item=>item.divisible));
  assert.equal(m.divisibility(25).find(item=>item.divisor==='25').divisible,true);
  assert.throws(()=>m.divisibility(25,[0]));
});

test('Primality handles non-primes, Carmichael numbers and 64-bit integers', () => {
  for (const n of [-3,0,1,4,9,25,341,561,1105,1729]) assert.equal(m.isPrime(n),false,String(n));
  for (const n of [2,3,5,7,97,1009]) assert.equal(m.isPrime(n),true,String(n));
  assert.equal(m.isPrime('18446744073709551557'),true);
  assert.equal(m.isPrime('18446744073709551615'),false);
  assert.throws(()=>m.isPrime('18446744073709551616'),/podržava/);
});

test('Prime factorization reconstructs the integer and excludes 0 and 1 from primes', () => {
  assert.deepEqual(m.factorize(360).factors,[{prime:'2',exponent:3},{prime:'3',exponent:2},{prime:'5',exponent:1}]);
  assert.deepEqual(m.factorize(1).factors,[]);
  assert.equal(m.factorize(-1).expression,'-1');
  for (const n of [-360n,2n,97n,1234567890n,1000000000000n]) {
    const factors=m.factorize(n).factors;
    assert.equal(factors.reduce((acc,f)=>acc*BigInt(f.prime)**BigInt(f.exponent),1n),n);
  }
  assert.throws(()=>m.factorize(0),/Nula/);
  assert.throws(()=>m.factorize('1000000000001'),/podržava/);
});

test('Binary, octal, decimal and hexadecimal conversion preserves large signed integers', () => {
  assert.equal(m.convertBase('11111111',2,16),'FF');
  assert.equal(m.convertBase('377',8,10),'255');
  assert.equal(m.convertBase('-ff',16,2),'-11111111');
  assert.equal(m.convertBase('-0',10,16),'0');
  const huge='123456789012345678901234567890';
  for (const base of [2,8,10,16]) assert.equal(m.convertBase(m.convertBase(huge,10,base),base,10),huge);
  assert.throws(()=>m.convertBase('102',2,10),/Cifra/);
  assert.throws(()=>m.convertBase('12',3,10),/baze/);
  assert.throws(()=>m.convertBase('FFG',16,10),/Cifra/);
});

test('Linear equations distinguish unique, inconsistent and identity cases', () => {
  assert.equal(m.solveLinear('3/4','1/2','2').x,'2');
  assert.equal(m.solveLinear(0,2,2).type,'infinite');
  assert.equal(m.solveLinear(0,2,3).type,'none');
  assert.deepEqual(m.solveSystem(1,1,5,2,-1,1),{type:'unique',x:'2',y:'3',determinant:'-3'});
  assert.equal(m.solveSystem(1,2,3,2,4,6).type,'infinite');
  assert.equal(m.solveSystem(1,2,3,2,4,7).type,'none');
  assert.equal(m.solveSystem(0,0,1,0,0,1).type,'none');
  assert.equal(m.solveSystem(0,0,0,0,0,0).type,'infinite');
  assert.equal(m.solveSystem(0,0,0,1,2,3).type,'infinite');
});

test('Percentages and function values retain exact fractions', () => {
  assert.equal(m.percentOf('12.5',80).exact,'10');
  assert.equal(m.percentage(1,3).exact,'100/3');
  assert.throws(()=>m.percentage(3,0),/nulom/);
  const points=m.linearPoints('2/3','-1/2',[0,'3/4']);
  assert.equal(points[0].y,'-1/2');
  assert.equal(points[1].y,'0');
});

test('Geometry covers plane figures and solids with correct units', () => {
  const value=(shape,dimensions,label)=>m.geometry(shape,dimensions).results.find(r=>r.label===label).value;
  assert.equal(value('rectangle',{a:3,b:4},'Dijagonala'),5);
  assert.equal(value('square',{a:5},'Površina'),25);
  assert.equal(value('triangle',{a:3,h:4,b:4,c:5},'Površina'),6);
  assert.equal(value('cuboid',{a:2,b:3,c:4},'Zapremina'),24);
  assert.equal(value('cube',{a:3},'Površina'),54);
  assert.equal(value('prism',{baseArea:6,basePerimeter:12,h:10},'Zapremina'),60);
  assert.equal(value('pyramid',{baseArea:12,h:5,lateralArea:30},'Površina'),42);
  assert.equal(value('cone',{r:3,h:4},'Izvodnica'),5);
  assert(Math.abs(value('cylinder',{r:2,h:3},'Zapremina')-12*Math.PI)<1e-12);
  assert(Math.abs(value('sphere',{r:3},'Zapremina')-36*Math.PI)<1e-12);
  assert.equal(m.geometry('krug',{r:2}).results[1].unit,'jedinica²');
});

test('Geometry rejects invalid shapes, dimensions and inconsistent triangles', () => {
  assert.throws(()=>m.geometry('circle',{r:0}));
  assert.throws(()=>m.geometry('square',{a:-2}));
  assert.throws(()=>m.geometry('rectangle',{a:2}));
  assert.throws(()=>m.geometry('triangle',{a:2,h:1,b:1,c:1}),/nejednakost/);
  assert.throws(()=>m.geometry('triangle',{a:3,h:1,b:4,c:5}),/Visina/);
  assert.throws(()=>m.geometry('triangle',{a:3,h:4,b:4}),/obje/);
  assert.throws(()=>m.geometry('unknown',{a:3}));
});
