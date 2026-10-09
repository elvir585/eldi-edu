'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const result=require('esbuild').buildSync({entryPoints:[path.join(root,'renderer/editor/source.js')],outfile:path.join(root,'renderer/vendor/eldi-editor.js'),bundle:true,minify:true,format:'iife',platform:'browser',target:'chrome140',legalComments:'external',metafile:true});
const packageNames=new Set();
for(const input of Object.keys(result.metafile.inputs)){const match=/node_modules\/((?:@[^/]+\/)?[^/]+)/.exec(input.replace(/\\/g,'/'));if(match)packageNames.add(match[1]);}
const notices=[...packageNames].sort().map(name=>{const folder=path.join(root,'node_modules',name),pkg=JSON.parse(fs.readFileSync(path.join(folder,'package.json'),'utf8')),license=['LICENSE','LICENSE.txt','LICENSE.md'].find(file=>fs.existsSync(path.join(folder,file)));if(!license)throw Error('Missing license: '+name);return `${name} ${pkg.version}\n${fs.readFileSync(path.join(folder,license),'utf8')}`;});
fs.writeFileSync(path.join(root,'renderer/vendor/ELDI-EDITOR-NOTICES.txt'),notices.join('\n\n--------------------\n\n')+'\n');
console.log('Offline code editor built; '+packageNames.size+' dependency notices.');
