'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const {deflateRawSync} = require('node:zlib');
const P = require('../app/content-pack.js'), Z = require('../desktop/learning-packs.cjs');
function fixture() {
  return {format:'ELDI-LEARNING-PACK',version:1,books:[{id:'moje-programiranje',title:'Moja sekcija Čajić',subject:'informatics',description:'Samostalno dodani zadaci',chapters:[{id:'sabiranje',title:'Sabiranje'}],tasks:[{id:'moj-zbir',title:'Zbir dva broja',subject:'informatics',grade:6,chapterId:'sabiranje',statement:'Učitaj dva broja i ispiši zbir.',help:['Prvo izdvoji podatke.'],steps:['Učitaj.','Saberi.','Ispiši.'],examples:[{input:'7 5\n',output:'12\n',explanation:'Zbir je 12.'}],solutions:{python:{code:'a, b = map(int, input().split())\nif a < b:\n    print(a + b)\nelse:\n    print(b + a)\n',status:'primjeri-provjereni',verification:{examples:1}},cpp:{code:'#include <iostream>\nint main() { long long a, b; std::cin >> a >> b; std::cout << a+b << "\\n"; }\n'}},notes:['Moj zapis.']}]}]};
}
function singleZip(name, value, options = {}) {
  const contents = Buffer.from(value), nameBytes = Buffer.from(name), compressed = options.deflated ? deflateRawSync(contents) : contents, crc = Z.crc32(contents), expanded = options.expanded ?? contents.length;
  const local=Buffer.alloc(30),central=Buffer.alloc(46),end=Buffer.alloc(22),flags=options.encrypted?1:0x800,method=options.deflated?8:0;
  local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(flags,6);local.writeUInt16LE(method,8);local.writeUInt32LE(crc,14);local.writeUInt32LE(compressed.length,18);local.writeUInt32LE(expanded,22);local.writeUInt16LE(nameBytes.length,26);
  central.writeUInt32LE(0x02014b50);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);central.writeUInt16LE(flags,8);central.writeUInt16LE(method,10);central.writeUInt32LE(crc,16);central.writeUInt32LE(compressed.length,20);central.writeUInt32LE(expanded,24);central.writeUInt16LE(nameBytes.length,28);central.writeUInt32LE(options.attributes||0,38);
  end.writeUInt32LE(0x06054b50);end.writeUInt16LE(1,8);end.writeUInt16LE(1,10);end.writeUInt32LE(central.length+nameBytes.length,12);end.writeUInt32LE(local.length+nameBytes.length+compressed.length,16);
  return Buffer.concat([local,nameBytes,compressed,central,nameBytes,end]);
}

test('Learning ZIP round trip preserves Unicode, program indentation, examples and independent source files',()=>{
  const original=fixture(),before=JSON.stringify(original),zip=Z.createPackZip(original),{pack,report}=Z.readPack(zip);
  assert.equal(JSON.stringify(original),before);assert.deepEqual(pack,P.validatePack(original));
  assert.equal(report.books,1);assert.equal(report.tasks,1);assert.equal(report.solutions,2);assert.equal(report.files,4);
  const files=Z.readZip(zip).files;assert.equal(files.get('solutions/moje-programiranje/moj-zbir.py').toString(),original.books[0].tasks[0].solutions.python.code);
  assert.equal(files.get('solutions/moje-programiranje/moj-zbir.cpp').toString(),original.books[0].tasks[0].solutions.cpp.code);
  assert.ok(report.filePaths.includes('README.txt'));assert.equal(pack.books[0].tasks[0].examples[0].output,'12\n');
  assert.deepEqual(Z.readPack(new Uint8Array(zip)).pack,pack);
  assert.deepEqual(Z.readPack(zip.buffer.slice(zip.byteOffset,zip.byteOffset+zip.byteLength)).pack,pack);
});

test('Normal ZIP deflation is read without dependencies and bounded official PDFs remain embedded assets',()=>{
  const pack=fixture(),zip=singleZip('pack.json',JSON.stringify(pack),{deflated:true});
  assert.deepEqual(Z.readPack(zip).pack,P.validatePack(pack));
  const file=Buffer.from('%PDF-1.7\nplaceholder test bytes\n'),full=Z.createPackZip(pack,{files:{'content/books/programiranje.pdf':file,'catalog.json':'{}\n'}});
  assert.ok(Z.readPack(full).report.filePaths.includes('content/books/programiranje.pdf'));
  assert.deepEqual(Z.readZip(full).files.get('content/books/programiranje.pdf'),file);
  const official={id:'pztk-matematika',title:'Matematika',subject:'math',sourceFile:'content/books/matematika-pztk.pdf',chapters:[],tasks:[]};
  assert.equal(P.normalizeBook(official).sourceFile,official.sourceFile);
  for(const sourceFile of ['/tmp/book.pdf','../book.pdf','content/books/programiranje.pdf']) assert.throws(()=>P.normalizeBook({...official,sourceFile}));
  assert.throws(()=>P.normalizeBook({...official,id:'custom'}));
});

test('Content validation limits sections, tasks and code and rejects ambiguous references without mutation',()=>{
  const pack=fixture();assert.throws(()=>P.validatePack({...pack,version:2}));assert.throws(()=>P.validatePack({...pack,books:Array(31).fill(pack.books[0])}));
  const duplicate=structuredClone(pack);duplicate.books[0].tasks.push(duplicate.books[0].tasks[0]);assert.throws(()=>P.validatePack(duplicate),/više puta/);
  const invalid=structuredClone(pack);invalid.books[0].tasks[0].chapterId='missing';assert.throws(()=>P.validatePack(invalid),/poglavlje/);
  const huge=structuredClone(pack);huge.books[0].tasks[0].solutions.python.code='😀'.repeat(32769);assert.throws(()=>P.validatePack(huge),/128 KB/);
  for(const path of ['../../x.py','C:/x.py','a\\b.py','/x.py','a/../x.py','a/./x.py','COM1.py','x.py '])assert.throws(()=>P.safeRelativePath(path));
  const unknown=structuredClone(pack);unknown.books[0].tasks[0].onLoad='run';assert.equal(P.validatePack(unknown).books[0].tasks[0].onLoad,undefined);
  const hostile=JSON.parse('{"__proto__":{"polluted":true}}');const proto=structuredClone(pack);proto.books[0].tasks[0].solutions.python.verification=hostile;assert.throws(()=>P.validatePack(proto));assert.equal({}.polluted,undefined);
});

test('ZIP traversal, symlinks, encryption, duplicates and unbounded expansion fail before import',()=>{
  const body=JSON.stringify(fixture());
  for(const path of ['../pack.json','/pack.json','C:/pack.json','folder\\pack.json','folder/../pack.json'])assert.throws(()=>Z.readPack(singleZip(path,body)));
  assert.throws(()=>Z.readPack(singleZip('pack.json',body,{encrypted:true})),/Šifriran/);
  assert.throws(()=>Z.readPack(singleZip('pack.json',body,{attributes:0xa0000000})),/veze/);
  assert.throws(()=>Z.readPack(singleZip('pack.json','{}',{deflated:true,expanded:P.MAX_PACK_BYTES+1})),/veličinu/);
  assert.throws(()=>Z.readPack(singleZip('pack.json',' '.repeat(2*1024*1024),{deflated:true})),/omjer/);
  assert.throws(()=>Z.createZip([{name:'A.txt',bytes:'a'},{name:'a.txt',bytes:'b'}]),/Ponovljeno/);
  assert.throws(()=>Z.readPack(Buffer.alloc(P.MAX_PACK_BYTES+1)),/30 MB/);
});

test('Corrupt CRC, truncated archives, mismatched local names and expansion lengths are rejected atomically',()=>{
  const zip=Z.createPackZip(fixture()),before=Buffer.from(zip),corrupt=Buffer.from(zip);corrupt[30+Buffer.byteLength('pack.json')+20]^=1;
  assert.throws(()=>Z.readPack(corrupt),/kontrolni/);assert.deepEqual(zip,before);
  assert.throws(()=>Z.readPack(zip.subarray(0,zip.length-10)),/nepotpun/);
  const names=Buffer.from(zip);names[30]='b'.charCodeAt(0);assert.throws(()=>Z.readPack(names),/Ime/);
  assert.throws(()=>Z.readPack(singleZip('pack.json',JSON.stringify(fixture()),{deflated:true,expanded:1})),/oštećena/);
  assert.throws(()=>Z.readPack(singleZip('other.json','{}')),/pack.json/);
  assert.throws(()=>Z.readPack(singleZip('pack.json','{bad')),/JSON/);
});

test('Numeric programming chapters normalize consistently while mathematics answer metadata survives',()=>{
  const book={id:'mixed-math',title:'Razlomci',subject:'math',chapters:[{number:6,title:'Razlomci',pageFrom:15,pageTo:18}],tasks:[{id:'razlomak-1',title:'Zbir',grade:6,chapter:6,statement:'1/2 + 1/4',help:'Nađi zajednički imenilac.',solution:['2/4+1/4=3/4'],answer:{type:'fraction',value:'3/4',accepted:['0,75','0.75'],tolerance:0.001},answerPrompt:'Upiši razlomak.',source:{page:16,solutionPage:18,taskNumber:1}}]};
  const normalized=P.validatePack({format:'ELDI-LEARNING-PACK',version:1,books:[book]}).books[0];
  assert.equal(normalized.chapters[0].id,'chapter-6');assert.equal(normalized.tasks[0].chapterId,'chapter-6');assert.deepEqual(normalized.tasks[0].help,[book.tasks[0].help]);assert.deepEqual(normalized.tasks[0].answer,book.tasks[0].answer);assert.deepEqual(normalized.tasks[0].source,book.tasks[0].source);
});

test('Python standard-library ZIP fixtures import including comments and streaming data descriptors',()=>{
  // Produced independently by Python zipfile.ZipFile, not by the application writer.
  const samples=[
    'UEsDBBQAAAAIAO9tSF1ICxydOAAAADYAAAAJAAAAcGFjay5qc29uq1ZKyy/KTSxRslJy9XHx1PVxdQzy8/Rz1w1wdPZW0lEqSy0qzszPU7Iy1FFKys/PLlayio6tBQBQSwECFAMUAAAACADvbUhdSAscnTgAAAA2AAAACQAAAAAAAAAAAAAAgAEAAAAAcGFjay5qc29uUEsFBgAAAAABAAEANwAAAF8AAAAjAFB5dGhvbiBzdGFuZGFyZC1saWJyYXJ5IFpJUCBmaXh0dXJl',
    'UEsDBBQACAAIAPNtSF0AAAAAAAAAAAAAAAAJAAAAcGFjay5qc29uq1ZKyy/KTSxRslJy9XHx1PVxdQzy8/Rz1w1wdPZW0lEqSy0qzszPU7Iy1FFKys/PLlayio6tBQBQSwcISAscnTgAAAA2AAAAUEsBAhQDFAAIAAgA821IXUgLHJ04AAAANgAAAAkAAAAAAAAAAAAAAIABAAAAAHBhY2suanNvblBLBQYAAAAAAQABADcAAABvAAAAAAA='
  ];
  for(const sample of samples)assert.deepEqual(Z.readPack(Buffer.from(sample,'base64')).pack,{format:'ELDI-LEARNING-PACK',version:1,books:[]});
  assert.equal(Z.crc32(Buffer.from('123456789')),0xcbf43926);
});

test('Imported mathematics answers require the exact value type used by the answer controls',()=>{
  const base={id:'moja-matematika',title:'Moja matematika',subject:'math',chapters:[],tasks:[{id:'moj-odgovor',title:'Rezultat',subject:'math',grade:6,statement:'Izračunaj rezultat.'}]};
  const validate=answer=>P.validatePack({format:'ELDI-LEARNING-PACK',version:1,books:[{...base,tasks:[{...base.tasks[0],answer}]}]});
  for(const type of ['tuple','set']) for(const value of [null,{},'1;2',[null],[{}],['nije broj'],Array(101).fill(1)]) assert.throws(()=>validate({type,value}));
  for(const type of ['number','fraction']) for(const value of [null,{},[],NaN,Infinity,'abc','1/0','1e999']) assert.throws(()=>validate({type,value}));
  assert.throws(()=>validate({type:'tuple',value:[]}));assert.throws(()=>validate({type:'text',value:{}}));
  for(const answer of [{type:'number',value:42},{type:'number',value:'1,5'},{type:'fraction',value:'3/4'},{type:'tuple',value:[1,'2/3'],orderSensitive:false},{type:'set',value:[]},{type:'text',value:'da'},{type:'manual',value:'Dokaz'}]) assert.deepEqual(validate(answer).books[0].tasks[0].answer,answer);
});
