'use strict';
importScripts('vendor/interpreter.js','../app/studio33-engine.js');
let active=null;
self.onmessage=({data:r})=>{
 if(r.cmd){active?.control(r.cmd);return;}active?.stop();
 const E=self.ELDIStudio33Engine;let vm,objects=(r.scene||[]).slice(0,40).map(E.object),output='',frames=0,steps=0,cpu=0,timer,stopped=false,paused=!!r.paused,single=!!r.paused,boundary=false,block='',delay=0,input=String(r.input||'').split(/\s+/).filter(Boolean),robot=E.robot(r.level||0),names=[];
 function variables(){const out={};for(const name of names){let s=vm.stateStack.at(-1)?.scope||vm.globalScope;while(s&&!Object.hasOwn(s.object?.properties||{},name))s=s.parentScope;const v=s?.object?.properties[name];if(v===null||['string','number','boolean'].includes(typeof v))out[name]=typeof v==='string'?v.slice(0,100):v;else if(v?.class==='Array')out[name]=Array.from({length:Math.min(v.properties.length,15)},(_,i)=>String(v.properties[i]));}return out;}
 function snapshot(type='frame'){self.postMessage({type,frame:{objects:E.clone(objects),robot:robot.state(),output,variables:variables(),block,steps,index:frames++}});if(frames>1200)throw Error('Najviše 1200 snimljenih koraka po pokretanju. Skrati petlju.');}
 function find(id){const o=objects.find(o=>o.id===String(id));if(!o)throw Error('Nema tijela: '+id);return o;}
 const num=v=>{v=Number(v);if(!Number.isFinite(v)||Math.abs(v)>100000)throw Error('Neispravan broj.');return v;};
 const api={trace33:id=>{block=String(id);boundary=true;},solid33:(id,type,r,h)=>{id=String(id).slice(0,50);if(!id||!E.TYPES.includes(type))throw Error('Neispravno ime ili vrsta tijela.');if(objects.some(o=>o.id===id))throw Error('Ime tijela već postoji: '+id);if(objects.length>=40)throw Error('Najviše 40 tijela.');objects.push(E.object({id,type,r:num(r),h:num(h)}));},clear33:()=>{objects=[];},set33:(id,key,value)=>{const o=find(id);if(!['x','y','z','rx','ry','rz','r','h','a','b','n','opacity'].includes(key))throw Error('Nepoznato svojstvo.');o[key]=num(value);Object.assign(o,E.object(o));},color33:(id,color)=>{if(!/^#[0-9a-f]{6}$/i.test(color))throw Error('Boja: #RRGGBB.');find(id).color=color;},get33:(id,key)=>find(id)[key]??0,wait33:ms=>{delay=Math.max(0,Math.min(1500,num(ms)));},forward33:()=>robot.forward(),turn33:direction=>robot.turn(num(direction)),distance33:()=>robot.distance(),line33:()=>robot.line(),goal33:()=>robot.goal(),print33:value=>{if(output.length>16000)throw Error('Predugačak izlaz.');output+=String(value)+'\n';},read33:()=>{if(!input.length)throw Error('Nema više ulaznih podataka.');return num(input.shift());}};
 function finish(error){if(stopped)return;stopped=true;clearTimeout(timer);try{snapshot(error?'error':'done');}catch{}if(error)self.postMessage({type:'failure',message:error.message});}
 try{
  if(typeof r.code!=='string'||r.code.length>100000)throw Error('Program je prevelik.');
  vm=new JSInterpreter(r.code,(instance,global)=>{for(const[n,f]of Object.entries(api))instance.setProperty(global,n,instance.createNativeFunction(f));});
  function walk(n){if(!n||typeof n!=='object')return;if(n.type==='VariableDeclarator'&&n.id?.name)names.push(n.id.name);for(const v of Object.values(n))if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')walk(v);}walk(vm.parse_(r.code,'vars'));names=[...new Set(names)].slice(0,40);
  function pump(){if(stopped)return;const start=Date.now();try{for(let i=0;i<1500;i++){if(++steps>1500000||cpu+Date.now()-start>5000)throw Error('Program je prekoračio vrijeme računanja.');if(!vm.step()){cpu+=Date.now()-start;finish();return;}if(boundary){boundary=false;snapshot();cpu+=Date.now()-start;if(single||paused){paused=true;self.postMessage({type:'paused'});return;}timer=setTimeout(pump,Math.max(delay,Number(r.speed)||0));delay=0;return;}}cpu+=Date.now()-start;timer=setTimeout(pump,0);}catch(e){finish(e);}}
  active={stop(){stopped=true;clearTimeout(timer);},control(cmd){if(cmd==='pause'){paused=true;return;}if(cmd==='step'||cmd==='play'){paused=false;single=cmd==='step';clearTimeout(timer);timer=setTimeout(pump,0);}if(cmd==='stop')this.stop();}};
  pump();
 }catch(e){finish(e);}
};
