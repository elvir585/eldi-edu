'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../renderer/profile.js');
const E = require('../app/exam-engine.js');
const A = require('../renderer/awards.js');
const wrapped = profile => ({app:'ELDI EDU 10.2',schema:3,profile});
const answer = field => Array.isArray(field.answer) ? (field.answer.length ? field.answer.join('; ') : 'nema') : String(field.answer);
function completedExam() {
  const session = E.createSession({subject:'mixed',gradeLevel:7,count:10,profileName:'Učenik'});
  session.refs.forEach((ref,index) => { session.answers[index] = Object.fromEntries(E.resolve(ref).fields.map(field => [field.key, answer(field)])); });
  const result = E.finish(session);
  result.finishedAt = '2026-10-08T10:25:19+02:00';
  return result;
}

test('Legacy exports import without losing working, program drafts or Blockly projects', () => {
  const lessonId = require('../content/curriculum.json')[0].id;
  const old = {id:'old-id',name:'Učenik',results:{[lessonId]:{score:0.8,lastScore:0.4,attempts:2,date:'2026-10-08T08:25:00Z'}},drafts:{python:'print("Čajić")\n',cpp:'int main(){}'},blocks:{format:'ELDI-BLOCKS-1',workspace:{blocks:{languageVersion:0,blocks:[]}}},mathWork:{answers:{'natural-add-medium-1':{answer:'42'}},notes:{'natural-add-medium-1':'Moj postupak'},results:{'natural-add-medium-1':{correct:true,attempts:2,grade:5,date:'2026-10-08T08:25:00Z',title:'Zbir'}},session:[{topicId:'natural-add',seed:1,difficulty:'medium'}],sheets:[{name:'List',date:'2026-10-08T08:25:00Z',refs:[{topicId:'natural-add',seed:1,difficulty:'medium'}]}]},unknown:'drop'};
  const before = JSON.stringify(old), profile = P.importProfile({app:'ELDI EDU 10.0',schema:2,profile:old});
  assert.equal(profile.id,undefined); assert.equal(profile.unknown,undefined);
  assert.deepEqual(profile.mathWork,old.mathWork); assert.deepEqual(profile.blocks,old.blocks); assert.deepEqual(profile.drafts,old.drafts);
  assert.deepEqual(profile.results,old.results); assert.equal(profile.results[lessonId].lastScore,0.4);
  assert.deepEqual(P.importProfile(P.exportProfile(profile)).results,old.results);
  assert.equal(JSON.stringify(old),before);
});

test('Current imports preserve long worksheets, free-response notes, exams and matching certificates', () => {
  const math = require('../app/practice-engine.js').topics[0], info = require('../content/informatics-junior.json')[0];
  const exam = completedExam(), profile = {name:'Učenik',results:{},drafts:{},mathWork:{answers:{},notes:{},results:{},session:Array.from({length:50},(_,index)=>({topicId:math.id,seed:index+1,difficulty:'hard'})),sheets:[]},courseAnswers:{[info.id]:{answer:'  jedan\n    dva'}},courseNotes:{[info.id]:'Samostalni zapis'},courseResults:{[info.id]:{correct:true,attempts:1,grade:info.grade}},infoWork:{results:{['activity-'+info.id]:{correct:true,attempts:1,grade:info.grade}}},exams:[exam]};
  A.recordExamCertificate(profile,exam);
  const imported = P.importProfile(wrapped(profile));
  assert.equal(imported.mathWork.session.length,50); assert.deepEqual(imported.courseAnswers,profile.courseAnswers);
  assert.deepEqual(imported.infoWork,profile.infoWork); assert.equal(imported.exams[0].finishedAt,exam.finishedAt);
  assert.equal(imported.exams[0].correct,10); assert.equal(imported.certificates[0].id,profile.certificates[0].id);
  assert.equal(P.exportProfile(imported).schema,3);
});

test('Unfinished session validation recomputes on a clone and preserves typed answers', () => {
  const session = E.createSession({subject:'informatics',gradeLevel:8,count:5,profileName:'Učenik'});
  session.answers[0]={answer:'Moj nepotpun odgovor'}; session.notes[0]='Sačuvana bilješka';
  const profile = {name:'Učenik',examSession:session};
  const original = JSON.stringify(profile), imported=P.importProfile(wrapped(profile));
  assert.equal(imported.examSession.completed,false); assert.deepEqual(imported.examSession.answers,session.answers);
  assert.equal(JSON.stringify(profile),original); assert.equal(session.completed,false);
  const corrupt = structuredClone(profile);corrupt.examSession.refs[1]={...corrupt.examSession.refs[0]};
  assert.throws(()=>P.importProfile(wrapped(corrupt))); assert.equal(corrupt.examSession.completed,false);
});

test('Modified grading, forged matching certificates and duplicated history fail import atomically', () => {
  const exam = completedExam(), profile = {name:'Učenik',exams:[exam]};A.recordExamCertificate(profile,exam);
  for(const patch of [{correct:0},{percentage:0},{gradeResult:{...exam.gradeResult,grade:1}},{gradeResult:{...exam.gradeResult,percentage:0}}]) {
    const corrupt=structuredClone(profile);Object.assign(corrupt.exams[0],patch);const original=JSON.stringify(corrupt);
    assert.throws(()=>P.importProfile(wrapped(corrupt)));assert.equal(JSON.stringify(corrupt),original);
  }
  const wrong=structuredClone(profile);wrong.certificates[0]=A.createRecord({...wrong.certificates[0],profileName:'Drugo ime'});
  assert.throws(()=>P.importProfile(wrapped(wrong)),/Potvrda/);
  assert.throws(()=>P.importProfile(wrapped({...profile,exams:[exam,exam]})),/više puta/);
});

test('Invalid worksheet references, oversized drafts and malformed data are rejected', () => {
  const base={name:'Učenik',mathWork:{answers:{},notes:{},results:{},session:[],sheets:[]}};
  for(const ref of [{topicId:'missing',seed:1,difficulty:'medium'},{topicId:'natural-add',seed:201,difficulty:'medium'},{topicId:'natural-add',seed:1,difficulty:'invalid'},{projectId:'missing'}]) {
    assert.throws(()=>P.importProfile(wrapped({...base,mathWork:{...base.mathWork,session:[ref]}})));
  }
  assert.throws(()=>P.importProfile(wrapped({...base,mathWork:{...base.mathWork,session:Array(51).fill({topicId:'natural-add',seed:1,difficulty:'medium'})}})));
  assert.throws(()=>P.importProfile(wrapped({name:'Učenik',drafts:{python:'x'.repeat(131073)}})));
  assert.throws(()=>P.importProfile(wrapped({name:'Učenik',drafts:{shell:'echo secret'}})));
  assert.throws(()=>P.importProfile(wrapped({name:'Učenik',blocks:{format:'wrong',workspace:{}}})));
  assert.throws(()=>P.importProfile(wrapped({name:'   '})));
  assert.throws(()=>P.importProfile({app:'other',schema:3,profile:{name:'Učenik'}}));
  assert.throws(()=>P.importProfile(wrapped({name:'Učenik',exams:Array(101).fill({})})));
  const lessonId = require('../content/curriculum.json')[0].id;
  for (const lastScore of [-0.1,1.1,NaN,'0.5']) assert.throws(()=>P.importProfile(wrapped({name:'Učenik',results:{[lessonId]:{score:0.8,lastScore,attempts:2}}})));
});

test('Record maps reject prototype keys and unknown records while unrelated fields are dropped', () => {
  const hostile=JSON.parse('{"name":"Učenik","courseNotes":{"__proto__":"bad"}}');
  assert.throws(()=>P.importProfile(wrapped(hostile)));
  assert.throws(()=>P.importProfile(wrapped({name:'Učenik',results:{missing:{score:1,attempts:1}}})));
  assert.throws(()=>P.importProfile(wrapped({name:'Učenik',mathWork:{results:{missing:{correct:true}},session:[],sheets:[]}})));
  const clean=P.importProfile(wrapped({name:'Učenik',unrelated:{secret:42}}));
  assert.equal(clean.unrelated,undefined); assert.deepEqual(clean.results,{}); assert.deepEqual(clean.drafts,{});
  assert.equal({}.bad,undefined);
});
