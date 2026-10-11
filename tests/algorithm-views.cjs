'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process'),T=require('../website/eldi-edu/online/algorithm-tools.js');
const root=path.resolve(__dirname,'..'),tmp=path.join(root,'.qa-algorithms');fs.mkdirSync(tmp,{recursive:true});
const php=(code,input)=>execFileSync('php',['-r',code],{cwd:root,input,encoding:'utf8',timeout:10000});
const tasks=JSON.parse(php('require "website/eldi-edu/online/service.php"; $out=[]; foreach(Classroom::practicalCatalog() as $id=>$t){$r=new SchoolRuntime();$out[$id]=["ast"=>$r->compile($t["reference"]),"cases"=>$t["cases"]];} echo json_encode($out,JSON_THROW_ON_ERROR);'));
assert.equal(Object.keys(tasks).length,20);
let executed=0;
for(const [id,t] of Object.entries(tasks)){
 const w=T.blocks(t.ast),round=JSON.parse(php('require "website/eldi-edu/online/service.php"; $w=json_decode(stream_get_contents(STDIN),true,512,JSON_THROW_ON_ERROR); $r=new SchoolRuntime(); $a=$r->compile(SchoolRuntime::blocksSource($w)); echo json_encode($a,JSON_THROW_ON_ERROR);',JSON.stringify(w)));
 // Blocks use explicit else/pass and three-argument ranges; compare executions, not AST formatting.
 const outputs=JSON.parse(php('require "website/eldi-edu/online/service.php"; $x=json_decode(stream_get_contents(STDIN),true,512,JSON_THROW_ON_ERROR); $r=new SchoolRuntime(); $a=$r->compile(SchoolRuntime::blocksSource($x["w"]));echo json_encode(array_map(fn($c)=>$r->run($a,$c["input"]),$x["cases"]),JSON_THROW_ON_ERROR);',JSON.stringify({w,cases:t.cases})));
 assert(outputs.length===10);outputs.forEach((o,i)=>assert.deepEqual(o,t.cases[i].output,id+' blocks round trip'));
 assert.match(T.pseudocode(t.ast),/^POČETAK\n/);const graph=T.graph(t.ast),ids=new Set(graph.nodes.map(n=>n.id));for(const e of graph.edges){assert(ids.has(e.from)&&ids.has(e.to));}assert(T.graphSvg(graph).includes('marker-end'));
 for(const [lang,file] of [['python','solution.py'],['javascript','solution.cjs'],['cpp','solution.cpp'],['java','Main.java']])fs.writeFileSync(path.join(tmp,file),T.portable(t.ast,lang));
 execFileSync('g++',['-std=c++17',path.join(tmp,'solution.cpp'),'-o',path.join(tmp,'solution')],{timeout:20000});execFileSync('javac',[path.join(tmp,'Main.java')],{timeout:20000});
 for(const c of t.cases){const input=c.input.join('\n')+'\n';for(const [cmd,args] of [['python3',[path.join(tmp,'solution.py')]],['node',[path.join(tmp,'solution.cjs')]],[path.join(tmp,'solution'),[]],['java',['-cp',tmp,'Main']]]){
  const actual=execFileSync(cmd,args,{input,encoding:'utf8',timeout:3000}).trim().split(/\s+/).map(Number);assert.equal(actual.length,c.output.length,id+' '+cmd);actual.forEach((n,i)=>assert(Number.isFinite(n)&&Math.abs(n-Number(c.output[i]))<=Math.max(1,Math.abs(Number(c.output[i])))*1e-9,id+' '+cmd+' '+input));executed++;
 }}
}
// Numeric semantics that commonly drift across programming languages.
const special='n = 0\ns = 0\nfor i in range(5, 0, -1):\n    if i == 4:\n        continue\n    if i == 1:\n        break\n    s += i\nprint(s)\nprint(1 / 2)\nprint(-7 // 3)\nprint(-7 % 3)\nprint(min(2, 1.5))';
const ast=JSON.parse(php('require "website/eldi-edu/online/service.php";$r=new SchoolRuntime();echo json_encode($r->compile(stream_get_contents(STDIN)));',special));
fs.writeFileSync(path.join(tmp,'solution.cpp'),T.portable(ast,'cpp'));execFileSync('g++',['-std=c++17',path.join(tmp,'solution.cpp'),'-o',path.join(tmp,'solution')]);assert.deepEqual(execFileSync(path.join(tmp,'solution'),{encoding:'utf8'}).trim().split(/\s+/).map(Number),[10,.5,-3,2,1.5]);
console.log(`Algorithm views: 20 block round trips, pseudocode/flow graph, ${executed} real Python/Node/C++/Java executions PASS`);
