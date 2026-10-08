'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../content/informatics-junior.json');
const E=require('../app/exam-engine.js');
const byTitle=title=>{const row=data.find(l=>l.title===title);assert(row,'Missing lesson: '+title);return row;};
const answer=title=>byTitle(title).activity.fields[0].answer;

test('Junior course contains exactly 300 distinct focused objectives with 100 per grade',()=>{
  assert.equal(data.length,300);
  assert.equal(new Set(data.map(l=>l.id)).size,300);
  assert.equal(new Set(data.map(l=>l.title)).size,300);
  for(const grade of [5,6,7]){
    const course=data.filter(l=>l.grade===grade);
    assert.equal(course.length,100);
    assert.equal(new Set(course.map(l=>l.category)).size,10);
    for(const category of new Set(course.map(l=>l.category)))assert.equal(course.filter(l=>l.category===category).length,10);
    assert.deepEqual(course.map(l=>l.id),Array.from({length:100},(_,i)=>`i${grade}-${String(i+1).padStart(3,'0')}`));
  }
});

test('Every junior objective has teaching content, a worked example and a concrete free-answer activity',()=>{
  for(const lesson of data){
    assert.equal(lesson.subject,'informatics');assert.equal(lesson.g,lesson.grade);
    assert(lesson.description.length>=40,lesson.id);
    assert.equal(lesson.body.length,3);assert(lesson.body.every(p=>typeof p==='string'&&p.length>=30),lesson.id);
    assert(lesson.example.includes('Rješenje:'),lesson.id);
    const a=lesson.activity;
    assert(a.prompt&&a.hint&&a.steps.length,lesson.id);
    assert.equal(a.fields.length,1);
    const field=a.fields[0];assert(['number','text'].includes(field.type));
    assert(field.key&&field.label);assert.notEqual(field.answer,'');
    assert(E.checkField(field,field.answer).correct,lesson.id+' canonical answer');
    assert(!E.checkField(field,'').correct,lesson.id+' empty answer');
    assert(!E.checkField(field,field.type==='number'?'99999999':'zzzz neodgovor').correct,lesson.id+' unrelated answer');
    for(const alias of field.accepted||[])assert(E.checkField(field,alias).correct,lesson.id+' alias');
  }
});

test('Whitespace and letter case are preserved when they are the learning objective or exact program output',()=>{
  for(const [title,bad] of [
    ['Razmak između riječi','DOBARDAN'],
    ['Razmak između riječi','DOBAR  DAN'],
    ['Interpunkcija u tekstu','Zdravo , Ana.'],
    ['Interpunkcija u tekstu','Zdravo,Ana.'],
    ['Fraza pod navodnicima','"Mali  princ"']
  ]){
    const field=byTitle(title).activity.fields[0];
    assert.equal(field.preserveWhitespace,true,title);
    assert(E.checkField(field,field.answer).correct,title);
    assert(!E.checkField(field,bad).correct,title+' should reject '+bad);
  }
  for(const title of [
    'Međuspremnik i posljednje kopiranje','Kursor i mjesto umetanja',
    'Velika i mala slova','Odabir raspona teksta',
    'Python logičke vrijednosti','Python indeks znaka'
  ]){
    const field=byTitle(title).activity.fields[0];
    assert.equal(field.caseSensitive,true,title);
    assert(E.checkField(field,field.answer).correct,title);
    assert(!E.checkField(field,String(field.answer).toLowerCase()).correct,title+' letter-case corruption');
  }
});

test('Independent data representation calculations match authored activities',()=>{
  assert.equal(answer('Bajt kao osam bitova'),7*8);
  assert.equal(answer('Mjesta u binarnom zapisu'),2**3);
  assert.equal(answer('Čitanje binarnog broja'),parseInt('10110',2));
  assert.equal(answer('Zapis dekadnog broja binarno'),(13).toString(2));
  assert.equal(answer('Broj obrazaca s više bitova'),2**4);
  assert.equal(answer('Sabiranje binarnih cifara'),(parseInt('101',2)+parseInt('11',2)).toString(2));
  assert.equal(answer('ASCII kao dogovor o znakovima'),'B'.charCodeAt(0));
  assert.equal(answer('UTF-8 i promjenljiva dužina'),Buffer.byteLength('AČ','utf8'));
  assert.equal(answer('Piksel i raster'),12*8);
  assert.equal(answer('Mjesna vrijednost u oktalnom sistemu'),8**2);
  assert.equal(answer('Pretvaranje oktalnog u dekadni'),parseInt('157',8));
  assert.equal(answer('Pretvaranje dekadnog u oktalni'),(83).toString(8));
  assert.equal(answer('Cifre A–F u heksadekadnom sistemu'),parseInt('E',16));
  assert.equal(answer('Pretvaranje heksadekadnog u dekadni'),parseInt('2F',16));
  assert.equal(answer('Pretvaranje dekadnog u heksadekadni'),(174).toString(16).toUpperCase());
  assert.equal(answer('Grupisanje bitova za oktalni zapis'),parseInt('110101',2).toString(8));
  assert.equal(answer('Grupisanje bitova za heksadekadni zapis'),parseInt('10111100',2).toString(16).toUpperCase());
  assert.equal(answer('Najveći nepredznačeni broj'),2**6-1);
  assert.equal(parseInt(answer('Dvojni komplement negativnog broja'),2)-16,-3);
});

test('Independent algorithm traces cover loops, indexes, branches, matrices and Python',()=>{
  let s=0;for(let i=0;i<4;i++)s+=3;assert.equal(answer('Petlja s poznatim brojem prolaza'),s);
  let n=0;while(n<10)n+=3;assert.equal(answer('Korak veći od jedan'),n);
  let reset=0;for(let i=0;i<4;i++){reset=0;reset+=2;}assert.equal(answer('Greška resetovanja unutar petlje'),reset);
  assert.equal(answer('Brojač uspješnih provjera'),[3,7,5,9].filter(x=>x>5).length);
  assert.equal(answer('Brojanje višekratnika'),[3,4,6,9,10,12].filter(x=>x%3===0).length);
  assert.equal(answer('Linearna pretraga i broj poređenja'),[4,7,2,9,5].indexOf(9)+1);
  assert.equal(answer('Pronalaženje prve pojave'),[6,2,9,2].indexOf(2)+1);
  assert.equal(answer('Maksimum obilaskom liste'),Math.max(-8,-3,-6));
  assert.equal(answer('Minimum i inicijalizacija'),Math.min(12,5,9,7));
  assert.equal(answer('Prosjek podataka u listi'),[3,5,8,12].reduce((a,b)=>a+b)/4);
  assert.equal(answer('Broj ponavljanja vrijednosti'),[4,2,4,7,4,1].filter(x=>x===4).length);
  assert.equal(answer('Obrnuti redoslijed liste'),[2,5,9,1].reverse()[0]);
  assert.equal(answer('Matrica i par indeksa'),[[1,2,3],[4,5,6]][1][2]);
  const matrix=[[2,4,6],[1,3,5],[7,8,9]];assert.equal(answer('Glavna dijagonala kvadratne matrice'),matrix.reduce((sum,row,i)=>sum+row[i],0));
  assert.equal(answer('Pretvaranje mreže u niz'),[[3,1],[8,6]].flat()[2]);
  let a=4,b=9;[a,b]=[b,a];assert.equal(answer('Zamjena dvije vrijednosti'),b);
  let total=0;while(total<10)total+=4;assert.equal(answer('Akumuliranje do praga'),total);
  const values=[3,1,2];for(let i=0;i<2;i++)if(values[i]>values[i+1])[values[i],values[i+1]]=[values[i+1],values[i]];assert.equal(answer('Jedan prolaz susjednih poređenja'),values.at(-1));
  assert.equal(answer('Cjelobrojno dijeljenje u Pythonu'),Math.floor(17/5));
  assert.equal(answer('Ostatak operatorom procent'),23%4);
  assert.equal(answer('Python indeks znaka'),'MAJA'[2]);
  assert.equal(answer('Python logičke vrijednosti'),'False');
});

test('Document, spreadsheet, communication and multimedia examples are independently consistent',()=>{
  assert.equal(answer('Štampač i papirni izlaz'),4*3);
  assert.equal(answer('Margine i širina teksta'),21-2-2);
  assert.equal(answer('Tabela i ćelije dokumenta'),4*3);
  assert.equal(answer('Omjer slike pri promjeni veličine'),4/2);
  assert.equal(answer('Funkcija SUM'),2+4+9);
  assert.equal(answer('Funkcija AVERAGE'),(4+6+8+10)/4);
  assert.equal(answer('Funkcija MIN'),Math.min(8,-2,5,0));
  assert.equal(answer('Funkcija MAX'),Math.max(3,12,7,11));
  assert.equal(answer('Brojanje prema kriteriju COUNTIF'),[2,5,6,9].filter(x=>x>5).length);
  assert.equal(answer('Uslovni zbir SUMIF'),[2,5,6,9].filter(x=>x>5).reduce((a,b)=>a+b,0));
  assert.equal(answer('Medijan uređenih podataka'),[9,2,5,1,7].sort((a,b)=>a-b)[2]);
  assert.equal(answer('Brzina prijenosa'),60/10);
  assert.equal(answer('Mrežni paket'),1200/300);
  assert.equal(answer('Veličina sirovog RGB rastera'),10*20*3);
  assert.equal(answer('Uzorkovanje zvuka'),2*8000);
  assert.equal(answer('Video i broj kadrova'),4*25);
  assert.equal(answer('Procenat u anketnim podacima'),10/40*100);
  assert.equal(answer('Nedostajući podatak i nula'),(4+8)/2);
});
