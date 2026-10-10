const names={cube:'kocku',cuboid:'kvadar',prism:'prizmu',pyramid:'piramidu',cylinder:'valjak',cone:'kupu',sphere:'loptu'};
let registered=false;
export function setupBlocks(){if(registered)return;registered=true;const B=window.Blockly,J=window.javascript.javascriptGenerator,P=window.python.pythonGenerator;
 const statement=(type,message,args,color)=>({type,message0:message,args0:args,previousStatement:null,nextStatement:null,colour:color}),num=name=>({type:'input_value',name,check:'Number'}),field=(name,text)=>({type:'field_input',name,text}),dropdown=(name,options)=>({type:'field_dropdown',name,options});
 B.defineBlocksWithJsonArray([
 statement('s33_clear','Očisti scenu',[],180),{type:'s33_solid',message0:'Napravi %1',args0:[dropdown('TYPE',Object.entries(names).map(([v,n])=>[n,v]))],message1:'Ime %1',args1:[field('ID','tijelo')],message2:'Poluprečnik %1',args2:[num('R')],message3:'Visina %1',args3:[num('H')],previousStatement:null,nextStatement:null,colour:190,inputsInline:false},
 statement('s33_set','Tijelo %1 · %2 = %3',[field('ID','tijelo'),dropdown('PROP',[['x','x'],['y','y'],['z','z'],['rotacija X','rx'],['rotacija Y','ry'],['rotacija Z','rz'],['poluprečnik','r'],['visina','h'],['stranica a','a'],['stranica b','b'],['broj stranica','n'],['prozirnost','opacity']]),num('VALUE')],190),
 statement('s33_color','Tijelo %1 boja %2',[field('ID','tijelo'),field('COLOR','#38becb')],190),
 statement('s33_wait','Sačekaj %1 milisekundi',[num('MS')],180),statement('s33_forward','Robot idi naprijed',[],38),statement('s33_turn','Robot okreni %1',[dropdown('DIR',[['desno','1'],['lijevo','-1'],['nazad','2']])],38),
 statement('s33_print','Ispiši %1',[{type:'input_value',name:'VALUE'}],280),
 {type:'s33_distance',message0:'Robot udaljenost do zida',output:'Number',colour:38},{type:'s33_goal',message0:'Robot na cilju?',output:'Boolean',colour:38},{type:'s33_line',message0:'Robot na stazi?',output:'Boolean',colour:38},
 {type:'s33_read',message0:'Učitaj broj',output:'Number',colour:280},
 {type:'s33_get',message0:'Tijelo %1 vrijednost %2',args0:[field('ID','tijelo'),dropdown('PROP',[['visina','h'],['poluprečnik','r'],['x','x'],['y','y'],['z','z']])],output:'Number',colour:190}
 ]);
 for(const g of [J,P]){const end=g===J?';\n':'\n',v=(b,name,f='0')=>g.valueToCode(b,name,g.ORDER_NONE)||f,q=(b,name)=>JSON.stringify(b.getFieldValue(name));g.addReservedWords('trace33,solid33,set33,get33,color33,clear33,print33,read33,forward33,turn33,distance33,goal33,line33,wait33');
 g.forBlock.s33_clear=()=>`clear33()${end}`;g.forBlock.s33_solid=b=>`solid33(${q(b,'ID')}, ${q(b,'TYPE')}, ${v(b,'R','2')}, ${v(b,'H','5')})${end}`;g.forBlock.s33_set=b=>`set33(${q(b,'ID')}, ${q(b,'PROP')}, ${v(b,'VALUE')})${end}`;g.forBlock.s33_color=b=>`color33(${q(b,'ID')}, ${q(b,'COLOR')})${end}`;g.forBlock.s33_wait=b=>`wait33(${v(b,'MS','100')})${end}`;g.forBlock.s33_forward=()=>`forward33()${end}`;g.forBlock.s33_turn=b=>`turn33(${b.getFieldValue('DIR')})${end}`;g.forBlock.s33_print=b=>`print33(${v(b,'VALUE','""')})${end}`;
 for(const [type,fn]of [['s33_distance','distance33'],['s33_goal','goal33'],['s33_line','line33'],['s33_read','read33']])g.forBlock[type]=()=>[`${fn}()`,g.ORDER_FUNCTION_CALL];g.forBlock.s33_get=b=>[`get33(${q(b,'ID')}, ${q(b,'PROP')})`,g.ORDER_FUNCTION_CALL];}
}
export const toolbox={kind:'categoryToolbox',contents:[
{kind:'category',name:'3D tijela',colour:190,contents:['s33_clear','s33_solid','s33_set','s33_get','s33_color'].map(type=>({kind:'block',type}))},
{kind:'category',name:'Robot',colour:38,contents:['s33_forward','s33_turn','s33_distance','s33_goal','s33_line'].map(type=>({kind:'block',type}))},
{kind:'category',name:'Logika',colour:210,contents:['controls_if','logic_compare','logic_operation','logic_negate','logic_boolean'].map(type=>({kind:'block',type}))},
{kind:'category',name:'Petlje',colour:120,contents:['controls_repeat_ext','controls_whileUntil','controls_for','controls_forEach','controls_flow_statements','s33_wait'].map(type=>({kind:'block',type}))},
{kind:'category',name:'Brojevi',colour:230,contents:['math_number','math_arithmetic','math_single','math_round','math_modulo','math_on_list'].map(type=>({kind:'block',type}))},
{kind:'category',name:'Tekst i ulaz',colour:280,contents:['s33_print','s33_read','text','text_join','text_length'].map(type=>({kind:'block',type}))},
{kind:'category',name:'Liste',colour:260,contents:['lists_create_with','lists_length','lists_getIndex','lists_setIndex','lists_sort'].map(type=>({kind:'block',type}))},
{kind:'category',name:'Varijable',custom:'VARIABLE',colour:330},{kind:'category',name:'Funkcije',custom:'PROCEDURE',colour:290}]};
export function starter(workspace,robot=false){
 workspace.clear(); const B=window.Blockly;
 const numeric=n=>({shadow:{type:'math_number',fields:{NUM:n}}});
 const repeat=(n,body)=>({type:'controls_repeat_ext',inputs:{TIMES:numeric(n),DO:{block:body}}});
 let first;
 if(robot){
  first=repeat(4,{type:'s33_forward'});
  const turn={type:'s33_turn',fields:{DIR:'1'}};
  first.next={block:turn};turn.next={block:repeat(4,{type:'s33_forward'})};
 }else{
  const getter={type:'s33_get',fields:{ID:'valjak',PROP:'h'}};
  const plus={type:'math_arithmetic',fields:{OP:'ADD'},inputs:{A:{block:getter},B:numeric(1)}};
  const setter={type:'s33_set',fields:{ID:'valjak',PROP:'h'},inputs:{VALUE:{block:plus}}};
  const solid={type:'s33_solid',fields:{TYPE:'cylinder',ID:'valjak'},inputs:{R:numeric(2),H:numeric(5)},next:{block:repeat(5,setter)}};
  first={type:'s33_clear',next:{block:solid}};
 }
 B.serialization.workspaces.load({blocks:{languageVersion:0,blocks:[{...first,x:32,y:30}]}},workspace);
}
export function generate(workspace,language='js',trace=true){const g=language==='python'?window.python.pythonGenerator:window.javascript.javascriptGenerator,old=g.STATEMENT_PREFIX;try{g.STATEMENT_PREFIX=trace?(language==='python'?'trace33(%1)\n':'trace33(%1);\n'):null;return g.workspaceToCode(workspace);}finally{g.STATEMENT_PREFIX=old;}}
export function diagnostics(workspace){const notes=[];for(const b of workspace.getAllBlocks(false)){if(b.disabled)continue;for(const i of b.inputList)if(i.type===window.Blockly.INPUT_VALUE&&i.connection&&!i.connection.targetBlock())notes.push('Nedostaje ulaz: '+b.toString().slice(0,80));}return notes.slice(0,20);}
export const pythonBridge=`import json, math, sys\n_objects = []\n_frames = []\n_output = ''\n_tokens = iter(sys.stdin.read().split())\ndef trace33(block=''):\n    if len(_frames) >= 1000: raise RuntimeError('Previše koraka')\n    _frames.append({'objects':json.loads(json.dumps(_objects)), 'output':_output, 'block':block, 'variables':{k:v for k,v in globals().copy().items() if not k.startswith('_') and isinstance(v,(int,float,str,bool))}})\ndef clear33():\n    _objects.clear()\ndef solid33(id,kind,r,h):\n    if len(_objects)>=40 or any(o['id']==id for o in _objects): raise ValueError('Previše tijela ili ponovljeno ime')\n    _objects.append(dict(id=str(id),type=kind,r=r,h=h,a=3,b=3,n=6,x=0,y=0,z=0,rx=0,ry=0,rz=0,color='#38becb',opacity=.75))\ndef set33(id,key,value):\n    next(o for o in _objects if o['id']==id)[key]=value\ndef get33(id,key):\n    return next(o for o in _objects if o['id']==id)[key]\ndef color33(id,color):\n    set33(id,'color',color)\ndef wait33(ms):\n    pass\ndef print33(v):\n    global _output\n    _output += str(v)+'\\n'\ndef read33():\n    return float(next(_tokens))\n`;
