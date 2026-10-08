'use strict';
const crypto = require('node:crypto');
const {readZip, createZip, MAX_PACK_BYTES} = require('./learning-packs.cjs');
const {validateCatalog} = require('../app/block-project-catalog.js');
const decoder = new TextDecoder('utf-8', {fatal:true});
function buffer(value) {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  if (ArrayBuffer.isView(value)) return Buffer.from(value.buffer,value.byteOffset,value.byteLength);
  throw new Error('Blokovski paket mora biti JSON ili ZIP datoteka.');
}
function parse(bytes) {
  let value;
  try { value = JSON.parse(decoder.decode(bytes).trim()); }
  catch { throw new Error('pack.json nije ispravan UTF-8 JSON dokument.'); }
  return validateCatalog(value);
}
function report(catalog, files, expandedBytes) {
  return {projects:catalog.projects.length,families:catalog.families.length,files:files.length,filePaths:files,expandedBytes};
}
function readBlockPack(value) {
  const bytes = buffer(value);
  if (bytes.length > MAX_PACK_BYTES) throw new Error('Blokovski paket smije imati do 30 MB.');
  let offset = 0;
  while (offset < bytes.length) {
    if ([9,10,13,32].includes(bytes[offset])) { offset++; continue; }
    if (bytes[offset]===0xef && bytes[offset+1]===0xbb && bytes[offset+2]===0xbf) { offset+=3; continue; }
    break;
  }
  if (bytes[offset]===0x7b || bytes[offset]===0x5b) {
    const catalog = parse(bytes);
    return {catalog,report:report(catalog,['pack.json'],bytes.length)};
  }
  const zip = readZip(bytes), manifest = zip.files.get('pack.json');
  if (!manifest) throw new Error('ZIP blokovskih projekata mora sadržavati pack.json u glavnom direktoriju.');
  const catalog = parse(manifest);
  return {catalog,report:report(catalog,[...zip.files.keys()],zip.expandedBytes)};
}
// Compact serialization keeps complete nested Blockly workspaces within the
// import limit; instructions stay readable in the accompanying Markdown files.
const json = value => Buffer.from(JSON.stringify(value)+'\n','utf8');
const projectFolder = project => 'projects/'+project.id;
function createBlockEntries(value) {
  const catalog = validateCatalog(value);
  const entries = [{name:'pack.json',bytes:json(catalog)}];
  entries.push({name:'README.md',bytes:Buffer.from([
    '# ELDI EDU - Rijeseni blokovski projekti','',
    'Autori aplikacije: Dino Isanovic, Elvir Cajic, Damir Bajric i Jasmin Suljkanovic.','',
    'U aplikaciji otvorite Blokovski studio > Biblioteka > Uvezi paket i odaberite cijeli ZIP ili pack.json.',
    'Uvoz dodaje projekte u trenutni profil. Ne pokrece programe. Za stvarno izvrsavanje otvorite projekat u studiju i pritisnite Pokreni.',
    'Svaki projekat sadrzi solution.json (ELDI-BLOCKS-1), upute README.md, tests.json i prvi primjer input.txt / expected.txt.',
    'Pojedinacni solution.json mozete uvesti i kroz postojece dugme Uvezi projekat u studiju.',
    'Otvori rjesenje oznacava rad kao rad uz pomoc. Samostalna provjera zahtijeva vlastito rjesenje i pokretanje na podrzanom test-ulazu.',
    'Broj projekata ukljucuje algoritamske porodice i obrazlozene varijante; ne oznacava toliko zasebnih algoritama.',
    'AI asistent se zasebno konfigurise u aplikaciji. Ovaj ZIP ne sadrzi API kljuc ili AI uslugu.',
    'SHA256SUMS.txt daje kontrolne otiske svih ostalih datoteka.',''
  ].join('\n'),'utf8')});
  for (const project of catalog.projects) {
    const folder = projectFolder(project);
    const tests = Array.isArray(project.tests) && project.tests.length ? project.tests : [{input:project.input || '',check:project.check}];
    const hints = Array.isArray(project.hints) ? project.hints : [];
    const steps = Array.isArray(project.steps) ? project.steps : [];
    const text = ['# '+project.title,'',project.statement || project.description || '', '',
      'Razred: '+project.grade,'Porodica: '+project.familyId,'Nivo: '+project.difficulty,'',
      '## Pomoc',...hints.map((hint,index)=>(index+1)+'. '+hint),'',
      '## Postupak',...steps.map((step,index)=>(index+1)+'. '+step),'',
      'Uvezite solution.json u ELDI EDU blokovski studio. Prvi ulaz je u input.txt, ocekuje se rezultat iz expected.txt.',
      'Sve pripremljene provjere opisane su u tests.json.',''].join('\n');
    entries.push({name:folder+'/solution.json',bytes:json(project.solution)});
    entries.push({name:folder+'/README.md',bytes:Buffer.from(text,'utf8')});
    entries.push({name:folder+'/tests.json',bytes:json(tests)});
    entries.push({name:folder+'/input.txt',bytes:Buffer.from(tests[0].input, 'utf8')});
    entries.push({name:folder+'/expected.txt',bytes:Buffer.from(tests[0].expected ?? tests[0].check?.expected ?? '', 'utf8')});
  }
  const sums = entries.map(entry=>crypto.createHash('sha256').update(entry.bytes).digest('hex')+'  '+entry.name).join('\n')+'\n';
  entries.push({name:'SHA256SUMS.txt',bytes:Buffer.from(sums,'utf8')});
  return {catalog,entries};
}
function createBlockPack(value) { return createZip(createBlockEntries(value).entries); }
function verifyProjectFiles(bytes, value) {
  const catalog = validateCatalog(value), zip = readZip(bytes);
  const expected = createBlockEntries(catalog).entries;
  for (const entry of expected) {
    const actual = zip.files.get(entry.name);
    if (!actual || !actual.equals(entry.bytes)) throw new Error('Blokovski ZIP ima izmijenjenu ili nedostajucu datoteku: '+entry.name);
  }
  if (zip.files.size !== expected.length) throw new Error('Blokovski ZIP ima neocekivane dodatne datoteke.');
  return {projects:catalog.projects.length,files:zip.files.size,checksums:true};
}
module.exports = {readBlockPack,createBlockPack,createBlockEntries,verifyProjectFiles,MAX_PACK_BYTES};
