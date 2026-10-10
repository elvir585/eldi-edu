'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),target=path.join(root,'website/eldi-edu/ucionica');
const files=['app/edition3333-engine.js','app/studio33-engine.js','renderer/studio33-worker.js','renderer/studio33-sql-worker.js','renderer/studio33-preview.html','renderer/studio33-preview.js','renderer/style.css','renderer/code-editor.css','renderer/studio33/studio33.css','renderer/vendor/eldi-editor.js','renderer/vendor/eldi-studio33.js','renderer/vendor/eldi-studio33.js.LEGAL.txt','renderer/vendor/sql-wasm.js','renderer/vendor/sql-wasm.wasm','renderer/vendor/interpreter.js','renderer/vendor/blockly_compressed.js','renderer/vendor/blocks_compressed.js','renderer/vendor/javascript_compressed.js','renderer/vendor/python_compressed.js','renderer/vendor/bs.js'];
for(const name of files){const to=path.join(target,name);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(root,name),to);}
fs.cpSync(path.join(root,'renderer/vendor/media'),path.join(target,'renderer/vendor/media'),{recursive:true});
for(const n of fs.readdirSync(path.join(root,'renderer/vendor')).filter(n=>/LICENSE|NOTICE/.test(n))){const f=path.join(root,'renderer/vendor',n);if(fs.statSync(f).isFile())fs.copyFileSync(f,path.join(target,'renderer/vendor',n));}
fs.copyFileSync(path.join(root,'THIRD_PARTY_NOTICES.md'),path.join(target,'THIRD_PARTY_NOTICES.txt'));
console.log('Web radionica 33.33 pripremljena sa svim lokalnim bibliotekama.');

console.log('Offline radionica:',require('./build-offline3333.cjs')());
