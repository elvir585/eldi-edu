(function(root,factory){
  'use strict';
  const node=typeof module==='object'&&module.exports;
  const api=factory({math:()=>node?require('./practice-engine.js'):root.EduPractice,info:()=>node?require('../content/informatics-junior.json').concat(require('../content/informatics-senior.json')):root.ELDI_INFORMATICS_CATALOG,awards:()=>node?require('../renderer/awards.js'):root.ELDIAwards});
  if(node)module.exports=api;else root.ELDIExamEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(source){
  'use strict';
  const counts=[5,10,15,20,25,30,40,50];
  function integer(value,min,max,label){if(!Number.isInteger(value)||value<min||value>max)throw Error(`${label}: od ${min} do ${max}.`);return value;}
  function random(seed){let state=(seed>>>0)||1;return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};}
  function shuffle(items,seed){const out=items.slice(),rand=random(seed);for(let i=out.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
  function resolve(ref){
    if(ref.kind==='math')return source.math().generate(ref.topicId,ref.seed,ref.difficulty);
    const lesson=source.info().find(l=>l.id===ref.lessonId);
    if(!lesson)throw Error('Nepoznat informatički zadatak.');
    return {...lesson.activity,id:'activity-'+lesson.id,topicId:lesson.id,grade:lesson.grade,title:lesson.title,subject:'informatics'};
  }
  function checkField(field,value){
    if(field.type==='text'&&(field.preserveWhitespace||field.caseSensitive)){const normalize=v=>{const text=String(v??'').replace(/\r\n/g,'\n');return field.preserveWhitespace?text.replace(/\n+$/,''):text.trim();};const actual=normalize(value),correct=actual.length>0&&[field.answer,...(field.accepted||[])].some(v=>normalize(v)===actual);return{correct,message:correct?'Tačan odgovor.':actual?'Izlaz ne odgovara traženom rezultatu.':'Unesite odgovor.'};}
    return source.math().checkField(field,value);
  }
  function checkTask(task,answers){const fields=task.fields.map(f=>({key:f.key,...checkField(f,answers?.[f.key])}));return{correct:fields.every(f=>f.correct),fields};}
  function createSession(options){
    const {subject='math',gradeLevel=5,count=10,seed=1,difficulty='medium',category='all',profileName='Učenik',thresholds=[50,65,80,90]}=options||{};
    if(!['math','informatics','mixed'].includes(subject))throw Error('Nepoznat predmet.');integer(gradeLevel,5,9,'Razred');integer(count,1,50,'Broj zadataka');integer(seed,1,9999,'Broj provjere');if(!['easy','medium','hard'].includes(difficulty))throw Error('Nepoznat nivo.');source.awards().gradeResult(0,thresholds);if(!String(profileName||'').trim())throw Error('Unesite ime učenika.');
    const maths=source.math().topics.filter(t=>t.grade===gradeLevel&&(category==='all'||t.category===category));
    const informatics=source.info().filter(t=>t.grade===gradeLevel&&(category==='all'||t.category===category));
    const available=[];
    if(subject!=='informatics')for(const t of maths)available.push({kind:'math',topicId:t.id,seed:1+(seed*31)%200,difficulty});
    if(subject!=='math')for(const t of informatics)available.push({kind:'informatics',lessonId:t.id});
    if(!available.length)throw Error('Nema zadataka za odabranu oblast.');
    let refs;
    if(subject==='mixed'&&count>=2){const mathRefs=shuffle(available.filter(r=>r.kind==='math'),seed),infoRefs=shuffle(available.filter(r=>r.kind==='informatics'),seed+97);refs=shuffle([...mathRefs.slice(0,Math.ceil(count/2)),...infoRefs.slice(0,Math.floor(count/2))],seed+193);}
    else refs=shuffle(available,seed).slice(0,count);
    // Mathematics can form longer focused exams from distinct indexed variants.
    if(refs.length<count&&subject==='math'){
      const seen=new Set(refs.map(r=>r.topicId+':'+r.seed));
      for(let i=0;refs.length<count&&i<20000;i++){const t=maths[i%maths.length],n=1+((seed*31+Math.floor(i/maths.length)+1)%200),key=t.id+':'+n;if(seen.has(key))continue;seen.add(key);refs.push({kind:'math',topicId:t.id,seed:n,difficulty});}
    }
    if(refs.length<count)throw Error(`Odabrana oblast ima ${refs.length} različitih praktičnih zadataka. Izaberite najviše ${refs.length} ili sve oblasti.`);
    return{id:'exam-'+Date.now().toString(36)+'-'+Math.floor(Math.random()*1e9).toString(36),subject,gradeLevel,total:count,seed,difficulty,category,thresholds:thresholds.slice(),profileName:String(profileName).slice(0,60),refs,answers:{},notes:{},startedAt:new Date().toISOString(),completed:false};
  }
  function finish(session){
    if(!session||session.completed)throw Error('Ova provjera je već završena.');
    if(typeof session.id!=='string'||!session.id.trim()||session.id.length>160||typeof session.profileName!=='string'||!session.profileName.trim()||session.profileName.length>120)throw Error('Neispravna oznaka ili ime u provjeri.');
    integer(session.total,1,50,'Broj zadataka');integer(session.gradeLevel,5,9,'Razred');if(!['math','informatics','mixed'].includes(session.subject)||!session.answers||typeof session.answers!=='object'||Array.isArray(session.answers)||!Array.isArray(session.refs)||session.refs.length!==session.total)throw Error('Neispravna provjera.');
    const seen=new Set();
    for(const ref of session.refs){const key=ref?.kind==='math'?`math:${ref.topicId}:${ref.seed}:${ref.difficulty}`:`info:${ref?.lessonId}`;if(seen.has(key))throw Error('Ponovljeni zadatak u provjeri.');seen.add(key);if(!ref||!['math','informatics'].includes(ref.kind)||resolve(ref).grade!==session.gradeLevel||(session.subject==='math'&&ref.kind!=='math')||(session.subject==='informatics'&&ref.kind!=='informatics'))throw Error('Zadatak ne pripada ovoj provjeri.');}
    const details=session.refs.map((ref,index)=>{const task=resolve(ref),result=checkTask(task,session.answers[index]||{});return{index,taskId:task.id,title:task.title,...result};});
    const correct=details.filter(r=>r.correct).length,percentage=correct*100/session.total;
    const result={...session,completed:true,correct,percentage,gradeResult:source.awards().gradeResult(percentage,session.thresholds),finishedAt:new Date().toISOString(),details};session.completed=true;return result;
  }
  function categories(subject,gradeLevel){const maths=[...new Set(source.math().topics.filter(t=>t.grade===gradeLevel).map(t=>t.category))],info=[...new Set(source.info().filter(t=>t.grade===gradeLevel).map(t=>t.category))];const all=subject==='math'?maths:subject==='informatics'?info:maths.filter(c=>info.includes(c));return all.filter(Boolean).sort((a,b)=>a.localeCompare(b,'bs'));}
  return{counts,createSession,resolve,checkTask,checkField,finish,categories,shuffle};
});
