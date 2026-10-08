'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const {readZip,readPack}=require('../desktop/learning-packs.cjs');

test('Downloadable learning ZIP includes both unchanged books and every runnable source',()=>{
  const zip=fs.readFileSync(path.join(root,'content/packs/ELDI-EDU-10.5.1-Zbirke-i-rjesenja.zip'));
  const {files}=readZip(zip),{pack}=readPack(zip);
  const file=name=>files.get(name);
  assert.equal(pack.books.length,2);
  for(const [name,sha] of Object.entries({'content/books/matematika-pztk.pdf':'85d887f533f0201385caf0942820b43ed235b0c96f7e6cc2e27469b7c504b46e','content/books/programiranje.pdf':'1161f50d1d3e5506eb948434d6ee7f67ad90c4ebaa11b77c58d7f407608054c4'})){
    const bytes=file(name);assert.ok(bytes,'Nedostaje originalna knjiga: '+name);
    assert.equal(bytes.subarray(0,4).toString(),'%PDF');
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),sha);
  }
  const book=pack.books.find(book=>book.subject==='informatics');assert.equal(book.tasks.length,162);
  for(const task of book.tasks)for(const language of ['python','cpp']){
    const solution=task.solutions[language],bytes=file(solution.path);assert.ok(bytes,'Nedostaje kod: '+solution.path);
    assert.equal(bytes.toString('utf8'),solution.code);
    const folder=path.posix.dirname(solution.path);assert.ok(file(folder+'/README.md'));assert.ok(file(folder+'/example-1.in'));assert.ok(file(folder+'/example-1.out'));
  }
  assert.ok(file('SHA256SUMS.txt'));assert.ok(file('README.md'));
});
