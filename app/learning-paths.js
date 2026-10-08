(function(root,factory){
  'use strict';const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('../content/math-catalog.json').concat(require('../content/informatics-junior.json'),require('../content/informatics-senior.json')):[...root.ELDI_MATH_CATALOG,...root.ELDI_INFORMATICS_CATALOG],node?require('../content/curriculum-map.js'):root.ELDI_CURRICULUM_MAP,node?require('./practice-engine.js'):root.EduPractice,node?require('./exam-engine.js'):root.ELDIExamEngine);
  if(node)module.exports=api;else root.ELDILearningPlan=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(catalog,map,practice,exam){
  'use strict';
  const lessons=new Map(catalog.map(l=>[l.id,l])),units=new Map(map.units.map(u=>[u.id,u])),unitByLesson=new Map(map.units.flatMap(u=>u.lessonIds.map(id=>[id,u]))),reserved=new Set(['__proto__','constructor','prototype']);
  const clone=v=>JSON.parse(JSON.stringify(v));
  function object(v,label){if(!v||typeof v!=='object'||Array.isArray(v))throw Error(label+': očekuje se objekat.');return v;}
  function text(v,max,label,empty=true){if(typeof v!=='string'||v.length>max||(!empty&&!v.trim()))throw Error(label+': neispravan tekst.');return v;}
  function number(v,min,max,label){if(!Number.isInteger(v)||v<min||v>max)throw Error(label+': neispravan broj.');return v;}
  function bool(v,label){if(typeof v!=='boolean')throw Error(label+': očekuje se da ili ne.');return v;}
  function date(v,label){text(v,80,label);if(v&&!Number.isFinite(Date.parse(v)))throw Error(label+': neispravan datum.');return v;}
  function dictionary(v,label,max){object(v,label);const rows=Object.entries(v);if(rows.length>max)throw Error(label+': previše zapisa.');for(const[key]of rows)if(!key||key.length>180||reserved.has(key))throw Error(label+': neispravan ključ.');return rows;}
  function sourceURL(v){text(v,2000,'Izvor');if(v){let u;try{u=new URL(v);}catch{throw Error('Izvor mora biti potpuna http/https adresa.');}if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Izvor mora biti javna http/https adresa.');}return v;}
  function normalizeOutcome(value){
    object(value,'Ishod');const out={id:text(value.id,160,'Oznaka ishoda',false),subject:value.subject,grade:number(value.grade,5,9,'Razred'),title:text(value.title,400,'Naziv ishoda',false),lessonIds:[],officialId:text(value.officialId??'',240,'Službena oznaka'),source:sourceURL(value.source??''),schoolYear:text(value.schoolYear??'',30,'Školska godina'),page:text(value.page??'',80,'Stranica/odjeljak'),reviewer:text(value.reviewer??'',160,'Pregledao'),reviewedAt:date(value.reviewedAt??'','Datum pregleda'),status:value.status??'draft',notes:text(value.notes??'',6000,'Bilješke')};
    if(reserved.has(out.id)||!['math','informatics'].includes(out.subject)||!['editorial','draft','reviewed'].includes(out.status))throw Error('Neispravan predmet, oznaka ili status ishoda.');
    if(out.schoolYear&&!/^\d{4}\/\d{4}$/.test(out.schoolYear))throw Error('Školska godina: npr. 2026/2027.');
    if(out.schoolYear&&Number(out.schoolYear.slice(5))!==Number(out.schoolYear.slice(0,4))+1)throw Error('Školska godina mora obuhvatiti dvije uzastopne godine.');
    if(!Array.isArray(value.lessonIds)||value.lessonIds.length>100)throw Error('Ishod može povezati najviše 100 postojećih vještina.');
    for(const id of value.lessonIds){const l=lessons.get(id);if(!l||l.subject!==out.subject||l.grade!==out.grade)throw Error('Povezana vještina ne pripada predmetu i razredu ishoda.');if(out.lessonIds.includes(id))throw Error('Vještina je dva puta povezana sa istim ishodom.');out.lessonIds.push(id);}
    if(out.status==='reviewed'&&(!out.officialId.trim()||!out.source||!out.schoolYear||!out.page.trim()||!out.reviewer.trim()||!out.reviewedAt))throw Error('Za pregledano povezivanje unesite službenu oznaku, izvor, školsku godinu, stranicu, ime i datum pregleda.');
    return out;
  }
  function normalizeOutcomes(values){if(!Array.isArray(values)||values.length>1200)throw Error('Mapa može imati najviše 1200 ishoda.');const ids=new Set();return values.map(v=>{const out=normalizeOutcome(v);if(ids.has(out.id))throw Error('Ponovljena oznaka ishoda.');ids.add(out.id);return out;});}
  function freshWork(){return{version:1,subject:'math',grade:5,dailyCount:3,lastLessonId:'',lessons:{},outcomes:clone(map.outcomes)};}
  function normalizeWork(value){
    if(value===undefined)return freshWork();object(value,'Putevi učenja');if(value.version!==1)throw Error('Nepodržana verzija puteva učenja.');
    const out={version:1,subject:value.subject??'math',grade:number(value.grade??5,5,9,'Razred učenja'),dailyCount:number(value.dailyCount??3,1,5,'Dnevni broj'),lastLessonId:text(value.lastLessonId??'',160,'Posljednja vještina'),lessons:{},outcomes:normalizeOutcomes(value.outcomes??map.outcomes)};
    if(!['math','informatics'].includes(out.subject)||out.lastLessonId&&!lessons.has(out.lastLessonId))throw Error('Nepoznat predmet ili posljednja vještina.');
    for(const[id,item]of dictionary(value.lessons??{},'Rad po vještinama',1000)){
      if(!lessons.has(id))throw Error('Nepoznata vještina u putu učenja.');object(item,'Rad vještine');const row={theoryRead:bool(item.theoryRead??false,'Teorija'),exampleRead:bool(item.exampleRead??false,'Primjer'),variant:number(item.variant??1,1,200,'Varijanta'),difficulty:item.difficulty??'medium',answers:{},notes:text(item.notes??'',6000,'Postupak'),attempts:number(item.attempts??0,0,1000000000,'Broj pokušaja'),currentAttempts:number(item.currentAttempts??item.attempts??0,0,1000000000,'Pokušaji trenutne vježbe'),lastCorrect:bool(item.lastCorrect??false,'Posljednji odgovor'),correct:bool(item.correct??false,'Uspjeh'),independentCorrect:bool(item.independentCorrect??false,'Samostalan uspjeh'),assisted:bool(item.assisted??false,'Pomoć u trenutnoj vježbi'),updatedAt:date(item.updatedAt??'','Vrijeme rada'),completedAt:date(item.completedAt??'','Završeno')};
      if(!['easy','medium','hard'].includes(row.difficulty))throw Error('Nepoznata težina.');
      row.dirty=bool(item.dirty??false,'Izmijenjen odgovor');if(row.currentAttempts>row.attempts)throw Error('Broj pokušaja trenutne vježbe ne može biti veći od ukupnog broja.');
      const task=resolveTask(id,row.variant,row.difficulty),keys=new Set(task.fields.map(f=>f.key));for(const[key,answer]of dictionary(item.answers??{},'Odgovori',100)){if(!keys.has(key))throw Error('Nepoznato polje odgovora.');row.answers[key]=text(answer,2048,'Odgovor');}
      if(row.independentCorrect&&!row.correct)throw Error('Samostalan uspjeh zahtijeva tačan rezultat.');
      out.lessons[id]=row;
    }
    return out;
  }
  function ensure(profile){profile.learningPathWork||=freshWork();return profile.learningPathWork;}
  function lessonWork(profile,id){if(!lessons.has(id))throw Error('Nepoznata vještina.');const work=ensure(profile);return work.lessons[id]||=( {theoryRead:false,exampleRead:false,variant:1,difficulty:'medium',answers:{},notes:'',attempts:0,currentAttempts:0,lastCorrect:false,correct:false,independentCorrect:false,assisted:false,dirty:false,updatedAt:'',completedAt:''});}
  function resolveTask(id,variant=1,difficulty='medium'){
    const lesson=lessons.get(id);if(!lesson)throw Error('Nepoznata vještina.');number(variant,1,200,'Varijanta');if(!['easy','medium','hard'].includes(difficulty))throw Error('Nepoznata težina.');
    return lesson.subject==='math'?practice.generate(id,variant,difficulty):{...clone(lesson.activity),id:'activity-'+id,topicId:id,title:lesson.title,grade:lesson.grade,subject:'informatics'};
  }
  function recordAttempt(profile,id,answers,now=new Date().toISOString()){
    date(now,'Vrijeme rada');const row=lessonWork(profile,id),lesson=lessons.get(id),task=resolveTask(id,row.variant,row.difficulty),result=exam.checkTask(task,answers);row.answers={};for(const f of task.fields)row.answers[f.key]=String(answers?.[f.key]??'').slice(0,2048);row.dirty=false;
    row.attempts++;row.currentAttempts++;row.lastCorrect=result.correct;row.correct||=result.correct;row.independentCorrect||=result.correct&&!row.assisted;row.updatedAt=date(now,'Vrijeme rada');if(row.theoryRead&&row.exampleRead&&result.correct)row.completedAt=now;
    profile.courseAnswers||={};profile.courseAnswers[id]={...row.answers};profile.courseNotes||={};profile.courseNotes[id]=row.notes;
    profile.courseResults||={};const old=profile.courseResults[id]||{},independent=row.independentCorrect||old.correct&&!old.assisted;profile.courseResults[id]={...old,correct:!!(old.correct||result.correct),lastCorrect:result.correct,attempts:(old.attempts||0)+1,assisted:!independent&&!!(old.assisted||row.assisted),title:lesson.title,grade:lesson.grade,date:now};
    if(lesson.subject==='math')profile.mathWork||={answers:{},notes:{},results:{},session:[],sheets:[]};else profile.infoWork||={results:{}};
    const practical=lesson.subject==='math'?profile.mathWork:profile.infoWork;practical.results||={};const prior=practical.results[task.id]||{},taskIndependent=result.correct&&!row.assisted||prior.correct&&!prior.assisted;
    practical.results[task.id]={correct:!!(prior.correct||result.correct),lastCorrect:result.correct,attempts:(prior.attempts||0)+1,assisted:!taskIndependent&&!!(prior.assisted||row.assisted),title:lesson.title,grade:lesson.grade,date:now};
    return result;
  }
  function progress(profile,id){
    const row=profile.learningPathWork?.lessons?.[id],old=profile.courseResults?.[id];
    const correct=!!(row?.correct||old?.correct),independent=!!(row?.independentCorrect||old?.correct&&!old?.assisted),failed=!!((row?.currentAttempts||0)>0&&!row.lastCorrect||(old?.attempts||0)>0&&old.lastCorrect===false);
    return{correct,independent,failed,theoryRead:!!row?.theoryRead,exampleRead:!!row?.exampleRead,completed:!!(row?.theoryRead&&row?.exampleRead&&correct),attempts:row?.attempts??old?.attempts??0};
  }
  function unitProgress(profile,unit){if(typeof unit==='string')unit=units.get(unit);if(!unit)throw Error('Nepoznata cjelina.');const rows=unit.lessonIds.map(id=>progress(profile,id));return{total:rows.length,correct:rows.filter(r=>r.correct).length,independent:rows.filter(r=>r.independent).length,completed:rows.filter(r=>r.completed).length,failed:rows.filter(r=>r.failed).length};}
  function prerequisites(profile,id){const unit=unitByLesson.get(id);if(!unit)throw Error('Nepoznata vještina.');return unit.prerequisites.map(id=>{const u=units.get(id),p=unitProgress(profile,u);return{...u,...p,ready:p.independent===p.total};});}
  function dailyPlan(profile,{subject=profile.learningPathWork?.subject||'math',grade=profile.learningPathWork?.grade||5,count=profile.learningPathWork?.dailyCount||3}={}){
    if(!['math','informatics'].includes(subject))throw Error('Nepoznat predmet.');number(grade,5,9,'Razred');number(count,1,5,'Dnevni broj');
    const selected=catalog.filter(l=>l.subject===subject&&l.grade===grade),out=[],seen=new Set();
    const add=(lesson,reason)=>{if(!lesson||seen.has(lesson.id)||out.length>=count)return;seen.add(lesson.id);out.push({lessonId:lesson.id,title:lesson.title,grade:lesson.grade,subject:lesson.subject,reason,unitId:unitByLesson.get(lesson.id).id});};
    const failed=selected.filter(l=>progress(profile,l.id).failed).sort((a,b)=>(profile.learningPathWork?.lessons?.[b.id]?.updatedAt||'').localeCompare(profile.learningPathWork?.lessons?.[a.id]?.updatedAt||''));
    for(const lesson of failed)add(lesson,'Ponovi vještinu nakon posljednjeg netačnog pokušaja.');
    for(const lesson of selected){const p=progress(profile,lesson.id);if(p.independent)continue;
      const missing=prerequisites(profile,lesson.id).find(u=>!u.ready);
      if(missing){const prerequisite=missing.lessonIds.map(id=>lessons.get(id)).find(l=>!progress(profile,l.id).independent);add(prerequisite,`Priprema za „${unitByLesson.get(lesson.id).title}“: ${missing.title}.`);}
      add(lesson,p.correct?'Riješi samostalno nakon ranije pomoći.':'Nauči objašnjenje, pogledaj primjer i uradi praktični zadatak.');if(out.length>=count)break;
    }
    if(out.length<count)for(const lesson of selected.filter(l=>progress(profile,l.id).independent).reverse())add(lesson,'Kratko ponavljanje već riješene vještine.');
    return out;
  }
  function nextLesson(profile,id){const current=lessons.get(id);if(!current)throw Error('Nepoznata vještina.');const unit=unitByLesson.get(id),same=unit.lessonIds.slice(unit.lessonIds.indexOf(id)+1).find(id=>!progress(profile,id).independent);if(same)return lessons.get(same);const next=map.units.filter(u=>u.subject===current.subject&&u.grade===current.grade&&u.order>unit.order).flatMap(u=>u.lessonIds).find(id=>!progress(profile,id).independent);return lessons.get(next)||null;}
  function coverage(profile,{subject,grade}={}){
    const outcomes=(profile.learningPathWork?.outcomes||map.outcomes).filter(o=>(!subject||o.subject===subject)&&(!grade||o.grade===grade)),available=catalog.filter(l=>(!subject||l.subject===subject)&&(!grade||l.grade===grade)),mapped=new Set(outcomes.flatMap(o=>o.lessonIds)),reviewed=new Set(outcomes.filter(o=>o.status==='reviewed').flatMap(o=>o.lessonIds));
    return{outcomes:outcomes.length,reviewedOutcomes:outcomes.filter(o=>o.status==='reviewed').length,unmappedOutcomes:outcomes.filter(o=>!o.lessonIds.length).length,skills:available.length,mappedSkills:available.filter(l=>mapped.has(l.id)).length,reviewedSkills:available.filter(l=>reviewed.has(l.id)).length,independentSkills:available.filter(l=>progress(profile,l.id).independent).length};
  }
  function importMapping(input){let pack=input;if(typeof input==='string'){if(new TextEncoder().encode(input).length>8*1024*1024)throw Error('Mapa je veća od 8 MB.');try{pack=JSON.parse(input);}catch{throw Error('Mapa nije ispravan JSON.');}}object(pack,'Mapa');if(pack.app!=='ELDI EDU curriculum map'||pack.version!==1)throw Error('Nepodržan format mape kurikuluma.');return normalizeOutcomes(pack.outcomes);}
  function exportMapping(profile){return{app:'ELDI EDU curriculum map',version:1,basis:map.basis,exportedAt:new Date().toISOString(),officialAlignment:'Status reviewed označava pregled korisnika u ovom profilu, a ne odobrenje Pedagoškog zavoda.',outcomes:clone(profile.learningPathWork?.outcomes||map.outcomes)};}
  return Object.freeze({catalog,units:map.units,metadata:map,getLesson:id=>lessons.get(id),getUnit:id=>units.get(id),unitFor:id=>unitByLesson.get(id),freshWork,normalizeWork,normalizeOutcome,normalizeOutcomes,ensure,lessonWork,resolveTask,recordAttempt,progress,unitProgress,prerequisites,dailyPlan,nextLesson,coverage,importMapping,exportMapping});
});
