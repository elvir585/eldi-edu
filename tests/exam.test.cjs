'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../app/exam-engine.js');
const A = require('../renderer/awards.js');

const catalogs = () => ({
  math: require('../content/math-catalog.json'),
  info: require('../content/informatics-junior.json').concat(require('../content/informatics-senior.json'))
});
const fieldAnswer = field => Array.isArray(field.answer) ? (field.answer.length ? field.answer.join('; ') : 'nema') : String(field.answer);
const canonical = task => Object.fromEntries(task.fields.map(field => [field.key, fieldAnswer(field)]));
const identity = ref => ref.kind === 'math' ? `${ref.kind}:${ref.topicId}:${ref.seed}:${ref.difficulty}` : `${ref.kind}:${ref.lessonId}`;
function fill(session, count = session.total) {
  for (let index = 0; index < count; index++) session.answers[index] = canonical(E.resolve(session.refs[index]));
  return session;
}

test('Expanded catalogs expose 500 mathematics skills and 500 practical informatics lessons', () => {
  const {math, info} = catalogs();
  const maths = Array.isArray(math) ? math : math.topics;
  for (const rows of [maths, info]) {
    assert.equal(rows.length, 500); assert.equal(new Set(rows.map(row => row.id)).size, 500);
    assert.equal(new Set(rows.map(row => `${row.grade}:${row.title}`)).size, 500);
    for (const grade of [5,6,7,8,9]) assert.equal(rows.filter(row => row.grade === grade).length, 100);
  }
  for (const lesson of info) {
    assert(lesson.title.length >= 5, lesson.id);
    assert(lesson.category && lesson.activity?.fields?.length && lesson.activity?.steps?.length && lesson.activity?.prompt, lesson.id);
  }
});

test('All 500 mathematics skills produce usable practical tasks at every difficulty', () => {
  const P = require('../app/practice-engine.js');
  for (const topic of P.topics) for (const difficulty of ['easy','medium','hard']) for (const seed of [1,73,200]) {
    const task = P.generate(topic.id, seed, difficulty);
    assert(task.prompt && task.fields.length && task.steps.length && task.hint, `${topic.id}/${difficulty}/${seed}`);
    assert.equal(task.grade, topic.grade);
    assert.equal(new Set(task.fields.map(field=>field.key)).size, task.fields.length);
    assert(E.checkTask(task, canonical(task)).correct, `${topic.id}/${difficulty}/${seed}: canonical answer`);
    assert(!E.checkTask(task, {}).correct, `${topic.id}/${difficulty}/${seed}: empty response`);
  }
});

test('Every count from 1 through 50 works in each grade and subject with deterministic unique references', () => {
  for (const gradeLevel of [5,6,7,8,9]) for (const subject of ['math','informatics','mixed']) for (let count = 1; count <= 50; count++) {
    const options = {subject, gradeLevel, count, seed: 37, difficulty: 'medium', profileName: 'Učenik'};
    const first = E.createSession(options), second = E.createSession(options);
    assert.equal(first.total, count); assert.equal(first.refs.length, count);
    assert.deepEqual(first.refs, second.refs, `${subject}/${gradeLevel}/${count}`);
    assert.equal(new Set(first.refs.map(identity)).size, count);
    for (const ref of first.refs) {
      assert.equal(E.resolve(ref).grade, gradeLevel);
      if (subject === 'math') assert.equal(ref.kind, 'math');
      if (subject === 'informatics') assert.equal(ref.kind, 'informatics');
    }
    if (subject === 'mixed' && count >= 2) assert.equal(new Set(first.refs.map(ref => ref.kind)).size, 2);
  }
  const first = E.createSession({count:50,seed:1}), second = E.createSession({count:50,seed:2});
  assert.notDeepEqual(first.refs, second.refs);
  for (const count of E.counts) assert(count >= 1 && count <= 50);
});

test('Invalid exam options are rejected before creating an unusable session', () => {
  for (const options of [{subject:'other'},{gradeLevel:4},{gradeLevel:10},{gradeLevel:5.5},{count:0},{count:51},{count:5.5},{seed:0},{seed:10000},{difficulty:'impossible'},{category:'__MISSING__'},{thresholds:[50,40,80,90]}]) {
    assert.throws(() => E.createSession(options), JSON.stringify(options));
  }
});

test('Scoring counts whole tasks only and missing or partially correct answers receive no point', () => {
  const task = {fields:[{key:'first',answer:'1/2',type:'number'},{key:'second',answer:'3',type:'number'}]};
  assert(E.checkTask(task,{first:'0,5',second:'6/2'}).correct);
  assert(!E.checkTask(task,{first:'1/2'}).correct);
  assert(!E.checkTask(task,{first:'1/2',second:'2'}).correct);
  assert(!E.checkTask(task,{}).correct);
  assert(!E.checkTask(task,undefined).correct);
  assert.deepEqual(E.checkTask(task,{first:'1/2',second:'2'}).fields.map(field => field.correct),[true,false]);
});

test('Final results use actual complete answers at all default grade boundaries', () => {
  for (const [correct, expectedGrade] of [[0,1],[9,1],[10,2],[12,2],[13,3],[15,3],[16,4],[17,4],[18,5],[20,5]]) {
    const session = fill(E.createSession({subject:'math',gradeLevel:8,count:20,seed:19}), correct);
    const result = E.finish(session);
    assert.equal(result.correct, correct); assert.equal(result.percentage, correct * 5); assert.equal(result.gradeResult.grade, expectedGrade);
    assert.equal(result.details.filter(item=>item.correct).length,correct); assert.equal(result.details.length,20); assert(result.completed && result.finishedAt);
    const profile = {name:'Učenik',exams:[result]};
    const record = A.recordExamCertificate(profile,result);
    assert.equal(record.correct,correct); assert.equal(record.grade,expectedGrade); assert.equal(record.passed,expectedGrade>=2);
    assert.equal(record.type,expectedGrade>=2?'diploma':'participation');
  }
  const result = E.finish(fill(E.createSession({count:50,thresholds:[58,70,80,90]}),29));
  assert.equal(result.percentage,58); assert.equal(result.gradeResult.grade,2);
  assert.equal(A.recordExamCertificate({name:'Učenik'},result).grade,result.gradeResult.grade);
});

test('A session cannot be finished twice and invalid empty or mismatched sessions are rejected', () => {
  const session = fill(E.createSession({count:5}));
  const result = E.finish(session);
  assert.throws(() => E.finish(session), /završena/);
  assert.throws(() => E.finish(result), /završena/);
  assert.throws(() => E.finish({...E.createSession({count:5}),refs:[]}), /provjera|zadataka/i);
  assert.throws(() => E.finish({refs:[],total:0,answers:{},thresholds:[50,65,80,90]}));
});

test('Validation rejects duplicated tasks and missing identities without marking the session finished', () => {
  const duplicate = fill(E.createSession({count:5}));
  duplicate.refs[1] = {...duplicate.refs[0]};
  assert.throws(() => E.finish(duplicate)); assert.equal(duplicate.completed,false);
  for (const patch of [{id:''},{id:'x'.repeat(200)},{profileName:''},{profileName:'   '},{gradeLevel:10},{thresholds:[60,50,80,90]},{subject:'other'}]) {
    const session = Object.assign(fill(E.createSession({count:5})),patch);
    assert.throws(() => E.finish(session),JSON.stringify(patch)); assert.equal(session.completed,false);
  }
  const mismatch = fill(E.createSession({count:5}));
  mismatch.refs[0] = E.createSession({subject:'informatics',gradeLevel:5,count:1}).refs[0];
  assert.throws(() => E.finish(mismatch)); assert.equal(mismatch.completed,false);
});

test('Informatic free responses preserve meaningful spaces and ordered outputs rather than accepting permutations', () => {
  const output = {key:'output',type:'text',preserveWhitespace:true,answer:'  jedan\n    dva'};
  assert(E.checkField(output,'  jedan\r\n    dva\n').correct);
  assert(!E.checkField(output,'jedan\n    dva').correct);
  assert(!E.checkField(output,'  jedan    dva').correct);
  assert(!E.checkField(output,'  jedan\n  dva').correct);
  assert(!E.checkField(output,'').correct);
  const ordered = {key:'items',type:'list',ordered:true,answer:['1','2','3']};
  assert(E.checkField(ordered,'1; 2; 3').correct);
  assert(!E.checkField(ordered,'3; 2; 1').correct);
  const unordered = {...ordered,ordered:false};
  assert(E.checkField(unordered,'3; 2; 1').correct);
});

test('Every practical informatics lesson accepts its canonical solution and rejects empty and wrong answers', () => {
  const {info} = catalogs();
  for (const lesson of info) {
    const task = E.resolve({kind:'informatics',lessonId:lesson.id});
    assert(E.checkTask(task,canonical(task)).correct, `${lesson.id}: canonical solution`);
    assert(!E.checkTask(task,{}).correct, `${lesson.id}: empty response`);
    const wrong = Object.fromEntries(task.fields.map(field => [field.key,'__ELDI_WRONG_RESPONSE__']));
    assert(!E.checkTask(task,wrong).correct, `${lesson.id}: incorrect response`);
  }
});

test('Full informatics and mixed sessions produce validated certificates from real answers', () => {
  for (const subject of ['informatics','mixed']) for (const gradeLevel of [5,6,7,8,9]) {
    const result = E.finish(fill(E.createSession({subject,gradeLevel,count:50,seed:91})));
    assert.equal(result.correct,50); assert.equal(result.gradeResult.grade,5);
    const profile = {name:'Učenik',exams:[result]};
    const certificate = A.recordExamCertificate(profile,result);
    assert.equal(certificate.total,50); assert.equal(certificate.percentage,100);
    assert(A.badgeProgress(profile).find(badge=>badge.id==='perfect-1').earned);
    assert(A.renderCertificate(certificate).includes('50 / 50'));
  }
});
