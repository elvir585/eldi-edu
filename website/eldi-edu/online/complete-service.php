<?php
declare(strict_types=1);
require_once __DIR__.'/school-runtime.php';
trait CompleteFeatures {
 public function upgradeComplete():void {
  if($this->run('SELECT value FROM eldi3333_settings WHERE name=?',['complete_schema'])->fetchColumn()==='119')return;
  $this->db->exec('CREATE TABLE IF NOT EXISTS eldi3333_projects (user_id VARCHAR(40) PRIMARY KEY, revision BIGINT NOT NULL, profile MEDIUMTEXT NOT NULL, updated_at BIGINT NOT NULL)');
  $this->run('INSERT INTO eldi3333_settings(name,value) VALUES(?,?) ON DUPLICATE KEY UPDATE value=VALUES(value)',['complete_schema','119']);
 }
 public function publicSections():array {
  return ['classes'=>$this->run('SELECT c.id,c.title FROM eldi3333_classes c JOIN eldi3333_invites i ON i.class_id=c.id WHERE i.enabled=1 ORDER BY c.title LIMIT 100')->fetchAll(),'schools'=>self::sectionSchools()];
 }
 public function projectAccess(array $u):void {
  if($u['role']==='student'&&!$this->run('SELECT user_id FROM eldi3333_enrollments WHERE user_id=? LIMIT 1',[$u['id']])->fetchColumn())throw new ClassroomError('Čuvanje na računu dostupno je nakon nastavnikovog odobrenja.',403);
 }
 public function projectLoad(array $u):array {
  $this->projectAccess($u);$row=$this->run('SELECT revision,profile,updated_at FROM eldi3333_projects WHERE user_id=?',[$u['id']])->fetch();
  return ['revision'=>$row?(int)$row['revision']:0,'profile'=>$row?json_decode($row['profile'],true,64,JSON_THROW_ON_ERROR):null,'updated_at'=>$row?(int)$row['updated_at']:null];
 }
 public function projectSave(array $u,array $v):array {
  $this->projectAccess($u);$p=$v['profile']??null;$rev=$v['revision']??null;
  if(!is_int($rev)||$rev<0||!is_array($p)||!is_string($p['name']??null)||strlen($p['name'])>240||!is_array($p['studio33Work']??null))throw new ClassroomError('Neispravan projekat ili verzija.');
  $raw=json_encode(['name'=>$p['name'],'studio33Work'=>$p['studio33Work']],JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE);if(strlen($raw)>2000000)throw new ClassroomError('Projekat može imati najviše 2 MB. Veći rad sačuvaj opcijom Izvezi rad.');
  $now=time();if($rev===0){try{$this->run('INSERT INTO eldi3333_projects VALUES(?,?,?,?)',[$u['id'],1,$raw,$now]);}catch(PDOException $e){if((string)$e->getCode()==='23000')throw new ClassroomError('Rad na računu je promijenjen na drugom uređaju. Preuzmi svoju kopiju, pa otvori rad sa računa.',409);throw $e;}}
  else{if(!$this->run('UPDATE eldi3333_projects SET revision=revision+1,profile=?,updated_at=? WHERE user_id=? AND revision=?',[$raw,$now,$u['id'],$rev])->rowCount())throw new ClassroomError('Rad na računu je promijenjen na drugom uređaju. Preuzmi svoju kopiju, pa otvori rad sa računa.',409);}
  return ['revision'=>$rev+1,'updated_at'=>$now];
 }
 public static function practicalCatalog():array{return require __DIR__.'/practical-tasks.php';}
 public function practicalFor(array $a):array {
  $key=$this->sectionMetadata($a['id'])['bank']??'';$task=self::practicalCatalog()[$key]??null;if(!$task)throw new ClassroomError('Praktični zadatak nije pronađen.',404);return $task;
 }
 public function programSource(array $v):string {
  if(($v['language']??'')==='python')return self::text($v['source']??'',3000);
  if(($v['language']??'')==='blocks'&&is_array($v['workspace']??null))return SchoolRuntime::blocksSource($v['workspace']);
  throw new ClassroomError('Izaberi Python ili blokove.');
 }
 private function programResults(array $payload,array $cases,bool $details):array {
  $source=$this->programSource($payload);$runtime=new SchoolRuntime();$ast=$runtime->compile($source);$passed=0;$results=[];
  foreach($cases as $case){$error='';$actual=[];try{$actual=$runtime->run($ast,$case['input']);}catch(ClassroomError $e){$error=$e->getMessage();}
   $ok=!$error&&count($actual)===count($case['output']);if($ok)foreach($actual as $i=>$s){$n=self::number($s);$expected=(float)$case['output'][$i];if($n===null||abs($n-$expected)>max(1,abs($expected))*1e-9)$ok=false;}
   if($ok)$passed++;$row=['passed'=>$ok];if($details)$row+=['input'=>$case['input'],'expected'=>$case['output'],'actual'=>$actual,'error'=>$error];$results[]=$row;
  }
  return ['passed'=>$passed,'total'=>count($cases),'results'=>$results,'source'=>$source];
 }
 public function tryProgram(array $u,string $id,array $payload):array {
  $a=$this->assignmentFor($u,$id);if($a['kind']!=='program')throw new ClassroomError('Izaberi praktični zadatak.');
  if($u['role']==='student'&&((int)$a['closed']||($a['due_at']&&time()>(int)$a['due_at'])))throw new ClassroomError('Predaja je zatvorena.',409);
  return $this->programResults($payload,$this->practicalFor($a)['examples'],true);
 }
 public function submitProgram(array $u,array $a,array $payload):array {
  $result=$this->programResults($payload,$this->practicalFor($a)['cases'],false);$score=100*$result['passed']/$result['total'];
  $clean=['language'=>$payload['language'],'source'=>$result['source'],'passed'=>$result['passed'],'total'=>$result['total']];if($payload['language']==='blocks')$clean['workspace']=$payload['workspace'];
  $raw=json_encode($clean,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE);if(strlen($raw)>120000)throw new ClassroomError('Blokovski rad je prevelik.');$id=self::id();
  try{$this->run('INSERT INTO eldi3333_submissions VALUES(?,?,?,?,?,?,?,?,?)',[$id,$a['id'],$u['id'],$raw,$score,100,'Automatska provjera: '.$result['passed'].' / '.$result['total'].' ulaznih primjera.',self::sectionGrade($score,100),time()]);}
  catch(PDOException $e){$old=$this->run('SELECT id,score,max_score FROM eldi3333_submissions WHERE assignment_id=? AND user_id=?',[$a['id'],$u['id']])->fetch();if($old)return $old;throw $e;}
  return ['id'=>$id,'score'=>$score,'max_score'=>100];
 }
}
