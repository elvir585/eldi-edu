'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const book = require('../content/book-programming.json');
const report = require('../content/programming-verification.json');

test('programming book keeps all 162 numbered tasks and both complete source files', () => {
  assert.equal(book.subject, 'informatics');
  assert.equal(book.sourceFile, 'content/books/programiranje.pdf');
  assert.equal(book.sourcePages, 464);
  assert.deepEqual(book.tasks.map(t => t.number), Array.from({length:162}, (_,i)=>i+1));
  assert.equal(new Set(book.tasks.map(t=>t.id)).size, 162);
  for(const task of book.tasks){
    assert.ok(task.title && task.statement && task.input && task.output && task.help && task.complexity, `Incomplete task ${task.number}`);
    assert.equal(typeof task.limits, 'string');
    if(![22,162].includes(task.number)) assert.ok(task.limits, `Missing source limits for ${task.number}`);
    assert.ok(task.steps.length >= 2);
    assert.ok(task.sourcePage >= 71 && task.sourcePage <= 459);
    assert.ok(task.pages.includes(task.sourcePage));
    assert.equal(task.examples.length, 1);
    for(const lang of ['python','cpp']){
      const solution = task.solutions[lang];
      assert.ok(solution.code.trim().length > 20);
      assert.ok(!solution.path.includes('..'));
      assert.ok(solution.path.startsWith('content/solutions/programming/'));
      assert.equal(fs.readFileSync(path.join(root, solution.path), 'utf8'), solution.code);
      assert.equal(solution.status, 'sample-verified');
      assert.equal(solution.verification.sourceSha256, crypto.createHash('sha256').update(solution.code).digest('hex'));
      assert.equal(solution.verification.examplesPassed, solution.verification.examplesTotal);
      assert.equal(solution.verification.examplesTotal, 1);
    }
    const directory = path.dirname(path.join(root, task.solutions.python.path));
    assert.equal(fs.readFileSync(path.join(directory, 'example-1.in'), 'utf8'), task.examples[0].input);
    assert.equal(fs.readFileSync(path.join(directory, 'example-1.out'), 'utf8'), task.examples[0].output);
    assert.ok(fs.readFileSync(path.join(directory, 'README.md'), 'utf8').includes(task.title));
  }
});

test('book examples are verified with scope and theory snippets remain distinct', () => {
  assert.equal(report.programs.length, 324);
  assert.equal(book.verification.sampleExecutions, 324);
  assert.equal(book.verification.passedExecutions, 324);
  assert.match(book.verification.scope, /Ne predstavlja provjeru svih/);
  assert.equal(book.theory.length, 109);
  const examples = book.theory.flatMap(t=>t.codeExamples);
  assert.equal(examples.length,176);
  assert.equal(examples.filter(e=>e.kind==='snippet').length,168);
  for(const example of examples.filter(e=>e.kind==='snippet')) assert.equal(example.runnable,false);
  assert.equal(book.tasks.filter(t=>t.archive).length,15);
  assert.ok(book.tasks.slice(-3).every(t=>t.topic.includes('srednjoškolski')));
  assert.ok(!JSON.stringify(book).includes('\\u0000'));
  assert.ok(book.extractionNotes.length > 0);
  for(const n of book.extractionNotes) assert.ok(n.original.includes('[missing glyph]') && n.restored && n.reason);
});
