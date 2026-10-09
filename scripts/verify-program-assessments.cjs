'use strict';
// Verify every Python/C++ reference against all eight cases. Each C++ file is compiled once.
// The UI smoke test separately checks the production GradeService/IPC/editor path.
const fs=require('node:fs'),fsp=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {execFileSync}=require('node:child_process');
const {createRunner,bundledGccOptions}=require('../desktop/runner.cjs');
const {compareOutput}=require('../app/program-assessment.js');
const tasks=require('../content/program-assessments.js'),bank=require('../desktop/program-assessment-data.cjs');
const root=path.resolve(__dirname,'..'),bundled=process.argv.includes('--bundled');
function executable(file,names){if(fs.existsSync(file))return{file,bundled:true};if(bundled)throw Error('Nedostaje ugrađeni alat: '+file);for(const folder of(process.env.PATH||process.env.Path||'').split(path.delimiter))for(const name of names){const candidate=path.resolve(folder||'.',name);try{fs.accessSync(candidate,process.platform==='win32'?fs.constants.F_OK:fs.constants.X_OK);return{file:candidate,bundled:false};}catch{}}throw Error('Nedostaje razvojni alat '+names.join('/'));}
async function main(){
  const runtimeRoot=path.join(root,'runtimes'),win=process.platform==='win32',runner=createRunner({runtimeRoot,allowSystem:!bundled}),status=runner.runtimeStatus();
  if(!status.python.available||!status.cpp.available)throw Error('Provjera zahtijeva Python i C++ alate.');
  const python=executable(path.join(runtimeRoot,'python',win?'python.exe':'python3'),win?['python.exe']:['python3','python']);
  const cpp=executable(path.join(runtimeRoot,'gcc','bin',win?'g++.exe':'g++'),[win?'g++.exe':'g++']);
  const report={edition:'12.0.0',platform:process.platform,bundled,date:new Date().toISOString(),tasks:tasks.length,programs:0,cases:0,passed:0,results:[]};
  const temp=await fsp.mkdtemp(path.join(os.tmpdir(),'eldi-assessment-verify-'));
  try{
    for(const t of tasks){
      const sourcePy=path.join(temp,'main.py'),sourceCpp=path.join(temp,'main.cpp'),binary=path.join(temp,win?'program.exe':'program');
      fs.writeFileSync(sourcePy,bank[t.id].solutions.python,'utf8');fs.writeFileSync(sourceCpp,bank[t.id].solutions.cpp,'utf8');
      const args=[...(win&&cpp.bundled?bundledGccOptions(runtimeRoot,'cpp'):[]),sourceCpp,'-o',binary,'-std=c++17','-O0','-Wall','-Wextra','-fdiagnostics-color=never',...(win?['-static-libgcc','-static-libstdc++']:[])];
      execFileSync(cpp.file,args,{cwd:temp,windowsHide:true,timeout:30000,maxBuffer:256*1024,stdio:['ignore','pipe','pipe']});
      for(const language of['python','cpp']){
        const row={taskId:t.id,language,passed:0,total:bank[t.id].tests.length};
        for(let i=0;i<bank[t.id].tests.length;i++){
          const sample=bank[t.id].tests[i],output=execFileSync(language==='python'?python.file:binary,language==='python'?['-I','-X','utf8','-u',sourcePy]:[],{cwd:temp,input:sample.input,encoding:'utf8',windowsHide:true,timeout:6000,maxBuffer:256*1024});
          report.cases++;if(!compareOutput(output,sample.output))throw Error(`${t.id}/${language}/test ${i+1}: netačan referentni rezultat.`);row.passed++;report.passed++;
        }
        report.programs++;report.results.push(row);
      }
      console.log(`${t.id}: Python 8/8, C++ 8/8`);
    }
    const outputArg=process.argv.indexOf('--output'),output=outputArg>=0?process.argv[outputArg+1]:path.join(root,'content','assessment-verification.json');
    if(!output)throw Error('Nedostaje putanja izvještaja.');fs.writeFileSync(path.resolve(output),JSON.stringify(report,null,2)+'\n');
    console.log(`Referentni programi: ${report.programs}; stvarno izvršeni testovi: ${report.passed}/${report.cases}.`);
    return report;
  }finally{await fsp.rm(temp,{recursive:true,force:true,maxRetries:6,retryDelay:100});}
}
module.exports=main;
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
