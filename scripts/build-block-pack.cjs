'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
function buildBlockPack() {
  const {validateCatalog} = require('../app/block-project-catalog.js');
  const {createBlockPack,readBlockPack,verifyProjectFiles} = require('../desktop/block-packs.cjs');
  const catalog = validateCatalog(JSON.parse(fs.readFileSync(path.join(root,'content','block-projects.json'),'utf8')));
  if (catalog.projects.length !== 1000) throw new Error('Ugradjena biblioteka mora imati 1000 rijesenih projekata.');
  const bytes = createBlockPack(catalog), roundtrip = readBlockPack(bytes);
  const verified = verifyProjectFiles(bytes,roundtrip.catalog);
  const filename = 'ELDI-EDU-11.0.0-1000-Blokovskih-projekata.zip';
  const folder = path.join(root,'content','packs');fs.mkdirSync(folder,{recursive:true});
  fs.writeFileSync(path.join(folder,filename),bytes);
  fs.writeFileSync(path.join(root,'content','block-projects-data.js'),'window.ELDI_BLOCK_PROJECTS='+JSON.stringify(catalog)+';\n');
  return {filename,projects:catalog.projects.length,families:catalog.families.length,files:verified.files,bytes:bytes.length};
}
module.exports = buildBlockPack;
if (require.main === module) console.log('Blokovski projekti i ZIP:',JSON.stringify(buildBlockPack()));
