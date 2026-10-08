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

test('Book profiles preserve custom sections, code indentation, notes, typed answers and manual completion separately', () => {
  const math = require('../content/book-math.json').tasks[0], program = require('../content/book-programming.json').tasks[0];
  const custom = {id:'moja-zbirka',title:'Moje programiranje',subject:'informatics',chapters:[{id:'moja-petlja',title:'Petlja'}],tasks:[{id:'moja-petlja-1',title:'Brojanje',subject:'informatics',grade:7,chapterId:'moja-petlja',statement:'Ispiši brojeve od 1 do n.',help:['Pročitaj n.'],solutions:{python:{code:'n = int(input())\nfor i in range(1, n + 1):\n    print(i)\n',status:'user-provided'}},examples:[{input:'2\n',output:'1\n2\n'}]}]};
  const profile = {name:'Elvir',bookWork:{customSections:[custom],notes:{[math.id]:'Moj postupak\nČetiri koraka.',[program.id]:'Provjeri granični slučaj.', 'moja-petlja-1':'Samostalni zadatak.'},answers:{[math.id]:{'0':'162'},'moja-petlja-1':{'0':'1\n2'}},results:{[math.id]:{correct:true,lastCorrect:true,attempts:2,date:'2026-10-08T10:25:00Z',assisted:false}},completed:{[math.id]:{date:'2026-10-08T10:25:00Z',assisted:false,verified:true},[program.id]:{date:'2026-10-08T10:26:00Z',assisted:true,verified:false}}}};
  const before=JSON.stringify(profile),exported=P.exportProfile(profile),imported=P.importProfile(exported);
  assert.deepEqual(imported.bookWork,profile.bookWork);assert.equal(JSON.stringify(profile),before);
  assert.equal(exported.schema,3);assert.equal(exported.app,'ELDI EDU 10.2');
  assert.equal(imported.bookWork.customSections[0].tasks[0].solutions.python.code,custom.tasks[0].solutions.python.code);
  assert.equal(imported.bookWork.completed[program.id].verified,false);assert.equal(imported.bookWork.completed[program.id].assisted,true);
});

test('Book imports reject unknown work, unsafe source files and oversized collections without changing the input', () => {
  const book=require('../content/book-math.json'),task=book.tasks[0],baseline={name:'Učenik',bookWork:{notes:{},answers:{},results:{},completed:{},customSections:[]}};
  for(const field of ['notes','answers','results','completed']) {
    const invalid=structuredClone(baseline);invalid.bookWork[field].missing=field==='notes'?'tekst':field==='answers'?{'0':'tekst'}:field==='completed'?{date:'2026-10-08T10:25:00Z',assisted:false,verified:false}:{correct:true,attempts:1};
    const before=JSON.stringify(invalid);assert.throws(()=>P.importProfile(wrapped(invalid)));assert.equal(JSON.stringify(invalid),before);
  }
  const long=structuredClone(baseline);long.bookWork.notes[task.id]='x'.repeat(20001);assert.throws(()=>P.importProfile(wrapped(long)));
  const invalidDate=structuredClone(baseline);invalidDate.bookWork.completed[task.id]={date:'not-a-date',assisted:false,verified:false};assert.throws(()=>P.importProfile(wrapped(invalidDate)));
  const source=structuredClone(baseline);source.bookWork.customSections=[book];assert.throws(()=>P.importProfile(wrapped(source)),/PDF/);
  const custom={id:'moja-zbirka',title:'Moja zbirka',subject:'math',chapters:[],tasks:[{id:'moj-1',title:'Saberi',subject:'math',grade:5,statement:'1+1',answer:{type:'number',value:2}}]};
  const duplicate=structuredClone(baseline);duplicate.bookWork.customSections=[custom,custom];assert.throws(()=>P.importProfile(wrapped(duplicate)),/više puta/);
  const oversized=structuredClone(baseline);oversized.bookWork.customSections=Array(31).fill(custom);assert.throws(()=>P.importProfile(wrapped(oversized)),/30/);
  const tooLong=structuredClone(baseline);tooLong.bookWork.answers[task.id]={'0':'x'.repeat(2001)};assert.throws(()=>P.importProfile(wrapped(tooLong)));
});

test('Theory notes from bundled and imported lessons survive backup without becoming task results', () => {
  const theory=require('../content/book-programming.json').theory[0];
  const own={id:'moja-teorija',title:'Moja teorija',subject:'informatics',chapters:[{id:'uvod',title:'Uvod'}],tasks:[],theory:[{id:'moja-lekcija',chapterId:'uvod',title:'Moja petlja',body:'Objašnjenje petlje.',codeExamples:[{language:'Python 3',code:'for i in range(3):\n    print(i)\n',runnable:true}]}]};
  const profile={name:'Učenik',bookWork:{notes:{[theory.id]:'Moja bilješka uz izvornu teoriju.', 'moja-lekcija':'Sačuvana vlastita lekcija.'},answers:{},results:{},completed:{},customSections:[own]}};
  const imported=P.importProfile(P.exportProfile(profile));
  assert.deepEqual(imported.bookWork.notes,profile.bookWork.notes);assert.deepEqual(imported.bookWork.customSections,[own]);
  const forged=structuredClone(profile);forged.bookWork.results[theory.id]={correct:true,attempts:1};assert.throws(()=>P.importProfile(wrapped(forged)),/nepoznat zadatak/);
  const duplicate=structuredClone(profile);duplicate.bookWork.customSections[0].theory.push(own.theory[0]);assert.throws(()=>P.importProfile(wrapped(duplicate)),/više puta/);
});

function ownBlockCatalog() {
  const source=structuredClone(require('../content/block-projects.json')),project=source.projects[0];
  const family=source.families.find(item=>item.id===project.familyId);
  project.id='own-block-project-1';project.familyId='own-block-family-1';family.id='own-block-family-1';
  source.projects=[project];source.families=[family];
  return require('../app/block-project-catalog.js').validateCatalog(source);
}
test('Block library backup retains custom projects, assisted and independent results, active input and workspace', () => {
  const builtin=require('../content/block-projects.json').projects[0],own=ownBlockCatalog();
  const result={correct:true,lastCorrect:true,attempts:3,assisted:false,independent:true,grade:7,date:'2026-10-08T12:23:00Z'};
  const profile={name:'Učenik',blocks:own.projects[0].solution,blockLibrary:{packs:[own],results:{[builtin.id]:{...result,assisted:true,independent:false},'own-block-project-1':result},selectedId:'own-block-project-1',input:'  12\n   7\n',selectedAssisted:false}};
  const before=JSON.stringify(profile),imported=P.importProfile(P.exportProfile(profile));
  assert.deepEqual(imported.blockLibrary,profile.blockLibrary);assert.deepEqual(imported.blocks,profile.blocks);
  assert.equal(JSON.stringify(profile),before);assert.equal(P.exportProfile(imported).schema,3);
  assert.equal(imported.blockLibrary.results[builtin.id].independent,false);
  assert.equal(imported.blockLibrary.results['own-block-project-1'].independent,true);
});
test('Block library imports reject colliding identities, unknown records, oversized input and inconsistent credit atomically', () => {
  const own=ownBlockCatalog(),base={name:'Učenik',blockLibrary:{packs:[own],results:{},selectedId:null,input:'',selectedAssisted:false}};
  for(const patch of [{selectedId:'missing'},{results:{missing:{correct:false,attempts:1}}},{input:'x'.repeat(20001)},{selectedAssisted:'true'},{packs:[own,own]}]) {
    const invalid=structuredClone(base);Object.assign(invalid.blockLibrary,patch);const before=JSON.stringify(invalid);
    assert.throws(()=>P.importProfile(wrapped(invalid)));assert.equal(JSON.stringify(invalid),before);
  }
  for(const record of [{correct:true,attempts:0},{correct:false,attempts:1,independent:true},{correct:true,attempts:1,independent:'yes'}]) {
    const invalid=structuredClone(base);invalid.blockLibrary.results['own-block-project-1']=record;assert.throws(()=>P.importProfile(wrapped(invalid)));
  }
  const collision=structuredClone(base);collision.blockLibrary.packs[0].projects[0].id=require('../content/block-projects.json').projects[0].id;
  assert.throws(()=>P.importProfile(wrapped(collision)),/jedinstvenu/);
  const reserved=JSON.parse(JSON.stringify(base));reserved.blockLibrary.results=JSON.parse('{"__proto__":{"correct":true,"attempts":1}}');
  assert.throws(()=>P.importProfile(wrapped(reserved)));assert.equal({}.correct,undefined);
  const tooMany=structuredClone(base);tooMany.blockLibrary.packs=Array(31).fill(own);assert.throws(()=>P.importProfile(wrapped(tooMany)),/30/);
});
