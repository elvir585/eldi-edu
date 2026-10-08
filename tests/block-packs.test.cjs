'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {createZip,readZip} = require('../desktop/learning-packs.cjs');
const B = require('../desktop/block-packs.cjs');
const {validateCatalog} = require('../app/block-project-catalog.js');
const source = () => JSON.parse(fs.readFileSync(path.join(__dirname,'../content/block-projects.json'),'utf8'));
function singleProject() {
  const raw = source(), project = raw.projects[0];
  raw.projects = [project];raw.families = raw.families.filter(family=>family.id===project.familyId);
  return validateCatalog(raw);
}
test('Full built-in ZIP contains all 1000 individually usable Blockly solutions and matching SHA256 files', () => {
  const version=require('../package.json').version;
  const bytes = fs.readFileSync(path.join(__dirname,`../content/packs/ELDI-EDU-${version}-1000-Blokovskih-projekata.zip`));
  const {catalog,report} = B.readBlockPack(bytes), zip = readZip(bytes);
  assert.equal(catalog.projects.length,1000);assert.equal(report.projects,1000);assert.equal(report.files,5003);
  assert.equal(B.verifyProjectFiles(bytes,catalog).checksums,true);
  for (const project of catalog.projects) {
    const folder = 'projects/'+project.id;
    const solution = JSON.parse(zip.files.get(folder+'/solution.json'));
    assert.equal(solution.format,'ELDI-BLOCKS-1');assert.deepEqual(solution,project.solution);
    assert.deepEqual(JSON.parse(zip.files.get(folder+'/tests.json')),project.tests);
    assert.equal(zip.files.get(folder+'/input.txt').toString('utf8'),project.tests[0].input);
    assert.ok(zip.files.get(folder+'/README.md').toString('utf8').includes(project.title));
  }
  const lines = zip.files.get('SHA256SUMS.txt').toString('utf8').trim().split('\n');
  assert.equal(lines.length,zip.files.size-1);
  for (const line of lines) {
    const match = /^([a-f0-9]{64})  (.+)$/.exec(line);assert.ok(match);
    assert.equal(crypto.createHash('sha256').update(zip.files.get(match[2])).digest('hex'),match[1]);
  }
});
test('Validated custom ZIP and plain UTF8 JSON import without modifying workspaces, inputs or checks', () => {
  const catalog = singleProject(), original = JSON.stringify(catalog);
  const bytes = B.createBlockPack(catalog), roundtrip = B.readBlockPack(bytes);
  assert.deepEqual(roundtrip.catalog,catalog);assert.equal(roundtrip.report.projects,1);assert.equal(roundtrip.report.files,8);
  const json = Buffer.concat([Buffer.from('\xef\xbb\xbf \n','latin1'),Buffer.from(JSON.stringify(catalog),'utf8')]);
  assert.deepEqual(B.readBlockPack(new Uint8Array(json)).catalog,catalog);
  assert.equal(JSON.stringify(catalog),original);
  assert.deepEqual(B.readBlockPack(new Uint8Array(bytes)).catalog.projects[0].solution,catalog.projects[0].solution);
});
test('Block manifests reject invalid UTF8, wrong format, absent manifests and unknown block data before any execution', () => {
  assert.throws(()=>B.readBlockPack(Buffer.from([0x7b,0x22,0xff,0x22,0x3a,0x30,0x7d])),/UTF-8/);
  assert.throws(()=>B.readBlockPack(Buffer.from('{"format":"ELDI-LEARNING-PACK","version":1,"books":[]}')));
  assert.throws(()=>B.readBlockPack(createZip([{name:'nested/pack.json',bytes:JSON.stringify(singleProject())}])));
  assert.throws(()=>B.readBlockPack(Buffer.alloc(B.MAX_PACK_BYTES+1)),/30 MB/);
  assert.throws(()=>B.createBlockPack({format:'invalid',version:1,projects:[],families:[]}));
  const invalid = singleProject();invalid.projects[0].solution.format = 'script';
  const before = JSON.stringify(invalid);assert.throws(()=>B.createBlockPack(invalid));assert.equal(JSON.stringify(invalid),before);
});
test('ZIP integrity rejects a CRC-valid tampered standalone solution while imports remain data-only', () => {
  const catalog = singleProject(), original = B.createBlockPack(catalog), files = readZip(original).files;
  const file = 'projects/'+catalog.projects[0].id+'/solution.json';
  files.set(file,Buffer.from('{"format":"ELDI-BLOCKS-1","workspace":{"blocks":{"blocks":[]}}}\n'));
  const tampered = createZip([...files].map(([name,bytes])=>({name,bytes})));
  assert.equal(B.readBlockPack(tampered).catalog.projects.length,1);
  assert.throws(()=>B.verifyProjectFiles(tampered,catalog),/izmijenjenu/);
});
test('Custom projects with a single default check export usable input and test files', () => {
  const catalog=singleProject(),project=catalog.projects[0];delete project.tests;
  const bytes=B.createBlockPack(catalog),files=readZip(bytes).files;
  assert.deepEqual(JSON.parse(files.get('projects/'+project.id+'/tests.json')),[{input:project.input,check:project.check}]);
  assert.equal(files.get('projects/'+project.id+'/input.txt').toString('utf8'),project.input);
  assert.equal(B.readBlockPack(bytes).catalog.projects[0].tests,undefined);
});
