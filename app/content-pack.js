(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ELDIContentPacks = api;
})(typeof globalThis === 'undefined' ? this : globalThis, function () {
  'use strict';
  const MAX_PACK_BYTES = 30 * 1024 * 1024, MAX_BOOKS = 30, MAX_TASKS = 2000, MAX_CODE_BYTES = 128 * 1024;
  const FORBIDDEN = new Set(['__proto__', 'constructor', 'prototype']);
  const SOURCE_FILES = Object.freeze({'pztk-matematika': 'content/books/matematika-pztk.pdf', 'programiranje-elvir-cajic': 'content/books/programiranje.pdf'});
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  function fail(message) { throw new Error(message); }
  function object(value, label) { if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label}: očekuje se objekat.`); return value; }
  function bytes(value) { return typeof TextEncoder === 'function' ? new TextEncoder().encode(value).length : unescape(encodeURIComponent(value)).length; }
  function text(value, label, maximum = 100000, required = false) {
    if (typeof value !== 'string' || value.length > maximum || (required && !value.trim()) || value.includes('\0')) fail(`${label}: neispravan ili predug tekst.`);
    return value;
  }
  function id(value, label) { if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,159}$/.test(value) || FORBIDDEN.has(value)) fail(`${label}: neispravna oznaka.`); return value; }
  function integer(value, label, min = 0, max = 1000000) { if (!Number.isInteger(value) || value < min || value > max) fail(`${label}: neispravan broj.`); return value; }
  function boolean(value, label) { if (typeof value !== 'boolean') fail(`${label}: očekuje se da ili ne.`); return value; }
  function grade(value) { if (![0, 5, 6, 7, 8, 9].includes(value)) fail('Razred: od 5. do 9. ili 0 za dodatne izazove.'); return value; }
  function array(value, label, maximum = MAX_TASKS) { if (!Array.isArray(value) || value.length > maximum) fail(`${label}: neispravna ili preduga lista.`); return value; }
  function strings(value, label, maximum = 1000) { return array(typeof value === 'string' ? [value] : value, label, maximum).map(item => text(item, label)); }
  function pages(value, label) { return array(value, label, 10000).map(page => integer(page, label, 1, 10000)); }
  function safeRelativePath(value) {
    text(value, 'Putanja', 240, true);
    if (/[\\\x00-\x1f\x7f:*?"<>|]/.test(value) || value.startsWith('/') || value.endsWith('/') || value.split('/').some(part => !part || part === '.' || part === '..' || /[. ]$/.test(part) || /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(part))) fail('Putanja u paketu nije dozvoljena.');
    return value;
  }
  function data(value, label, depth = 0, budget = {nodes: 0}) {
    if (++budget.nodes > 30000 || depth > 20) fail(`${label}: podaci su preveliki ili preduboki.`);
    if (value === null || typeof value === 'boolean') return value;
    if (typeof value === 'number') { if (!Number.isFinite(value)) fail(`${label}: neispravan broj.`); return value; }
    if (typeof value === 'string') return text(value, label);
    if (Array.isArray(value)) return array(value, label, 10000).map(item => data(item, label, depth + 1, budget));
    object(value, label); const out = {};
    for (const [key, item] of Object.entries(value)) { if (FORBIDDEN.has(key) || key.length > 160) fail(`${label}: neispravan ključ.`); out[key] = data(item, label, depth + 1, budget); }
    return out;
  }
  function fields(input, out, keys, label, maximum = 100000) { for (const key of keys) if (own(input, key)) out[key] = text(input[key], `${label} (${key})`, maximum); }
  function numericValue(value, label) {
    if (typeof value === 'number') { if (!Number.isFinite(value)) fail(`${label}: očekuje se konačan broj.`); return value; }
    text(value, label, 2000, true);
    const normalized = value.trim().replace(/−/g, '-').replace(/,/g, '.').replace(/\s+/g, '');
    const fraction = /^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/.exec(normalized);
    const number = fraction ? Number(fraction[2]) === 0 ? NaN : Number(fraction[1]) / Number(fraction[2]) : /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized) ? Number(normalized) : NaN;
    if (!Number.isFinite(number)) fail(`${label}: neispravan broj ili razlomak.`);
    return value;
  }
  function answer(value) {
    object(value, 'Odgovor');
    if (!['number', 'fraction', 'tuple', 'set', 'manual', 'text'].includes(value.type)) fail('Nepoznat oblik odgovora.');
    const out = {type: value.type};
    if (own(value, 'value')) {
      if (value.type === 'number' || value.type === 'fraction') out.value = numericValue(value.value, 'Vrijednost odgovora');
      else if (value.type === 'tuple' || value.type === 'set') {
        out.value = array(value.value, 'Vrijednosti odgovora', 100).map(item => numericValue(item, 'Vrijednost odgovora'));
        if (value.type === 'tuple' && !out.value.length) fail('Uređeni odgovor mora imati bar jednu vrijednost.');
      } else if (value.type === 'text') out.value = text(value.value, 'Vrijednost odgovora', 6000, true);
      else out.value = data(value.value, 'Vrijednost odgovora');
    }
    if (value.type !== 'manual' && !own(out, 'value')) fail('Nedostaje očekivana vrijednost odgovora.');
    if (own(value, 'tolerance')) { if (typeof value.tolerance !== 'number' || !Number.isFinite(value.tolerance) || value.tolerance < 0 || value.tolerance > 1000000) fail('Neispravna tolerancija.'); out.tolerance = value.tolerance; }
    if (own(value, 'labels')) out.labels = strings(value.labels, 'Oznake odgovora', 100);
    if (own(value, 'accepted')) out.accepted = array(value.accepted, 'Prihvaćeni odgovori', 1000).map(item => data(item, 'Prihvaćeni odgovor'));
    if (own(value, 'orderSensitive')) out.orderSensitive = boolean(value.orderSensitive, 'Redoslijed odgovora');
    fields(value, out, ['unit'], 'Jedinica', 80);
    return out;
  }
  function solution(value, language) {
    if (typeof value === 'string') value = {code: value};
    object(value, 'Program'); const code = text(value.code, 'Programski kod', MAX_CODE_BYTES);
    if (bytes(code) > MAX_CODE_BYTES) fail('Programski kod smije imati do 128 KB.');
    const out = {code}; fields(value, out, ['language', 'status'], 'Program', 160);
    if (own(value, 'path')) out.path = safeRelativePath(value.path);
    if (own(value, 'sourcePages')) out.sourcePages = pages(value.sourcePages, 'Stranice programa');
    if (own(value, 'verification')) out.verification = data(value.verification, 'Provjera programa');
    return out;
  }
  function normalizeTask(value, options = {}) {
    object(value, 'Zadatak');
    const subject = value.subject || options.subject;
    if (!['math', 'informatics'].includes(subject)) fail('Predmet zadatka nije podržan.');
    const out = {id: id(value.id, 'Oznaka zadatka'), title: text(value.title, 'Naziv zadatka', 500, true), subject, grade: grade(value.grade === undefined ? 0 : value.grade), statement: text(value.statement, 'Tekst zadatka', 100000, true)};
    fields(value, out, ['topic', 'goal', 'input', 'output', 'limits', 'complexity', 'checks', 'subtasks', 'sourceAttribution', 'answerPrompt', 'answerDisplay', 'editorialNote'], 'Zadatak');
    for (const key of ['page', 'sourcePage', 'number', 'chapter']) if (own(value, key)) out[key] = integer(value[key], `Zadatak (${key})`, 1, 10000);
    if (own(value, 'taskNumber')) out.taskNumber = typeof value.taskNumber === 'number' ? integer(value.taskNumber, 'Broj zadatka', 1, 10000) : text(value.taskNumber, 'Broj zadatka', 160);
    if (own(value, 'chapterId')) out.chapterId = id(value.chapterId, 'Poglavlje zadatka');
    else if (own(out, 'chapter')) out.chapterId = 'chapter-' + out.chapter;
    if (own(value, 'archive')) out.archive = boolean(value.archive, 'Arhivski zadatak');
    if (own(value, 'pages')) out.pages = pages(value.pages, 'Stranice zadatka');
    for (const key of ['help', 'steps', 'solution', 'tags']) if (own(value, key)) out[key] = strings(value[key], `Zadatak (${key})`);
    if (own(value, 'notes')) out.notes = array(value.notes, 'Napomene', 1000).map(item => data(item, 'Napomena'));
    if (own(value, 'source')) out.source = data(value.source, 'Izvor zadatka');
    if (own(value, 'answer')) out.answer = answer(value.answer);
    if (own(value, 'examples')) out.examples = array(value.examples, 'Primjeri', 100).map(example => { object(example, 'Primjer'); const result = {input: text(example.input, 'Ulaz primjera'), output: text(example.output, 'Izlaz primjera')}; fields(example, result, ['explanation'], 'Primjer'); return result; });
    if (own(value, 'solutions')) {
      object(value.solutions, 'Rješenja'); out.solutions = {};
      for (const [language, program] of Object.entries(value.solutions)) { if (!['python', 'cpp', 'c', 'java'].includes(language)) fail('Nepodržan jezik rješenja.'); out.solutions[language] = solution(program, language); }
    }
    return out;
  }
  function chapter(value) {
    object(value, 'Poglavlje'); const out = {title: text(value.title, 'Naziv poglavlja', 500, true)};
    if (own(value, 'number')) out.number = integer(value.number, 'Broj poglavlja', 1, 10000);
    out.id = own(value, 'id') ? id(value.id, 'Oznaka poglavlja') : own(out, 'number') ? 'chapter-' + out.number : fail('Nedostaje oznaka poglavlja.');
    if (own(value, 'grade')) out.grade = value.grade === null ? null : grade(value.grade);
    for (const key of ['pageStart', 'pageEnd', 'pageFrom', 'pageTo']) if (own(value, key)) out[key] = integer(value[key], 'Stranica poglavlja', 1, 10000);
    fields(value, out, ['summary', 'kind'], 'Poglavlje');
    if (own(value, 'methods')) out.methods = strings(value.methods, 'Metode');
    return out;
  }
  function theory(value) {
    object(value, 'Teorija'); const out = {id: id(value.id, 'Oznaka teorije'), title: text(value.title, 'Naziv teorije', 500, true), body: text(value.body, 'Tekst teorije')};
    fields(value, out, ['note'], 'Teorija');
    if (own(value, 'chapterId')) out.chapterId = id(value.chapterId, 'Poglavlje teorije');
    for (const key of ['chapter', 'sourcePage']) if (own(value, key)) out[key] = integer(value[key], 'Stranica ili poglavlje teorije', 1, 10000);
    if (own(value, 'pages')) out.pages = pages(value.pages, 'Stranice teorije');
    if (own(value, 'codeExamples')) out.codeExamples = array(value.codeExamples, 'Primjeri koda', 1000).map(item => { object(item, 'Primjer koda'); const out = solution(item); fields(item, out, ['kind', 'label'], 'Primjer koda'); if (own(item, 'page')) out.page = integer(item.page, 'Stranica primjera', 1, 10000); if (own(item, 'runnable')) out.runnable = boolean(item.runnable, 'Potpuni program'); return out; });
    return out;
  }
  function normalizeBook(value, options = {}) {
    object(value, 'Zbirka'); const subject = value.subject;
    if (!['math', 'informatics'].includes(subject)) fail('Predmet zbirke nije podržan.');
    const out = {id: id(value.id, 'Oznaka zbirke'), title: text(value.title, 'Naziv zbirke', 500, true), subject, chapters: array(value.chapters || [], 'Poglavlja', 1000).map(chapter), tasks: array(value.tasks || [], 'Zadaci').map(task => normalizeTask(task, {subject}))};
    if (new Set(out.chapters.map(item => item.id)).size !== out.chapters.length) fail('Poglavlje je navedeno više puta.');
    if (new Set(out.tasks.map(item => item.id)).size !== out.tasks.length) fail('Zadatak je naveden više puta.');
    const chapters = new Set(out.chapters.map(item => item.id));
    for (const task of out.tasks) { if (task.subject !== subject) fail('Zadatak ima drugi predmet od zbirke.'); if (task.chapterId && !chapters.has(task.chapterId)) fail('Zadatak upućuje na nepoznato poglavlje.'); }
    fields(value, out, ['description', 'fullTitle', 'subtitle', 'author', 'publisher', 'uploadedFilename', 'uploadedFileName', 'sourceSha256'], 'Zbirka');
    for (const key of ['year', 'publicationYear', 'pageCount', 'sourcePages']) if (own(value, key)) out[key] = integer(value[key], `Zbirka (${key})`, 1, 10000);
    if (own(value, 'sourceFile')) { if (options.allowOfficialSource === false || !own(SOURCE_FILES, out.id) || value.sourceFile !== SOURCE_FILES[out.id]) fail('Izvorni PDF mora biti ugrađena zbirka.'); out.sourceFile = value.sourceFile; }
    if (own(value, 'notices')) out.notices = strings(value.notices, 'Napomene zbirke');
    if (own(value, 'editors')) out.editors = strings(value.editors, 'Urednici', 100);
    if (own(value, 'grades')) out.grades = array(value.grades, 'Razredi', 10).map(grade);
    if (own(value, 'pages')) out.pages = array(value.pages, 'Stranice zbirke', 10000).map(item => { object(item, 'Stranica'); const result = {page: integer(item.page, 'Broj stranice', 1, 10000), searchText: text(item.searchText || '', 'Tekst stranice')}; if (own(item, 'chapterId')) result.chapterId = item.chapterId === null ? null : id(item.chapterId, 'Poglavlje stranice'); if (own(item, 'grade')) result.grade = item.grade === null ? null : grade(item.grade); return result; });
    if (own(value, 'theory')) {
      out.theory = array(value.theory, 'Teorija', 2000).map(theory);
      if (new Set(out.theory.map(item => item.id)).size !== out.theory.length) fail('Teorijska lekcija navedena je više puta.');
      const taskIds = new Set(out.tasks.map(task => task.id));
      for (const item of out.theory) { if (taskIds.has(item.id)) fail('Zadatak i teorijska lekcija moraju imati različite oznake.'); if (item.chapterId && !chapters.has(item.chapterId)) fail('Teorijska lekcija upućuje na nepoznato poglavlje.'); }
    }
    for (const key of ['extractionNotes', 'verification']) if (own(value, key)) out[key] = data(value[key], `Zbirka (${key})`);
    return out;
  }
  function validatePack(value) {
    object(value, 'Paket'); if (value.format !== 'ELDI-LEARNING-PACK' || value.version !== 1) fail('Nepoznat format ili verzija zbirke.');
    const raw = JSON.stringify(value); if (bytes(raw) > MAX_PACK_BYTES) fail('Paket smije imati do 30 MB.');
    const out = {format: 'ELDI-LEARNING-PACK', version: 1, books: array(value.books, 'Zbirke', MAX_BOOKS).map(book => normalizeBook(book))};
    if (new Set(out.books.map(book => book.id)).size !== out.books.length) fail('Zbirka je navedena više puta.');
    const tasks = out.books.flatMap(book => book.tasks); if (tasks.length > MAX_TASKS) fail(`Paket može imati do ${MAX_TASKS} zadataka.`);
    if (new Set(tasks.map(task => task.id)).size !== tasks.length) fail('Oznaka zadatka ponovljena je u više zbirki.');
    const items = tasks.concat(out.books.flatMap(book => book.theory || []));
    if (new Set(items.map(item => item.id)).size !== items.length) fail('Oznaka lekcije ili zadatka ponovljena je u više zbirki.');
    return out;
  }
  return {MAX_PACK_BYTES, MAX_BOOKS, MAX_TASKS, MAX_CODE_BYTES, SOURCE_FILES, bytes, safeRelativePath, normalizeTask, normalizeBook, validatePack};
});
