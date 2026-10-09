'use strict';
// Use the application's own catalogues so the website does not invent a curriculum.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const map = require('../content/curriculum-map.js');
const challenges = require('../content/program-assessments.js');
const blocks = require('../content/block-projects.json');
const blockRows = Array.isArray(blocks) ? blocks : blocks.projects;
const rows = [];
for (let grade=5;grade<=9;grade++) {
  const math = map.units.filter(unit=>unit.grade===grade && unit.subject==='math');
  const programs = challenges.filter(task=>task.grade===grade);
  const blockTasks = blockRows.filter(task=>task.grade===grade);
  rows.push({grade,subject:'math',title:'Matematika',icon:'∑',description:`${math.reduce((n,unit)=>n+unit.lessonIds.length,0)} vještina: objašnjenja, primjeri i praktični zadaci.`,topics:math.map(unit=>unit.title)});
  rows.push({grade,subject:'scratch',title:'Scratch i Blockly',icon:'◇',description:`Scratch studio za .sb3 projekte i ${blockTasks.length} riješenih Blockly projekata za ovaj razred.`,topics:[...new Set(blockTasks.map(task=>task.category))]});
  rows.push({grade,subject:'programming',title:'Programiranje',icon:'{ }',description:`${programs.length} programerskih izazova s testovima. Python, C, C++ i Java u Windows aplikaciji.`,topics:programs.map(task=>task.title)});
}
const target=path.join(root,'website','eldi-edu');
fs.writeFileSync(path.join(target,'catalog.js'),'window.ELDI_WEB_CATALOG = '+JSON.stringify(rows,null,2)+';\n');
fs.writeFileSync(path.join(target,'PREGLED-SADRZAJA.txt'),'ELDI EDU 11.0.1 — PREGLED SADRŽAJA\nUrednički plan; nastavnik provjerava povezanost sa službenim ishodima.\n\n'+rows.map(row=>`${row.grade}. RAZRED / ${row.title}\n${row.description}\n${row.topics.map(topic=>'• '+topic).join('\n')}`).join('\n\n')+'\n');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initial=rows.filter(r=>r.grade===5).map(row=>`<article class="course-card"><span class="course-icon" aria-hidden="true">${esc(row.icon)}</span><h3>${esc(row.title)}</h3><p>${esc(row.description)}</p><ul>${row.topics.slice(0,5).map(t=>`<li>${esc(t)}</li>`).join('')}</ul><a class="text-link" href="#preuzimanje">Dostupno u Windows aplikaciji ↗</a></article>`).join('');
const page=path.join(target,'index.html');
let html=fs.readFileSync(page,'utf8');
html=html.replace(/(<div id="catalog" class="catalog-grid">)[\s\S]*?(<\/div><noscript>)/,'$1'+initial+'$2');
fs.writeFileSync(page,html);
console.log(`Web katalog: ${rows.length} oblasti, 5 razreda.`);
