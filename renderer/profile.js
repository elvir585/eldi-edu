'use strict';
(function(root, factory) {
  const node = typeof module === 'object' && module.exports;
  const source = {
    math: () => node ? require('../app/practice-engine.js') : root.EduPractice,
    legacy: () => node ? require('../app/exercise-engine.js') : root.EduExercises,
    info: () => node ? require('../content/informatics-junior.json').concat(require('../content/informatics-senior.json')) : root.ELDI_INFORMATICS_CATALOG,
    curriculum: () => node ? require('../content/curriculum.json') : root.ELDI_CONTENT,
    tasks: () => node ? require('../content/tasks.json') : root.ELDI_TASKS,
    projects: () => node ? require('../content/math-projects.js') : root.ELDI_MATH_PROJECTS,
    blocks: () => {
      if (!node) return root.ELDI_BLOCK_CHALLENGES;
      const holder = {window: {}};
      require('node:vm').runInNewContext(require('node:fs').readFileSync(require('node:path').join(__dirname, '../content/block-challenges.js'), 'utf8'), holder, {timeout: 1000});
      return holder.window.ELDI_BLOCK_CHALLENGES;
    },
    exams: () => node ? require('../app/exam-engine.js') : root.ELDIExamEngine,
    awards: () => node ? require('./awards.js') : root.ELDIAwards,
    packs: () => node ? require('../app/content-pack.js') : root.ELDIContentPacks,
    books: () => node ? [require('../content/book-math.json'), require('../content/book-programming.json')] : (Array.isArray(root.ELDI_BOOKS) ? root.ELDI_BOOKS : root.ELDI_BOOKS?.books || []),
    blockCatalog: () => node ? require('../content/block-projects.json') : root.ELDI_BLOCK_PROJECTS,
    blockPacks: () => node ? require('../app/block-project-catalog.js') : root.ELDIBlockCatalog,
    notebook: () => node ? require('../app/math-notebook.js') : root.EduMathNotebook,
    teacher: () => node ? require('../app/teacher-engine.js') : root.ELDITeacherEngine,
    paths: () => node ? require('../app/learning-paths.js') : root.ELDILearningPlan,
    assessment: () => node ? require('../app/program-assessment.js') : root.ELDIProgramAssessmentEngine,
    lab: () => node ? require('../app/lab-engine.js') : root.ELDILabEngine,
    studio: () => node ? require('../app/studio-work.js') : root.ELDIStudioWork,
    scratch: () => node ? require('../app/scratch-projects.js') : root.ELDIScratchProjects
  };
  const api = factory(source);
  if (node) module.exports = api;
  if (root) root.ELDIProfiles = api;
})(typeof window === 'undefined' ? null : window, source => {
  const MAX_PROFILE_BYTES = 30 * 1024 * 1024;
  const RESERVED = new Set(['__proto__', 'constructor', 'prototype']);
  let cachedReferences;
  function fail(message) { throw new Error(message); }
  function object(value, label) { if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label}: očekuje se objekat.`); return value; }
  function integer(value, min, max, label) { if (!Number.isInteger(value) || value < min || value > max) fail(`${label}: neispravan broj.`); return value; }
  function string(value, limit, label, allowEmpty = true) { if (typeof value !== 'string' || value.length > limit || (!allowEmpty && !value.trim())) fail(`${label}: neispravan tekst.`); return value; }
  function date(value, label) { string(value, 80, label, false); if (!Number.isFinite(new Date(value).getTime())) fail(`${label}: neispravan datum.`); return value; }
  function boolean(value, label) { if (typeof value !== 'boolean') fail(`${label}: očekuje se da ili ne.`); return value; }
  function entries(value, label, maximum = 100000) {
    object(value, label); const rows = Object.entries(value);
    if (rows.length > maximum) fail(`${label}: previše zapisa.`);
    for (const [key] of rows) if (!key || key.length > 240 || RESERVED.has(key)) fail(`${label}: neispravan ključ.`);
    return rows;
  }
  function references() {
    if (cachedReferences) return cachedReferences;
    const math = source.math(), legacy = source.legacy(), info = source.info();
    if (!math?.topics || !legacy?.topics || !Array.isArray(info)) fail('Nedostaje katalog za provjeru profila.');
    const mathTopics = new Set([...math.topics, ...legacy.topics].map(topic => topic.id));
    const projects = new Map((source.projects() || []).map(task => [task.id, task]));
    const courses = new Set([...math.topics, ...info].map(lesson => lesson.id));
    const infoTasks = new Set(info.map(lesson => 'activity-' + lesson.id));
    const quizIds = new Set([...(source.curriculum() || []).map(lesson => lesson.id), ...(source.tasks() || []).map(task => 'task-' + task.id)]);
    const blockIds = new Set((source.blocks() || []).map(challenge => challenge.id));
    const bookTasks = new Set((source.books() || []).flatMap(book => (book.tasks || []).map(task => task.id)));
    const bookTheory = new Set((source.books() || []).flatMap(book => (book.theory || []).map(item => item.id)));
    cachedReferences = {mathTopics, projects, courses, infoTasks, quizIds, blockIds, bookTasks, bookTheory};
    return cachedReferences;
  }
  function isMathTask(id, refs) {
    if (refs.projects.has(id)) return true;
    const match = /^(.+)-(easy|medium|hard)-(\d+)$/.exec(id);
    return !!match && refs.mathTopics.has(match[1]) && +match[3] >= 1 && +match[3] <= 200;
  }
  function simpleResult(value, label) {
    object(value, label);
    const out = {correct: value.correct === undefined ? false : boolean(value.correct, label), attempts: value.attempts === undefined ? 0 : integer(value.attempts, 0, 1000000000, label)};
    if (value.lastCorrect !== undefined) out.lastCorrect = boolean(value.lastCorrect, label);
    if (value.assisted !== undefined) out.assisted = boolean(value.assisted, label);
    if (value.grade !== undefined) out.grade = integer(value.grade, 5, 9, label);
    if (value.title !== undefined) out.title = string(value.title, 300, label);
    if (value.date !== undefined) out.date = date(value.date, label);
    return out;
  }
  function resultMap(value, label, known) {
    const out = {};
    for (const [key, result] of entries(value === undefined ? {} : value, label)) { if (!known(key)) fail(`${label}: nepoznat zadatak ${key}.`); out[key] = simpleResult(result, label); }
    return out;
  }
  function textMap(value, label, known, limit = 6000) {
    const out = {};
    for (const [key, text] of entries(value === undefined ? {} : value, label)) { if (!known(key)) fail(`${label}: nepoznat zadatak.`); out[key] = string(text, limit, label); }
    return out;
  }
  function answerMap(value, label, known, maximumLength = 2048) {
    const out = {};
    for (const [key, answers] of entries(value === undefined ? {} : value, label)) {
      if (!known(key)) fail(`${label}: nepoznat zadatak.`);
      out[key] = {};
      for (const [field, answer] of entries(answers, label, 100)) out[key][field] = string(answer, maximumLength, label);
    }
    return out;
  }
  function mathRef(value, refs) {
    object(value, 'Zadatak u radnom listu');
    if (value.projectId !== undefined) {
      if (!refs.projects.has(value.projectId)) fail('Nepoznat problemski zadatak.');
      return {projectId: value.projectId};
    }
    if (!refs.mathTopics.has(value.topicId)) fail('Nepoznata matematička oblast.');
    integer(value.seed, 1, 200, 'Varijanta zadatka');
    if (!['easy', 'medium', 'hard'].includes(value.difficulty)) fail('Neispravan nivo zadatka.');
    return {topicId: value.topicId, seed: value.seed, difficulty: value.difficulty};
  }
  function mathRefs(value, refs) {
    if (!Array.isArray(value) || value.length > 50) fail('Radni list može imati do 50 zadataka.');
    return value.map(ref => mathRef(ref, refs));
  }
  function mathWork(value, refs) {
    object(value, 'Zbirka');
    const known = id => isMathTask(id, refs);
    const out = {answers: answerMap(value.answers, 'Odgovori zbirke', known, 512), notes: textMap(value.notes, 'Bilješke zbirke', known), results: resultMap(value.results, 'Rezultati zbirke', known), session: mathRefs(value.session === undefined ? [] : value.session, refs), sheets: []};
    if (value.sheets !== undefined && (!Array.isArray(value.sheets) || value.sheets.length > 30)) fail('Moguće je uvesti do 30 radnih listova.');
    out.sheets = (value.sheets || []).map(sheet => {
      object(sheet, 'Radni list');
      return {name: string(sheet.name, 160, 'Naziv lista', false), date: date(sheet.date, 'Datum lista'), refs: mathRefs(sheet.refs, refs)};
    });
    return out;
  }
  function bookWork(value, refs) {
    object(value, 'Rad u knjigama');
    const packs = source.packs();
    if (!packs?.normalizeBook || !packs?.normalizeTask) fail('Nedostaje provjera uvezenih zbirki.');
    const raw = JSON.stringify(value);
    if (packs.bytes(raw) > MAX_PROFILE_BYTES) fail('Rad u knjigama smije imati do 30 MB.');
    if (value.customSections !== undefined && (!Array.isArray(value.customSections) || value.customSections.length > packs.MAX_BOOKS)) fail('Moguće je sačuvati do 30 dodatnih zbirki.');
    const customSections = (value.customSections || []).map(book => packs.normalizeBook(book, {allowOfficialSource: false}));
    if (new Set(customSections.map(book => book.id)).size !== customSections.length) fail('Dodatna zbirka navedena je više puta.');
    if (value.customTasks !== undefined && (!Array.isArray(value.customTasks) || value.customTasks.length > packs.MAX_TASKS)) fail('Previše dodatnih zadataka.');
    const customTasks = (value.customTasks || []).map(task => packs.normalizeTask(task));
    const allCustomTasks = customSections.flatMap(book => book.tasks).concat(customTasks);
    if (allCustomTasks.length > packs.MAX_TASKS) fail('Moguće je sačuvati do 2000 dodatnih zadataka.');
    const ids = new Set(allCustomTasks.map(task => task.id));
    if (ids.size !== allCustomTasks.length) fail('Dodatni zadatak naveden je više puta.');
    if (allCustomTasks.some(task => refs.bookTasks.has(task.id) || refs.bookTheory.has(task.id))) fail('Dodatni zadatak mora imati vlastitu oznaku.');
    const customTheory = customSections.flatMap(book => book.theory || []), theoryIds = new Set(customTheory.map(item => item.id));
    if (theoryIds.size !== customTheory.length || customTheory.some(item => ids.has(item.id) || refs.bookTasks.has(item.id) || refs.bookTheory.has(item.id))) fail('Dodatna lekcija mora imati jedinstvenu vlastitu oznaku.');
    const known = taskId => refs.bookTasks.has(taskId) || ids.has(taskId);
    const knownNote = itemId => known(itemId) || refs.bookTheory.has(itemId) || theoryIds.has(itemId);
    const out = {notes: textMap(value.notes, 'Bilješke knjiga', knownNote, 20000), answers: answerMap(value.answers, 'Odgovori knjiga', known, 2000), results: resultMap(value.results, 'Rezultati knjiga', known), completed: {}, customSections};
    if (value.customTasks !== undefined) out.customTasks = customTasks;
    for (const [taskId, record] of entries(value.completed || {}, 'Završeni zadaci knjiga', packs.MAX_TASKS + refs.bookTasks.size)) {
      if (!known(taskId)) fail('Nepoznat zadatak knjige.'); object(record, 'Završen zadatak knjige');
      out.completed[taskId] = {date: date(record.date, 'Datum završenog zadatka'), assisted: record.assisted === undefined ? false : boolean(record.assisted, 'Pomoć pri rješavanju'), verified: record.verified === undefined ? false : boolean(record.verified, 'Provjera završenog zadatka')};
    }
    return out;
  }
  function dataClone(value, label, depth = 0, budget = {nodes: 0}) {
    if (++budget.nodes > 100000 || depth > 80) fail(`${label}: projekat je prevelik ili predubok.`);
    if (value === null || typeof value === 'boolean') return value;
    if (typeof value === 'number') { if (!Number.isFinite(value)) fail(`${label}: neispravan broj.`); return value; }
    if (typeof value === 'string') return string(value, 131072, label);
    if (Array.isArray(value)) return value.map(item => dataClone(item, label, depth + 1, budget));
    object(value, label); const out = {};
    for (const [key, item] of entries(value, label)) out[key] = dataClone(item, label, depth + 1, budget);
    return out;
  }
  function blockLibrary(value) {
    object(value, 'Biblioteka blokovskih projekata');
    const api = source.blockPacks();
    if (!api?.validateCatalog) fail('Nedostaje provjera biblioteke blokovskih projekata.');
    const bytes = typeof TextEncoder === 'function' ? new TextEncoder().encode(JSON.stringify(value)).length : unescape(encodeURIComponent(JSON.stringify(value))).length;
    if (bytes > 20 * 1024 * 1024) fail('Biblioteka blokovskih projekata smije imati do 20 MB.');
    if (value.packs !== undefined && (!Array.isArray(value.packs) || value.packs.length > 30)) fail('Moguće je sačuvati do 30 dodatnih blokovskih paketa.');
    const packs = (value.packs || []).map(pack => api.validateCatalog(pack));
    const builtin = source.blockCatalog(), known = new Set((builtin?.projects || []).map(project => project.id));
    const familyIds = new Set((builtin?.families || []).map(family => family.id));
    for (const pack of packs) for (const family of pack.families) {
      if (familyIds.has(family.id)) fail('Porodica blokovskih projekata mora imati jedinstvenu vlastitu oznaku.');
      familyIds.add(family.id);
    }
    const custom = packs.flatMap(pack => pack.projects);
    if (custom.length > 1500) fail('Moguće je sačuvati do 1500 dodatnih blokovskih projekata.');
    for (const project of custom) { if (known.has(project.id)) fail('Blokovski projekat mora imati jedinstvenu vlastitu oznaku.'); known.add(project.id); }
    const results = {};
    for (const [id, result] of entries(value.results || {}, 'Rezultati biblioteke blokova', known.size)) {
      if (!known.has(id)) fail('Rezultati biblioteke blokova: nepoznat projekat.');
      results[id] = simpleResult(result, 'Rezultat blokovskog projekta');
      if (result.independent !== undefined) results[id].independent = boolean(result.independent, 'Samostalno rješenje blokovskog projekta');
      if ((results[id].independent || results[id].correct) && results[id].attempts < 1) fail('Riješen blokovski projekat mora imati barem jedan pokušaj.');
      if (results[id].independent && !results[id].correct) fail('Samostalno riješen blokovski projekat mora biti tačno riješen.');
    }
    const selectedId = value.selectedId ?? null;
    if (selectedId !== null && (!known.has(selectedId) || typeof selectedId !== 'string')) fail('Nepoznat odabrani blokovski projekat.');
    return {packs, results, selectedId, input: string(value.input ?? '', 20000, 'Ulaz blokovskog projekta'), selectedAssisted: value.selectedAssisted === undefined ? false : boolean(value.selectedAssisted, 'Pomoć u aktivnom blokovskom projektu')};
  }
  function exam(value, completed) {
    object(value, 'Provjera');
    if (value.completed !== completed) fail(completed ? 'Historija sadrži nezavršenu provjeru.' : 'Otvorena provjera je već završena.');
    const id = string(value.id, 160, 'Broj provjere', false), profileName = string(value.profileName, 120, 'Ime u provjeri', false);
    integer(value.total, 1, 50, 'Broj zadataka'); integer(value.gradeLevel, 5, 9, 'Razred'); integer(value.seed, 1, 9999, 'Broj provjere');
    if (!['math', 'informatics', 'mixed'].includes(value.subject) || !['easy', 'medium', 'hard'].includes(value.difficulty)) fail('Nepoznat predmet ili nivo provjere.');
    if (!Array.isArray(value.refs) || value.refs.length !== value.total) fail('Broj zadataka provjere nije usklađen.');
    const refs = value.refs.map(ref => {
      object(ref, 'Zadatak provjere');
      if (ref.kind === 'math') { const cleaned = mathRef(ref, references()); if (cleaned.projectId) fail('Problemski zadatak nije podržan u ovoj provjeri.'); return {kind: 'math', ...cleaned}; }
      if (ref.kind === 'informatics' && references().courses.has(ref.lessonId) && references().infoTasks.has('activity-' + ref.lessonId)) return {kind: 'informatics', lessonId: ref.lessonId};
      fail('Nepoznat zadatak provjere.');
    });
    const answers = answerMap(value.answers, 'Odgovori provjere', key => /^(0|[1-9]\d*)$/.test(key) && +key < value.total, 2048);
    const notes = textMap(value.notes, 'Bilješke provjere', key => /^(0|[1-9]\d*)$/.test(key) && +key < value.total);
    const thresholds = source.awards().gradeResult(0, value.thresholds).thresholds;
    const session = {id, profileName, subject: value.subject, gradeLevel: value.gradeLevel, total: value.total, seed: value.seed, difficulty: value.difficulty, category: string(value.category ?? 'all', 160, 'Oblast'), thresholds, refs, answers, notes, startedAt: date(value.startedAt, 'Početak provjere'), completed: false};
    // The engine checks references, grades, duplicates and answers on a new object.
    const recomputed = source.exams().finish({...session, refs: refs.map(ref => ({...ref})), answers: dataClone(answers, 'Odgovori provjere'), notes: {...notes}, completed: false});
    if (!completed) return session;
    if (value.correct !== recomputed.correct || typeof value.percentage !== 'number' || Math.abs(value.percentage - recomputed.percentage) > 0.000001 || !value.gradeResult || value.gradeResult.grade !== recomputed.gradeResult.grade || value.gradeResult.passed !== recomputed.gradeResult.passed || value.gradeResult.label !== recomputed.gradeResult.label) fail('Sačuvana ocjena ne odgovara stvarnim odgovorima provjere.');
    if (value.gradeResult.percentage !== undefined && (typeof value.gradeResult.percentage !== 'number' || Math.abs(value.gradeResult.percentage - recomputed.percentage) > 0.000001)) fail('Postotak ocjene nije usklađen.');
    if (value.gradeResult.thresholds !== undefined && JSON.stringify(value.gradeResult.thresholds) !== JSON.stringify(thresholds)) fail('Skala ocjenjivanja nije usklađena.');
    return {...recomputed, startedAt: session.startedAt, finishedAt: date(value.finishedAt, 'Završetak provjere')};
  }
  function validateProfile(value) {
    object(value, 'Profil'); const refs = references();
    const name = string(value.name ?? 'Uvezeni profil', 60, 'Ime profila', false).trim();
    const out = {name, results: {}, drafts: {}, blocks: null};
    for (const [key, result] of entries(value.results === undefined ? {} : value.results, 'Rezultati lekcija')) {
      if (!refs.quizIds.has(key)) fail('Nepoznata lekcija ili programerski zadatak.'); object(result, 'Rezultat lekcije');
      if (typeof result.score !== 'number' || !Number.isFinite(result.score) || result.score < 0 || result.score > 1) fail('Neispravan rezultat lekcije.');
      out.results[key] = {score: result.score, attempts: integer(result.attempts, 0, 1000000000, 'Broj pokušaja')};
      for (const scoreKey of ['bestScore', 'lastScore']) {
        if (result[scoreKey] !== undefined) {
          if (typeof result[scoreKey] !== 'number' || !Number.isFinite(result[scoreKey]) || result[scoreKey] < 0 || result[scoreKey] > 1) fail('Neispravan najbolji ili posljednji rezultat.');
          out.results[key][scoreKey] = result[scoreKey];
        }
      }
      if (result.date !== undefined) out.results[key].date = date(result.date, 'Datum rezultata');
    }
    for (const [language, code] of entries(value.drafts === undefined ? {} : value.drafts, 'Programski kod', 10)) {
      if (!['python', 'c', 'cpp', 'java'].includes(language)) fail('Nepoznat programski jezik u profilu.');
      out.drafts[language] = string(code, 131072, 'Programski kod');
    }
    if (value.blocks !== undefined && value.blocks !== null) {
      if (value.blocks.format !== 'ELDI-BLOCKS-1') fail('Nepoznat format blokovskog projekta.');
      object(value.blocks.workspace, 'Blokovski projekat');
      const workspace = dataClone(value.blocks.workspace, 'Blokovski projekat');
      if (JSON.stringify(workspace).length > 5 * 1024 * 1024) fail('Blokovski projekat je prevelik.');
      out.blocks = {format: 'ELDI-BLOCKS-1', workspace};
    }
    if (value.blockChallengeId !== undefined && value.blockChallengeId !== null) { if (!refs.blockIds.has(value.blockChallengeId)) fail('Nepoznat blokovski izazov.'); out.blockChallengeId = value.blockChallengeId; }
    out.blockResults = resultMap(value.blockResults, 'Blokovski rezultati', id => refs.blockIds.has(id));
    if (value.blockLibrary !== undefined) out.blockLibrary = blockLibrary(value.blockLibrary);
    if (value.mathWork !== undefined) out.mathWork = mathWork(value.mathWork, refs);
    if (value.bookWork !== undefined) out.bookWork = bookWork(value.bookWork, refs);
    out.courseAnswers = answerMap(value.courseAnswers, 'Odgovori nastavnih cjelina', id => refs.courses.has(id));
    out.courseNotes = textMap(value.courseNotes, 'Bilješke nastavnih cjelina', id => refs.courses.has(id));
    out.courseResults = resultMap(value.courseResults, 'Rezultati nastavnih cjelina', id => refs.courses.has(id) || refs.infoTasks.has(id));
    if (value.infoWork !== undefined) { object(value.infoWork, 'Informatika'); out.infoWork = {results: resultMap(value.infoWork.results, 'Praktični informatički rezultati', id => refs.infoTasks.has(id))}; }
    if (value.exams !== undefined && (!Array.isArray(value.exams) || value.exams.length > 100)) fail('Historija može imati do 100 provjera.');
    out.exams = (value.exams || []).map(item => exam(item, true));
    if (new Set(out.exams.map(item => item.id)).size !== out.exams.length) fail('Historija sadrži isti broj provjere više puta.');
    if (value.examSession !== undefined && value.examSession !== null) {
      out.examSession = exam(value.examSession, false);
      if (out.exams.some(item => item.id === out.examSession.id)) fail('Otvorena provjera je već u historiji.');
    }
    if (value.certificates !== undefined && (!Array.isArray(value.certificates) || value.certificates.length > 5000)) fail('Previše potvrda u profilu.');
    out.certificates = (value.certificates || []).map(record => source.awards().validateRecord(record));
    if (new Set(out.certificates.map(item => item.examId)).size !== out.certificates.length) fail('Ista provjera ima više potvrda.');
    for (const certificate of out.certificates) {
      const history = out.exams.find(item => item.id === certificate.examId);
      if (history) {
        const expected = source.awards().createRecord({profileName: history.profileName, subject: history.subject, gradeLevel: history.gradeLevel, total: history.total, correct: history.correct, percentage: history.percentage, thresholds: history.thresholds, examId: history.id, date: history.finishedAt});
        if (certificate.id !== expected.id) fail('Potvrda ne odgovara sačuvanoj provjeri.');
      }
    }
    if(value.mathNotebook!==undefined)out.mathNotebook=source.notebook().normalizeState(value.mathNotebook);
    if(value.teacherWork!==undefined)out.teacherWork=source.teacher().normalizeState(value.teacherWork);
    if(value.learningPathWork!==undefined)out.learningPathWork=source.paths().normalizeWork(value.learningPathWork);
    if(value.programAssessment!==undefined)out.programAssessment=source.assessment().normalizeState(value.programAssessment);
    if(value.labWork!==undefined)out.labWork=source.lab().normalize(value.labWork);
    if(value.studioWork!==undefined)out.studioWork=source.studio().normalize(value.studioWork);
    if(value.scratchWork!==undefined)out.scratchWork=source.scratch().normalizeState(value.scratchWork);
    return out;
  }
  function importProfile(wrapper) {
    object(wrapper, 'Datoteka profila');
    const legacy = ['ELDI EDU 10.0', 'ELDI EDU 10.1'].includes(wrapper.app) && wrapper.schema === 2;
    const current = ['ELDI EDU 10.2', 'ELDI EDU'].includes(wrapper.app) && wrapper.schema === 3;
    if (!legacy && !current) fail('Nepoznat format ili verzija profila.');
    const serialized = JSON.stringify(wrapper);
    const bytes = typeof TextEncoder === 'function' ? new TextEncoder().encode(serialized).length : unescape(encodeURIComponent(serialized)).length;
    if (bytes > MAX_PROFILE_BYTES) fail('Profil smije imati do 30 MB.');
    return validateProfile(wrapper.profile);
  }
  function exportProfile(profile) { return {app: 'ELDI EDU 10.2', schema: 3, profile: validateProfile(profile)}; }
  return {MAX_PROFILE_BYTES, importProfile, exportProfile, validateProfile};
});
