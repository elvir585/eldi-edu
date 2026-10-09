'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
require('esbuild').buildSync({entryPoints:[path.join(root,'renderer/lab/source.js')],outfile:path.join(root,'renderer/vendor/eldi-lab.js'),bundle:true,minify:true,format:'iife',platform:'browser',target:'chrome140',legalComments:'external'});
for(const [pkg,file]of [['jsxgraph','LICENSE.MIT'],['three','LICENSE']]){const folder=path.join(root,'node_modules',pkg),name=fs.existsSync(path.join(folder,file))?file:fs.readdirSync(folder).find(f=>/^LICENSE/.test(f));fs.copyFileSync(path.join(folder,name),path.join(root,'renderer/vendor',pkg+'-LICENSE.txt'));}
console.log('Offline JSXGraph / Three.js laboratory built.');
