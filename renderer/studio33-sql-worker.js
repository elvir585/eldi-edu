'use strict';
importScripts('vendor/sql-wasm.js');
let db,initializing;
const ready=()=>initializing||=(async()=>{const SQL=await initSqlJs({locateFile:name=>new URL('vendor/'+name,self.location.href).href});db=new SQL.Database();return SQL;})();
self.onmessage=async({data:r})=>{try{const SQL=await ready();if(r.load){db.close();db=new SQL.Database(Uint8Array.from(atob(r.load),c=>c.charCodeAt(0)));}if(r.reset){db.close();db=new SQL.Database();}
if(typeof r.sql!=='string'||r.sql.length>50000)throw Error('SQL tekst je neispravan ili prevelik.');const results=db.exec(r.sql).map(t=>({columns:t.columns,values:t.values.slice(0,500)}));const bytes=db.export();if(bytes.length>1000000)throw Error('Baza prelazi 1 MB.');let str='';for(const b of bytes)str+=String.fromCharCode(b);self.postMessage({id:r.id,ok:true,results,database:btoa(str),modified:db.getRowsModified()});}catch(e){self.postMessage({id:r.id,ok:false,error:e.message});}};
