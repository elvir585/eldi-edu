<?php
declare(strict_types=1);

trait CleanupFeatures {
 public function upgradeCleanup():void {
  if($this->run("SELECT value FROM eldi3333_settings WHERE name='cleanup_schema'")->fetchColumn()==='1')return;
  $this->db->exec('CREATE TABLE IF NOT EXISTS eldi3333_deleted_items (kind VARCHAR(12) NOT NULL, item_id VARCHAR(40) NOT NULL, owner_id VARCHAR(40) NOT NULL, deleted_at BIGINT NOT NULL, PRIMARY KEY(kind,item_id))');
  $this->run('INSERT INTO eldi3333_settings(name,value) VALUES(?,?) ON DUPLICATE KEY UPDATE value=?',['cleanup_schema','1','1']);
 }
 public function isDeleted(string $kind,string $id):bool {
  return (bool)$this->run('SELECT item_id FROM eldi3333_deleted_items WHERE kind=? AND item_id=?',[$kind,$id])->fetchColumn();
 }
 private function cleanupKind(string $kind):void {
  if(!in_array($kind,['class','assignment'],true))throw new ClassroomError('Izaberite odjeljenje ili zadatak.');
 }
 private function cleanupLock(array $u,string $kind,string $id):array {
  $this->teacher($u);$this->cleanupKind($kind);
  $class=$kind==='class'?$id:(string)$this->run('SELECT class_id FROM eldi3333_assignments WHERE id=?',[$id])->fetchColumn();
  $c=$this->run('SELECT * FROM eldi3333_classes WHERE id=? FOR UPDATE',[$class])->fetch();
  if(!$c)throw new ClassroomError('Stavka nije pronađena.',404);
  if($c['owner_id']!==$u['id'])throw new ClassroomError('Možete upravljati samo svojim odjeljenjima i zadacima.',403);
  return $c;
 }
 public function deletionPreview(array $u,string $kind,string $id):array {
  $this->teacher($u);$this->cleanupKind($kind);
  if($kind==='class'){
   $c=$this->classFor($u,$id);$title=$c['title'];
   $counts=['assignments'=>(int)$this->run('SELECT COUNT(*) FROM eldi3333_assignments WHERE class_id=?',[$id])->fetchColumn(),
    'submissions'=>(int)$this->run('SELECT COUNT(*) FROM eldi3333_submissions s JOIN eldi3333_assignments a ON a.id=s.assignment_id WHERE a.class_id=?',[$id])->fetchColumn(),
    'students'=>(int)$this->run('SELECT COUNT(*) FROM eldi3333_enrollments WHERE class_id=?',[$id])->fetchColumn()];
  }else{
   $a=$this->assignmentFor($u,$id);$c=$this->classFor($u,$a['class_id']);$title=$a['title'];
   $counts=['assignments'=>1,'submissions'=>(int)$this->run('SELECT COUNT(*) FROM eldi3333_submissions WHERE assignment_id=?',[$id])->fetchColumn(),'students'=>0];
  }
  $item=['kind'=>$kind,'id'=>$id,'title'=>$title,'class_title'=>$c['title']];
  return ['item'=>$item,'counts'=>$counts,'snapshot'=>hash('sha256',json_encode([$item,$counts],JSON_THROW_ON_ERROR))];
 }
 public function moveToTrash(array $u,string $kind,string $id,string $snapshot):array {
  $this->teacher($u);$this->cleanupKind($kind);$this->db->beginTransaction();
  try{
   $this->cleanupLock($u,$kind,$id);$view=$this->deletionPreview($u,$kind,$id);
   if(!hash_equals($view['snapshot'],$snapshot))throw new ClassroomError('Sadržaj se promijenio. Zatvorite potvrdu, ponovo kliknite Obriši i provjerite novi pregled.',409);
   $this->run('INSERT INTO eldi3333_deleted_items VALUES(?,?,?,?)',[$kind,$id,$u['id'],time()]);
   $this->db->commit();return ['deleted'=>true,'item'=>$view['item']];
  }catch(Throwable $e){$this->db->rollBack();throw $e;}
 }
 public function trashList(array $u):array {
  $this->teacher($u);
  $classes=$this->run("SELECT d.kind,c.id,c.title,c.title AS class_title,d.deleted_at,0 AS parent_deleted FROM eldi3333_deleted_items d JOIN eldi3333_classes c ON c.id=d.item_id WHERE d.kind='class' AND c.owner_id=?",[$u['id']])->fetchAll();
  $tasks=$this->run("SELECT d.kind,a.id,a.title,c.title AS class_title,d.deleted_at,EXISTS(SELECT 1 FROM eldi3333_deleted_items p WHERE p.kind='class' AND p.item_id=c.id) AS parent_deleted FROM eldi3333_deleted_items d JOIN eldi3333_assignments a ON a.id=d.item_id JOIN eldi3333_classes c ON c.id=a.class_id WHERE d.kind='assignment' AND c.owner_id=?",[$u['id']])->fetchAll();
  $items=array_merge($classes,$tasks);usort($items,fn($a,$b)=>((int)$b['deleted_at']<=>(int)$a['deleted_at'])?:strcmp($a['id'],$b['id']));
  return ['items'=>$items];
 }
 public function restoreItem(array $u,string $kind,string $id):array {
  $this->teacher($u);$this->cleanupKind($kind);$this->db->beginTransaction();
  try{
   $c=$this->cleanupLock($u,$kind,$id);
   if(!$this->isDeleted($kind,$id))throw new ClassroomError('Stavka nije u obrisanim stavkama.',404);
   if($kind==='assignment'&&$this->isDeleted('class',$c['id']))throw new ClassroomError('Prvo vratite odjeljenje kojem zadatak pripada.',409);
   $this->run('DELETE FROM eldi3333_deleted_items WHERE kind=? AND item_id=?',[$kind,$id]);
   $this->db->commit();return ['restored'=>true];
  }catch(Throwable $e){$this->db->rollBack();throw $e;}
 }
}
