'use strict';
const fs=require('node:fs'),path=require('node:path');
const A=require('../app/edition3333-engine.js');
const bank={};
const convert=q=>({prompt:q.question,answer:q.answer,points:5,tolerance:q.tolerance??1e-6,explanation:q.solution});
for(const grade of [5,6,7,8,9]){
 const lessons=A.lessons.filter(l=>l.grade===grade&&l.subject==='m');
 const questions=lessons.flatMap((lesson,i)=>{
  const pool=[2,1,3].flatMap(level=>A.questions(lesson.id,level,17+i,20));
  return [...new Map(pool.map(q=>[q.question,q])).values()].slice(0,5).map(convert);
 });
 if(questions.length!==20)throw Error('Matematički test mora imati 20 pitanja: '+grade);
 bank['math'+grade]={title:'Matematika · '+grade+'. razred',grade,subject:'Matematika',featured:true,intro:'Matematički izazov sekcije: računanje, geometrija i zaključivanje. Rješavaj korak po korak.',questions};
}
const python=[
 ['Sabiranje','a = 7\nb = 5\nprint(a + b)',12,'Dodijeli a = 7 i b = 5. Zbir 7 + 5 je 12.'],
 ['Redoslijed operacija','print(3 + 4 * 2)',11,'Prvo izračunaj 4 · 2 = 8. Zatim 3 + 8 = 11.'],
 ['Cjelobrojno dijeljenje','print(17 // 5)',3,'17 = 3 · 5 + 2. Operator // daje cjelobrojni količnik 3.'],
 ['Ostatak','print(17 % 5)',2,'17 = 3 · 5 + 2. Operator % daje ostatak 2.'],
 ['Promjena varijable','x = 6\nx = x + 4\nx = x * 2\nprint(x)',20,'Početno x = 6. Nakon sabiranja x = 10. Nakon množenja x = 20.'],
 ['Grananje','x = 8\nif x > 5:\n    x = x - 3\nelse:\n    x = x + 3\nprint(x)',5,'8 > 5 je tačno. Izvršava se prva grana: x = 8 − 3 = 5.'],
 ['Brojanje','s = 0\nfor i in range(1, 5):\n    s += i\nprint(s)',10,'range(1, 5) daje 1, 2, 3, 4. Zbir je 1 + 2 + 3 + 4 = 10.'],
 ['Parni brojevi','s = 0\nfor i in range(2, 9, 2):\n    s += i\nprint(s)',20,'Vrijednosti i su 2, 4, 6 i 8. Njihov zbir je 20.'],
 ['Indeksi liste','a = [4, 7, 9, 2]\nprint(a[2])',9,'Indeksi počinju od 0: a[0] = 4, a[1] = 7, a[2] = 9.'],
 ['Dužina liste','a = [2, 4, 6]\na.append(8)\nprint(len(a))',4,'Početna lista ima 3 elementa. append dodaje još jedan, pa je dužina 4.'],
 ['Uslovno brojanje','n = 0\nfor x in [3, 8, 2, 10, 5]:\n    if x > 5:\n        n += 1\nprint(n)',2,'Veći od 5 su 8 i 10. Uslov je tačan dva puta.'],
 ['While petlja','x = 1\nwhile x < 10:\n    x *= 2\nprint(x)',16,'Redom: 1 → 2 → 4 → 8 → 16. Na 16 uslov više nije tačan.'],
 ['Funkcija','def f(x):\n    return 2 * x + 1\nprint(f(4))',9,'Uvrsti x = 4: 2 · 4 + 1 = 9.'],
 ['Ugniježđene petlje','n = 0\nfor i in range(3):\n    for j in range(2):\n        n += 1\nprint(n)',6,'Vanjska petlja ima 3 prolaza, a unutrašnja 2 po prolazu: 3 · 2 = 6.'],
 ['Najveća vrijednost','a = [6, 12, 4, 9]\nprint(max(a) - min(a))',8,'Najveća vrijednost je 12, najmanja 4. Razlika je 8.'],
 ['Zbir cifara','n = 347\ns = 0\nwhile n > 0:\n    s += n % 10\n    n //= 10\nprint(s)',14,'Redom izdvoji cifre 7, 4 i 3. Zbir 7 + 4 + 3 = 14.'],
 ['Proizvod','p = 1\nfor i in range(1, 5):\n    p *= i\nprint(p)',24,'Početna vrijednost je 1. Pomnoži 1 · 2 · 3 · 4 = 24.'],
 ['Rast niza','a, b = 0, 1\nfor i in range(6):\n    a, b = b, a + b\nprint(a)',8,'Parovi su (1,1), (1,2), (2,3), (3,5), (5,8), (8,13). Završno a = 8.'],
 ['Djeljivost','s = 0\nfor i in range(1, 11):\n    if i % 3 == 0:\n        s += i\nprint(s)',18,'Brojevi djeljivi sa 3 su 3, 6 i 9. Njihov zbir je 18.'],
 ['Rekurzija','def f(n):\n    if n == 0:\n        return 0\n    return n + f(n - 1)\nprint(f(4))',10,'f(4) = 4 + f(3) = 4 + 3 + 2 + 1 + 0 = 10.']
];
bank.python={title:'Python · 20 programskih izazova',grade:0,subject:'Python',featured:true,intro:'Čitanje i razumijevanje Python programa: od osnovnih naredbi do petlji, lista i funkcija. Za svaki prikazani program izračunaj konačni ispis. Ovaj test boduje tvoje odgovore; ne izvršava proizvoljno uneseni Python kod.',questions:python.map(([title,code,answer,explanation])=>({prompt:title+' — koji broj program ispisuje?',code,language:'python',answer,points:5,tolerance:1e-6,explanation}))};
const blocks=[
 ['Promjena vrijednosti',['postavi x na 5','promijeni x za 3','ispiši x'],8,'x = 5, zatim x = 5 + 3 = 8.'],
 ['Robot',['postavi koraci na 0','ponovi 4 puta:','  promijeni koraci za 3','ispiši koraci'],12,'Četiri ponavljanja po 3 koraka daju 4 · 3 = 12.'],
 ['Zbir',['postavi zbir na 7 + 6','ispiši zbir'],13,'Saberi 7 + 6 = 13.'],
 ['Uslov',['postavi x na 9','ako x > 5:','  postavi x na 2 × x','inače:','  postavi x na 0','ispiši x'],18,'9 > 5 je tačno. Izabrana grana daje 2 · 9 = 18.'],
 ['Smanjivanje',['postavi x na 20','ponovi 3 puta:','  promijeni x za −4','ispiši x'],8,'Redom x = 20 → 16 → 12 → 8.'],
 ['Množenje',['postavi x na 2','ponovi 3 puta:','  postavi x na x × 2','ispiši x'],16,'Početno x = 2. Tri udvostručavanja daju 4, 8, 16.'],
 ['Redoslijed',['postavi x na 4','postavi y na x + 2','postavi x na 10','ispiši y'],6,'y dobija vrijednost 4 + 2 = 6. Kasnija promjena x ne mijenja y.'],
 ['Brojač',['postavi n na 0','za i od 1 do 5, uključivo:','  promijeni n za 1','ispiši n'],5,'Vrijednosti i su 1, 2, 3, 4 i 5. Brojač se poveća pet puta.'],
 ['Zbir niza',['postavi zbir na 0','za i od 1 do 5, uključivo:','  promijeni zbir za i','ispiši zbir'],15,'Saberi 1 + 2 + 3 + 4 + 5 = 15.'],
 ['Obim kvadrata',['postavi a na 6','postavi obim na 4 × a','ispiši obim'],24,'Kvadrat ima četiri jednake stranice. O = 4 · 6 = 24.'],
 ['Ugniježđene petlje',['postavi n na 0','ponovi 3 puta:','  ponovi 4 puta:','    promijeni n za 1','ispiši n'],12,'Unutrašnja naredba izvršava se 3 · 4 = 12 puta.'],
 ['Ponovi dok',['postavi x na 0','ponavljaj dok je x < 9:','  promijeni x za 2','ispiši x'],10,'Vrijednosti su 0, 2, 4, 6, 8, 10. Na 10 se petlja završava.'],
 ['Ostatak',['postavi x na ostatak pri dijeljenju 23 sa 5','ispiši x'],3,'23 = 4 · 5 + 3. Ostatak je 3.'],
 ['Logički uslov',['postavi x na 7','ako (x > 3) I (x < 10):','  postavi rezultat na 1','inače:','  postavi rezultat na 0','ispiši rezultat'],1,'Oba uslova su tačna: 7 > 3 i 7 < 10. Rezultat je 1.'],
 ['Lista',['postavi listu na [4, 8, 12]','ispiši drugi element liste'],8,'Drugi element liste je 8; ovdje su redni brojevi prvi, drugi, treći.'],
 ['Zbir elemenata',['postavi zbir na 0','za svaki broj iz [2, 5, 7]:','  promijeni zbir za broj','ispiši zbir'],14,'Saberi sve elemente: 2 + 5 + 7 = 14.'],
 ['Dvije varijable',['postavi a na 3','postavi b na 4','ponovi 2 puta:','  promijeni a za b','ispiši a'],11,'Početno a = 3, b = 4. Nakon dva dodavanja a = 3 + 4 + 4 = 11.'],
 ['Grananje u petlji',['postavi zbir na 0','za i od 1 do 6, uključivo:','  ako je ostatak i ÷ 2 jednak 0:','    promijeni zbir za i','ispiši zbir'],12,'U zbir ulaze parni brojevi 2, 4 i 6. Ukupno 12.'],
 ['Funkcija',['definiši duplo(x): vrati 2 × x','postavi rezultat na duplo(3) + duplo(4)','ispiši rezultat'],14,'duplo(3) = 6, duplo(4) = 8, pa je rezultat 14.'],
 ['Površina i promjena',['postavi a na 4','postavi b na 5','promijeni a za 2','postavi P na a × b','ispiši P'],30,'Nova dužina a = 4 + 2 = 6. Površina je P = 6 · 5 = 30.']
];
bank.blocks={title:'Blokovi · 20 algoritamskih izazova',grade:0,subject:'Blokovi',featured:true,intro:'Prati blokovske naredbe od vrha prema dnu i izračunaj konačan ispis. Uvučeni blokovi pripadaju petlji ili uslovu. Za slobodno slaganje i pokretanje blokova otvori postojeću radionicu.',questions:blocks.map(([title,lines,answer,explanation])=>({prompt:title+' — koji broj blokovi ispisuju?',blocks:lines,answer,points:5,tolerance:1e-6,explanation}))};
for(const lesson of A.lessons)for(const level of [1,2,3]){
 const questions=A.questions(lesson.id,level,17,20).map(convert);
 bank['lesson-'+lesson.id+'-'+level]={title:lesson.title+' · nivo '+level,grade:lesson.grade,subject:lesson.subject==='m'?'Matematika':'Informatika',featured:false,intro:lesson.explain,questions};
}
const json=JSON.stringify(bank,null,2);
fs.writeFileSync(path.join(__dirname,'../website/eldi-edu/online/section-tests.php'),"<?php\ndeclare(strict_types=1);\nreturn json_decode(<<<'ELDI_SECTION_BANK'\n"+json+"\nELDI_SECTION_BANK\n, true, 512, JSON_THROW_ON_ERROR);\n");
console.log(JSON.stringify({tests:Object.keys(bank).length,questions:Object.values(bank).reduce((n,b)=>n+b.questions.length,0),featuredQuestions:Object.values(bank).filter(b=>b.featured).reduce((n,b)=>n+b.questions.length,0)}));
