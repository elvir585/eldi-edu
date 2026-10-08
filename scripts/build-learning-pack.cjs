'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');

function buildLearningPack() {
  const {validatePack} = require('../app/content-pack.js');
  const {createZip, readPack} = require('../desktop/learning-packs.cjs');
  const books = ['book-math.json', 'book-programming.json'].map(name => JSON.parse(fs.readFileSync(path.join(root, 'content', name), 'utf8')));
  const pack = validatePack({format:'ELDI-LEARNING-PACK',version:1,books});
  const entries = [{name:'pack.json',bytes:Buffer.from(JSON.stringify(pack,null,2)+'\n')}];
  const readme = [
    '# ELDI EDU 11.0.1 - Zbirke i rjesenja', '',
    'Autori aplikacije: Dino Isanovic, Elvir Cajic, Damir Bajric i Jasmin Suljkanovic.',
    'Programerska knjiga: Elvir Cajic. Matematicka zbirka: Pedagoski zavod Tuzlanskog kantona, januar 2016.', '',
    'Sadrzaj: obje originalne PDF knjige, 162 programerska zadatka sa Python 3 i C++17 kodom, objavljeni primjeri ulaza/izlaza, odabrani razradjeni matematicki zadaci i manifest za uvoz.', '',
    '1. Raspakujte ZIP. Originali su u content/books/.',
    '2. Programi su u content/solutions/programming/. Svaki zadatak ima solution.py, solution.cpp, README.md, example-1.in i example-1.out.',
    '3. Windows CMD, Python: python solution.py < example-1.in',
    '4. Windows CMD, C++: g++ -std=c++17 -O2 solution.cpp -o solution.exe; zatim solution.exe < example-1.in.',
    '5. U ELDI EDU otvorite Zbirke i rjesenja > Uvezi JSON / ZIP i odaberite cijeli ZIP ili pack.json. Uvoz pravi vlastite kopije zbirki u profilu; originali ostaju dostupni u aplikaciji.',
    '6. Pomoc i rjesenja otvarajte postupno. Kod mozete poslati u ugradjeni editor i stvarno pokrenuti.', '',
    'Za terminalske naredbe Python 3 i g++ moraju biti dostupni na PATH. ELDI EDU Windows editor sadrzi vlastite jezicke alate.', '',
    'Provjere programskih rjesenja obuhvataju sintaksu/kompilaciju i objavljene primjere; nisu sluzbeni skriveni testovi.',
    'Matematicki PDF ostaje neizmijenjen. Digitalne ispravke i odabrana pomoc jasno su oznacene u katalogu.',
    '1000 Blockly projekata dostupno je u zasebnom ZIP paketu Blokovskih-projekata. AI asistent podrzava prijavu ChatGPT racunom bez API kljuca, a dodatno API ili lokalni Ollama model.', ''
  ].join('\n');
  entries.push({name:'README.md',bytes:Buffer.from(readme)});
  const addFile = relative => entries.push({name:relative,bytes:fs.readFileSync(path.join(root,relative))});
  for(const file of ['content/books/matematika-pztk.pdf','content/books/programiranje.pdf','content/book-math.json','content/book-programming.json','content/programming-verification.json']) addFile(file);
  function addDirectory(relative) {
    for(const item of fs.readdirSync(path.join(root,relative),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
      const name=relative+'/'+item.name;
      if(item.isDirectory())addDirectory(name);
      else if(item.isFile()&&!/\.(pyc|exe|bin)$/.test(item.name))addFile(name);
    }
  }
  addDirectory('content/solutions/programming');
  const sums = entries.map(entry=>crypto.createHash('sha256').update(entry.bytes).digest('hex')+'  '+entry.name).join('\n')+'\n';
  entries.push({name:'SHA256SUMS.txt',bytes:Buffer.from(sums)});
  const bytes=createZip(entries);
  const read=readPack(bytes);
  if(read.pack.books.length!==2)throw Error('ZIP mora sadržavati obje zbirke.');
  const folder=path.join(root,'content','packs');fs.mkdirSync(folder,{recursive:true});
  const filename='ELDI-EDU-11.0.1-Zbirke-i-rjesenja.zip';
  fs.writeFileSync(path.join(folder,filename),bytes);
  fs.writeFileSync(path.join(root,'content','books-data.js'),'window.ELDI_BOOKS='+JSON.stringify(pack.books)+';\n');
  return {filename,books:pack.books.length,tasks:pack.books.reduce((n,b)=>n+b.tasks.length,0),files:entries.length,bytes:bytes.length};
}
module.exports=buildLearningPack;
if(require.main===module)console.log('Zbirke i ZIP:',JSON.stringify(buildLearningPack()));
