'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.join(__dirname,'../website/eldi-edu/online');
const dir=path.join(root,'v119');fs.mkdirSync(dir,{recursive:true});
for(const file of ['service.php','section-service.php','section-tests.php','complete-service.php','school-runtime.php','practical-tasks.php'])fs.copyFileSync(path.join(root,file),path.join(dir,file));
fs.writeFileSync(path.join(dir,'.htaccess'),'Require all denied\n');
fs.writeFileSync(path.join(root,'classroom-119.php'),fs.readFileSync(path.join(root,'api.php'),'utf8').replace("require __DIR__.'/service.php';","require __DIR__.'/v119/service.php';"));
console.log('Classroom 119: versioned PHP entry and dependencies built.');
