<?php
declare(strict_types=1);

/** Bounded interpreter for the documented numeric school subset. Never invokes PHP/Python eval or a process. */
final class SchoolRuntime {
 private array $tokens=[],$lines=[],$vars=[],$input=[],$output=[];
 private int $pos=0,$line=0,$steps=0,$depth=0;
 private float $started;
 public function __construct(){ $this->started=microtime(true); }
 private function fail(string $s):never {throw new ClassroomError($s);}
 private function tick():void {if(++$this->steps>40000||microtime(true)-$this->started>1.0)$this->fail('Program je prekoračio ograničenje rada. Provjeri završava li petlja.');}
 private function num(mixed $n):float|int {
  if(is_bool($n))return $n?1:0;
  if((!is_int($n)&&!is_float($n))||!is_finite((float)$n)||abs($n)>1e12)$this->fail('Koristi brojeve do 10¹². Ulaz pretvori naredbom int(input()) ili float(input()).');
  return $n;
 }
 private function name(string $n):string {
  if(!preg_match('/^[a-zA-Z][a-zA-Z0-9_]{0,31}$/D',$n)||in_array($n,['if','else','elif','for','in','while','break','continue','pass','and','or','not','True','False','int','float','abs','min','max','input','print','range'],true))$this->fail('Neispravno ime promjenljive: '.$n);
  return $n;
 }
 private function take(?string $t=null):string { $s=$this->tokens[$this->pos]??'';if($t!==null&&$s!==$t)$this->fail('Očekivano je „'.$t.'“.');$this->pos++;return $s; }
 private function peek():string{return $this->tokens[$this->pos]??'';}
 private function tokenize(string $s):void {
  $this->tokens=[];$this->pos=0;$this->depth=0;$offset=0;
  while($offset<strlen($s)){
   if(!preg_match('/\G\s*(\d+(?:\.\d*)?|\.\d+|[A-Za-z][A-Za-z0-9_]*|\*\*|\/\/|==|!=|<=|>=|[+*\/%(),<>-])/A',$s,$m,0,$offset))$this->fail('Nepodržan zapis u izrazu. Školski režim koristi brojeve, promjenljive i osnovne naredbe.');
   $this->tokens[]=$m[1];$offset+=strlen($m[0]);if(count($this->tokens)>200)$this->fail('Izraz je predug.');
  }
 }
 private function expressions(string $s):array {
  $this->tokenize(trim($s));$out=[];
  if(!$this->tokens)$this->fail('Nedostaje izraz.');
  do{$out[]=$this->logical('or');if($this->peek()!==',')break;$this->take(',');}while(true);
  if($this->peek()!=='')$this->fail('Neispravan završetak izraza.');return $out;
 }
 private function expression(string $s):array {$v=$this->expressions($s);if(count($v)!==1)$this->fail('Ovdje upiši jedan izraz.');return $v[0];}
 private function logical(string $op):array {
  $left=$op==='or'?$this->logical('and'):$this->negation();
  while($this->peek()===$op){$this->take();$left=['binary',$op,$left,$op==='or'?$this->logical('and'):$this->negation()];}return $left;
 }
 private function negation():array {
  if($this->peek()==='not'){if(++$this->depth>32)$this->fail('Previše ugniježđen izraz.');$this->take();$v=['unary','not',$this->negation()];$this->depth--;return $v;}
  $first=$this->sum();$parts=[];while(in_array($this->peek(),['==','!=','<','>','<=','>='],true)){$op=$this->take();$parts[]=[$op,$this->sum()];}return $parts?['compare',$first,$parts]:$first;
 }
 private function sum():array {$v=$this->term();while(in_array($this->peek(),['+','-'],true)){$op=$this->take();$v=['binary',$op,$v,$this->term()];}return $v;}
 private function term():array {$v=$this->factor();while(in_array($this->peek(),['*','/','//','%'],true)){$op=$this->take();$v=['binary',$op,$v,$this->factor()];}return $v;}
 private function factor():array {
  if(++$this->depth>32)$this->fail('Previše ugniježđen izraz.');
  if(in_array($this->peek(),['+','-'],true)){$op=$this->take();$v=['unary',$op,$this->factor()];}
  else{$v=$this->atom();if($this->peek()==='**'){$this->take();$v=['binary','**',$v,$this->factor()];}}
  $this->depth--;return $v;
 }
 private function atom():array {
  $s=$this->take();if($s==='')$this->fail('Izraz nije dovršen.');
  if(is_numeric($s))return ['number',$this->num(str_contains($s,'.')?(float)$s:(int)$s)];
  if($s==='('){$v=$this->logical('or');$this->take(')');return $v;}
  if($s==='True'||$s==='False')return ['number',$s==='True'];
  if($this->peek()==='('){
   if(!in_array($s,['input','int','float','abs','min','max'],true))$this->fail('Funkcija „'.$s.'“ nije u školskom režimu.');
   $this->take('(');$args=[];if($this->peek()!==')')do{$args[]=$this->logical('or');if($this->peek()!==',')break;$this->take(',');}while(true);$this->take(')');
   $count=count($args);if(($s==='input'&&$count!==0)||(in_array($s,['int','float','abs'],true)&&$count!==1)||(in_array($s,['min','max'],true)&&($count<2||$count>10)))$this->fail('Provjeri broj argumenata funkcije '.$s.'.');
   return ['call',$s,$args];
  }
  return ['var',$this->name($s)];
 }
 public function compile(string $source):array {
  if(strlen($source)>12000)$this->fail('Program može imati najviše 12 KB.');$this->lines=[];$this->line=0;
  foreach(explode("\n",str_replace("\r",'',$source)) as $i=>$raw){
   if(str_contains($raw,"\t"))$this->fail('Red '.($i+1).': koristi četiri razmaka umjesto tabulatora.');
   $raw=explode('#',$raw,2)[0];if(trim($raw)==='')continue;
   $indent=strlen($raw)-strlen(ltrim($raw,' '));if($indent%4||$indent>64)$this->fail('Red '.($i+1).': uvlačenje je po četiri razmaka, do 16 nivoa.');
   $this->lines[]=['indent'=>$indent,'text'=>trim($raw),'line'=>$i+1];
  }
  if(!$this->lines||count($this->lines)>200)$this->fail('Program treba imati 1–200 naredbi.');
  $ast=$this->suite(0,0);if($this->line!==count($this->lines))$this->fail('Provjeri uvlačenje programa.');return $ast;
 }
 private function body(int $indent,int $loops):array {
  if(!isset($this->lines[$this->line])||$this->lines[$this->line]['indent']!==$indent+4)$this->fail('Ispod uslova ili petlje upiši naredbu uvučenu četiri razmaka.');
  return $this->suite($indent+4,$loops);
 }
 private function suite(int $indent,int $loops):array {
  $out=[];
  while(isset($this->lines[$this->line])){
   $l=$this->lines[$this->line];if($l['indent']<$indent)break;if($l['indent']!==$indent)$this->fail('Red '.$l['line'].': neočekivano uvlačenje.');
   $s=$l['text'];if(preg_match('/^(else|elif)\b/',$s))break;$this->line++;
   try{
    if(preg_match('/^if (.+):$/D',$s,$m)){
     $branches=[[$this->expression($m[1]),$this->body($indent,$loops)]];$other=[];
     while(isset($this->lines[$this->line])&&$this->lines[$this->line]['indent']===$indent&&preg_match('/^elif (.+):$/D',$this->lines[$this->line]['text'],$m)){$this->line++;$branches[]=[$this->expression($m[1]),$this->body($indent,$loops)];}
     if(isset($this->lines[$this->line])&&$this->lines[$this->line]['indent']===$indent&&$this->lines[$this->line]['text']==='else:'){$this->line++;$other=$this->body($indent,$loops);}
     $out[]=['if',$branches,$other];
    }elseif(preg_match('/^while (.+):$/D',$s,$m)){$e=$this->expression($m[1]);$out[]=['while',$e,$this->body($indent,$loops+1)];}
    elseif(preg_match('/^for ([A-Za-z][A-Za-z0-9_]*) in range\((.*)\):$/D',$s,$m)){$n=$this->name($m[1]);$args=$this->expressions($m[2]);if(count($args)>3)$this->fail('range prima 1–3 cijela broja.');$out[]=['for',$n,$args,$this->body($indent,$loops+1)];}
    elseif(preg_match('/^print\((.*)\)$/D',$s,$m)){$out[]=['print',$this->expressions($m[1])];}
    elseif(preg_match('/^([A-Za-z][A-Za-z0-9_]*)\s*(\*\*=|\/\/=|[+*\/%-]?=)\s*(.+)$/D',$s,$m)){$name=$this->name($m[1]);$e=$this->expression($m[3]);$out[]=['set',$name,$m[2]==='='?$e:['binary',substr($m[2],0,-1),['var',$name],$e]];}
    elseif(in_array($s,['pass','break','continue'],true)){if($s!=='pass'&&!$loops)$this->fail('break i continue koriste se unutar petlje.');$out[]=[$s];}
    else $this->fail('Ova naredba nije podržana u školskom režimu. Otvori „Podržane naredbe“.');
   }catch(ClassroomError $e){$this->fail('Red '.$l['line'].': '.$e->getMessage());}
  }return $out;
 }
 private function value(array $a):mixed {
  $this->tick();$tag=$a[0];
  if($tag==='number')return $a[1];
  if($tag==='var'){if(!array_key_exists($a[1],$this->vars))$this->fail('Promjenljiva '.$a[1].' još nema vrijednost.');return $this->vars[$a[1]];}
  if($tag==='unary'){$v=$this->value($a[2]);return match($a[1]){'not'=>!$v,'-'=>-$this->num($v),default=>$this->num($v)};}
  if($tag==='compare'){$left=$this->num($this->value($a[1]));foreach($a[2] as [$op,$expr]){$right=$this->num($this->value($expr));$ok=match($op){'=='=>$left==$right,'!='=>$left!=$right,'<'=>$left<$right,'>'=>$left>$right,'<='=>$left<=$right,'>='=>$left>=$right};if(!$ok)return false;$left=$right;}return true;}
  if($tag==='call'){
   $fn=$a[1];if($fn==='input'){if(!$this->input)$this->fail('Program traži više ulaznih brojeva nego što zadatak daje.');return (string)array_shift($this->input);}
   $args=array_map(fn($x)=>$this->value($x),$a[2]);
   if($fn==='int'||$fn==='float'){
    $v=$args[0];if(is_string($v)&&!preg_match($fn==='int'?'/^[+-]?\d+$/D':'/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/D',trim($v)))$this->fail('Ulaz se ne može pretvoriti u broj.');
    $v=$this->num(is_string($v)?(float)$v:$v);return $fn==='int'?(int)$v:(float)$v;
   }
   $args=array_map(fn($x)=>$this->num($x),$args);return match($fn){'abs'=>abs($args[0]),'min'=>min($args),'max'=>max($args)};
  }
  $op=$a[1];$left=$this->value($a[2]);if($op==='and')return $left?$this->value($a[3]):$left;if($op==='or')return $left?:$this->value($a[3]);
  $left=$this->num($left);$right=$this->num($this->value($a[3]));
  if(in_array($op,['/','//','%'],true)&&$right==0)$this->fail('Dijeljenje nulom nije dozvoljeno.');
  if($op==='**'&&(abs($right)>12||($left<0&&floor($right)!=$right)||($left==0&&$right<0)))$this->fail('Ovaj stepen je izvan školskog režima.');
  return $this->num(match($op){'+'=>$left+$right,'-'=>$left-$right,'*'=>$left*$right,'/'=>$left/$right,'//'=>floor($left/$right),'%'=>$left-floor($left/$right)*$right,'**'=>$left**$right});
 }
 private function execute(array $nodes):?string {
  foreach($nodes as $a){$this->tick();switch($a[0]){
   case 'set':$this->vars[$a[1]]=$this->value($a[2]);break;
   case 'print':foreach($a[1] as $expr){$v=$this->value($expr);$this->output[]=is_bool($v)?($v?'True':'False'):(string)$this->num($v);if(count($this->output)>200)$this->fail('Previše ispisa.');}break;
   case 'if':$chosen=$a[2];foreach($a[1] as [$cond,$body])if($this->value($cond)){$chosen=$body;break;}$signal=$this->execute($chosen);if($signal)return $signal;break;
   case 'while':while($this->value($a[1])){$this->tick();$signal=$this->execute($a[2]);if($signal==='break')break;}break;
   case 'for':
    $range=array_map(fn($e)=>$this->num($this->value($e)),$a[2]);foreach($range as $n)if(floor($n)!=$n)$this->fail('range koristi cijele brojeve.');
    [$start,$end,$step]=count($range)===1?[0,$range[0],1]:[$range[0],$range[1],$range[2]??1];if($step==0)$this->fail('Korak petlje ne može biti nula.');
    for($i=$start;$step>0?$i<$end:$i>$end;$i+=$step){$this->tick();$this->vars[$a[1]]=$i;$signal=$this->execute($a[3]);if($signal==='break')break;}break;
   case 'break':case 'continue':return $a[0];case 'pass':break;
  }}return null;
 }
 public function run(array $ast,array $input):array {$this->vars=[];$this->input=$input;$this->output=[];$this->steps=0;$this->started=microtime(true);$this->execute($ast);return $this->output;}
 public static function blocksSource(array $workspace):string {
  $roots=$workspace['blocks']['blocks']??[];if(!is_array($roots)||count($roots)!==1)throw new ClassroomError('Spoji sve blokove u jedan program, od vrha prema dnu.');$count=0;
  $walk=function($b,int $depth)use(&$walk,&$count):string{
   $out='';while($b){if(!is_array($b)||++$count>150||$depth>16)throw new ClassroomError('Previše blokova ili nivoa.');
    if(($b['enabled']??true)===false||!empty($b['disabled']))throw new ClassroomError('Ukloni isključene blokove.');
    $f=$b['fields']??[];$get=function(string $key)use($f):string{$v=$f[$key]??'';if(!is_string($v)||strlen($v)>500||preg_match('/[\r\n\t#]/',$v))throw new ClassroomError('Neispravan podatak bloka.');return $v;};
    $pad=str_repeat('    ',$depth);$type=$b['type']??'';
    $body=fn($key)=>$walk($b['inputs'][$key]['block']??null,$depth+1)?:$pad."    pass\n";
    switch($type){
     case 'task_read':$out.=$pad.$get('NAME')." = int(input())\n";break;
     case 'task_set':$out.=$pad.$get('NAME').' = '.$get('EXPR')."\n";break;
     case 'task_print':$out.=$pad.'print('.$get('EXPR').")\n";break;
     case 'task_if':$out.=$pad.'if '.$get('EXPR').":\n".$body('DO').$pad."else:\n".$body('ELSE');break;
     case 'task_for':$out.=$pad.'for '.$get('NAME').' in range('.$get('FROM').', '.$get('TO').', '.$get('STEP')."):\n".$body('DO');break;
     case 'task_while':$out.=$pad.'while '.$get('EXPR').":\n".$body('DO');break;
     default:throw new ClassroomError('Nepodržan blok u praktičnoj provjeri.');
    }$b=$b['next']['block']??null;
   }return $out;
  };return $walk($roots[0],0);
 }
}
