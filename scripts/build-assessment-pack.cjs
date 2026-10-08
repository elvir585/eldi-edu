'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const tasks=require('../content/program-assessments.js');
const bank=require('../desktop/program-assessment-data.cjs');
const {createZip,readZip}=require('../desktop/learning-packs.cjs');
function build(){
  const entries=[];
  const add=(name,content)=>entries.push({name,bytes:Buffer.from(content,'utf8')});
  const manifest={format:'ELDI-PROGRAMMING-STUDY-PACK',version:1,edition:'11.0.0',tasks:tasks.map(t=>({id:t.id,title:t.title,grade:t.grade,category:t.category,difficulty:t.difficulty,folder:`${t.grade}-razred/${t.id}`})),hiddenTestsIncluded:false};
  add('manifest.json',JSON.stringify(manifest,null,2)+'\n');
  add('PROCITAJ-ME.txt','ELDI EDU 11.0 — Programerski izazovi\n\n55 originalnih zadataka; 11 po razredu od 5. do 9.\nSvaki zadatak ima opis, dva javna primjera, nacrte za Python/C/C++/Javu i provjerena referentna rješenja u Pythonu i C++.\nZadaci 9. razreda uključuju naprednu dopunu za zainteresovane učenike.\n\nOtvorite programski kod u ELDI EDU editoru ili vlastitom razvojnom okruženju. U aplikaciji, Programerska zbirka provjerava osam testova po zadatku. Skriveni testovi se ne nalaze u ovom nastavnom ZIP-u. Paket je za čitanje i rad s kodom; nije JSON/Blockly paket za uvoz.\n\nAutori aplikacije: Dino Isanović, Elvir Čajić, Damir Bajrić i Jasmin Suljkanović.\n');
  for(const t of tasks){const folder=`${t.grade}-razred/${t.id}`;
    add(`${folder}/ZADATAK.txt`,`${t.title}\n${t.grade}. razred — ${t.category} — nivo ${t.difficulty}/5${t.enrichment?' — napredna dopuna':''}\n\n${t.statement}\n\nULAZ\n${t.inputFormat}\n\nIZLAZ I OGRANIČENJA\n${t.outputFormat}\n\nKAKO RAZMISLITI\n${t.concepts.map((x,i)=>`${i+1}. ${x}`).join('\n')}\n`);
    t.sampleTests.forEach((s,i)=>{add(`${folder}/primjeri/${i+1}.in`,s.input);add(`${folder}/primjeri/${i+1}.out`,s.output);});
    for(const [language,extension]of Object.entries({python:'py',c:'c',cpp:'cpp',java:'java'}))add(`${folder}/nacrti/${language==='java'?'Main':'main'}.${extension}`,t.starters[language]);
    add(`${folder}/rjesenja/main.py`,bank[t.id].solutions.python);add(`${folder}/rjesenja/main.cpp`,bank[t.id].solutions.cpp);
  }
  const sums=entries.map(e=>`${crypto.createHash('sha256').update(e.bytes).digest('hex')}  ${e.name}`).join('\n')+'\n';add('SHA256SUMS.txt',sums);
  const bytes=createZip(entries);const verified=readZip(bytes);if(verified.files.size!==entries.length)throw Error('ZIP provjera nije uspjela.');
  const filename='ELDI-EDU-11.0.0-Programerski-izazovi.zip',folder=path.resolve(__dirname,'..','content','packs');fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,filename),bytes);
  return{filename,tasks:tasks.length,files:entries.length,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
}
module.exports=build;
if(require.main===module)console.log(JSON.stringify(build()));
