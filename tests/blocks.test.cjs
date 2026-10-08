'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { DOMImplementation, DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

// The real Blockly libraries and the real generator are loaded headlessly.
// Only canvas drawing and browser element lookup are stubbed; serialization,
// Blockly loop generation and worker interpretation remain production code.
function studio({dark=false}={}) {
  const fills=[],paintTarget={fillRect(){fills.push(this.fillStyle);}};
  const paint = new Proxy(paintTarget, { get: (target,name) => target[name]??(()=>{}), set: (target,name,value) => {target[name]=value;return true;} });
  const elements = {
    stage: { getContext: () => paint }, blockcode: { textContent: '' },
    blocklang: { value: 'js' }, blockout: { textContent: '' }, sprite: { value: '0' },
    blockinput: {value:''},blocktrace:{textContent:''},blockcheck:{textContent:''}
  };
  const document = new DOMImplementation().createDocument(null,'html',null);
  document.getElementById = id => elements[id];
  document.addEventListener = () => {};
  document.removeEventListener = () => {};
  document.body={classList:{contains:name=>dark&&name==='dark'}};
  const context = vm.createContext({
    console, setTimeout, clearTimeout, navigator: {},
    document, DOMParser, XMLSerializer
  });
  context.window = context;
  for (const file of ['blockly_compressed.js', 'blocks_compressed.js', 'javascript_compressed.js', 'python_compressed.js', 'bs.js']) {
    vm.runInContext(read('renderer/vendor/' + file), context, { filename: file });
  }
  vm.runInContext(read('renderer/blocks.js'), context, { filename: 'blocks.js' });
  context.Blockly.inject = (element,options) => {
    context.injectOptions=options;
    const workspace=new context.Blockly.Workspace();
    workspace.setTheme=theme=>{context.appliedTheme=theme;};
    return workspace;
  };
  context.ELDIBlocks.init({ onSave() {} });
  context.ELDIBlocks.testContext = context;
  context.stageFills=fills;
  return context.ELDIBlocks;
}

function execute(code, keys = [], extra = {}) {
  const messages = [];
  const context = vm.createContext({ console, Date, self: { postMessage: message => messages.push(message) } });
  context.importScripts = file => vm.runInContext(read('renderer/' + file), context, { filename: file });
  vm.runInContext(read('renderer/block-worker.js'), context, { filename: 'block-worker.js' });
  context.self.onmessage({ data: { code, keys, sprite: 0, ...extra } });
  return { messages, actions: messages.flatMap(message => message.actions || []), last: messages.at(-1) };
}

test('Square example generates and interprets four moves and four turns', () => {
  const blocks = studio();
  try {
    blocks.example('square');
    const program = blocks.code('js');
    assert.match(program, /move\(80\)/);
    const result = execute(program);
    assert.equal(result.last.type, 'done', JSON.stringify(result.last));
    assert.equal(result.actions.filter(action => action.type === 'move' && action.value === 80).length, 4);
    assert.equal(result.actions.filter(action => action.type === 'turn' && action.value === 90).length, 4);
  } finally { blocks.destroy(); }
});

test('Counting example produces an introduction and three repeated messages', () => {
  const blocks = studio();
  try {
    blocks.example('count');
    const result = execute(blocks.code('js'));
    assert.equal(result.last.type, 'done', JSON.stringify(result.last));
    assert.deepEqual(Array.from(result.actions.filter(action => action.type === 'say'), action => action.value), ['Brojimo tri puta', 'Učim!', 'Učim!', 'Učim!']);
    assert.doesNotMatch(blocks.code('py'), /import turtle/);
    assert.match(blocks.code('py'), /print\('Učim!'\)/);
  } finally { blocks.destroy(); }
});

test('The studio starts with the selected visual theme and theme changes preserve the loaded program', () => {
  for(const dark of [false,true]){
    const blocks=studio({dark});
    try{
      const context=blocks.testContext,initial=context.injectOptions.theme;
      assert.equal(blocks.getTheme(),dark?'dark':'light');
      assert.equal(initial.name,dark?'eldi_dark':'eldi_light');
      assert.equal(context.stageFills.at(-1),dark?'#101827':'#fffef9');
      blocks.example('square');
      const saved=JSON.stringify(blocks.serialize()),js=blocks.code('js'),py=blocks.code('py');
      blocks.setTheme(dark?'light':'dark');
      assert.equal(context.appliedTheme.name,dark?'eldi_light':'eldi_dark');
      assert.equal(JSON.stringify(blocks.serialize()),saved);
      assert.equal(blocks.code('js'),js);
      assert.equal(blocks.code('py'),py);
      assert.equal(context.stageFills.at(-1),dark?'#fffef9':'#101827');
      const execution=execute(blocks.code('js'));
      assert.equal(execution.last.type,'done');
      assert.equal(execution.last.result.stage.trailCount,4);
    }finally{blocks.destroy();}
  }
});

test('Theme changes keep paused playback and a program-selected stage background', async () => {
  const blocks=studio({dark:true});
  try{
    const context=blocks.testContext;
    context.Worker=class {
      constructor(){this.terminated=false;}
      postMessage(request){setTimeout(()=>{if(this.terminated)return;const run=execute(request.code,request.keys,request);for(const message of run.messages){if(this.terminated)break;this.onmessage({data:message});}},0);}
      terminate(){this.terminated=true;}
    };
    blocks.load({format:'ELDI-BLOCKS-1',workspace:{blocks:{languageVersion:0,blocks:[
      {type:'edu_background',inputs:{COLOR:{block:{type:'text',fields:{TEXT:'#082a3e'}}}},next:{block:{type:'edu_move',inputs:{N:{block:{type:'math_number',fields:{NUM:20}}}}}}}
    ]}}});
    const saved=JSON.stringify(blocks.serialize()),running=blocks.run({paused:true,speed:0});
    await new Promise(resolve=>setTimeout(resolve,20));
    const before=JSON.stringify(blocks.getState());
    assert.ok(blocks.getState().queue>0);
    blocks.setTheme('light');
    assert.equal(JSON.stringify(blocks.getState()),before);
    assert.equal(JSON.stringify(blocks.serialize()),saved);
    while(blocks.getState().queue)blocks.step();
    const result=await running;
    assert.equal(result.ok,true);
    assert.equal(result.stage.x,20);
    assert.equal(context.stageFills.at(-1),'#082a3e');
    blocks.setTheme('dark');
    assert.equal(context.stageFills.at(-1),'#082a3e');
    blocks.setTheme('light');
    assert.equal(context.stageFills.at(-1),'#082a3e');
    assert.equal(JSON.stringify(blocks.serialize()),saved);
  }finally{blocks.destroy();}
});

test('Broadcast invokes its interpreter callback and nested broadcasts stop at the depth bound', () => {
  const result = execute('on("start", function(){ say("Primljeno"); }); broadcast("start");');
  assert.equal(result.last.type, 'done', JSON.stringify(result.last));
  assert.ok(result.actions.some(action => action.type === 'say' && action.value === 'Primljeno'));
  const cycle = execute('on("cycle", function(){ broadcast("cycle"); }); broadcast("cycle");');
  assert.equal(cycle.last.type, 'error');
  assert.match(cycle.last.message, /poruka/);
});

test('Generated receivers register before broadcasts regardless of visual block order', () => {
  const blocks = studio();
  try {
    blocks.load({ format: 'ELDI-BLOCKS-1', workspace: { blocks: { languageVersion: 0, blocks: [
      { type: 'edu_message', x: 0, y: 0, inputs: { TEXT: { block: { type: 'text', fields: { TEXT: 'start' } } } } },
      { type: 'edu_received', x: 0, y: 100, fields: { MESSAGE: 'start' }, inputs: { DO: { block: { type: 'edu_say', inputs: { TEXT: { block: { type: 'text', fields: { TEXT: 'Primljeno iz blokova' } } } } } } } }
    ] } } });
    const program = blocks.code('js');
    assert.ok(program.indexOf('on(') < program.indexOf('broadcast('), program);
    const result = execute(program);
    assert.equal(result.last.type, 'done', JSON.stringify(result.last));
    assert.ok(result.actions.some(action => action.type === 'say' && action.value === 'Primljeno iz blokova'));
  } finally { blocks.destroy(); }
});

test('Key conditions distinguish pressed and released key snapshots', () => {
  const program = 'if(key("ArrowRight")){move(12);} else {move(-12);}';
  for (const pressed of [false, true]) {
    const result = execute(program, pressed ? ['ArrowRight'] : []);
    assert.equal(result.last.type, 'done', JSON.stringify(result.last));
    assert.equal(result.actions.find(action => action.type === 'move').value, pressed ? 12 : -12);
  }
});

test('Unbounded movement stops at the instruction limit and invalid motion rejects non-finite input', () => {
  const result = execute('while(true){move(1);}');
  assert.equal(result.last.type, 'error');
  assert.match(result.last.message, /10 000/);
  assert.ok(result.actions.length <= 10000);
  const invalid = execute('move(1/0);');
  assert.equal(invalid.last.type, 'error');
  assert.match(invalid.last.message, /Vrijednost kretanja/);
});

test('Input, print, variable snapshots and decimal comma work without window.prompt', () => {
  const result=execute('var a=readNumber("A");var b=readNumber("B");printOutput(a+b);var name=readInput("Ime");printOutput(name);',[],{input:'2,5\n3\nČajić\n'});
  assert.equal(result.last.type,'done',JSON.stringify(result.last));
  assert.equal(result.last.result.output,'5.5\nČajić\n');
  assert.equal(result.last.result.variables.a,2.5);
  assert.equal(result.last.result.variables.name,'Čajić');
  assert.equal(result.last.result.inputUsed,3);
  const empty=execute('readNumber("broj");');assert.equal(empty.last.type,'error');assert.match(empty.last.message,/ulaz/);
});

test('The worker tracks geometry and sensor reads before visual playback', () => {
  const result=execute('pen(1);pencolor("#123456");penwidth(4);move(80);turn(90);move(50);printOutput(xpos());printOutput(ypos());visible(0);circle(20);rectangle(30,10);');
  assert.equal(result.last.type,'done',JSON.stringify(result.last));
  assert.equal(result.last.result.output,'80\n-50\n');
  assert.equal(result.last.result.stage.trailCount,4);
  assert.equal(result.last.result.stage.sprites[0].visible,false);
  assert.equal(result.last.result.stage.trail[0].color,'#123456');
  assert.equal(result.last.result.stage.trail[0].width,4);
});

test('All toolbox entries are supported block types and input/print generators use interpreter APIs', () => {
  const blocks=studio();try{
    const context=blocks.testContext;
    for(const category of blocks.getToolbox().contents)for(const entry of category.contents||[])assert.ok(context.Blockly.Blocks[entry.type],`Unsupported toolbox block: ${entry.type}`);
    const question={type:'text',fields:{TEXT:'Ime?'}};
    const prompt={type:'text_prompt_ext',fields:{TYPE:'TEXT'},inputs:{TEXT:{block:question}}};
    const print={type:'text_print',inputs:{TEXT:{block:prompt}}};
    blocks.load({format:'ELDI-BLOCKS-1',workspace:{blocks:{languageVersion:0,blocks:[print]}}});
    const code=blocks.code('js');assert.doesNotMatch(code,/window.prompt|alert\(/);assert.match(code,/readInput/);assert.match(code,/printOutput/);
    const result=execute(code,[],{input:'Elvir\n'});assert.equal(result.last.result.output,'Elvir\n');
    blocks.example('square');assert.match(blocks.code('py'),/import turtle/);assert.match(blocks.code('py'),/punom Pythonu s Tkinterom/);
  }finally{blocks.destroy();}
});

test('Challenge checks inspect actual output and geometry and reject unfinished runs', () => {
  const blocks=studio();try{
    const output=execute('printOutput(42);');const result={...output.last.result,actions:output.actions};
    assert.equal(blocks.matchCheck({type:'output',expected:'42'},result).correct,true);
    assert.equal(blocks.matchCheck({type:'output',expected:'41'},result).correct,false);
    assert.equal(blocks.matchCheck({type:'output',expected:'42'},{...result,ok:false}).correct,false);
    blocks.example('square');const square=execute(blocks.code('js'));const sr={...square.last.result,actions:square.actions};
    assert.equal(blocks.matchCheck({type:'stage',x:0,y:0,heading:360,trailCount:4,width:80,height:80,closed:true},sr).correct,true);
  }finally{blocks.destroy();}
});

test('Every grade has substantial challenges and all serialized solutions pass their own actual execution checks', () => {
  const blocks=studio();try{
    const context=blocks.testContext;vm.runInContext(read('content/block-challenges.js'),context,{filename:'block-challenges.js'});
    const challenges=context.ELDI_BLOCK_CHALLENGES;assert.ok(challenges.length>=50);
    assert.equal(new Set(challenges.map(item=>item.id)).size,challenges.length);
    for(const grade of [5,6,7,8,9])assert.ok(challenges.filter(item=>item.grade===grade).length>=10);
    for(const item of challenges){
      assert.ok(item.description.length>=20&&item.hints.length>=1,`Incomplete challenge ${item.id}`);
      assert.ok(item.starter.workspace.blocks.blocks.length>0,`Empty starter ${item.id}`);
      assert.notEqual(JSON.stringify(item.starter),JSON.stringify(item.solution),`Starter already equals solution ${item.id}`);
      blocks.load(item.solution);const run=execute(blocks.code('js'),[],{input:item.input||''});
      assert.equal(run.last.type,'done',`${item.id}: ${JSON.stringify(run.last)}`);
      const result={...run.last.result,actions:run.actions};
      assert.equal(blocks.matchCheck(item.check,result).correct,true,`${item.id}: expected ${JSON.stringify(item.check)}, actual ${result.output}, stage ${JSON.stringify(result.stage)}`);
    }
  }finally{blocks.destroy();}
});

test('Run promises preserve their selected challenge and paused playback advances by steps', async () => {
  const blocks=studio();try{
    const context=blocks.testContext;
    context.Worker=class {
      constructor(){this.terminated=false;}
      postMessage(request){setTimeout(()=>{if(this.terminated)return;const run=execute(request.code,request.keys,request);for(const message of run.messages){if(this.terminated)break;this.onmessage({data:message});}},0);}
      terminate(){this.terminated=true;}
    };
    blocks.example('square');
    blocks.setChallenge({id:'square-old',check:{type:'stage',x:0,y:0,trailCount:4}});
    const running=blocks.run({paused:true,speed:0});
    blocks.setChallenge({id:'new-task',check:{type:'output',expected:'different'}});
    await new Promise(resolve=>setTimeout(resolve,20));
    assert.equal(blocks.getState().paused,true);assert.ok(blocks.getState().queue>0);
    const before=blocks.getState().queue;blocks.step();assert.equal(blocks.getState().queue,before-1);
    while(blocks.getState().queue)blocks.step();
    const result=await running;assert.equal(result.challenge.id,'square-old');assert.equal(result.challenge.correct,true);
    assert.equal(result.stage.trailCount,4);
    blocks.example('count');const console=await blocks.run({checkOnly:true});assert.equal(console.output,'Brojimo tri puta\nUčim!\nUčim!\nUčim!\n');
  }finally{blocks.destroy();}
});

test('Current input selects its own project check and unknown inputs never earn sample credit', async () => {
  const blocks=studio();
  try {
    const context=blocks.testContext;
    context.Worker=class {
      constructor(){this.terminated=false;}
      postMessage(request){setTimeout(()=>{if(this.terminated)return;const run=execute(request.code,request.keys,request);for(const message of run.messages){if(this.terminated)break;this.onmessage({data:message});}},0);}
      terminate(){this.terminated=true;}
    };
    blocks.load({format:'ELDI-BLOCKS-1',workspace:{blocks:{languageVersion:0,blocks:[
      {type:'edu_print',inputs:{TEXT:{block:{type:'edu_number_input',inputs:{PROMPT:{block:{type:'text',fields:{TEXT:''}}}}}}}}
    ]}}});
    blocks.setChallenge({id:'two-input-tests',input:'7',check:{type:'output',expected:'7'},tests:[
      {input:'7',check:{type:'output',expected:'7',inputCount:1}},
      {input:'12',check:{type:'output',expected:'12',inputCount:1}}
    ]});
    const second=await blocks.run({input:'12\r\n',checkOnly:true});
    assert.equal(second.challenge.correct,true,'The second input uses the second expected result.');
    assert.equal(second.output.trim(),'12');
    assert.equal(second.ungradedInput,false);
    const unknown=await blocks.run({input:'33',checkOnly:true});
    assert.equal(unknown.ok,true,'Custom input still runs the real program.');
    assert.equal(unknown.output.trim(),'33');
    assert.equal(unknown.challenge,undefined,'Custom input has no saved task credit.');
    assert.equal(unknown.ungradedInput,true);
    assert.match(context.document.getElementById('blockcheck').textContent,/bez automatskog ocjenjivanja/);
    blocks.setChallenge({id:'legacy-input',input:'7',check:{type:'output',expected:'7'}});
    const legacy=await blocks.run({input:'33',checkOnly:true});
    assert.equal(legacy.challenge,undefined,'The earlier 60 challenges also reject stale sample grading.');
    assert.equal(legacy.ungradedInput,true);
  } finally { blocks.destroy(); }
});

test('Shape checks inspect every rectangle position and dimension, not only the drawing count', () => {
  const blocks=studio();
  try {
    const run=execute('rectangle(20,15); pen(false); go(25,0); pen(true); rectangle(20,15);');
    assert.equal(run.last.type,'done');
    const result={...run.last.result,actions:run.actions};
    const check={type:'stage',x:25,y:0,trailCount:2,shapes:[
      {kind:'rectangle',x:0,y:0,w:20,h:15,angle:0},
      {kind:'rectangle',x:25,y:0,w:20,h:15,angle:0}
    ]};
    assert.equal(blocks.matchCheck(check,result).correct,true);
    const wrongWidth=JSON.parse(JSON.stringify(result));
    wrongWidth.stage.trail[0].w=19;
    assert.equal(blocks.matchCheck(check,wrongWidth).correct,false,'The same number of rectangles with the wrong cell width fails.');
    const wrongPosition=JSON.parse(JSON.stringify(result));
    wrongPosition.stage.trail[1].x=24;
    assert.equal(blocks.matchCheck(check,wrongPosition).correct,false,'The final sprite position cannot substitute for every rectangle position.');
    const wrongOrder=JSON.parse(JSON.stringify(result));
    wrongOrder.stage.trail.reverse();
    assert.equal(blocks.matchCheck(check,wrongOrder).correct,false);
  } finally { blocks.destroy(); }
});

test('Geometry challenges reject zero-length drawings and input challenges reject hardcoded output without reads', () => {
  const blocks=studio();try{
    const context=blocks.testContext;vm.runInContext(read('content/block-challenges.js'),context);
    const dataset=context.ELDI_BLOCK_CHALLENGES;
    const degenerate=execute('for(var i=0;i<4;i++){move(0);turn(90);}');
    const result={...degenerate.last.result,actions:degenerate.actions};
    for(const id of ['blocks-5-kvadrat','blocks-5-pravougaonik'])assert.equal(blocks.matchCheck(dataset.find(item=>item.id===id).check,result).correct,false,id);
    const challenge=dataset.find(item=>item.id==='blocks-5-zbir');
    assert.equal(challenge.check.inputCount,2);
    const hardcoded=execute('printOutput(500);',[],{input:challenge.input});
    assert.equal(blocks.matchCheck(challenge.check,{...hardcoded.last.result,actions:hardcoded.actions}).correct,false);
    const required=execute('var a=readNumber("A"),b=readNumber("B");printOutput(a+b);',[],{input:challenge.input});
    assert.equal(blocks.matchCheck(challenge.check,{...required.last.result,actions:required.actions}).correct,true);
    const eventDrawing=dataset.find(item=>item.id==='blocks-7-događaj-crtanje');
    const noDrawing=execute('say("Kvadrat je nacrtan.");');
    assert.equal(blocks.matchCheck(eventDrawing.check,{...noDrawing.last.result,actions:noDrawing.actions}).correct,false);
    const wrongSize=execute('for(var i=0;i<4;i++){move(20);turn(90);}say("Kvadrat je nacrtan.");');
    assert.equal(blocks.matchCheck(eventDrawing.check,{...wrongSize.last.result,actions:wrongSize.actions}).correct,false);
  }finally{blocks.destroy();}
});
