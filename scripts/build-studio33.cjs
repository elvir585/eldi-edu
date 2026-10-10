'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
require('esbuild').buildSync({entryPoints:[path.join(root,'renderer/studio33/source.js')],outfile:path.join(root,'renderer/vendor/eldi-studio33.js'),bundle:true,minify:true,format:'iife',platform:'browser',target:'chrome140',legalComments:'external'});
for(const name of ['sql-wasm.js','sql-wasm.wasm'])fs.copyFileSync(path.join(root,'node_modules/sql.js/dist',name),path.join(root,'renderer/vendor',name));
for(const pkg of ['sql.js','fflate','acorn']){const folder=path.join(root,'node_modules',pkg),license=fs.readdirSync(folder).find(n=>/^licen[cs]e/i.test(n));if(license)fs.copyFileSync(path.join(folder,license),path.join(root,'renderer/vendor',pkg.replace('.','-')+'-LICENSE.txt'));}
console.log('ELDI Studio 33: offline 3D, web, SQLite i projektne radionice su ugrađene.');
