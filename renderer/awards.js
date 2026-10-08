'use strict';
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ELDIAwards = api;
})(typeof window === 'undefined' ? null : window, () => {
  const AUTHORS = Object.freeze(['Dino Isanović', 'Elvir Čajić', 'Damir Bajrić', 'Jasmin Suljkanović']);
  const DEFAULT_THRESHOLDS = Object.freeze([50, 65, 80, 90]);
  const SUBJECTS = Object.freeze({math: 'Matematika', informatics: 'Informatika', mixed: 'Matematika i informatika'});
  const LABELS = Object.freeze(['', 'nedovoljan', 'dovoljan', 'dobar', 'vrlo dobar', 'odličan']);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch]));
  let context = null, activeRecord = null;

  function validThresholds(thresholds = DEFAULT_THRESHOLDS) {
    if (!Array.isArray(thresholds) || thresholds.length !== 4 || thresholds.some((v, i) => typeof v !== 'number' || !Number.isFinite(v) || v <= 0 || v > 100 || (i > 0 && v <= thresholds[i - 1]))) {
      throw new Error('Pragovi ocjena moraju biti četiri rastuća broja između 0 i 100.');
    }
    return [...thresholds];
  }

  function gradeResult(percentage, thresholds = DEFAULT_THRESHOLDS) {
    if (typeof percentage !== 'number' || !Number.isFinite(percentage) || percentage < 0 || percentage > 100) throw new Error('Rezultat mora biti broj od 0 do 100 posto.');
    thresholds = validThresholds(thresholds);
    const grade = 1 + thresholds.filter(minimum => percentage >= minimum).length;
    return {grade, label: LABELS[grade], passed: grade >= 2, percentage, thresholds};
  }

  // Local record numbers identify saved results; they are not digital signatures.
  function hash(text, seed) {
    let h = seed >>> 0;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(16).padStart(8, '0').toUpperCase();
  }

  function createRecord(input) {
    if (!input || typeof input !== 'object') throw new Error('Nedostaju podaci rezultata.');
    const profileName = typeof input.profileName === 'string' ? input.profileName.trim() : '';
    if (!profileName || profileName.length > 120) throw new Error('Ime učenika mora sadržavati od 1 do 120 znakova.');
    if (!Object.hasOwn(SUBJECTS, input.subject)) throw new Error('Nepoznat predmet za potvrdu.');
    if (!Number.isInteger(input.gradeLevel) || input.gradeLevel < 5 || input.gradeLevel > 9) throw new Error('Razred mora biti od 5. do 9.');
    if (!Number.isInteger(input.total) || input.total < 1 || input.total > 1000 || !Number.isInteger(input.correct) || input.correct < 0 || input.correct > input.total) throw new Error('Broj tačnih zadataka mora biti između 0 i ukupnog broja zadataka.');
    const percentage = input.correct * 100 / input.total;
    for (const supplied of [input.score, input.percentage]) {
      if (supplied !== undefined && (typeof supplied !== 'number' || !Number.isFinite(supplied) || Math.abs(supplied - percentage) > 0.000001)) throw new Error('Postotak se mora podudarati s brojem tačnih i ukupnih zadataka.');
    }
    const thresholds = validThresholds(input.thresholds || input.gradeResult?.thresholds || DEFAULT_THRESHOLDS);
    const result = gradeResult(percentage, thresholds);
    const examId = typeof input.examId === 'string' ? input.examId.trim() : '';
    if (!examId || examId.length > 160) throw new Error('Potvrda mora biti povezana sa završenom provjerom.');
    const parsedDate = new Date(input.date === undefined ? Date.now() : input.date);
    if (!Number.isFinite(parsedDate.getTime())) throw new Error('Datum potvrde nije ispravan.');
    const date = parsedDate.toISOString();
    const authors = input.authors === undefined ? [...AUTHORS] : input.authors;
    if (!Array.isArray(authors) || !authors.length || authors.length > 8 || authors.some(name => typeof name !== 'string' || !name.trim() || name.length > 120)) throw new Error('Imena autora nisu ispravna.');
    const identity = JSON.stringify({examId, profileName, subject: input.subject, gradeLevel: input.gradeLevel, total: input.total, correct: input.correct, date, thresholds});
    const id = `ELDI-${parsedDate.getUTCFullYear()}-${hash(identity, 2166136261)}${hash(identity, 2246822519)}`;
    return {
      schema: 1, id, examId, profileName, subject: input.subject, subjectLabel: SUBJECTS[input.subject], gradeLevel: input.gradeLevel,
      total: input.total, correct: input.correct, percentage, grade: result.grade, gradeLabel: result.label,
      passed: result.passed, type: result.passed ? 'diploma' : 'participation', date, thresholds, authors: authors.map(name => name.trim()),
      issuedBy: 'ELDI EDU', description: 'Potvrda rezultata u ELDI EDU aplikaciji'
    };
  }

  function validateRecord(record) {
    if (!record || record.schema !== 1) throw new Error('Nepoznat format potvrde.');
    const actual = createRecord(record);
    if (record.id !== actual.id || record.grade !== actual.grade || record.passed !== actual.passed || record.type !== actual.type || record.gradeLabel !== actual.gradeLabel) throw new Error('Podaci potvrde nisu usklađeni s rezultatom.');
    return actual;
  }

  function recordExamCertificate(profile, exam) {
    if (!profile || !exam || exam.completed !== true) throw new Error('Potvrda se izdaje nakon završene provjere.');
    const record = createRecord({profileName: exam.profileName || profile.name, subject: exam.subject, gradeLevel: exam.gradeLevel, total: exam.total, correct: exam.correct, percentage: exam.percentage, examId: exam.id, date: exam.finishedAt || exam.date, thresholds: exam.thresholds || exam.gradeResult?.thresholds});
    profile.certificates ||= [];
    const index = profile.certificates.findIndex(item => item.examId === record.examId);
    if (index >= 0) {
      const old = validateRecord(profile.certificates[index]);
      if (old.id !== record.id) throw new Error('Završena provjera već ima drugačije sačuvan rezultat.');
      return old;
    }
    profile.certificates.unshift(record);
    return record;
  }

  function completedExams(profile) {
    const exams = Array.isArray(profile.exams) ? profile.exams : Object.values(profile.exams || {});
    const seen = new Set();
    return exams.filter(exam => {
      if (!exam || exam.completed !== true || typeof exam.id !== 'string' || seen.has(exam.id) || !Number.isInteger(exam.total) || exam.total < 1 || !Number.isInteger(exam.correct) || exam.correct < 0 || exam.correct > exam.total) return false;
      seen.add(exam.id); return true;
    });
  }

  function badgeProgress(profile = {}) {
    const mathematics = Object.values(profile.mathWork?.results || {}).filter(item => item?.correct === true);
    const notebook=typeof module==='object'&&module.exports?require('../app/math-notebook.js'):window.EduMathNotebook;
    for(const [id,work] of Object.entries(profile.mathNotebook?.attempts||{})){
      try{const match=/^notebook-([5-9])-([A-Za-z]+)-(\d+)$/.exec(id);if(match&&notebook?.gradeSteps(notebook.generateTask(Number(match[1]),match[2],Number(match[3])),work.lines).complete)mathematics.push({correct:true,assisted:work.assisted===true});}catch{}
    }
    const blocks = [...Object.values(profile.blockResults || {}), ...Object.values(profile.blockLibrary?.results || {})].filter(item => item?.correct === true);
    const programs = new Set(Object.entries(profile.results || {}).filter(([id, item]) => id.startsWith('task-') && item?.score === 1).map(([id])=>id));
    for(const attempt of profile.programAssessment?.attempts||[])if(attempt.total>0&&attempt.passed===attempt.total)programs.add('assessment-'+attempt.taskId);
    const informatics = Object.values(profile.infoWork?.results || {}).filter(item => item?.correct === true);
    const exams = completedExams(profile);
    const perfect = exams.filter(exam => exam.correct === exam.total).length;
    const passed = exams.filter(exam => {
      try { return gradeResult(exam.correct / exam.total * 100, exam.thresholds || exam.gradeResult?.thresholds || DEFAULT_THRESHOLDS).passed; }
      catch { return false; }
    }).length;
    const independent = mathematics.filter(item => item.assisted !== true).length;
    const facts = {math: mathematics.length, independent, blocks: blocks.length, programming: programs.size, informatics: informatics.length, exams: exams.length, perfect, passed, examTasks: exams.reduce((sum, exam) => sum + exam.correct, 0)};
    const definitions = [
      ['first-step', 'Prvi korak', 'Riješi svoj prvi matematički zadatak.', '∑', 'math', 1, 'math'],
      ['math-10', 'Deset rješenja', 'Riješi 10 različitih zadataka iz zbirke.', '10', 'math', 10, 'math'],
      ['math-50', 'Matematičar 50', 'Riješi 50 različitih matematičkih zadataka.', '50', 'math', 50, 'math'],
      ['math-100', 'Stotinu rješenja', 'Riješi 100 različitih matematičkih zadataka.', '100', 'math', 100, 'math'],
      ['independent-50', 'Samostalni istraživač', 'Riješi 50 zadataka bez prikazivanja postupka.', '✦', 'independent', 50, 'math'],
      ['blocks-1', 'Prvi algoritam', 'Uspješno riješi jedan blokovski izazov.', '▦', 'blocks', 1, 'blocks'],
      ['blocks-10', 'Graditelj algoritama', 'Uspješno riješi 10 različitih blokovskih izazova.', '⌘', 'blocks', 10, 'blocks'],
      ['blocks-50', 'Majstor blokova', 'Uspješno riješi 50 različitih blokovskih izazova.', '◆', 'blocks', 50, 'blocks'],
      ['programming-1', 'Prvi program', 'Napiši program koji prođe sve testove zadatka.', '</>', 'programming', 1, 'programming'],
      ['programming-10', 'Programer', 'Prođi sve testove u 10 različitih programerskih zadataka.', '{ }', 'programming', 10, 'programming'],
      ['informatics-10', 'Digitalni istraživač', 'Riješi 10 različitih zadataka iz informatike.', '01', 'informatics', 10, 'informatics'],
      ['informatics-50', 'Informatičar 50', 'Riješi 50 različitih zadataka iz informatike.', 'CPU', 'informatics', 50, 'informatics'],
      ['exam-1', 'Prva provjera', 'Završi jednu provjeru znanja.', '✓', 'exams', 1, 'exam'],
      ['exam-50', 'Pedeset u provjerama', 'Tačno riješi ukupno 50 zadataka u završenim provjerama.', '50', 'examTasks', 50, 'exam'],
      ['perfect-1', 'Pet od pet', 'Završi cijelu provjeru sa 100% tačnih zadataka.', '★', 'perfect', 1, 'exam'],
      ['passed-5', 'Kontinuitet znanja', 'Završi pet provjera s prolaznom ocjenom.', 'V', 'passed', 5, 'exam']
    ];
    return definitions.map(([id, title, description, symbol, key, target, category]) => {
      const current = facts[key];
      return {id, title, description, symbol, category, current, target, earned: current >= target, progress: Math.min(current / target, 1)};
    });
  }

  function scaleText(thresholds) {
    const [two, three, four, five] = thresholds;
    return `1: < ${two}% · 2: ${two}–<${three}% · 3: ${three}–<${four}% · 4: ${four}–<${five}% · 5: ≥ ${five}%`;
  }

  function sealSVG(passed) {
    return `<svg class="certificate-seal" viewBox="0 0 160 160" role="img" aria-label="Pečat aplikacije ELDI EDU"><path fill="#d3a646" d="M80 1 91 10 105 6 112 20 127 20 129 36 145 43 141 58 158 69 149 82 154 97 139 105 139 121 122 124 115 140 100 137 88 154 76 145 61 153 51 138 35 137 33 120 18 113 22 98 6 87 14 73 9 58 25 50 25 34 42 31 49 16 64 20Z"/><circle cx="80" cy="80" r="61" fill="#13263e" stroke="#fff5d9" stroke-width="2"/><circle cx="80" cy="80" r="52" fill="none" stroke="#d3a646" stroke-width="1" stroke-dasharray="2 3"/><text x="80" y="55" text-anchor="middle" fill="#fff5d9" font-size="14" font-family="Arial,sans-serif" font-weight="700">ELDI EDU</text><path d="m80 65 5 11 13 2-9 9 2 13-11-6-11 6 2-13-9-9 13-2Z" fill="#d3a646"/><text x="80" y="119" text-anchor="middle" fill="#fff5d9" font-size="9" font-family="Arial,sans-serif" letter-spacing="1">${passed ? 'ZNANJE · USPJEH' : 'RAD · NAPREDAK'}</text></svg>`;
  }

  function renderCertificate(record) {
    record = validateRecord(record);
    const percentage = new Intl.NumberFormat('bs-BA', {maximumFractionDigits: 2}).format(record.percentage);
    const date = new Intl.DateTimeFormat('bs-BA', {day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Sarajevo'}).format(new Date(record.date));
    return `<article class="certificate-sheet ${record.passed ? 'certificate-passed' : 'certificate-participation'}" aria-label="${record.passed ? 'Diploma' : 'Potvrda učešća'} za ${escape(record.profileName)}"><div class="certificate-border"><div class="certificate-topline"><div class="certificate-brand"><svg viewBox="0 0 60 48" aria-hidden="true"><path d="M3 18 30 4l27 14-27 14Z" fill="#d3a646"/><path d="M15 26v11c10 8 20 8 30 0V26l-15 8Z" fill="#13263e"/><path d="M54 20v19" stroke="#13263e" stroke-width="3"/><circle cx="54" cy="41" r="3" fill="#d3a646"/></svg><span>ELDI <strong>EDU</strong></span></div><span class="certificate-serial">EVIDENCIJSKI BROJ<br><strong>${escape(record.id)}</strong></span></div><div class="certificate-heading"><div class="certificate-kicker">UČENJE · VJEŠTINA · NAPREDAK</div><h1 class="certificate-title">${record.passed ? 'DIPLOMA' : 'POTVRDA UČEŠĆA'}</h1><p class="certificate-subtitle">${escape(record.description)}</p><div class="certificate-stars" aria-label="Ocjena ${record.grade} od 5">${'★'.repeat(record.grade)}<span>${'☆'.repeat(5 - record.grade)}</span></div></div><p class="certificate-intro">Dodjeljuje se učeniku / učenici</p><h2 class="certificate-recipient">${escape(record.profileName)}</h2><p class="certificate-description">za ${record.passed ? 'uspješno završenu' : 'završenu'} provjeru znanja iz predmeta <strong>${escape(record.subjectLabel)}</strong><br><strong>${record.gradeLevel}. razred</strong> · ${escape(date)}</p><div class="certificate-metrics"><div><span>Tačno riješeno</span><strong>${record.correct} / ${record.total}</strong><small>zadataka</small></div><div><span>Ostvareni rezultat</span><strong>${escape(percentage)}%</strong><small>tačnih zadataka</small></div><div class="certificate-result"><span>Ocjena u aplikaciji</span><strong>${record.grade} <small>(${escape(record.gradeLabel)})</small></strong><small>${record.passed ? 'Provjera uspješno završena' : 'Nastavi vježbati i pokušaj ponovo'}</small></div></div><div class="certificate-signing"><div class="certificate-signature-grid">${record.authors.map(name => `<div class="cert-signature"><div class="signature-name">${escape(name)}</div><div class="signature-rule"></div><span>Autor aplikacije</span></div>`).join('')}</div>${sealSVG(record.passed)}</div><footer class="certificate-footer"><span>Automatski izdaje ELDI EDU · štampana imena autora i pečat aplikacije</span><span>Pragovi ocjena: ${escape(scaleText(record.thresholds))}</span></footer></div></article>`;
  }

  const currentProfile = () => typeof context.profile === 'function' ? context.profile() : context.profile;
  function mount(options) {
    if (!options?.root || !options.profile) throw new Error('Nedostaje prikaz ili profil za priznanja.');
    context = options; activeRecord = null; collection();
  }

  function collection() {
    const profile = currentProfile(), badges = badgeProgress(profile), valid = [];
    let skipped = 0;
    for (const record of profile.certificates || []) { try { valid.push(validateRecord(record)); } catch { skipped++; } }
    valid.sort((a, b) => b.date.localeCompare(a.date));
    context.root.innerHTML = `<div class="eyebrow">REZULTATI / PRIZNANJA</div><h1>Tvoje znanje zaslužuje priznanje.</h1><p>Značke prate stvarno riješene zadatke, a završene provjere dobijaju ocjenu i potvrdu rezultata. Diploma se izdaje od ocjene 2, a za ocjenu 1 dobijaš potvrdu učešća.</p><div class="stats"><div class="stat"><strong>${badges.filter(badge => badge.earned).length} / ${badges.length}</strong><span>osvojenih znački</span></div><div class="stat"><strong>${valid.filter(record => record.passed).length}</strong><span>diploma</span></div><div class="stat"><strong>${valid.length}</strong><span>sačuvanih potvrda</span></div></div><h2>Kolekcija znački</h2><div class="badge-grid">${badges.map(badge => `<article class="achievement-badge ${badge.earned ? 'badge-earned' : 'badge-locked'}" data-badge-id="${badge.id}"><div class="badge-symbol" aria-hidden="true">${escape(badge.symbol)}</div><div><h3 class="badge-title">${escape(badge.title)}</h3><p class="badge-description">${escape(badge.description)}</p><div class="badge-state">${badge.earned ? '✓ OSVOJENO' : `${badge.current} / ${badge.target}`}</div><progress max="${badge.target}" value="${Math.min(badge.current, badge.target)}" aria-label="Napredak za ${escape(badge.title)}"></progress></div></article>`).join('')}</div><div class="awards-history"><h2>Diplome i potvrde</h2>${skipped ? '<p class="notice">Neispravne uvezene potvrde nisu prikazane. Izvornu evidenciju možeš ponovo izvesti iz napretka.</p>' : ''}${valid.length ? `<div class="grid">${valid.map((record, index) => `<article class="card award-card"><span class="tag">${record.passed ? 'DIPLOMA' : 'POTVRDA UČEŠĆA'}</span><h3>${escape(record.subjectLabel)} · ${record.gradeLevel}. razred</h3><p>${escape(record.profileName)} · ${record.correct}/${record.total} zadataka<br>Ocjena <strong>${record.grade} (${escape(record.gradeLabel)})</strong> · ${escape(new Date(record.date).toLocaleDateString('bs-BA'))}</p><button class="primary" data-certificate="${index}">Otvori priznanje</button></article>`).join('')}</div>` : '<div class="card"><h3>Prva diploma te čeka.</h3><p>Otvori provjeru znanja, izaberi predmet i broj zadataka te završi provjeru. Tvoja potvrda će se sačuvati ovdje.</p></div>'}</div>`;
    context.root.querySelectorAll('[data-certificate]').forEach(button => { button.onclick = () => preview(valid[Number(button.dataset.certificate)]); });
  }

  async function printCertificate(pdf) {
    if (!activeRecord) return;
    const body = context.root.ownerDocument.body;
    const filename = `ELDI-${activeRecord.type === 'diploma' ? 'diploma' : 'potvrda'}-${activeRecord.id}.pdf`;
    body.classList.add('printing-certificate');
    const status = context.root.querySelector('[data-certificate-status]');
    try {
      if (pdf && context.savePdf) {
        const result = await context.savePdf(filename);
        if (status) status.textContent = result?.cancelled ? 'Čuvanje je otkazano.' : 'PDF potvrda je sačuvana.';
      } else {
        await (context.print ? context.print() : context.root.ownerDocument.defaultView.print());
      }
    } catch (error) { if (status) status.textContent = error.message || 'Potvrda nije sačuvana.'; }
    finally { body.classList.remove('printing-certificate'); }
  }

  function preview(record) {
    if (!context) throw new Error('Prvo otvori prikaz priznanja.');
    activeRecord = validateRecord(record);
    context.root.innerHTML = `<div class="row certificate-actions"><button data-cert-back>← Sva priznanja</button><button class="primary" data-cert-print>Štampaj diplomu / potvrdu</button>${context.savePdf ? '<button data-cert-pdf>Sačuvaj PDF</button>' : ''}<button data-cert-export>Sačuvaj evidenciju JSON</button></div><p data-certificate-status role="status" aria-live="polite"></p><div class="certificate-preview">${renderCertificate(activeRecord)}</div>`;
    context.root.querySelector('[data-cert-back]').onclick = collection;
    context.root.querySelector('[data-cert-print]').onclick = () => printCertificate(false);
    const pdf = context.root.querySelector('[data-cert-pdf]'); if (pdf) pdf.onclick = () => printCertificate(true);
    context.root.querySelector('[data-cert-export]').onclick = () => context.exportFile?.(`ELDI-potvrda-${activeRecord.id}.json`, JSON.stringify({app: 'ELDI EDU', schema: 1, certificate: activeRecord}, null, 2), 'application/json');
  }

  function showCertificate(record, options) { mount(options); preview(record); }
  return {AUTHORS, DEFAULT_THRESHOLDS, SUBJECTS, gradeResult, grades: gradeResult, createRecord, validateRecord, recordExamCertificate, badgeProgress, renderCertificate, scaleText, mount, preview, showCertificate};
});
