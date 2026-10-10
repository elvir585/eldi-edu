<?php
declare(strict_types=1);
require __DIR__.'/../website/eldi-edu/online/service.php';
function check(bool $ok,string $s):void {if(!$ok)throw new RuntimeException($s);}
function runProgram(string $s,array $input=[]):array{$r=new SchoolRuntime();return $r->run($r->compile($s),$input);}
function rejects(string $s):void{try{runProgram($s);throw new RuntimeException('Accepted unsafe/invalid program: '.$s);}catch(ClassroomError){}}
foreach(Classroom::practicalCatalog() as $task)foreach($task['cases'] as $c){check(runProgram($task['reference'],$c['input'])===$c['output'],$task['title'].' failed');}
$checks=[
 ["print(-2 ** 2)\nprint(2 ** -2)\nprint(-7 // 3)\nprint(-7 % 3)",['-4','0.25','-3','2']],
 ["x = 0\nif 0 and 1 / 0:\n    x = 1\nelif 1 < 2 < 3:\n    x = 2\nelse:\n    x = 3\nprint(x)",['2']],
 ["s = 0\nfor i in range(5, 0, -1):\n    if i == 4:\n        continue\n    if i == 1:\n        break\n    s += i\nprint(s)",['10']],
 ["x = 0\ns = 0\nwhile x < 5:\n    x += 1\n    if x == 2:\n        continue\n    s += x\nprint(s)",['13']],
 ["print(int(-2.7))\nprint(abs(-5))\nprint(min(5, 1, 8))\nprint(max(1, 9))\nprint(not 1 == 2)",['-2','5','1','9','True']],
 ["s = 0\nfor i in range(3):\n    for j in range(2):\n        s += 1\nprint(s)",['6']],
 ["print(7 // -3)\nprint(7 % -3)\nprint(2 ** 3 ** 2)",['-3','-2','512']]
];foreach($checks as [$s,$expected])check(runProgram($s)===$expected,'Semantic mismatch: '.$s);
foreach(["import os","print(open(1))","print(eval(1))","print(__import__(1))","x = [1, 2]","print(x)","print(1 / 0)","print(2 ** 99)","print(10000000000000)","for i in range(1, 9, 0):\n    pass","while True:\n    pass","for i in range(1000000000000):\n    pass","print('x' * 999)","if 1:\n  print(2)","if 1:\n    print(2)\n print(3)","break","print(int(input()))","print(".str_repeat('(',40).'1'.str_repeat(')',40).")"] as $s)rejects($s);
$workspace=['blocks'=>['languageVersion'=>0,'blocks'=>[['type'=>'task_read','fields'=>['NAME'=>'a'],'next'=>['block'=>['type'=>'task_read','fields'=>['NAME'=>'b'],'next'=>['block'=>['type'=>'task_print','fields'=>['EXPR'=>'a + b']]]]]]]]];
check(runProgram(SchoolRuntime::blocksSource($workspace),[7,8])===['15'],'Blocks did not execute');
$bad=$workspace;$bad['blocks']['blocks'][0]['type']='system';try{SchoolRuntime::blocksSource($bad);throw new RuntimeException('Unknown block accepted');}catch(ClassroomError){}
$bad=$workspace;$bad['blocks']['blocks'][0]['fields']['NAME']="n\nprint(99)";try{SchoolRuntime::blocksSource($bad);throw new RuntimeException('Block injection accepted');}catch(ClassroomError){}
$for=['blocks'=>['blocks'=>[['type'=>'task_set','fields'=>['NAME'=>'s','EXPR'=>'0'],'next'=>['block'=>['type'=>'task_for','fields'=>['NAME'=>'i','FROM'=>'1','TO'=>'6','STEP'=>'1'],'inputs'=>['DO'=>['block'=>['type'=>'task_set','fields'=>['NAME'=>'s','EXPR'=>'s+i']]]],'next'=>['block'=>['type'=>'task_print','fields'=>['EXPR'=>'s']]]]]]]]];
check(runProgram(SchoolRuntime::blocksSource($for))===['15'],'Blocks loop failed');
echo "School runtime: 70 reference cases; arithmetic, branching, nested loops, short circuit, budgets, unsupported syntax and block validation PASS\n";
