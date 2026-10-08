/* ELDI EDU 10.0: deterministic offline mathematics collection for grades 5–9.
 * Browser global EduExercises; Node CommonJS. Requires EduMath/math-engine.js.
 * topics: [{id,grade,title,description,variantCount:200}].
 * generate(topicId,seed,difficulty='medium'): seed 1..200 selects an indexed
 * variant; other numeric seeds wrap, string seeds hash. Three meaningful levels.
 * Task fields: {key,label,answer,type:'number'|'list'|'text',tolerance?}.
 * Numeric grading accepts final signed integers, decimal comma/dot and simple
 * equivalent fractions; not a repeated unsolved expression. tolerance, when
 * present, is an ABSOLUTE numeric tolerance. format:'reducedFraction' enforces
 * a positive denominator and relatively prime numerator/denominator.
 * Lists accept spaces/commas/semicolons and compare unordered numeric multisets
 * unless ordered:true. Text ignores case/diacritics and supports accepted[].
 * checkField(field,user)->{correct,message}; check(task,answers)->{correct,fields}.
 * answers is an object keyed by field.key. Steps contain worked calculations.
 */
(function(root,factory){
  'use strict';
  const math=typeof module==='object'&&module.exports ? require('./math-engine.js') : root.EduMath;
  const api=factory(math);
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) root.EduExercises=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(M){
  'use strict';
  if(!M) throw new Error('Prvo učitajte matematički modul EduMath.');
  const variantsPerTopic=200, topics=[], generators={};
  const finalNumber=/^(?:[+-]?\d+\s*\/\s*[+-]?\d+|[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+))$/;
  const R=value=>M.rational(value), fmt=value=>R(value).toString();
  const f=(key,label,answer,type='number',tolerance)=>{
    const field={key,label,answer:Array.isArray(answer)?answer.map(String):String(answer),type};
    if(tolerance!==undefined) field.tolerance=tolerance;
    return field;
  };
  function add(id,grade,title,description,generate){
    if(generators[id]) throw new Error('Dupli identifikator teme: '+id);
    topics.push(Object.freeze({id,grade,title,description,variantCount:variantsPerTopic}));
    generators[id]=generate;
  }
  function hash(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function context(topicId,seed,difficulty){
    const numeric=typeof seed==='number'&&Number.isFinite(seed)?Math.trunc(seed):/^[-+]?\d+$/.test(String(seed))?Number(seed):null;
    const index=numeric!==null&&Number.isSafeInteger(numeric)?((numeric-1)%200+200)%200:hash(String(seed))%200;
    const level={easy:1,medium:2,hard:3}[difficulty];
    if(!level) throw new Error('Težina mora biti easy, medium ili hard.');
    let state=hash(topicId+'|'+index+'|'+difficulty);
    const rand=(min,max)=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return min+state%(max-min+1);};
    return {index,difficulty,level,rand,R,fmt,f};
  }
  const simple=(prompt,answer,steps,hint,key='answer',label='Odgovor')=>({prompt,fields:[f(key,label,answer)],steps,hint});
  const decimal=value=>R(value).toDecimal(10).replace('.',',');

  // Grade 5: large natural numbers, all operations, expressions and measurement.
  add('natural-add',5,'Sabiranje velikih prirodnih brojeva','Tačno sabiranje brojeva do milion i preko milion.',c=>{
    const a=BigInt(c.level===1?12340:c.level===2?1200340:'9007199254740993')+BigInt(c.index)*137n,b=BigInt(c.rand(1021,9876))*BigInt(c.level);
    const aq=a/1000n,ar=a%1000n,bq=b/1000n,br=b%1000n,low=ar+br,carry=low/1000n;
    return simple(`${a} + ${b} = ?`,a+b,[`Rastavimo brojeve na hiljade i ostatak: ${a} = ${aq}·1000 + ${ar}; ${b} = ${bq}·1000 + ${br}.`,`Manji dijelovi: ${ar} + ${br} = ${low}; prenos u hiljade je ${carry}, a ostatak ${low%1000n}.`,`Hiljade: ${aq} + ${bq} + ${carry} = ${aq+bq+carry}.`,`Zbir je ${aq+bq+carry}·1000 + ${low%1000n} = ${a+b}.`],'Poravnaj jedinice, desetice, stotice i ostale mjesne vrijednosti.');
  });
  add('natural-subtract',5,'Oduzimanje velikih prirodnih brojeva','Oduzimanje s prelaskom preko mjesnih vrijednosti.',c=>{
    const a=BigInt(c.level===1?70000:c.level===2?3000000:'10000000000000001')+BigInt(c.index)*319n,b=BigInt(c.rand(1001,29999));
    return simple(`${a} − ${b} = ?`,a-b,[`Umanjenik je ${a}, a umanjilac ${b}.`,`Razlika je ${a} − ${b} = ${a-b}.`,`Provjera: ${a-b} + ${b} = ${a}.`],'Kod nedovoljnog broja jedinica posudi jednu jedinicu više mjesne vrijednosti.');
  });
  add('natural-multiply',5,'Množenje prirodnih brojeva','Proizvodi s velikim brojevima i višecifrenim faktorima.',c=>{
    const a=BigInt(125+c.index*17)*(c.level===3?100003n:BigInt(c.level)),b=BigInt(c.level===1?c.rand(2,9):c.rand(12,89));
    const tens=b/10n*10n,ones=b%10n;
    return simple(`${a} · ${b} = ?`,a*b,[`Drugi faktor rastavimo: ${b} = ${tens} + ${ones}.`,`Parcijalni proizvodi: ${a}·${tens} = ${a*tens}, a ${a}·${ones} = ${a*ones}.`,`Sabiramo: ${a*tens} + ${a*ones} = ${a*b}.`,`Provjera dijeljenjem: ${a*b} : ${b} = ${a}.`],'Množenje razloži po ciframa drugog faktora.');
  });
  add('natural-divide',5,'Dijeljenje prirodnih brojeva','Dijeljenje bez ostatka i provjera proizvoda.',c=>{
    const divisor=c.level===1?c.rand(2,9):c.rand(11,49),q=BigInt(111+c.index*23)*(c.level===3?10001n:1n),a=q*BigInt(divisor);
    return simple(`${a} : ${divisor} = ?`,q,[`Tražimo broj q za koji je ${divisor} · q = ${a}.`,`Količnik je q = ${q}.`,`Provjera: ${q} · ${divisor} = ${a}.`],'Količnik pomnožen djeliocem mora dati djeljenik.');
  });
  add('natural-remainder',5,'Dijeljenje s ostatkom','Količnik, ostatak i uslov da je ostatak manji od djelioca.',c=>{
    const d=3+c.level*5,q=20+c.index,r=c.index%d,a=d*q+r;
    return {prompt:`Podijeli ${a} sa ${d}. Odredi cijeli količnik i ostatak.`,fields:[f('q','Količnik',q),f('r','Ostatak',r)],steps:[`${a} = ${d} · ${q} + ${r}.`,`Ostatak ${r} je nenegativan i manji od ${d}.`],hint:'Zapiši a = d·q + r, gdje je 0 ≤ r < d.'};
  });
  add('natural-expression',5,'Redoslijed računskih operacija','Izrazi sa zagradama i četiri računske operacije.',c=>{
    const a=30+c.index*c.level,b=c.rand(3,15)*c.level,d=c.rand(2,9)*c.level,e=c.rand(2,8)*c.level,value=BigInt(a+b)*BigInt(d)-BigInt(e);
    return simple(`(${a} + ${b}) · ${d} − ${e} = ?`,value,[`Prvo zagrada: ${a} + ${b} = ${a+b}.`,`Zatim množenje: ${a+b} · ${d} = ${(a+b)*d}.`,`Na kraju oduzimanje: ${(a+b)*d} − ${e} = ${value}.`],'Zagrade imaju prednost, zatim množenje i dijeljenje.');
  });
  add('natural-round',5,'Zaokruživanje prirodnih brojeva','Zaokruživanje na desetice, stotice i hiljade.',c=>{
    const place=10**c.level,a=100001+c.index*347+c.rand(0,19),value=Math.floor((a+place/2)/place)*place;
    return simple(`Zaokruži broj ${a} na najbližih ${place}.`,value,[`Posmatramo ostatak ${a%place} pri dijeljenju sa ${place}.`,`${a%place} ${a%place>=place/2?'≥':'<'} ${place/2}, pa zaokružujemo ${a%place>=place/2?'naviše':'naniže'}.`,`Zaokružen broj je ${value}.`],'Ako je prvi odbačeni dio najmanje polovina jedinice zaokruživanja, povećaj zadržani dio za jedan.');
  });
  add('natural-place',5,'Mjesna vrijednost cifre','Cifre i njihove vrijednosti u višecifrenom broju.',c=>{
    const a=1234567+c.index*379,place=10**(c.level+1),digit=Math.floor(a/place)%10;
    return simple(`U broju ${a} odredi mjesnu vrijednost cifre na mjestu ${place}.`,digit*place,[`Cifra na mjestu ${place} je ${digit}.`,`Njena mjesna vrijednost je ${digit} · ${place} = ${digit*place}.`],'Vrijednost cifre je cifra puta vrijednost njenog mjesta.');
  });
  add('word-natural-total',5,'Tekstualni zadatak: ukupna količina','Sabiranje i oduzimanje u školskom kontekstu.',c=>{
    const initial=1500+c.index*11,added=c.rand(100,400)*c.level,removed=c.rand(10,99);
    return simple(`Školska biblioteka ima ${initial} knjiga. Nabavljeno je još ${added}, a otpisano ${removed}. Koliko knjiga ostaje?`,initial+added-removed,[`Poslije nabavke: ${initial} + ${added} = ${initial+added}.`,`Poslije otpisa: ${initial+added} − ${removed} = ${initial+added-removed} knjiga.`],'Najprije dodaj nabavljene, zatim oduzmi otpisane knjige.');
  });
  add('word-natural-product',5,'Tekstualni zadatak: pakovanja','Množenje, dijeljenje i preostala količina.',c=>{
    const boxes=10+c.index,pieces=12*c.level,used=c.rand(1,9);
    return simple(`U skladištu je ${boxes} kutija sa po ${pieces} svezaka. Prodato je ${used} svezaka. Koliko ih ostaje?`,boxes*pieces-used,[`Ukupno je ${boxes} · ${pieces} = ${boxes*pieces} svezaka.`,`Preostalo je ${boxes*pieces} − ${used} = ${boxes*pieces-used}.`],'Broj kutija pomnoži brojem svezaka u jednoj kutiji.');
  });
  add('length-conversion',5,'Pretvaranje jedinica dužine','Metri, decimetri, centimetri i milimetri.',c=>{
    const metres=1+c.index,cm=c.rand(1,99),factor=c.level===1?100:c.level===2?1000:10,value=R(metres).add(R(cm).div(100)).mul(factor),unit=c.level===1?'cm':c.level===2?'mm':'dm';
    return simple(`Pretvori ${metres} m i ${cm} cm u ${unit}.`,fmt(value),[`Ukupno u metrima: ${metres} + ${cm}/100 = ${fmt(R(metres).add(R(cm).div(100)))} m.`,`Množimo sa ${factor}: ${fmt(value)} ${unit}.`],'Sve dijelove dužine pretvori u istu jedinicu.');
  });
  add('area-conversion',5,'Pretvaranje jedinica površine','Kvadratne jedinice i faktor 100 između susjednih jedinica.',c=>{
    const a=3+c.index,base=c.level===1?100:c.level===2?10000:1000000,unit=c.level===1?'dm²':c.level===2?'cm²':'mm²';
    return simple(`Koliko ${unit} iznosi ${a} m²?`,a*base,[`1 m² = ${base} ${unit}.`,`${a} m² = ${a} · ${base} = ${a*base} ${unit}.`],'Kod površine se faktor pretvaranja dužine kvadrira.');
  });
  add('rectangle-measures',5,'Pravougaonik: obim i površina','Računanje iz zadanih stranica.',c=>{
    const a=5+c.index,b=c.rand(2,20)*c.level;
    return {prompt:`Pravougaonik ima stranice a = ${a} cm i b = ${b} cm. Izračunaj obim i površinu.`,fields:[f('perimeter','Obim u cm',2*(a+b)),f('area','Površina u cm²',a*b)],steps:[`O = 2(a+b) = 2(${a}+${b}) = ${2*(a+b)} cm.`,`P = a·b = ${a}·${b} = ${a*b} cm².`],hint:'Obim je dužina granice, a površina broj kvadratnih jedinica.'};
  });
  add('square-measures',5,'Kvadrat: obim i površina','Veza stranice, obima i površine kvadrata.',c=>{
    const a=(2+c.index)*(c.level===1?1:c.level===2?3:7);
    return {prompt:`Kvadrat ima stranicu a = ${a} cm. Izračunaj obim i površinu.`,fields:[f('perimeter','Obim u cm',4*a),f('area','Površina u cm²',a*a)],steps:[`O = 4a = 4·${a} = ${4*a} cm.`,`P = a² = ${a}·${a} = ${a*a} cm².`],hint:'Kvadrat ima četiri jednake stranice.'};
  });
  add('time-duration',5,'Računanje vremena','Sati i minute u zadacima o trajanju.',c=>{
    const hours=1+Math.floor(c.index/60),minutes=c.index%60,extra=c.level*17,total=hours*60+minutes+extra;
    return simple(`Aktivnost traje ${hours} h i ${minutes} min. Nakon produženja od ${extra} min, koliko ukupno minuta traje?`,total,[`${hours} h = ${hours*60} min.`,`Ukupno: ${hours*60} + ${minutes} + ${extra} = ${total} min.`],'Jedan sat ima 60 minuta.');
  });

  // Grade 6: divisibility, prime factors and complete rational arithmetic.
  for(const d of [2,4,5,6,9,10,15,25]) add('divisibility-'+d,6,'Djeljivost sa '+d,'Pravilo djeljivosti, odluka i ostatak.',c=>{
    const n=1000*c.level+c.index*37+11,q=Math.floor(n/d),r=n%d;
    const rules={2:'Posljednja cifra je parna.',4:'Broj koji čine posljednje dvije cifre djeljiv je sa 4.',5:'Posljednja cifra je 0 ili 5.',6:'Broj je djeljiv i sa 2 i sa 3.',9:'Zbir cifara djeljiv je sa 9.',10:'Posljednja cifra je 0.',15:'Broj je djeljiv i sa 3 i sa 5.',25:'Posljednje dvije cifre su 00, 25, 50 ili 75.'};
    return {prompt:`Da li je ${n} djeljiv sa ${d}? Odredi ostatak pri dijeljenju.`,fields:[f('decision','Da ili ne',r===0?'da':'ne','text'),f('remainder','Ostatak',r)],steps:[rules[d],`${n} = ${d} · ${q} + ${r}.`,`Ostatak je ${r}, pa broj ${r===0?'jeste':'nije'} djeljiv sa ${d}.`],hint:rules[d]};
  });
  add('gcd',6,'Najveći zajednički djelilac — NZD','Euklidov algoritam i zajednički faktori.',c=>{
    const g=2+c.index,a=g*(c.level===1?3:5),b=g*(c.level===3?13:7),value=M.gcd(a,b);
    return simple(`Odredi NZD(${a}, ${b}).`,value,[`${a} = ${g} · ${a/g}, a ${b} = ${g} · ${b/g}.`,`Brojevi ${a/g} i ${b/g} su uzajamno prosti.`,`NZD(${a}, ${b}) = ${value}.`],'Zajednički djelilac je najveći broj koji dijeli oba broja.');
  });
  add('lcm',6,'Najmanji zajednički sadržalac — NZS','Veza NZS·NZD = a·b.',c=>{
    const g=1+c.index,a=g*(c.level===1?4:6),b=g*(c.level===3?15:9),div=M.gcd(a,b),value=M.lcm(a,b);
    return simple(`Odredi NZS(${a}, ${b}).`,value,[`NZD(${a}, ${b}) = ${div}.`,`NZS = (${a} · ${b}) / ${div} = ${value}.`],'Najprije odredi NZD, zatim koristi NZS = a·b/NZD.');
  });
  add('prime-classification',6,'Prosti i složeni brojevi','Broj 1, prosti brojevi i složeni brojevi.',c=>{
    const n=1+c.index+200*(c.level-1),prime=M.isPrime(n),classification=n===1?'ni prost ni složen':prime?'prost':'složen';
    return {prompt:`Odredi da li je broj ${n} prost, složen ili ni prost ni složen.`,fields:[f('classification','Vrsta broja',classification,'text')],steps:[n===1?'Broj 1 ima samo jedan pozitivan djelilac: 1.':prime?`${n} ima tačno dva pozitivna djelioca: 1 i ${n}.`:`Rastav je ${n} = ${M.factorize(n).expression}.`,`Broj je ${classification}.`],hint:'Prost broj ima tačno dva pozitivna djelioca; 1 nema tu osobinu.'};
  });
  add('prime-interval',6,'Prosti brojevi u intervalu','Izdvajanje prostih brojeva iz niza uzastopnih brojeva.',c=>{
    const a=2+c.index*3,b=a+5+c.level*2,primes=[];
    for(let n=a;n<=b;n++) if(M.isPrime(n)) primes.push(n);
    return {prompt:`Napiši sve proste brojeve od ${a} do ${b}, uključujući granice. Ako ih nema, upiši „nema“.`,fields:[f('primes','Prosti brojevi',primes,'list')],steps:[`Provjeravamo brojeve ${a}, ${a+1}, …, ${b}.`,`Prosti brojevi u intervalu: ${primes.length?primes.join(', '):'nema'}.`],hint:'Dovoljno je provjeriti proste djelioce do kvadratnog korijena broja.'};
  });
  add('prime-factors',6,'Rastav na proste faktore','Prosti faktori s ponavljanjem, bez jedinice.',c=>{
    const n=(12+c.index)*2*c.level,parts=M.factorize(n).factors,list=[];
    for(const part of parts) for(let j=0;j<part.exponent;j++)list.push(part.prime);
    return {prompt:`Rastavi ${n} na proste faktore. Napiši faktore s ponavljanjem (npr. 12 → 2, 2, 3).`,fields:[f('factors','Prosti faktori',list,'list')],steps:[`${n} = ${M.factorize(n).expression}.`,`Lista faktora s ponavljanjem: ${list.join(', ')}.`],hint:'Dijeli redom sa 2, 3, 5, 7 i nastavi dok ne dobiješ 1.'};
  });
  add('fraction-reduce',6,'Skraćivanje razlomaka','Dijeljenje brojioca i nazivnika njihovim NZD.',c=>{
    const p=1+c.index,q=p+2*c.level+1,mul=c.rand(2,9),num=p*mul,den=q*mul,g=M.gcd(num,den);
    const task=simple(`Skrati razlomak ${num}/${den} do neskrativog oblika.`,fmt(R(num).div(den)),[`NZD(${num}, ${den}) = ${g}.`,`Dijelimo oba broja sa ${g}: ${num}/${den} = ${fmt(R(num).div(den))}.`],'I brojilac i nazivnik dijeli istim nenultim brojem.');
    task.fields[0].format='reducedFraction';
    return task;
  });
  add('fraction-mixed',6,'Nepravi razlomci i mješoviti brojevi','Cijeli dio, ostatak i pravi razlomak.',c=>{
    const den=3+c.level,whole=1+Math.floor(c.index/(den-1)),rem=1+c.index%(den-1),num=whole*den+rem;
    return {prompt:`Razlomak ${num}/${den} napiši kao mješoviti broj: odredi cijeli dio i preostali razlomak.`,fields:[f('whole','Cijeli dio',whole),f('fraction','Preostali razlomak',fmt(R(rem).div(den)))],steps:[`${num} = ${den} · ${whole} + ${rem}.`,`${num}/${den} = ${whole} + ${rem}/${den}.`],hint:'Podijeli brojilac nazivnikom; količnik je cijeli dio.'};
  });
  add('fraction-compare',6,'Poređenje razlomaka','Poređenje pomoću unakrsnih proizvoda.',c=>{
    const a=1+c.index,b=a+3,cnum=a+c.level,d=b+2,left=a*d,right=cnum*b,answer=left<right?'<':left>right?'>':'=';
    return {prompt:`Uporedi ${a}/${b} i ${cnum}/${d}. Upiši <, > ili =.`,fields:[f('relation','Znak poređenja',answer,'text')],steps:[`Unakrsni proizvodi: ${a} · ${d} = ${left}; ${cnum} · ${b} = ${right}.`,`${left} ${answer} ${right}, zato ${a}/${b} ${answer} ${cnum}/${d}.`],hint:'Nazivnici su pozitivni pa poredi a·d i c·b.'};
  });
  for(const [id,title,op,verb] of [['fraction-add','Sabiranje razlomaka','+','Sabiramo'],['fraction-subtract','Oduzimanje razlomaka','-','Oduzimamo'],['fraction-multiply','Množenje razlomaka','*','Množimo'],['fraction-divide','Dijeljenje razlomaka','/','Dijelimo']]) add(id,6,title,'Različiti nazivnici i tačan neskrativ rezultat.',c=>{
    const a=1+c.index,b=a+2+c.level,p=op==='-'?1+c.rand(0,Math.min(9,a-1)):1+c.rand(1,9),q=p+2+c.level;
    const left=R(a).div(b),right=R(p).div(q),value=op==='+'?left.add(right):op==='-'?left.sub(right):op==='*'?left.mul(right):left.div(right),symbol={'+':'+','-':'−','*':'·','/':':'}[op];
    const common=M.lcm(b,q);
    const middle=op==='+'||op==='-'?`Zajednički nazivnik je ${common}: ${a}/${b} = ${BigInt(a)*(common/BigInt(b))}/${common}, ${p}/${q} = ${BigInt(p)*(common/BigInt(q))}/${common}.`:op==='*'?`Množimo brojioce i nazivnike: (${a}·${p})/(${b}·${q}) = ${a*p}/${b*q}.`:`Množimo recipročnim razlomkom: ${a}/${b} · ${q}/${p} = ${a*q}/${b*p}.`;
    return simple(`${a}/${b} ${symbol} ${p}/${q} = ?`,fmt(value),[middle,`${verb} i skraćujemo: rezultat je ${fmt(value)}.`],'Sabiranje i oduzimanje traže zajednički nazivnik; pri dijeljenju obrni drugi razlomak.');
  });
  add('fraction-complex',6,'Dvojni razlomci','Razlomci čiji su brojilac i nazivnik razlomci ili izrazi.',c=>{
    const a=1+c.index,b=a+c.level+1,p=c.rand(2,7),q=p+2,top=R(a).div(b).add(R(1).div(3)),bottom=R(p).div(q),value=top.div(bottom);
    return simple(`Izračunaj dvojni razlomak (${a}/${b} + 1/3) / (${p}/${q}).`,fmt(value),[`Brojilac: ${a}/${b} + 1/3 = ${fmt(top)}.`,`Dijeljenje razlomkom znači množenje recipročnim: ${fmt(top)} · ${q}/${p}.`,`Neskrativ rezultat: ${fmt(value)}.`],'Prvo izračunaj brojilac i nazivnik, pa ih podijeli.');
  });
  add('fraction-of-quantity',6,'Dio cjeline izražen razlomkom','Tekstualni zadaci o razlomku količine.',c=>{
    const den=3+c.level,num=c.level,total=den*(20+c.index),value=total*num/den;
    return simple(`Od ${total} učenika, ${num}/${den} učestvuje na radionici. Koliko učenika učestvuje?`,value,[`Jedna ${den}-tina iznosi ${total} : ${den} = ${total/den}.`,`${num}/${den} cjeline iznosi ${total/den} · ${num} = ${value} učenika.`],'Cjelinu podijeli nazivnikom, pa pomnoži brojiocem.');
  });

  // Grade 7: decimals, signed numbers, proportions and angles.
  for(const [id,title,op,symbol] of [['decimal-add','Sabiranje decimalnih brojeva','+','+'],['decimal-subtract','Oduzimanje decimalnih brojeva','-','−'],['decimal-multiply','Množenje decimalnih brojeva','*','·'],['decimal-divide','Dijeljenje decimalnih brojeva','/',':']]) add(id,7,title,'Računanje decimalnih brojeva bez grešaka zaokruživanja.',c=>{
    const a=R(1001+c.index*19).div(10**c.level),b=R(c.rand(11,99)).div(c.level===1?10:100),value=op==='+'?a.add(b):op==='-'?a.sub(b):op==='*'?a.mul(b):a.div(b);
    return simple(`${decimal(a)} ${symbol} ${decimal(b)} = ?`,fmt(value),[`Decimalne brojeve tačno zapisujemo: ${fmt(a)} i ${fmt(b)}.`,`${fmt(a)} ${symbol} ${fmt(b)} = ${fmt(value)}.`,`Decimalni zapis (po potrebi približan): ${value.toDecimal(10)}.`],'Kod sabiranja poravnaj decimalne zareze; kod dijeljenja pomjeri zarez u oba broja jednako.');
  });
  for(const [id,title,op,symbol] of [['integer-add','Sabiranje cijelih brojeva','+','+'],['integer-subtract','Oduzimanje cijelih brojeva','-','−'],['integer-multiply','Množenje cijelih brojeva','*','·'],['integer-divide','Dijeljenje cijelih brojeva','/',':']]) add(id,7,title,'Negativni brojevi i pravila predznaka.',c=>{
    const b=(c.rand(2,19))*(c.index%2===0?-1:1),q=1+c.index,a=op==='/'?q*b*(-1):-(5+c.index*c.level),value=op==='+'?a+b:op==='-'?a-b:op==='*'?a*b:a/b;
    return simple(`(${a}) ${symbol} (${b}) = ?`,value,[op==='-'?`Oduzimanje zamjenjujemo sabiranjem suprotnog broja: ${a} + (${-b}).`:op==='*'||op==='/'?`Za proizvod ili količnik jednakih predznaka rezultat je pozitivan, a različitih negativan.`:`Kod različitih predznaka oduzimamo apsolutne vrijednosti i uzimamo predznak broja veće apsolutne vrijednosti.`,`(${a}) ${symbol} (${b}) = ${value}.`],'Pazi na zagrade uz negativan broj.');
  });
  add('percent-of',7,'Procenat od broja','Računanje p% zadane količine.',c=>{
    const total=200+c.index*13,percent=c.level===1?10:c.level===2?25:12.5,value=M.percentOf(percent,total).exact;
    return simple(`Koliko iznosi ${String(percent).replace('.',',')}% od ${total}?`,value,[`${percent}% = ${fmt(R(percent).div(100))}.`,`${total} · ${fmt(R(percent).div(100))} = ${value}.`],'Procenat podijeli sa 100 pa pomnoži cjelinom.');
  });
  add('percentage',7,'Koliki je procenat','Odnos dijela i cjeline izražen u procentima.',c=>{
    const total=50+c.index,part=c.level===1?5:c.level===2?13:27,value=M.percentage(part,total).exact;
    return simple(`Koliki procenat broja ${total} predstavlja broj ${part}? Odgovor može biti tačan razlomak.`,value,[`Odnos dijela i cjeline je ${part}/${total}.`,`Procenat = (${part}/${total}) · 100 = ${value}%.`],'Podijeli dio cjelinom i pomnoži sa 100.');
  });
  add('percent-price',7,'Popust i nova cijena','Procentualno smanjenje cijene u tekstualnom zadatku.',c=>{
    const price=50+c.index*3,discount=c.level===1?10:c.level===2?20:35,amount=R(price).mul(discount).div(100),value=R(price).sub(amount);
    return {prompt:`Cijena knjige je ${price} KM. Popust je ${discount}%. Odredi iznos popusta i novu cijenu.`,fields:[f('discount','Popust u KM',fmt(amount)),f('price','Nova cijena u KM',fmt(value))],steps:[`Popust: ${price} · ${discount}/100 = ${fmt(amount)} KM.`,`Nova cijena: ${price} − ${fmt(amount)} = ${fmt(value)} KM.`],hint:'Popust oduzmi od početne cijene.'};
  });
  add('ratio-sharing',7,'Podjela u zadanoj razmjeri','Dijeljenje ukupne količine u odnosu a:b.',c=>{
    const a=c.level+1,b=c.level+3,unit=1+c.index,total=(a+b)*unit;
    return {prompt:`Podijeli ${total} KM između dvije ekipe u razmjeri ${a}:${b}.`,fields:[f('first','Prva ekipa u KM',a*unit),f('second','Druga ekipa u KM',b*unit)],steps:[`Ukupno dijelova: ${a}+${b} = ${a+b}.`,`Jedan dio: ${total}/(${a+b}) = ${unit} KM.`,`Iznosi su ${a}·${unit} = ${a*unit} KM i ${b}·${unit} = ${b*unit} KM.`],hint:'Zbir članova razmjere govori na koliko jednakih dijelova dijeliš cjelinu.'};
  });
  add('proportion',7,'Proporcije','Nepoznati član proporcionalnosti.',c=>{
    const a=1+c.index,b=3+c.level,d=2*b+c.level,x=R(a).mul(d).div(b);
    return simple(`Riješi proporciju ${a} : ${b} = x : ${d}.`,fmt(x),[`Unakrsno množenje: ${b}x = ${a}·${d} = ${a*d}.`,`Dijelimo sa ${b}: x = ${fmt(x)}.`],'Proizvod vanjskih članova jednak je proizvodu unutrašnjih.','x','x');
  });
  add('map-scale',7,'Razmjera na karti','Veza dužine na karti i stvarne udaljenosti.',c=>{
    const centimetres=R(10+c.index).div(10),scale=10000*c.level,km=centimetres.mul(scale).div(100000);
    return simple(`Na karti razmjere 1:${scale}, udaljenost je ${decimal(centimetres)} cm. Kolika je stvarna udaljenost u kilometrima?`,fmt(km),[`Stvarna dužina u cm: ${fmt(centimetres)}·${scale} = ${fmt(centimetres.mul(scale))} cm.`,`1 km = 100 000 cm, pa je udaljenost ${fmt(km)} km.`],'Prvo primijeni razmjeru, zatim pretvori centimetre u kilometre.');
  });
  add('complementary-angles',7,'Komplementni uglovi','Dva zadatka sa zbirom uglova 90°.',c=>{
    const divisor=c.level===1?1:c.level===2?2:4,a=R(1+c.index%89).div(divisor),b=R(1+Math.floor(c.index/89)*17+c.level).div(divisor),first=R(90).sub(a),second=R(90).sub(b);
    return {prompt:`Odredi komplement ugla ${decimal(a)}° i komplement ugla ${decimal(b)}°.`,fields:[f('first','Prvi komplement u °',fmt(first)),f('second','Drugi komplement u °',fmt(second))],steps:[`Komplementni uglovi imaju zbir 90°.`,`90° − ${decimal(a)}° = ${decimal(first)}°.`,`90° − ${decimal(b)}° = ${decimal(second)}°.`],hint:'Komplement ugla α je 90° − α.'};
  });
  add('supplementary-angles',7,'Suplementni uglovi','Dva zadatka sa zbirom uglova 180°.',c=>{
    const divisor=c.level===1?1:c.level===2?2:4,a=R(1+c.index%179).div(divisor),b=R(15+Math.floor(c.index/179)*23+c.level).div(divisor),first=R(180).sub(a),second=R(180).sub(b);
    return {prompt:`Odredi suplement ugla ${decimal(a)}° i suplement ugla ${decimal(b)}°.`,fields:[f('first','Prvi suplement u °',fmt(first)),f('second','Drugi suplement u °',fmt(second))],steps:[`Suplementni uglovi imaju zbir 180°.`,`180° − ${decimal(a)}° = ${decimal(first)}°.`,`180° − ${decimal(b)}° = ${decimal(second)}°.`],hint:'Suplement ugla α je 180° − α.'};
  });
  add('triangle-angles',7,'Zbir uglova trougla','Treći unutrašnji i pripadni vanjski ugao.',c=>{
    const a=20+c.index%50,b=30+Math.floor(c.index/50)*7+c.level,third=180-a-b;
    return {prompt:`Dva unutrašnja ugla trougla su ${a}° i ${b}°. Odredi treći ugao i njemu susjedni vanjski ugao.`,fields:[f('third','Treći unutrašnji ugao u °',third),f('exterior','Vanjski ugao u °',180-third)],steps:[`Treći ugao: 180° − (${a}° + ${b}°) = ${third}°.`,`Vanjski ugao: 180° − ${third}° = ${180-third}°.`],hint:'Zbir unutrašnjih uglova trougla je 180°.'};
  });
  add('parallel-angles',7,'Uglovi uz paralelne prave','Saglasni uglovi i unutrašnji uglovi s iste strane transverzale.',c=>{
    const a=10+c.index%160,b=20+Math.floor(c.index/160)*11+c.level;
    return {prompt:`Dvije paralelne prave presječene su transverzalom. U prvom crtežu jedan ugao je ${a}°: odredi njemu saglasni ugao. U drugom crtežu jedan unutrašnji ugao je ${b}°: odredi unutrašnji ugao s iste strane transverzale.`,fields:[f('corresponding','Saglasni ugao u °',a),f('sameSide','Unutrašnji ugao s iste strane u °',180-b)],steps:[`Saglasni uglovi uz paralelne prave su jednaki: ${a}°.`,`Unutrašnji uglovi s iste strane imaju zbir 180°: 180° − ${b}° = ${180-b}°.`],hint:'Saglasni uglovi su jednaki, a unutrašnji s iste strane su suplementni.'};
  });

  // Grade 8: algebra, square roots, equations and metric geometry.
  add('integer-powers',8,'Stepeni cijelih brojeva','Pozitivna i negativna osnova, parni i neparni eksponent.',c=>{
    const a=2+c.index,e=2+c.level,base=c.index%2?-a:a,value=R(base).pow(e);
    return simple(`Izračunaj (${base})^${e}.`,fmt(value),[`Množimo ${e} jednakih faktora ${base}.`,`(${base})^${e} = ${fmt(value)}.`],'Parni stepen negativnog broja je pozitivan; neparni je negativan.');
  });
  add('power-rules',8,'Pravila za stepene','Proizvod i količnik stepena iste osnove.',c=>{
    const base=2+c.index,a=2+c.level,b=2,d=1,value=R(base).pow(a+b-d);
    return simple(`Izračunaj (${base}^${a} · ${base}^${b}) / ${base}^${d}.`,fmt(value),[`Pri množenju sabiramo eksponente, a pri dijeljenju oduzimamo.`,`${base}^(${a}+${b}−${d}) = ${base}^${a+b-d}.`,`Rezultat je ${fmt(value)}.`],'Za istu nenultu osnovu koristi aᵐ·aⁿ=aᵐ⁺ⁿ i aᵐ:aⁿ=aᵐ⁻ⁿ.');
  });
  add('scientific-notation',8,'Naučni zapis brojeva','Koeficijent od 1 do 10 i stepen broja 10.',c=>{
    const coefficient=R(101+c.index).div(100),exponent=3+c.level,value=coefficient.mul(R(10).pow(exponent));
    return simple(`Broj ${decimal(coefficient)} · 10^${exponent} napiši u običnom decimalnom zapisu.`,fmt(value),[`10^${exponent} = ${10**exponent}.`,`${decimal(coefficient)} · ${10**exponent} = ${fmt(value)}.`],'Pomjeri decimalni zarez udesno za onoliko mjesta koliki je eksponent.');
  });
  add('square-roots',8,'Kvadratni korijeni','Glavni korijen potpunog kvadrata i razlomka.',c=>{
    const a=2+c.index,den=c.level===1?1:c.level+1,square=R(a).div(den).pow(2),value=R(a).div(den);
    return simple(`Odredi glavni kvadratni korijen broja ${fmt(square)}.`,fmt(value),[`${fmt(square)} = (${fmt(value)})².`,`Glavni kvadratni korijen je nenegativan, pa je √(${fmt(square)}) = ${fmt(value)}.`],'Kvadratni korijen je nenegativni broj čiji kvadrat daje zadani broj.');
  });
  add('root-estimation',8,'Korijen između cijelih brojeva','Procjena korijena bez kalkulatora.',c=>{
    const a=2+c.index,n=a*a+c.level;
    return {prompt:`Između koja dva uzastopna cijela broja se nalazi √${n}?`,fields:[f('lower','Manji cijeli broj',a),f('upper','Veći cijeli broj',a+1)],steps:[`${a}² = ${a*a}, a ${a+1}² = ${(a+1)**2}.`,`${a*a} < ${n} < ${(a+1)**2}, pa ${a} < √${n} < ${a+1}.`],hint:'Uporedi broj pod korijenom sa susjednim potpunim kvadratima.'};
  });
  add('pythagoras-hypotenuse',8,'Pitagorina teorema: hipotenuza','Pravougli trouglovi s tačnim dužinama.',c=>{
    const k=1+c.index,triple=c.level===1?[3,4,5]:c.level===2?[5,12,13]:[8,15,17],a=triple[0]*k,b=triple[1]*k,h=triple[2]*k;
    return simple(`Katete pravouglog trougla su ${a} cm i ${b} cm. Odredi hipotenuzu.`,h,[`c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${h*h}.`,`c = √${h*h} = ${h} cm.`],'Kvadrat hipotenuze jednak je zbiru kvadrata kateta.');
  });
  add('pythagoras-leg',8,'Pitagorina teorema: kateta','Nepoznata kateta iz hipotenuze i druge katete.',c=>{
    const k=1+c.index,triple=c.level===1?[3,4,5]:c.level===2?[5,12,13]:[7,24,25],a=triple[0]*k,b=triple[1]*k,h=triple[2]*k;
    return simple(`Hipotenuza pravouglog trougla je ${h} cm, a jedna kateta ${a} cm. Odredi drugu katetu.`,b,[`b² = ${h}² − ${a}² = ${h*h} − ${a*a} = ${b*b}.`,`b = √${b*b} = ${b} cm.`],'Od kvadrata hipotenuze oduzmi kvadrat poznate katete.');
  });
  add('linear-equation',8,'Linearna jednačina ax+b=c','Jednačine s jednom nepoznatom.',c=>{
    const x=c.index-90,a=c.level+1,b=c.rand(-20,20),right=a*x+b;
    return simple(`Riješi jednačinu ${a}x ${b<0?'− '+(-b):'+ '+b} = ${right}.`,x,[`Od obje strane oduzimamo ${b}: ${a}x = ${right-b}.`,`Dijelimo sa ${a}: x = ${x}.`,`Provjera: ${a}·(${x}) + (${b}) = ${right}.`],'Jednakost čuvaj izvođenjem iste operacije na obje strane.','x','x');
  });
  add('equation-parentheses',8,'Jednačine sa zagradama','Distributivnost i premještanje članova.',c=>{
    const x=c.index-99,a=c.level+2,b=c.rand(2,11),d=c.level,right=a*(x+b)-d*x;
    return simple(`Riješi: ${a}(x + ${b}) − ${d}x = ${right}.`,x,[`Otvaramo zagradu: ${a}x + ${a*b} − ${d}x = ${right}.`,`Sređujemo: ${a-d}x = ${right-a*b}.`,`x = ${right-a*b}/${a-d} = ${x}.`],'Prvo pomnoži svaki član u zagradi brojem ispred zagrade.','x','x');
  });
  add('equation-fractions',8,'Jednačine s razlomcima','Uklanjanje nazivnika i tačno rješenje.',c=>{
    const x=R(c.index-95).div(c.level+1),a=c.level+2,b=c.rand(1,7),right=x.div(a).add(R(b).div(3));
    return simple(`Riješi x/${a} + ${b}/3 = ${fmt(right)}.`,fmt(x),[`Oduzimamo ${b}/3: x/${a} = ${fmt(right.sub(R(b).div(3)))}.`,`Množimo sa ${a}: x = ${fmt(x)}.`],'Ukloni razlomke množenjem zajedničkim nazivnikom.','x','x');
  });
  add('linear-inequality',8,'Linearne nejednačine','Promjena znaka pri dijeljenju negativnim brojem.',c=>{
    const boundary=c.index-100,a=c.level===1?2:-2*c.level,b=c.rand(-9,9),right=a*boundary+b,relation=c.index%2?'<':'≥',solution=a>0?relation:relation==='<'?'>':'≤';
    return {prompt:`Riješi ${a}x ${b<0?'− '+(-b):'+ '+b} ${relation} ${right}. Odgovor upiši u obliku x > 3, x ≤ 3 i slično.`,fields:[f('solution','Skup rješenja',`x ${solution} ${boundary}`,'text')],steps:[`Oduzimamo ${b}: ${a}x ${relation} ${right-b}.`,a<0?`Dijeljenje negativnim brojem ${a} mijenja smjer nejednakosti.`:`Dijelimo pozitivnim brojem ${a}; znak ostaje isti.`,`Rješenje: x ${solution} ${boundary}.`],hint:'Pri množenju ili dijeljenju negativnim brojem obrni znak nejednakosti.'};
  });
  add('polynomial-value',8,'Vrijednost polinoma','Uvrštavanje pozitivne ili negativne vrijednosti promjenljive.',c=>{
    const x=c.index-100,a=c.level,b=c.rand(-7,7),d=c.rand(1,12),value=a*x*x+b*x+d;
    return simple(`Odredi P(${x}) za P(x) = ${a}x² + (${b})x + ${d}.`,value,[`P(${x}) = ${a}·(${x})² + (${b})·(${x}) + ${d}.`,`P(${x}) = ${a*x*x} + (${b*x}) + ${d} = ${value}.`],'Negativnu vrijednost x uvrštavaj sa zagradama.');
  });
  add('polynomial-product',8,'Množenje binoma','Koeficijenti proizvoda dva linearna polinoma.',c=>{
    const a=1+c.index,b=c.level+2,d=c.rand(1,9),e=c.rand(2,11),A=a*d,B=a*e+b*d,C=b*e;
    return {prompt:`Pomnoži (${a}x + ${b})(${d}x + ${e}) i odredi koeficijente A, B i C u obliku Ax² + Bx + C.`,fields:[f('A','A',A),f('B','B',B),f('C','C',C)],steps:[`Član uz x²: ${a}·${d} = ${A}.`,`Član uz x: ${a}·${e} + ${b}·${d} = ${B}.`,`Slobodni član: ${b}·${e} = ${C}.`,`Proizvod je ${A}x² + ${B}x + ${C}.`],hint:'Svaki član prvog binoma pomnoži svakim članom drugog.'};
  });
  add('binomial-square',8,'Kvadrat binoma','Koeficijenti formule (a+b)².',c=>{
    const a=1+c.index,b=c.level+1,A=a*a,B=2*a*b,C=b*b;
    return {prompt:`Razvij (${a}x + ${b})² u oblik Ax² + Bx + C.`,fields:[f('A','A',A),f('B','B',B),f('C','C',C)],steps:[`(${a}x+${b})² = (${a}x)² + 2·${a}x·${b} + ${b}².`,`Dobijamo ${A}x² + ${B}x + ${C}.`],hint:'Kvadrat zbira sadrži i dvostruki proizvod, ne samo kvadrate članova.'};
  });
  add('difference-squares',8,'Razlika kvadrata','Faktorizacija i veza (a−b)(a+b).',c=>{
    const a=2+c.index,b=c.level+1,A=a*a,B=b*b;
    return {prompt:`Za polinom ${A}x² − ${B} koristi oblik (${a}x − k)(${a}x + k). Odredi k, pa izračunaj vrijednost polinoma za x = 2.`,fields:[f('k','k (pozitivan)',b),f('value','Vrijednost za x=2',4*A-B)],steps:[`${A}x² − ${B} = (${a}x)² − ${b}² = (${a}x−${b})(${a}x+${b}).`,`Za x=2: ${A}·4−${B} = ${4*A-B}.`],hint:'Razlika kvadrata je proizvod razlike i zbira.'};
  });
  add('triangle-area',8,'Površina trougla','Osnovica i odgovarajuća visina.',c=>{
    const a=3+c.index,h=2+c.level*3,value=R(a).mul(h).div(2);
    return simple(`Trougao ima osnovicu ${a} cm i visinu na tu osnovicu ${h} cm. Izračunaj površinu.`,fmt(value),[`P = a·h/2.`,`P = ${a}·${h}/2 = ${fmt(value)} cm².`],'Visina je normalna na zadanu osnovicu.');
  });
  add('trapezoid-area',8,'Površina trapeza','Srednja linija i površina trapeza.',c=>{
    const a=5+c.index,b=a+2*c.level,h=3+c.level,mid=R(a+b).div(2),area=mid.mul(h);
    return {prompt:`Trapez ima osnovice ${a} cm i ${b} cm te visinu ${h} cm. Odredi srednju liniju i površinu.`,fields:[f('midline','Srednja linija u cm',fmt(mid)),f('area','Površina u cm²',fmt(area))],steps:[`m = (a+b)/2 = (${a}+${b})/2 = ${fmt(mid)} cm.`,`P = m·h = ${fmt(mid)}·${h} = ${fmt(area)} cm².`],hint:'Srednja linija je aritmetička sredina osnovica.'};
  });
  add('parallelogram-area',8,'Površina paralelograma','Visina, osnovica i površina.',c=>{
    const a=4+c.index,h=3+c.level;
    return simple(`Paralelogram ima osnovicu ${a} cm i visinu na tu osnovicu ${h} cm. Izračunaj površinu.`,a*h,[`P = a·h = ${a}·${h} = ${a*h} cm².`],'Koristi visinu uz zadanu osnovicu, a ne dužinu susjedne stranice.');
  });
  add('circle-measures',8,'Krug: obim i površina','Primjena formule uz zadanu aproksimaciju broja π.',c=>{
    const r=R(10+c.index).div(c.level===1?1:c.level===2?10:100),pi=R('3.14'),perimeter=pi.mul(2).mul(r),area=pi.mul(r.pow(2));
    return {prompt:`Krug ima poluprečnik ${decimal(r)} cm. Koristi π = 3,14. Izračunaj obim i površinu.`,fields:[f('perimeter','Obim u cm',fmt(perimeter)),f('area','Površina u cm²',fmt(area))],steps:[`O = 2πr = 2·3,14·${decimal(r)} = ${fmt(perimeter)} cm.`,`P = πr² = 3,14·(${decimal(r)})² = ${fmt(area)} cm².`],hint:'Obim koristi r, a površina r².'};
  });
  add('circle-sector',8,'Kružni isječak','Površina isječka i dužina pripadnog luka.',c=>{
    const r=2+c.index,angle=c.level===1?90:c.level===2?60:135,pi=R('3.14'),fraction=R(angle).div(360),area=pi.mul(r*r).mul(fraction),arc=pi.mul(2*r).mul(fraction);
    return {prompt:`Kružni isječak ima poluprečnik ${r} cm i centralni ugao ${angle}°. Koristi π = 3,14. Odredi površinu isječka i dužinu luka.`,fields:[f('area','Površina isječka u cm²',fmt(area)),f('arc','Dužina luka u cm',fmt(arc))],steps:[`Udio punog kruga je ${angle}/360 = ${fmt(fraction)}.`,`P = ${angle}/360 · 3,14 · ${r}² = ${fmt(area)} cm².`,`l = ${angle}/360 · 2 · 3,14 · ${r} = ${fmt(arc)} cm.`],hint:'Obim i površinu cijelog kruga pomnoži sa α/360.'};
  });

  // Grade 9 templates are registered below.
/* ELDI EDU — grade 9 exercise registrations. Each generator has 200
 * mathematically distinct, deterministic prompts for each difficulty.
 * Requires add(id,grade,title,description,generator) and context R/fmt/f.
 */
function g9Signed(value) {
  const s = String(value);
  return s.startsWith('-') ? '− ' + s.slice(1) : '+ ' + s;
}
function g9Line(k, n) { return k + 'x ' + g9Signed(n); }
function g9Equation(a, b, rhs) { return a + 'x ' + g9Signed(b) + 'y = ' + rhs; }

add('g9-sistemi-jedinstveni', 9, 'Sistemi: jedno rješenje', 'Rješavanje sistema dvije linearne jednačine s dvije nepoznate.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const a = l + 1 + i % 2, b = 1 + i % 3, d = a + 1, e = b + 2;
  const x = R(l === 1 ? i + 1 : i - 100).div(l === 3 ? 3 : 1);
  const y = R(l === 1 ? i % 17 + 1 : i % 19 - 9).div(l === 3 ? 2 : 1);
  const u = x.mul(a).add(y.mul(b)), v = x.mul(d).add(y.mul(e));
  const D = a * e - b * d;
  return {prompt:`Riješi sistem: ${g9Equation(a,b,fmt(u))}; ${g9Equation(d,e,fmt(v))}.`,
    fields:[f('x','x',fmt(x)),f('y','y',fmt(y))],
    steps:[`Determinanta koeficijenata je D = ${a}·${e} − ${b}·${d} = ${D} ≠ 0, pa sistem ima jedno rješenje.`,
      `Eliminacijom y: Dx = ${e}·(${fmt(u)}) − ${b}·(${fmt(v)}), zato je x = ${fmt(x)}.`,
      `Uvrsti x u prvu jednačinu: ${b}y = ${fmt(u)} − ${a}·(${fmt(x)}), pa je y = ${fmt(y)}.`,
      `Provjera: lijeve strane jednačina daju ${fmt(u)} i ${fmt(v)}.`],
    hint:'Pomnoži jednačine odgovarajućim brojevima i oduzmi ih da ukloniš jednu nepoznatu.'};
});

add('g9-sistemi-klasifikacija', 9, 'Broj rješenja sistema', 'Prepoznaj jedno, nijedno ili beskonačno mnogo rješenja.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const a=l+2, b=i%3+1, t=i%4+2, x=i+2, y=i%13+1, u=a*x+b*y;
  const mode=i%3, d=t*a+(mode===0?1:0), e=t*b;
  const v=mode===0?d*x+e*y:t*u+(mode===1?1:0);
  const answer=mode===0?'jedno':mode===1?'nijedno':'beskonačno';
  const D=a*e-b*d;
  return {prompt:`Koliko rješenja ima sistem ${g9Equation(a,b,u)}; ${g9Equation(d,e,v)}? Upiši: jedno, nijedno ili beskonačno.`,
    fields:[f('vrsta','Broj rješenja',answer,'text')],
    steps:mode===0?[`D = ${a}·${e} − ${b}·${d} = ${D} ≠ 0.`,`Prave se sijeku u jednoj tački: (${x}; ${y}). Sistem ima jedno rješenje.`]:
      mode===1?[`Koeficijenti druge jednačine ${t} puta su veći od koeficijenata prve.`,`Množenjem prve jednačine sa ${t} desna strana postaje ${t*u}, a druga traži ${v}.`,`Jednake lijeve strane ne mogu dati različite desne strane. Sistem nema rješenja.`]:
      [`Druga jednačina dobiva se množenjem prve sa ${t}, uključujući desnu stranu.`,`Jednačine opisuju istu pravu. Postoji beskonačno mnogo rješenja.`],
    hint:'Poredi odnose koeficijenata i slobodnih članova. Nulta determinanta sama ne razlikuje nijedno od beskonačno mnogo rješenja.'};
});

add('g9-linearna-vrijednost', 9, 'Vrijednost linearne funkcije', 'Izračunaj y = kx + n za zadanu vrijednost x.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const k=R((l===3&&i%2?-1:1)*(l+1+i%6)).div(l===3?2:1), n=R(i%19-9), x=R(i+1+l);
  const y=k.mul(x).add(n);
  return {prompt:`Za funkciju y = ${g9Line(fmt(k),fmt(n))} izračunaj y kada je x = ${fmt(x)}.`,
    fields:[f('y','y',fmt(y))],
    steps:[`Uvrsti x = ${fmt(x)} u izraz funkcije.`,`y = (${fmt(k)})·(${fmt(x)}) + (${fmt(n)}) = ${fmt(y)}.`],
    hint:'Najprije pomnoži k i x, a zatim dodaj slobodni član n.'};
});

add('g9-linearna-iz-tacaka', 9, 'Prava kroz dvije tačke', 'Odredi koeficijent smjera i slobodni član iz koordinata.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const x1=i-90, x2=x1+l+1, k=R(l+1+i%5).div(l===3?2:1), n=R(i%17-8);
  const y1=k.mul(x1).add(n), y2=k.mul(x2).add(n);
  return {prompt:`Prava y = kx + n prolazi kroz A(${x1}; ${fmt(y1)}) i B(${x2}; ${fmt(y2)}). Odredi k i n.`,
    fields:[f('k','Koeficijent k',fmt(k)),f('n','Slobodni član n',fmt(n))],
    steps:[`k = (y₂ − y₁)/(x₂ − x₁) = (${fmt(y2)} − (${fmt(y1)}))/(${x2} − (${x1})) = ${fmt(k)}.`,
      `n = y₁ − kx₁ = ${fmt(y1)} − (${fmt(k)})·(${x1}) = ${fmt(n)}.`,`Jednačina prave je y = ${g9Line(fmt(k),fmt(n))}.`],
    hint:'Promjenu y podijeli promjenom x. Nakon toga uvrsti jednu tačku u y = kx + n.'};
});

add('g9-linearna-nula', 9, 'Nula linearne funkcije', 'Pronađi x za koji je vrijednost funkcije jednaka nuli.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const k=R((l===3&&i%2?-1:1)*(l+2+i%7)), n=R(i+1+l*30).neg(), x=n.neg().div(k);
  return {prompt:`Odredi nulu funkcije y = ${g9Line(fmt(k),fmt(n))}.`,fields:[f('x','Nula funkcije x',fmt(x))],
    steps:[`Na x-osi je y = 0, zato rješavamo 0 = ${g9Line(fmt(k),fmt(n))}.`,
      `kx = −n, pa je x = −n/k = ${fmt(n.neg())}/(${fmt(k)}) = ${fmt(x)}.`],
    hint:'Postavi y = 0 i riješi dobivenu linearnu jednačinu.'};
});

add('g9-presjek-pravih', 9, 'Presjek dvije prave', 'Izjednači vrijednosti funkcija i odredi koordinate presjeka.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const k1=l+1+i%4, k2=-l-i%3, x=R(i+1).div(l===3?3:1), n1=R(i%11-5);
  const n2=x.mul(k1-k2).add(n1), y=x.mul(k1).add(n1);
  return {prompt:`Odredi presjek pravih y = ${g9Line(k1,fmt(n1))} i y = ${g9Line(k2,fmt(n2))}.`,
    fields:[f('x','x presjeka',fmt(x)),f('y','y presjeka',fmt(y))],
    steps:[`U presjeku obje funkcije imaju isti y: ${g9Line(k1,fmt(n1))} = ${g9Line(k2,fmt(n2))}.`,
      `(${k1} − (${k2}))x = ${fmt(n2)} − (${fmt(n1)}), pa je x = ${fmt(x)}.`,
      `Uvrštavanjem u prvu funkciju dobivamo y = ${fmt(y)}. Presjek je (${fmt(x)}; ${fmt(y)}).`],
    hint:'Prvo izjednači desne strane jednačina; pronađeni x zatim uvrsti u jednu od njih.'};
});

add('g9-obrnuta-proporcionalnost', 9, 'Obrnuta proporcionalnost', 'Odredi stalni proizvod k = xy i novu vrijednost y.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const x1=i+2, y1=l+i%9+1, x2=l*2+i%5+3, k=R(x1).mul(y1), y2=k.div(x2);
  return {prompt:`Veličine x i y obrnuto su proporcionalne. Za x = ${x1} vrijedi y = ${y1}. Odredi k u y = k/x i y za x = ${x2}.`,
    fields:[f('k','Konstanta k',fmt(k)),f('y','Nova vrijednost y',fmt(y2))],
    steps:[`Kod obrnute proporcionalnosti proizvod xy je stalan.`,`k = ${x1}·${y1} = ${fmt(k)}.`,`Za x = ${x2}: y = k/x = ${fmt(k)}/${x2} = ${fmt(y2)}.`],
    hint:'Za funkciju y = k/x prvo izračunaj proizvod poznatih x i y.'};
});

add('g9-kvadratna-vrijednost', 9, 'Vrijednost kvadratnog izraza', 'Uvrštavanje u y = ax² + bx + c uz pravilan redoslijed računanja.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const a=l===1?1:1+i%3, b=l===1?0:l+i%7-3, d=i+1, x=i%15-7;
  const y=R(a).mul(R(x).mul(x)).add(R(b).mul(x)).add(d);
  return {prompt:`Za y = ${a}x² ${g9Signed(b)}x + ${d} izračunaj y kada je x = ${x}.`,fields:[f('y','y',fmt(y))],
    steps:[`Najprije kvadriraj: (${x})² = ${x*x}.`,`y = ${a}·${x*x} + (${b})·(${x}) + ${d} = ${fmt(y)}.`],
    hint:'Negativnu vrijednost x pri kvadriranju obavezno stavi u zagrade.'};
});

add('g9-aritmeticka-sredina', 9, 'Aritmetička sredina', 'Saberi sve podatke i podijeli njihovim brojem.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const base=i+10*l, offsets=l===1?[0,2,4]:l===2?[-3,2,5,8]:[-7,-2,1,4,13];
  const data=offsets.map(v=>base+v), sum=data.reduce((s,v)=>s+v,0), mean=R(sum).div(data.length);
  return {prompt:`Izračunaj aritmetičku sredinu podataka: ${data.join(', ')}.`,fields:[f('sredina','Aritmetička sredina',fmt(mean))],
    steps:[`Zbir ${data.length} podataka je ${sum}.`,`Aritmetička sredina = zbir / broj podataka = ${sum}/${data.length} = ${fmt(mean)}.`],
    hint:'Svaki podatak uključi u zbir, uključujući ponovljene vrijednosti ako ih ima.'};
});

add('g9-medijan', 9, 'Medijan podataka', 'Uredi podatke i pronađi srednju vrijednost ili sredinu dvije srednje vrijednosti.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const base=l===3?i-100:i+10*l, offsets=l===1?[4,0,2]:l===2?[9,1,5,3,13,7]:[9,-8,4,-5,7,11,-2,1];
  const data=offsets.map(v=>base+v), sorted=[...data].sort((a,b)=>a-b), n=sorted.length;
  const median=n%2?R(sorted[(n-1)/2]):R(sorted[n/2-1]).add(sorted[n/2]).div(2);
  return {prompt:`Odredi medijan skupa podataka: ${data.join(', ')}.`,fields:[f('medijan','Medijan',fmt(median))],
    steps:[`Podaci u rastućem redoslijedu: ${sorted.join(', ')}.`,n%2?`Broj podataka je ${n}; srednji je na ${(n+1)/2}. mjestu. Medijan je ${fmt(median)}.`:
      `Broj podataka je ${n}; srednje vrijednosti su ${sorted[n/2-1]} i ${sorted[n/2]}. Medijan = (${sorted[n/2-1]} + ${sorted[n/2]})/2 = ${fmt(median)}.`],
    hint:'Prije određivanja medijana podatke poredaj od najmanjeg do najvećeg.'};
});

add('g9-raspon', 9, 'Raspon podataka', 'Odredi najmanju i najveću vrijednost te njihovu razliku.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const base=l===3?i-100:i+l*10, p=3+i%17, q=1+i%7, data=[base+q,base,base-p,base+Math.floor(q/2),base-1];
  const min=base-p, max=base+q;
  return {prompt:`Za podatke ${data.join(', ')} odredi najmanju vrijednost, najveću vrijednost i raspon.`,
    fields:[f('min','Najmanja vrijednost',String(min)),f('max','Najveća vrijednost',String(max)),f('raspon','Raspon',String(max-min))],
    steps:[`Najmanji podatak je ${min}, a najveći ${max}.`,`Raspon = maksimum − minimum = ${max} − (${min}) = ${max-min}.`],
    hint:'Raspon nije broj podataka, nego razlika najvećeg i najmanjeg podatka.'};
});

add('g9-vjerovatnoca', 9, 'Vjerovatnoća: kuglice i kocka', 'Omjer povoljnih i svih jednako vjerovatnih ishoda; nezavisni događaji.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const red=i+2, blue=5+i%19, green=l*3+i%7, total=red+blue+green, p=R(red).div(total), other=R(blue+green).div(total);
  const threshold=i%4+2, die=R(6-threshold).div(6), joint=p.mul(die);
  const prompt=`U vrećici su ${red} crvene, ${blue} plave i ${green} zelene kuglice. Svaka kuglica ima jednaku šansu da bude izvučena. `;
  return l===3?{prompt:prompt+`Nasumično izvlačimo jednu kuglicu i nezavisno bacamo pravilnu kocku sa brojevima 1–6. Odredi P(crvena) i P(crvena i broj na kocki veći od ${threshold}).`,
    fields:[f('crvena','P(crvena)',fmt(p)),f('zajedno',`P(crvena i broj > ${threshold})`,fmt(joint))],
    steps:[`Ukupno je ${total} kuglica; P(crvena) = ${red}/${total} = ${fmt(p)}.`,`Na kocki su povoljni brojevi ${Array.from({length:6-threshold},(_,j)=>threshold+j+1).join(', ')}; njihova vjerovatnoća je ${fmt(die)}.`,`Događaji su nezavisni: zajednička vjerovatnoća = ${fmt(p)}·${fmt(die)} = ${fmt(joint)}.`],
    hint:'Za nezavisne događaje vjerovatnoća da se oba dese jednaka je proizvodu pojedinačnih vjerovatnoća.'}:
    {prompt:prompt+'Izvlačimo jednu kuglicu. Odredi vjerovatnoću crvene i vjerovatnoću da kuglica nije crvena.',
      fields:[f('crvena','P(crvena)',fmt(p)),f('nije-crvena','P(nije crvena)',fmt(other))],
      steps:[`Ukupno je ${red} + ${blue} + ${green} = ${total} kuglica.`,`P(crvena) = ${red}/${total} = ${fmt(p)}.`,`P(nije crvena) = (${blue} + ${green})/${total} = ${fmt(other)}; zbir ove dvije vjerovatnoće je 1.`],
      hint:'Vjerovatnoća je broj povoljnih ishoda podijeljen brojem svih jednako mogućih ishoda.'};
});

add('g9-kvadar', 9, 'Kvadar: površina i zapremina', 'Izračunaj površinu šest strana i zapreminu kvadra.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const a=R(i+20).div(l===1?10:l===2?5:3), b=R(l+2+i%5), d=R(l+3+i%7);
  const P=a.mul(b).add(a.mul(d)).add(b.mul(d)).mul(2), V=a.mul(b).mul(d);
  return {prompt:`Kvadar ima ivice a = ${fmt(a)} cm, b = ${fmt(b)} cm i c = ${fmt(d)} cm. Odredi ukupnu površinu i zapreminu.`,
    fields:[f('p','Površina P (cm²)',fmt(P)),f('v','Zapremina V (cm³)',fmt(V))],
    steps:[`P = 2(ab + ac + bc) = 2(${fmt(a.mul(b))} + ${fmt(a.mul(d))} + ${fmt(b.mul(d))}) = ${fmt(P)} cm².`,
      `V = abc = ${fmt(a)}·${fmt(b)}·${fmt(d)} = ${fmt(V)} cm³.`],hint:'Parovi naspramnih strana imaju površine ab, ac i bc.'};
});

add('g9-kocka', 9, 'Kocka: površina i zapremina', 'Primijeni formule P = 6a² i V = a³.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const a=R(i+20).div(l===1?10:l===2?5:3), P=a.mul(a).mul(6), V=a.mul(a).mul(a);
  return {prompt:`Kocka ima ivicu a = ${fmt(a)} cm. Izračunaj ukupnu površinu i zapreminu.`,
    fields:[f('p','Površina P (cm²)',fmt(P)),f('v','Zapremina V (cm³)',fmt(V))],
    steps:[`Kocka ima šest kvadratnih strana: P = 6a² = 6·(${fmt(a)})² = ${fmt(P)} cm².`,
      `V = a³ = (${fmt(a)})³ = ${fmt(V)} cm³.`],hint:'Površinu izrazi u cm², a zapreminu u cm³.'};
});

add('g9-prizma', 9, 'Prava trostrana prizma', 'Površina i zapremina prizme s pravouglom trougaonom osnovom.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const t=R(i+20).div(l===1?10:l===2?5:3), a=t.mul(3), b=t.mul(4), d=t.mul(5), h=R(l+2+i%5);
  const B=a.mul(b).div(2), O=a.add(b).add(d), M=O.mul(h), P=B.mul(2).add(M), V=B.mul(h);
  return {prompt:`Prava trostrana prizma ima pravouglu trougaonu osnovu: katete ${fmt(a)} cm i ${fmt(b)} cm, hipotenuzu ${fmt(d)} cm. Visina prizme je ${fmt(h)} cm. Odredi ukupnu površinu i zapreminu.`,
    fields:[f('p','Površina P (cm²)',fmt(P)),f('v','Zapremina V (cm³)',fmt(V))],
    steps:[`Površina osnove B = ab/2 = ${fmt(B)} cm²; obim osnove O = a+b+c = ${fmt(O)} cm.`,
      `Omotač prave prizme M = Oh = ${fmt(M)} cm².`,`P = 2B + M = ${fmt(P)} cm²; V = Bh = ${fmt(V)} cm³.`],
    hint:'Prizma ima dvije jednake osnove; omotač prave prizme jednak je obimu osnove puta visina.'};
});

add('g9-piramida', 9, 'Pravilna četverostrana piramida', 'Osnova, omotač, ukupna površina i trećina zapremine odgovarajuće prizme.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const t=R(i+20).div(l===1?10:l===2?5:3), a=t.mul(6), h=t.mul(4), s=t.mul(5);
  const B=a.mul(a), M=a.mul(s).mul(2), P=B.add(M), V=B.mul(h).div(3);
  return {prompt:`Pravilna četverostrana piramida ima osnovnu ivicu a = ${fmt(a)} cm, visinu h = ${fmt(h)} cm i apotemu bočne strane s = ${fmt(s)} cm. Odredi ukupnu površinu i zapreminu.`,
    fields:[f('p','Površina P (cm²)',fmt(P)),f('v','Zapremina V (cm³)',fmt(V))],
    steps:[`Kvadratna osnova ima površinu B = a² = ${fmt(B)} cm².`,
      `Četiri bočna trougla daju M = 4·as/2 = 2as = ${fmt(M)} cm².`,`P = B + M = ${fmt(P)} cm².`,`V = Bh/3 = ${fmt(V)} cm³.`],
    hint:'Visina piramide h koristi se za zapreminu; apotema bočne strane s koristi se za omotač.'};
});

add('g9-valjak', 9, 'Valjak: površina i zapremina', 'Koristi P = 2πr(r+h) i V = πr²h.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const r=R(i+20).div(10), h=R(l+2+i%7), pFactor=r.mul(r.add(h)).mul(2), vFactor=r.mul(r).mul(h);
  const P=Math.PI*pFactor.toNumber(), V=Math.PI*vFactor.toNumber();
  return {prompt:`Valjak ima poluprečnik r = ${fmt(r)} cm i visinu h = ${fmt(h)} cm. Izračunaj ukupnu površinu i zapreminu koristeći π s kalkulatora. Zaokruži na dvije decimale.`,
    fields:[f('p','Površina P (cm²)',P,'number',0.0051),f('v','Zapremina V (cm³)',V,'number',0.0051)],
    steps:[`Dvije osnove i omotač: P = 2πr² + 2πrh = ${fmt(pFactor)}π ≈ ${P.toFixed(2)} cm².`,
      `V = πr²h = ${fmt(vFactor)}π ≈ ${V.toFixed(2)} cm³.`],hint:'Poluprečnik r nije prečnik; omotač valjka ima površinu 2πrh.'};
});

add('g9-kupa', 9, 'Kupa: površina i zapremina', 'Razlikuj poluprečnik, visinu i izvodnicu kupe.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const t=R(i+20).div(l===1?10:l===2?5:3), r=t.mul(3), h=t.mul(4), s=t.mul(5);
  const pFactor=r.mul(r.add(s)), vFactor=r.mul(r).mul(h).div(3), P=Math.PI*pFactor.toNumber(), V=Math.PI*vFactor.toNumber();
  return {prompt:`Prava kružna kupa ima poluprečnik r = ${fmt(r)} cm, visinu h = ${fmt(h)} cm i izvodnicu s = ${fmt(s)} cm. Odredi ukupnu površinu i zapreminu; koristi π s kalkulatora i zaokruži na dvije decimale.`,
    fields:[f('p','Površina P (cm²)',P,'number',0.0051),f('v','Zapremina V (cm³)',V,'number',0.0051)],
    steps:[`Ukupna površina je osnova plus omotač: P = πr² + πrs = πr(r+s) = ${fmt(pFactor)}π ≈ ${P.toFixed(2)} cm².`,
      `Zapremina je V = πr²h/3 = ${fmt(vFactor)}π ≈ ${V.toFixed(2)} cm³.`],
    hint:'Izvodnica s koristi se za površinu omotača, a okomita visina h za zapreminu.'};
});

add('g9-lopta', 9, 'Lopta: površina i zapremina', 'Primijeni formule P = 4πr² i V = 4πr³/3.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  const r=R(i+20).div(l===1?10:l===2?5:3), pFactor=r.mul(r).mul(4), vFactor=r.mul(r).mul(r).mul(4).div(3);
  const P=Math.PI*pFactor.toNumber(), V=Math.PI*vFactor.toNumber();
  return {prompt:`Lopta ima poluprečnik r = ${fmt(r)} cm. Izračunaj površinu sfere koja je ograničava i zapreminu lopte. Koristi π s kalkulatora; zaokruži na dvije decimale.`,
    fields:[f('p','Površina P (cm²)',P,'number',0.0051),f('v','Zapremina V (cm³)',V,'number',0.0051)],
    steps:[`P = 4πr² = ${fmt(pFactor)}π ≈ ${P.toFixed(2)} cm².`,`V = 4πr³/3 = ${fmt(vFactor)}π ≈ ${V.toFixed(2)} cm³.`],
    hint:'Ako je zadan prečnik, prvo ga podijeli sa dva. Ovdje je već zadan poluprečnik.'};
});

add('g9-diedar', 9, 'Diedar i susjedni diedri', 'Mjeri diedar normalnim presjekom i koristi suplementnost susjednih diedara.', c => {
  const {index:i, level:l, R, fmt, f} = c;
  let alpha,beta,prompt,steps;
  if(l===1){
    alpha=R(i+10).div(2); beta=R(180).sub(alpha);
    prompt=`Ravan okomita na zajedničku ivicu diedra siječe njegove strane po polupravama koje zaklapaju ugao ${fmt(alpha)}°. Odredi mjeru tog diedra α i njemu susjednog diedra β. Njihove nezajedničke strane čine jednu ravan.`;
    steps=[`Mjera diedra jednaka je uglu njegovog normalnog presjeka: α = ${fmt(alpha)}°.`,`Susjedni diedri s nezajedničkim stranama u istoj ravni imaju zbir 180°: β = 180° − α = ${fmt(beta)}°.`];
  }else if(l===2){
    const difference=R(i+1).div(2); alpha=R(180).sub(difference).div(2); beta=alpha.add(difference);
    prompt=`Dva susjedna diedra imaju nezajedničke strane u istoj ravni. Ugao β veći je od ugla α za ${fmt(difference)}°. Odredi oba ugla.`;
    steps=[`Susjedni diedri su suplementni: α + β = 180°.`,`Kako je β = α + ${fmt(difference)}°, slijedi 2α = 180° − ${fmt(difference)}°.`,`α = ${fmt(alpha)}°, a β = ${fmt(beta)}°.`];
  }else{
    const p=i+2,q=211; alpha=R(180).mul(p).div(p+q); beta=R(180).mul(q).div(p+q);
    prompt=`Dva susjedna diedra imaju nezajedničke strane u istoj ravni. Njihovi uglovi zadovoljavaju α : β = ${p} : ${q}. Odredi α i β tačno, kao razlomke ako je potrebno.`;
    steps=[`α + β = 180°. Odnos dijeli ukupni ugao na ${p+q} jednakih dijelova.`,`α = 180·${p}/${p+q} = ${fmt(alpha)}°, β = 180·${q}/${p+q} = ${fmt(beta)}°.`];
  }
  return {prompt,fields:[f('alpha','Ugao α (°)',fmt(alpha)),f('beta','Ugao β (°)',fmt(beta))],steps,
    hint:'Diedar se mjeri uglom u presjeku ravni okomitoj na njegovu ivicu. Za navedene susjedne diedre zbir je 180°.'};
});


  function generate(topicId,seed=1,difficulty='medium'){
    const topic=topics.find(t=>t.id===topicId);
    if(!topic) throw new Error('Nepoznata tema zadataka: '+topicId);
    const c=context(topicId,seed,difficulty),task=generators[topicId](c);
    return {...task,id:topicId+'-'+difficulty+'-'+(c.index+1),topicId,grade:topic.grade,title:topic.title,difficulty,variant:c.index+1};
  }
  function normalizeText(value){
    return String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/−/g,'-').replace(/>=/g,'≥').replace(/<=/g,'≤').replace(/\s+/g,'');
  }
  function numberList(value){
    if(Array.isArray(value)) return value.map(v=>{
      if(!finalNumber.test(String(v).trim()))throw new Error('Svaki element mora biti broj ili jednostavan razlomak.');
      return R(v);
    });
    const raw=String(value).trim();
    if(!raw||/^(nema|nijedan|\[\]|∅)$/i.test(raw))return [];
    const content=raw.replace(/^\[/,'').replace(/\]$/,'');
    const tokens=(content.includes(';')?content.split(';'):content.split(/[,\s]+/)).map(t=>t.trim()).filter(Boolean);
    return tokens.map(token=>{
      if(!finalNumber.test(token))throw new Error('Svaki element mora biti broj ili jednostavan razlomak.');
      return R(token);
    });
  }
  function checkField(field,user){
    if(user===undefined||user===null||(!Array.isArray(user)&&String(user).trim()==='')) return {correct:false,message:'Unesite odgovor.'};
    try{
      let correct=false;
      if(field.type==='number'){
        const raw=String(user).trim();
        if(!finalNumber.test(raw))return {correct:false,message:'Upišite konačan broj, decimalni broj ili jednostavan razlomak. Izraz iz zadatka nije rješenje.'};
        if(field.format==='reducedFraction'){
          const match=/^([+-]?\d+)\s*\/\s*(\d+)$/.exec(raw);
          if(!match&&!/^[+-]?\d+$/.test(raw))return {correct:false,message:'Upišite neskrativ razlomak u obliku a/b.'};
          if(match&&(BigInt(match[2])===0n||M.gcd(match[1],match[2])!==1n))return {correct:false,message:'Razlomak još nije neskrativ. Podijelite brojilac i nazivnik njihovim NZD.'};
        }
        const expected=R(field.answer),actual=R(raw);
        correct=field.tolerance!==undefined?Math.abs(actual.sub(expected).toNumber())<=field.tolerance:actual.equals(expected);
      }else if(field.type==='list'){
        const expected=numberList(field.answer),actual=numberList(user);
        if(expected.length===actual.length){
          if(field.ordered===true)correct=expected.every((v,i)=>v.equals(actual[i]));
          else{
            const used=new Set();
            correct=expected.every(v=>{const i=actual.findIndex((x,j)=>!used.has(j)&&x.equals(v));if(i<0)return false;used.add(i);return true;});
          }
        }
      }else{
        const acceptable=[field.answer,...(field.accepted||[])].map(normalizeText);
        const actual=normalizeText(user);
        correct=acceptable.includes(actual);
        if(!correct&&/^x[<>≤≥]/.test(acceptable[0])){
          const expected=/^x([<>≤≥])(.+)$/.exec(acceptable[0]);
          let match=/^x([<>≤≥])(.+)$/.exec(actual);
          if(!match){
            const reversed=/^(.+)([<>≤≥])x$/.exec(actual);
            if(reversed)match=['',{'<':'>','>':'<','≤':'≥','≥':'≤'}[reversed[2]],reversed[1]];
          }
          if(expected&&match&&expected[1]===match[1]&&finalNumber.test(match[2]))correct=R(expected[2]).equals(R(match[2]));
        }
      }
      return {correct,message:correct?'Tačan odgovor.':'Odgovor nije tačan. Pokušajte ponovo ili pogledajte postupak.'};
    }catch(error){return {correct:false,message:'Odgovor nije u očekivanom obliku: '+error.message};}
  }
  function check(task,answers){
    const fields=task.fields.map(field=>({key:field.key,...checkField(field,answers&&answers[field.key])}));
    return {correct:fields.every(result=>result.correct),fields};
  }
  return Object.freeze({topics:Object.freeze(topics),variantsPerTopic,generate,checkField,check});
});
