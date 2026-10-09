'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {summarize}=require('../app/workspace-summary.js');
test('dashboard is empty for new profile, derives counts from results and never mutates data',()=>{
 const empty=summarize({});assert.deepEqual(empty,{math:0,blocks:0,skills:0,programs:0,pending:[],recent:[]});
 const profile={courseResults:{a:{correct:true},b:{correct:false}},mathWork:{results:{x:{correct:true}}},programAssessment:{attempts:[{taskId:'p',passed:8,total:8},{taskId:'p',passed:8,total:8},{taskId:'q',passed:4,total:8}]},blockResults:{same:{correct:true}},blockLibrary:{results:{same:{correct:true},other:{correct:true}}}};
 const before=JSON.stringify(profile),summary=summarize(profile);assert.equal(summary.skills,1);assert.equal(summary.math,1);assert.equal(summary.programs,1);assert.equal(summary.blocks,2);assert.equal(JSON.stringify(profile),before);
});
test('dashboard excludes teacher-owned and submitted work and orders received work by due date',()=>{
 const profile={teacherWork:{classes:[{id:'own'}],assignments:[{id:'a',classId:'own',name:'Own'},{id:'b',classId:'other',name:'Submitted'},{id:'c',classId:'other',name:'No due date'},{id:'d',classId:'other',name:'Due',dueDate:'2026-10-10'}],submissions:[{assignmentId:'b'}]}};
 assert.deepEqual(summarize(profile).pending.map(a=>a.id),['d','c']);
});
test('recent work uses latest real records, deduplicates tasks and ignores invalid timestamps',()=>{
 const profile={courseResults:{invalid:{date:'bad',title:'Invalid'}},mathNotebook:{attempts:{'notebook-6-linear-1':{updatedAt:'2026-10-09T10:00:00Z'}}},scratchWork:{name:'Moj rad',savedAt:'2026-10-09T11:00:00Z'},programAssessment:{attempts:[{taskId:'p',passed:1,total:8,date:'2026-10-09T09:00:00Z'},{taskId:'p',passed:8,total:8,date:'2026-10-09T12:00:00Z'}]}};
 const r=summarize(profile,{programs:[{id:'p',title:'Zbir'}]}).recent;assert.deepEqual(r.map(a=>a.kind),['program','scratch','notebook']);assert.equal(r[0].label,'8/8 testova');assert.deepEqual([r[2].grade,r[2].type,r[2].seed],[6,'linear',1]);
});

test('unfinished learning work is resumable and takes precedence over an older result',()=>{
 const profile={courseResults:{skill:{date:'2026-10-08T10:00:00Z',correct:true}},learningPathWork:{lessons:{skill:{updatedAt:'2026-10-09T12:00:00Z',lastCorrect:false}}},mathNotebook:{attempts:{'notebook-7-complexFractions-2':{updatedAt:'2026-10-09T11:00:00Z'}}}};
 const r=summarize(profile,{lessons:[{id:'skill',title:'Razlomci'}]}).recent;assert.equal(r.length,2);assert.equal(r[0].title,'Razlomci');assert.equal(r[0].label,'Rad na vještini');assert.equal(r[1].type,'complexFractions');
});
