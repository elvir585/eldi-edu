(function(root,factory){
  'use strict';
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./exam-engine.js'):root.ELDIExamEngine,node?require('./practice-engine.js'):root.EduPractice,node?require('../content/informatics-junior.json').concat(require('../content/informatics-senior.json')):root.ELDI_INFORMATICS_CATALOG);
  if(node)module.exports=api;else root.ELDITeacherEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(E,P,I){
  'use strict';
  const LIMITS={classes:100,roster:100,assignments:500,submissions:1000,reviews:2000,bytes:8*1024*1024};
  const subjects=['math','informatics','mixed'],levels=['easy','medium','hard'];
  const fail=m=>{throw Error(m);};
  const object=(v,label)=>{if(!v||typeof v!=='object'||Array.isArray(v))fail(label+': očekuje se objekat.');return v;};
  const text=(v,max,label,empty=true)=>{if(typeof v!=='string'||v.length>max||(!empty&&!v.trim()))fail(label+': neispravan tekst.');return v;};
  const id=(v,label)=>{text(v,160,label,false);if(!/^[a-zA-Z0-9._:-]+$/.test(v)||['__proto__','constructor','prototype'].includes(v))fail(label+': neispravna oznaka.');return v;};
  const integer=(v,min,max,label)=>{if(!Number.isInteger(v)||v<min||v>max)fail(label+': neispravan broj.');return v;};
  const list=(v,max,label)=>{if(!Array.isArray(v)||v.length>max)fail(label+': previše zapisa ili pogrešan format.');return v;};
  const unique=(rows,key,label)=>{if(new Set(rows.map(key)).size!==rows.length)fail(label+': ponovljena oznaka.');return rows;};
  const bytes=value=>{const raw=JSON.stringify(value);return typeof TextEncoder==='function'?new TextEncoder().encode(raw).length:unescape(encodeURIComponent(raw)).length;};
  const fits=value=>{if(bytes(value)>LIMITS.bytes)fail('Nastavnički modul smije imati do 8 MB. Sačuvajte profil prije daljnjeg proširivanja evidencije.');};
  const timestamp=(v,label)=>{text(v,80,label,false);if(!Number.isFinite(Date.parse(v)))fail(label+': neispravan datum.');return new Date(v).toISOString();};
  function dueDate(v=''){
    text(v,10,'Rok');if(v==='')return '';
    if(!/^\d{4}-\d{2}-\d{2}$/.test(v))fail('Rok: unesite datum oblika godina-mjesec-dan.');
    const d=new Date(v+'T00:00:00.000Z');if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==v)fail('Rok: neispravan datum.');return v;
  }
  function isLate(due,submittedAt){if(!due)return false;dueDate(due);const [y,m,d]=due.split('-').map(Number),end=new Date(y,m-1,d+1).getTime();return new Date(submittedAt).getTime()>=end;}
  const makeId=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Math.floor(Math.random()*1e12).toString(36);
  const refIdentity=r=>r.kind==='math'?`math:${r.topicId}:${r.seed}:${r.difficulty}`:`informatics:${r.lessonId}`;
  function cleanRef(value,grade,subject){
    object(value,'Zadatak');let ref;
    if(value.kind==='math')ref={kind:'math',topicId:id(value.topicId,'Oblast'),seed:integer(value.seed,1,200,'Varijanta'),difficulty:levels.includes(value.difficulty)?value.difficulty:fail('Nepoznat nivo.')};
    else if(value.kind==='informatics')ref={kind:'informatics',lessonId:id(value.lessonId,'Lekcija')};
    else fail('Nepoznat tip zadatka.');
    if((subject==='math'&&ref.kind!=='math')||(subject==='informatics'&&ref.kind!=='informatics')||E.resolve(ref).grade!==grade)fail('Zadatak nije iz odabranog predmeta ili razreda.');return ref;
  }
  function normalizeAssignment(v){
    object(v,'Zaduženje');const gradeLevel=integer(v.gradeLevel,5,9,'Razred'),count=integer(v.count,1,50,'Broj zadataka');
    if(!subjects.includes(v.subject)||!levels.includes(v.difficulty))fail('Nepoznat predmet ili nivo.');
    const refs=unique(list(v.refs,50,'Zadaci').map(r=>cleanRef(r,gradeLevel,v.subject)),refIdentity,'Zadaci');if(refs.length!==count)fail('Broj zadataka nije usklađen.');
    const template=E.createSession({subject:v.subject,gradeLevel,count:1,seed:integer(v.seed,1,9999,'Broj provjere'),difficulty:v.difficulty,profileName:'Provjera',thresholds:v.thresholds});
    return{id:id(v.id,'Zaduženje'),name:text(v.name,160,'Naziv',false).trim(),classId:v.classId===null||v.classId===undefined?null:id(v.classId,'Odjeljenje'),teacherName:text(v.teacherName??'',60,'Nastavnik'),subject:v.subject,gradeLevel,count,seed:v.seed,difficulty:v.difficulty,category:text(v.category??'all',160,'Oblast'),thresholds:template.thresholds,refs,createdAt:timestamp(v.createdAt,'Datum kreiranja'),dueDate:dueDate(v.dueDate??''),instructions:text(v.instructions??'',6000,'Uputa')};
  }
  function normalizeClass(v){object(v,'Odjeljenje');const roster=unique(list(v.roster??[],LIMITS.roster,'Učenici').map(s=>{object(s,'Učenik');return{id:id(s.id,'Učenik'),name:text(s.name,60,'Ime učenika',false).trim(),profileId:s.profileId===null||s.profileId===undefined?null:id(s.profileId,'Profil učenika')};}),s=>s.id,'Učenici');const linked=roster.filter(s=>s.profileId);unique(linked,s=>s.profileId,'Profili učenika');return{id:id(v.id,'Odjeljenje'),name:text(v.name,80,'Odjeljenje',false).trim(),gradeLevel:integer(v.gradeLevel,5,9,'Razred'),roster};}
  function fingerprint(a){let h=2166136261;const s=JSON.stringify([a.id,a.name,a.classId,a.teacherName,a.subject,a.gradeLevel,a.count,a.seed,a.difficulty,a.category,a.thresholds,a.refs,a.createdAt,a.dueDate,a.instructions]);for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
  function normalizeSession(v,assignment){
    object(v,'Otvoreni rad');if(v.completed!==false)fail('Otvoreni rad je već završen.');
    if(JSON.stringify(v.refs)!==JSON.stringify(assignment.refs)||v.gradeLevel!==assignment.gradeLevel||v.subject!==assignment.subject||v.total!==assignment.count||JSON.stringify(v.thresholds)!==JSON.stringify(assignment.thresholds))fail('Otvoreni rad ne odgovara zaduženju.');
    const answers={},notes={};object(v.answers??{},'Odgovori');object(v.notes??{},'Bilješke');
    for(const [key,fields]of Object.entries(v.answers??{})){if(!/^(0|[1-9]\d*)$/.test(key)||+key>=assignment.count)fail('Nepoznat zadatak u odgovorima.');object(fields,'Odgovori zadatka');const task=E.resolve(assignment.refs[+key]);answers[key]={};for(const [field,value]of Object.entries(fields)){if(!task.fields.some(f=>f.key===field))fail('Nepoznato polje odgovora.');answers[key][field]=text(value,2048,'Odgovor');}}
    for(const [key,value]of Object.entries(v.notes??{})){if(!/^(0|[1-9]\d*)$/.test(key)||+key>=assignment.count)fail('Nepoznat zadatak u bilješkama.');notes[key]=text(value,6000,'Bilješka');}
    return{id:id(v.id,'Provjera'),profileName:text(v.profileName,120,'Učenik',false),subject:assignment.subject,gradeLevel:assignment.gradeLevel,total:assignment.count,seed:assignment.seed,difficulty:assignment.difficulty,category:assignment.category,thresholds:assignment.thresholds.slice(),refs:assignment.refs.map(r=>({...r})),answers,notes,startedAt:timestamp(v.startedAt,'Početak'),completed:false};
  }
  function normalizeState(v){
    if(v===undefined||v===null)return{schema:1,classes:[],assignments:[],submissions:[],reviews:[],activeSession:null};
    object(v,'Nastavnički modul');if(v.schema!==1)fail('Nepoznata verzija nastavničkog modula.');
    fits(v);
    const classes=unique(list(v.classes??[],LIMITS.classes,'Odjeljenja').map(normalizeClass),c=>c.id,'Odjeljenja');
    const assignments=unique(list(v.assignments??[],LIMITS.assignments,'Zaduženja').map(normalizeAssignment),a=>a.id,'Zaduženja');const assignmentIds=new Set(assignments.map(a=>a.id));
    const submissions=unique(list(v.submissions??[],LIMITS.submissions,'Predaje').map(s=>{object(s,'Predaja');const assignmentId=id(s.assignmentId,'Zaduženje');if(!assignmentIds.has(assignmentId))fail('Predaja nema pripadajuće zaduženje.');const out={assignmentId,examId:id(s.examId,'Provjera'),submittedAt:timestamp(s.submittedAt,'Predaja')};if(s.result!==undefined){const a=assignments.find(a=>a.id===assignmentId),result=verifiedResult(s.result,a);if(!result||result.id!==out.examId||result.finishedAt!==out.submittedAt||s.result.correct!==result.correct||typeof s.result.percentage!=='number'||Math.abs(s.result.percentage-result.percentage)>0.000001||s.result.gradeResult?.grade!==result.gradeResult.grade||s.result.gradeResult?.passed!==result.gradeResult.passed)fail('Sačuvani rezultat zaduženja ne odgovara odgovorima.');out.result=result;}return out;}),s=>s.examId,'Predaje');
    const reviews=unique(list(v.reviews??[],LIMITS.reviews,'Pregledi').map(r=>{object(r,'Pregled');const assignmentId=id(r.assignmentId,'Zaduženje');if(!assignmentIds.has(assignmentId))fail('Pregled nema pripadajuće zaduženje.');return{assignmentId,examId:id(r.examId,'Provjera'),profileId:id(r.profileId,'Profil'),comment:text(r.comment??'',6000,'Komentar'),manualGrade:r.manualGrade===null||r.manualGrade===undefined?null:integer(r.manualGrade,1,5,'Nastavnička ocjena'),reviewedAt:timestamp(r.reviewedAt,'Pregled')};}),r=>r.profileId+':'+r.examId,'Pregledi');
    let activeSession=null;if(v.activeSession!==undefined&&v.activeSession!==null){object(v.activeSession,'Aktivno zaduženje');const assignmentId=id(v.activeSession.assignmentId,'Zaduženje'),a=assignments.find(x=>x.id===assignmentId);if(!a)fail('Aktivno zaduženje nije pronađeno.');activeSession={assignmentId,session:normalizeSession(v.activeSession.session,a)};if(submissions.some(s=>s.examId===activeSession.session.id))fail('Otvoreni rad je već predan.');}
    return{schema:1,classes,assignments,submissions,reviews,activeSession};
  }
  function createClass(state,{name,gradeLevel}){if(state.classes.length>=LIMITS.classes)fail('Moguće je sačuvati do 100 odjeljenja.');const c=normalizeClass({id:makeId('class'),name,gradeLevel,roster:[]});fits({...state,classes:[...state.classes,c]});state.classes.push(c);return c;}
  function addStudent(state,classId,{name,profileId=null}){const c=state.classes.find(c=>c.id===classId);if(!c)fail('Odjeljenje nije pronađeno.');if(c.roster.length>=LIMITS.roster)fail('Odjeljenje može imati do 100 učenika.');const student={id:makeId('student'),name:text(name,60,'Ime učenika',false).trim(),profileId:profileId===null?null:id(profileId,'Profil')};if(profileId&&c.roster.some(s=>s.profileId===profileId))fail('Profil je već u odjeljenju.');c.roster.push(student);return student;}
  function lessons(subject,gradeLevel,category='all'){const rows=[];if(subject!=='informatics')rows.push(...P.topics.filter(t=>t.grade===gradeLevel).map(t=>({id:t.id,kind:'math',title:t.title,category:t.category})));if(subject!=='math')rows.push(...I.filter(t=>t.grade===gradeLevel).map(t=>({id:t.id,kind:'informatics',title:t.title,category:t.category})));return rows.filter(t=>category==='all'||t.category===category);}
  function createAssignment(state,options){
    if(state.assignments.length>=LIMITS.assignments)fail('Moguće je sačuvati do 500 zaduženja.');
    const c=state.classes.find(c=>c.id===options.classId);if(!c)fail('Odaberite odjeljenje.');
    const session=E.createSession({...options,gradeLevel:c.gradeLevel,profileName:options.teacherName||'Nastavnik'});
    if(options.lessonId){const lesson=lessons(session.subject,c.gradeLevel,options.category??'all').find(l=>l.id===options.lessonId);if(!lesson)fail('Odabrana lekcija nije pronađena.');if(lesson.kind==='informatics'&&session.total!==1)fail('Jedna informatička lekcija daje jedan praktični zadatak.');session.refs=Array.from({length:session.total},(_,i)=>lesson.kind==='math'?{kind:'math',topicId:lesson.id,seed:1+((session.seed*31+i)%200),difficulty:session.difficulty}:{kind:'informatics',lessonId:lesson.id});}
    const assignment=normalizeAssignment({...session,id:makeId('assignment'),classId:c.id,count:session.total,name:options.name,teacherName:options.teacherName??'',createdAt:new Date().toISOString(),dueDate:options.dueDate??'',instructions:options.instructions??''});fits({...state,assignments:[...state.assignments,assignment]});state.assignments.push(assignment);return assignment;
  }
  function exportAssignment(assignment){return{format:'ELDI-ASSIGNMENT-1',assignment:normalizeAssignment(assignment)};}
  function importAssignment(state,pack){object(pack,'Paket zaduženja');if(pack.format!=='ELDI-ASSIGNMENT-1')fail('Nepoznat format zaduženja.');const a=normalizeAssignment(pack.assignment),old=state.assignments.find(x=>x.id===a.id);if(old){if(fingerprint(old)!==fingerprint(a))fail('Zaduženje s istom oznakom ima drugačiji sadržaj.');return old;}if(state.assignments.length>=LIMITS.assignments)fail('Previše zaduženja.');fits({...state,assignments:[...state.assignments,a]});state.assignments.push(a);return a;}
  function distribute(assignment,profile){profile.teacherWork||=normalizeState();return importAssignment(profile.teacherWork,exportAssignment(assignment));}
  function startAssignment(state,assignmentId,profileName){const assignment=state.assignments.find(a=>a.id===assignmentId);if(!assignment)fail('Zaduženje nije pronađeno.');const base=E.createSession({subject:assignment.subject,gradeLevel:assignment.gradeLevel,count:1,seed:assignment.seed,difficulty:assignment.difficulty,profileName,thresholds:assignment.thresholds});const session={...base,total:assignment.count,category:assignment.category,refs:assignment.refs.map(r=>({...r}))};state.activeSession={assignmentId,session};return session;}
  function finishAssignment(state){const active=state.activeSession;if(!active)fail('Nema otvorenog zaduženja.');const a=state.assignments.find(a=>a.id===active.assignmentId);if(!a)fail('Zaduženje nije pronađeno.');const session=normalizeSession(active.session,a),result=E.finish(session);if(state.submissions.length>=LIMITS.submissions)fail('Previše predaja; izvezite i očistite staru evidenciju.');const submission={assignmentId:a.id,examId:result.id,submittedAt:result.finishedAt,result};fits({...state,submissions:[...state.submissions,submission],activeSession:null});state.submissions.push(submission);state.activeSession=null;return result;}
  function verifiedResult(exam,a){if(!exam||!exam.completed||exam.total!==a.count||exam.gradeLevel!==a.gradeLevel||exam.subject!==a.subject||JSON.stringify(exam.refs)!==JSON.stringify(a.refs)||JSON.stringify(exam.thresholds)!==JSON.stringify(a.thresholds))return null;try{const result=E.finish(normalizeSession({...exam,completed:false},a));return{...result,finishedAt:timestamp(exam.finishedAt,'Završetak')};}catch{return null;}}
  function report(state,profiles,classId=null){
    const assignments=state.assignments.filter(a=>!classId||a.classId===classId),classes=state.classes.filter(c=>!classId||c.id===classId),rows=[];
    for(const a of assignments){const c=classes.find(c=>c.id===a.classId),roster=c?.roster??[];for(const student of roster){const p=profiles.find(p=>p.id===student.profileId),work=p?.teacherWork,matching=work?.assignments?.find(x=>x.id===a.id);let found=false;
      if(matching&&fingerprint(matching)===fingerprint(a))for(const s of work.submissions??[]){if(s.assignmentId!==a.id)continue;const exam=s.result??p.exams?.find(e=>e.id===s.examId),result=verifiedResult(exam,a);if(!result||result.id!==s.examId)continue;const review=state.reviews.find(r=>r.examId===s.examId&&r.profileId===p.id);rows.push({className:c.name,studentName:student.name,profileId:p.id,assignmentId:a.id,assignmentName:a.name,examId:s.examId,correct:result.correct,total:result.total,percentage:result.percentage,grade:result.gradeResult.grade,manualGrade:review?.manualGrade??null,comment:review?.comment??'',status:isLate(a.dueDate,result.finishedAt)?'Predano nakon roka':'Predano',finishedAt:result.finishedAt,reviewedAt:review?.reviewedAt??'',result});found=true;}
      if(!found)rows.push({className:c.name,studentName:student.name,profileId:student.profileId,assignmentId:a.id,assignmentName:a.name,examId:null,correct:null,total:a.count,percentage:null,grade:null,manualGrade:null,comment:'',status:student.profileId?'Čeka predaju':'Profil nije povezan',finishedAt:'',reviewedAt:'',result:null});
    }}return rows;
  }
  function reviewSubmission(state,{assignmentId,examId,profileId,comment='',manualGrade=null}){if(!state.assignments.some(a=>a.id===assignmentId))fail('Zaduženje nije pronađeno.');const r={assignmentId:id(assignmentId,'Zaduženje'),examId:id(examId,'Provjera'),profileId:id(profileId,'Profil'),comment:text(comment,6000,'Komentar'),manualGrade:manualGrade===null?null:integer(manualGrade,1,5,'Nastavnička ocjena'),reviewedAt:new Date().toISOString()};const i=state.reviews.findIndex(x=>x.examId===examId&&x.profileId===profileId);if(i<0){if(state.reviews.length>=LIMITS.reviews)fail('Previše nastavničkih pregleda.');state.reviews.push(r);}else state.reviews[i]=r;return r;}
  function csvCell(v){let s=String(v??'');if(/^\s*[=+\-@]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function csvReport(rows){const header=['Odjeljenje','Učenik','Zaduženje','Status','Bodovi','Ukupno','Postotak','Automatska ocjena','Nastavnička ocjena','Predano','Pregledano','Komentar'];return '\uFEFF'+[header,...rows.map(r=>[r.className,r.studentName,r.assignmentName,r.status,r.correct,r.total,r.percentage===null?'':r.percentage.toFixed(1),r.grade,r.manualGrade,r.finishedAt,r.reviewedAt,r.comment])].map(row=>row.map(csvCell).join(';')).join('\r\n');}
  return{LIMITS,normalizeState,normalizeAssignment,createClass,addStudent,createAssignment,lessons,fingerprint,exportAssignment,importAssignment,distribute,startAssignment,finishAssignment,report,reviewSubmission,csvReport,csvCell,isLate,verifiedResult};
});
