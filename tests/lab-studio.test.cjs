'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const E=require('../app/lab-engine.js'),W=require('../app/studio-work.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('Expression parser handles precedence, parameters and domains without JavaScript evaluation',()=>{
 near(E.compile('-x^2')(3),-9);near(E.compile('2^3^2')(0),512);near(E.compile('2x + 3(x+1)')(2),13);
 near(E.compile('a*x^2+b*x+c')(2,{a:3,b:-2,c:1}),9);near(E.compile('sin(pi/2)+ln(e)')(0),2);
 assert.ok(Number.isNaN(E.compile('sqrt(x)')(-1)));assert.equal(E.compile('1/x')(0),Infinity);
 for(const s of ['window.alert(1)','x.constructor','x=1','eval(x)','sin x','((((x)','x;1','1'.repeat(301)])assert.throws(()=>E.compile(s));
});
test('Numerical roots distinguish crossings from poles',()=>{
 const roots=E.roots(E.compile('x^2-4'),-5,5);assert.equal(roots.length,2);near(roots[0],-2);near(roots[1],2);
 assert.equal(E.roots(E.compile('1/(x-0.123)'),-1,1).length,0);
});
test('Triangle, seven solids and parallel sections have expected measurements',()=>{
 const t=E.triangle([[0,0],[4,0],[0,3]]);near(t.area,6);near(t.perimeter,12);assert.equal(E.triangle([[0,0],[1,1],[2,2]]).valid,false);
 const base={...E.DEFAULT.solid,a:2,b:3,h:4,r:2,n:4};
 const volumes={cube:8,cuboid:24,prism:16,pyramid:16/3,cylinder:16*Math.PI,cone:16*Math.PI/3,sphere:32*Math.PI/3};
 for(const[type,v]of Object.entries(volumes))near(E.solid({...base,type}).V,v);
 near(E.solid({...base,type:'cube'}).P,24);near(E.solid({...base,type:'cylinder'}).P,24*Math.PI);
 near(E.solid({...base,type:'cone'}).section(0),Math.PI);near(E.solid({...base,type:'sphere'}).section(0),4*Math.PI);near(E.solid({...base,type:'sphere'}).section(2),0);
});
test('Saved lab and projects survive normalization and reject corrupt imports',()=>{
 const scene=E.normalize();delete scene.saved;const saved=E.normalize({notes:'Čajić',saved:[{name:'Prizma',date:new Date().toISOString(),scene}]});assert.deepEqual(E.normalize(saved),saved);
 assert.throws(()=>E.normalize({solid:{r:-2}}));assert.throws(()=>E.normalize({triangle:[[0,0],[1,1],[Infinity,2]]}));assert.throws(()=>E.normalize({expressions:['x']}));
 const project={format:'ELDI-BLOCKS-1',workspace:{blocks:{languageVersion:0,blocks:[]}}};
 const c=W.challenge({title:'Zbir',statement:'Saberi',tests:[{input:'2\n3',output:'5',points:10}],starter:project});
 const work=W.normalize({challenges:[c],versions:[{name:'Rad',date:new Date().toISOString(),project}]});assert.deepEqual(W.normalize(work),work);
 assert.throws(()=>W.challenge({...c,tests:[]}));assert.throws(()=>W.challenge({...c,tests:[{input:'',output:'',points:-1}]}));assert.throws(()=>W.project(JSON.parse('{"format":"ELDI-BLOCKS-1","workspace":{"__proto__":{}}}')));
});
test('Algorithm frames end with the actual sorted array and distinguish failed search',()=>{
 assert.deepEqual(E.algorithm('sort',[3,-1,2,2]).at(-1).values,[-1,2,2,3]);assert.match(E.algorithm('search',[1,2],9).at(-1).note,/nije/);assert.match(E.algorithm('stats',[2,4,6]).at(-1).note,/Prosjek = 4/);
});
function worker(){
 const messages=[],waiting=[];const root=path.resolve(__dirname,'../renderer');
 const context=vm.createContext({console,Date,setTimeout,clearTimeout,self:{postMessage(message){messages.push(message);for(const entry of waiting.slice())if(entry.type===message.type){clearTimeout(entry.timer);waiting.splice(waiting.indexOf(entry),1);entry.resolve(message);}}}});
 context.importScripts=file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
 vm.runInContext(fs.readFileSync(path.join(root,'block-worker.js'),'utf8'),context);
 return{messages,post:data=>context.self.onmessage({data}),next(type){return new Promise((resolve,reject)=>{const entry={type,resolve,timer:setTimeout(()=>reject(Error('Missing worker message: '+type)),2000)};waiting.push(entry);});}};
}
test('Debugger pauses actual execution, steps one boundary and resumes with live sensors',async()=>{
 const w=worker(),first=w.next('paused');w.post({debug:true,paused:true,code:'var n=0; traceBlock("one"); n=1; traceBlock("two"); n=2; printOutput(key("ArrowRight"));'});
 assert.equal((await first).id,'one');await new Promise(r=>setTimeout(r,25));assert.equal(w.messages.some(m=>m.type==='done'),false);
 const second=w.next('paused');w.post({cmd:'step'});const pause=await second;assert.equal(pause.id,'two');assert.equal(pause.variables.n,1);
 w.post({cmd:'sensors',keys:['ArrowRight']});const done=w.next('done');w.post({cmd:'resume'});const result=(await done).result;assert.equal(result.output,'true\n');assert.equal(result.variables.n,2);
});
test('Breakpoints stop before their statement and waits yield to sensor updates',async()=>{
 const w=worker(),pause=w.next('paused');w.post({debug:true,breakpoints:['stop'],code:'printOutput("before"); traceBlock("stop"); printOutput("after"); wait(0.06); printOutput(key(" "));'});
 await pause;assert.equal(w.messages.flatMap(m=>m.actions||[]).filter(a=>a.type==='print').length,1);
 const done=w.next('done');w.post({cmd:'resume'});w.post({cmd:'sensors',keys:[' ']});assert.equal((await done).result.output,'before\nafter\ntrue\n');
});
