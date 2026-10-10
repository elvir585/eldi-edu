<?php
declare(strict_types=1);

trait SectionFeatures {
 public function upgradeSections():void {
  if($this->run('SELECT value FROM eldi3333_settings WHERE name=?',['sections_schema'])->fetchColumn()==='1')return;
  foreach([
   'invites (class_id VARCHAR(40) PRIMARY KEY, token VARCHAR(64) NOT NULL UNIQUE, enabled INT NOT NULL DEFAULT 1)',
   'join_requests (class_id VARCHAR(40) NOT NULL, user_id VARCHAR(40) NOT NULL, state VARCHAR(12) NOT NULL, school VARCHAR(180) NOT NULL, created_at BIGINT NOT NULL, PRIMARY KEY(class_id,user_id))',
   'section_tests (assignment_id VARCHAR(40) PRIMARY KEY, class_id VARCHAR(40) NOT NULL, bank_key VARCHAR(80) NOT NULL, event_date VARCHAR(10) NOT NULL, metadata TEXT NOT NULL, UNIQUE(class_id,bank_key,event_date))',
   'demo_students (owner_id VARCHAR(40) NOT NULL, class_id VARCHAR(40) NOT NULL, user_id VARCHAR(40) NOT NULL, PRIMARY KEY(owner_id,class_id))',
  ] as $table)$this->db->exec('CREATE TABLE IF NOT EXISTS eldi3333_'.$table);
  $this->run('INSERT INTO eldi3333_settings(name,value) VALUES(?,?) ON DUPLICATE KEY UPDATE value=VALUES(value)',['sections_schema','1']);
 }
 public static function sectionSchools():array{return ['JU OŠ „Prokosovići“, Prokosovići, Lukavac','JU OŠ „Hasan Kikić“, Gradačac'];}
 public function sectionAccess(array $u,string $class):array {
  $this->teacher($u);$this->classFor($u,$class);
  $invite=$this->run('SELECT token,enabled FROM eldi3333_invites WHERE class_id=?',[$class])->fetch();
  $requests=$this->run('SELECT r.user_id,r.school,r.created_at,u.display_name,u.username FROM eldi3333_join_requests r JOIN eldi3333_users u ON u.id=r.user_id WHERE r.class_id=? AND r.state=? ORDER BY r.created_at',[$class,'pending'])->fetchAll();
  return ['invite'=>$invite?:null,'requests'=>$requests];
 }
 public function setInvite(array $u,string $class,bool $enabled):array {
  $this->teacher($u);$this->classFor($u,$class);
  $this->run('INSERT INTO eldi3333_invites(class_id,token,enabled) VALUES(?,?,?) ON DUPLICATE KEY UPDATE enabled=VALUES(enabled)',[$class,bin2hex(random_bytes(24)),$enabled?1:0]);
  return $this->sectionAccess($u,$class);
 }
 public function inviteInfo(string $token):array {
  if(!preg_match('/^[a-f0-9]{48}$/D',$token))throw new ClassroomError('Otvori važeći link za registraciju koji ti je dao nastavnik.',404);
  $c=$this->run('SELECT c.id,c.title FROM eldi3333_invites i JOIN eldi3333_classes c ON c.id=i.class_id WHERE i.token=? AND i.enabled=1',[$token])->fetch();
  if(!$c)throw new ClassroomError('Link nije važeći ili je nastavnik zatvorio registraciju.',404);
  return ['class'=>$c,'schools'=>self::sectionSchools()];
 }
 public function registerStudent(array $v,string $bucket):array {
  $this->throttle($bucket);if(!empty($v['token'])){$info=$this->inviteInfo((string)$v['token']);$class=$info['class']['id'];}else{$class=(string)($v['class_id']??'');if(!$this->run('SELECT class_id FROM eldi3333_invites WHERE class_id=? AND enabled=1',[$class])->fetchColumn())throw new ClassroomError('Nastavnik još nije otvorio registraciju za ovu sekciju.',404);}
  $username=strtolower(self::text($v['username']??'',60));
  if(!preg_match('/^[a-z0-9._-]{3,60}$/D',$username))throw new ClassroomError('Korisničko ime: 3–60 slova a–z, cifara, tačka, crtica.');
  $password=(string)($v['password']??'');$hash=self::password($password);
  $school=self::text($v['school']??'',180);if(!in_array($school,self::sectionSchools(),true))throw new ClassroomError('Izaberi školu sa spiska.');
  $name=self::text($v['name']??'',80);
  $this->db->beginTransaction();
  try {
   $old=$this->run('SELECT * FROM eldi3333_users WHERE username=? FOR UPDATE',[$username])->fetch();
   if($old){
    if($old['role']!=='student'||!password_verify($password,$old['password_hash']))throw new ClassroomError('Korisničko ime je zauzeto. Za postojeći učenički račun unesi njegovu lozinku ili izaberi drugo ime.',409);
    $id=$old['id'];
   }else{$id=self::id();$this->run('INSERT INTO eldi3333_users VALUES(?,?,?,?,?,?)',[$id,$username,$name,$hash,'student',time()]);}
   $member=(bool)$this->run('SELECT user_id FROM eldi3333_enrollments WHERE class_id=? AND user_id=?',[$class,$id])->fetchColumn();
   if(!$member)$this->run('INSERT INTO eldi3333_join_requests VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE state=VALUES(state),school=VALUES(school)',[$class,$id,'pending',$school,time()]);
   $this->run('DELETE FROM eldi3333_limits WHERE bucket=?',[$bucket]);$this->db->commit();
   return ['username'=>$username,'pending'=>!$member];
  }catch(Throwable $e){$this->db->rollBack();if($e instanceof PDOException&&(string)$e->getCode()==='23000')throw new ClassroomError('Korisničko ime je upravo zauzeto. Izaberi drugo ili se prijavi postojećim računom.',409);throw $e;}
 }
 public function approveStudent(array $u,string $class,string $student,bool $approve):array {
  $this->teacher($u);$this->classFor($u,$class);$this->db->beginTransaction();
  try {
   $r=$this->run('SELECT state FROM eldi3333_join_requests WHERE class_id=? AND user_id=? FOR UPDATE',[$class,$student])->fetch();
   if(!$r||$r['state']!=='pending')throw new ClassroomError('Zahtjev je već obrađen ili nije pronađen.',409);
   if($approve)$this->run('INSERT INTO eldi3333_enrollments(class_id,user_id) VALUES(?,?) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id)',[$class,$student]);
   $this->run('UPDATE eldi3333_join_requests SET state=? WHERE class_id=? AND user_id=?',[$approve?'approved':'rejected',$class,$student]);
   $this->db->commit();return ['approved'=>$approve];
  }catch(Throwable $e){$this->db->rollBack();throw $e;}
 }
 public function joinStatus(array $u):array {
  if($u['role']!=='student')return [];
  return $this->run('SELECT c.title,r.state FROM eldi3333_join_requests r JOIN eldi3333_classes c ON c.id=r.class_id WHERE r.user_id=? AND r.state<>?',[$u['id'],'approved'])->fetchAll();
 }
 public function demoStudent(array $u,string $class):array {
  $this->teacher($u);$this->classFor($u,$class);
  $id=$this->run('SELECT user_id FROM eldi3333_demo_students WHERE owner_id=? AND class_id=?',[$u['id'],$class])->fetchColumn();
  if($id&&$this->run('SELECT id FROM eldi3333_users WHERE id=? AND role=?',[$id,'student'])->fetchColumn())return $this->user($id);
  $students=$this->students($u,$class,[['name'=>'Elvir Čajić (probni učenik)','username'=>'proba.'.bin2hex(random_bytes(5)),'password'=>bin2hex(random_bytes(24))]]);
  $id=$students[0]['id'];$this->run('INSERT INTO eldi3333_demo_students VALUES(?,?,?) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id)',[$u['id'],$class,$id]);
  return $this->user($id);
 }
 public static function sectionCatalog():array{return (require __DIR__.'/section-tests.php')+self::practicalCatalog();}
 public function sectionMetadata(string $assignment):?array {
  $raw=$this->run('SELECT metadata FROM eldi3333_section_tests WHERE assignment_id=?',[$assignment])->fetchColumn();
  return $raw?json_decode($raw,true,512,JSON_THROW_ON_ERROR):null;
 }
 public function publishSection(array $u,array $v):array {
  $this->teacher($u);$class=self::text($v['class_id']??'');$this->classFor($u,$class);
  $event=self::text($v['event_date']??'',10);$day=DateTimeImmutable::createFromFormat('!Y-m-d',$event,new DateTimeZone('Europe/Sarajevo'));
  if(!$day||$day->format('Y-m-d')!==$event)throw new ClassroomError('Izaberi važeći datum sekcije.');
  $due=$day->setTime(23,59,59)->getTimestamp();if($due<=time()||$due>time()+366*86400)throw new ClassroomError('Datum sekcije treba biti danas ili u narednih godinu dana.');
  $levels=$v['banks']??[];if(!is_array($levels)||!count($levels)||count($levels)>20)throw new ClassroomError('Izaberi od 1 do 20 provjera.');
  $catalog=self::sectionCatalog();foreach($levels as $level)if(!is_string($level)||!isset($catalog[$level]))throw new ClassroomError('Izaberi test iz baze zadataka.');$levels=array_values(array_unique($levels));
  $created=[];$this->db->beginTransaction();
  try{
   foreach($levels as $level){
    $existing=$this->run('SELECT assignment_id FROM eldi3333_section_tests WHERE class_id=? AND bank_key=? AND event_date=?',[$class,$level,$event])->fetchColumn();
    if($existing){$created[]=['id'=>$existing,'level'=>$level,'existing'=>true];continue;}
    $test=$catalog[$level];$meta=['bank'=>$level,'level'=>$test['grade'],'subject'=>$test['subject'],'test_title'=>$test['title'],'event_date'=>$event,'project'=>'Inovativni nastavnici – Step by Step','schools'=>self::sectionSchools(),'mentors'=>['Dino Isanović','Elvir Čajić'],'section'=>'Mladi matematičari'];
    if(!empty($test['practical'])){$id=self::id();$this->run('INSERT INTO eldi3333_assignments VALUES(?,?,?,?,?,?,?,?,?)',[$id,$class,self::text('Sekcija · '.$test['title'].' · '.$day->format('d.m.Y.'),150),$test['intro'].' Riješi zadatak u Python školskom režimu ili blokovima. Probaj dva prikazana primjera prije konačne predaje. Ocjena se računa iz 10 provjera na serveru; svaka nosi 10 bodova. Jedna konačna predaja.','program','[]',$due,0,time()]);$a=['id'=>$id];}
    else $a=$this->createAssignment($u,['class_id'=>$class,'kind'=>'quiz','title'=>'Sekcija · '.$test['title'].' · '.$day->format('d.m.Y.'),'instructions'=>$test['intro']."\n".count($test['questions'])." zadataka · ".array_sum(array_column($test['questions'],'points'))." bodova · preporučeno vrijeme 45 minuta. Vrijeme nije automatski ograničeno. Svaki tačan odgovor donosi 5 bodova; nema negativnih bodova.\nUpiši samo broj ili razlomak, bez mjerne jedinice. Ocjena: manje od 50% = 1; 50–64% = 2; 65–79% = 3; 80–89% = 4; 90–100% = 5.\nNakon konačne predaje dobijaš rezultat, značku, diplomu o učešću i objašnjenja korak po korak.",'questions'=>$test['questions'],'due_at'=>$due]);
    $this->run('INSERT INTO eldi3333_section_tests VALUES(?,?,?,?,?)',[$a['id'],$class,$level,$event,json_encode($meta,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE)]);
    $created[]=['id'=>$a['id'],'level'=>$level,'existing'=>false];
   }
   $this->db->commit();return ['assignments'=>$created];
  }catch(Throwable $e){$this->db->rollBack();throw $e;}
 }
 public static function sectionGrade(float $score,float $max):string{$p=$max>0?100*$score/$max:0;return $p>=90?'5':($p>=80?'4':($p>=65?'3':($p>=50?'2':'1')));}
 public function certificate(array $u,string $submission):array {
  $s=$this->submissionFor($u,$submission);$meta=$this->sectionMetadata($s['assignment_id']);
  if(!$meta)throw new ClassroomError('Diploma je dostupna za testove sekcije Mladi matematičari.',404);
  $person=$this->user($s['user_id']);$percent=round(100*(float)$s['score']/max(1,(float)$s['max_score']),1);
  $badge=$percent>=90?'Zlatna značka znanja':($percent>=75?'Srebrna značka znanja':($percent>=50?'Bronzana značka znanja':'Uporni istraživač'));
  return ['certificate'=>['id'=>'MM-'.strtoupper(substr($s['id'],0,16)),'name'=>$person['display_name'],'score'=>(float)$s['score'],'max_score'=>(float)$s['max_score'],'percent'=>$percent,'grade'=>$s['grade']?:self::sectionGrade((float)$s['score'],(float)$s['max_score']),'badge'=>$badge,'submitted_at'=>(int)$s['submitted_at'],'meta'=>$meta]];
 }
}
