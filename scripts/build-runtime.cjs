'use strict';
// Run on a Windows x64 GitHub Actions runner after setup-java and setup-msys2.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const runtimeRoot = path.join(root, 'runtimes');
const PYTHON_VERSION = '3.14.8';
const PYTHON_URL = `https://www.python.org/ftp/python/${PYTHON_VERSION}/python-${PYTHON_VERSION}-embed-amd64.zip`;
const PYTHON_SHA256 = 'a93abe456ab01bd96d7a085b3cdb6566b3063f4241360d114142fbdb07f0a310';

async function main() {
  if (process.platform !== 'win32' || process.arch !== 'x64') throw new Error('Ugrađene Windows alate pripremite na Windows x64 računaru ili kroz GitHub Actions.');
  const javaSource = process.env.JAVA_HOME;
  const gccSource = process.env.ELDI_GCC_HOME || (process.env.MSYS2_LOCATION ? path.join(process.env.MSYS2_LOCATION, 'ucrt64') : null);
  if (!javaSource || !gccSource) throw new Error('Potrebne su varijable JAVA_HOME i ELDI_GCC_HOME (ili MSYS2_LOCATION).');
  await fs.access(path.join(javaSource, 'bin', 'javac.exe'));
  await fs.access(path.join(gccSource, 'bin', 'gcc.exe'));
  await fs.access(path.join(gccSource, 'bin', 'g++.exe'));
  await fs.rm(runtimeRoot, { recursive: true, force: true });
  await fs.mkdir(runtimeRoot, { recursive: true });
  const response = await fetch(PYTHON_URL, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`Preuzimanje Pythona: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 32 * 1024 * 1024) throw new Error('Neočekivana veličina Python paketa.');
  const actualHash = crypto.createHash('sha256').update(bytes).digest('hex');
  if (actualHash !== PYTHON_SHA256) throw new Error('SHA-256 provjera Python paketa nije prošla.');
  const zipPath = path.join(runtimeRoot, 'python-embed.zip');
  const pythonDestination = path.join(runtimeRoot, 'python');
  await fs.writeFile(zipPath, bytes);
  execFileSync('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', 'Expand-Archive -LiteralPath $env:ELDI_RUNTIME_ZIP -DestinationPath $env:ELDI_RUNTIME_DEST -Force'], {
    env: { ...process.env, ELDI_RUNTIME_ZIP: zipPath, ELDI_RUNTIME_DEST: pythonDestination }, stdio: 'inherit', timeout: 60000
  });
  await fs.rm(zipPath);
  // The complete prefixes retain GCC's headers, libraries, binutils and DLLs,
  // and the JDK's javac modules. Copying only *.exe would break compilation.
  await fs.cp(gccSource, path.join(runtimeRoot, 'gcc'), { recursive: true, dereference: true });
  await fs.cp(javaSource, path.join(runtimeRoot, 'java'), { recursive: true, dereference: true });
  const gccBin = path.join(runtimeRoot, 'gcc', 'bin');
  const javaBin = path.join(runtimeRoot, 'java', 'bin');
  const env = { ...process.env, PATH: [gccBin, javaBin, process.env.PATH || process.env.Path || ''].join(path.delimiter) };
  const version = (exe, args) => execFileSync(exe, args, { encoding: 'utf8', env, timeout: 15000, stdio: ['ignore', 'pipe', 'pipe'] }).trim().split(/\r?\n/)[0];
  const gccExecutable = path.join(gccBin, 'gcc.exe');
  const triple = version(gccExecutable, ['-dumpmachine']);
  const gccVersion = version(gccExecutable, ['-dumpfullversion']);
  for (const file of [path.join(runtimeRoot, 'gcc', 'include', 'stdio.h'), path.join(runtimeRoot, 'gcc', 'lib', 'gcc', triple, gccVersion, 'cc1.exe'), path.join(runtimeRoot, 'gcc', 'include', 'c++', gccVersion, 'iostream')]) await fs.access(file);
  const manifest = {
    createdAt: new Date().toISOString(), platform: 'win32', arch: 'x64',
    python: { version: PYTHON_VERSION, url: PYTHON_URL, sha256: PYTHON_SHA256 },
    gcc: { source: 'MSYS2 UCRT64', version: version(gccExecutable, ['--version']), triple, fullVersion: gccVersion, sysroot: 'gcc' },
    java: { source: 'Eclipse Temurin JDK', version: version(path.join(javaBin, 'javac.exe'), ['-version']) }
  };
  await fs.writeFile(path.join(runtimeRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  // Exercise the relocated prefix with the same stripped environment as the
  // desktop runner, so the build cannot succeed by finding the original MSYS2.
  const { createRunner } = require('../desktop/runner.cjs');
  const runner = createRunner({ runtimeRoot, allowSystem: false });
  const probes = {
    c: '#include <stdio.h>\n#include <math.h>\nint main(void){double x=81;printf("%.0f\\n",sqrt(x));return 0;}\n',
    cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <numeric>\n#include <cmath>\nint main(){std::vector<int> v{3,1,2};std::sort(v.begin(),v.end());std::cout<<std::accumulate(v.begin(),v.end(),0)+std::sqrt(81)<<"\\n";}\n'
  };
  for (const [language, code] of Object.entries(probes)) {
    const result = await runner.runCode({ language, code, input: '' });
    const expected = language === 'c' ? '9' : '15';
    if (!result.ok || result.stdout.trim() !== expected) throw new Error(`Provjera premještenog ${language} alata nije prošla:\n${result.stderr}\n${result.stdout}`);
    console.log(`Premješteni ${language}: zaglavlja, biblioteke i izvršavanje OK.`);
  }
  console.log('Python, GCC/G++ i JDK pripremljeni.');
  console.log(JSON.stringify(manifest, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
