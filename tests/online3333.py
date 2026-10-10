#!/usr/bin/env python3
"""Real HTTP + MySQL checks. Uses only a disposable CI database."""
import http.cookiejar, json, os, pathlib, socket, subprocess, time, urllib.request, urllib.error
ROOT=pathlib.Path(__file__).resolve().parents[1]
config=ROOT/'.qa-config.php'
config.write_text("<?php return ['dsn'=>'mysql:host=127.0.0.1;port=3306;dbname=eldi3333qa;charset=utf8mb4','user'=>'root','password'=>'eldi-ci-only-password','install_token'=>'ci-only-install-key-not-for-production-3333'];")
os.environ['ELDI3333_CONFIG']=str(config)
sock=socket.socket();sock.bind(('127.0.0.1',0));port=sock.getsockname()[1];sock.close()
log=open(ROOT/'.qa-php.log','w');server=subprocess.Popen(['php','-S',f'127.0.0.1:{port}','-t',str(ROOT/'website')],stdout=log,stderr=log,env=os.environ)
BASE=f'http://127.0.0.1:{port}/eldi-edu/online/classroom-119.php?action='
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

 # Section access, approval, server grading, awards, and teacher preview.
 section_class=teacher.call('create_class',{'title':'Mladi matematičari QA'})['id']
 second_section=teacher.call('create_class',{'title':'Druga sekcija QA'})['id']
 catalog=teacher.call('section_catalog',{})['catalog']
 assert len(catalog)==119 and all(1<=len(t['questions'])<=20 for t in catalog.values())
 assert sum(t['featured'] for t in catalog.values())==7
 assert all(len(t['questions'])==20 for t in catalog.values() if t['featured'])
 anonymous.call('section_catalog',{},401)
 a.call('section_catalog',{},403)
 token=teacher.call('set_invite',{'class_id':section_class,'enabled':True})['invite']['token']
 school=anonymous.call('invite_info',{'token':token})['schools'][0]
 anonymous.call('invite_info',{'token':'invalid'},404)
 registration={'token':token,'name':'Učenik registracija QA','school':school,'username':'registracija.qa','password':'Self-selected-QA-password'}
 anonymous.call('register_student',registration,403,csrf='invalid')
 anonymous.call('register_student',dict(registration,password='short'),400)
 assert anonymous.call('register_student',registration)['pending']
 registered=Client();registered.call('status');registered.call('login',{'username':registration['username'],'password':registration['password']})
 registered_id=registered.call('status')['user']['id']
 assert registered.call('dashboard',{})['classes']==[]
 assert registered.call('dashboard',{})['join_requests'][0]['state']=='pending'
 registered.call('approve_student',{'class_id':section_class,'student_id':registered_id,'approve':True},403)
 request=teacher.call('section_access',{'class_id':section_class})['requests'][0]
 assert request['user_id']==registered_id
 teacher.call('approve_student',{'class_id':second_section,'student_id':registered_id,'approve':True},409)
 teacher.call('approve_student',{'class_id':section_class,'student_id':registered_id,'approve':True})
 assert registered.call('dashboard',{})['classes'][0]['id']==section_class
 teacher.call('approve_student',{'class_id':section_class,'student_id':registered_id,'approve':True},409)
 anonymous.call('register_student',dict(registration,password='Wrong-but-long-password'),409)
 assert not anonymous.call('register_student',registration)['pending']
 from datetime import datetime,timedelta,timezone
 event=(datetime.now(timezone.utc)+timedelta(days=2)).date().isoformat()
 teacher.call('publish_section',{'class_id':section_class,'event_date':event,'banks':['missing']},400)
 pub=teacher.call('publish_section',{'class_id':section_class,'event_date':event,'banks':['math5','python','blocks']})['assignments']
 again=teacher.call('publish_section',{'class_id':section_class,'event_date':event,'banks':['math5','python','blocks']})['assignments']
 assert [x['id'] for x in pub]==[x['id'] for x in again] and all(x['existing'] for x in again)
 section_quiz,python_quiz,block_quiz=[x['id'] for x in pub]
 a.call('assignment',{'id':section_quiz},403)
 for test in pub:
  visible=registered.call('assignment',{'id':test['id']})['assignment']
  assert len(visible['questions'])==20
  assert all('answer' not in q and 'explanation' not in q for q in visible['questions'])
 assert registered.call('assignment',{'id':python_quiz})['assignment']['questions'][0]['code'].startswith('a = 7')
 assert registered.call('assignment',{'id':block_quiz})['assignment']['questions'][0]['blocks']
 answers=[str(q['answer']) for q in catalog['math5']['questions']]
 graded=registered.call('submit',{'id':section_quiz,'payload':{'answers':answers,'score':0,'grade':'1'}})
 assert graded['score']==100 and graded['max_score']==100
 done=registered.call('assignment',{'id':section_quiz})['submission']
 assert done['grade']=='5'
 cert=registered.call('certificate',{'submission_id':graded['id']})['certificate']
 assert cert['grade']=='5' and cert['percent']==100 and cert['badge']=='Zlatna značka znanja'
 assert cert['meta']['mentors']==['Dino Isanović','Elvir Čajić']
 b.call('certificate',{'submission_id':graded['id']},403)
 assert teacher.call('certificate',{'submission_id':graded['id']})['certificate']['id']==cert['id']
 wrong=registered.call('submit',{'id':python_quiz,'payload':{'answers':['999999']*20,'score':100,'grade':'5'}})
 assert wrong['score']==0
 assert registered.call('certificate',{'submission_id':wrong['id']})['certificate']['grade']=='1'
 registered.call('preview_student',{'class_id':section_class},403)
 registered.call('return_teacher',{},401)
 teacher_id=teacher.call('status')['user']['id']
 demo=teacher.call('preview_student',{'class_id':section_class})['user']
 assert demo['role']=='student' and '(probni učenik)' in demo['display_name']
 assert teacher.call('status')['preview']
 teacher.call('set_invite',{'class_id':section_class,'enabled':True},403)
 assert teacher.call('return_teacher',{})['user']['id']==teacher_id
 assert not teacher.call('status')['preview']
 assert teacher.call('preview_student',{'class_id':section_class})['user']['id']==demo['id']
 teacher.call('return_teacher',{})
 second_token=teacher.call('set_invite',{'class_id':second_section,'enabled':True})['invite']['token']
 assert anonymous.call('register_student',dict(registration,token=second_token))['pending']
 teacher.call('approve_student',{'class_id':second_section,'student_id':registered_id,'approve':True})
 teacher.call('remove_student',{'class_id':second_section,'student_id':registered_id})
 assert registered.call('status')['user']['id']==registered_id
 assert registered.call('certificate',{'submission_id':graded['id']})['certificate']['score']==100
 teacher.call('set_invite',{'class_id':section_class,'enabled':False})
 anonymous.call('invite_info',{'token':token},404)
 # Public selection gives only enabled sections, never pupils or invite keys.
 public=anonymous.call('public_sections',{})
 assert all(set(c)=={'id','title'} for c in public['classes'])
 assert section_class not in [c['id'] for c in public['classes']]
 teacher.call('set_invite',{'class_id':section_class,'enabled':True})
 public_reg=dict(registration,token='',class_id=section_class,username='public119.qa')
 anonymous.call('register_student',public_reg)
 pending=Client();pending.call('status');pending.call('login',{'username':public_reg['username'],'password':public_reg['password']})
 pending.call('project_load',{},403)
 pupil_id=pending.call('status')['user']['id']
 teacher.call('approve_student',{'class_id':section_class,'student_id':pupil_id,'approve':True})
 # Per-account cloud storage, optimistic revision, and forbidden identity override.
 anonymous.call('project_load',{},401)
 assert registered.call('project_load',{})['revision']==0
 profile={'name':'Rad učenika','studio33Work':{'module':'blocks','blocks':{'example':'private-A'}}}
 saved=registered.call('project_save',{'revision':0,'profile':profile,'user_id':pupil_id});assert saved['revision']==1
 assert registered.call('project_load',{})['profile']==profile
 assert pending.call('project_load',{})['profile'] is None
 registered.call('project_save',{'revision':0,'profile':profile},409)
 registered.call('project_save',{'revision':1,'profile':profile},403,csrf='wrong')
 registered.call('project_save',{'revision':1,'profile':{'name':'x','studio33Work':{'text':'x'*2100000}}},400)
 profile['name']='Nova verzija'
 assert registered.call('project_save',{'revision':1,'profile':profile})['revision']==2
 registered.call('project_save',{'revision':1,'profile':profile},409)
 # Practical grading executes submitted work against private cases on server.
 keys=[k for k,t in catalog.items() if t.get('practical')]
 assert len(keys)==7
 programs=teacher.call('publish_section',{'class_id':section_class,'event_date':event,'banks':keys})['assignments']
 for task in programs:
  ident,key=task['id'],task['level']
  visible=registered.call('assignment',{'id':ident})['assignment']
  assert visible['kind']=='program' and 'reference' not in visible['practical'] and 'cases' not in visible['practical'] and visible['questions']==[]
  a.call('try_program',{'id':ident,'payload':{'language':'python','source':'print(1)'}},403)
  reference=catalog[key]['reference']
  payload={'language':'python','source':reference,'score':0,'grade':'1'}
  probed=registered.call('try_program',{'id':ident,'payload':payload})
  assert probed['passed']==2
  out=registered.call('submit',{'id':ident,'payload':payload})
  assert out['score']==100 and registered.call('certificate',{'submission_id':out['id']})['certificate']['grade']=='5'
  assert registered.call('submit',{'id':ident,'payload':{'language':'python','source':'print(0)'}})['id']==out['id']
 first=programs[0]['id']
 pending.call('try_program',{'id':first,'payload':{'language':'python','source':'import os'}},400)
 loop=pending.call('try_program',{'id':first,'payload':{'language':'python','source':'while True:\n    pass'}})
 assert loop['passed']==0 and all('ograničenje' in r['error'] for r in loop['results'])
 # A hard-coded sample answer earns only matching cases, never the client score.
 result=pending.call('submit',{'id':first,'payload':{'language':'python','source':'print(5)','score':100,'grade':'5'}})
 assert 0<=result['score']<100 and pending.call('certificate',{'submission_id':result['id']})['certificate']['grade']=='1'
 block_task=next(t['id'] for t in programs if t['level']=='practice-maximum')
 workspace={'blocks':{'blocks':[{'type':'task_read','fields':{'NAME':'a'},'next':{'block':{'type':'task_read','fields':{'NAME':'b'},'next':{'block':{'type':'task_print','fields':{'EXPR':'max(a, b)'}}}}}}]}}
 blocks=pending.call('submit',{'id':block_task,'payload':{'language':'blocks','workspace':workspace,'source':'print(9999)'}})
 assert blocks['score']==100
 b.call('submission',{'id':blocks['id']},403)
 assert pending.call('assignment',{'id':block_task})['submission']['payload']['source'].endswith('print(max(a, b))\n')
 print('Complete119: public registration, account isolation, CAS conflicts, limits, private cases, Python and block grading, forged-score protection PASS')
 print('Sections: 119 banks, approval, shared accounts, private answers, authoritative grades and awards, preview/return, and scoped removal: PASS')
 (ROOT/'.qa-online.json').write_text(json.dumps({'teacher':{'username':recover_data['username'],'password':recover_data['password']},'student':{'username':students[0]['username'],'password':'Student-QA-new-password'},'class':class1,'quiz':quiz,'project':project}))
 print('Online 33.33: MySQL/HTTP auth, custom logins, duplicate rollback, teacher recovery with key and CSRF, login lock clearing after recovery, session invalidation, preserved classes and work, grading, reset and deletion: PASS')
finally:server.terminate();server.wait(timeout=10);log.close()
