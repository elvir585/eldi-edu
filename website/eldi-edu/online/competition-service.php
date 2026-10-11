<?php
declare(strict_types=1);
trait CompetitionFeatures {
 public static function competitionCatalog():array{return require __DIR__.'/competition-bank.php';}
 public function competitionFor(array $a):array {
  if($a['kind']!=='contest'||count($a['questions'])!==10)throw new ClassroomError('Izaberi takmičarski test.',404);
  return $a['questions'];
 }
 public function competitionPublic(array $a,bool $reveal):array {
  return array_map(function($q)use($reveal){
   $public=array_intersect_key($q,array_flip(['id','mode','title','prompt','points','code','input','starter','template','blanks','pieces','requires','response_kind','answer_label','fraction_inputs','for_only']));
   if($q['mode']!=='output')$public['examples']=array_slice($q['cases'],0,2);
   if($reveal){$public['reference']=$q['reference'];$public['explanation']=$q['explanation'];if($q['mode']==='output')$public['answer']=$q['answer'];}
   return $public;
  },$this->competitionFor($a));
 }
 public function competitionSource(array $q,array $answer):string {
  if($q['mode']==='program')return $this->programSource($answer);
  if($q['mode']==='fill'){
   $gaps=$answer['gaps']??[];if(!is_array($gaps)||count($gaps)!==count($q['blanks']))throw new ClassroomError('Dopuni sve praznine.');
   $replace=[];foreach(array_values($gaps) as $i=>$value){if(!is_string($value)||strlen($value)>200||preg_match('/[\r\n#]/',$value))throw new ClassroomError('U prazninu upiši samo traženi izraz ili operator.');$replace['__'.($i+1).'__']=trim($value);}
   return strtr($q['template'],$replace);
  }
  if($q['mode']==='order'){
   $ids=$answer['order']??[];$pieces=array_column($q['pieces'],'code','id');
   if(!is_array($ids)||count($ids)!==count($pieces))throw new ClassroomError('Složi sve ponuđene blokove.');
   $lines=[];$seen=[];foreach($ids as $id){if(!is_string($id)||!isset($pieces[$id])||isset($seen[$id]))throw new ClassroomError('Koristi svaki ponuđeni blok tačno jednom.');$seen[$id]=true;$lines[]=$pieces[$id];}
   return implode("\n",$lines)."\n";
  }
  throw new ClassroomError('Ovdje se upisuje očekivani ispis.');
 }
 private static function competitionHas(array $nodes,string $required):bool {
  foreach($nodes as $node){$tag=$node[0];if($tag===$required||($required==='loop'&&in_array($tag,['for','while'],true)))return true;
   if($tag==='if'){foreach($node[1] as $branch)if(self::competitionHas($branch[1],$required))return true;if(self::competitionHas($node[2],$required))return true;}
   elseif($tag==='for'&&self::competitionHas($node[3],$required))return true;
   elseif($tag==='while'&&self::competitionHas($node[2],$required))return true;
  }return false;
 }
 private static function competitionEqual(array $actual,array $expected):bool {
  if(count($actual)!==count($expected))return false;
  foreach($actual as $i=>$value){$n=self::number($value);$e=(float)$expected[$i];if($n===null||abs($n-$e)>max(1,abs($e))*1e-9)return false;}return true;
 }
 public function competitionResult(array $q,array $answer,bool $trial=false):array {
  if($q['mode']==='output'){
   $value=self::text($answer['value']??'',500,false);$actual=$value===''?[]:preg_split('/\s+/',trim($value));$passed=self::competitionEqual($actual,$q['cases'][0]['output'])?1:0;
   return ['passed'=>$passed,'total'=>1,'score'=>10*$passed,'answer'=>$value,'results'=>[['passed'=>(bool)$passed]]];
  }
  $source=$this->competitionSource($q,$answer);$runtime=new SchoolRuntime(.08,12000);$ast=$runtime->compile($source);
  if(!empty($q['for_only'])&&self::competitionHas($ast,'while'))throw new ClassroomError('U ovom testu radimo samo FOR petlje. Zamijeni while petlju FOR petljom.');
  if(isset($q['requires'])&&!self::competitionHas($ast,$q['requires']))throw new ClassroomError($q['requires']==='if'?'U ovom zadatku koristi uslov if.':'U ovom zadatku koristi FOR petlju.');
  $cases=$trial?array_slice($q['cases'],0,2):$q['cases'];$passed=0;$results=[];
  foreach($cases as $case){$actual=[];$error='';try{$actual=$runtime->run($ast,$case['input']);}catch(ClassroomError $e){$error=$e->getMessage();}
   $ok=$error===''&&self::competitionEqual($actual,$case['output']);if($ok)$passed++;
   $row=['passed'=>$ok];if($trial)$row+=['input'=>$case['input'],'expected'=>$case['output'],'actual'=>$actual,'error'=>$error];$results[]=$row;
  }
  return ['passed'=>$passed,'total'=>count($cases),'score'=>10*$passed/count($cases),'source'=>$source,'results'=>$results];
 }
 private function competitionQuestion(array $u,string $id,mixed $index):array {
  $a=$this->assignmentFor($u,$id);$questions=$this->competitionFor($a);
  if(!is_int($index)||!isset($questions[$index]))throw new ClassroomError('Izaberi zadatak od 1 do 10.');
  if($u['role']==='student'&&((int)$a['closed']||($a['due_at']&&time()>(int)$a['due_at'])))throw new ClassroomError('Predaja je zatvorena.',409);
  return $questions[$index];
 }
 public function tryCompetition(array $u,string $id,mixed $index,array $answer):array {
  $result=$this->competitionResult($this->competitionQuestion($u,$id,$index),$answer,true);unset($result['answer']);return $result;
 }
 public function competitionViews(array $u,string $id,mixed $index,array $answer):array {
  $q=$this->competitionQuestion($u,$id,$index);$source=$this->competitionSource($q,$answer);$runtime=new SchoolRuntime(.08,12000);
  $ast=$runtime->compile($source);if(!empty($q['for_only'])&&self::competitionHas($ast,'while'))throw new ClassroomError('U ovom testu radimo samo FOR petlje.');
  return ['source'=>$source,'ast'=>$ast];
 }
 public function runCompetition(array $u,string $id,mixed $index,array $answer,mixed $input):array {
  $view=$this->competitionViews($u,$id,$index,$answer);
  if(!is_array($input)||count($input)>30)throw new ClassroomError('Unesi najviše 30 brojeva, svaki u svom redu.');
  $values=[];foreach($input as $value){if(!is_string($value)||strlen($value)>40)throw new ClassroomError('Ulaz treba biti broj.');$value=str_replace(',','.',trim($value));if(!preg_match('/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/D',$value)||!is_finite((float)$value)||abs((float)$value)>1e12)throw new ClassroomError('Unesi konačne brojeve do 10¹².');$values[]=$value;}
  return ['input'=>$values,'output'=>(new SchoolRuntime(.08,12000))->run($view['ast'],$values)];
 }
 public static function competitionInstructions(array $test):string {
  return $test['intro'].' 10 zadataka · 100 bodova. Svaki zadatak nosi 10 bodova. Pitanja o ispisu i broju ponavljanja: 10 bodova za tačan odgovor. Ostali zadaci: bodovi = 10 × broj uspješnih provjera / broj svih provjera. Probni primjeri prikazani su uz zadatak. Nema negativnih bodova. Svi odgovori se predaju zajedno, jednom. Ocjene: 1 ispod 50%, 2 od 50%, 3 od 65%, 4 od 80%, 5 od 90%. Za pisanje programa koristi školske brojčane naredbe: input/print, varijable, računanje, if/elif/else i for/range. Radimo samo FOR petlje. U prva dva pitanja trećeg nivoa brojiš ispise teksta; upisuješ samo broj ponavljanja.';
 }
 public function refreshCompetitions(array $u,string $class):array {
  $this->teacher($u);$this->classFor($u,$class);$catalog=self::competitionCatalog();$counts=['updated'=>0,'preserved'=>0,'current'=>0];
  $ids=$this->run("SELECT a.id FROM eldi3333_assignments a WHERE a.class_id=? AND a.kind='contest' ORDER BY a.id",[$class])->fetchAll(PDO::FETCH_COLUMN);
  $this->db->beginTransaction();
  try{foreach($ids as $id){
   $this->run('SELECT id FROM eldi3333_assignments WHERE id=? FOR UPDATE',[$id])->fetch();
   if($this->isDeleted('assignment',$id))continue;
   $raw=$this->run('SELECT metadata FROM eldi3333_section_tests WHERE assignment_id=? FOR UPDATE',[$id])->fetchColumn();$meta=$raw?json_decode($raw,true,512,JSON_THROW_ON_ERROR):null;$test=$catalog[$meta['bank']??'']??null;if(!$test)continue;
   if(($meta['revision']??1)>=$test['revision']){$counts['current']++;continue;}
   if($this->run('SELECT id FROM eldi3333_submissions WHERE assignment_id=? LIMIT 1 FOR UPDATE',[$id])->fetchColumn()){$counts['preserved']++;continue;}
   $meta['revision']=$test['revision'];$meta['test_title']=$test['title'];$meta['level']=$test['level'];
   $day=DateTimeImmutable::createFromFormat('!Y-m-d',$meta['event_date']);
   $this->run('UPDATE eldi3333_assignments SET title=?,instructions=?,questions=? WHERE id=?',[self::text($test['title'].' · '.$day->format('d.m.Y.'),150),self::competitionInstructions($test),json_encode($test['questions'],JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE),$id]);
   $this->run('UPDATE eldi3333_section_tests SET metadata=? WHERE assignment_id=?',[json_encode($meta,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE),$id]);$counts['updated']++;
  }$this->db->commit();return $counts;}catch(Throwable $e){$this->db->rollBack();throw $e;}
 }
 public function submitCompetitionLocked(array $u,array $a,array $payload):array {
  $this->db->beginTransaction();
  try{
   $this->run('SELECT id FROM eldi3333_assignments WHERE id=? FOR UPDATE',[$a['id']])->fetch();$a=$this->assignmentFor($u,$a['id']);
   $old=$this->run('SELECT id,score,max_score FROM eldi3333_submissions WHERE assignment_id=? AND user_id=?',[$a['id'],$u['id']])->fetch();
   if($old){$this->db->commit();return $old;}
   if((int)$a['closed']||($a['due_at']&&time()>(int)$a['due_at']))throw new ClassroomError('Predaja je zatvorena.',409);
   $revision=$this->sectionMetadata($a['id'])['revision']??1;
   if($revision>=2&&($payload['revision']??null)!==$revision)throw new ClassroomError('Nastavnik je ažurirao ovaj test. Osvježi stranicu i otvori nove zadatke prije predaje.',409);
   $result=$this->submitCompetition($u,$a,$payload);$this->db->commit();return $result;
  }catch(Throwable $e){$this->db->rollBack();throw $e;}
 }
 public function submitCompetition(array $u,array $a,array $payload):array {
  $answers=$payload['answers']??[];if(!is_array($answers)||count($answers)>10||strlen(json_encode($answers,JSON_THROW_ON_ERROR))>1000000)throw new ClassroomError('Predaj najviše deset odgovora, do 1 MB.');
  $clean=[];$score=0;
  foreach($this->competitionFor($a) as $i=>$q){$answer=$answers[$i]??[];if(!is_array($answer))$answer=[];$source='';
   try{if($q['mode']!=='output')$source=$this->competitionSource($q,$answer);$result=$this->competitionResult($q,$answer);}
   catch(ClassroomError $e){$result=['passed'=>0,'total'=>count($q['cases']),'score'=>0,'error'=>$e->getMessage()];}
   $row=['id'=>$q['id'],'mode'=>$q['mode'],'passed'=>$result['passed'],'total'=>$result['total'],'score'=>$result['score'],'error'=>$result['error']??''];
   if($q['mode']==='output')$row['answer']=is_string($answer['value']??null)?substr($answer['value'],0,500):'';else $row['source']=$source;
   $clean[]=$row;$score+=$row['score'];
  }
  $id=self::id();$raw=json_encode(['answers'=>$clean],JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE);
  try{$this->run('INSERT INTO eldi3333_submissions VALUES(?,?,?,?,?,?,?,?,?)',[$id,$a['id'],$u['id'],$raw,$score,100,'Takmičenje: 10 zadataka, ukupno '.$score.' / 100 bodova.',self::sectionGrade($score,100),time()]);}
  catch(PDOException $e){$old=$this->run('SELECT id,score,max_score FROM eldi3333_submissions WHERE assignment_id=? AND user_id=?',[$a['id'],$u['id']])->fetch();if($old)return $old;throw $e;}
  return ['id'=>$id,'score'=>$score,'max_score'=>100];
 }
}
