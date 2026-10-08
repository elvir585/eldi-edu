'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const projects = require('../content/math-projects.js');
const byId = new Map(projects.map(project => [project.id, project]));

// Independent oracles use the quantities in the statements, rather than the
// authored answers or the app's calculator / grading implementation.
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
function lcm(a, b) { return a / gcd(a, b) * b; }
function frac(n, d = 1) {
  assert.notEqual(d, 0);
  if (d < 0) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  return { n: n / divisor, d: d / divisor };
}
function add(a, b) { return frac(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a, b) { return frac(a.n * b.d - b.n * a.d, a.d * b.d); }
function div(a, b) { return frac(a.n * b.d, a.d * b.n); }
function fractionText(value) { return `${value.n}/${value.d}`; }
function sum(values) { return values.reduce((total, value) => total + value, 0); }
function rounded(value, places) { return Number(value.toFixed(places)); }

function verify(id, expected) {
  const project = byId.get(id);
  assert(project, `Missing project ${id}`);
  assert.deepEqual(project.fields.map(field => field.key).sort(), Object.keys(expected).sort(), `${id}: every part must be checked`);
  for (const field of project.fields) {
    const target = expected[field.key];
    const message = `${id}/${field.key}: ${field.answer} should equal ${JSON.stringify(target)}`;
    if (field.type === 'number') {
      const actual = Number(field.answer);
      assert(Number.isFinite(actual) && Number.isFinite(target), message);
      assert(Math.abs(actual - target) <= Math.max(field.tolerance || 0, 1e-9), message);
    } else if (field.type === 'list') {
      assert.equal(field.ordered, true, `${id}: component/order requirements must be graded`);
      assert.deepEqual(field.answer.trim().split(/\s+/).map(Number), target, message);
    } else {
      assert.equal(field.answer, target, message);
    }
  }
}

test('Projects have complete, unique free-answer data across all five grades', () => {
  assert.equal(projects.length, 41);
  assert.equal(byId.size, projects.length);
  const counts = {};
  let fields = 0;
  for (const project of projects) {
    assert.equal(project.topicId, 'projects');
    assert([5, 6, 7, 8, 9].includes(project.grade));
    counts[project.grade] = (counts[project.grade] || 0) + 1;
    for (const key of ['title', 'prompt', 'hint']) assert.equal(typeof project[key], 'string');
    assert(project.title.trim() && project.prompt.trim() && project.hint.trim());
    assert(project.steps.length >= 3 && project.steps.every(step => typeof step === 'string' && step.trim()));
    assert(project.fields.length >= 3);
    assert.equal(new Set(project.fields.map(field => field.key)).size, project.fields.length);
    for (const field of project.fields) {
      assert(field.key && field.label);
      assert.equal(typeof field.answer, 'string');
      assert(['number', 'text', 'list'].includes(field.type));
      assert(!('options' in field));
      if (field.type === 'number') assert(/^-?\d+(?:\.\d+)?$/.test(field.answer), `${project.id}: numeric answers use a supported decimal format`);
      if (field.type === 'text') assert(/^-?\d+\/\d+$/.test(field.answer), `${project.id}: text answers are explicitly requested reduced fractions`);
      if ('tolerance' in field) assert(Number.isFinite(field.tolerance) && field.tolerance > 0);
      fields++;
    }
  }
  assert.deepEqual(counts, {5: 8, 6: 8, 7: 8, 8: 8, 9: 9});
  assert.equal(fields, 138);
});

test('The same data exports to a browser global without requiring Node', () => {
  const source = fs.readFileSync(require.resolve('../content/math-projects.js'), 'utf8');
  const context = vm.createContext({});
  vm.runInContext(source, context);
  assert.equal(context.ELDI_MATH_PROJECTS.length, projects.length);
  assert.equal(context.ELDI_MATH_PROJECTS[0].id, projects[0].id);
});

const cases = [
  ['project-5-biblioteka', () => {
    const pocetno = 14 * 32, nabavka = pocetno + 175;
    return {pocetno, nabavka, konacno: nabavka - 129 - 3 * 80};
  }],
  ['project-5-budzet', () => {
    const uredjaji = 18 * 27500, trosak = uredjaji + 85600;
    return {uredjaji, trosak, ostatak: 1500000 - trosak};
  }],
  ['project-5-autobusi', () => {
    const autobusi = Math.ceil(287 / 48);
    assert((autobusi - 1) * 48 < 287 && autobusi * 48 >= 287);
    return {autobusi, prazna: autobusi * 48 - 287, najam: autobusi * 650};
  }],
  ['project-5-ograda', () => {
    const obim = 2 * (28 + 17), ograda = obim - 4;
    return {obim, ograda, cijena: ograda * 12, povrsina: 28 * 17};
  }],
  ['project-5-plocice', () => {
    const plocice = (9 * 100 / 30) * (6 * 100 / 30), kutije = Math.ceil(plocice / 25);
    return {plocice, kutije, cijena: kutije * 18};
  }],
  ['project-5-stampanje', () => {
    const listovi = 3850 * 24 / 2, pakovanja = Math.ceil(listovi / 500);
    return {listovi, pakovanja, visak: pakovanja * 500 - listovi};
  }],
  ['project-5-pakovanje', () => {
    const pune = Math.floor(2650 / 36), ostatak = 2650 % 36, kutije = Math.ceil(2650 / 36);
    return {pune, ostatak, kutije, prazna: kutije * 36 - 2650};
  }],
  ['project-5-putovanje', () => {
    const trajanje = 2 * 60 + 48 + 26 + 60 + 19, arrival = 8 * 60 + 35 + trajanje;
    return {trajanje, sat: Math.floor(arrival / 60), minuta: arrival % 60};
  }],
  ['project-6-autobuski-red', () => {
    const razmak = lcm(24, 36), next = 9 * 60 + razmak;
    let broj = 0;
    for (let t = 9 * 60; t < 13 * 60; t += razmak) broj++;
    return {razmak, sat: Math.floor(next / 60), minuta: next % 60, broj};
  }],
  ['project-6-kompleti', () => {
    const kompleti = gcd(gcd(84, 126), 210);
    return {kompleti, crvene: 84 / kompleti, plave: 126 / kompleti, bijele: 210 / kompleti};
  }],
  ['project-6-napitak', () => {
    const total = add(frac(3, 4), frac(2, 3)), quotient = div(total, frac(1, 6));
    const caseCount = Math.floor(quotient.n / quotient.d), remaining = sub(total, frac(caseCount, 6));
    assert(remaining.n / remaining.d < 1 / 6);
    return {ukupno: fractionText(total), case: caseCount, ostatak: fractionText(remaining)};
  }],
  ['project-6-planinarenje', () => {
    const prvi = 45 * 2 / 5, drugi = (45 - prvi) / 3;
    return {prvi, drugi, treci: 45 - prvi - drugi};
  }],
  ['project-6-glazura', () => {
    const masa = add(frac(3, 4), frac(1, 6)), serving = frac(5, 8), kolicnik = div(masa, serving);
    const kolaci = Math.floor(kolicnik.n / kolicnik.d);
    const ostatak = sub(masa, frac(kolaci * serving.n, serving.d));
    return {masa: fractionText(masa), kolicnik: fractionText(kolicnik), kolaci, ostatak: fractionText(ostatak)};
  }],
  ['project-6-kupovina', () => {
    const jabuke = 2.5 * 3.2, tresnje = 1.75 * 4.8, racun = jabuke + tresnje;
    return {jabuke, tresnje, racun, kusur: 20 - racun};
  }],
  ['project-6-trougaoni-vrt', () => {
    const povrsina = 10 * 12 / 2;
    assert.equal(12 * 12 + 5 * 5, 13 * 13, 'The specified isosceles-triangle dimensions are consistent');
    return {povrsina, ograda: 10 + 13 + 13 - 2, travnjak: povrsina * 8};
  }],
  ['project-6-oznake', () => {
    const oznake = [];
    for (let n = 200; n <= 400; n++) if (n % 15 === 0 && n % 25 === 0 && n % 9 !== 0) oznake.push(n);
    return {oznake, najmanja: Math.min(...oznake), broj: oznake.length};
  }],
  ['project-7-dvostruka-promjena', () => {
    const poskupljenje = 480 * (1 + 12.5 / 100), popust = poskupljenje * (1 - 20 / 100);
    return {poskupljenje, popust, procenat: (480 - popust) / 480 * 100};
  }],
  ['project-7-odjeljenje', () => ({prije: 18 / 30 * 100, poslije: 18 / (30 + 6) * 100, odsutni: 9 / (30 + 6) * 100})],
  ['project-7-radnici', () => {
    const radniksati = 6 * 4 * 8, dani = radniksati / (8 * 6);
    return {radniksati, dani, isplata: dani * 8 * 55};
  }],
  ['project-7-raspodjela', () => {
    const weights = [5, 7, 8], initial = weights.map(weight => 360 * weight / sum(weights));
    const after = [initial[0] + 18, initial[1], initial[2] - 18], divisor = gcd(gcd(after[0], after[1]), after[2]);
    assert.equal(sum(after), 360);
    return {prvi: initial[0], drugi: initial[1], treci: initial[2], odnos: after.map(value => value / divisor)};
  }],
  ['project-7-taksi', () => {
    const put = (7 - 4) / (1.8 - 1.2), racun = 4 + 1.8 * put;
    return {put, racun, razlika: (4 + 1.8 * 20) - (7 + 1.2 * 20)};
  }],
  ['project-7-transverzala', () => {
    const x = (180 - 10 - 10) / (3 + 5), alfa = 3 * x + 10, beta = 5 * x + 10;
    return {x, alfa, beta, komplement: 90 - alfa};
  }],
  ['project-7-statistika', () => {
    const values = [6, 8, 6, 9, 11, 6, 10], sorted = [...values].sort((a, b) => a - b), frequencies = new Map();
    values.forEach(value => frequencies.set(value, (frequencies.get(value) || 0) + 1));
    const modes = [...frequencies].filter(([, count]) => count === Math.max(...frequencies.values())).map(([value]) => value);
    assert.equal(modes.length, 1);
    return {sredina: sum(values) / values.length, medijana: sorted[Math.floor(sorted.length / 2)], mod: modes[0], nova: (sum(values) + 12) / (values.length + 1)};
  }],
  ['project-7-kuglice', () => {
    const redBefore = 4, totalBefore = 4 + 3 + 3, redAfter = redBefore + 5, totalAfter = totalBefore + 5;
    return {prije: fractionText(frac(redBefore, totalBefore)), poslije: fractionText(frac(redAfter, totalAfter)), plave: 2 * redAfter - totalAfter};
  }],
  ['project-8-dijagonalni-put', () => {
    const dijagonala = Math.hypot(9, 12), rub = 9 + 12;
    return {dijagonala, rub, usteda: rub - dijagonala};
  }],
  ['project-8-ukrute', () => {
    const dijagonala = Math.hypot(5, 12), komad = dijagonala * 1.2;
    return {dijagonala, komad, ukupno: 4 * komad};
  }],
  ['project-8-prosirenje-bazena', () => {
    const x = (68 - 4 * 2) / (4 + 2), width = x + 4, height = x + 2;
    assert.equal(width * height - x * x, 68);
    return {x, povrsina: width * height, obim: 2 * (width + height)};
  }],
  ['project-8-memorija', () => {
    const lokacije = 2 ** 12, bytes = lokacije * 16;
    return {lokacije, kib: bytes / 1024, vrijeme: bytes / 4096};
  }],
  ['project-8-slicni-trouglovi', () => {
    const scale = 9 / 6, kateta = 8 * scale, hipotenuza = Math.hypot(9, kateta);
    return {kateta, hipotenuza, povrsina: 9 * kateta / 2};
  }],
  ['project-8-vektorski-put', () => {
    const initial = [-3, 2], v = [5, -4], u = [-1, 5], vektor = v.map((value, i) => value + u[i]);
    return {x: initial[0] + vektor[0], y: initial[1] + vektor[1], vektor, udaljenost: rounded(Math.hypot(...vektor), 3)};
  }],
  ['project-8-kopirnica', () => {
    const plakati = Math.floor((60 - 14) / 0.75), cijena = 14 + 0.75 * plakati;
    assert(14 + 0.75 * (plakati + 1) > 60);
    return {plakati, cijena, ostatak: 60 - cijena};
  }],
  ['project-8-pravougaonik-u-trouglu', () => {
    const visina = Math.sqrt(13 ** 2 - (10 / 2) ** 2), sirina = 10 * (visina - 6) / visina;
    return {visina, sirina, povrsina: sirina * 6};
  }],
  ['project-9-ulaznice', () => {
    const odrasli = (770 - 85 * 7) / (12 - 7), djeca = 85 - odrasli;
    return {odrasli, djeca, prihod: odrasli * 12};
  }],
  ['project-9-energetske-tarife', () => {
    const potrosnja = (6 - 2) / (0.16 - 0.12);
    return {potrosnja, racun: 6 + 0.12 * potrosnja, razlika: (2 + 0.16 * 150) - (6 + 0.12 * 150)};
  }],
  ['project-9-rezervoari', () => {
    const jednako = (240 - 60) / (18 + 12), kolicina = 240 - 18 * jednako;
    assert.equal(kolicina, 60 + 12 * jednako);
    return {k: -18, n: 240, jednako, kolicina, prazan: fractionText(frac(240, 18))};
  }],
  ['project-9-kutije', () => {
    const a = 30, b = 20, c = 15, broj = (90 / a) * (60 / b) * (45 / c);
    return {litri: a * b * c / 1000, broj, karton: broj * 2 * (a * b + a * c + b * c) / 10000};
  }],
  ['project-9-cisterna', () => {
    const kapacitet = 3.14 * 0.5 ** 2 * 1.2 * 1000, zaliha = kapacitet * 0.75;
    return {kapacitet, zaliha, dani: zaliha / 47.1};
  }],
  ['project-9-kupasti-sator', () => {
    const r = 3, h = 4, izvodnica = Math.hypot(r, h), surface = 3.14 * r * izvodnica;
    return {izvodnica, platno: surface * 1.1, zapremina: 3.14 * r * r * h / 3};
  }],
  ['project-9-piramida', () => {
    const a = 6, h = 4, apotema = Math.hypot(a / 2, h), base = a * a, zapremina = base * h / 3;
    return {apotema, povrsina: base + 4 * a * apotema / 2, zapremina, masa: 0.8 * zapremina};
  }],
  ['project-9-lopte', () => {
    const count = 3, radius = 5, zapremina = count * 4 / 3 * 3.14 * radius ** 3, povrsina = count * 4 * 3.14 * radius ** 2;
    return {zapremina, litri: zapremina / 1000, povrsina, premaz: povrsina / 200};
  }],
  ['project-9-krov-diedar', () => {
    const span = 8, height = 4, length = 10, side = Math.hypot(span / 2, height);
    const baseAngle = Math.atan2(height, span / 2) * 180 / Math.PI;
    return {diedar: 180 - 2 * baseAngle, krak: rounded(side, 3), povrsina: rounded(2 * side * length, 3), zapremina: span * height / 2 * length};
  }]
];

test('Independent oracles cover every authored project exactly once', () => {
  assert.equal(cases.length, projects.length);
  assert.equal(new Set(cases.map(([id]) => id)).size, projects.length);
  assert.deepEqual(cases.map(([id]) => id).sort(), projects.map(project => project.id).sort());
});

for (const [id, oracle] of cases) {
  test(`${id}: independently recomputed answers`, () => verify(id, oracle()));
}
