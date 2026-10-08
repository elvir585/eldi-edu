'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../content/informatics-senior.json');
const authored = require('../scripts/build-informatics-senior.cjs').lessons;
const E = require('../app/exam-engine.js');
const lesson = id => {const item = data.find(l => l.id === id); assert(item, id); return item;};
const field = id => lesson(id).activity.fields[0];
const result = id => field(id).answer;
const number = id => Number(result(id));
const sequence = id => result(id).split(',').map(Number);

test('Senior catalog is reproducible and has 100 distinct objectives in each grade', () => {
  assert.deepEqual(data, authored);
  assert.equal(data.length, 200);
  assert.equal(new Set(data.map(l => l.id)).size, 200);
  assert.equal(new Set(data.map(l => l.title)).size, 200);
  for (const grade of [8, 9]) {
    const rows = data.filter(l => l.grade === grade);
    assert.equal(rows.length, 100);
    assert.deepEqual(rows.map(l => l.id), Array.from({length: 100}, (_, i) => `i${grade}-${String(i+1).padStart(3, '0')}`));
    assert(new Set(rows.map(l => l.category)).size >= 7);
  }
});

test('Every senior lesson teaches a concept and grades a concrete free response', () => {
  for (const l of data) {
    assert.equal(l.subject, 'informatics'); assert.equal(l.g, l.grade);
    assert(l.title.length > 12, l.id); assert(l.category.length >= 1, l.id);
    assert(l.description.length >= 50, l.id);
    assert.equal(l.body.length, 3, l.id);
    assert(l.body.every(p => typeof p === 'string' && p.length >= 30), l.id);
    assert.equal(new Set(l.body).size, 3, l.id);
    assert(l.example.length >= 15, l.id);
    const a = l.activity;
    assert(a.prompt.length >= 20, l.id); assert(a.hint.length >= 10, l.id);
    assert(a.steps.length >= 2 && a.steps.every(s => s.length >= 5), l.id);
    assert.equal(a.fields.length, 1, l.id);
    const f = a.fields[0];
    assert(['number', 'list', 'text'].includes(f.type), l.id);
    assert(f.key && f.label && String(f.answer).length, l.id);
    if (f.type === 'list') assert.equal(f.ordered, true, l.id);
    assert(E.checkField(f, f.answer).correct, l.id + ' canonical answer');
    assert(!E.checkField(f, '').correct, l.id + ' empty');
    assert(!E.checkField(f, f.type === 'text' ? 'zzzzzneodgovor' : '999999999').correct, l.id + ' unrelated');
    for (const alias of f.accepted || []) assert(E.checkField(f, alias).correct, l.id + ' alias');
  }
});

test('Programming output is case sensitive and list order is meaningful', () => {
  for (const [id, bad] of [
    ['i8-026', 'Float'], ['i8-032', 'false'], ['i8-033', 'false'],
    ['i8-046', 'T'], ['i8-048', 'dobardan'], ['i8-054', '7 -3=4'],
    ['i8-063', 'bb'], ['i8-072', 'Bodovi'], ['i9-016', 'main.java'],
    ['i9-019', 'ab3'], ['i9-021', 'False'], ['i9-030', 'G']
  ]) {
    assert.equal(field(id).caseSensitive, true, id);
    assert(!E.checkField(field(id), bad).correct, id + ' should reject ' + bad);
    assert(E.checkField(field(id), ' ' + result(id) + ' ').correct, id + ' outer whitespace');
  }
  for (const id of data.filter(l => l.activity.fields[0].type === 'list').map(l => l.id)) {
    const value = result(id).split(',');
    assert(E.checkField(field(id), value.join(' ')).correct, id + ' numeric separation');
    assert(!E.checkField(field(id), value.reverse().join(',')).correct, id + ' reversed order');
  }
  assert(E.checkField(field('i8-082'), 'dns').correct);
  assert(E.checkField(field('i9-067'), 'get').correct);
  assert(E.checkField(field('i9-068'), 'https').correct);
});

test('Independent base, bitwise, byte and layout calculations verify authored answers', () => {
  assert.equal(number('i8-001'), parseInt('110101', 2));
  assert.equal(result('i8-002'), (26).toString(2));
  assert.equal(result('i8-003'), (parseInt('1101',2)+parseInt('0101',2)).toString(2));
  assert.equal(result('i8-004'), (parseInt('10110',2)-parseInt('00111',2)).toString(2));
  assert.equal(number('i8-005'), 2**7-1);
  assert.equal(number('i8-006'), 3*1024*8);
  assert.equal(number('i8-007'), parseInt('3A',16));
  assert.equal(result('i8-008'), parseInt('11010010',2).toString(16).toUpperCase());
  assert.equal(result('i8-009'), parseInt('111001',2).toString(8));
  assert.equal(number('i8-010'), Buffer.byteLength('mačka','utf8'));
  assert.equal(number('i8-011'), 40*25*24/8);
  assert.equal(result('i8-013'), (0b1100&0b1010).toString(2).padStart(4,'0'));
  assert.equal(result('i8-014'), (0b1010|0b0011).toString(2).padStart(4,'0'));
  assert.equal(result('i8-015'), (0b1110^0b0101).toString(2).padStart(4,'0'));
  assert.equal(number('i8-076'), 200+2*12+2*3);
  assert.equal(number('i8-077'), 4*50+3*8);
  assert.equal(number('i8-078'), 640*.25);
  assert.equal(number('i9-082'), 10**4);
  assert.equal(number('i9-083'), parseInt('80',16));
  assert.equal(number('i9-084'), 10&2);
});

test('Independent algorithm traces verify search, sorting, recursion and containers', () => {
  let x=4,y=x+3;x=y*2;assert.equal(number('i8-016'),x);
  let a=6,b=9,t=a;a=b;b=t;assert.deepEqual(sequence('i8-017'),[a,b]);
  assert.equal(number('i8-020'),Array.from({length:7},(_,i)=>i+1).filter(i=>i>3).length);
  assert.equal(number('i8-022'),Math.min(14,9,12,5,11));
  assert.equal(number('i8-023'),[9,6,8,4,2].indexOf(4)+1);
  let count=0,l=0,r=6;const sorted=[1,2,3,4,5,6,7];
  while(l<=r){const mid=Math.floor((l+r)/2);count++;if(sorted[mid]===7)break;if(sorted[mid]<7)l=mid+1;else r=mid-1;}
  assert.equal(number('i9-042'),count);
  const selection=[8,4,6,2],minimum=selection.indexOf(Math.min(...selection));
  [selection[0],selection[minimum]]=[selection[minimum],selection[0]];
  assert.deepEqual(sequence('i9-043'),selection);
  assert.deepEqual(sequence('i9-044'),[1,4,8,10,6].sort((a,b)=>a-b));
  const bubble=[5,2,4,1];for(let i=0;i<bubble.length-1;i++)if(bubble[i]>bubble[i+1])[bubble[i],bubble[i+1]]=[bubble[i+1],bubble[i]];
  assert.deepEqual(sequence('i9-045'),bubble);
  assert.deepEqual(sequence('i9-046'),[2,7,9,1,5,8].sort((a,b)=>a-b));
  let f0=0,f1=1;for(let i=2;i<=8;i++)[f0,f1]=[f1,f0+f1];assert.equal(number('i9-048'),f1);
  let gcdA=84,gcdB=30;while(gcdB)[gcdA,gcdB]=[gcdB,gcdA%gcdB];assert.equal(number('i9-053'),gcdA);
  const stack=[];stack.push(4,8,3);stack.pop();assert.equal(number('i9-054'),stack.pop());
  const queue=[6,9,2];queue.shift();queue.push(4);assert.equal(number('i9-055'),queue.shift());
});

test('Negative division semantics, filtered aggregates and Scratch state are explicit', () => {
  assert.equal(number('i9-005'),Math.trunc(-13/5));
  assert.equal(number('i9-006'),-14-Math.trunc(-14/5)*5);
  assert.equal(number('i9-056'),[4,6,9,10,6].filter(n=>n>=6).length);
  assert.equal(number('i9-058'),[6,8,10,12].reduce((a,b)=>a+b)/4);
  assert.equal(number('i9-059'),new Set([7,8,7,9,8,9]).size);
  assert.equal(number('i9-064'),[2,5,8].map(n=>n>=5?n+1:n).reduce((a,b)=>a+b));
  assert.equal(number('i8-096'),(1-1+5)%4+1);
  assert.equal(number('i8-098'),4*35);
  assert.equal(number('i8-100'),Math.ceil((10-1)/3));
  assert.equal(number('i9-089'),4+6-3);
  assert.equal(number('i9-096'),360/8);
  assert.equal(number('i9-097'),3*42);
  assert.equal(number('i9-099'),1.5+2+.5);
});
