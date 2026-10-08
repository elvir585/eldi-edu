'use strict';
/* Original ELDI EDU learning projects, serialized using Scratch 3's documented project format. */
(function (factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof window === 'object') window.ELDIScratchProjects = api;
})(function () {
  const MAX_PROJECT_BYTES = 12 * 1024 * 1024;
  const examples = [
    {id:'strelice',grade:5,title:'Igra: upravljaj likom',category:'Događaji i kretanje',goal:'Pomjeri lik strelicama na tastaturi.',steps:['Pokreni zelenu zastavicu i pročitaj uputu.','Klikni pozornicu i koristi četiri strelice.','Pronađi četiri događaja za pritisak tipke i promijeni brzinu sa 10 na 20.','Dodaj kostim i događaj za razmaknicu.']},
    {id:'zvijezda',grade:6,title:'Geometrija: nacrtaj zvijezdu',category:'Petlje i olovka',goal:'Petlja crta petokraku zvijezdu pomoću ugla 144°.',steps:['Pokreni program i prati crtanje.','Otvori kategoriju Olovka i pronađi spuštanje/podizanje olovke.','Promijeni dužinu stranice i boju olovke.','Objasni zašto pet ponavljanja i skretanje 144° daju zvijezdu.']},
    {id:'kviz',grade:7,title:'Kviz: sabiranje i odgovor',category:'Unos i grananje',goal:'Postavi pitanje i provjeri odgovor pomoću uslova.',steps:['Pokreni zastavicu i odgovori na 27 + 15.','Pronađi blok Odgovor u kategoriji Osjećaji.','Pronađi uslov ako–inače i obje povratne poruke.','Promijeni pitanje i njegov očekivani odgovor.']},
    {id:'ples',grade:6,title:'Animacija: kostimi i zvuk',category:'Animacija i zvuk',goal:'Kombinuj pomjeranje, promjenu kostima i zvuk u petlji.',steps:['Pokreni zastavicu; ako je zvuk utišan, uključi zvuk na računaru.','Otvori karticu Kostimi i uredi drugi kostim.','Otvori karticu Zvukovi i preslušaj/uredi postojeći zvuk.','Promijeni broj ponavljanja i vrijeme između pokreta.']},
    {id:'klikovi',grade:8,title:'Igra: brojač klikova',category:'Promjenljive i događaji',goal:'Klik na lik povećava rezultat i premješta ga na slučajno mjesto.',steps:['Zelena zastavica postavlja rezultat na nulu.','Klikni lik više puta i posmatraj promjenljivu Bodovi.','Uredi događaj klik na ovaj lik i povećanje bodova.','Dodaj uslov koji čestita nakon deset bodova.']},
    {id:'prica',grade:9,title:'Priča: razgovor dva lika',category:'Poruke i saradnja',goal:'Dva lika razmjenjuju poruke i izmjenjuju replike.',steps:['Pokreni zastavicu i prati redoslijed replika.','Klikni drugi lik i pronađi događaj primanja poruke.','Promijeni tekst replika i njihove kostime.','Dodaj treću poruku koja mijenja pozadinu.']}
  ];
  const clone = value => JSON.parse(JSON.stringify(value));
  function defaultProject() {
    const costume = (id,name,cx,cy) => ({assetId:id,name,bitmapResolution:1,md5ext:id+'.svg',dataFormat:'svg',rotationCenterX:cx,rotationCenterY:cy});
    const stage = {isStage:true,name:'Stage',variables:{},lists:{},broadcasts:{},blocks:{},comments:{},currentCostume:0,costumes:[costume('cd21514d0531fdffb22204e0ec5ed84a','Pozadina',240,180)],sounds:[],volume:100,layerOrder:0,tempo:60,videoTransparency:50,videoState:'off',textToSpeechLanguage:null};
    const sprite = {isStage:false,name:'Lik',variables:{},lists:{},broadcasts:{},blocks:{},comments:{},currentCostume:0,costumes:[costume('bcf454acf82e4504149f7ffe07081dbc','Kostim 1',48,50),costume('0fb9be3e8397c983338cb71dc84d0b25','Kostim 2',46,53)],sounds:[{assetId:'83c36d806dc92327b9e7049a565c6bff',name:'Mjau',dataFormat:'wav',format:'',rate:22050,sampleCount:18688,md5ext:'83c36d806dc92327b9e7049a565c6bff.wav'}],volume:100,layerOrder:1,visible:true,x:0,y:0,size:65,direction:90,draggable:false,rotationStyle:'all around'};
    return {targets:[stage,sprite],monitors:[],extensions:[],meta:{semver:'3.0.0',vm:'15.2.0',agent:'ELDI EDU original learning project'}};
  }
  function buildProject(id) {
    if (!examples.some(item=>item.id===id)) throw new Error('Nepoznat Scratch primjer.');
    const project = defaultProject(), stage=project.targets[0], sprite=project.targets[1];
    let nextId=0;
    const block=(opcode,inputs={},fields={},extra={})=>{const key='eldi_'+(++nextId);sprite.blocks[key]={opcode,next:null,parent:null,inputs,fields,shadow:false,topLevel:false,...extra};return key;};
    const number=value=>[1,[4,String(value)]];
    const text=value=>[1,[10,String(value)]];
    const chain=(...ids)=>{for(let i=1;i<ids.length;i++){sprite.blocks[ids[i-1]].next=ids[i];sprite.blocks[ids[i]].parent=ids[i-1];}return ids[0];};
    const hat=(opcode='event_whenflagclicked',fields={},x=20,y=20)=>block(opcode,{},fields,{topLevel:true,x,y});
    const say=(message,seconds=2)=>block('looks_sayforsecs',{MESSAGE:text(message),SECS:number(seconds)});
    const sub=(owner,input,...ids)=>{chain(...ids);sprite.blocks[owner].inputs[input]=[2,ids[0]];sprite.blocks[ids[0]].parent=owner;};
    if(id==='strelice') {
      chain(hat(),say('Koristi strelice na tastaturi!',2));
      [['right arrow','motion_changexby',10],['left arrow','motion_changexby',-10],['up arrow','motion_changeyby',10],['down arrow','motion_changeyby',-10]].forEach(([key,opcode,value],i)=>chain(hat('event_whenkeypressed',{KEY_OPTION:[key,null]},20+(i%2)*260,190+Math.floor(i/2)*140),block(opcode,{[opcode==='motion_changexby'?'DX':'DY']:number(value)})));
    } else if(id==='zvijezda') {
      project.extensions=['pen'];sprite.visible=false;
      const loop=block('control_repeat',{TIMES:number(5)});
      sub(loop,'SUBSTACK',block('motion_movesteps',{STEPS:number(120)}),block('motion_turnright',{DEGREES:number(144)}));
      chain(hat(),block('pen_clear'),block('motion_gotoxy',{X:number(-60),Y:number(40)}),block('motion_pointindirection',{DIRECTION:number(90)}),block('pen_setPenSizeTo',{SIZE:number(3)}),block('pen_penDown'),loop,block('pen_penUp'));
    } else if(id==='kviz') {
      const ask=block('sensing_askandwait',{QUESTION:text('Koliko je 27 + 15?')}),answer=block('sensing_answer'),equal=block('operator_equals',{OPERAND1:[3,answer,[10,'']],OPERAND2:text('42')}),condition=block('control_if_else',{CONDITION:[2,equal]});
      sprite.blocks[answer].parent=equal;sprite.blocks[equal].parent=condition;
      sub(condition,'SUBSTACK',say('Tačno! 27 + 15 = 42.',3));sub(condition,'SUBSTACK2',say('Pokušaj ponovo: 27 + 10 = 37, zatim dodaj 5.',4));
      chain(hat(),ask,condition);
    } else if(id==='ples') {
      const loop=block('control_repeat',{TIMES:number(8)}),soundMenu=block('sound_sounds_menu',{}, {SOUND_MENU:['Mjau',null]},{shadow:true}),play=block('sound_play',{SOUND_MENU:[1,soundMenu]});sprite.blocks[soundMenu].parent=play;
      sub(loop,'SUBSTACK',block('motion_movesteps',{STEPS:number(20)}),block('motion_turnright',{DEGREES:number(45)}),block('looks_nextcostume'),play,block('control_wait',{DURATION:number(0.3)}));chain(hat(),loop,say('Bravo! Uredi moje kostime i zvuk.',3));
    } else if(id==='klikovi') {
      stage.variables.bodovi=['Bodovi',0];project.monitors=[{id:'bodovi',mode:'default',opcode:'data_variable',params:{VARIABLE:'Bodovi'},spriteName:null,value:0,width:0,height:0,x:10,y:10,visible:true,sliderMin:0,sliderMax:100,isDiscrete:true}];
      chain(hat(),block('data_setvariableto',{VALUE:text('0')},{VARIABLE:['Bodovi','bodovi']}),say('Klikni me i skupljaj bodove!',2));
      const menu=block('motion_goto_menu',{}, {TO:['_random_',null]},{shadow:true}),go=block('motion_goto',{TO:[1,menu]});sprite.blocks[menu].parent=go;
      chain(hat('event_whenthisspriteclicked',{},320,20),block('data_changevariableby',{VALUE:number(1)},{VARIABLE:['Bodovi','bodovi']}),go);
    } else {
      stage.broadcasts.poruka='Odgovori';sprite.x=-130;
      const menu=block('event_broadcast_menu',{}, {BROADCAST_OPTION:['Odgovori','poruka']},{shadow:true}),send=block('event_broadcastandwait',{BROADCAST_INPUT:[1,menu]});sprite.blocks[menu].parent=send;
      chain(hat(),say('Zdravo! Voliš li programiranje?',2),send,say('Hajde da napravimo vlastitu igru!',2));
      const second=clone(sprite);second.name='Drugi lik';second.x=130;second.direction=-90;second.rotationStyle='left-right';second.layerOrder=2;second.blocks={reply:{opcode:'event_whenbroadcastreceived',next:'words',parent:null,inputs:{},fields:{BROADCAST_OPTION:['Odgovori','poruka']},shadow:false,topLevel:true,x:30,y:30},words:{opcode:'looks_sayforsecs',next:null,parent:'reply',inputs:{MESSAGE:text('Da! Blokovi su odličan početak.'),SECS:number(2)},fields:{},shadow:false,topLevel:false}};project.targets.push(second);
    }
    return project;
  }
  function assetsForProject(project) {
    return [...new Set(project.targets.flatMap(target=>[...target.costumes,...target.sounds].map(asset=>asset.md5ext)))];
  }
  const MAX_EXPANDED_BYTES=100*1024*1024,MAX_PROJECT_JSON_BYTES=5*1024*1024,MAX_ARCHIVE_ENTRIES=2500;
  function archiveBytes(input) {
    if(typeof input==='string'){
      if(input.length>Math.ceil(MAX_PROJECT_BYTES*4/3)+4||!input.startsWith('UEsD')||input.length%4!==0||!/^[A-Za-z0-9+/]*={0,2}$/.test(input))throw new Error('Neispravan ili prevelik Scratch .sb3 zapis.');
      if(typeof Buffer==='function')return new Uint8Array(Buffer.from(input,'base64'));
      return Uint8Array.from(atob(input),char=>char.charCodeAt(0));
    }
    if(input instanceof ArrayBuffer)return new Uint8Array(input);
    if(ArrayBuffer.isView(input))return new Uint8Array(input.buffer,input.byteOffset,input.byteLength);
    throw new Error('Scratch projekat mora biti .sb3 ZIP datoteka.');
  }
  function validateArchive(input) {
    const bytes=archiveBytes(input);if(bytes.length>MAX_PROJECT_BYTES||bytes.length<22)throw new Error('Scratch .sb3 smije imati do 12 MB i mora biti ispravan ZIP.');
    const data=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),u16=offset=>data.getUint16(offset,true),u32=offset=>data.getUint32(offset,true);
    const fail=message=>{throw new Error('Neispravan Scratch .sb3: '+message);};
    let end=-1;for(let i=bytes.length-22;i>=Math.max(0,bytes.length-22-65535);i--)if(u32(i)===0x06054b50&&i+22+u16(i+20)===bytes.length){end=i;break;}
    if(end<0)fail('nedostaje ZIP direktorij.');
    const count=u16(end+10),centralSize=u32(end+12),centralOffset=u32(end+16);
    if(u16(end+4)||u16(end+6)||u16(end+8)!==count)fail('arhiva na više diskova nije dozvoljena.');
    if(!count||count>MAX_ARCHIVE_ENTRIES||count===0xffff||centralSize===0xffffffff||centralOffset===0xffffffff)fail('previše datoteka ili ZIP64 format.');
    if(centralOffset+centralSize!==end||centralSize<count*46||centralOffset<30)fail('neispravne granice direktorija.');
    const decode=new TextDecoder('utf-8',{fatal:true}),names=new Set(),ranges=[];let cursor=centralOffset,total=0,hasProject=false,projectBytes=0;
    const extraFields=(offset,length)=>{const stop=offset+length;while(offset<stop){if(offset+4>stop)fail('neispravno dodatno zaglavlje.');const id=u16(offset),size=u16(offset+2);offset+=4;if(offset+size>stop||id===1)fail('ZIP64 ili neispravno dodatno zaglavlje.');offset+=size;}};
    const nameAt=(offset,length)=>{let name;try{name=decode.decode(bytes.subarray(offset,offset+length));}catch{fail('neispravno ime datoteke.');}if(!/^(project\.json|[a-f0-9]{32}\.(svg|png|jpg|jpeg|wav|mp3))$/.test(name))fail('dozvoljeni su samo project.json i materijali u korijenu arhive.');return name;};
    for(let index=0;index<count;index++){
      if(cursor+46>end||u32(cursor)!==0x02014b50)fail('neispravna stavka direktorija.');
      const flags=u16(cursor+8),method=u16(cursor+10),crc=u32(cursor+16),compressed=u32(cursor+20),expanded=u32(cursor+24),nameLength=u16(cursor+28),extraLength=u16(cursor+30),commentLength=u16(cursor+32),attributes=u32(cursor+38),local=u32(cursor+42),next=cursor+46+nameLength+extraLength+commentLength;
      if(next>end||!nameLength||u16(cursor+34)||compressed===0xffffffff||expanded===0xffffffff||local===0xffffffff)fail('neispravne veličine ili ZIP64.');
      if(flags&~(0x0800|0x0008|0x0006)||(method!==0&&method!==8))fail('šifriran ili nepodržan ZIP.');
      if((attributes&0x10)||((attributes>>>16)&0xf000)===0xa000)fail('direktoriji i simboličke veze nisu dozvoljeni.');
      if(method===0&&compressed!==expanded)fail('neispravna veličina nezapakovane datoteke.');
      const name=nameAt(cursor+46,nameLength);if(names.has(name))fail('ponovljeno ime datoteke.');names.add(name);extraFields(cursor+46+nameLength,extraLength);
      total+=expanded;if(total>MAX_EXPANDED_BYTES)fail('raspakovani projekat prelazi 100 MB.');
      if(name==='project.json'){hasProject=true;projectBytes=expanded;if(!expanded||expanded>MAX_PROJECT_JSON_BYTES)fail('project.json smije imati do 5 MB.');}
      if(local+30>centralOffset||u32(local)!==0x04034b50||u16(local+6)!==flags||u16(local+8)!==method)fail('neusaglašeno lokalno zaglavlje.');
      const localNameLength=u16(local+26),localExtraLength=u16(local+28),start=local+30+localNameLength+localExtraLength,stop=start+compressed;
      if(start>centralOffset||stop>centralOffset||nameAt(local+30,localNameLength)!==name)fail('neispravne granice ili ime datoteke.');extraFields(local+30+localNameLength,localExtraLength);
      let rangeEnd=stop;
      if(flags&8){const signed=stop+4<=centralOffset&&u32(stop)===0x08074b50,descriptor=stop+(signed?4:0);if(descriptor+12>centralOffset||u32(descriptor)!==crc||u32(descriptor+4)!==compressed||u32(descriptor+8)!==expanded)fail('neispravan opis podataka.');rangeEnd=descriptor+12;}
      else if(u32(local+14)!==crc||u32(local+18)!==compressed||u32(local+22)!==expanded)fail('neusaglašene veličine datoteke.');
      ranges.push([local,rangeEnd]);cursor=next;
    }
    if(cursor!==end||!hasProject)fail('nedostaje project.json ili direktorij nije potpun.');
    ranges.sort((a,b)=>a[0]-b[0]);for(let index=1;index<ranges.length;index++)if(ranges[index][0]<ranges[index-1][1])fail('preklapanje datoteka.');
    return {files:count,expandedBytes:total,compressedBytes:bytes.length,projectBytes,bytes};
  }
  function validDraft(value) {
    if (!value || typeof value !== 'object' || typeof value.base64 !== 'string') return null;
    try{validateArchive(value.base64);}catch{return null;}
    return {name:String(value.name||'Moj Scratch projekat').slice(0,120),base64:value.base64,savedAt:typeof value.savedAt==='string'?value.savedAt.slice(0,40):'',exampleId:examples.some(item=>item.id===value.exampleId)?value.exampleId:null};
  }
  function normalizeState(value){if(value===undefined||value===null)return null;const draft=validDraft(value);if(!draft)throw new Error('Profil sadrži neispravan ili prevelik Scratch .sb3 rad.');return draft;}
  return {examples,buildProject,assetsForProject,defaultProject,validDraft,normalizeState,validateArchive,MAX_PROJECT_BYTES,MAX_EXPANDED_BYTES,MAX_PROJECT_JSON_BYTES,MAX_ARCHIVE_ENTRIES};
});
