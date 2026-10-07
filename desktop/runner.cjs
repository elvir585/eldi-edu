'use strict';

// This is a local educational runner, not an OS security sandbox.
// Programs run with the signed-in Windows user's file/network permissions.
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const LANGUAGES = Object.freeze(['python', 'c', 'cpp', 'java']);
const SOURCE_LIMIT = 128 * 1024;
const INPUT_LIMIT = 64 * 1024;

function validateRequest(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) throw new Error('Neispravan zahtjev.');
  if (!LANGUAGES.includes(request.language)) throw new Error('Odaberite Python, C, C++ ili Javu.');
  if (typeof request.code !== 'string' || !request.code.trim()) throw new Error('Unesite programski kod.');
  if (Buffer.byteLength(request.code, 'utf8') > SOURCE_LIMIT) throw new Error('Kod smije sadržavati najviše 128 KB.');
  if (request.input !== undefined && typeof request.input !== 'string') throw new Error('Standardni ulaz mora biti tekst.');
  const input = request.input || '';
  if (Buffer.byteLength(input, 'utf8') > INPUT_LIMIT) throw new Error('Standardni ulaz smije sadržavati najviše 64 KB.');
  return { language: request.language, code: request.code, input };
}

function systemExecutable(names) {
  const pathValue = process.env.PATH || process.env.Path || '';
  for (const directory of pathValue.split(path.delimiter)) {
    for (const name of names) {
      const candidate = path.resolve(directory || '.', name);
      try { fs.accessSync(candidate, process.platform === 'win32' ? fs.constants.F_OK : fs.constants.X_OK); return candidate; } catch {}
    }
  }
  return null;
}

function resolveTools(runtimeRoot, allowSystem) {
  const win = process.platform === 'win32';
  const locations = {
    python: path.join(runtimeRoot, 'python', win ? 'python.exe' : 'python3'),
    gcc: path.join(runtimeRoot, 'gcc', 'bin', win ? 'gcc.exe' : 'gcc'),
    gpp: path.join(runtimeRoot, 'gcc', 'bin', win ? 'g++.exe' : 'g++'),
    javac: path.join(runtimeRoot, 'java', 'bin', win ? 'javac.exe' : 'javac'),
    java: path.join(runtimeRoot, 'java', 'bin', win ? 'java.exe' : 'java')
  };
  const names = { python: win ? ['python.exe'] : ['python3', 'python'], gcc: [win ? 'gcc.exe' : 'gcc'], gpp: [win ? 'g++.exe' : 'g++'], javac: [win ? 'javac.exe' : 'javac'], java: [win ? 'java.exe' : 'java'] };
  const tools = {};
  for (const [name, file] of Object.entries(locations)) {
    tools[name] = fs.existsSync(file) ? { file, bundled: true } : allowSystem ? { file: systemExecutable(names[name]), bundled: false } : { file: null, bundled: false };
  }
  return tools;
}

function bundledGccOptions(runtimeRoot, language) {
  // MSYS2 GCC 16 uses a configured /ucrt64 sysroot. The copied compiler
  // prefix is elsewhere; all paths must be based on the installed app.
  const gccRoot = path.join(runtimeRoot, 'gcc');
  const gccLibraryRoot = path.join(gccRoot, 'lib', 'gcc');
  const directories = directory => {
    try { return fs.readdirSync(directory, { withFileTypes: true }).filter(item => item.isDirectory()).map(item => item.name); } catch { return []; }
  };
  const triple = directories(gccLibraryRoot).find(name => name.includes('mingw'));
  const version = triple && directories(path.join(gccLibraryRoot, triple)).filter(name => /^\d+(\.\d+)*$/.test(name)).sort((a,b) => b.localeCompare(a, undefined, { numeric: true }))[0];
  if (!triple || !version || !fs.existsSync(path.join(gccRoot, 'include', 'stdio.h'))) throw new Error('Ugrađeni GCC paket nema kompletna zaglavlja i biblioteke. Preuzmite novo Windows izdanje.');
  const internalRoot = path.join(gccLibraryRoot, triple, version);
  const portablePath = file => file.replace(/\\/g, '/');
  const args = [`--sysroot=${portablePath(gccRoot)}`, '-B', portablePath(internalRoot) + '/', '-B', portablePath(path.join(gccRoot, 'bin')) + '/'];
  const includeDirs = [];
  if (language === 'cpp') {
    const cppRoot = [path.join(gccRoot, 'include', 'c++', version), path.join(internalRoot, 'include', 'c++')].find(directory => fs.existsSync(path.join(directory, 'iostream')));
    if (!cppRoot) throw new Error('Ugrađeni G++ paket nema C++ standardnu biblioteku.');
    includeDirs.push(cppRoot, path.join(cppRoot, triple), path.join(cppRoot, 'backward'));
  }
  includeDirs.push(path.join(internalRoot, 'include'), path.join(internalRoot, 'include-fixed'), path.join(gccRoot, 'include'));
  for (const directory of includeDirs) if (fs.existsSync(directory)) args.push('-isystem', portablePath(directory));
  for (const directory of [internalRoot, path.join(gccRoot, 'lib'), path.join(gccRoot, triple, 'lib')]) if (fs.existsSync(directory)) args.push('-L', portablePath(directory));
  return args;
}

function killTree(child) {
  if (!child || !child.pid) return;
  if (process.platform === 'win32') {
    const taskkill = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'taskkill.exe');
    const killer = spawn(taskkill, ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore', shell: false });
    killer.on('error', () => { try { child.kill('SIGKILL'); } catch {} });
  } else {
    try { process.kill(-child.pid, 'SIGKILL'); } catch { try { child.kill('SIGKILL'); } catch {} }
  }
}

function createRunner(options = {}) {
  const runtimeRoot = options.runtimeRoot || path.resolve(__dirname, '..', 'runtimes');
  const tools = resolveTools(runtimeRoot, options.allowSystem === true);
  const compileTimeoutMs = options.compileTimeoutMs || 20000;
  const runTimeoutMs = options.runTimeoutMs || 6000;
  const outputLimit = options.maxOutputBytes || 256 * 1024;
  let busy = false;
  let activeChild = null;
  let cancelled = false;

  function runtimeStatus() {
    const dependency = { python: ['python'], c: ['gcc'], cpp: ['gpp'], java: ['java', 'javac'] };
    return Object.fromEntries(LANGUAGES.map(language => [language, {
      available: dependency[language].every(name => !!tools[name].file),
      bundled: dependency[language].every(name => !!tools[name].file && tools[name].bundled)
    }]));
  }

  function environment(tempDir) {
    const env = { TEMP: tempDir, TMP: tempDir, TMPDIR: tempDir, LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8', PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', PYTHONUNBUFFERED: '1', NO_COLOR: '1' };
    for (const key of ['SystemRoot', 'SYSTEMROOT', 'WINDIR', 'SystemDrive', 'COMSPEC']) if (process.env[key]) env[key] = process.env[key];
    const dirs = [...new Set(Object.values(tools).filter(item => item.file).map(item => path.dirname(item.file)))];
    if (process.platform === 'win32') dirs.push(path.join(process.env.SystemRoot || 'C:\\Windows', 'System32'));
    else dirs.push('/usr/bin', '/bin');
    env.PATH = dirs.join(path.delimiter);
    if (tools.java.file) env.JAVA_HOME = path.dirname(path.dirname(tools.java.file));
    return env;
  }

  function execute(executable, args, tempDir, input, timeoutMs) {
    return new Promise(resolve => {
      const stdoutChunks = [];
      const stderrChunks = [];
      let size = 0;
      let timedOut = false;
      let truncated = false;
      let settled = false;
      const start = Date.now();
      const child = spawn(executable, args, { cwd: tempDir, env: environment(tempDir), shell: false, windowsHide: true, detached: process.platform !== 'win32', stdio: ['pipe', 'pipe', 'pipe'] });
      activeChild = child;
      const timer = setTimeout(() => { timedOut = true; killTree(child); }, timeoutMs);
      function collect(chunk, channel) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        const remaining = Math.max(0, outputLimit - size);
        const accepted = buffer.subarray(0, remaining);
        if (accepted.length) (channel === 'stdout' ? stdoutChunks : stderrChunks).push(accepted);
        size += accepted.length;
        if (buffer.length > remaining && !truncated) { truncated = true; killTree(child); }
      }
      function finish(exitCode, signal, error) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (activeChild === child) activeChild = null;
        const stdout = Buffer.concat(stdoutChunks).toString('utf8');
        let stderr = Buffer.concat(stderrChunks).toString('utf8');
        if (error) stderr += '\n' + error.message;
        resolve({ stdout, stderr, exitCode, signal, timedOut, truncated, cancelled, durationMs: Date.now() - start });
      }
      child.stdout.on('data', chunk => collect(chunk, 'stdout'));
      child.stderr.on('data', chunk => collect(chunk, 'stderr'));
      child.on('error', error => finish(null, null, error));
      child.on('close', (exitCode, signal) => finish(exitCode, signal));
      child.stdin.on('error', () => {}); // An early program exit can close stdin.
      child.stdin.end(input, 'utf8');
      if (cancelled) killTree(child);
    });
  }

  async function runCode(request) {
    const { language, code, input } = validateRequest(request);
    if (busy) throw new Error('Drugi program se već izvršava. Zaustavite ga ili sačekajte.');
    if (!runtimeStatus()[language].available) throw new Error('Nedostaje alat za ovaj jezik. Koristite Windows EXE izdanje s ugrađenim alatima.');
    busy = true;
    cancelled = false;
    let tempDir;
    const start = Date.now();
    try {
      tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'eldi-run-'));
      const extension = { python: 'py', c: 'c', cpp: 'cpp', java: 'java' }[language];
      const source = path.join(tempDir, language === 'java' ? 'Main.java' : `main.${extension}`);
      await fsp.writeFile(source, code, 'utf8');
      let compile = null;
      const program = path.join(tempDir, process.platform === 'win32' ? 'program.exe' : 'program');
      if (language === 'c' || language === 'cpp') {
        const tool = language === 'c' ? tools.gcc : tools.gpp;
        const compiler = tool.file;
        const args = [...(process.platform === 'win32' && tool.bundled ? bundledGccOptions(runtimeRoot, language) : []), source, '-o', program, language === 'c' ? '-std=c17' : '-std=c++17', '-O0', '-Wall', '-Wextra', '-fdiagnostics-color=never'];
        if (process.platform === 'win32') args.push('-static-libgcc', ...(language === 'cpp' ? ['-static-libstdc++'] : []));
        else if (language === 'c') args.push('-lm');
        compile = await execute(compiler, args, tempDir, '', compileTimeoutMs);
      } else if (language === 'java') {
        compile = await execute(tools.javac.file, ['-encoding', 'UTF-8', '-d', tempDir, source], tempDir, '', compileTimeoutMs);
      }
      if (compile && (compile.exitCode !== 0 || compile.timedOut || compile.truncated || compile.cancelled)) return { ...compile, ok: false, phase: 'compile', language, durationMs: Date.now() - start };
      if (cancelled) return { ok: false, phase: 'run', language, stdout: '', stderr: '', exitCode: null, cancelled: true, timedOut: false, truncated: false, durationMs: Date.now() - start };
      const result = language === 'python'
        ? await execute(tools.python.file, ['-I', '-X', 'utf8', '-u', source], tempDir, input, runTimeoutMs)
        : language === 'java'
          ? await execute(tools.java.file, ['-Xmx128m', '-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-Dstderr.encoding=UTF-8', '-cp', tempDir, 'Main'], tempDir, input, runTimeoutMs)
          : await execute(program, [], tempDir, input, runTimeoutMs);
      return { ...result, ok: result.exitCode === 0 && !result.timedOut && !result.truncated && !result.cancelled, phase: 'run', language, compileStderr: compile ? compile.stderr : '', durationMs: Date.now() - start };
    } finally {
      busy = false;
      activeChild = null;
      if (tempDir) await fsp.rm(tempDir, { recursive: true, force: true, maxRetries: 6, retryDelay: 100 }).catch(() => {});
    }
  }

  function cancel() { cancelled = true; killTree(activeChild); return { cancelled: !!busy }; }
  return { runCode, runtimeStatus, cancel };
}

module.exports = { createRunner, validateRequest, bundledGccOptions, LANGUAGES, SOURCE_LIMIT, INPUT_LIMIT };
