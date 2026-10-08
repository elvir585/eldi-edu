'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createRunner, validateRequest, SOURCE_LIMIT } = require('../desktop/runner.cjs');
const root = path.resolve(__dirname, '..');

function filesIn(directory) {
  return fs.existsSync(directory) ? fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => item.isDirectory() ? filesIn(path.join(directory, item.name)) : [path.join(directory, item.name)]) : [];
}
async function main() {
  const {maths,info}=require('./generate-content.cjs')();
  console.log('Zbirke i ZIP:',JSON.stringify(require('./build-learning-pack.cjs')()));
  console.log('Blokovski katalog:',JSON.stringify(require('./build-block-projects.cjs').build()));
  console.log('Blokovski ZIP:',JSON.stringify(require('./build-block-pack.cjs')()));
  const practice=require('../app/practice-engine.js');
  assert.equal(practice.topics.length,500);
  assert.equal(maths.length+info.length,1000);
  for (const relative of ['desktop/main.cjs', 'desktop/preload.cjs', 'desktop/runner.cjs', 'renderer/index.html', 'app/math-engine.js', 'app/exercise-engine.js', 'renderer/collection.js', 'content/math-projects.js', 'content/block-challenges.js', 'content/curriculum.json', 'content/tasks.json', 'package.json', '.github/workflows/build-windows.yml']) assert.ok(fs.existsSync(path.join(root, relative)), `Nedostaje ${relative}`);
  const collection = require('../app/exercise-engine.js');
  const projects = require('../content/math-projects.js');
  assert.ok(collection.topics.length >= 95 && collection.variantsPerTopic === 200, 'Nedostaje proširena zbirka.');
  assert.ok(projects.length >= 40, 'Nedostaju složeni problemski zadaci.');
  for (const grade of [5,6,7,8,9]) assert.ok(projects.filter(task => task.grade === grade).length >= 8, `Nedostaju problemski zadaci za ${grade}. razred.`);
  const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'content/curriculum.json'), 'utf8'));
  const tasks = JSON.parse(fs.readFileSync(path.join(root, 'content/tasks.json'), 'utf8'));
  assert.ok(Array.isArray(curriculum) && curriculum.length >= 100, 'Nedostaje zbirka tematskih lekcija.');
  assert.ok(Array.isArray(tasks) && tasks.length >= 10, 'Nedostaju programerski zadaci.');
  for (const grade of [5,6,7,8,9]) for (const subject of ['math','informatics']) assert.ok(curriculum.some(lesson => lesson.g === grade && lesson.subject === subject), `Nedostaje ${subject}, ${grade}. razred.`);
  fs.writeFileSync(path.join(root, 'content/data.js'), 'window.ELDI_CONTENT=' + JSON.stringify(curriculum) + ';\nwindow.ELDI_TASKS=' + JSON.stringify(tasks) + ';\n');
  for (const file of [...filesIn(path.join(root, 'desktop')), ...filesIn(path.join(root, 'scripts')), ...filesIn(path.join(root, 'renderer')), ...filesIn(path.join(root, 'app')), ...filesIn(path.join(root, 'content'))]) {
    if (/\.(cjs|js)$/.test(file)) execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  }
  assert.throws(() => validateRequest({ language: 'sh', code: 'echo test' }));
  assert.throws(() => validateRequest({ language: 'python', code: 'x'.repeat(SOURCE_LIMIT + 1) }));
  assert.throws(() => validateRequest({ language: 'python', code: '' }));
  assert.throws(() => validateRequest({ language: 'python', code: 'print(1)', input: [] }));
  const tests = filesIn(path.join(root, 'tests')).filter(file => /\.test\.cjs$/.test(file));
  execFileSync(process.execPath, ['--test', ...tests], { stdio: 'inherit' });
  console.log('Struktura, JavaScript sintaksa i validacija: OK.');
  if (!process.argv.includes('--runtime') && !process.argv.includes('--bundled')) return;
  const bundled = process.argv.includes('--bundled');
  const runner = createRunner({ runtimeRoot: path.join(root, 'runtimes'), allowSystem: !bundled });
  const status = runner.runtimeStatus();
  const samples = {
    python: 'a, b = map(int, input().split())\nprint(a + b)\n',
    c: '#include <stdio.h>\nint main(void){long long a,b;if(scanf("%lld%lld",&a,&b)!=2)return 1;printf("%lld\\n",a+b);return 0;}\n',
    cpp: '#include <iostream>\nint main(){long long a,b;std::cin>>a>>b;std::cout<<a+b<<"\\n";}\n',
    java: 'import java.util.Scanner;\npublic class Main { public static void main(String[] args) { Scanner s=new Scanner(System.in); long a=s.nextLong(),b=s.nextLong(); System.out.println(a+b); } }\n'
  };
  const tested = [];
  for (const [language, code] of Object.entries(samples)) {
    if (!status[language].available) { assert.ok(!bundled, `Nedostaje ugrađeni ${language}`); console.log(`${language}: preskočeno — alat nije instaliran u ovom razvojnom okruženju.`); continue; }
    if (bundled) assert.ok(status[language].bundled, `${language} nije ugrađen`);
    const result = await runner.runCode({ language, code, input: '1000000000 1000000000\n' });
    assert.ok(result.ok, `${language}: ${result.stderr}`);
    assert.equal(result.stdout.trim(), '2000000000');
    tested.push(language);
    console.log(`${language}: stvarno izvršavanje i standardni ulaz OK.`);
  }
  for (const language of ['c', 'cpp', 'java']) {
    if (!status[language].available) continue;
    const invalid = await runner.runCode({ language, code: language === 'java' ? 'public class Main { broken code }' : 'int main( { broken code', input: '' });
    assert.equal(invalid.ok, false);
    assert.equal(invalid.phase, 'compile');
    assert.ok(invalid.stderr.length > 0);
    console.log(`${language}: greška kompajlera ispravno prikazana.`);
  }
  if (status.python.available) {
    const shortRunner = createRunner({ runtimeRoot: path.join(root, 'runtimes'), allowSystem: !bundled, runTimeoutMs: 700, maxOutputBytes: 2048 });
    const endless = await shortRunner.runCode({ language: 'python', code: 'while True: pass\n' });
    assert.equal(endless.timedOut, true);
    assert.equal(endless.ok, false);
    const tooMuch = await shortRunner.runCode({ language: 'python', code: 'print("x" * 10000)\n' });
    assert.equal(tooMuch.truncated, true);
    assert.ok(Buffer.byteLength(tooMuch.stdout) <= 2048);
    const error = await shortRunner.runCode({ language: 'python', code: 'print(1 / 0)\n' });
    assert.equal(error.ok, false);
    assert.match(error.stderr, /ZeroDivisionError/);
    const unicode = await runner.runCode({ language: 'python', code: 'print(input())\n', input: 'Čajić — učenik\n' });
    assert.equal(unicode.stdout.trim(), 'Čajić — učenik');
    console.log('Prekid beskonačne petlje, ograničenje izlaza, greške i UTF-8: OK.');
  }
  assert.ok(tested.length > 0, 'Nijedan programski alat nije dostupan.');
}
main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
