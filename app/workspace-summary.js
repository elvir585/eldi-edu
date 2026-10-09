(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ELDIWorkspaceSummary=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 // A read-only view of existing profile data; no new profile schema or migrations.
 function summarize(profile={},catalog={}){
  const courses=Object.entries(profile.courseResults||{}),attempts=profile.programAssessment?.attempts||[];
  const completedPrograms=new Set(attempts.filter(a=>a.total>0&&a.passed===a.total).map(a=>a.taskId));
  const math=Object.values(profile.mathWork?.results||{}).filter(r=>r.correct).length;
  const blocks=new Set([...Object.entries(profile.blockResults||{}),...Object.entries(profile.blockLibrary?.results||{})].filter(([,r])=>r.correct).map(([id])=>id));
  const work=profile.teacherWork||{},owned=new Set((work.classes||[]).map(c=>c.id)),submitted=new Set((work.submissions||[]).map(s=>s.assignmentId));
  const pending=(work.assignments||[]).filter(a=>!owned.has(a.classId)&&!submitted.has(a.id)).map(a=>({id:a.id,title:a.name,grade:a.gradeLevel,dueDate:a.dueDate||''})).sort((a,b)=>(a.dueDate||'9999').localeCompare(b.dueDate||'9999'));
  const recent=[];
  for(const[id,r]of courses){if(!r.date)continue;recent.push({kind:'lesson',id,title:r.title||catalog.lessons?.find(l=>l.id===id)?.title||'Vještina',date:r.date,label:r.correct?'Riješena vještina':'Pokušaj vještine'});}
  for(const[id,r]of Object.entries(profile.learningPathWork?.lessons||{})){
   const lesson=catalog.lessons?.find(l=>l.id===id);if(!lesson||!r.updatedAt)continue;
   recent.push({kind:'lesson',id,title:lesson.title,date:r.updatedAt,label:r.lastCorrect?'Riješena vještina':'Rad na vještini'});
  }
  for(const[id,r]of Object.entries(profile.mathNotebook?.attempts||{})){
   const match=/^notebook-([5-9])-([A-Za-z]+)-(\d+)$/.exec(id);if(!match||!r.updatedAt)continue;
   const grade=+match[1],type=match[2],seed=+match[3];recent.push({kind:'notebook',id,grade,type,seed,title:'Matematička sveska · '+grade+'. razred',date:r.updatedAt,label:'Sačuvani postupak'});
  }
  for(const a of attempts){const t=catalog.programs?.find(t=>t.id===a.taskId);if(t)recent.push({kind:'program',id:a.taskId,title:t.title,date:a.date,label:a.passed+'/'+a.total+' testova'});}
  if(profile.scratchWork?.savedAt)recent.push({kind:'scratch',id:'scratch',title:profile.scratchWork.name||'Scratch projekat',date:profile.scratchWork.savedAt,label:'Sačuvan .sb3 rad'});
  const seen=new Set();const ordered=recent.filter(r=>Number.isFinite(Date.parse(r.date))).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)).filter(r=>{const key=r.kind+':'+r.id;if(seen.has(key))return false;seen.add(key);return true;}).slice(0,4);
  return{math,blocks:blocks.size,skills:courses.filter(([,r])=>r.correct).length,programs:completedPrograms.size,pending,recent:ordered};
 }
 return Object.freeze({summarize});
});
