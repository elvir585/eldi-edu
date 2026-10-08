'use strict';
window.ELDIStorage=(()=>{
 let database,opening,queue=Promise.resolve(),pending=null,timer=null,batch=null;
 function open(){
  if(database)return Promise.resolve(database);if(opening)return opening;
  opening=new Promise((resolve,reject)=>{const request=indexedDB.open('ELDI-EDU-LOCAL',1);request.onupgradeneeded=()=>request.result.createObjectStore('profiles');request.onsuccess=()=>{database=request.result;resolve(database);};request.onerror=()=>{opening=null;reject(request.error||Error('Baza podataka nije dostupna.'));};});return opening;
 }
 async function load(){const db=await open();const stored=await new Promise((resolve,reject)=>{const tx=db.transaction('profiles','readonly'),request=tx.objectStore('profiles').get('main');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});if(stored)return JSON.parse(stored);try{return JSON.parse(localStorage.getItem('eldi-desktop')||'null');}catch{return null;}}
 function commit(){
  if(timer){clearTimeout(timer);timer=null;}if(pending===null)return queue;
  const serialized=pending,waiting=batch;pending=null;batch=null;
  queue=queue.catch(()=>{}).then(async()=>{const db=await open();await new Promise((resolve,reject)=>{const tx=db.transaction('profiles','readwrite');tx.objectStore('profiles').put(serialized,'main');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Čuvanje nije uspjelo.'));tx.onabort=()=>reject(tx.error||Error('Čuvanje je prekinuto.'));});});
  queue.then(waiting.resolve,waiting.reject);return queue;
 }
 function save(value){pending=JSON.stringify(value);if(!batch){let resolve,reject;const promise=new Promise((ok,fail)=>{resolve=ok;reject=fail;});batch={promise,resolve,reject};timer=setTimeout(commit,150);}return batch.promise;}
 function flush(){return commit();}
 return{load,save,flush};
})();
