export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const E=()=>window.ELDIStudio33Engine;
export const $=id=>document.getElementById(id);
export const fmt=v=>Number.isFinite(v)?Number(v.toFixed(4)).toLocaleString('bs-BA'):String(v??'');
export const field=(id,label,value,type='text',extra='')=>`<label>${label}<input id="${id}" type="${type}" value="${esc(value)}" ${extra}></label>`;
export const range=(id,label,value,min,max,step=1)=>`<label>${label} <output id="${id}-out">${value}</output><input id="${id}" type="range" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;
export function download(name,value,type='application/json'){const b=value instanceof Blob?value:new Blob([typeof value==='string'||value instanceof Uint8Array?value:JSON.stringify(value,null,2)],{type}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);}
export function table(columns,rows){return `<div class="s33-table-wrap"><table><thead><tr>${columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${esc(c??'NULL')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
export function edit(id,language,onRun){return window.ELDICodeEditor?.attach($(id),{language:()=>language,key:()=>id,onRun});}
export function note(text,error=false){const el=$('s33-status');if(el){el.textContent=text;el.dataset.error=String(error);}}
export function report(c,name,score,max,details){const item={name,date:new Date().toISOString(),score,max,details,comment:'',grade:''};c.work.reports.unshift(item);c.work.reports=c.work.reports.slice(0,50);c.save();return item;}
