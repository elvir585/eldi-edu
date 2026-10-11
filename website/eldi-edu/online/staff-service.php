<?php
declare(strict_types=1);

trait StaffFeatures {
 public function staffOwner():string {
  return (string)$this->run("SELECT value FROM eldi3333_settings WHERE name='staff_owner'")->fetchColumn();
 }
 public function upgradeStaff():void {
  if($this->staffOwner()!=='')return;
  // Older releases had exactly one teacher. Never guess an owner if several exist.
  $teachers=$this->run("SELECT id FROM eldi3333_users WHERE role='teacher' ORDER BY created_at,id LIMIT 2")->fetchAll();
  if(count($teachers)===1)$this->run('INSERT IGNORE INTO eldi3333_settings(name,value) VALUES(?,?)',['staff_owner',$teachers[0]['id']]);
 }
 public function staffIdentity(array $u):array {
  $u['is_owner']=$u['role']==='teacher'&&$u['id']===$this->staffOwner();
  $u['is_admin']=$u['role']==='teacher'&&($u['is_owner']||$this->run('SELECT value FROM eldi3333_settings WHERE name=?',['staff_admin:'.$u['id']])->fetchColumn()==='1');
  return $u;
 }
 public function staffAdmin(array $u):void {
  if(!$this->staffIdentity($u)['is_admin'])throw new ClassroomError('Upravljanje nastavnicima dostupno je administratoru.',403);
 }
 private function staffRole(mixed $role):string {
  if(!in_array($role,['teacher','admin'],true))throw new ClassroomError('Izaberite ulogu Nastavnik ili Administrator.');
  return $role;
 }
 private function staffTransaction(array $u,callable $action):array {
  $this->db->beginTransaction();
  try {
   // Serialize staff changes, including privilege checks and revocation.
   $this->run("SELECT value FROM eldi3333_settings WHERE name='staff_owner' FOR UPDATE")->fetchColumn();
   $this->staffAdmin($u);
   $result=$action();$this->db->commit();return $result;
  }catch(Throwable $e){
   $this->db->rollBack();
   if($e instanceof PDOException&&(string)$e->getCode()==='23000')throw new ClassroomError('Korisničko ime već postoji. Izaberite drugo.',409);
   throw $e;
  }
 }
 private function staffSetAdmin(string $id,bool $admin):void {
  if($admin)$this->run('INSERT INTO eldi3333_settings(name,value) VALUES(?,?) ON DUPLICATE KEY UPDATE value=?',['staff_admin:'.$id,'1','1']);
  else $this->run('DELETE FROM eldi3333_settings WHERE name=?',['staff_admin:'.$id]);
 }
 public function staffList(array $u):array {
  $this->staffAdmin($u);
  $rows=$this->run("SELECT id,username,display_name,role,created_at FROM eldi3333_users WHERE role='teacher' ORDER BY created_at,display_name")->fetchAll();
  return ['staff'=>array_map(fn($row)=>$this->staffIdentity($row),$rows)];
 }
 public function createTeacher(array $u,array $v):array {
  $this->staffAdmin($u);
  $name=self::text($v['name']??'',100);$username=strtolower(self::text($v['username']??'',60));
  if(!preg_match('/^[a-z0-9._-]{3,60}$/D',$username))throw new ClassroomError('Korisničko ime: 3–60 slova a–z, cifara, tačka, crtica.');
  if(!is_string($v['password']??null))throw new ClassroomError('Unesite lozinku nastavnika.');
  $hash=self::password($v['password']);$role=$this->staffRole($v['role']??'teacher');
  return $this->staffTransaction($u,function()use($name,$username,$hash,$role){
   if($this->run('SELECT id FROM eldi3333_users WHERE username=?',[$username])->fetchColumn())throw new ClassroomError('Korisničko ime već postoji. Izaberite drugo.',409);
   $id=self::id();$this->run('INSERT INTO eldi3333_users VALUES(?,?,?,?,?,?)',[$id,$username,$name,$hash,'teacher',time()]);
   $this->staffSetAdmin($id,$role==='admin');
   return ['teacher'=>$this->user($id)];
  });
 }
 private function staffTarget(array $u,string $id):array {
  $target=$this->user($id);
  if($target['role']!=='teacher')throw new ClassroomError('Izaberite nastavnički račun.',400);
  if($target['is_owner'])throw new ClassroomError('Glavni administrator ostaje zaštićen. Svoju lozinku mijenja kroz Moj račun.',403);
  if($target['id']===$u['id'])throw new ClassroomError('Svoju lozinku mijenjate kroz Moj račun; vlastitu ulogu ne možete promijeniti.',403);
  return $target;
 }
 public function setTeacherRole(array $u,string $id,mixed $role):array {
  $this->staffAdmin($u);$role=$this->staffRole($role);
  return $this->staffTransaction($u,function()use($u,$id,$role){
   $this->staffTarget($u,$id);$this->staffSetAdmin($id,$role==='admin');
   return ['teacher'=>$this->user($id)];
  });
 }
 public function resetTeacherPassword(array $u,string $id,mixed $password):array {
  $this->staffAdmin($u);
  if(!is_string($password))throw new ClassroomError('Unesite novu lozinku.');
  $hash=self::password($password);
  return $this->staffTransaction($u,function()use($u,$id,$hash){
   $this->staffTarget($u,$id);
   $this->run("UPDATE eldi3333_users SET password_hash=? WHERE id=? AND role='teacher'",[$hash,$id]);
   return ['updated'=>true];
  });
 }
}
