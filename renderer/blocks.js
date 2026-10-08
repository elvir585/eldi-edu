'use strict';
window.ELDIBlocks = (() => {
  const JS = javascript.javascriptGenerator, PY = python.pythonGenerator;
  let workspace=null,worker=null,onSave=()=>{},onRun=()=>{},challenge=null;
  let sprites=[],current=0,trail=[],background='#fffef9',actionQueue=[],allActions=[],finalResult=null;
  let runningTimer=null,animTimer=null,paused=false,runResolve=null,audio=null,speed=25;
  const keys=new Set(),mouse={x:0,y:0},$=id=>document.getElementById(id);
  const num=(value=10)=>({block:{type:'math_number',fields:{NUM:value}}}),text=value=>({block:{type:'text',fields:{TEXT:value}}});
  const statement=(type,message,args,colour=210)=>({type,message0:message,args0:args,previousStatement:null,nextStatement:null,colour});
  const input=(name,check)=>({type:'input_value',name,...(check?{check}:{})});
  const field=(name,options)=>({type:'field_dropdown',name,options});
  const reporter=(type,message,args,output,colour=190)=>({type,message0:message,args0:args,output,colour});
  const defs=[
    statement('edu_move','idi %1 koraka',[input('N','Number')]),
    statement('edu_turn','okreni desno %1 °',[input('N','Number')]),
    statement('edu_goto','idi na x %1 y %2',[input('X','Number'),input('Y','Number')]),
    statement('edu_say','reci %1',[input('TEXT')],280),
    statement('edu_print','ispiši %1',[input('TEXT')],170),
    reporter('edu_input','učitaj tekst • upit %1',[input('PROMPT')],'String',170),
    reporter('edu_number_input','učitaj broj • upit %1',[input('PROMPT')],'Number',170),
    statement('edu_pen','olovka %1',[field('STATE',[['spuštena','1'],['podignuta','0']])],160),
    statement('edu_color','boja olovke %1',[input('COLOR','String')],160),
    statement('edu_width','debljina olovke %1',[input('N','Number')],160),
    statement('edu_background','boja pozadine %1',[input('COLOR','String')],160),
    statement('edu_circle','nacrtaj kružnicu • poluprečnik %1',[input('R','Number')],160),
    statement('edu_rectangle','nacrtaj pravougaonik • širina %1 visina %2',[input('W','Number'),input('H','Number')],160),
    statement('edu_sprite','izaberi lik %1',[field('S',[['Lik 1','0'],['Lik 2','1'],['Lik 3','2']])],280),
    statement('edu_visible','lik %1',[field('STATE',[['prikaži','1'],['sakrij','0']])],280),
    statement('edu_wait','čekaj %1 sekundi',[input('N','Number')],45),
    statement('edu_message','pošalji poruku %1',[input('TEXT')],45),
    {type:'edu_received',message0:'kada primim %1 %2 radi %3',args0:[{type:'field_input',name:'MESSAGE',text:'start'},{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:45},
    statement('edu_clone','napravi klon aktivnog lika',[],280),statement('edu_clear','očisti pozornicu',[],160),
    reporter('edu_key','pritisnuta tipka %1 ?',[field('KEY',[['desno','ArrowRight'],['lijevo','ArrowLeft'],['gore','ArrowUp'],['dolje','ArrowDown'],['razmak',' ']])],'Boolean'),
    reporter('edu_x','x položaj',[],'Number'),reporter('edu_y','y položaj',[],'Number'),reporter('edu_heading','smjer u stepenima',[],'Number'),
    reporter('edu_mouse_x','x miša',[],'Number'),reporter('edu_mouse_y','y miša',[],'Number'),reporter('edu_edge','dodiruje rub ?',[],'Boolean'),
    reporter('edu_distance','rastojanje do lika %1',[input('S','Number')],'Number'),
    statement('edu_tone','zvuk • frekvencija %1 Hz • trajanje %2 s',[input('FREQ','Number'),input('DURATION','Number')],300)
  ];
  Blockly.defineBlocksWithJsonArray(defs);
  const value=(generator,block,name,fallback='0')=>generator.valueToCode(block,name,generator.ORDER_NONE)||fallback;
  for(const generator of [JS,PY]) {
    const py=generator===PY,end=py?'\n':';\n';
    for(const [type,name,params] of [
      ['edu_move','move',['N']],['edu_turn','turn',['N']],['edu_goto','go',['X','Y']],
      ['edu_color','pencolor',['COLOR']],['edu_width','penwidth',['N']],['edu_background','background',['COLOR']],
      ['edu_circle','circle',['R']],['edu_rectangle','rectangle',['W','H']],['edu_wait','wait',['N']],['edu_tone','tone',['FREQ','DURATION']]
    ]) generator.forBlock[type]=(block,g)=>name+'('+params.map(param=>value(g,block,param)).join(', ')+')'+end;
    for(const type of ['edu_say','edu_print','text_print']) generator.forBlock[type]=(block,g)=>(py?'print':type==='edu_say'?'say':'printOutput')+'('+value(g,block,type==='text_print'?'TEXT':'TEXT','""')+')'+end;
    for(const [type,name] of [['edu_pen','pen'],['edu_sprite','sprite'],['edu_visible','visible']]) generator.forBlock[type]=block=>name+'('+block.getFieldValue(type==='edu_sprite'?'S':'STATE')+')'+end;
    generator.forBlock.edu_message=(block,g)=>'broadcast('+value(g,block,'TEXT','""')+')'+end;
    generator.forBlock.edu_clone=()=>`clone()${end}`;generator.forBlock.edu_clear=()=>`clear()${end}`;
    generator.forBlock.edu_key=block=>[`key(${JSON.stringify(block.getFieldValue('KEY'))})`,generator.ORDER_FUNCTION_CALL];
    for(const [type,name] of [['edu_x','xpos'],['edu_y','ypos'],['edu_heading','heading'],['edu_mouse_x','mouseX'],['edu_mouse_y','mouseY'],['edu_edge','edge']]) generator.forBlock[type]=()=>[`${name}()`,generator.ORDER_FUNCTION_CALL];
    generator.forBlock.edu_distance=(block,g)=>[`distance(${value(g,block,'S')})`,generator.ORDER_FUNCTION_CALL];
    for(const type of ['edu_input','edu_number_input','text_prompt_ext','text_prompt']) generator.forBlock[type]=(block,g)=>{
      const numeric=type==='edu_number_input'||block.getFieldValue('TYPE')==='NUMBER';
      const prompt=type==='text_prompt'?JSON.stringify(block.getFieldValue('TEXT')||''):value(g,block,type.startsWith('edu_')?'PROMPT':'TEXT','""');
      return [py?(numeric?`float(input(${prompt}))`:`input(${prompt})`):`${numeric?'readNumber':'readInput'}(${prompt})`,generator.ORDER_FUNCTION_CALL];
    };
    generator.forBlock.edu_received=(block,g)=>{
      const message=JSON.stringify(block.getFieldValue('MESSAGE')),body=g.statementToCode(block,'DO');
      if(py){const name='_receive_'+block.id.replace(/\W/g,'_');g.definitions_['message_'+block.id]=`def ${name}():\n${body||'    pass\n'}\non(${message}, ${name})\n`;}
      else g.definitions_['message_'+block.id]=`on(${message}, function() {\n${body}});\n`;
      return '';
    };
  }
  const entries=(...types)=>types.map(type=>({kind:'block',type}));
  const category=(name,colour,contents)=>({kind:'category',name,colour,contents});
  const toolbox={kind:'categoryToolbox',contents:[
    category('Ulaz / izlaz',170,[{kind:'block',type:'edu_print',inputs:{TEXT:text('Zdravo!')}},{kind:'block',type:'edu_input',inputs:{PROMPT:text('Ime?')}},{kind:'block',type:'edu_number_input',inputs:{PROMPT:text('Broj?')}},...entries('text_print','text_prompt_ext')]),
    category('Matematika',230,entries('math_number','math_arithmetic','math_single','math_trig','math_constant','math_number_property','math_round','math_on_list','math_modulo','math_constrain','math_random_int','math_random_float','math_atan2')),
    category('Logika i uslovi',210,entries('controls_if','logic_compare','logic_operation','logic_negate','logic_boolean','logic_null','logic_ternary')),
    category('Petlje',120,entries('controls_repeat_ext','controls_whileUntil','controls_for','controls_forEach','controls_flow_statements')),
    category('Tekst',160,entries('text','text_join','text_append','text_length','text_isEmpty','text_indexOf','text_charAt','text_getSubstring','text_changeCase','text_trim','text_count','text_replace','text_reverse')),
    category('Liste',260,entries('lists_create_with','lists_repeat','lists_length','lists_isEmpty','lists_indexOf','lists_getIndex','lists_setIndex','lists_getSublist','lists_split','lists_sort','lists_reverse')),
    {kind:'category',name:'Varijable',custom:'VARIABLE',colour:330},
    {kind:'category',name:'Funkcije i postupci',custom:'PROCEDURE',colour:290},
    category('Kretanje',210,[{kind:'block',type:'edu_move',inputs:{N:num(40)}},{kind:'block',type:'edu_turn',inputs:{N:num(90)}},{kind:'block',type:'edu_goto',inputs:{X:num(0),Y:num(0)}}]),
    category('Olovka i oblici',160,[...entries('edu_pen'),{kind:'block',type:'edu_color',inputs:{COLOR:text('#7257c9')}},{kind:'block',type:'edu_width',inputs:{N:num(3)}},{kind:'block',type:'edu_background',inputs:{COLOR:text('#fffef9')}},{kind:'block',type:'edu_circle',inputs:{R:num(40)}},{kind:'block',type:'edu_rectangle',inputs:{W:num(80),H:num(50)}},...entries('edu_clear')]),
    category('Likovi i izgled',280,[{kind:'block',type:'edu_say',inputs:{TEXT:text('Zdravo!')}},...entries('edu_sprite','edu_visible','edu_clone')]),
    category('Događaji i vrijeme',45,[{kind:'block',type:'edu_wait',inputs:{N:num(1)}},{kind:'block',type:'edu_message',inputs:{TEXT:text('start')}},...entries('edu_received')]),
    category('Senzori',190,entries('edu_key','edu_x','edu_y','edu_heading','edu_mouse_x','edu_mouse_y','edu_edge','edu_distance')),
    category('Zvuk',300,[{kind:'block',type:'edu_tone',inputs:{FREQ:num(440),DURATION:num(.2)}}])
  ]};
  const keydown=event=>keys.add(event.key),keyup=event=>keys.delete(event.key);
  const mousemove=event=>{const c=$('stage');if(!c)return;const rect=c.getBoundingClientRect();mouse.x=(event.clientX-rect.left)*480/rect.width-240;mouse.y=180-(event.clientY-rect.top)*360/rect.height;};
  function reset(){sprites=[{x:0,y:0,angle:0,color:'#8870c5',width:2,pen:true,visible:true},{x:-120,y:0,angle:0,color:'#829e3e',width:2,pen:true,visible:true},{x:120,y:0,angle:0,color:'#de8b5d',width:2,pen:true,visible:true}];current=0;trail=[];background='#fffef9';stage();}
  function stage(){
    const context=$('stage')?.getContext('2d');if(!context)return;
    context.fillStyle=background;context.fillRect(0,0,480,360);context.strokeStyle='#e5e8dd';context.lineWidth=1;context.beginPath();
    for(let x=0;x<480;x+=20){context.moveTo(x,0);context.lineTo(x,360);}for(let y=0;y<360;y+=20){context.moveTo(0,y);context.lineTo(480,y);}context.stroke();
    for(const line of trail){context.strokeStyle=line.color;context.lineWidth=line.width||2;context.beginPath();if(line.kind==='circle'){context.arc(240+line.x,180-line.y,line.r,0,2*Math.PI);}else if(line.kind==='rectangle'){context.save();context.translate(240+line.x,180-line.y);context.rotate(line.angle*Math.PI/180);context.rect(0,0,line.w,line.h);context.stroke();context.restore();continue;}else{context.moveTo(240+line.x1,180-line.y1);context.lineTo(240+line.x2,180-line.y2);}context.stroke();}
    sprites.forEach((s,index)=>{if(!s.visible)return;context.save();context.translate(240+s.x,180-s.y);context.rotate(s.angle*Math.PI/180);context.fillStyle=s.color;context.beginPath();context.moveTo(12,0);context.lineTo(-8,-8);context.lineTo(-8,8);context.closePath();context.fill();context.restore();context.fillStyle=s.color;context.font='12px system-ui';context.fillText(String(index+1),250+s.x,170-s.y);});
  }
  function watch(action){
    if(action.type==='trace'&&workspace?.highlightBlock)workspace.highlightBlock(action.id);
    if($('blocktrace'))$('blocktrace').textContent=Object.entries(action.variables||{}).map(([name,value])=>`${name} = ${typeof value==='string'?value:JSON.stringify(value)}`).join('\n')||'Nema varijabli u ovom koraku.';
  }
  function playTone(action){try{if(!audio)return;const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.frequency.value=action.frequency;gain.gain.value=.08;oscillator.connect(gain);gain.connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+action.duration);}catch{}}
  function apply(action){
    watch(action);let s=sprites[current];
    if(action.type==='sprite'){current=Math.max(0,Math.min(sprites.length-1,Math.trunc(action.value)));stage();return;}
    if(action.type==='move'||action.type==='go'){const old={x:s.x,y:s.y};if(action.type==='move'){s.x+=Math.cos(s.angle*Math.PI/180)*action.value;s.y-=Math.sin(s.angle*Math.PI/180)*action.value;}else{s.x=action.x;s.y=action.y;}if(s.pen)trail.push({kind:'line',x1:old.x,y1:old.y,x2:s.x,y2:s.y,color:s.color,width:s.width});}
    if(action.type==='turn')s.angle+=action.value;if(action.type==='pen')s.pen=action.value;if(action.type==='color')s.color=action.value;if(action.type==='width')s.width=action.value;if(action.type==='visible')s.visible=action.value;
    if(action.type==='background')background=action.value;if(action.type==='clear')trail=[];
    if(action.type==='circle')trail.push({kind:'circle',x:s.x,y:s.y,r:action.value,color:s.color,width:s.width});
    if(action.type==='rectangle')trail.push({kind:'rectangle',x:s.x,y:s.y,w:action.width,h:action.height,angle:s.angle,color:s.color,width:s.width});
    if(action.type==='clone')sprites.push({...s,x:s.x+10,y:s.y+10});
    if((action.type==='say'||action.type==='print')&&$('blockout'))$('blockout').textContent+=action.value+'\n';
    if(action.type==='tone')playTone(action);stage();
  }
  function animate(){animTimer=null;if(paused)return;if(!actionQueue.length){finishAnimation();return;}const action=actionQueue.shift();apply(action);animTimer=setTimeout(animate,action.type==='wait'?action.value*1000:speed);}
  function finishAnimation(){if(!finalResult||actionQueue.length)return;workspace?.highlightBlock?.(null);const result=finalResult;finalResult=null;if($('blocktrace'))$('blocktrace').textContent=Object.entries(result.variables||{}).map(([name,value])=>`${name} = ${JSON.stringify(value)}`).join('\n')||'Program završen. Nema varijabli.';onRun(result);if(runResolve){runResolve(result);runResolve=null;}}
  function matchCheck(check,result){
    if(!check)return {passed:false,correct:false,message:'Za ovaj projekat nije postavljena automatska provjera.'};
    if(!result.ok)return {passed:false,correct:false,message:'Program mora završiti bez greške.'};
    const tolerance=check.tolerance??.001,near=(a,b)=>Number.isFinite(Number(a))&&Math.abs(Number(a)-Number(b))<=tolerance;
    let passed=false;
    if(check.type==='output'){const normalize=value=>check.trim===false?String(value):String(value).replace(/\r\n/g,'\n').trim();passed=normalize(result.output)===normalize(check.expected);}
    if(check.type==='actions')passed=Object.entries(check.counts||{}).every(([type,count])=>result.actions.filter(action=>action.type===type).length===count);
    if(check.type==='stage'){
      const state=result.stage||{};passed=true;
      for(const key of ['x','y','trailCount'])if(check[key]!==undefined)passed=passed&&near(state[key],check[key]);
      if(check.heading!==undefined){const difference=((Number(state.heading)-Number(check.heading))%360+360)%360;passed=passed&&(difference<=tolerance||360-difference<=tolerance);}
      if(check.closed){const lines=(state.trail||[]).filter(line=>line.kind==='line');passed=passed&&lines.length>0&&near(lines[0].x1,lines.at(-1).x2)&&near(lines[0].y1,lines.at(-1).y2);}
      for(const key of ['width','height'])if(check[key]!==undefined){const coords=(state.trail||[]).flatMap(line=>line.kind==='line'?[key==='width'?line.x1:line.y1,key==='width'?line.x2:line.y2]:[]);passed=passed&&coords.length>0&&near(Math.max(...coords)-Math.min(...coords),check[key]);}
      const lines=(state.trail||[]).filter(line=>line.kind==='line');
      if(check.segmentLengths)passed=passed&&lines.length===check.segmentLengths.length&&lines.every((line,index)=>near(Math.hypot(line.x2-line.x1,line.y2-line.y1),check.segmentLengths[index]));
      if(check.segmentAngles)passed=passed&&lines.length===check.segmentAngles.length&&lines.every((line,index)=>{const actual=Math.atan2(line.y2-line.y1,line.x2-line.x1)*180/Math.PI,difference=((actual-check.segmentAngles[index])%360+360)%360;return difference<=tolerance||360-difference<=tolerance;});
    }
    if(check.inputCount!==undefined)passed=passed&&result.inputUsed===check.inputCount;
    if(check.extraStage)passed=passed&&matchCheck(check.extraStage,result).correct;
    if(Array.isArray(check.all))passed=(check.type?passed:true)&&check.all.every(part=>matchCheck(part,result).correct);
    return {passed,correct:passed,message:passed?'TAČNO — rezultat odgovara zadatku.':'Rezultat još ne odgovara zadatku. Provjeri ulaz, blokove i očekivani izlaz.'};
  }
  function code(language='js',trace=false){
    if(!workspace)return '';
    const generator=language==='py'?PY:JS,old=generator.STATEMENT_PREFIX;
    generator.STATEMENT_PREFIX=trace&&language!=='py'?'traceBlock(%1);\n':null;
    let raw;try{raw=generator.workspaceToCode(workspace);}finally{generator.STATEMENT_PREFIX=old;}
    if(language!=='py')return raw;
    const types=new Set(workspace.getAllBlocks(false).map(block=>block.type));
    const graphics=['edu_move','edu_turn','edu_goto','edu_pen','edu_sprite','edu_visible','edu_clone','edu_clear','edu_color','edu_width','edu_background','edu_circle','edu_rectangle','edu_x','edu_y','edu_heading','edu_mouse_x','edu_mouse_y','edu_edge','edu_distance'].some(type=>types.has(type));
    let header='# Python program — konzola radi u ugrađenom ELDI Python editoru.\nimport time\ndef wait(seconds): time.sleep(max(0, min(3, seconds)))\n';
    if(types.has('edu_message')||types.has('edu_received'))header+='\n_messages = {}\ndef on(name, fn): _messages.setdefault(name, []).append(fn)\ndef broadcast(name):\n    for fn in _messages.get(name, []): fn()\n';
    if(types.has('edu_tone'))header+='\ndef tone(frequency, duration):\n    try:\n        import winsound\n        winsound.Beep(int(frequency), int(max(0.01, duration)*1000))\n    except ImportError:\n        time.sleep(max(0, duration))\n';
    if(types.has('edu_key'))header+='\ndef key(name): return False  # Senzor tipke je dostupan u ELDI pozornici.\n';
    if(graphics)header='# GRAFIČKI PYTHON: pokrenuti izvan ELDI konzole u punom Pythonu s Tkinterom.\n'+header+'\nimport turtle\nscreen = turtle.Screen()\n_turtles = [turtle.Turtle() for _ in range(3)]\n_turtles[1].penup(); _turtles[1].goto(-120, 0); _turtles[1].pendown()\n_turtles[2].penup(); _turtles[2].goto(120, 0); _turtles[2].pendown()\nt = _turtles[0]\ndef move(n): t.forward(n)\ndef turn(n): t.right(n)\ndef go(x, y): t.goto(x, y)\ndef pen(down): t.pendown() if down else t.penup()\ndef pencolor(c): t.pencolor(c)\ndef penwidth(n): t.width(n)\ndef background(c): screen.bgcolor(c)\ndef visible(show): t.showturtle() if show else t.hideturtle()\ndef circle(r):\n    pos=t.position(); angle=t.heading(); t.penup(); t.goto(pos[0],pos[1]-r); t.pendown(); t.circle(r); t.penup(); t.goto(pos); t.setheading(angle); t.pendown()\ndef rectangle(w,h):\n    pos=t.position(); angle=t.heading()\n    for length in [w,h,w,h]: t.forward(length); t.right(90)\n    t.goto(pos); t.setheading(angle)\ndef sprite(n):\n    global t\n    t=_turtles[max(0,min(len(_turtles)-1,int(n)))]\ndef clone():\n    new=turtle.Turtle(); new.penup(); new.goto(t.xcor()+10,t.ycor()+10); new.setheading(t.heading()); new.pendown(); _turtles.append(new)\ndef clear():\n    for item in _turtles: item.clear()\ndef xpos(): return t.xcor()\ndef ypos(): return t.ycor()\ndef heading(): return (-t.heading())%360\ndef mouseX(): return 0\ndef mouseY(): return 0\ndef edge(): return abs(t.xcor())>=228 or abs(t.ycor())>=168\ndef distance(n): return t.distance(_turtles[max(0,min(len(_turtles)-1,int(n)))])\n';
    return header+'\n'+raw+(graphics?'\nturtle.done()\n':'');
  }
  function update(){if(!workspace)return;try{if($('blockcode'))$('blockcode').textContent=code($('blocklang')?.value||'js');onSave(serialize());}catch(error){if($('blockcode'))$('blockcode').textContent=error.message;}}
  function serialize(){return {format:'ELDI-BLOCKS-1',workspace:Blockly.serialization.workspaces.save(workspace)};}
  function load(project){if(project?.format!=='ELDI-BLOCKS-1'||!project.workspace)throw Error('Nepoznat format blokovskog projekta.');stop();Blockly.serialization.workspaces.load(project.workspace,workspace);update();}
  function stop(){worker?.terminate();worker=null;clearTimeout(runningTimer);clearTimeout(animTimer);animTimer=null;actionQueue=[];finalResult=null;paused=false;workspace?.highlightBlock?.(null);if(runResolve){runResolve({ok:false,cancelled:true,output:$('blockout')?.textContent||'',actions:allActions});runResolve=null;}}
  function run(options={}){
    const runChallenge=challenge;
    stop();reset();allActions=[];if($('blockout'))$('blockout').textContent='';if($('blockcheck'))$('blockcheck').textContent='';speed=Number.isFinite(Number(options.speed))?Math.max(0,Math.min(200,Number(options.speed))):25;paused=options.paused===true;
    if(window.AudioContext||window.webkitAudioContext)try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();}catch{}
    return new Promise(resolve=>{
      runResolve=resolve;
      function complete(result){clearTimeout(runningTimer);worker?.terminate();worker=null;result.actions=allActions;if(runChallenge)result.challenge={id:runChallenge.id,...matchCheck(runChallenge.check,result)};if($('blockcheck'))$('blockcheck').textContent=result.challenge?.message||'';finalResult=result;if(options.checkOnly){actionQueue=[];if($('blockout'))$('blockout').textContent=result.output||result.error||'';finishAnimation();}else if(!paused&&!animTimer)animate();}
      try{
        worker=new Worker('block-worker.js');worker.onmessage=event=>{const data=event.data;if(data.type==='actions'){allActions.push(...data.actions);actionQueue.push(...data.actions);if(!paused&&!animTimer)animate();}if(data.type==='done')complete(data.result||{ok:true,output:'',stage:{},variables:{}});if(data.type==='error'){if($('blockout'))$('blockout').textContent+='Greška: '+data.message+'\n';complete({...data.result,ok:false,error:data.message});}};
        worker.onerror=event=>{if($('blockout'))$('blockout').textContent+='Greška: '+event.message;complete({ok:false,error:event.message,output:'',variables:{}});};
        worker.postMessage({code:code('js',true),input:options.input??$('blockinput')?.value??'',keys:[...keys],sprite:Number($('sprite')?.value||0),mouse:{...mouse}});
        runningTimer=setTimeout(()=>{if($('blockout'))$('blockout').textContent+='Prekoračeno 6 sekundi računanja.';complete({ok:false,error:'Prekoračeno vrijeme izvršavanja.',output:'',variables:{}});},6000);
      }catch(error){complete({ok:false,error:error.message,output:'',variables:{}});}
    });
  }
  function pause(){paused=true;clearTimeout(animTimer);animTimer=null;return paused;}
  function resume(){paused=false;if(!animTimer)animate();return paused;}
  function step(){pause();if(!worker&&!finalResult&&!actionQueue.length){run({paused:true});return;}if(actionQueue.length)apply(actionQueue.shift());if(!actionQueue.length)finishAnimation();}
  function example(type){
    const square={blocks:{languageVersion:0,blocks:[{type:'controls_repeat_ext',inputs:{TIMES:num(4),DO:{block:{type:'edu_move',inputs:{N:num(80)},next:{block:{type:'edu_turn',inputs:{N:num(90)}}}}}}}]}};
    const count={blocks:{languageVersion:0,blocks:[{type:'edu_say',inputs:{TEXT:text('Brojimo tri puta')},next:{block:{type:'controls_repeat_ext',inputs:{TIMES:num(3),DO:{block:{type:'edu_say',inputs:{TEXT:text('Učim!')}}}}}}}]}};
    load({format:'ELDI-BLOCKS-1',workspace:type==='square'?square:count});
  }
  return {
    init(options={}){onSave=options.onSave||(()=>{});onRun=options.onRun||(()=>{});document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);$('stage')?.addEventListener?.('mousemove',mousemove);workspace=Blockly.inject('blocklyDiv',{toolbox,media:'vendor/media/',trashcan:true,scrollbars:true,zoom:{controls:true,wheel:true,startScale:.8},grid:{spacing:20,length:2,colour:'#d9e3cf',snap:true}});workspace.addChangeListener(update);reset();if(options.initial)try{load(options.initial);}catch(error){workspace.clear();if($('blockout'))$('blockout').textContent='Prethodni projekat nije učitan: '+error.message;}update();},
    destroy(){stop();document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);$('stage')?.removeEventListener?.('mousemove',mousemove);keys.clear();workspace?.dispose();workspace=null;audio?.close?.();audio=null;challenge=null;},
    run,stop,pause,resume,step,load,serialize,update,code,example,matchCheck,
    setChallenge(value){challenge=value||null;if($('blockcheck'))$('blockcheck').textContent='';},
    clear(){stop();workspace.clear();update();},select(index){current=Math.max(0,Math.min(sprites.length-1,Math.trunc(Number(index)||0)));stage();},
    getToolbox(){return toolbox;},getState(){return {paused,running:!!worker||!!finalResult||actionQueue.length>0,queue:actionQueue.length};}
  };
})();
