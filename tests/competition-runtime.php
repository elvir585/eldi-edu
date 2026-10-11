<?php
declare(strict_types=1);
require __DIR__.'/../website/eldi-edu/online/service.php';
function ensure(bool $ok,string $message):void{if(!$ok)throw new RuntimeException($message);}
// Pure grading methods do not access PDO. HTTP tests below cover authenticated database actions.
$app=(new ReflectionClass(Classroom::class))->newInstanceWithoutConstructor();
$count=0;
foreach(Classroom::competitionCatalog() as $bank){foreach($bank['questions'] as $q){
 $answer=match($q['mode']){'output'=>['value'=>$q['answer']],'fill'=>['gaps'=>$q['solution']],'order'=>['order'=>$q['solution']],default=>['language'=>'python','source'=>$q['reference']]};
 $r=$app->competitionResult($q,$answer);ensure($r['score']==10,$q['id'].' not perfect');$count+=$r['total'];
 $trial=$app->competitionResult($q,$answer,true);ensure($trial['total']===($q['mode']==='output'?1:min(2,count($q['cases']))),'Wrong trial count');
 if($q['mode']!=='output')ensure(count($trial['results'][0]['input'])===count($q['cases'][0]['input']),'Missing trial details');
 else ensure(!isset($trial['results'][0]['expected']),'Output answer leaked');
}}
ensure($count===219,'Wrong case count');
$q=Classroom::competitionCatalog()['competition-1']['questions'][5];
try{$app->competitionSource($q,['order'=>array_fill(0,count($q['pieces']),$q['pieces'][0]['id'])]);throw new RuntimeException('Duplicate pieces accepted');}catch(ClassroomError){}
$q=Classroom::competitionCatalog()['competition-1']['questions'][2];
try{$app->competitionSource($q,['gaps'=>["b)\nprint(999)#"]]);throw new RuntimeException('Gap injection accepted');}catch(ClassroomError){}
$q=Classroom::competitionCatalog()['competition-3']['questions'][9];
try{$app->competitionResult($q,['language'=>'python','source'=>'print(0)']);throw new RuntimeException('Required loop ignored');}catch(ClassroomError){}
try{$app->competitionResult($q,['language'=>'python','source'=>"a = float(input())\nn = int(input())\ns = 0\nwhile n > 0:\n    s += a\n    n -= 1\nprint(s)"]);throw new RuntimeException('WHILE accepted in revised contest');}catch(ClassroomError){}
$start=microtime(true);$r=$app->competitionResult($q,['language'=>'python','source'=>"for i in range(1000000000):\n    pass"]);ensure($r['score']==0&&microtime(true)-$start<2,'Unbounded execution');
echo "Competition: safe interpreter, 219 cases, private trials, malformed orders/gaps, required loops and bounded execution PASS\n";
