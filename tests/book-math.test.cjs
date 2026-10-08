'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const book = require('../content/book-math.json');
const byId = Object.fromEntries(book.tasks.map(t => [t.id, t]));
const close = (a, b, tolerance = 1e-8) => Math.abs(a - b) < tolerance;
const fraction = s => { const [a, b = 1] = String(s).split('/').map(Number); return a / b; };
const value = id => { const a = byId[id].answer; return a.type === 'fraction' ? fraction(a.value) : a.value; };
const unique = n => new Set(String(n)).size === String(n).length;
const primes = n => n >= 2 && Array.from({ length: Math.max(0, Math.floor(Math.sqrt(n)) - 1) }, (_, i) => i + 2).every(d => n % d !== 0);
const array = (actual, expected) => assert.deepEqual(actual, expected);

test('PZTK original has complete physical page index, chapter ranges and accurate publication metadata', () => {
  assert.equal(book.publicationYear, 2016);
  assert.match(book.uploadedFilename, /2015/);
  assert.equal(book.pageCount, 203);
  assert.equal(book.pages.length, 203);
  assert.equal(book.chapters.length, 25);
  assert.equal(book.chapters.filter(c => c.grade).length, 24);
  array(book.pages.map(p => p.page), Array.from({ length: 203 }, (_, i) => i + 1));
  for (const chapter of book.chapters) {
    assert.ok(chapter.pageStart >= 1 && chapter.pageEnd <= 203 && chapter.pageStart <= chapter.pageEnd);
    assert.ok(chapter.methods.length >= 3);
    for (let n = chapter.pageStart; n <= chapter.pageEnd; n++) {
      assert.equal(book.pages[n - 1].chapterId, chapter.id);
      assert.equal(book.pages[n - 1].grade, chapter.grade);
    }
    if (chapter.grade) assert.ok(book.tasks.some(t => t.chapterId === chapter.id), `No worked task for ${chapter.id}`);
  }
  assert.match(book.notices.join(' '), /odabrane/);
  assert.match(book.notices.join(' '), /dokaz/);
  const asset = fs.readFileSync(path.join(__dirname, '..', book.sourceFile));
  assert.equal(crypto.createHash('sha256').update(asset).digest('hex'), book.sourceSha256);
  assert.match(asset.subarray(0, 10).toString(), /^%PDF/);
});

test('All 53 selected tasks have meaningful help, original references and unambiguous answer forms', () => {
  assert.equal(book.tasks.length, 53);
  assert.equal(new Set(book.tasks.map(t => t.id)).size, 53);
  assert.equal(book.tasks.filter(t => t.answer.type !== 'manual').length, 49);
  assert.equal(book.tasks.filter(t => t.answer.type === 'manual').length, 4);
  for (const task of book.tasks) {
    const chapter = book.chapters.find(c => c.id === task.chapterId);
    assert.ok(chapter && chapter.grade === task.grade);
    assert.ok(task.page >= chapter.pageStart && task.page <= chapter.pageEnd);
    assert.equal(task.source.page, task.page);
    assert.equal(task.source.taskNumber, task.taskNumber);
    assert.ok(task.source.solutionPage >= task.page && task.source.solutionPage <= chapter.pageEnd);
    assert.ok(task.statement.length > 30 && task.help.length >= 2 && task.solution.length >= 3);
    assert.ok(task.help.join(' ').length > 40 && task.solution.join(' ').length > 60);
    assert.ok(task.answerPrompt && task.answerDisplay);
    if (task.answer.type === 'tuple') {
      assert.equal(task.answer.labels.length, task.answer.value.length);
      assert.equal(task.answer.orderSensitive, true);
    }
    if (task.answer.type === 'fraction') assert.match(task.answer.value, /^-?\d+\/[1-9]\d*$/);
    if (task.answer.type === 'set') assert.equal(new Set(task.answer.value).size, task.answer.value.length);
  }
});

test('Sixth and seventh grade selected answers satisfy independent arithmetic and original problem constraints', () => {
  assert.equal(value('pztk-6-skupovi-01'), 470 + 250 - (1100 - 542));
  const [difference, intersection] = value('pztk-6-skupovi-02');
  assert.equal(intersection, 22 + 17 - 25);
  assert.equal(difference, 22 - intersection);
  const letters = [...new Set('matematika')].filter(c => new Set('takmičenje').has(c));
  assert.equal(value('pztk-6-skupovi-04'), letters.length * (letters.length - 1) / 2);
  const angle = value('pztk-6-uglovi-02');
  assert.equal((90 - angle) + (180 - angle), 150);
  const angleTen = value('pztk-6-uglovi-03');
  assert.equal((90 - angleTen) + (180 - angleTen), 10 * angleTen);
  let largest = 9999, smallest = 10000;
  while (!unique(largest)) largest--;
  while (!unique(smallest)) smallest++;
  assert.equal(largest + smallest - value('pztk-6-prirodni-brojevi-01'), 20000);
  assert.equal(value('pztk-6-prirodni-brojevi-02'), Array.from({ length: 101 }, (_, i) => 1700 + i).reduce((a, b) => a + b, 0) / 175);
  const digitNumbers = Array.from({ length: 4440 }, (_, i) => i + 1).filter(n => /^[04]+$/.test(String(n)) && n % 15 === 0);
  assert.equal(value('pztk-6-djeljivost-6-01'), Math.min(...digitNumbers));
  assert.equal(value('pztk-6-djeljivost-6-02'), (6 + 4 + 5) % 9);
  assert.equal(value('pztk-6-djeljivost-6-03'), Math.ceil(1000 / 15) * 15);
  assert.ok(close(value('pztk-6-razlomci-01'), 78 / 88 - 67 / 77));
  const primeFractionAnswers = Array.from({ length: 30 }, (_, i) => i + 1).filter(p => primes(p) && 4 / 21 < 3 / p && 3 / p < 6 / 17);
  array(value('pztk-6-razlomci-02'), primeFractionAnswers);
  const [numerator, denominator] = value('pztk-6-razlomci-03');
  assert.equal(denominator - numerator, 72);
  assert.equal(numerator * 15, denominator * 7);
  const zeroNumber = value('pztk-7-cijeli-brojevi-01');
  assert.equal(zeroNumber % 10, 0);
  assert.equal(zeroNumber - zeroNumber / 10, 37215);
  const integers = Array.from({ length: 20 }, (_, i) => i - 11);
  assert.equal(integers.filter(n => n > 0).length, 8);
  array(value('pztk-7-cijeli-brojevi-02'), [integers.reduce((a, b) => a + b, 0), integers.reduce((a, b) => a * b, 1) || 0]);
  const imagined = value('pztk-7-racionalni-brojevi-01');
  assert.ok(close(((imagined - 1.05) * 0.8 + 2.84) / 0.01, 700));
  const [minuend, subtrahend] = value('pztk-7-racionalni-brojevi-02');
  assert.ok(close(minuend - subtrahend, -13.86));
  assert.ok(close(minuend / 10, subtrahend));
  const xMinusY = (3 / 7) / (7 / 9);
  assert.ok(close(value('pztk-7-racionalni-brojevi-03'), -3 / 4 * xMinusY));
  const inner = value('pztk-7-trougao-7-01'), exterior = inner.map(n => 180 - n);
  assert.equal(inner.reduce((a, b) => a + b, 0), 180);
  assert.equal(exterior[0] / 9, exterior[1] / 16);
  assert.equal(exterior[1] / 16, exterior[2] / 20);
  const triangle = value('pztk-7-trougao-7-04');
  assert.equal(triangle.reduce((a, b) => a + b, 0), 180);
  assert.equal(triangle[1], 3 * triangle[0]);
  assert.equal(triangle[2], 5 * triangle[0]);
});

test('Eighth grade selected answers are independently checked, including the corrected coordinate perimeter', () => {
  const squareSum = Array.from({ length: 2016 }, (_, i) => (i + 1) ** 2).reduce((a, b) => a + b, 0);
  const productSum = Array.from({ length: 2015 }, (_, i) => (i + 1) * (i + 3)).reduce((a, b) => a + b, 0);
  assert.equal(value('pztk-8-korijeni-01'), squareSum - productSum);
  const ratio = 1 - Math.sqrt(2);
  assert.ok(close(ratio + 1 / ratio, -2 * Math.sqrt(2)));
  assert.equal(value('pztk-8-korijeni-03'), '−2√2');
  const increase = value('pztk-8-procenti-02');
  assert.ok(close(79 * (1 + increase / 100), 100));
  const [boys, girls] = value('pztk-8-procenti-03');
  assert.equal(boys + girls, 1275);
  assert.equal(boys / 0.9 + girls / 1.2, 1200);
  assert.equal(value('pztk-8-cijeli-racionalni-izrazi-04'), Number((9n ** 2016n + 1n) % 10n));
  assert.equal(value('pztk-8-cijeli-racionalni-izrazi-09'), (2 ** 2 + 1) / 2);
  const c = value('pztk-8-pitagora-01');
  assert.ok(close((2 * Math.sqrt(13)) ** 2 + Math.sqrt(73) ** 2, 5 / 4 * c ** 2));
  const legPairs = [];
  for (let a = 1; a < 34; a++) for (let b = a; b < 34; b++) if (a * a + b * b === 34 * 34) legPairs.push([a, b]);
  assert.equal(legPairs.length, 1);
  array(value('pztk-8-pitagora-03'), legPairs[0]);
  const midline = value('pztk-8-mnogougao-8-02');
  assert.equal(midline ** 2 + 15 ** 2, 25 ** 2);
  const angles = value('pztk-8-mnogougao-8-03');
  assert.equal(angles.reduce((a, b) => a + b, 0), 360);
  array(angles.map(n => n - angles[0]), [0, 20, 30, 50]);
  assert.equal(angles[0] + angles[3], 180);
  const transfer = value('pztk-8-proporcionalnost-01');
  const initialEnes = 420 * 13 / 21, initialAlmir = 420 * 8 / 21;
  assert.equal((initialEnes - transfer) * 10, (initialAlmir + transfer) * 11);
  const sides = value('pztk-8-proporcionalnost-04');
  assert.equal(2 * sides.reduce((a, b) => a + b, 0) - 6, 120);
  array(sides.map((n, i) => n / [2, 3, 4][i]), [7, 7, 7]);
  const ab = Math.hypot(-3, 4), bc = Math.hypot(4, 3), ac = Math.hypot(1, 7);
  assert.ok(close(ab ** 2 + bc ** 2, ac ** 2));
  array(value('pztk-8-koordinatni-sistem-01'), [Math.round((ab + bc + ac) * 10) / 10, ab * bc / 2]);
});

test('Ninth grade selected answers satisfy function, rate, digit, inequality and divisibility constraints', () => {
  const x = -2, y = 2;
  assert.equal((x - 2 * y) / (2 * x + y), 3);
  assert.equal(value('pztk-9-algebarski-izrazi-02'), (x + 3 * y) / (3 * x - y));
  const [a, b, c] = [6, 4, 3];
  assert.equal(b / a, 2 / 3); assert.equal(c / b, 3 / 4);
  assert.equal(value('pztk-9-algebarski-izrazi-03'), (a + b + c) / (a - b - c));
  const reciprocalX = 1, reciprocalY = -0.5;
  assert.equal(reciprocalX / reciprocalY + reciprocalX, reciprocalY / reciprocalX + reciprocalY);
  assert.equal(value('pztk-9-algebarski-izrazi-04'), 1 / reciprocalX + 1 / reciprocalY);
  const [m, distance] = value('pztk-9-linearna-funkcija-01');
  assert.equal((2 * m + 1) * 4 + 6, 3);
  assert.equal(distance, Math.abs(-6) / Math.hypot(2 * m + 1, -1));
  for (const k of value('pztk-9-linearna-funkcija-02')) assert.equal(Math.abs((-k) * (2 * k)) / 2, 16 / 4);
  const [first, second, third] = value('pztk-9-jednadzbe-01');
  assert.ok(close(1 / first + 1 / second + 1 / third, 1 / 2));
  assert.ok(close(1 / first + 1 / second, 1 / 3));
  assert.ok(close(1 / second + 1 / third, 1 / 4));
  const [old, moved] = value('pztk-9-jednadzbe-02');
  assert.equal(old % 10, 3);
  assert.equal(moved, 300 + Math.floor(old / 10));
  assert.equal(old / moved, 3 / 4);
  const digits = value('pztk-9-jednadzbe-03'), tens = Math.floor(digits / 10), ones = digits % 10;
  assert.equal(tens, 3 * ones);
  assert.equal(digits - 18, 10 * ones + tens);
  const [p, q] = value('pztk-9-sistemi-01');
  assert.equal(p / q, 19 / 8);
  assert.equal(p + q, 2 * (p - q) + 20);
  const digitSum = value('pztk-9-sistemi-02'), dt = Math.floor(digitSum / 10), du = digitSum % 10;
  assert.equal(dt + du, 9);
  assert.equal(digitSum, 10 * du + dt + 9);
  assert.equal(value('pztk-9-nejednadzbe-01'), 2015 ** 2 - 2014 ** 2 - 1);
  const integerSolutions = Array.from({ length: 21 }, (_, i) => i - 10).filter(n => Math.abs((2 * n - 3) / 4) < 1);
  array(value('pztk-9-nejednadzbe-02'), integerSolutions);
  const integralFractions = Array.from({ length: 100 }, (_, i) => i + 1).filter(n => (3 * n + 29) % (n + 2) === 0);
  array([value('pztk-9-djeljivost-9-03')], integralFractions);
  const telescopePrime = value('pztk-9-djeljivost-9-05');
  assert.ok(primes(telescopePrime));
  const telescope = Array.from({ length: telescopePrime }, (_, i) => 1 / (Math.sqrt(i + 1) + Math.sqrt(i + 2))).reduce((a, b) => a + b, 0);
  assert.ok(close(telescope, Math.round(telescope)) && telescope > 0);
  const parallelogram = value('pztk-9-mnogougao-9-03');
  assert.equal(2 * (parallelogram[0] + parallelogram[1]), 30);
  assert.equal(parallelogram[0] ** 2 + parallelogram[1] ** 2, 113);
  assert.ok(close(Math.PI * ((6 / Math.sqrt(2)) ** 2 - (6 / 2) ** 2), 9 * Math.PI));
  assert.equal(value('pztk-9-mnogougao-9-04'), '9π cm²');
  assert.equal(value('pztk-9-racionalni-izrazi-01'), 2 ** 20 - Math.sqrt((1 + 2 ** 11 + 2 ** 20) * (1 - 2 ** 11 + 2 ** 20)));
  assert.equal(value('pztk-9-racionalni-izrazi-03'), 2 ** 2 / (2 * 5 + 5 ** 2));
  // Manual geometry answers are checked as geometry, not by pretending an exact-text check grades a proof.
  assert.equal((2 / 3) * 6, 4); assert.equal((-2 / 3) * 6 + 4, 0);
  assert.match(value('pztk-9-analiticka-geometrija-02'), /AC: y=\(2\/3\)x/);
  const AB = [5 - 2, 0 - 2], BC = [7 - 5, 3 - 0], DC = [7 - 4, 3 - 5], AD = [4 - 2, 5 - 2];
  array(AB, DC); array(BC, AD);
  assert.equal(AB[0] * BC[0] + AB[1] * BC[1], 0);
  assert.match(value('pztk-9-analiticka-geometrija-03'), /paralelogram i pravougaonik/);
});

test('Known incorrect source answers are clearly marked and corrected rather than copied silently', () => {
  for (const id of ['pztk-6-skupovi-04', 'pztk-8-koordinatni-sistem-01', 'pztk-9-jednadzbe-02', 'pztk-9-djeljivost-9-03']) {
    assert.ok(byId[id].editorialNote.length > 60, `Missing correction notice for ${id}`);
  }
  assert.equal(value('pztk-6-skupovi-04'), 15);
  assert.equal(value('pztk-8-koordinatni-sistem-01')[0], 17.1);
  assert.equal(value('pztk-9-jednadzbe-02')[1], 324);
  assert.equal(value('pztk-9-djeljivost-9-03'), 21);
});
