#!/usr/bin/env python3
"""Real HTTP + MySQL checks. Uses only a disposable CI database."""
import http.cookiejar, json, os, pathlib, socket, subprocess, time, urllib.request, urllib.error
ROOT=pathlib.Path(__file__).resolve().parents[1]
config=ROOT/'.qa-config.php'
config.write_text("<?php return ['dsn'=>'mysql:host=127.0.0.1;port=3306;dbname=eldi3333qa;charset=utf8mb4','user'=>'root','password'=>'eldi-ci-only-password','install_token'=>'ci-only-install-key-not-for-production-3333'];")
os.environ['ELDI3333_CONFIG']=str(config)
sock=socket.socket();sock.bind(('127.0.0.1',0));port=sock.getsockname()[1];sock.close()
log=open(ROOT/'.qa-php.log','w');server=subprocess.Popen(['php','-S',f'127.0.0.1:{port}','-t',str(ROOT/'website')],stdout=log,stderr=log,env=os.environ)
BASE=f'http://127.0.0.1:{port}/eldi-edu/online/api.php?action='
class Client:
 def __init__(self): self.opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.csrf=''
 def call(self,action,data=None,expected=200,csrf=None):
  req=urllib.request.Request(BASE+action,data=None if data is None else json.dumps(data).encode(),headers={} if data is None else {'Content-Type':'application/json','X-CSRF-Token':self.csrf if csrf is None else csrf})
  try: res=self.opener.open(req);status=res.status;body=res.read()
  except urllib.error.HTTPError as e:status=e.code;body=e.read()
  r=json.loads(body);assert status==expected,(action,status,expected,r)
  if r.get('csrf'):self.csrf=r['csrf']
  return r
try:
 for _ in range(80):
  try:urllib.request.urlopen(BASE+'status',timeout=1);break
  except (OSError,urllib.error.URLError):time.sleep(.1)
 teacher=Client();s=teacher.call('status');assert s['configured'] and not s['installed']
 teacher.call('install',{'token':'wrong'},403)
 teacher.call('install',{'token':'ci-only-install-key-not-for-production-3333','name':'Nastavnik QA','username':'nastavnik.qa','password':'Teacher-QA-3333-password'})
 teacher.call('install',{'token':'ci-only-install-key-not-for-production-3333','name':'Drugi','username':'drugi.qa','password':'Teacher-QA-3333-password'},409)
 teacher.call('login',{'username':'nastavnik.qa','password':'wrong'},401)
 teacher.call('login',{'username':'nastavnik.qa','password':'Teacher-QA-3333-password'})
 teacher.call('create_class',{'title':'V-1'},403,csrf='bad-token')
 class1=teacher.call('create_class',{'title':'V-1 · provjera'})['id'];class2=teacher.call('create_class',{'title':'VI-2 · provjera'})['id']
 students=teacher.call('create_students',{'class_id':class1,'names':['Učenik A','Učenik B']})['students']
 outsider=teacher.call('create_students',{'class_id':class2,'names':['Drugo odjeljenje']})['students'][0]
 custom={'name':'Ručno zadani učenik','username':'ucenik.qa1','password':'QA-only-student-2026...'}
 created=teacher.call('create_students',{'class_id':class1,'names':[custom]})['students'][0]
 assert created['username']==custom['username'] and created['password']==custom['password']
 manual=Client();manual.call('status');manual.call('login',{'username':custom['username'],'password':custom['password']})
 assert manual.call('status')['user']['role']=='student'
 manual.call('create_students',{'class_id':class1,'names':[dict(custom,username='forbidden.qa')]},403)
 teacher.call('create_students',{'class_id':class1,'names':[custom]},409)
 teacher.call('create_students',{'class_id':class1,'names':[dict(custom,username='new-before-duplicate.qa'),custom]},409)
 teacher.call('create_students',{'class_id':class1,'names':[dict(custom,username='same-in-batch.qa'),dict(custom,username='same-in-batch.qa')]},409)
 for patch in [{'username':'invalid space'},{'password':'short'},{'password':123456789012},{'name':''},{'username':'x'*61}]:
  teacher.call('create_students',{'class_id':class1,'names':[dict(custom,username='invalid.qa',**patch) if 'username' not in patch else dict(custom,**patch)]},400)
 teacher.call('create_students',{'class_id':class1,'names':[dict(custom,username='new-before-invalid.qa'),dict(custom,username='bad name')]},400)
 teacher.call('create_students',{'class_id':class1,'names':[]},400)
 teacher.call('create_students',{'class_id':class1,'names':['Ime']*41},400)
 roster=teacher.call('roster',{'class_id':class1})['students']
 assert len(roster)==3 and all(x['username'] not in ['new-before-duplicate.qa','same-in-batch.qa','new-before-invalid.qa'] for x in roster)
 assert all('password' not in x and 'password_hash' not in x for x in roster)
 teacher.call('remove_student',{'class_id':class1,'student_id':created['id']})
 a,b,other=Client(),Client(),Client()
 for client,credentials in [(a,students[0]),(b,students[1]),(other,outsider)]:client.call('status');client.call('login',{'username':credentials['username'],'password':credentials['password']})
 a.call('create_class',{'title':'Nedozvoljeno'},403)
 quiz=teacher.call('create_assignment',{'class_id':class1,'title':'Razlomci i decimalni zapis','kind':'quiz','instructions':'Riješi dva zadatka.','questions':[{'prompt':'Koliko je 1/2 + 1/4?','answer':'0.75','points':15,'explanation':'Zbir je 3/4.'},{'prompt':'Koliko je 2 + 3?','answer':'5','points':5}]})['id']
 shown=a.call('assignment',{'id':quiz})['assignment'];assert 'answer' not in shown['questions'][0] and 'explanation' not in shown['questions'][0]
 other.call('assignment',{'id':quiz},403)
 sub=a.call('submit',{'id':quiz,'payload':{'answers':['3/4','5']}});assert sub['score']==20 and sub['max_score']==20
 repeated=a.call('submit',{'id':quiz,'payload':{'answers':['0','0']}});assert repeated['id']==sub['id'] and repeated['score']==20
 b.call('submission',{'id':sub['id']},403)
 a.call('review',{'id':sub['id'],'grade':'5'},403)
 teacher.call('review',{'id':sub['id'],'grade':'5','feedback':'Odličan postupak.'})
 view=a.call('assignment',{'id':quiz});assert view['submission']['grade']=='5' and view['assignment']['questions'][0]['answer']==.75
 teacher.call('close',{'id':quiz,'closed':True});b.call('submit',{'id':quiz,'payload':{'answers':['.75','5']}},409)
 teacher.call('close',{'id':quiz,'closed':False});b.call('submit',{'id':quiz,'payload':{'answers':['','5']}})
 teacher.call('create_assignment',{'class_id':class1,'title':'Prošli rok','kind':'project','due_at':int(time.time())-60},400)
 project=teacher.call('create_assignment',{'class_id':class1,'title':'Moja 3D scena','kind':'project','instructions':'Izvezi projekat i napiši zaključak.'})['id']
 a.call('submit',{'id':project,'payload':{'text':'','project':{'format':'html','script':'bad'}}},400)
 submitted=a.call('submit',{'id':project,'payload':{'text':'Uporedio/la sam valjak i kupu.','project':{'format':'ELDI-33-PROJECT','version':1,'project':{'title':'Moja scena','scene':[]}}}})
 read=teacher.call('submission',{'id':submitted['id']});assert read['submission']['payload']['project']['format']=='ELDI-33-PROJECT'
 teacher.call('reset_student',{'class_id':class2,'student_id':students[0]['id']},404)
 reset=teacher.call('reset_student',{'class_id':class1,'student_id':students[0]['id']});assert a.call('status')['user'] is None
 a.call('login',{'username':students[0]['username'],'password':students[0]['password']},401)
 a.call('login',{'username':students[0]['username'],'password':reset['password']})
 a.call('password',{'old':reset['password'],'password':'Student-QA-new-password'});assert a.call('status')['user']
 anonymous=Client();anonymous.call('status');anonymous.call('dashboard',{},401)
 teacher.call('remove_student',{'class_id':class2,'student_id':outsider['id']});assert other.call('status')['user'] is None
 recovery=Client();recovery.call('status')
 recover_data={'token':'ci-only-install-key-not-for-production-3333','username':'nastavnik.obnovljen.qa','password':'Recovered-Teacher-QA-2026'}
 teacher_before=teacher.call('status')['user'];classes_before=teacher.call('dashboard',{})['classes']
 recovery.call('recover_teacher',recover_data,403,csrf='wrong-csrf')
 recovery.call('recover_teacher',dict(recover_data,token='wrong-token'),403)
 recovery.call('recover_teacher',dict(recover_data,password='short'),400)
 recovery.call('recover_teacher',dict(recover_data,username='bad name'),400)
 recovery.call('recover_teacher',dict(recover_data,username=students[0]['username']),409)
 assert teacher.call('status')['user']['id']==teacher_before['id']
 blocked=Client();blocked.call('status')
 for _ in range(15):blocked.call('login',{'username':'unknown.qa','password':'invalid'},401)
 blocked.call('login',{'username':'nastavnik.qa','password':'Teacher-QA-3333-password'},429)
 recovered=recovery.call('recover_teacher',recover_data)
 assert recovered['username']==recover_data['username'] and 'password' not in recovered
 assert recovery.call('status')['user'] is None and teacher.call('status')['user'] is None
 teacher.call('login',{'username':'nastavnik.qa','password':'Teacher-QA-3333-password'},401)
 teacher.call('login',{'username':recover_data['username'],'password':recover_data['password']})
 assert teacher.call('status')['user']['id']==teacher_before['id']
 assert teacher.call('dashboard',{})['classes']==classes_before
 assert a.call('status')['user']['id']==students[0]['id']
 assert teacher.call('submission',{'id':sub['id']})['submission']['grade']=='5'
 (ROOT/'.qa-online.json').write_text(json.dumps({'teacher':{'username':recover_data['username'],'password':recover_data['password']},'student':{'username':students[0]['username'],'password':'Student-QA-new-password'},'class':class1,'quiz':quiz,'project':project}))
 print('Online 33.33: MySQL/HTTP auth, custom logins, duplicate rollback, teacher recovery with key and CSRF, login lock clearing after recovery, session invalidation, preserved classes and work, grading, reset and deletion: PASS')
finally:server.terminate();server.wait(timeout=10);log.close()
