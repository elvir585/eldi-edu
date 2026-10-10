<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');header('X-Frame-Options: DENY');
require __DIR__.'/service.php';
try {
 if(PHP_VERSION_ID<80200)throw new ClassroomError('Potrebna je PHP verzija 8.2 ili novija.',503);
 $local=in_array($_SERVER['REMOTE_ADDR']??'', ['127.0.0.1','::1'],true);
 $secure=($_SERVER['HTTPS']??'')==='on'||($_SERVER['REQUEST_SCHEME']??'')==='https';
 if(!$secure&&!$local)throw new ClassroomError('Online učionicu otvorite preko HTTPS adrese.',403);
 session_name('ELDI3333SESSID');session_set_cookie_params(['httponly'=>true,'secure'=>$secure,'samesite'=>'Strict','path'=>str_replace('\\','/',dirname($_SERVER['SCRIPT_NAME']??'/eldi-edu/online/api.php')).'/']);ini_set('session.use_strict_mode','1');session_start();
 if(isset($_SESSION['last'])&&time()-$_SESSION['last']>7200){$_SESSION=[];session_regenerate_id(true);}$_SESSION['last']=time();$_SESSION['csrf']??=bin2hex(random_bytes(24));
 $path=getenv('ELDI3333_CONFIG')?:dirname(__DIR__,3).'/eldi3333-config.php';$configured=is_file($path);$action=$_GET['action']??'status';$app=null;
 if($configured){$config=require $path;if(!is_array($config)||!str_starts_with($config['dsn']??'','mysql:'))throw new ClassroomError('Provjerite privatnu MySQL konfiguraciju.',503);$app=new Classroom(new PDO($config['dsn'],$config['user'],$config['password']));}
 if($app&&isset($_SESSION['user'])&&(!isset($_SESSION['auth_tag'])||!hash_equals($_SESSION['auth_tag'],$app->sessionTag($_SESSION['user'])))){unset($_SESSION['user'],$_SESSION['auth_tag']);session_regenerate_id(true);}
 if($action==='status'){$installed=$app?->installed()??false;$u=$installed&&isset($_SESSION['user'])?$app->user($_SESSION['user']):null;echo json_encode(['ok'=>true,'configured'=>$configured,'installed'=>$installed,'user'=>$u,'csrf'=>$_SESSION['csrf'],'version'=>'33.33.0']);exit;}
 if(!$app)throw new ClassroomError('Najprije postavite privatnu konfiguraciju iznad public_html. Upute su uz paket.',503);
 if(($_SERVER['REQUEST_METHOD']??'GET')!=='POST')throw new ClassroomError('Koristite POST zahtjev.',405);
 if(!hash_equals($_SESSION['csrf'],$_SERVER['HTTP_X_CSRF_TOKEN']??''))throw new ClassroomError('Sesija je istekla. Osvježite stranicu.',403);
 if((int)($_SERVER['CONTENT_LENGTH']??0)>2800000)throw new ClassroomError('Zahtjev je veći od 2,8 MB.',413);
 $raw=file_get_contents('php://input',false,null,0,2800001);if(strlen($raw)>2800000)throw new ClassroomError('Zahtjev je prevelik.',413);$v=json_decode($raw,true,64,JSON_THROW_ON_ERROR);if(!is_array($v))throw new ClassroomError('Neispravan zahtjev.');
 if($action==='install'){$token=$config['install_token']??'';if(strlen($token)<24||str_contains($token,'ZAMIJENITE')||!hash_equals($token,(string)($v['token']??'')))throw new ClassroomError('Instalacijski ključ nije tačan ili nije podešen.',403);$app->install((string)($v['username']??''),(string)($v['name']??''),(string)($v['password']??''));$result=['installed'=>true];}
 elseif(!$app->installed())throw new ClassroomError('Nastavnik prvo treba završiti instalaciju.',503);
 elseif($action==='recover_teacher'){
  $expected=(string)($config['install_token']??'');$ip=$_SERVER['REMOTE_ADDR']??'unknown';
  $result=$app->recoverTeacher((string)($v['token']??''),$expected,(string)($v['username']??''),(string)($v['password']??''),hash_hmac('sha256','teacher-recovery:'.$ip,$expected),hash_hmac('sha256',$ip,$expected));
  unset($_SESSION['user'],$_SESSION['auth_tag']);session_regenerate_id(true);$_SESSION['csrf']=bin2hex(random_bytes(24));$result['csrf']=$_SESSION['csrf'];
 }
 elseif($action==='login'){$bucket=hash_hmac('sha256',($_SERVER['REMOTE_ADDR']??'unknown'),$config['install_token']);$u=$app->login((string)($v['username']??''),(string)($v['password']??''),$bucket);session_regenerate_id(true);$_SESSION['user']=$u['id'];$_SESSION['auth_tag']=$app->sessionTag($u['id']);$_SESSION['csrf']=bin2hex(random_bytes(24));$result=['user'=>$u,'csrf'=>$_SESSION['csrf']];}
 elseif($action==='logout'){$_SESSION=[];session_regenerate_id(true);$result=[];}
 else{$u=$app->user($_SESSION['user']??'');$result=match($action){
 'dashboard'=>$app->dashboard($u),
 'create_class'=>$app->createClass($u,(string)($v['title']??'')),
 'create_students'=>['students'=>$app->students($u,(string)($v['class_id']??''),$v['names']??[])],
 'roster'=>['students'=>$app->roster($u,(string)($v['class_id']??''))],
 'reset_student'=>$app->resetStudent($u,(string)($v['class_id']??''),(string)($v['student_id']??'')),
 'remove_student'=>(function()use($app,$u,$v){$app->removeStudent($u,(string)($v['class_id']??''),(string)($v['student_id']??''));return [];} )(),
 'create_assignment'=>$app->createAssignment($u,$v),
 'assignment'=>$app->assignmentView($u,(string)($v['id']??'')),
 'submit'=>$app->submit($u,(string)($v['id']??''),$v['payload']??[]),
 'submissions'=>['submissions'=>$app->submissions($u,(string)($v['id']??''))],
 'submission'=>['submission'=>$app->submissionFor($u,(string)($v['id']??''))],
 'review'=>(function()use($app,$u,$v){$app->review($u,(string)($v['id']??''),(string)($v['grade']??''),(string)($v['feedback']??''));return [];} )(),
 'close'=>(function()use($app,$u,$v){$app->close($u,(string)($v['id']??''),(bool)($v['closed']??true));return [];} )(),
 'password'=>(function()use($app,$u,$v){$app->changePassword($u,(string)($v['old']??''),(string)($v['password']??''));$_SESSION['auth_tag']=$app->sessionTag($u['id']);session_regenerate_id(true);return [];} )(),
 default=>throw new ClassroomError('Nepoznata radnja.',404)
 };}
 echo json_encode(['ok'=>true]+$result,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE);
} catch(ClassroomError $e){http_response_code($e->status);echo json_encode(['ok'=>false,'error'=>$e->getMessage()],JSON_UNESCAPED_UNICODE);}
catch(JsonException){http_response_code(400);echo json_encode(['ok'=>false,'error'=>'JSON datoteka ili zahtjev nisu ispravni.']);}
catch(Throwable $e){error_log('ELDI3333: '.$e->getMessage());http_response_code(503);echo json_encode(['ok'=>false,'error'=>'Učionica trenutno nije dostupna. Nastavnik treba provjeriti PHP/MySQL konfiguraciju i error_log.']);}
