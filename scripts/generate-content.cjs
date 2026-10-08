'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function generate(){
 const read=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name),'utf8'));
 const curriculum=read('curriculum.json'),tasks=read('tasks.json');
 const maths=read('math-catalog.json'),info=read('informatics-junior.json').concat(read('informatics-senior.json'));
 for(const [name,items]of [['math',maths],['informatics',info]]){
  assert.equal(items.length,500,`${name}: potrebno je 500 tematskih cjelina.`);
  assert.equal(new Set(items.map(x=>x.id)).size,500,`${name}: ponovljeni identifikatori.`);
  assert.equal(new Set(items.map(x=>x.title)).size,500,`${name}: ponovljeni naslovi.`);
  for(const g of [5,6,7,8,9])assert.equal(items.filter(x=>x.grade===g).length,100,`${name}: ${g}. razred`);
  for(const t of items){assert.ok(t.subject===name&&t.title&&t.category&&t.description&&t.body?.length>=3&&t.example,`${t.id}: nedostaje lekcija.`);if(name==='informatics')assert.ok(t.activity?.fields?.length&&t.activity.steps?.length&&t.activity.prompt,`${t.id}: nedostaje samostalni zadatak.`);}
 }
 fs.writeFileSync(path.join(root,'content/data.js'),'window.ELDI_CONTENT='+JSON.stringify(curriculum)+';\nwindow.ELDI_TASKS='+JSON.stringify(tasks)+';\n');
 fs.writeFileSync(path.join(root,'content/catalog-data.js'),'window.ELDI_MATH_CATALOG='+JSON.stringify(maths)+';\nwindow.ELDI_INFORMATICS_CATALOG='+JSON.stringify(info)+';\n');
 return{maths,info};
}
module.exports=generate;
if(require.main===module){generate();console.log('Sadržaj spreman: 500 matematičkih i 500 informatičkih cjelina.');}
