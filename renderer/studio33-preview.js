'use strict';
const relay=(kind,text)=>parent.postMessage({eldi33Preview:true,kind,text:String(text).slice(0,3000)},'*');
for(const method of ['log','warn','error'])console[method]=(...values)=>relay(method,values.map(v=>typeof v==='object'?JSON.stringify(v):String(v)).join(' '));
window.onerror=(message,source,line,column,error)=>relay('error',(error?.message||message)+' · red '+line);
window.addEventListener('unhandledrejection',e=>relay('error',e.reason));
window.addEventListener('message',e=>{if(e.source!==parent||e.data?.type!=='eldi33-preview')return;const r=e.data;if([r.html,r.css,r.js].some(t=>typeof t!=='string'||t.length>200000))return;const doc=new DOMParser().parseFromString(r.html,'text/html');for(const bad of doc.querySelectorAll('script,iframe,object,embed,base,meta,link'))bad.remove();for(const el of doc.querySelectorAll('*'))for(const a of [...el.attributes])if(a.name.startsWith('on'))el.removeAttribute(a.name);document.getElementById('project').innerHTML=doc.body.innerHTML;document.getElementById('project-style')?.remove();const style=document.createElement('style');style.id='project-style';style.textContent=r.css;document.head.append(style);if(r.js){const script=document.createElement('script');script.textContent=r.js;document.body.append(script);}relay('ready','Pregled je osvježen.');});
relay('loaded','Spreman');
