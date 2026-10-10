'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
require('esbuild').buildSync({entryPoints:[path.join(root,'renderer/studio33/source.js')],outfile:path.join(root,'renderer/vendor/eldi-studio33.js'),bundle:true,minify:true,format:'iife',platform:'browser',target:'chrome140',legalComments:'external'});
for(const name of ['sql-wasm.js','sql-wasm.wasm'])fs.copyFileSync(path.join(root,'node_modules/sql.js/dist',name),path.join(root,'renderer/vendor',name));
for(const pkg of ['sql.js','fflate','acorn']){const folder=path.join(root,'node_modules',pkg),license=fs.readdirSync(folder).find(n=>/^licen[cs]e/i.test(n));if(license)fs.copyFileSync(path.join(folder,license),path.join(root,'renderer/vendor',pkg.replace('.','-')+'-LICENSE.txt'));}
// A sandboxed file:// frame has an opaque origin and cannot load a local script.
// Keep its trusted bootstrap inside the document; do not add allow-same-origin
// or relax the parent application's CSP/webSecurity settings.
const previewPath=path.join(root,'renderer/studio33-preview.html');
const bootstrap=fs.readFileSync(path.join(root,'renderer/studio33-preview.js'),'utf8');
fs.writeFileSync(previewPath,fs.readFileSync(previewPath,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/,()=>'<script>\n'+bootstrap+'\n</script>'));
console.log('ELDI Studio 33: offline 3D, web, SQLite i projektne radionice su ugrađene.');
