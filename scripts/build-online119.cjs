'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.join(__dirname,'../website/eldi-edu/online');
const dir=path.join(root,'v119');fs.mkdirSync(dir,{recursive:true});
for(const file of ['service.php','section-service.php','section-tests.php','complete-service.php','school-runtime.php','practical-tasks.php','staff-service.php','cleanup-service.php','competition-service.php','competition-bank.php'])fs.copyFileSync(path.join(root,file),path.join(dir,file));
fs.writeFileSync(path.join(dir,'.htaccess'),'Require all denied\n');
fs.writeFileSync(path.join(root,'classroom-119.php'),fs.readFileSync(path.join(root,'api.php'),'utf8').replace("require __DIR__.'/service.php';","require __DIR__.'/v119/service.php';"));
const modern=path.join(root,'v132');fs.mkdirSync(modern,{recursive:true});fs.cpSync(dir,modern,{recursive:true});
fs.writeFileSync(path.join(root,'classroom-132.php'),fs.readFileSync(path.join(root,'api.php'),'utf8').replace("require __DIR__.'/service.php';","require __DIR__.'/v132/service.php';"));
console.log('Classroom 119: versioned PHP entry and dependencies built.');

const staff=path.join(root,'vstaff');fs.mkdirSync(staff,{recursive:true});fs.cpSync(dir,staff,{recursive:true});
fs.writeFileSync(path.join(root,'classroom-staff.php'),fs.readFileSync(path.join(root,'api.php'),'utf8').replace("require __DIR__.'/service.php';","require __DIR__.'/vstaff/service.php';"));

const cleanup=path.join(root,'vcleanup');fs.mkdirSync(cleanup,{recursive:true});fs.cpSync(dir,cleanup,{recursive:true});
fs.writeFileSync(path.join(root,'classroom-cleanup.php'),fs.readFileSync(path.join(root,'api.php'),'utf8').replace("require __DIR__.'/service.php';","require __DIR__.'/vcleanup/service.php';"));

const competition=path.join(root,'vcompetition');fs.mkdirSync(competition,{recursive:true});fs.cpSync(dir,competition,{recursive:true});
fs.writeFileSync(path.join(root,'classroom-competition.php'),fs.readFileSync(path.join(root,'api.php'),'utf8').replace("require __DIR__.'/service.php';","require __DIR__.'/vcompetition/service.php';"));
