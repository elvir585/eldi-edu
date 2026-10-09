'use strict';
// Student code is interpreted as ES5 and receives only the educational API.
importScripts('vendor/interpreter.js');
let activeDebug=null;
self.onmessage = event => {
  const request = event.data || {};
  if(request.cmd){activeDebug?.control(request);return;}
  activeDebug?.stop();activeDebug=null;
  let boundary=false,lastBlock='',waitMs=0;
  let batch = [], all = [], output = '', steps = 0, interpreter, watchNames;
  const start = Date.now(), inputs = Array.isArray(request.input) ? request.input.map(String) : String(request.input || '').replace(/\r\n/g, '\n').split('\n');
  if (inputs.at(-1) === '') inputs.pop();
  let inputIndex = 0, active = Math.max(0, Math.min(2, Math.trunc(Number(request.sprite) || 0)));
  const sprites = [{x:0,y:0,angle:0,color:'#8870c5',width:2,pen:true,visible:true},{x:-120,y:0,angle:0,color:'#829e3e',width:2,pen:true,visible:true},{x:120,y:0,angle:0,color:'#de8b5d',width:2,pen:true,visible:true}];
  let trail = [], background = '#fffef9';
  function number(value, limit = 100000) { value = Number(value); if (!Number.isFinite(value) || Math.abs(value) > limit) throw Error('Vrijednost kretanja ili računanja nije dozvoljena.'); return value; }
  function color(value) { value = String(value); if (!/^#[0-9a-f]{6}$/i.test(value)) throw Error('Boja mora biti u obliku #RRGGBB.'); return value; }
  function snapshot() {
    if (!interpreter) return {};
    const vars = {}, names = watchNames || new Set();
    function declarations(node) { if (!node || typeof node !== 'object') return; if (node.type === 'VariableDeclarator' && node.id?.name && !node.id.name.startsWith('_')) names.add(node.id.name); for (const value of Object.values(node)) if (Array.isArray(value)) value.forEach(declarations); else if (value && typeof value === 'object' && value.type) declarations(value); }
    if (!watchNames) { declarations(interpreter.parse_(request.code, 'watch')); watchNames = names; }
    const simplify = (value, depth = 0) => {
      if (value === undefined) return 'nije postavljeno';
      if (value === null || ['number','boolean'].includes(typeof value)) return value;
      if (typeof value === 'string') return value.slice(0,200);
      if (depth > 2) return '[…]';
      if (value?.class === 'Array') { const length = Math.min(Number(value.properties?.length) || 0, 20); return Array.from({length}, (_,index) => simplify(value.properties[String(index)],depth+1)); }
      return '[objekt]';
    };
    for (const name of [...names].slice(0,50)) {
      let scope = interpreter.stateStack.at(-1)?.scope || interpreter.globalScope;
      while (scope && !Object.prototype.hasOwnProperty.call(scope.object?.properties || {},name)) scope = scope.parentScope;
      const value = scope ? scope.object.properties[name] : interpreter.globalScope.object.properties[name];
      if (value?.class === 'Function') continue;
      vars[name] = simplify(value);
    }
    return vars;
  }
  function state() { const s = sprites[active]; return {x:s.x,y:s.y,heading:s.angle,active,sprites:sprites.map(value=>({...value})),trail:trail.map(value=>({...value})),trailCount:trail.length,background}; }
  function emit(action) {
    if (all.length >= 10000) throw Error('Program sadrži više od 10 000 naredbi.');
    action.variables = snapshot();
    all.push(action); batch.push(action);
    if (batch.length >= 100) {self.postMessage({type:'actions',actions:batch});batch=[];}
  }
  function line(x, y) { const s = sprites[active]; if (s.pen) trail.push({kind:'line',x1:s.x,y1:s.y,x2:x,y2:y,color:s.color,width:s.width}); s.x=x;s.y=y; }
  function write(value,type) { value=String(value).slice(0,1000); if (output.length+value.length+1>64000) throw Error('Konzola je prekoračila 64 000 znakova.');output+=value+'\n';emit({type,value}); }
  function read(prompt, numeric) { if (inputIndex >= inputs.length) throw Error('Standardni ulaz je potrošen. Dodajte tražene podatke u polje Ulaz.'); const value=inputs[inputIndex++];emit({type:'input',prompt:String(prompt).slice(0,200),value});if (!numeric) return value;const text=value.trim().replace(',','.');if(!text)throw Error('Unesite broj, a ne prazan red.');return number(text,Number.MAX_SAFE_INTEGER); }
  const api = {
    move:value=>{value=number(value);const s=sprites[active];line(s.x+Math.cos(s.angle*Math.PI/180)*value,s.y-Math.sin(s.angle*Math.PI/180)*value);emit({type:'move',value});},
    turn:value=>{value=number(value);sprites[active].angle+=value;emit({type:'turn',value});},
    go:(x,y)=>{x=number(x);y=number(y);line(x,y);emit({type:'go',x,y});},
    say:value=>write(value,'say'), printOutput:value=>write(value,'print'),
    traceBlock:id=>{lastBlock=String(id).slice(0,100);boundary=true;emit({type:'trace',id:lastBlock});},
    readInput:prompt=>read(prompt,false), readNumber:prompt=>read(prompt,true),
    pen:value=>{sprites[active].pen=!!value;emit({type:'pen',value:!!value});},
    sprite:value=>{value=Math.max(0,Math.min(sprites.length-1,Math.trunc(number(value))));active=value;emit({type:'sprite',value});},
    wait:value=>{const seconds=Math.max(0,Math.min(3,number(value)));waitMs=seconds*1000;emit({type:'wait',value:seconds});},
    clone:()=>{if(sprites.length>=30)throw Error('Dozvoljeno je najviše 30 likova.');sprites.push({...sprites[active],x:sprites[active].x+10,y:sprites[active].y+10});emit({type:'clone'});},
    clear:()=>{trail=[];emit({type:'clear'});}, key:name=>(request.keys||[]).includes(String(name)),
    timer:()=>(Date.now()-start)/1000,
    solid:(type,r,h)=>{if(!['cube','cuboid','prism','pyramid','cylinder','cone','sphere'].includes(String(type)))throw Error('Nepoznato tijelo.');r=number(r,12);h=number(h,12);if(r<.5||h<.5)throw Error('Dimenzije tijela: od 0.5 do 12.');emit({type:'solid',solid:String(type),r,h});},
    xpos:()=>sprites[active].x, ypos:()=>sprites[active].y, heading:()=>((sprites[active].angle%360)+360)%360,
    mouseX:()=>number(request.mouse?.x||0),mouseY:()=>number(request.mouse?.y||0),
    edge:()=>Math.abs(sprites[active].x)>=228||Math.abs(sprites[active].y)>=168,
    distance:value=>{const target=sprites[Math.max(0,Math.min(sprites.length-1,Math.trunc(number(value))))];return Math.hypot(target.x-sprites[active].x,target.y-sprites[active].y);},
    visible:value=>{sprites[active].visible=!!value;emit({type:'visible',value:!!value});},
    pencolor:value=>{value=color(value);sprites[active].color=value;emit({type:'color',value});},
    penwidth:value=>{value=Math.max(.5,Math.min(30,number(value)));sprites[active].width=value;emit({type:'width',value});},
    background:value=>{value=color(value);background=value;emit({type:'background',value});},
    circle:value=>{value=Math.abs(number(value,10000));const s=sprites[active];trail.push({kind:'circle',x:s.x,y:s.y,r:value,color:s.color,width:s.width});emit({type:'circle',value});},
    rectangle:(width,height)=>{width=Math.abs(number(width,10000));height=Math.abs(number(height,10000));const s=sprites[active];trail.push({kind:'rectangle',x:s.x,y:s.y,w:width,h:height,angle:s.angle,color:s.color,width:s.width});emit({type:'rectangle',width,height});},
    tone:(frequency,duration)=>emit({type:'tone',frequency:Math.max(20,Math.min(20000,number(frequency))),duration:Math.max(0,Math.min(2,number(duration)))})
  };
  const helpers = 'var _messages=Object.create(null);var _messageDepth=0;function on(name,fn){if(!_messages[name])_messages[name]=[];_messages[name].push(fn);}function broadcast(name){if(++_messageDepth>50)throw new Error("Previše međusobnih poruka.");var list=_messages[name]||[];for(var i=0;i<list.length;i++)list[i]();_messageDepth--;}\n';
  try {
    if (typeof request.code !== 'string' || request.code.length>128000) throw Error('Blokovski kod je neispravan ili prevelik.');
    interpreter = new JSInterpreter(helpers+request.code,(instance,global)=>{
      for(const [name,fn] of Object.entries(api)) instance.setProperty(global,name,instance.createNativeFunction((...args)=>fn(...args.map(value=>value&&typeof value==='object'?instance.pseudoToNative(value):value))));
      const consoleObject=instance.createObjectProto(instance.OBJECT_PROTO);
      instance.setProperty(consoleObject,'log',instance.createNativeFunction(value=>api.printOutput(value)));
      instance.setProperty(global,'console',consoleObject);
    });
    // The interpreter consumes Program.body as it executes. Cache declarations
    // before the first input/output callback can observe a partly consumed AST.
    snapshot();
    if(request.debug){
      let paused=!!request.paused,stepping=paused,timer=null,stopped=false,cpuMs=0,breakpoints=new Set(request.breakpoints||[]);
      const flush=()=>{if(batch.length){self.postMessage({type:'actions',actions:batch});batch=[];}};
      function finish(error){if(stopped)return;stopped=true;clearTimeout(timer);flush();self.postMessage(error?{type:'error',message:error.message,result:{ok:false,output,stage:state(),variables:snapshot(),steps,inputUsed:inputIndex,durationMs:cpuMs}}:{type:'done',result:{ok:true,output,stage:state(),variables:snapshot(),steps,inputUsed:inputIndex,durationMs:cpuMs}});}
      function pump(){timer=null;if(stopped)return;const tick=Date.now();let yieldDelay=0;try{for(let slice=0;slice<1500;slice++){
        if(++steps>2000000||cpuMs+Date.now()-tick>4500)throw Error('Prekoračeno vrijeme računanja. Pauza se ne uračunava.');
        if(!interpreter.step()){cpuMs+=Date.now()-tick;finish();return;}
        if(boundary){boundary=false;if(stepping||paused||breakpoints.has(lastBlock)){paused=true;stepping=false;cpuMs+=Date.now()-tick;flush();self.postMessage({type:'paused',id:lastBlock,variables:snapshot(),steps});return;}}
        if(waitMs){yieldDelay=waitMs;waitMs=0;break;}
      }cpuMs+=Date.now()-tick;flush();timer=setTimeout(pump,yieldDelay);}catch(error){finish(error);}}
      activeDebug={stop(){stopped=true;clearTimeout(timer);},control(c){if(c.cmd==='sensors'){request.keys=Array.isArray(c.keys)?c.keys:[];if(c.mouse)request.mouse=c.mouse;return;}if(c.cmd==='breakpoints'){breakpoints=new Set(c.ids||[]);return;}if(c.cmd==='pause'){paused=true;return;}if(c.cmd==='step'||c.cmd==='resume'){clearTimeout(timer);paused=false;stepping=c.cmd==='step';timer=setTimeout(pump,0);}}};
      pump();return;
    }
    while(interpreter.step()) if(++steps>2000000||Date.now()-start>4500)throw Error('Prekoračeno vrijeme izvršavanja blokovskog programa.');
    if(batch.length)self.postMessage({type:'actions',actions:batch});
    self.postMessage({type:'done',result:{ok:true,output,stage:state(),variables:snapshot(),steps,inputUsed:inputIndex,durationMs:Date.now()-start}});
  } catch(error) { if(batch.length)self.postMessage({type:'actions',actions:batch});self.postMessage({type:'error',message:error.message,result:{ok:false,output,stage:state(),variables:snapshot(),steps,inputUsed:inputIndex,durationMs:Date.now()-start}}); }
};
