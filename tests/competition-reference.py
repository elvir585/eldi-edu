#!/usr/bin/env python3
"""Validate expected arithmetic independently against CPython execution."""
from pathlib import Path
import json,subprocess,sys,math
root=Path(__file__).resolve().parents[1]
raw=(root/'website/eldi-edu/online/competition-bank.php').read_text()
banks=json.loads(raw.split("ELDI_COMPETITION_JSON'\n",1)[1].split('\nELDI_COMPETITION_JSON,',1)[0])
assert len(banks)==3
ids=set();count=0
for bank in banks.values():
 assert len(bank['questions'])==10 and sum(q['points'] for q in bank['questions'])==100
 for q in bank['questions']:
  assert q['for_only'] and 'while' not in q['reference']
  assert q['id'] not in ids;ids.add(q['id'])
  if q['mode']=='fill':
   src=q['template']
   for i,s in enumerate(q['solution'],1):src=src.replace('__'+str(i)+'__',s)
   assert src.strip()==q['reference'].strip()
  if q['mode']=='order':
   pieces={p['id']:p['code'] for p in q['pieces']}
   assert '\n'.join(pieces[i] for i in q['solution'])==q['reference'].rstrip()
   assert [p['id'] for p in q['pieces']]!=q['solution']
  for c in q['cases']:
   run=subprocess.run([sys.executable,'-c',q['reference']],input='\n'.join(c['input'])+'\n',capture_output=True,text=True,timeout=2,check=True)
   if q.get('response_kind')=='count':
    assert run.stdout.splitlines()==q['execution_output']
    assert len(q['execution_output'])==int(q['answer']);count+=1;continue
   actual=run.stdout.split();assert len(actual)==len(c['output']),q['id']
   assert all(math.isclose(float(x),float(y),rel_tol=1e-9,abs_tol=1e-9) for x,y in zip(actual,c['output'])),(q['id'],c,actual)
   count+=1
assert count==219
print('Competition: CPython independently verifies all 219 cases and all 30 reference tasks PASS')
