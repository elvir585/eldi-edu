(function(root,factory){
  'use strict';
  const api=factory(typeof module==='object'&&module.exports?require('../content/program-assessments.js'):root.ELDI_PROGRAM_ASSESSMENTS);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ELDIProgramAssessmentEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(tasks){
  'use strict';
  const LANGUAGES=['python','c','cpp','java'],MAX_SOURCE=128*1024,MAX_ATTEMPTS=200;
  const ids=new Set(tasks.map(t=>t.id));
  const bytes=text=>typeof Buffer!=='undefined'?Buffer.byteLength(text,'utf8'):new TextEncoder().encode(text).length;
  function object(value,label){if(!value||typeof value!=='object'||Array.isArray(value))throw Error(label+': neispravan zapis.');return value;}
  function str(value,max,label){if(typeof value!=='string'||value.length>max)throw Error(label+': neispravan tekst.');return value;}
  function integer(value,min,max,label){if(!Number.isInteger(value)||value<min||value>max)throw Error(label+': neispravan broj.');return value;}
  function timestamp(value){str(value,40,'Datum');if(!Number.isFinite(Date.parse(value)))throw Error('Neispravan datum rezultata.');return value;}
  function normalizeState(value){
    if(value===undefined)return{drafts:{},attempts:[],assisted:{}};
    object(value,'Programerska zbirka');
    const out={drafts:{},attempts:[],assisted:{}};
    if(value.drafts!==undefined){
      object(value.drafts,'Programerski nacrti');
      const entries=Object.entries(value.drafts);if(entries.length>tasks.length*4)throw Error('Previše programerskih nacrta.');
      let total=0;
      for(const [key,code]of entries){const [id,language,...rest]=key.split(':');if(!ids.has(id)||!LANGUAGES.includes(language)||rest.length)throw Error('Nepoznat programski nacrt.');str(code,MAX_SOURCE,'Programski kod');const size=bytes(code);if(size>MAX_SOURCE)throw Error('Kod smije imati do 128 KB.');total+=size;if(total>8*1024*1024)throw Error('Programerski nacrti smiju imati do 8 MB.');out.drafts[key]=code;}
    }
    if(value.assisted!==undefined){object(value.assisted,'Pomoć u programiranju');for(const [id,flag]of Object.entries(value.assisted)){if(!ids.has(id)||typeof flag!=='boolean')throw Error('Neispravan zapis pomoći.');out.assisted[id]=flag;}}
    if(value.attempts!==undefined){
      if(!Array.isArray(value.attempts)||value.attempts.length>MAX_ATTEMPTS)throw Error('Moguće je sačuvati do 200 programerskih pokušaja.');
      out.attempts=value.attempts.map(raw=>{
        object(raw,'Programerski rezultat');if(!ids.has(raw.taskId)||!LANGUAGES.includes(raw.language))throw Error('Nepoznat zadatak ili programski jezik.');
        const t=tasks.find(t=>t.id===raw.taskId),total=integer(raw.total,1,8,'Broj testova'),passed=integer(raw.passed,0,total,'Broj prošlih testova');if(total!==t.testCount)throw Error('Broj testova ne odgovara zadatku.');
        if(typeof raw.assisted!=='boolean')throw Error('Neispravan zapis pomoći u rezultatu.');
        return{taskId:raw.taskId,language:raw.language,passed,total,percentage:passed*100/total,grade:grade(passed*100/total),assisted:raw.assisted,date:timestamp(raw.date)};
      });
    }
    return out;
  }
  function grade(percentage){if(typeof percentage!=='number'||!Number.isFinite(percentage)||percentage<0||percentage>100)throw Error('Neispravan procenat.');return percentage>=90?5:percentage>=80?4:percentage>=65?3:percentage>=50?2:1;}
  function compareOutput(actual,expected){return String(actual??'').trim().split(/\s+/).join(' ')===String(expected??'').trim().split(/\s+/).join(' ');}
  function record(state,result,assisted){
    if(!result||result.cancelled||!result.completed)return null;
    const candidate={taskId:result.taskId,language:result.language,passed:result.passed,total:result.total,assisted:!!assisted,date:new Date().toISOString()};
    const record=normalizeState({attempts:[candidate]}).attempts[0];state.attempts.push(record);state.attempts=state.attempts.slice(-MAX_ATTEMPTS);return record;
  }
  function progress(state){const normalized=normalizeState(state);return{attempts:normalized.attempts.length,completed:new Set(normalized.attempts.filter(a=>a.passed===a.total).map(a=>a.taskId)).size,independent:new Set(normalized.attempts.filter(a=>a.passed===a.total&&!a.assisted).map(a=>a.taskId)).size};}
  return{tasks,LANGUAGES,MAX_SOURCE,MAX_ATTEMPTS,normalizeState,grade,compareOutput,record,progress};
});
