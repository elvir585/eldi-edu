'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../app/learning-paths.js'),X=require('../app/exam-engine.js');
const answers=task=>Object.fromEntries(task.fields.map(f=>[f.key,Array.isArray(f.answer)?(f.answer.length?f.answer.join('; '):'nema'):String(f.answer)]));
const reviewed=o=>({...o,status:'reviewed',officialId:'LOCAL-REVIEW-A.1',source:'https://pztz.ba/Page.aspx?id1=62',schoolYear:'2026/2027',page:'Prilog 1, str. 7',reviewer:'Nastavnik za test',reviewedAt:'2026-10-08T12:00:00.000Z'});

test('Editorial sequence covers every existing skill exactly once, has valid acyclic prerequisites and no claimed official mappings',()=>{
  assert.equal(P.catalog.length,1000);assert.equal(P.units.length,91);const ids=P.units.flatMap(u=>u.lessonIds);assert.equal(ids.length,1000);assert.equal(new Set(ids).size,1000);
  for(const subject of ['math','informatics'])for(const grade of [5,6,7,8,9])assert.equal(P.units.filter(u=>u.subject===subject&&u.grade===grade).flatMap(u=>u.lessonIds).length,100);
  const visit=(unit,chain=new Set())=>{assert(!chain.has(unit.id),'cycle at '+unit.id);const next=new Set(chain).add(unit.id);for(const id of unit.prerequisites){const parent=P.getUnit(id);assert(parent,id);assert.equal(parent.subject,unit.subject);assert(parent.grade<=unit.grade);visit(parent,next);}};
  for(const unit of P.units)visit(unit);
  const p={};P.ensure(p);assert.equal(P.coverage(p).mappedSkills,1000);assert.equal(P.coverage(p).reviewedSkills,0);assert.equal(P.coverage(p).reviewedOutcomes,0);assert(P.metadata.source.url.startsWith('https://pztz.ba/'));assert(P.metadata.source.note.includes('2026/2027'));
});

test('Every lesson supplies a real worked example and a resolvable checked exercise at each math level',()=>{
  let count=0;for(const lesson of P.catalog){assert(lesson.body.length>=3,lesson.id);assert(lesson.example,lesson.id);for(const level of lesson.subject==='math'?['easy','medium','hard']:['medium']){const task=P.resolveTask(lesson.id,37,level);assert.equal(task.grade,lesson.grade);assert(task.prompt&&task.fields.length&&task.steps.length);assert(X.checkTask(task,answers(task)).correct,lesson.id);count++;}}
  assert.equal(count,2000);assert.throws(()=>P.resolveTask('missing'),/Nepoznata/);assert.throws(()=>P.resolveTask('m5-001',201),/Varijanta/);
});

test('Lesson loop persists attempts, final answers, independent progress and records shared collection results',()=>{
  const p={},row=P.lessonWork(p,'m6-057');row.theoryRead=true;row.exampleRead=true;row.notes='Prvo zajednički nazivnik.';
  let task=P.resolveTask('m6-057',row.variant,row.difficulty);const wrong=P.recordAttempt(p,'m6-057',{answer:'nije broj'},'2026-10-08T12:00:00.000Z');assert(!wrong.correct);assert(P.progress(p,'m6-057').failed);assert.equal(row.attempts,1);assert.equal(row.currentAttempts,1);
  assert(P.recordAttempt(p,'m6-057',answers(task),'2026-10-08T12:01:00.000Z').correct);assert(row.independentCorrect);assert.equal(row.completedAt,'2026-10-08T12:01:00.000Z');assert(P.progress(p,'m6-057').completed);assert.equal(p.courseNotes['m6-057'],row.notes);assert(p.mathWork.results[task.id].correct);assert.equal(p.courseResults['m6-057'].attempts,2);
  assert.deepEqual(P.normalizeWork(p.learningPathWork),p.learningPathWork);
  const info=P.resolveTask('i9-016');P.recordAttempt(p,'i9-016',answers(info),'2026-10-08T12:02:00.000Z');assert(p.infoWork.results[info.id].correct);
});

test('Aided success stays aided after an unaided wrong attempt, then becomes independent only after unaided success',()=>{
  const p={},row=P.lessonWork(p,'m5-025');row.assisted=true;const task=P.resolveTask('m5-025');P.recordAttempt(p,'m5-025',answers(task));assert(P.progress(p,'m5-025').correct);assert(!P.progress(p,'m5-025').independent);
  row.assisted=false;row.variant=2;P.recordAttempt(p,'m5-025',{answer:'incorrect'});assert(!P.progress(p,'m5-025').independent);assert(p.courseResults['m5-025'].assisted);
  P.recordAttempt(p,'m5-025',answers(P.resolveTask('m5-025',2)));assert(P.progress(p,'m5-025').independent);assert(!p.courseResults['m5-025'].assisted);
  row.assisted=true;P.recordAttempt(p,'m5-025',{answer:'incorrect'});assert(P.progress(p,'m5-025').independent);assert.equal(P.normalizeWork(p.learningPathWork).lessons['m5-025'].currentAttempts,4);
});

test('Daily recommendations use failures, assistance and prerequisite gaps, without mutating the profile',()=>{
  const p={courseResults:{'m6-057':{correct:false,attempts:2,lastCorrect:false,assisted:false}}};const before=JSON.stringify(p),daily=P.dailyPlan(p,{subject:'math',grade:6,count:3});assert.equal(daily[0].lessonId,'m6-057');assert.match(daily[0].reason,/netačnog/);assert(daily.some(item=>item.grade===5));assert.equal(JSON.stringify(p),before);
  const assisted={courseResults:{'m5-001':{correct:true,attempts:1,assisted:true}}};assert.equal(P.dailyPlan(assisted,{subject:'math',grade:5,count:1})[0].lessonId,'m5-001');assert.match(P.dailyPlan(assisted,{count:1})[0].reason,/samostalno/);
  const solved={courseResults:Object.fromEntries(P.catalog.filter(l=>l.grade===5&&l.subject==='math').map(l=>[l.id,{correct:true,assisted:false,attempts:1}]))};assert.equal(P.dailyPlan(solved,{count:5}).length,5);assert(P.dailyPlan(solved,{count:5}).every(item=>/ponavljanje/.test(item.reason)));
  assert.equal(new Set(daily.map(item=>item.lessonId)).size,daily.length);assert.throws(()=>P.dailyPlan({}, {count:6}),/Dnevni/);
});

test('Curriculum edits track sourced user review and empty outcomes without granting official approval',()=>{
  const p={};const w=P.ensure(p),first=w.outcomes[0];w.outcomes[0]=P.normalizeOutcome(reviewed(first));assert.equal(P.coverage(p,{subject:'math',grade:5}).reviewedSkills,first.lessonIds.length);
  const empty=P.normalizeOutcome({...first,id:'custom-gap',title:'Ishod koji još treba obraditi',lessonIds:[],status:'draft'});w.outcomes.push(empty);assert.equal(P.coverage(p).unmappedOutcomes,1);
  const exported=P.exportMapping(p);assert(exported.officialAlignment.includes('ne odobrenje'));assert.deepEqual(P.importMapping(JSON.stringify(exported)),w.outcomes);assert(P.normalizeWork(w).outcomes.length===92);
  assert.throws(()=>P.normalizeOutcome({...first,status:'reviewed'}),/Za pregledano/);assert.throws(()=>P.normalizeOutcome({...reviewed(first),schoolYear:'2026/2028'}),/uzastopne/);assert.throws(()=>P.normalizeOutcome({...first,source:'javascript:alert(1)'}),/http\/https/);assert.throws(()=>P.normalizeOutcome({...first,source:'https://name:secret@example.com/'}),/javna/);
  assert.throws(()=>P.normalizeOutcome({...first,lessonIds:['i5-001']}),/predmetu/);assert.throws(()=>P.normalizeOutcome({...first,lessonIds:['m6-001']}),/razredu/);assert.throws(()=>P.normalizeOutcome({...first,lessonIds:[first.lessonIds[0],first.lessonIds[0]]}),/dva puta/);
  assert.throws(()=>P.importMapping({app:'ELDI EDU curriculum map',version:1,outcomes:[first,first]}),/Ponovljena/);assert.throws(()=>P.importMapping('{bad'),/JSON/);
});

test('Imported learning state rejects invalid identity, fields, sizes and forged flags while keeping the input untouched',()=>{
  const p={};const row=P.lessonWork(p,'i5-001');row.answers={};row.notes='Rad učenika';const original=JSON.stringify(p.learningPathWork);P.normalizeWork(p.learningPathWork);assert.equal(JSON.stringify(p.learningPathWork),original);
  const bad=change=>{const work=JSON.parse(original);change(work);return work;};
  assert.throws(()=>P.normalizeWork(bad(w=>{w.lessons.missing={};})),/Nepoznata/);assert.throws(()=>P.normalizeWork(bad(w=>{w.lessons['i5-001'].answers={missing:'x'};})),/polje/);
  assert.throws(()=>P.normalizeWork(bad(w=>{w.lessons['i5-001'].independentCorrect=true;})),/Samostalan/);assert.throws(()=>P.normalizeWork(bad(w=>{w.lessons['i5-001'].currentAttempts=2;})),/veći/);assert.throws(()=>P.normalizeWork(bad(w=>{w.lessons['i5-001'].dirty='yes';})),/Izmijenjen/);
  assert.throws(()=>P.normalizeWork(bad(w=>{w.lessons['i5-001'].notes='x'.repeat(6001);})),/Postupak/);assert.throws(()=>P.normalizeWork(JSON.parse('{"version":1,"lessons":{"__proto__":{}}}')),/ključ/);assert.throws(()=>P.normalizeWork(bad(w=>{w.outcomes[0].id='constructor';})),/oznaka/);
  const empty={};assert.throws(()=>P.recordAttempt(empty,'m5-001',{},'not a date'),/datum/);assert.deepEqual(empty,{});
});
