'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

// The real Blockly libraries and the real generator are loaded headlessly.
// Only canvas drawing and browser element lookup are stubbed; serialization,
// Blockly loop generation and worker interpretation remain production code.
function studio() {
  const paint = new Proxy({}, { get: () => () => {}, set: () => true });
  const elements = {
    stage: { getContext: () => paint }, blockcode: { textContent: '' },
    blocklang: { value: 'js' }, blockout: { textContent: '' }, sprite: { value: '0' }
  };
  const context = vm.createContext({
    console, setTimeout, clearTimeout, navigator: {},
    document: { getElementById: id => elements[id], addEventListener() {}, removeEventListener() {} }
  });
  context.window = context;
  for (const file of ['blockly_compressed.js', 'blocks_compressed.js', 'javascript_compressed.js', 'python_compressed.js', 'bs.js']) {
    vm.runInContext(read('renderer/vendor/' + file), context, { filename: file });
  }
  vm.runInContext(read('renderer/blocks.js'), context, { filename: 'blocks.js' });
  context.Blockly.inject = () => new context.Blockly.Workspace();
  context.ELDIBlocks.init({ onSave() {} });
  return context.ELDIBlocks;
}

function execute(code, keys = []) {
  const messages = [];
  const context = vm.createContext({ console, Date, self: { postMessage: message => messages.push(message) } });
  context.importScripts = file => vm.runInContext(read('renderer/' + file), context, { filename: file });
  vm.runInContext(read('renderer/block-worker.js'), context, { filename: 'block-worker.js' });
  context.self.onmessage({ data: { code, keys, sprite: 0 } });
  return { messages, actions: messages.flatMap(message => message.actions || []), last: messages.at(-1) };
}

test('Square example generates and interprets four moves and four turns', () => {
  const blocks = studio();
  try {
    blocks.example('square');
    const program = blocks.code('js');
    assert.match(program, /move\(80\)/);
    const result = execute(program);
    assert.equal(result.last.type, 'done', JSON.stringify(result.last));
    assert.equal(result.actions.filter(action => action.type === 'move' && action.value === 80).length, 4);
    assert.equal(result.actions.filter(action => action.type === 'turn' && action.value === 90).length, 4);
  } finally { blocks.destroy(); }
});

test('Counting example produces an introduction and three repeated messages', () => {
  const blocks = studio();
  try {
    blocks.example('count');
    const result = execute(blocks.code('js'));
    assert.equal(result.last.type, 'done', JSON.stringify(result.last));
    assert.deepEqual(Array.from(result.actions.filter(action => action.type === 'say'), action => action.value), ['Brojimo tri puta', 'Učim!', 'Učim!', 'Učim!']);
    assert.match(blocks.code('py'), /import turtle/);
    assert.match(blocks.code('py'), /turtle.done\(\)/);
  } finally { blocks.destroy(); }
});

test('Broadcast invokes its interpreter callback and nested broadcasts stop at the depth bound', () => {
  const result = execute('on("start", function(){ say("Primljeno"); }); broadcast("start");');
  assert.equal(result.last.type, 'done', JSON.stringify(result.last));
  assert.ok(result.actions.some(action => action.type === 'say' && action.value === 'Primljeno'));
  const cycle = execute('on("cycle", function(){ broadcast("cycle"); }); broadcast("cycle");');
  assert.equal(cycle.last.type, 'error');
  assert.match(cycle.last.message, /poruka/);
});

test('Generated receivers register before broadcasts regardless of visual block order', () => {
  const blocks = studio();
  try {
    blocks.load({ format: 'ELDI-BLOCKS-1', workspace: { blocks: { languageVersion: 0, blocks: [
      { type: 'edu_message', x: 0, y: 0, inputs: { TEXT: { block: { type: 'text', fields: { TEXT: 'start' } } } } },
      { type: 'edu_received', x: 0, y: 100, fields: { MESSAGE: 'start' }, inputs: { DO: { block: { type: 'edu_say', inputs: { TEXT: { block: { type: 'text', fields: { TEXT: 'Primljeno iz blokova' } } } } } } } }
    ] } } });
    const program = blocks.code('js');
    assert.ok(program.indexOf('on(') < program.indexOf('broadcast('), program);
    const result = execute(program);
    assert.equal(result.last.type, 'done', JSON.stringify(result.last));
    assert.ok(result.actions.some(action => action.type === 'say' && action.value === 'Primljeno iz blokova'));
  } finally { blocks.destroy(); }
});

test('Key conditions distinguish pressed and released key snapshots', () => {
  const program = 'if(key("ArrowRight")){move(12);} else {move(-12);}';
  for (const pressed of [false, true]) {
    const result = execute(program, pressed ? ['ArrowRight'] : []);
    assert.equal(result.last.type, 'done', JSON.stringify(result.last));
    assert.equal(result.actions.find(action => action.type === 'move').value, pressed ? 12 : -12);
  }
});

test('Unbounded movement stops at the instruction limit and invalid motion rejects non-finite input', () => {
  const result = execute('while(true){move(1);}');
  assert.equal(result.last.type, 'error');
  assert.match(result.last.message, /10 000/);
  assert.ok(result.actions.length <= 10000);
  const invalid = execute('move(1/0);');
  assert.equal(invalid.last.type, 'error');
  assert.match(invalid.last.message, /Vrijednost kretanja/);
});
