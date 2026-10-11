#!/usr/bin/env python3
"""Real HTTP/MySQL contest publication, privacy, grading and access regression."""
import http.cookiejar,json,os,pathlib,socket,subprocess,time,urllib.request,urllib.error,datetime,copy
ROOT=pathlib.Path(__file__).resolve().parents[1]
fixture=json.loads((ROOT/'.qa-online.json').read_text())
sock=socket.socket();sock.bind(('127.0.0.1',0));port=sock.getsockname()[1];sock.close()
log=open(ROOT/'.qa-competition-php.log','w')
server=subprocess.Popen(['php','-S',f'127.0.0.1:{port}','-t',str(ROOT/'website')],stdout=log,stderr=log,env=dict(os.environ,ELDI3333_CONFIG=str(ROOT/'.qa-config.php')))
BASE=f'http://127.0.0.1:{port}/eldi-edu/online/classroom-competition2.php?action='
class Client:
 def __init__(self):self.opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.csrf=''
 def call(self,action,data=None,expected=200,csrf=None):
  request=urllib.request.Request(BASE+action,data=None if data is None else json.dumps(data).encode(),headers={} if data is None else {'Content-Type':'application/json','X-CSRF-Token':self.csrf if csrf is None else csrf})
  try:r=self.opener.open(request,timeout=20);status=r.status;raw=r.read()
  except urllib.error.HTTPError as e:status=e.code;raw=e.read()
  body=json.loads(raw);assert status==expected,(action,status,expected,body)
  if body.get('csrf'):self.csrf=body['csrf']
  return body
try:
 for _ in range(60):
  try:urllib.request.urlopen(BASE+'status',timeout=1);break
  except OSError:time.sleep(.1)
 teacher=Client();assert teacher.call('status')['competition']=='3x10-for-2';teacher.call('login',fixture['teacher'])
 cls=teacher.call('create_class',{'title':'Takmičenje API QA'})['id']
 credentials=teacher.call('create_students',{'class_id':cls,'names':['Takmičar A','Takmičar B','Takmičar C']})['students']
 students=[]
 for data in credentials:
  c=Client();c.call('status');c.call('login',{'username':data['username'],'password':data['password']});students.append(c)
 student,partial,blank=students
 foreign=Client();foreign.call('status');foreign.call('login',fixture['student'])
 anonymous=Client();anonymous.call('status')
 catalog=teacher.call('section_catalog',{})['catalog'];banks={k:b for k,b in catalog.items() if b.get('competition')};assert len(banks)==3
 event=(datetime.date.today()+datetime.timedelta(days=7)).isoformat()
 pubs=teacher.call('publish_section',{'class_id':cls,'event_date':event,'banks':list(banks)})['assignments']
 repeat=teacher.call('publish_section',{'class_id':cls,'event_date':event,'banks':list(banks)})['assignments'];assert all(x['existing'] for x in repeat)
 def answers(bank):
  return [({'value':q['answer']} if q['mode']=='output' else {'gaps':q['solution']} if q['mode']=='fill' else {'order':q['solution']} if q['mode']=='order' else {'language':'python','source':q['reference']}) for q in bank['questions']]
 def no_hidden(v):
  if isinstance(v,dict):
   assert not set(v)&{'reference','solution','cases','answer','explanation','execution_output'},set(v)
   for value in v.values():no_hidden(value)
  elif isinstance(v,list):
   for value in v:no_hidden(value)
 for publication in pubs:
  aid=publication['id'];bank=banks[publication['level']];correct=answers(bank)
  view=student.call('assignment',{'id':aid})['assignment'];assert view['kind']=='contest' and view['questions']==[] and len(view['contest'])==10;no_hidden(view['contest'])
  assert view['section']['mentors']==['Elvir Čajić','Dino Isanović']
  foreign.call('assignment',{'id':aid},403)
  for route in ['try_competition','run_competition','competition_views']:
   payload={'id':aid,'question':6,'answer':correct[6],'input':bank['questions'][6]['cases'][0]['input']}
   anonymous.call(route,payload,401);foreign.call(route,payload,403);student.call(route,payload,403,csrf='invalid')
  student.call('try_competition',{'id':aid,'question':-1,'answer':{}},400)
  for i,q in enumerate(bank['questions']):
   trial=student.call('try_competition',{'id':aid,'question':i,'answer':correct[i]});assert trial['passed']==trial['total']
   assert len(trial['results'])==(1 if q['mode']=='output' else min(2,len(q['cases'])))
   if q['mode']=='output':assert 'expected' not in trial['results'][0] and 'answer' not in trial
  teacher.call('close',{'id':aid,'closed':True})
  student.call('try_competition',{'id':aid,'question':6,'answer':correct[6]},409);student.call('submit',{'id':aid,'payload':{'revision':2,'answers':correct}},409)
  teacher.call('close',{'id':aid,'closed':False})
  # A client cannot supply a score. All ten answers and private cases are authoritative.
  result=student.call('submit',{'id':aid,'payload':{'revision':2,'answers':correct,'score':999}});assert result['score']==100 and result['max_score']==100
  assert student.call('submit',{'id':aid,'payload':{'revision':2,'answers':[]}})['id']==result['id']
  shown=student.call('assignment',{'id':aid});assert shown['submission']['grade']=='5' and all('reference' in q for q in shown['assignment']['contest'])
  assert all('cases' not in q for q in shown['assignment']['contest'])
  partial.call('submission',{'id':result['id']},403);partial.call('certificate',{'submission_id':result['id']},403)
  cert=student.call('certificate',{'submission_id':result['id']})['certificate'];assert cert['meta']['competition'] and cert['score']==100
  review=teacher.call('submission',{'id':result['id']})['submission'];assert len(review['payload']['answers'])==10
  teacher.call('review',{'id':result['id'],'grade':'5','feedback':'Odličan takmičarski rad.'})
  bad=copy.deepcopy(correct);bad[0]={'value':'999999'};bad[1]={};bad[6]={'language':'python','source':'import os'}
  result2=partial.call('submit',{'id':aid,'payload':{'revision':2,'answers':bad}});assert result2['score']==70
  empty=blank.call('submit',{'id':aid,'payload':{'revision':2,'answers':[]}});assert empty['score']==0
  item={'kind':'assignment','id':aid};preview=teacher.call('deletion_preview',item);teacher.call('move_to_trash',dict(item,snapshot=preview['snapshot']))
  student.call('assignment',{'id':aid},404);student.call('certificate',{'submission_id':result['id']},404);teacher.call('restore_item',item)
  assert student.call('certificate',{'submission_id':result['id']})['certificate']['score']==100
 # Server checks all ten examples, not only the two displayed ones.
 q=banks['competition-1']['questions'][6];aid=pubs[0]['id']
 code='a = float(input())\nb = float(input())\nif a == 2.5:\n    print(3.75)\nelse:\n    print(-1.5)'
 assert student.call('try_competition',{'id':aid,'question':6,'answer':{'language':'python','source':code}})['passed']==2
 extra=teacher.call('create_students',{'class_id':cls,'names':['Takmičar hardcode']})['students'][0];hc=Client();hc.call('status');hc.call('login',extra)
 p=answers(banks['competition-1']);p[6]={'language':'python','source':code};assert hc.call('submit',{'id':aid,'payload':{'revision':2,'answers':p}})['score']==92
 # Invalid input, absent required structures and forged block IDs are rejected.
 aid=pubs[2]['id']
 student.call('try_competition',{'id':aid,'question':9,'answer':{'language':'python','source':'n = int(input())\nprint(n)'}},400)
 student.call('run_competition',{'id':aid,'question':9,'answer':answers(banks['competition-3'])[9],'input':['NaN']},400)
 student.call('try_competition',{'id':aid,'question':4,'answer':{'order':['fake']*6}},400)
 # Count questions grade the number of prints, not the printed string.
 for index,good,bad in [(0,'5','Volim školu'),(1,'3','2')]:
  assert student.call('try_competition',{'id':aid,'question':index,'answer':{'value':good}})['score']==10
  assert student.call('try_competition',{'id':aid,'question':index,'answer':{'value':bad}})['score']==0
 assert student.call('try_competition',{'id':aid,'question':3,'answer':{'gaps':['0']}})['score']==0
 while_answer={'language':'python','source':'n = int(input())\nwhile n > 0:\n    n -= 1\nprint(n)'}
 for route in ['try_competition','competition_views','run_competition']:
  student.call(route,{'id':aid,'question':9,'answer':while_answer,'input':['2']},400)
 # Existing snapshots refresh only without submissions. Simulate older revision in disposable QA DB.
 event2=(datetime.date.today()+datetime.timedelta(days=8)).isoformat()
 older=teacher.call('publish_section',{'class_id':cls,'event_date':event2,'banks':list(banks)})['assignments']
 old_result=student.call('submit',{'id':older[0]['id'],'payload':{'revision':2,'answers':answers(banks['competition-1'])}})
 fixture_script=r"""$c=require $argv[1];$db=new PDO($c['dsn'],$c['user'],$c['password']);$ids=json_decode(stream_get_contents(STDIN),true);foreach($ids as $id){$s=$db->prepare('SELECT metadata FROM eldi3333_section_tests WHERE assignment_id=?');$s->execute([$id]);$m=json_decode($s->fetchColumn(),true);$m['revision']=1;$s=$db->prepare('UPDATE eldi3333_section_tests SET metadata=? WHERE assignment_id=?');$s->execute([json_encode($m),$id]);$s=$db->prepare('SELECT questions FROM eldi3333_assignments WHERE id=?');$s->execute([$id]);$q=json_decode($s->fetchColumn(),true);$q[0]['prompt']='LEGACY QA SNAPSHOT';$s=$db->prepare('UPDATE eldi3333_assignments SET questions=? WHERE id=?');$s->execute([json_encode($q),$id]);}"""
 subprocess.run(['php','-r',fixture_script,str(ROOT/'.qa-config.php')],input=json.dumps([x['id'] for x in older]),text=True,check=True)
 student.call('refresh_competitions',{'class_id':cls},403)
 another={'name':'Other contest teacher','username':'other.contest.qa','password':'Other-Contest-QA-2026','role':'teacher'}
 teacher.call('create_teacher',another);other=Client();other.call('status');other.call('login',another);other.call('refresh_competitions',{'class_id':cls},403)
 assert teacher.call('refresh_competitions',{'class_id':teacher.call('create_class',{'title':'Empty contest QA'})['id']})['updated']==0
 item={'kind':'assignment','id':older[2]['id']};preview=teacher.call('deletion_preview',item);teacher.call('move_to_trash',dict(item,snapshot=preview['snapshot']))
 before=teacher.call('assignment',{'id':older[1]['id']})['assignment']
 changed=teacher.call('refresh_competitions',{'class_id':cls});assert changed['updated']==1 and changed['preserved']==1 and changed['current']==3,changed
 after=teacher.call('assignment',{'id':older[1]['id']})['assignment'];assert after['contest'][0]['id']=='l2-slozi-prosjek' and after['section']['revision']==2
 for key in ['id','class_id','due_at','closed','created_at']:assert before[key]==after[key]
 preserved=teacher.call('assignment',{'id':older[0]['id']})['assignment'];assert preserved['section']['revision']==1 and preserved['contest'][0]['prompt']=='LEGACY QA SNAPSHOT'
 assert student.call('certificate',{'submission_id':old_result['id']})['certificate']['score']==100
 student.call('submit',{'id':older[1]['id'],'payload':{'revision':1,'answers':answers(banks['competition-2'])}},409)
 assert student.call('submit',{'id':older[1]['id'],'payload':{'revision':2,'answers':answers(banks['competition-2'])}})['score']==100
 teacher.call('restore_item',item);assert teacher.call('refresh_competitions',{'class_id':cls})['updated']==1
 assert teacher.call('refresh_competitions',{'class_id':cls})['updated']==0
 # Preserve clean browser-only fixtures and bank references outside public_html.
 browser_creds=teacher.call('create_students',{'class_id':cls,'names':[{'name':'Takmičar Browser QA','username':'contest.browser.qa','password':'Contest-Browser-QA-2026'}]})['students'][0]
 (ROOT/'.qa-competition.json').write_text(json.dumps({'teacher':fixture['teacher'],'student':browser_creds,'class':cls,'banks':banks,'assignments':pubs}))
 print('Competition HTTP/MySQL: publication, 3x100 and partial/empty grading, hidden cases, ownership, CSRF, immutable final submission, cutoff, certificates and trash restore PASS')
finally:server.terminate();server.wait(timeout=10);log.close()
