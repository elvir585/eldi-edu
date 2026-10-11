/* ELDI: all views derive from the same server-validated numeric Python AST. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AlgorithmTools=api;})(typeof globalThis==='object'?globalThis:this,()=>{
'use strict';
const pad=n=>'    '.repeat(n),escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function expression(a){
 switch(a[0]){
 case 'number':return typeof a[1]==='boolean'?(a[1]?'True':'False'):String(a[1]);
 case 'var':return a[1];
 case 'call':return a[1]+'('+a[2].map(expression).join(', ')+')';
 case 'unary':return '('+a[1]+(a[1]==='not'?' ':'')+expression(a[2])+')';
 case 'binary':return '('+expression(a[2])+' '+a[1]+' '+expression(a[3])+')';
 case 'compare':return '('+expression(a[1])+a[2].map(([op,e])=>' '+op+' '+expression(e)).join('')+')';
 default:throw Error('Nepoznat izraz algoritma.');
 }
}
function isRead(a){return a?.[0]==='call'&&['int','float'].includes(a[1])&&a[2][0]?.[0]==='call'&&a[2][0][1]==='input';}
function python(ast,depth=0){let lines=[];for(const a of ast){const p=pad(depth),body=n=>python(n,depth+1)||pad(depth+1)+'pass';switch(a[0]){
 case 'set':lines.push(p+a[1]+' = '+expression(a[2]));break;
 case 'print':lines.push(p+'print('+a[1].map(expression).join(', ')+')');break;
 case 'if':a[1].forEach(([e,b],i)=>lines.push(p+(i?'elif ':'if ')+expression(e)+':\n'+body(b)));if(a[2].length)lines.push(p+'else:\n'+body(a[2]));break;
 case 'while':lines.push(p+'while '+expression(a[1])+':\n'+body(a[2]));break;
 case 'for':lines.push(p+'for '+a[1]+' in range('+a[2].map(expression).join(', ')+'):\n'+body(a[3]));break;
 default:lines.push(p+a[0]);
 }}return lines.join('\n');}
function pseudo(ast,depth=1){let lines=[];for(const a of ast){const p=pad(depth);switch(a[0]){
 case 'set':lines.push(p+(isRead(a[2])?'UČITAJ '+a[1]+(a[2][1]==='float'?' (realni broj)':' (cijeli broj)'):a[1]+' ← '+expression(a[2])));break;
 case 'print':lines.push(p+'ISPIŠI '+a[1].map(expression).join(', '));break;
 case 'if':a[1].forEach(([e,b],i)=>lines.push(p+(i?'INAČE AKO ':'AKO ')+expression(e)+' ONDA\n'+pseudo(b,depth+1)));if(a[2].length)lines.push(p+'INAČE\n'+pseudo(a[2],depth+1));lines.push(p+'KRAJ AKO');break;
 case 'while':lines.push(p+'DOK '+expression(a[1])+' RADI\n'+pseudo(a[2],depth+1),p+'KRAJ DOK');break;
 case 'for':{const r=range(a[2]);lines.push(p+'ZA '+a[1]+' OD '+expression(r[0])+' DO (BEZ) '+expression(r[1])+' KORAK '+expression(r[2])+' RADI\n'+pseudo(a[3],depth+1),p+'KRAJ ZA');break;}
 case 'break':lines.push(p+'IZAĐI IZ PETLJE');break;case 'continue':lines.push(p+'NASTAVI SLJEDEĆI KORAK PETLJE');break;case 'pass':lines.push(p+'BEZ RADNJE');break;
 }}return lines.join('\n');}
function range(a){return a.length===1?[['number',0],a[0],['number',1]]:[a[0],a[1],a[2]||['number',1]];}
function blocks(ast){
 function chain(nodes){let first=null,last=null;for(const a of nodes){let b;const fields={};switch(a[0]){
 case 'set':if(isRead(a[2])){b={type:a[2][1]==='float'?'task_read_real':'task_read',fields:{NAME:a[1]}};}else b={type:'task_set',fields:{NAME:a[1],EXPR:expression(a[2])}};break;
 case 'print':b={type:'task_print',fields:{EXPR:a[1].map(expression).join(', ')}};break;
 case 'if':{const branch=i=>{const [,body]=a[1][i];const x={type:'task_if',fields:{EXPR:expression(a[1][i][0])},inputs:{}};const yes=chain(body),no=i+1<a[1].length?branch(i+1):chain(a[2]);if(yes)x.inputs.DO={block:yes};if(no)x.inputs.ELSE={block:no};return x;};b=branch(0);break;}
 case 'while':b={type:'task_while',fields:{EXPR:expression(a[1])},inputs:{DO:{block:chain(a[2])||{type:'task_pass'}}}};break;
 case 'for':{const r=range(a[2]);b={type:'task_for',fields:{NAME:a[1],FROM:expression(r[0]),TO:expression(r[1]),STEP:expression(r[2])},inputs:{DO:{block:chain(a[3])||{type:'task_pass'}}}};break;}
 default:b={type:'task_'+a[0]};
 }if(!first)first=b;else last.next={block:b};last=b;}return first;}
 const first=chain(ast);if(first){first.x=24;first.y=24;}return {blocks:{languageVersion:0,blocks:first?[first]:[]}};
}
function graph(ast){
 const nodes=[],edges=[];let serial=0;
 const node=(kind,label)=>{const id='a'+serial++;nodes.push({id,kind,label});return id;};
 const edge=(from,to,label='',back=false)=>edges.push({from,to,label,back});
 const begin=node('start','POČETAK'),end=node('end','KRAJ');
 function suite(list,next,loop){let entry=next;for(let i=list.length-1;i>=0;i--){const a=list[i];let id;switch(a[0]){
 case 'if':{let no=suite(a[2],entry,loop);for(let j=a[1].length-1;j>=0;j--){const [expr,body]=a[1][j],cond=node('decision',expression(expr)),yes=suite(body,entry,loop);edge(cond,yes,'DA');edge(cond,no,'NE');no=cond;}id=no;break;}
 case 'while':{id=node('decision',expression(a[1]));const back=node('join','↶ Ponovi uslov');edge(back,id,'',true);edge(id,suite(a[2],back,{stop:entry,again:back}),'DA');edge(id,entry,'NE');break;}
 case 'for':{const r=range(a[2]),init=node('process',a[1]+' ← '+expression(r[0])+'; granica '+expression(r[1])+'; korak '+expression(r[2])),cond=node('decision','Ima li još vrijednosti u range?'),step=node('process','Sljedeća vrijednost za '+a[1]);edge(init,cond);edge(cond,suite(a[3],step,{stop:entry,again:step}),'DA');edge(cond,entry,'NE');edge(step,cond,'ponovi',true);id=init;break;}
 case 'break':case 'continue':id=node('process',a[0]==='break'?'IZAĐI IZ PETLJE':'SLJEDEĆI KORAK PETLJE');edge(id,a[0]==='break'?loop.stop:loop.again,'',a[0]==='continue');break;
 default:id=node(a[0]==='print'?'io':a[0]==='set'&&isRead(a[2])?'io':'process',a[0]==='set'?(isRead(a[2])?'UČITAJ '+a[1]:a[1]+' ← '+expression(a[2])):a[0]==='print'?'ISPIŠI '+a[1].map(expression).join(', '):'BEZ RADNJE');edge(id,entry);
 }entry=id;}return entry;}
 edge(begin,suite(ast,end,null));return {nodes,edges};
}
function graphSvg(g){
 // Longest-path ranks on forward edges; loop return edges are routed outside.
 const ranks=new Map(g.nodes.map(n=>[n.id,0])),degree=new Map(g.nodes.map(n=>[n.id,0]));for(const e of g.edges)if(!e.back)degree.set(e.to,degree.get(e.to)+1);
 const queue=g.nodes.filter(n=>degree.get(n.id)===0).map(n=>n.id);for(let i=0;i<queue.length;i++){const id=queue[i];for(const e of g.edges.filter(x=>x.from===id&&!x.back)){ranks.set(e.to,Math.max(ranks.get(e.to),ranks.get(id)+1));degree.set(e.to,degree.get(e.to)-1);if(degree.get(e.to)===0)queue.push(e.to);}}
 const rows=[];for(const n of g.nodes){const k=ranks.get(n.id);(rows[k]??=[]).push(n);}
 const cols=Math.max(...rows.map(r=>r?.length||0)),width=Math.max(620,cols*300+160),height=rows.length*140+80,pos=new Map();rows.forEach((row,y)=>(row||[]).forEach((n,i)=>pos.set(n.id,{x:(width-row.length*300)/2+i*300+150,y:y*140+60})));
 const paths=g.edges.map((e,i)=>{const a=pos.get(e.from),b=pos.get(e.to);let d;if(e.back){const side=24+(i%4)*15;d=`M ${a.x-110} ${a.y} H ${side} V ${b.y} H ${b.x-110}`;}else{const sy=a.y+38,ey=b.y-38,my=(sy+ey)/2;d=`M ${a.x} ${sy} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${ey}`;}return `<path d="${d}" marker-end="url(#algorithm-arrow)" class="flow-edge"/>${e.label?`<text x="${e.back?40:(a.x+b.x)/2+9}" y="${e.back?(a.y+b.y)/2:(a.y+b.y)/2-8}" class="flow-label">${escape(e.label)}</text>`:''}`;}).join('');
 const shapes=g.nodes.map(n=>{const {x,y}=pos.get(n.id),shape=n.kind==='decision'?`<polygon points="${x},${y-43} ${x+128},${y} ${x},${y+43} ${x-128},${y}"/>`:n.kind==='io'?`<polygon points="${x-103},${y-34} ${x+124},${y-34} ${x+103},${y+34} ${x-124},${y+34}"/>`:`<rect x="${x-115}" y="${y-34}" width="230" height="68" rx="${['start','end','join'].includes(n.kind)?32:9}"/>`;let words=n.label.match(/.{1,25}(?:\s|$)|.{1,25}/g)||[''];if(words.length>3)words=[...words.slice(0,2),words.slice(2).join('').slice(0,23)+'…'];return `<g class="flow-node flow-${n.kind}"><title>${escape(n.label)}</title>${shape}<text x="${x}" y="${y-(words.length-1)*8}" text-anchor="middle">${words.map((w,i)=>`<tspan x="${x}" dy="${i?17:0}">${escape(w.trim())}</tspan>`).join('')}</text></g>`;}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="min-width:${width}px;width:${width}px" role="img" aria-label="Dijagram toka tvog programa"><defs><marker id="algorithm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#92cdd3"/></marker></defs>${paths}${shapes}</svg>`;
}
function portable(ast,lang){
 if(lang==='python')return python(ast)+'\n';
 if(!['javascript','cpp','java'].includes(lang))throw Error('Nepoznat jezik.');
 const js=lang==='javascript',cpp=lang==='cpp',math=cpp?'std::':'Math.',names=new Set();let counter=0;
 const bool=a=>a[0]==='compare'||a[0]==='unary'&&a[1]==='not'||a[0]==='number'&&typeof a[1]==='boolean';
 const inputIn=a=>Array.isArray(a)&&(a[0]==='call'&&a[1]==='input'||a.some(x=>Array.isArray(x)&&inputIn(x)));
 function exp(a,allowInput=false){switch(a[0]){
 case 'number':return typeof a[1]==='boolean'?(a[1]?'1':'0'):(Number.isInteger(a[1])&&!js?String(a[1])+'.0':String(a[1]));case 'var':names.add(a[1]);return 'v_'+a[1];
 case 'unary':return a[1]==='not'?`(${exp(a[2])} == 0 ? 1 : 0)`:`(${a[1]}${exp(a[2])})`;
 case 'compare':{const pieces=[];let l=a[1];for(const [op,r] of a[2]){pieces.push(`(${exp(l)} ${op} ${exp(r)})`);l=r;}return `(${pieces.join(' && ')} ? 1 : 0)`;}
 case 'binary':{const op=a[1],l=exp(a[2]),r=exp(a[3]);if(op==='and')return `(${l} != 0 ? ${r} : ${l})`;if(op==='or')return `(${l} != 0 ? ${l} : ${r})`;if(op==='//')return `${math}floor(${l} / ${r})`;if(op==='%')return `_mod(${l}, ${r})`;if(op==='**')return `${math}pow(${l}, ${r})`;return `(${l} ${op} ${r})`;}
 case 'call':{if(isRead(a)){if(!allowInput)throw Error('Za izvoz koda učitaj svaki broj u zasebnu promjenljivu.');return `_read(${a[1]==='int'?'true':'false'})`;}if(a[1]==='input')throw Error('Ulaz pretvori pomoću int(input()) ili float(input()).');const args=a[2].map(x=>exp(x));if(a[1]==='int')return js?`Math.trunc(${args[0]})`:cpp?`std::trunc(${args[0]})`:`((double)(long)(${args[0]}))`;if(a[1]==='float')return args[0];if(a[1]==='abs')return `${math}abs(${args[0]})`;return args.slice(1).reduce((l,r)=>`${math}${a[1]}${cpp?'<double>':''}(${l}, ${r})`,args[0]);}
 }throw Error('Nepodržan izraz za izvoz.');}
 function emit(nodes,d){let out=[];for(const a of nodes){const p=pad(d);switch(a[0]){
 case 'set':names.add(a[1]);if(bool(a[2]))throw Error('Za ovaj prikaz dodijeli broj 0 ili 1 umjesto logičke vrijednosti; Python prikaz ostaje dostupan.');out.push(p+'v_'+a[1]+' = '+exp(a[2],true)+';');break;
 case 'print':for(const x of a[1]){if(bool(x))out.push(p+`_printBool(${exp(x)} != 0);`);else out.push(p+`_print(${exp(x)});`);}break;
 case 'if':a[1].forEach(([e,b],i)=>out.push(p+(i?'else if':'if')+' ('+exp(e)+' != 0) {\n'+emit(b,d+1)+'\n'+p+'}'));if(a[2].length)out.push(p+'else {\n'+emit(a[2],d+1)+'\n'+p+'}');break;
 case 'while':out.push(p+'while ('+exp(a[1])+' != 0) {\n'+emit(a[2],d+1)+'\n'+p+'}');break;
 case 'for':{names.add(a[1]);const id=counter++,r=range(a[2]).map(x=>exp(x)),decl=js?'let':'double';out.push(p+'{',pad(d+1)+`${decl} _start${id} = ${r[0]}, _end${id} = ${r[1]}, _step${id} = ${r[2]};`,pad(d+1)+`_range(_start${id}, _end${id}, _step${id});`,pad(d+1)+`for (${decl} _i${id} = _start${id}; _step${id} > 0 ? _i${id} < _end${id} : _i${id} > _end${id}; _i${id} += _step${id}) {`,pad(d+2)+`v_${a[1]} = _i${id};`,emit(a[3],d+2),pad(d+1)+'}',p+'}');break;}
 case 'break':case 'continue':out.push(p+a[0]+';');break;case 'pass':out.push(p+'// Bez radnje');break;
 }}return out.join('\n');}
 const depth=js?0:cpp?1:2,body=emit(ast,depth),declarations=names.size?pad(depth)+(js?'let ':'double ')+[...names].sort().map(n=>'v_'+n+' = 0').join(', ')+';\n':'';
 const note='// Generisano iz tvog algoritma. Ulaz: jedan broj po redu.\n';
 if(js)return note+`'use strict';
const _lines = require('node:fs').readFileSync(0,'utf8').trim().split(/\\s+/); let _position = 0;
function _read(integer) { const s = _lines[_position++]; if (!s || !(integer ? /^[+-]?\\d+$/ : /^[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)$/).test(s)) throw Error('Neispravan ulaz'); return Number(s); }
function _mod(a,b) { return a - Math.floor(a / b) * b; }
function _range(a,b,s) { if (![a,b,s].every(Number.isInteger) || s === 0) throw Error('Neispravan range'); }
function _print(x) { console.log(x); }
function _printBool(x) { console.log(x ? 'True' : 'False'); }
`+declarations+body+'\n';
 if(cpp)return note+`#include <iostream>
#include <iomanip>
#include <cmath>
#include <algorithm>
#include <stdexcept>
double _read(bool integer) { double x; if (!(std::cin >> x) || (integer && std::trunc(x) != x)) throw std::runtime_error("Neispravan ulaz"); return x; }
double _mod(double a,double b) { return a - std::floor(a / b) * b; }
void _range(double a,double b,double s) { if (s == 0 || std::trunc(a)!=a || std::trunc(b)!=b || std::trunc(s)!=s) throw std::runtime_error("Neispravan range"); }
void _print(double x) { std::cout << std::setprecision(15) << x << '\\n'; }
void _printBool(bool x) { std::cout << (x ? "True" : "False") << '\\n'; }
int main() {
`+declarations+body+'\n    return 0;\n}\n';
 return note+`import java.util.Scanner;
import java.util.Locale;
public class Main {
    static final Scanner _input = new Scanner(System.in).useLocale(Locale.US);
    static double _read(boolean integer) { double x = _input.nextDouble(); if (integer && x != (long)x) throw new IllegalArgumentException("Neispravan ulaz"); return x; }
    static double _mod(double a,double b) { return a - Math.floor(a / b) * b; }
    static void _range(double a,double b,double s) { if (s == 0 || a!=(long)a || b!=(long)b || s!=(long)s) throw new IllegalArgumentException("Neispravan range"); }
    static void _print(double x) { System.out.println(x); }
    static void _printBool(boolean x) { System.out.println(x ? "True" : "False"); }
    public static void main(String[] args) {
`+declarations+body+'\n    }\n}\n';
}
return {expression,python,pseudocode:ast=>'POČETAK\n'+pseudo(ast)+'\nKRAJ',blocks,graph,graphSvg,portable};
});
