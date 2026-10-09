(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ELDILabEngine=api;})(globalThis,()=>{
'use strict';
const FN={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,sqrt:Math.sqrt,abs:Math.abs,exp:Math.exp,ln:Math.log,log:Math.log10,floor:Math.floor,ceil:Math.ceil};
function compile(source){
 if(typeof source!=='string'||source.length>300)throw Error('Funkcija može imati do 300 znakova.');
 const text=source.toLowerCase().replace(/−/g,'-').replace(/π/g,'pi').replace(/^\s*y\s*=\s*/,'');
 const raw=text.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-z]+|[+\-*/^()]/g)||[];
 if(raw.join('')!==text.replace(/\s/g,'')||!raw.length||raw.length>160)throw Error('Koristi brojeve, x, a, b, c, + − * / ^ i podržane funkcije.');
 const tokens=[];for(const t of raw){const prev=tokens.at(-1),end=prev&&(prev===')'||/^(?:\d|\.|x$|a$|b$|c$|pi$|e$)/.test(prev)),start=t==='('||/^(?:\d|\.|[a-z])/.test(t);if(end&&start)tokens.push('*');tokens.push(t);}
 let i=0,depth=0;const isNumber=t=>/^\d|^\./.test(t||'');
 function expression(min=0){if(++depth>40)throw Error('Izraz je predubok.');let t=tokens[i++],left;
 if(t==='+'||t==='-')left={op:'unary',sign:t,node:expression(25)};
 else if(t==='('){left=expression();if(tokens[i++]!==')')throw Error('Nedostaje zatvorena zagrada.');}
 else if(isNumber(t))left={op:'number',value:Number(t)};
 else if(['x','a','b','c','pi','e'].includes(t))left={op:'variable',name:t};
 else if(Object.hasOwn(FN,t)){if(tokens[i++]!=='(')throw Error(t+' traži zagrade.');left={op:'call',name:t,node:expression()};if(tokens[i++]!==')')throw Error('Nedostaje zagrada funkcije.');}
 else throw Error('Nepoznat dio izraza: '+String(t||'kraj'));
 while(i<tokens.length){const op=tokens[i],prec={'+':10,'-':10,'*':20,'/':20,'^':30}[op];if(!prec||prec<min)break;i++;left={op,left,right:expression(op==='^'?prec:prec+1)};}depth--;return left;}
 const ast=expression();if(i!==tokens.length)throw Error('Provjeri zagrade i operatore.');
 function run(n,vars){if(n.op==='number')return n.value;if(n.op==='variable')return n.name==='pi'?Math.PI:n.name==='e'?Math.E:Number(vars[n.name]??0);if(n.op==='unary')return(n.sign==='-'?-1:1)*run(n.node,vars);if(n.op==='call')return FN[n.name](run(n.node,vars));const l=run(n.left,vars),r=run(n.right,vars);return n.op==='+'?l+r:n.op==='-'?l-r:n.op==='*'?l*r:n.op==='/'?l/r:l**r;}
 return(x,params={})=>run(ast,{...params,x});
}
function roots(fn,min=-10,max=10){const out=[],n=800,add=x=>{if(Number.isFinite(x)&&Math.abs(fn(x))<1e-6&&!out.some(v=>Math.abs(v-x)<1e-4))out.push(x);};let x0=min,y0=fn(x0);add(x0);for(let i=1;i<=n;i++){const x1=min+(max-min)*i/n,y1=fn(x1);add(x1);if(Number.isFinite(y0)&&Number.isFinite(y1)&&y0*y1<0){let l=x0,r=x1,fl=y0;for(let j=0;j<50;j++){const mid=(l+r)/2,fm=fn(mid);if(!Number.isFinite(fm))break;if(fl*fm<=0)r=mid;else{l=mid;fl=fm;}}add((l+r)/2);}x0=x1;y0=y1;}return out;}
function triangle(points){const [A,B,C]=points,dist=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);const a=dist(B,C),b=dist(A,C),c=dist(A,B),area=Math.abs((B[0]-A[0])*(C[1]-A[1])-(B[1]-A[1])*(C[0]-A[0]))/2;return{a,b,c,area,perimeter:a+b+c,valid:area>1e-8,centroid:[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3]};}
function solid(s){const{type,r,h,a,b,n}=s;let B,O,P,V;if(type==='sphere')return{P:4*Math.PI*r*r,V:4*Math.PI*r**3/3,section:z=>Math.PI*Math.max(0,r*r-z*z)};if(type==='cylinder'){B=Math.PI*r*r;O=2*Math.PI*r;P=2*B+O*h;V=B*h;}else if(type==='cone'){B=Math.PI*r*r;P=B+Math.PI*r*Math.hypot(r,h);V=B*h/3;}else if(type==='cube'||type==='cuboid'){B=a*(type==='cube'?a:b);O=2*(a+(type==='cube'?a:b));const height=type==='cube'?a:h;P=2*B+O*height;V=B*height;}else{B=n*a*a/(4*Math.tan(Math.PI/n));O=n*a;P=type==='pyramid'?B+O*Math.hypot(h,a/(2*Math.tan(Math.PI/n)))/2:2*B+O*h;V=B*h/(type==='pyramid'?3:1);}return{P,V,B,O,section:z=>{const height=type==='cube'?a:h,t=Math.max(0,Math.min(1,(z+height/2)/height));return B*((type==='cone'||type==='pyramid')?(1-t)**2:1);}};}
const DEFAULT={mode:'functions',expressions:['a*x^2+b*x+c','x+1',''],params:{a:1,b:0,c:0},triangle:[[-3,-2],[3,-2],[1,3]],solid:{type:'prism',a:3,b:4,r:2,h:5,n:6,cut:0,angle:60,net:0},notes:''};
function normalize(raw={}){const fail=()=>{throw Error('Neispravan sačuvani laboratorij.');};if(!raw||typeof raw!=='object'||Array.isArray(raw))fail();const d=structuredClone(DEFAULT);if(raw.mode!==undefined){if(!['functions','triangle','solid','dihedral','algorithms','history'].includes(raw.mode))fail();d.mode=raw.mode;}
 if(raw.expressions!==undefined){if(!Array.isArray(raw.expressions)||raw.expressions.length!==3||raw.expressions.some(s=>typeof s!=='string'||s.length>300))fail();d.expressions=raw.expressions.slice();}
 for(const [key,lo,hi]of [['a',-10,10],['b',-10,10],['c',-10,10]])if(raw.params?.[key]!==undefined){const v=raw.params[key];if(!Number.isFinite(v)||v<lo||v>hi)fail();d.params[key]=v;}
 if(raw.triangle!==undefined){if(!Array.isArray(raw.triangle)||raw.triangle.length!==3||raw.triangle.some(p=>!Array.isArray(p)||p.length!==2||p.some(x=>!Number.isFinite(x)||Math.abs(x)>1000)))fail();d.triangle=raw.triangle.map(p=>p.slice());}
 if(raw.solid!==undefined){if(!raw.solid||typeof raw.solid!=='object')fail();if(raw.solid.type!==undefined){if(!['cube','cuboid','prism','pyramid','cylinder','cone','sphere'].includes(raw.solid.type))fail();d.solid.type=raw.solid.type;}for(const key of ['a','b','r','h','n','cut','angle','net'])if(raw.solid[key]!==undefined){const v=raw.solid[key],range=key==='cut'?[-1,1]:key==='angle'?[10,170]:key==='net'?[0,1]:key==='n'?[3,12]:[.5,12];if(!Number.isFinite(v)||v<range[0]||v>range[1]||(key==='n'&&!Number.isInteger(v)))fail();d.solid[key]=v;}}
 if(raw.notes!==undefined){if(typeof raw.notes!=='string'||raw.notes.length>6000)fail();d.notes=raw.notes;}
 d.saved=[];if(raw.saved!==undefined){if(!Array.isArray(raw.saved)||raw.saved.length>30)fail();d.saved=raw.saved.map(row=>{if(!row||typeof row.name!=='string'||row.name.length>120||!Number.isFinite(Date.parse(row.date))||row.scene?.saved)fail();return{name:row.name,date:row.date,scene:normalize({...row.scene,saved:undefined})};});d.saved.forEach(r=>delete r.scene.saved);}
 return d;}
function algorithm(kind,values,target=0){let a=values.slice(),frames=[];const frame=(indices,note)=>frames.push({values:a.slice(),indices,note});frame([],'Početni niz');if(kind==='sort'){for(let i=0;i<a.length-1;i++)for(let j=0;j<a.length-1-i;j++){frame([j,j+1],'Poredim susjedne članove');if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];frame([j,j+1],'Zamjena mjesta');}}frame([],'Niz je sortiran');}else if(kind==='search'){for(let i=0;i<a.length;i++){frame([i],`Provjeravam indeks ${i}`);if(a[i]===target){frame([i],`Pronađeno na indeksu ${i}`);return frames;}}frame([],'Traženi broj nije u nizu');}else{let best=0,sum=0;for(let i=0;i<a.length;i++){sum+=a[i];if(a[i]>a[best])best=i;frame([i,best],`Zbir = ${sum}; maksimum = ${a[best]}`);}frame([best],`Prosjek = ${sum/a.length}; maksimum = ${a[best]}`);}return frames;}
return Object.freeze({compile,roots,triangle,solid,normalize,algorithm,DEFAULT});
});
