/* An editorial learning sequence over the existing 1,000 skills. This is not a
 * declaration that every skill is aligned to, or approved by, an official NPP. */
(function(root,factory){
  'use strict';
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./math-catalog.json'):root.ELDI_MATH_CATALOG,node?require('./informatics-junior.json').concat(require('./informatics-senior.json')):root.ELDI_INFORMATICS_CATALOG);
  if(node)module.exports=api;else root.ELDI_CURRICULUM_MAP=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(math,info){
  'use strict';
  const catalog=[...math,...info],units=[];
  for(const subject of ['math','informatics'])for(let grade=5;grade<=9;grade++){
    const lessons=catalog.filter(l=>l.subject===subject&&l.grade===grade),categories=[...new Set(lessons.map(l=>l.category))];
    categories.forEach((title,index)=>units.push({id:`${subject}-${grade}-${index+1}`,subject,grade,title,order:index+1,lessonIds:lessons.filter(l=>l.category===title).map(l=>l.id),prerequisites:[]}));
  }
  const get=(subject,grade,title)=>units.find(u=>u.subject===subject&&u.grade===grade&&u.title===title);
  function depend(subject,grade,title,prereqs){
    const unit=get(subject,grade,title);if(!unit)throw Error('Nepoznata urednička cjelina: '+title);
    unit.prerequisites=prereqs.map(p=>{const previous=get(subject,typeof p==='string'?grade:p[0],typeof p==='string'?p:p[1]);if(!previous)throw Error('Nepoznat preduslov cjeline: '+p);return previous.id;});
  }
  const m=(g,t,p)=>depend('math',g,t,p),i=(g,t,p)=>depend('informatics',g,t,p);
  m(5,'Četiri računske operacije',['Brojevi i decimalni sistem']);
  m(5,'Izrazi i svojstva operacija',['Četiri računske operacije']);
  m(5,'Problemski zadaci s prirodnim brojevima',['Izrazi i svojstva operacija']);
  m(5,'Mjerenje i jedinice',['Četiri računske operacije']);
  m(5,'Geometrija i početno mjerenje',['Mjerenje i jedinice']);
  m(6,'Djeljivost brojeva',[[5,'Četiri računske operacije']]);
  m(6,'Prosti brojevi i faktorizacija',['Djeljivost brojeva']);
  m(6,'NZD, NZS i njihove primjene',['Prosti brojevi i faktorizacija']);
  m(6,'Zapis i vrijednost razlomka',[[5,'Četiri računske operacije']]);
  m(6,'Poređenje i uređivanje razlomaka',['Zapis i vrijednost razlomka','NZD, NZS i njihove primjene']);
  m(6,'Operacije s razlomcima',['Poređenje i uređivanje razlomaka']);
  m(6,'Geometrija: trouglovi',[[5,'Geometrija i početno mjerenje']]);
  m(6,'Geometrija: četverouglovi i uglovi',['Geometrija: trouglovi']);
  m(7,'Cijeli brojevi i brojevna prava',[[5,'Brojevi i decimalni sistem']]);
  m(7,'Racionalni brojevi s predznakom',['Cijeli brojevi i brojevna prava',[6,'Operacije s razlomcima']]);
  m(7,'Decimalni brojevi',[[6,'Zapis i vrijednost razlomka']]);
  m(7,'Omjeri i proporcionalnost',['Racionalni brojevi s predznakom']);
  m(7,'Procentni račun',['Omjeri i proporcionalnost','Decimalni brojevi']);
  m(7,'Uglovi i odnosi u ravni',[[6,'Geometrija: četverouglovi i uglovi']]);
  m(7,'Koordinatni sistem',['Cijeli brojevi i brojevna prava']);
  m(7,'Mjerenje trouglova s racionalnim dužinama',['Racionalni brojevi s predznakom',[6,'Geometrija: trouglovi']]);
  m(8,'Stepeni i naučni zapis',[[7,'Racionalni brojevi s predznakom']]);
  m(8,'Kvadratni korijen',['Stepeni i naučni zapis']);
  m(8,'Polinomi i algebarski izrazi',['Stepeni i naučni zapis']);
  m(8,'Jednačine s jednom nepoznatom',['Polinomi i algebarski izrazi']);
  m(8,'Linearne nejednačine',['Jednačine s jednom nepoznatom']);
  m(8,'Vektori u ravni',[[7,'Koordinatni sistem']]);
  m(8,'Pitagorina teorema i primjene',['Kvadratni korijen',[7,'Mjerenje trouglova s racionalnim dužinama']]);
  m(8,'Površine ravnih likova',[[6,'Geometrija: četverouglovi i uglovi']]);
  m(8,'Krug, luk i kružni isječak',['Površine ravnih likova']);
  m(9,'Linearne i druge funkcije',[[8,'Jednačine s jednom nepoznatom'],[7,'Koordinatni sistem']]);
  m(9,'Sistemi linearnih jednačina',[[8,'Jednačine s jednom nepoznatom']]);
  m(9,'Sličnost i proporcionalna geometrija',[[7,'Omjeri i proporcionalnost'],[8,'Pitagorina teorema i primjene']]);
  m(9,'Prostorni odnosi i diedar',[[7,'Uglovi i odnosi u ravni']]);
  m(9,'Geometrijska tijela',['Prostorni odnosi i diedar',[8,'Površine ravnih likova'],[8,'Krug, luk i kružni isječak']]);
  m(9,'Statistika i obrada podataka',[[7,'Decimalni brojevi']]);
  m(9,'Vjerovatnoća i prebrojavanje',['Statistika i obrada podataka',[6,'Zapis i vrijednost razlomka']]);
  i(5,'Operativni sistem',['Računar i uređaji']);i(5,'Datoteke i mape',['Operativni sistem']);
  i(5,'Pisanje i uređivanje',['Datoteke i mape']);i(5,'Internet i pretraživanje',['Operativni sistem']);
  i(5,'Digitalna odgovornost',['Internet i pretraživanje']);i(5,'Događaji i slijed',['Scena i likovi']);
  i(5,'Promjenljive i odluke',['Događaji i slijed']);i(5,'Petlje i algoritmi',['Promjenljive i odluke']);
  i(6,'Digitalni podaci',[[5,'Računar i uređaji']]);i(6,'Sistem i pohrana',[[5,'Datoteke i mape'],'Digitalni podaci']);
  i(6,'Oblikovanje dokumenta',[[5,'Pisanje i uređivanje']]);i(6,'Proračunska tablica',['Oblikovanje dokumenta']);
  i(6,'Prezentacija',['Oblikovanje dokumenta']);i(6,'Mreže',[[5,'Internet i pretraživanje']]);
  i(6,'Uslovi u blokovima',[[5,'Promjenljive i odluke']]);i(6,'Upravljanje petljama',[[5,'Petlje i algoritmi']]);
  i(6,'Liste i funkcije',['Upravljanje petljama']);i(6,'Blokovske igre',['Uslovi u blokovima','Liste i funkcije']);
  i(7,'Baze i kodiranje',[[6,'Digitalni podaci']]);i(7,'Logika i algoritamski obrasci',[[6,'Uslovi u blokovima']]);
  i(7,'Liste i matrice',[[6,'Liste i funkcije']]);i(7,'Moduli i projekti',['Liste i matrice']);
  i(7,'Napredna tablica',[[6,'Proračunska tablica']]);i(7,'Mrežni servisi',[[6,'Mreže']]);
  i(7,'Sigurnost i podaci',['Mrežni servisi',[5,'Digitalna odgovornost']]);i(7,'Multimedija i web',[[6,'Prezentacija'],'Mrežni servisi']);
  i(7,'Tekstualno programiranje',['Logika i algoritamski obrasci','Liste i matrice']);i(7,'Istraživanje i timski rad',['Moduli i projekti','Sigurnost i podaci']);
  i(8,'Brojevni sistemi',[[7,'Baze i kodiranje']]);i(8,'Predstavljanje podataka',['Brojevni sistemi']);
  i(8,'Logika',[[7,'Logika i algoritamski obrasci']]);i(8,'Algoritmi',['Logika']);
  i(8,'Python',['Algoritmi',[7,'Tekstualno programiranje']]);i(8,'C++',['Algoritmi',[7,'Tekstualno programiranje']]);
  i(8,'Web',[[7,'Multimedija i web']]);i(8,'Baze podataka',[[7,'Liste i matrice']]);
  i(8,'Mreže',[[7,'Mrežni servisi']]);i(8,'Scratch i blokovi',[[6,'Blokovske igre']]);
  i(9,'C',[[8,'Algoritmi'],[8,'C++']]);i(9,'Java',[[8,'Algoritmi']]);i(9,'Python',[[8,'Python']]);
  i(9,'Algoritmi',[[8,'Algoritmi']]);i(9,'Strukture podataka',['Algoritmi',[7,'Liste i matrice']]);
  i(9,'Baze podataka',[[8,'Baze podataka']]);i(9,'Mreže i sigurnost',[[8,'Mreže'],[7,'Sigurnost i podaci']]);
  i(9,'Digitalna odgovornost',[[7,'Sigurnost i podaci']]);i(9,'Datoteke i sigurnost',['Digitalna odgovornost']);
  i(9,'Predstavljanje podataka',[[8,'Predstavljanje podataka']]);i(9,'Logika',[[8,'Logika']]);
  i(9,'Scratch i blokovi',[[8,'Scratch i blokovi']]);
  const outcomes=units.map(unit=>({id:'editorial-'+unit.id,subject:unit.subject,grade:unit.grade,title:unit.title,lessonIds:unit.lessonIds.slice(),officialId:'',source:'',schoolYear:'',page:'',reviewer:'',reviewedAt:'',status:'editorial',notes:'Urednički plan ELDI EDU: redoslijed postojećih vještina. Službeno povezivanje ishoda zahtijeva pregled odgovarajućeg dokumenta za razred i školsku godinu.'}));
  return Object.freeze({version:1,checkedAt:'2026-10-08',basis:'Urednički plan ELDI EDU',source:{title:'Pedagoški zavod Tuzlanskog kantona — NPP za osnovno obrazovanje',url:'https://pztz.ba/Page.aspx?id1=62',note:'PZTK navodi sukcesivnu primjenu novog kurikuluma: 2025/2026. prvi razred; Osnovi tehnike i informatike peti razred od 2025/2026; Informatika i Tehnička kultura šesti razred od 2026/2027. Prethodni programi za više razrede navedeni su na istoj stranici. Provjeriti predmet, razred i godinu prije povezivanja ishoda.'},units,outcomes});
});
