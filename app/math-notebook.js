/* Digital math notebook: exact supported transformations, no eval, no network.
 * UMD: EduMathNotebook. A correct final answer alone earns answer credit; process
 * credit requires different valid intermediate steps before the final answer.
 * Free prose, handwritten proofs and arbitrary nonlinear equations are not graded.
 */
(function(root,factory){
  'use strict';
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./math-engine.js'):root.EduMath);
  if(node)module.exports=api;if(root)root.EduMathNotebook=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(M){
  'use strict';
  if(!M)throw new Error('Učitajte EduMath prije matematičke sveske.');
  const R=M.rational,Z=()=>R(0),O=()=>R(1);
  const TYPES=Object.freeze([
    {id:'arithmetic',title:'Računski izrazi',grades:[5,6,7,8,9],description:'Redoslijed operacija i međurezultati.'},
    {id:'fractions',title:'Operacije s razlomcima',grades:[6,7,8,9],description:'Zajednički nazivnik, množenje i dijeljenje.'},
    {id:'complexFractions',title:'Dvojni razlomci',grades:[7,8,9],description:'Posebno izračunaj brojnik i nazivnik.'},
    {id:'gcd',title:'NZD po Euklidovom algoritmu',grades:[6,7,8,9],description:'Dijeljenje s ostatkom do ostatka nula.'},
    {id:'lcm',title:'NZS pomoću NZD-a',grades:[6,7,8,9],description:'Nađi NZD pa primijeni NZS(a,b)=a·b/NZD(a,b).'},
    {id:'divisibility',title:'Djeljivost i ostatak',grades:[6,7,8,9],description:'Djelioci 2, 4, 5, 6, 9, 10, 15 i 25.'},
    {id:'linear',title:'Linearne jednačine',grades:[5,6,7,8,9],description:'Ekvivalentni koraci sa jednom nepoznatom x.'},
    {id:'percent',title:'Procentni račun',grades:[7,8,9],description:'Postavi izraz pa izračunaj procenat veličine.'}
  ].map(t=>Object.freeze({...t,grades:Object.freeze(t.grades)})));
  const clean=s=>String(s).replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/[÷:]/g,'/').trim();
  const fingerprint=s=>clean(s).replace(/\s+/g,'').toLowerCase();
  const literal=s=>/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:\s*\/\s*[+-]?\d+)?$/.test(clean(s));
  const affine=(a,b)=>({a:R(a),b:R(b)});

  function parseLinear(source){
    if(typeof source!=='string'||!source.trim())throw new Error('Unesite izraz sa brojevima i nepoznatom x.');
    source=clean(source);
    if(source.length>512)throw new Error('Jedan izraz može imati najviše 512 znakova.');
    let pos=0,token,depth=0,count=0;
    const limited=v=>{for(const n of [v.a,v.b])if(n.n.toString().length>1500||n.d.toString().length>1500)throw new Error('Izraz daje prevelik rezultat.');return v;};
    function next(){
      if(++count>300)throw new Error('Izraz ima previše dijelova.');
      while(pos<source.length&&/\s/.test(source[pos]))pos++;
      if(pos===source.length){token={type:'end'};return;}
      const number=/^(?:\d+(?:[.,]\d*)?|[.,]\d+)/.exec(source.slice(pos));
      if(number){if(number[0].length>80)throw new Error('Broj je predug.');pos+=number[0].length;token={type:'number',text:number[0]};return;}
      const ch=source[pos++];
      if(!'+-*/^()xX'.includes(ch))throw new Error('Podržani su brojevi, zagrade, operacije i nepoznata x.');
      token={type:ch.toLowerCase()};
    }
    function descend(fn){if(++depth>48)throw new Error('Previše ugniježđenih operacija.');try{return fn();}finally{depth--;}}
    function primary(){
      if(token.type==='number'){const v=affine(0,token.text);next();return v;}
      if(token.type==='x'){next();return affine(1,0);}
      if(token.type==='('){next();const v=descend(sum);if(token.type!==')')throw new Error('Nedostaje zatvorena zagrada.');next();return v;}
      throw new Error('Očekuje se broj, x ili otvorena zagrada.');
    }
    function power(){
      let v=primary();
      if(token.type==='^'){
        next();const exponent=descend(unary);
        if(exponent.a.n!==0n||exponent.b.d!==1n)throw new Error('Eksponent mora biti cijeli broj.');
        if(v.a.n!==0n){if(exponent.b.n!==1n)throw new Error('Sveska provjerava linearne jednačine; stepen nepoznate mora biti 1.');}
        else {if(exponent.b.n>12n||exponent.b.n< -12n)throw new Error('U ovom alatu eksponent mora biti od -12 do 12.');v=affine(0,v.b.pow(exponent.b));}
      }
      return limited(v);
    }
    function unary(){if(token.type==='+'||token.type==='-'){const sign=token.type;next();const v=descend(unary);return sign==='-'?affine(v.a.neg(),v.b.neg()):v;}return power();}
    function multiply(v,w){
      if(v.a.n!==0n&&w.a.n!==0n)throw new Error('Proizvod dvije nepoznate nije linearni izraz.');
      return limited(affine(v.a.mul(w.b).add(w.a.mul(v.b)),v.b.mul(w.b)));
    }
    function product(){
      let v=unary();
      while(token.type==='*'||token.type==='/'||token.type==='x'||token.type==='('){
        const op=token.type;if(op==='*'||op==='/')next();
        const w=unary();
        if(op==='/'){
          if(w.a.n!==0n)throw new Error('Dijeljenje izrazom koji sadrži x nije podržano zbog uslova nazivnika.');
          v=limited(affine(v.a.div(w.b),v.b.div(w.b)));
        }else v=multiply(v,w);
      }
      return v;
    }
    function sum(){let v=product();while(token.type==='+'||token.type==='-'){const op=token.type;next();const w=product();v=limited(affine(op==='+'?v.a.add(w.a):v.a.sub(w.a),op==='+'?v.b.add(w.b):v.b.sub(w.b)));}return v;}
    next();const value=sum();if(token.type!=='end')throw new Error('Nedostaje operacija ili postoji višak zagrada.');return value;
  }

  function linearEquation(source){
    if(typeof source!=='string'||source.length>700)throw new Error('Jednačina može imati najviše 700 znakova.');
    const parts=source.split('=');if(parts.length!==2)throw new Error('Napiši jednu jednakost, npr. 3x + 5 = 20.');
    const left=parseLinear(parts[0]),right=parseLinear(parts[1]),a=left.a.sub(right.a),b=left.b.sub(right.b);
    const type=a.n!==0n?'unique':b.n===0n?'infinite':'none';
    const result={type,a:a.toString(),b:b.toString()};
    if(type==='unique')result.x=b.neg().div(a).toString();
    result.isolated=type==='unique'&&((fingerprint(parts[0])==='x'&&right.a.n===0n)||(fingerprint(parts[1])==='x'&&left.a.n===0n));
    return result;
  }

  function checkLinearStep(original,candidate){
    try{
      const before=linearEquation(original),after=linearEquation(candidate);
      const valid=before.type===after.type&&(before.type!=='unique'||before.x===after.x);
      return {valid,final:valid&&after.isolated,solution:after,message:valid?(after.isolated?'Tačno rješenje jednačine.':'Ekvivalentan korak: skup rješenja je sačuvan.'):'Ovaj korak mijenja skup rješenja. Provjeri znakove i uradi istu operaciju na obje strane.'};
    }catch(error){return {valid:false,final:false,message:error.message};}
  }

  function integerRange(v,lo,hi,label){if(!Number.isInteger(v)||v<lo||v>hi)throw new Error(label+' mora biti cijeli broj od '+lo+' do '+hi+'.');return v;}
  const euclid=(a,b)=>{const lines=[];a=BigInt(a);b=BigInt(b);while(b!==0n){const q=a/b,r=a%b;lines.push(`${a} = ${q} * ${b} + ${r}`);a=b;b=r;}return {lines,gcd:String(a)};};
  function generateTask(grade,type,seed=1){
    integerRange(grade,5,9,'Razred');integerRange(seed,1,9999,'Broj varijante');
    const topic=TYPES.find(t=>t.id===type&&t.grades.includes(grade));if(!topic)throw new Error('Oblast nije dostupna u odabranom razredu.');
    const k=seed-1,a=2+k%11,b=3+Math.floor(k/3)%9,c=1+Math.floor(k/7)%8;
    const task={id:`notebook-${grade}-${type}-${seed}`,grade,type,seed,title:topic.title,mode:'expression',minIntermediate:1,hint:'Svaki novi red mora imati istu vrijednost kao početni izraz. Posljednji red neka bude konačan skraćen razlomak ili broj.'};
    if(type==='arithmetic'){
      const n=grade===5?100000+k*37:20+k*17,m=b*c;
      task.source=`(${n} + ${a}) * ${b} - ${m}`;
      task.solution=[`${n+a} * ${b} - ${m}`,`${(n+a)*b} - ${m}`,String((n+a)*b-m)];task.minIntermediate=2;
    }else if(type==='fractions'){
      if(k%4===0){task.source=`${a}/6 + ${b}/9`;task.solution=[`${a*3}/18 + ${b*2}/18`,`${a*3+b*2}/18`,R(`${a}/6+${b}/9`).toString()];}
      else if(k%4===1){task.source=`${a}/6 - ${b}/9`;task.solution=[`${a*3}/18 - ${b*2}/18`,`${a*3-b*2}/18`,R(task.source).toString()];}
      else if(k%4===2){task.source=`${a}/7 * ${b}/5`;task.solution=[`(${a} * ${b})/(7 * 5)`,R(task.source).toString()];}
      else {task.source=`${a}/8 / (${b}/3)`;task.solution=[`${a}/8 * (3/${b})`,R(task.source).toString()];}
    }else if(type==='complexFractions'){
      task.source=`(${a}/4 + ${b}/6)/(${c}/3)`;
      const upper=R(`${a}/4+${b}/6`),lower=R(`${c}/3`);
      task.solution=[`(${upper})/(${lower})`,`(${upper}) * (3/${c})`,R(task.source).toString()];task.minIntermediate=2;
    }else if(type==='gcd'||type==='lcm'){
      const n=12*a,m=6*b,steps=euclid(n,m);task.mode='euclid';task.a=n;task.b=m;task.gcd=steps.gcd;task.euclid=steps.lines;
      task.source=`${type==='gcd'?'NZD':'NZS'}(${n}, ${m})`;task.answer=type==='gcd'?steps.gcd:String(M.lcm(n,m));
      task.solution=[...steps.lines,`${type==='gcd'?'NZD':'NZS'} = ${task.answer}`];
      task.hint='Napiši svaki red u obliku a = q * b + r, gdje je 0 ≤ r < b. Zatim nastavi parom b i r. Završni red napiši kao '+(type==='gcd'?'NZD':'NZS')+' = rezultat.';
      task.minIntermediate=steps.lines.length;
    }else if(type==='divisibility'){
      const d=[2,4,5,6,9,10,15,25][k%8],n=500+a*37+b*(k%4);task.mode='divisibility';task.n=n;task.divisor=d;task.answer=n%d===0?'da':'ne';task.source=`Da li je ${n} djeljiv sa ${d}?`;
      task.solution=[`${n} = ${Math.floor(n/d)} * ${d} + ${n%d}`,task.answer];
      task.hint='Napiši n = q * d + r (0 ≤ r < d), pa u posljednjem redu da ili ne. Broj je djeljiv kada je r = 0.';
    }else if(type==='linear'){
      const x=c+1;task.mode='linear';task.answer=String(x);task.hint='Napiši po jednu jednačinu u svakom redu. Dodavanje, oduzimanje, množenje i dijeljenje nenultim brojem moraju obuhvatiti obje strane. Završni red: x = broj.';
      if(grade===5){task.source=`x + ${b} = ${x+b}`;task.solution=[`x = ${x+b} - ${b}`,`x = ${x}`];}
      else if(grade===6||grade===7){task.source=`${a}x + ${b} = ${a*x+b}`;task.solution=[`${a}x = ${a*x}`,`x = ${x}`];}
      else if(grade===8){task.source=`${a+2}x + ${b} = 2x + ${a*x+b}`;task.solution=[`${a}x + ${b} = ${a*x+b}`,`${a}x = ${a*x}`,`x = ${x}`];task.minIntermediate=2;}
      else {task.source=`${a}(x + ${b})/2 = ${a*(x+b)}/2`;task.solution=[`${a}x + ${a*b} = ${a*(x+b)}`,`${a}x = ${a*x}`,`x = ${x}`];task.minIntermediate=2;}
    }else if(type==='percent'){
      const p=[5,10,12,15,20,25,30,40,75][k%9],whole=100+a*20;task.source=`${p}/100 * ${whole}`;task.prompt=`Izračunaj ${p}% od ${whole}.`;task.solution=[`(${p} * ${whole})/100`,R(task.source).toString()];
    }
    if(task.mode==='expression')task.answer=R(task.source).toString();
    task.prompt||=task.mode==='linear'?'Riješi jednačinu: '+task.source:task.mode==='expression'?'Izračunaj izraz: '+task.source:'Odredi '+task.source+'.';
    return task;
  }

  function expressionStep(task,line){
    try{
      const parts=line.split('=');if(parts.length>4||parts.some(p=>!p.trim()))throw new Error('Napiši izraz ili lanac od najviše četiri jednaka izraza.');
      const target=R(task.answer);for(const part of parts)if(!R(part).equals(target))return {valid:false,final:false,message:'Vrijednost se promijenila. Provjeri redoslijed operacija, predznak i nazivnik.'};
      const final=literal(parts[parts.length-1]);
      const intermediate=parts.some(part=>!literal(part)&&fingerprint(part)!==fingerprint(task.source));
      return {valid:true,final,intermediate,message:final?'Tačna vrijednost izraza.':'Vrijednost je sačuvana; nastavi račun.'};
    }catch(error){return {valid:false,final:false,message:error.message};}
  }

  function divisionRow(line,a,b){
    const match=/^(\d+)\s*=\s*(\d+)\s*\*\s*(\d+)\s*\+\s*(\d+)$/.exec(clean(line));
    if(!match)return {valid:false,message:'Koristi oblik a = q * b + r sa cijelim nenegativnim brojevima.'};
    const [n,q,d,r]=match.slice(1).map(BigInt);
    if(n!==BigInt(a)||d!==BigInt(b))return {valid:false,message:`Sada podijeli ${a} sa ${b}; prva vrijednost i djelilac moraju ostati ti brojevi.`};
    if(d===0n||r<0n||r>=d||q*d+r!==n)return {valid:false,message:'Provjeri količnik i ostatak: a = q·b + r i 0 ≤ r < b.'};
    return {valid:true,remainder:String(r),divisor:String(d),message:r===0n?'Ostatak je nula; posljednji nenulti djelilac je NZD.':'Tačno dijeljenje. Nastavi parom '+d+' i '+r+'.'};
  }

  function gradeSteps(task,lines){
    if(!task||typeof task!=='object'||!Array.isArray(lines)||lines.length>40)throw new Error('Unesite najviše 40 koraka.');
    const checked=[],seen=new Set([fingerprint(task.source)]);let intermediate=0,processAttempts=0,answerCorrect=false,prefix=true,hasError=false;
    let currentA=task.a,currentB=task.b,divisionDone=false;
    for(const raw of lines){
      if(typeof raw!=='string'||raw.length>700)throw new Error('Jedan korak može imati najviše 700 znakova.');
      const line=raw.trim();if(!line){checked.push({valid:null,final:false,credit:false,message:'Prazan red se ne ocjenjuje.'});continue;}
      let result;
      if(task.mode==='linear'){
        result=checkLinearStep(task.source,line);
        result.intermediate=result.valid&&!result.final;
        // An isolated x = expression still shows working when its RHS is not a
        // single final literal. It counts once, and does not conclude the task.
        if(result.valid&&result.final){const parts=line.split('=');const rhs=fingerprint(parts[0])==='x'?parts[1]:parts[0];if(!literal(rhs)){result.final=false;result.intermediate=true;result.message='Tačan izraz za x; izračunaj konačnu vrijednost.';}}
      }else if(task.mode==='expression')result=expressionStep(task,line);
      else if(task.mode==='euclid'){
        const final=/^(NZD|NZS)\s*=\s*(.+)$/i.exec(line);
        if(final){
          try{const label=task.type==='gcd'?'NZD':'NZS',valid=final[1].toUpperCase()===label&&R(final[2]).equals(task.answer);result={valid,final:valid,message:valid?'Tačan '+label+'.':'Provjeri oznaku i vrijednost '+label+'.'};}catch(error){result={valid:false,final:false,message:error.message};}
        }else if(currentB===0||currentB==='0')result={valid:false,final:false,message:'Algoritam je završio. Napiši '+(task.type==='gcd'?'NZD':'NZS')+' = rezultat.'};
        else {result=divisionRow(line,currentA,currentB);result.intermediate=result.valid;if(result.valid&&prefix){currentA=currentB;currentB=result.remainder;}}
      }else if(task.mode==='divisibility'){
        const decision=line.toLocaleLowerCase('bs');
        if(decision==='da'||decision==='ne')result={valid:decision===task.answer,final:decision===task.answer,message:decision===task.answer?'Tačan zaključak o djeljivosti.':'Zaključak nije tačan. Djeljivost važi kada je ostatak nula.'};
        else {result=divisionRow(line,task.n,task.divisor);result.intermediate=result.valid&&!divisionDone;if(result.valid&&prefix)divisionDone=true;}
      }else throw new Error('Nepodržana vrsta zadatka.');
      const key=fingerprint(line),newStep=!seen.has(key);seen.add(key);
      const credit=result.valid&&prefix&&result.intermediate&&newStep;
      if(newStep&&(result.intermediate||!result.valid))processAttempts++;
      if(credit)intermediate++;
      if(!result.valid){prefix=false;hasError=true;}
      answerCorrect=!!(result.valid&&result.final);
      checked.push({...result,credit,message:result.valid&&!newStep?'Ponovljen red je tačan, ali ne donosi nove bodove za postupak.':result.message});
    }
    // Answer credit stays available after an error; process credit stops at the
    // first invalid transformation. This separates a correct answer from a
    // consistently correct derivation, and remains useful for partial marking.
    const required=Math.max(1,task.minIntermediate||1),processDenominator=hasError?Math.max(required,processAttempts):required;
    const processPoints=Math.round(60*Math.min(intermediate,required)/processDenominator),answerPoints=answerCorrect?40:0;
    const score=processPoints+answerPoints,complete=answerCorrect&&!hasError&&intermediate>=required;
    return {rows:checked,score,processPoints,answerPoints,intermediate,required,answerCorrect,complete,hasError,message:complete?'Postupak i konačan odgovor su tačni.':answerCorrect&&intermediate===0?'Odgovor je tačan (40/100). Dodaj međukorake za bodove za postupak.':hasError?'Sačuvani su bodovi do prve greške. Ispravi označeni red i ponovo provjeri.':'Nastavi postupak i napiši konačan odgovor.'};
  }

  function normalizeState(raw){
    if(raw===undefined||raw===null)raw={};
    if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Matematička sveska mora biti objekat.');
    if(raw.version!==undefined&&raw.version!==1)throw new Error('Nepodržana verzija matematičke sveske.');
    const grade=raw.grade===undefined?5:integerRange(raw.grade,5,9,'Razred sveske');
    const type=raw.type===undefined?'arithmetic':raw.type;if(!TYPES.some(t=>t.id===type&&t.grades.includes(grade)))throw new Error('Nepoznata oblast matematičke sveske.');
    const seed=raw.seed===undefined?1:integerRange(raw.seed,1,9999,'Varijanta sveske');
    const out={version:1,grade,type,seed,attempts:{},geometry:{mode:'rectangle',a:6,b:4,r:3,slope:1,intercept:0,points:[]}};
    const attempts=raw.attempts||{};
    if(typeof attempts!=='object'||Array.isArray(attempts)||Object.keys(attempts).length>200)throw new Error('Sveska može sačuvati najviše 200 zadataka.');
    for(const [id,value] of Object.entries(attempts)){
      const match=/^notebook-([5-9])-([A-Za-z]+)-(\d{1,4})$/.exec(id);if(!match)throw new Error('Nepoznata oznaka zadatka u svesci.');
      generateTask(Number(match[1]),match[2],Number(match[3]));
      if(!value||typeof value!=='object'||Array.isArray(value)||!Array.isArray(value.lines)||value.lines.length>40||value.lines.some(s=>typeof s!=='string'||s.length>700))throw new Error('Neispravni koraci u matematičkoj svesci.');
      if(value.notes!==undefined&&(typeof value.notes!=='string'||value.notes.length>4000))throw new Error('Bilješka u svesci može imati najviše 4000 znakova.');
      if(value.assisted!==undefined&&typeof value.assisted!=='boolean')throw new Error('Oznaka pomoći u svesci nije ispravna.');
      if(value.updatedAt!==undefined&&(typeof value.updatedAt!=='string'||value.updatedAt.length>40||!Number.isFinite(Date.parse(value.updatedAt))))throw new Error('Neispravan datum rada u svesci.');
      out.attempts[id]={lines:value.lines.map(s=>s.trim()),notes:value.notes||'',assisted:!!value.assisted,updatedAt:value.updatedAt||''};
    }
    if(raw.geometry!==undefined){
      const g=raw.geometry;if(!g||typeof g!=='object'||Array.isArray(g))throw new Error('Neispravna geometrijska skica.');
      if(g.mode!==undefined){if(!['rectangle','triangle','circle','graph'].includes(g.mode))throw new Error('Nepoznata figura u skici.');out.geometry.mode=g.mode;}
      for(const [key,lo,hi] of [['a',1,20],['b',1,20],['r',1,10],['slope',-5,5],['intercept',-10,10]])if(g[key]!==undefined){if(typeof g[key]!=='number'||!Number.isFinite(g[key])||g[key]<lo||g[key]>hi)throw new Error('Dimenzija skice je izvan podržanog raspona.');out.geometry[key]=g[key];}
      if(g.points!==undefined){if(!Array.isArray(g.points)||g.points.length>30||g.points.some(p=>!p||typeof p!=='object'||typeof p.x!=='number'||typeof p.y!=='number'||!Number.isFinite(p.x)||!Number.isFinite(p.y)||Math.abs(p.x)>10||Math.abs(p.y)>10))throw new Error('Skica podržava do 30 tačaka u rasponu od -10 do 10.');out.geometry.points=g.points.map(p=>({x:p.x,y:p.y}));}
    }
    return out;
  }

  function calculateFigure(mode,dimensions){
    if(mode==='graph'){
      const slope=R(String(dimensions.slope)),intercept=R(String(dimensions.intercept));
      return {shape:'graph',results:[{label:'Funkcija',value:`y = ${slope}x ${intercept.n<0n?'- '+intercept.abs():'+ '+intercept}`,unit:'',formula:'y = ax + b'}],points:M.linearPoints(slope,intercept,[-2,-1,0,1,2])};
    }
    const d=mode==='rectangle'?{a:String(dimensions.a),b:String(dimensions.b)}:mode==='triangle'?{a:String(dimensions.a),h:String(dimensions.b)}:mode==='circle'?{r:String(dimensions.r)}:null;
    if(!d)throw new Error('Nepoznata figura.');return M.geometry(mode,d);
  }
  return Object.freeze({types:TYPES,parseLinear,linearEquation,checkLinearStep,generateTask,gradeSteps,normalizeState,calculateFigure});
});
