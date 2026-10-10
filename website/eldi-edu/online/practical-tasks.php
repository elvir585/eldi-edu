<?php
declare(strict_types=1);
$tasks=[
 'sum'=>['Zbir dva broja','Učitaj dva cijela broja, svaki u svom redu. Ispiši njihov zbir.',"a = int(input())\nb = int(input())\nprint(a + b)",[[2,3],[-4,9],[0,0],[50,-50],[7,12],[-8,-3],[1000,299],[13,0],[-20,5],[999,1]],fn($x)=>$x[0]+$x[1]],
 'rectangle'=>['Obim pravougaonika','Učitaj dvije pozitivne cjelobrojne dužine stranica, svaku u svom redu. Ispiši obim pravougaonika.',"a = int(input())\nb = int(input())\nprint(2 * (a + b))",[[3,5],[1,1],[2,7],[8,8],[10,4],[100,3],[19,20],[7,11],[50,80],[1,99]],fn($x)=>2*($x[0]+$x[1])],
 'maximum'=>['Veći broj','Učitaj dva cijela broja, svaki u svom redu. Ispiši veći. Ako su jednaki, ispiši taj broj.',"a = int(input())\nb = int(input())\nif a > b:\n    print(a)\nelse:\n    print(b)",[[4,9],[8,2],[0,0],[-3,-8],[-5,0],[10,10],[300,999],[14,-2],[-100,-1],[7,6]],fn($x)=>max($x)],
 'even'=>['Paran ili neparan','Učitaj cijeli broj. Ispiši 1 ako je paran, a 0 ako je neparan. I nula je paran broj.',"n = int(input())\nif n % 2 == 0:\n    print(1)\nelse:\n    print(0)",[[8],[3],[0],[-4],[-7],[100],[999],[22],[1],[-1001]],fn($x)=>$x[0]%2===0?1:0],
 'series'=>['Zbir od 1 do n','Učitaj cijeli broj n (0–100). Izračunaj i ispiši zbir brojeva od 1 do n. Za n = 0 ispiši 0.',"n = int(input())\ns = 0\nfor i in range(1, n + 1):\n    s += i\nprint(s)",[[5],[0],[1],[2],[10],[20],[50],[99],[100],[7]],fn($x)=>$x[0]*($x[0]+1)/2],
 'factorial'=>['Proizvod od 1 do n','Učitaj cijeli broj n (0–10). Ispiši proizvod brojeva od 1 do n. Za n = 0 rezultat je 1.',"n = int(input())\np = 1\nfor i in range(1, n + 1):\n    p *= i\nprint(p)",[[4],[0],[1],[2],[3],[5],[6],[7],[9],[10]],function($x){$p=1;for($i=1;$i<=$x[0];$i++)$p*=$i;return $p;}],
 'digits'=>['Zbir cifara','Učitaj nenegativan cijeli broj (0–999999). Ispiši zbir njegovih cifara.',"n = int(input())\ns = 0\nwhile n > 0:\n    s += n % 10\n    n //= 10\nprint(s)",[[347],[0],[1],[10],[99],[1000],[123456],[999999],[50005],[808]],fn($x)=>array_sum(str_split((string)$x[0]))]
];
$out=[];foreach($tasks as $key=>[$title,$prompt,$reference,$inputs,$answer]){
 $cases=array_map(fn($x)=>['input'=>$x,'output'=>[(string)$answer($x)]],$inputs);
 $out['practice-'.$key]=['title'=>'Praktično · '.$title,'grade'=>0,'subject'=>'Python / blokovi','featured'=>false,'practical'=>true,'intro'=>$prompt,'questions'=>[['prompt'=>$prompt,'points'=>100,'answer'=>0,'explanation'=>$reference]],'starter'=>count($inputs[0])===2?"a = int(input())\nb = int(input())\n# Napiši rješenje ispod\n":"n = int(input())\n# Napiši rješenje ispod\n",'reference'=>$reference,'examples'=>array_slice($cases,0,2),'cases'=>$cases];
}return $out;
