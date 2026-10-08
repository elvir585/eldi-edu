'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../renderer/awards.js');
const sample = overrides => A.createRecord({profileName: 'Elvir Čajić', subject: 'math', gradeLevel: 7, total: 50, correct: 45, examId: 'exam-2026-one', date: '2026-10-08T08:25:00.000Z', ...overrides});

test('Grade boundaries use exact percentages and allow explicit ascending thresholds', () => {
  for (const [score, grade] of [[0,1],[49.9999,1],[50,2],[64.9999,2],[65,3],[79.9999,3],[80,4],[89.9999,4],[90,5],[100,5]]) {
    const result = A.gradeResult(score);
    assert.equal(result.grade, grade); assert.equal(result.passed, grade >= 2);
  }
  assert.equal(A.gradeResult(85, [40,60,75,85]).grade, 5);
  assert.equal(A.gradeResult(50, [60,70,80,90]).grade, 1);
  for (const score of [-1, 101, NaN, Infinity, '90', undefined]) assert.throws(() => A.gradeResult(score), /Rezultat/);
  for (const thresholds of [[50,65,80], [50,50,80,90], [0,65,80,90], [90,80,65,50], [50,65,80,101], [50,'65',80,90]]) assert.throws(() => A.gradeResult(90, thresholds), /Pragovi/);
});

test('Certificate results are derived from correct tasks and reject inconsistent scores', () => {
  const record = sample();
  assert.equal(record.percentage, 90); assert.equal(record.grade, 5); assert.equal(record.type, 'diploma');
  assert.deepEqual(record.authors, ['Dino Isanović','Elvir Čajić','Damir Bajrić','Jasmin Suljkanović']);
  assert.equal(sample({correct: 24}).type, 'participation');
  assert.equal(sample({correct: 25}).type, 'diploma');
  assert.equal(sample({correct: 44, thresholds: [50,65,80,85]}).grade, 5);
  assert.equal(sample({total: 3, correct: 2}).percentage, 200 / 3);
  assert.throws(() => sample({score: 100}), /Postotak/);
  assert.throws(() => sample({percentage: 0.9}), /Postotak/);
  for (const change of [{correct:51},{correct:-1},{total:0},{total:1.5},{gradeLevel:4},{gradeLevel:10},{subject:'fake'},{profileName:''},{examId:''},{date:'impossible'},{authors:[]}]) assert.throws(() => sample(change));
});

test('Record numbers are deterministic and forged result fields cannot be rendered', () => {
  const record = sample();
  assert.equal(sample().id, record.id); assert.notEqual(sample({examId:'other'}).id, record.id);
  assert.notEqual(sample({correct:44}).id, record.id);
  assert.deepEqual(A.validateRecord(record), record);
  for (const patch of [{percentage:100},{grade:4},{passed:false},{type:'participation'},{id:'fake'},{gradeLabel:'vrlo dobar'}]) assert.throws(() => A.renderCertificate({...record,...patch}));
});

test('Certificates use truthful application wording, all author labels, escaped input and application seal', () => {
  const hostile = '<img src=x onerror="alert(1)">';
  const record = sample({profileName: hostile, authors:[...A.AUTHORS, '<script>bad()</script>']});
  const html = A.renderCertificate(record);
  assert(html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;')); assert(!html.includes('<img src=x'));
  assert(html.includes('&lt;script&gt;bad()&lt;/script&gt;')); assert(!html.includes('<script>bad'));
  for (const name of A.AUTHORS) assert(html.includes(name));
  assert(html.includes('Potvrda rezultata u ELDI EDU aplikaciji'));
  assert(html.includes('štampana imena autora i pečat aplikacije'));
  assert(html.includes('Pečat aplikacije ELDI EDU'));
  assert(html.includes('45 / 50')); assert(html.includes('90%')); assert(html.includes('5 <small>(odličan)'));
  const participation = A.renderCertificate(sample({correct:24}));
  assert(participation.includes('POTVRDA UČEŠĆA')); assert(!participation.includes('>DIPLOMA<'));
});

test('Exam certificates are issued only for completed results and duplicate issue is stable', () => {
  const profile = {name:'Učenik'};
  const exam = {id:'one',subject:'informatics',gradeLevel:9,total:10,correct:7,percentage:70,completed:true,finishedAt:'2026-10-08T08:25:00Z',thresholds:[50,65,80,90]};
  assert.throws(() => A.recordExamCertificate(profile, {...exam, completed:false}), /završene/);
  const first = A.recordExamCertificate(profile,exam), second = A.recordExamCertificate(profile,exam);
  assert.deepEqual(first,second); assert.equal(profile.certificates.length,1); assert.equal(first.grade,3);
  assert.throws(() => A.recordExamCertificate(profile,{...exam,correct:9,percentage:90}), /drugačije/);
});

test('Badges depend on actual saved successes, never attempted tasks or fabricated certificates', () => {
  const badge = (profile,id) => A.badgeProgress(profile).find(item => item.id===id);
  assert(A.badgeProgress({}).every(item => !item.earned && item.current===0));
  const profile = {mathWork:{results:{failed:{correct:false},assisted:{correct:true,assisted:true}}},blockResults:{failed:{correct:false}},results:{'task-partial':{score:0.9},lesson:{score:1}},certificates:[sample()]};
  assert(badge(profile,'first-step').earned); assert(!badge(profile,'blocks-1').earned); assert(!badge(profile,'programming-1').earned); assert(!badge(profile,'exam-1').earned);
  for(let i=0;i<49;i++)profile.mathWork.results['m'+i]={correct:true,assisted:false};
  assert(badge(profile,'math-50').earned); assert(!badge(profile,'independent-50').earned);
  profile.mathWork.results.extra={correct:true}; assert(badge(profile,'independent-50').earned);
  for(let i=0;i<50;i++)profile.blockResults['b'+i]={correct:true};
  assert(badge(profile,'blocks-50').earned);
  profile.results['task-one']={score:1}; assert(badge(profile,'programming-1').earned);
  profile.infoWork={results:Object.fromEntries(Array.from({length:10},(_,i)=>['i'+i,{correct:true}]))};
  assert(badge(profile,'informatics-10').earned);
  profile.exams=[{id:'perfect',completed:true,total:50,correct:50},{id:'unfinished',completed:false,total:50,correct:50},{id:'perfect',completed:true,total:50,correct:50},{id:'invalid',completed:true,total:50,correct:500}];
  assert(badge(profile,'exam-1').earned); assert(badge(profile,'exam-50').earned); assert(badge(profile,'perfect-1').earned);
  assert.equal(badge(profile,'exam-1').current,1); assert.equal(badge(profile,'exam-50').current,50);
  assert(!badge(profile,'passed-5').earned);
});
