'use strict';

async function runEditionSmoke({stage,capture,evaluate}){
  await stage('edition 11 notebook real steps and partial credit',`
    for(const name of ['EduMathNotebook','ELDIMathNotebook','ELDITeacherEngine','ELDITeacher','ELDILearningPlan','ELDILearningPaths'])ensure(window[name],'Nije učitan modul 11.0: '+name);
    go('notebook');ELDIMathNotebook.openTask(6,'linear',1);
    const task=EduMathNotebook.generateTask(6,'linear',1);ensure(task.source.replace(/\\s/g,'')==='2x+3=7','Izabrana provjera mora koristiti poznatu jednačinu.');
    fill($('mn-line-0'),'x=2');fill($('mn-line-1'),'');$('mn-check').click();
    ensure($('mn-result').innerText.includes('40'),'Sam konačni odgovor mora dobiti 40 bodova.');
    fill($('mn-line-0'),'2x=10');fill($('mn-line-1'),'x=2');$('mn-check').click();
    ensure($('mn-feedback-0').classList.contains('error'),'Pogrešan matematički korak mora biti označen.');
    ensure(EduMathNotebook.gradeSteps(task,state().mathNotebook.attempts[task.id].lines).score<100,'Pogrešan postupak ne smije dobiti sve bodove.');
    fill($('mn-line-0'),'2x=4');fill($('mn-line-1'),'x=2');fill($('mn-notes'),'Oduzimam 3 s obje strane i dijelim sa 2.');$('mn-check').click();
    const correct=EduMathNotebook.gradeSteps(task,state().mathNotebook.attempts[task.id].lines);
    ensure(correct.score===100&&correct.complete,'Tačan linearni postupak nije dobio 100 bodova.');
    ensure(ELDIMathNotebook.summary(state()).independent>=1,'Samostalan postupak nije zabilježen.');
    await ELDIStorage.flush();
  `);
  await capture('15-notebook');
  await stage('edition 11 geometric sketch and graph interaction',`
    $('mn-tab-geometry').click();ensure($('mn-svg').querySelector('.mn-shape'),'Geometrijska figura nije nacrtana.');
    $('mn-figure').value='graph';$('mn-figure').dispatchEvent(new Event('change',{bubbles:true}));
    const slope=document.querySelector('[data-mn-dimension="slope"]'),intercept=document.querySelector('[data-mn-dimension="intercept"]');
    fill(slope,'2');fill(intercept,'-1');
    ensure(state().mathNotebook.geometry.slope===2&&state().mathNotebook.geometry.intercept===-1,'Promjena grafikona nije sačuvana.');
    ensure($('mn-svg').querySelector('.mn-function'),'Graf linearne funkcije nije prikazan.');
    const svg=$('mn-svg'),point=svg.createSVGPoint();point.x=310;point.y=160;const client=point.matrixTransform(svg.getScreenCTM());
    svg.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:client.x,clientY:client.y,pointerId:1}));
    ensure(state().mathNotebook.geometry.points.some(p=>p.x===3&&p.y===2),'Klik na koordinatni sistem nije dodao tačku (3,2).');
    ensure($('mn-point-list').innerText.includes('(3; 2)'),'Koordinate dodane tačke nisu vidljive.');
    await ELDIStorage.flush();
  `);
  await capture('15b-notebook-graph');
  await stage('edition 11 teacher classes and assigned student work',`
    window.__editionOriginalActive=store.active;
    const makeProfile=name=>{$('new-profile').click();fill($('profile-name'),name);$('profile-create').click();return store.active;};
    window.__editionTeacherId=makeProfile('Nastavnik — provjera 11.0');
    window.__editionStudentId=makeProfile('=CSV učenik');
    const select=id=>{$('profile').value=id;$('profile').dispatchEvent(new Event('change',{bubbles:true}));};
    select(window.__editionTeacherId);go('teacher');
    fill($('teacher-class-name'),'VI-2 / provjera');$('teacher-class-grade').value='6';$('teacher-create-class').click();
    ensure(state().teacherWork.classes.length===1,'Odjeljenje nije kreirano kroz nastavničku formu.');
    $('teacher-student-profile').value=window.__editionStudentId;$('teacher-student-profile').dispatchEvent(new Event('change',{bubbles:true}));
    $('teacher-add-student').click();ensure(state().teacherWork.classes[0].roster[0].profileId===window.__editionStudentId,'Učenik nije povezan s profilom.');
    document.querySelector('[data-teacher-tab="assignments"]').click();fill($('teacher-assignment-name'),'Matematika — 10 zadataka');fill($('teacher-count'),'10');fill($('teacher-seed'),'19');fill($('teacher-instructions'),'Zapiši postupak uz svaki odgovor.');$('teacher-create-assignment').click();
    const assignment=state().teacherWork.assignments[0];ensure(assignment?.count===10,'Zaduženje od 10 zadataka nije napravljeno: '+$('teacher-notice').innerText);
    window.__editionAssignmentId=assignment.id;document.querySelector('[data-distribute-assignment]').click();
    const learner=store.profiles.find(p=>p.id===window.__editionStudentId);ensure(learner.teacherWork?.assignments[0]?.id===assignment.id,'Dodjela nije stigla u učenički profil.');
    select(window.__editionStudentId);go('teacher');document.querySelector('[data-teacher-tab="received"]').click();document.querySelector('[data-start-assignment]').click();
    const session=state().teacherWork.activeSession?.session;ensure(session?.total===10,'Učenik nije otvorio dodijeljeno zaduženje.');
    session.refs.map(ELDIExamEngine.resolve).forEach((task,i)=>task.fields.forEach(field=>fill(document.querySelector('[data-assignment-index="'+i+'"][data-assignment-key="'+field.key+'"]'),answer(field))));
    fill(document.querySelector('[data-assignment-notes="0"]'),'Čitam uslov, zapisujem podatke i provjeravam rezultat.');$('teacher-finish').click();
    const submission=state().teacherWork.submissions[0];ensure(submission?.result?.correct===10&&submission.result.gradeResult.grade===5,'Stvarni učenički odgovori nisu dobili 10/10 i ocjenu 5.');
    ensure(state().certificates.some(c=>c.examId===submission.examId),'Diploma nije sačuvana za dodijeljeno zaduženje.');
    const saved=ELDIProfiles.exportProfile(state());ensure(saved.profile.teacherWork.submissions[0].result.notes[0].includes('Čitam uslov'),'Validirani profil nije sačuvao postupak zaduženja.');
    select(window.__editionTeacherId);go('teacher');document.querySelector('[data-teacher-tab="results"]').click();
    ensure(document.querySelector('.teacher-report-table').innerText.includes('10/10'),'Nastavnik ne vidi stvarni rezultat učenika.');
    document.querySelector('[data-review-row]').click();fill($('teacher-review-comment'),'Pregledan postupak; dobar račun.');$('teacher-review-grade').value='4';$('teacher-save-review').click();
    const row=ELDITeacherEngine.report(state().teacherWork,store.profiles)[0];ensure(row.grade===5&&row.manualGrade===4&&row.comment==='Pregledan postupak; dobar račun.','Pregled nije sačuvao odvojene automatske i nastavničke ocjene.');
    const oldURL=URL.createObjectURL,oldClick=HTMLAnchorElement.prototype.click;let exported;
    URL.createObjectURL=blob=>{exported=blob;return oldURL.call(URL,blob);};HTMLAnchorElement.prototype.click=function(){};
    try{$('teacher-report-csv').click();ensure(exported instanceof Blob,'Dugme CSV nije pripremilo datoteku.');const csv=await exported.text();ensure(csv.includes(String.fromCharCode(34)+"'=CSV učenik"+String.fromCharCode(34)),'CSV nije zaštitio ime učenika od tumačenja kao formula.');ensure(csv.includes('Pregledan postupak; dobar račun.'),'CSV nije sačuvao komentar nastavnika.');}
    finally{URL.createObjectURL=oldURL;HTMLAnchorElement.prototype.click=oldClick;}
    await ELDIStorage.flush();
  `);
  await capture('16-teacher');
  await stage('edition 11 lesson learning loop and next recommendation',`
    $('profile').value=window.__editionOriginalActive;$('profile').dispatchEvent(new Event('change',{bubbles:true}));go('paths');
    const subject=$('lp-subject'),grade=$('lp-grade');subject.value='math';subject.dispatchEvent(new Event('change',{bubbles:true}));grade.value='6';grade.dispatchEvent(new Event('change',{bubbles:true}));
    ensure(document.querySelectorAll('[data-lp-unit]').length>0,'Put učenja nema cjeline za matematiku šestog razreda.');
    fill($('lp-search'),'nemoguća-pretraga-11');ensure(document.querySelectorAll('[data-lp-unit]').length===0,'Pretraga cjelina nije primijenjena.');fill($('lp-search'),'');
    const lesson=ELDILearningPlan.catalog.find(l=>l.subject==='math'&&l.grade===6);ensure(lesson,'Nedostaje matematička lekcija za provjeru.');
    ELDILearningPaths.open(lesson.id);$('lp-theory-done').click();ensure($('lp-example-done'),'Objašnjenje nije prešlo na riješen primjer.');$('lp-example-done').click();
    let work=ELDILearningPlan.lessonWork(state(),lesson.id),task=ELDILearningPlan.resolveTask(lesson.id,work.variant,work.difficulty);
    $('lp-check').click();ensure($('lp-try-again'),'Prazni odgovori nisu prikazali provjeru.');ensure(!work.lastCorrect,'Prazna lekcija nije smjela biti tačno riješena.');$('lp-try-again').click();
    task.fields.forEach((field,i)=>fill($('lp-answer-'+i),answer(field)));fill($('lp-notes'),'Samostalna vježba putem učenja — poznati podaci, račun, provjera.');$('lp-check').click();
    work=ELDILearningPlan.lessonWork(state(),lesson.id);ensure(work.theoryRead&&work.exampleRead&&work.lastCorrect&&!work.assisted,'Cijeli tok lekcije nije zabilježen kao samostalan rad.');
    $('lp-review-next').click();ensure($('lp-next-skill'),'Nije ponuđena sljedeća vještina poslije uspješne vježbe.');
    ensure(ELDILearningPlan.progress(state(),lesson.id).independent,'Samostalna lekcija nije uračunata u napredak.');
    const next=ELDILearningPlan.nextLesson(state(),lesson.id);$('lp-next-skill').click();ensure($('view').innerText.includes(next.title),'Preporuka nije otvorila sljedeću lekciju.');
    ELDILearningPaths.open(lesson.id,4);await ELDIStorage.flush();
  `);
  await capture('17-learningpaths');
  await stage('edition 11 native backup retains notebook teacher and learning state',`
    await ELDIFlushBackup();const backup=await eldiDesktop.backupSave(store,true);ensure(backup.saved&&backup.id,'Sigurnosna kopija cijele učionice nije sačuvana.');
    const list=await eldiDesktop.backupList();ensure(list.some(row=>row.id===backup.id),'Nova sigurnosna kopija nije u spisku.');
    const restored=await eldiDesktop.backupRead(backup.id);ensure(restored.active===window.__editionOriginalActive,'Kopija nije sačuvala odabrani profil.');
    const original=restored.profiles.find(p=>p.id===window.__editionOriginalActive),teacher=restored.profiles.find(p=>p.id===window.__editionTeacherId),student=restored.profiles.find(p=>p.id===window.__editionStudentId);
    ensure(original.mathNotebook.attempts['notebook-6-linear-1'].lines[0]==='2x=4','Kopija nije sačuvala tačan matematički korak.');
    ensure(original.mathNotebook.geometry.points.some(p=>p.x===3&&p.y===2),'Kopija nije sačuvala geometrijsku skicu.');
    ensure(Object.values(original.learningPathWork.lessons).some(row=>row.theoryRead&&row.exampleRead&&row.lastCorrect),'Kopija nije sačuvala cijeli tok lekcije.');
    ensure(teacher.teacherWork.reviews[0].comment==='Pregledan postupak; dobar račun.','Kopija nije sačuvala nastavnički komentar.');
    ensure(student.teacherWork.submissions[0].result.correct===10,'Kopija nije sačuvala učeničku predaju i ocjenu.');
    ensure((window.__eldiErrors||[]).length===0,'Greške proširenog izdanja: '+JSON.stringify(window.__eldiErrors));
    go('home');await ELDIStorage.flush();
  `);
  return{notebook:true,teacher:true,learningPaths:true,backup:true};
}

module.exports={runEditionSmoke};
