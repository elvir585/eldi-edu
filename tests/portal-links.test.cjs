'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {portalURL}=require('../desktop/portal-links.cjs');
test('portal exposes only intended public destinations',()=>{
  for(const key of ['center','instructions','support']) {
    const url=new URL(portalURL(key));
    assert.equal(url.origin,'https://upinitk.com');
    assert.equal(url.pathname,'/eldi-edu/');
    assert.equal(url.search,'');
  }
  assert.equal(portalURL('releases'),'https://github.com/elvir585/eldi-edu/releases/latest');
});
test('portal rejects renderer-supplied URLs, prototypes and non-string values',()=>{
  for(const value of ['https://upinitk.com/','https://evil.example','file:///etc/passwd','javascript:alert(1)','__proto__','constructor','toString','center#other','',null,undefined,{},[],{toString:()=> 'center'}]) assert.throws(()=>portalURL(value));
});
