/* ELDI EDU: 500 named mathematical skills, exact deterministic practice.
 * Catalog rows define {id,grade,title,description,practice:{family,mode,params}}.
 * 200 selectable indices per skill and three difficulty levels. Related skills
 * share verified mathematics, while their mode/parameters specify the goal.
 * EduPractice is a browser global and CommonJS API. EduExercises legacy IDs work.
 */
(function(root,factory){
  'use strict';
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./math-engine.js'):root.EduMath,node?require('./exercise-engine.js'):root.EduExercises,node?require('../content/math-catalog.json'):root.ELDI_MATH_CATALOG);
  if(node)module.exports=api;if(root)root.EduPractice=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(M,E,catalog){
  'use strict';
  if(!M||!E||!catalog)throw new Error('Prvo učitajte matematički modul, zbirku i katalog.');
  const topics=Array.isArray(catalog)?catalog:catalog.topics;
  const variantsPerTopic=200,R=M.rational,S=v=>R(v).toString(),N=v=>R(v).toNumber();
  const f=(key,label,answer,type='number',tolerance)=>{const o={key,label,answer:Array.isArray(answer)?answer.map(String):String(answer),type};if(tolerance!==undefined)o.tolerance=tolerance;return o;};
  const one=(prompt,answer,steps,hint='Odredi poznate podatke, primijeni pravilo i provjeri konačan rezultat.',label='Odgovor')=>({prompt,fields:[f('answer',label,answer)],steps,hint});
  const many=(prompt,fields,steps,hint='Prvo zapiši odgovarajuće formule pa uvrsti podatke.')=>({prompt,fields,steps,hint});
  const text=(prompt,answer,steps,hint)=>many(prompt,[f('answer','Odgovor',answer,'text')],steps,hint);
  const list=(prompt,answer,steps,hint,ordered=false)=>{const field=f('answer','Brojevi razdvojeni tačkom-zarezom',answer,'list');if(ordered)field.ordered=true;return many(prompt,[field],steps,hint);};
  const exact=(v)=>S(v),dec=v=>R(v).toDecimal(8).replace('.',','),signed=v=>N(v)<0?'− '+S(R(v).abs()):'+ '+S(v);
  function hash(s){let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function ctx(t,seed,difficulty){
    const numeric=/^[-+]?\d+$/.test(String(seed))?Number(seed):NaN,index=Number.isSafeInteger(numeric)?((numeric-1)%200+200)%200:hash(seed)%200;
    const l={easy:1,medium:2,hard:3}[difficulty];if(!l)throw new Error('Težina mora biti easy, medium ili hard.');
    let state=hash(t.id+'|'+index+'|'+difficulty),p=t.practice.params||{};
    const rand=(a,b)=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return a+state%(b-a+1);};
    return {t,p,i:index,l,rand,a:11+index*(l+1),b:3+rand(1,10)*l,c:2+rand(1,8),x:R(index-83).div(l===3?3:1)};
  }
  const handlers={};
  handlers.legacy=c=>E.generate(c.t.practice.mode,c.i+1,['','easy','medium','hard'][c.l]);
  handlers.numeral=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,place=BigInt(p.place||10**(l+1)),n=BigInt(p.base||1234567)+BigInt(i)*379n+BigInt(l)*100003n,digit=n/place%10n;
    if(mode==='place')return one(`Odredi vrijednost cifre na mjestu ${place} u broju ${n}.`,digit*place,[`Cifra je ${digit}.`,`Vrijednost je ${digit}·${place} = ${digit*place}.`]);
    if(mode==='digit')return one(`Koja cifra u broju ${n} zauzima mjesto ${place}?`,digit,[`Cjelobrojno podijeli ${n} sa ${place}: ${n/place}.`,`Posljednja cifra količnika je ${digit}.`]);
    if(mode==='expand'){const places=[];let d=n,k=1n;while(d){places.push((d%10n)*k);d/=10n;k*=10n;}return list(`Rastavi ${n} na zbir mjesnih vrijednosti od najveće do najmanje. Uključi nule za prazna mjesta.`,places.reverse(),[`${n} = ${places.join(' + ')}.`],undefined,true);}
    if(mode==='compose'){const a=n/1000n,b=n%1000n;return one(`Sastavi broj od ${a} hiljada i ${b} jedinica.`,n,[`${a}·1000 + ${b} = ${n}.`]);}
    if(mode==='before'||mode==='after'){const s=mode==='after'?1n:-1n;return one(`Odredi ${s===1n?'sljedbenik':'prethodnik'} broja ${n}.`,n+s,[`${n} ${s===1n?'+':'−'} 1 = ${n+s}.`]);}
    if(mode==='compare'){const k=n+BigInt(i%7-3)*place;return text(`Uporedi ${n} i ${k}. Upiši <, > ili =.`,n<k?'<':n>k?'>':'=',[`Poredi cifre slijeva: ${n} ${n<k?'<':n>k?'>':'='} ${k}.`]);}
    if(mode==='order'){const a=[n+7n*place,n-3n*place,n+place,n];return list(`Poredaj rastuće: ${a.join('; ')}.`,[...a].sort((x,y)=>x<y?-1:x>y?1:0),[`Rastući niz: ${[...a].sort((x,y)=>x<y?-1:x>y?1:0).join('; ')}.`],undefined,true);}
    if(mode==='round'){const q=(n+place/2n)/place*place;return one(`Zaokruži ${n} na najbliži višekratnik od ${place}.`,q,[`Ostatak je ${n%place}; polovina jedinice zaokruživanja je ${place/2n}.`,`Zaokruženi broj je ${q}.`]);}
    if(mode==='interval'){const lo=n/place*place,hi=lo+place;return many(`Odredi susjedne višekratnike broja ${place} između kojih se nalazi ${n} (donju granicu uključi).`,[f('lower','Donja granica',lo),f('upper','Gornja granica',hi)],[`${lo} ≤ ${n} < ${hi}.`]);}
  };
  handlers.arithmetic=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,scale=BigInt(p.scale||10**(l-1)),a=(BigInt(101+i*17))*scale,b=BigInt(c.b),q=BigInt(21+i*l),product=a*b;
    const data={add:[`${a} + ${b}`,a+b],subtract:[`${a+b} − ${b}`,a],multiply:[`${a} · ${b}`,product],divide:[`${product} : ${b}`,a]};
    if(data[mode])return one(`Izračunaj ${data[mode][0]}.`,data[mode][1],[`${data[mode][0]} = ${data[mode][1]}.`,`Provjeri rezultat obrnutom računskom operacijom.`]);
    if(mode==='remainder'){const r=BigInt(i)%b,n=q*b+r;return many(`Podijeli ${n} sa ${b}; odredi količnik i ostatak.`,[f('q','Količnik',q),f('r','Ostatak',r)],[`${n} = ${b}·${q} + ${r}; 0 ≤ ${r} < ${b}.`]);}
    const missing={'missing-addend':[`x + ${b} = ${a+b}`,a,`${a+b} − ${b}`],'missing-subtrahend':[`${a+b} − x = ${a}`,b,`${a+b} − ${a}`],'missing-minuend':[`x − ${b} = ${a}`,a+b,`${a} + ${b}`],'missing-factor':[`x · ${b} = ${product}`,a,`${product} : ${b}`],'missing-dividend':[`x : ${b} = ${a}`,product,`${a} · ${b}`],'missing-divisor':[`${product} : x = ${a}`,b,`${product} : ${a}`]};
    if(missing[mode])return one(`Odredi x: ${missing[mode][0]}.`,missing[mode][1],[`Primijeni obrnutu operaciju: x = ${missing[mode][2]} = ${missing[mode][1]}.`]);
    if(mode==='expression')return one(`Izračunaj (${a} + ${b}) · ${l+2} − ${b}.`,(a+b)*BigInt(l+2)-b,[`Zagrada: ${a}+${b}=${a+b}.`,`Množenje: ${a+b}·${l+2}=${(a+b)*BigInt(l+2)}.`,`Oduzimanje: ${(a+b)*BigInt(l+2)}−${b}=${(a+b)*BigInt(l+2)-b}.`]);
    if(mode==='estimate'){const place=BigInt(p.place||100),roundedA=(a+place/2n)/place*place,roundedB=((b+BigInt(i)*11n)+place/2n)/place*place;return one(`Procijeni zbir ${a} + ${b+BigInt(i)*11n}: oba sabirka prvo zaokruži na ${place}, zatim saberi.`,roundedA+roundedB,[`Zaokruženi sabirci: ${roundedA} i ${roundedB}.`,`Procijenjeni zbir: ${roundedA}+${roundedB}=${roundedA+roundedB}.`]);}
  };
  handlers.word=c=>{
    const {a,b,i,l,p}=c,mode=c.t.practice.mode,context=p.context||'školska radionica';
    if(mode==='total')return one(`U aktivnosti „${context}“ učestvuje ${a} učenika prve i ${b} učenika druge grupe. Koliko ih učestvuje ukupno?`,a+b,[`Ukupno = ${a}+${b}=${a+b} učenika.`]);
    if(mode==='change')return one(`Za „${context}“ pripremljeno je ${a+b} materijala. Potrošeno je ${b}, zatim dopremljeno ${l*11}. Koliko ih sada ima?`,a+l*11,[`${a+b}−${b}=${a}.`,`${a}+${l*11}=${a+l*11}.`]);
    if(mode==='packs')return one(`Za „${context}“ nabavljeno je ${a} paketa sa po ${b} komada. Koliko komada ima ukupno?`,a*b,[`Broj paketa × broj komada: ${a}·${b}=${a*b}.`]);
    if(mode==='equal-share')return one(`${a*b} komada materijala treba ravnomjerno rasporediti u ${b} grupa za „${context}“. Koliko dobiva jedna grupa?`,a,[`${a*b}:${b}=${a} komada.`]);
    if(mode==='price'){const price=R(b).div(4);return one(`Za „${context}“ kupuje se ${a} svezaka po ${dec(price)} KM. Koliki je ukupni račun?`,S(price.mul(a)),[`Ukupna cijena = ${a}·${S(price)}=${S(price.mul(a))} KM.`]);}
    if(mode==='distance'){const speed=b+20,time=R(i+1).div(10);return one(`Vozilo se kreće stalnom brzinom ${speed} km/h tokom ${dec(time)} h. Koliki put pređe?`,S(time.mul(speed)),[`s=v·t=${speed}·${S(time)}=${S(time.mul(speed))} km.`]);}
    if(mode==='time')return one(`Putnik pređe ${a*b} km stalnom brzinom ${b} km/h. Koliko sati traje put?`,a,[`t=s/v=${a*b}/${b}=${a} h.`]);
    if(mode==='age'){const older=a+10,delta=b;return one(`Danas osoba ima ${older} godina. Koliko je imala prije ${delta} godina?`,older-delta,[`${older}−${delta}=${older-delta} godina.`]);}
    if(mode==='consecutive'){const n=a,sum=3*n+3;return many(`Zbir tri uzastopna prirodna broja je ${sum}. Odredi sva tri rastućim redom.`,[f('first','Prvi',n),f('second','Drugi',n+1),f('third','Treći',n+2)],[`n+(n+1)+(n+2)=${sum}.`,`3n+3=${sum}; n=(${sum}−3)/3=${n}.`]);}
  };
  const unitFactors={km:['length',1000],m:['length',1],dm:['length','1/10'],cm:['length','1/100'],mm:['length','1/1000'],t:['mass',1000],kg:['mass',1],g:['mass','1/1000'],mg:['mass','1/1000000'],h:['time',3600],min:['time',60],s:['time',1],day:['time',86400],dan:['time',86400],'km²':['area',1000000],ha:['area',10000],a:['area',100],'m²':['area',1],'dm²':['area','1/100'],'cm²':['area','1/10000'],'mm²':['area','1/1000000'],'m³':['volume',1],'dm³':['volume','1/1000'],l:['volume','1/1000'],L:['volume','1/1000'],'cm³':['volume','1/1000000'],ml:['volume','1/1000000'],KM:['money',1],fening:['money','1/100'],fen:['money','1/100']};
  handlers.units=c=>{
    const mode=c.t.practice.mode,defaults={length:['m','cm'],mass:['kg','g'],time:['h','min'],area:['m²','cm²'],volume:['l','ml'],money:['KM','fening']},from=c.p.from||defaults[mode][0],to=c.p.to||defaults[mode][1],a=R(c.a).div(c.t.grade===5?1:c.l===3?10:1),u=unitFactors[from],v=unitFactors[to];
    if(!u||!v||u[0]!==v[0])throw new Error(`Nespojive jedinice: ${from}/${to}`);
    const factor=R(u[1]).div(v[1]),value=a.mul(factor);return one(`Pretvori ${dec(a)} ${from} u ${to}.`,S(value),[`1 ${from} = ${S(factor)} ${to}.`,`${S(a)}·${S(factor)}=${S(value)} ${to}.`]);
  };
  handlers.sets=c=>{
    const mode=c.t.practice.mode,k=c.i+c.l*10,A=[k,k+2,k+4,k+6],B=[k+2,k+3,k+4,k+7],U=Array.from({length:9},(_,j)=>k+j),set=s=>'{'+s.join(', ')+'}',intersection=A.filter(x=>B.includes(x)),union=[...new Set([...A,...B])].sort((a,b)=>a-b),difference=A.filter(x=>!B.includes(x));
    const values={union,intersection,difference,complement:U.filter(x=>!A.includes(x))};
    if(values[mode])return list(`A=${set(A)}, B=${set(B)}, U=${set(U)}. Odredi ${mode==='union'?'A ∪ B':mode==='intersection'?'A ∩ B':mode==='difference'?'A \\ B':'U \\ A'}.`,values[mode],[`Traženi skup je ${set(values[mode])}.`]);
    if(mode==='cardinality')return one(`A=${set(A)}, B=${set(B)}. Odredi broj elemenata unije A ∪ B.`,union.length,[`|A ∪ B|=|A|+|B|−|A ∩ B|=4+4−${intersection.length}=${union.length}.`]);
    if(mode==='subset'){const C=c.i%2?intersection:[k,k+8];return text(`A=${set(A)}, C=${set(C)}. Je li C podskup skupa A? Upiši da ili ne.`,C.every(x=>A.includes(x))?'da':'ne',[`Svaki element C ${C.every(x=>A.includes(x))?'pripada':'ne pripada'} skupu A.`]);}
  };
  handlers.sequence=c=>{
    const mode=c.t.practice.mode,a=c.i+2,d=c.l+2,n=5+c.i,seq=Array.from({length:5},(_,j)=>a+j*d);
    if(mode==='next')return one(`Odredi sljedeći član aritmetičkog niza ${seq.join(', ')}, …`,a+5*d,[`Razlika susjednih članova je ${d}.`,`Sljedeći član: ${seq[4]}+${d}=${a+5*d}.`]);
    if(mode==='term')return one(`Aritmetički niz ima prvi član ${a} i razliku ${d}. Odredi ${n}. član.`,a+(n-1)*d,[`aₙ=a₁+(n−1)d=${a}+(${n}−1)·${d}=${a+(n-1)*d}.`]);
    if(mode==='sum')return one(`Odredi zbir prvih ${n} članova aritmetičkog niza s prvim članom ${a} i razlikom ${d}.`,S(R(n).mul(2*a+(n-1)*d).div(2)),[`aₙ=${a+(n-1)*d}.`,`Sₙ=n(a₁+aₙ)/2=${n}·(${a}+${a+(n-1)*d})/2=${S(R(n).mul(2*a+(n-1)*d).div(2))}.`]);
  };
  handlers.divisibility=c=>{
    const mode=c.t.practice.mode,d=Number(c.p.divisor||c.p.d||[2,3,4,5,6,9,10,15,25][c.l+1]),n=1000*c.l+c.i*37+11;
    if(mode==='test')return many(`Je li ${n} djeljiv sa ${d}? Odredi i ostatak.`,[f('decision','Da ili ne',n%d===0?'da':'ne','text'),f('remainder','Ostatak',n%d)],[`${n}=${d}·${Math.floor(n/d)}+${n%d}.`,`Djeljivost vrijedi tačno kada je ostatak 0.`]);
    if(mode==='digit'){const prefix=31+c.i*c.l,allowed=[];for(let digit=0;digit<10;digit++)if((prefix*10+digit)%d===0)allowed.push(digit);return list(`U broju ${prefix}□ zamijeni □ cifrom tako da broj bude djeljiv sa ${d}. Napiši sve moguće cifre; ako ih nema, upiši nema.`,allowed,[`Provjeri cifre od 0 do 9. Rješenja su ${allowed.length?allowed.join(', '):'nema'}.`]);}
    if(mode==='count'){const lo=c.i*7+1,hi=lo+41+c.l;return one(`Koliko cijelih brojeva od ${lo} do ${hi} uključivo je djeljivo sa ${d}?`,Math.floor(hi/d)-Math.floor((lo-1)/d),[`Broj višekratnika do ${hi} je ${Math.floor(hi/d)}, a do ${lo-1} je ${Math.floor((lo-1)/d)}.`,`Razlika je ${Math.floor(hi/d)-Math.floor((lo-1)/d)}.`]);}
    if(mode==='multiples'){const start=c.i+1,out=Array.from({length:4},(_,j)=>(start+j)*d);return list(`Napiši prva četiri višekratnika broja ${d} koja su strogo veća od ${start*d-1}.`,out,[`Višekratnici su ${out.join(', ')}.`],undefined,true);}
    if(mode==='divisors'){const out=[];for(let j=1;j<=n;j++)if(n%j===0)out.push(j);return list(`Odredi sve pozitivne djelioce broja ${n}.`,out,[`Djelioce tražimo u parovima j i ${n}/j.`,`Djelilaci su ${out.join(', ')}.`]);}
  };
  handlers.primes=c=>{
    const mode=c.t.practice.mode,n=c.i+2+200*(c.l-1),classify=n<2?'ni prost ni složen':M.isPrime(n)?'prost':'složen';
    if(mode==='classify')return text(`Klasifikuj broj ${n}: prost, složen ili ni prost ni složen.`,classify,[`${n} je ${classify}.`,M.isPrime(n)?`Jedini pozitivni djelilaci su 1 i ${n}.`:`Rastav: ${M.factorize(n).expression}.`]);
    if(mode==='list'||mode==='count'){const hi=n+15+c.l,out=[];for(let j=n;j<=hi;j++)if(M.isPrime(j))out.push(j);return mode==='list'?list(`Napiši sve proste brojeve od ${n} do ${hi}.`,out,[`Prosti su ${out.join(', ')||'nema'}.`]):one(`Koliko prostih brojeva ima od ${n} do ${hi}?`,out.length,[`Prosti su ${out.join(', ')||'nema'}; ukupan broj je ${out.length}.`]);}
    if(mode==='factor'){const n2=n*(c.l+1),out=[];for(const part of M.factorize(n2).factors)for(let j=0;j<part.exponent;j++)out.push(part.prime);return list(`Rastavi ${n2} na proste faktore s ponavljanjem.`,out,[`${n2}=${M.factorize(n2).expression}.`]);}
  };
  handlers.gcdlcm=c=>{
    const mode=c.t.practice.mode,g=c.i+2,a=g*(c.l+2),b=g*(c.l+5),d=g*(c.l+7),isGcd=mode.includes('gcd'),three=mode.endsWith('three'),v=isGcd?M.gcd(a,b):M.lcm(a,b),value=three?(isGcd?M.gcd(v,d):M.lcm(v,d)):v;
    if(mode==='word-gcd')return one(`Od ${a} olovaka i ${b} gumica pravimo najveći mogući broj jednakih paketa bez ostatka. Koliko paketa možemo napraviti?`,value,[`Broj paketa mora dijeliti ${a} i ${b}.`,`Najveći takav broj je NZD(${a},${b})=${value}.`]);
    if(mode==='word-lcm')return one(`Dvije svjetiljke bljesnu zajedno. Jedna bljeska svake ${a} s, a druga svakih ${b} s. Nakon koliko sekundi će ponovo bljesnuti zajedno?`,value,[`Traži se prvi pozitivni zajednički višekratnik.`,`NZS(${a},${b})=${value} s.`]);
    return one(`Odredi ${isGcd?'NZD':'NZS'}(${a}, ${b}${three?', '+d:''}).`,value,[`NZD(${a},${b})=${M.gcd(a,b)}; NZS(${a},${b})=${M.lcm(a,b)}.`,...(three?[`Uključi treći broj ${d}: rezultat je ${value}.`]:[])]);
  };
  function rationalFamily(c,kind){
    const mode=c.t.practice.mode,{i,l,p}=c,den=Number(p.denominator||l+4),a=R(i+2).div(den),b=R(l+1).div(p.sameDenominator?den:l+5),left=p.signed&&i%2?a.neg():a;
    if(['add','subtract','multiply','divide'].includes(mode)){const op={add:['+',left.add(b)],subtract:['−',left.sub(b)],multiply:['·',left.mul(b)],divide:[':',left.div(b)]}[mode];return one(`Izračunaj (${S(left)}) ${op[0]} (${S(b)}).`,S(op[1]),[`Zapiši razlomke sa pozitivnim nazivnicima.`,`(${S(left)}) ${op[0]} (${S(b)}) = ${S(op[1])}.`,`Rezultat je skraćen do neskrativog oblika.`]);}
    if(mode==='expression'){const v=left.add(b).mul(l+2).sub(b);return one(`Izračunaj [(${S(left)}) + (${S(b)})] · ${l+2} − (${S(b)}).`,S(v),[`Zagrada: ${S(left.add(b))}.`,`Množenje i oduzimanje: ${S(left.add(b))}·${l+2}−${S(b)}=${S(v)}.`]);}
    if(mode==='compare')return text(`Uporedi ${S(left)} i ${S(b)}. Upiši <, > ili =.`,N(left)<N(b)?'<':N(left)>N(b)?'>':'=',[`Razlika je ${S(left.sub(b))}; znak razlike određuje odnos.`]);
    if(mode==='part'){const total=den*(i+20),num=l+1;return one(`Od ${total} knjiga, ${num}/${den} je posuđeno. Koliko je posuđenih knjiga?`,total*num/den,[`${total}:${den}=${total/den}.`,`${total/den}·${num}=${total*num/den}.`]);}
    if(mode==='whole'){const whole=den*(i+10),num=l+1,part=whole*num/den;return one(`${num}/${den} neke količine iznosi ${part}. Odredi cijelu količinu.`,whole,[`Cjelina=${part}:(${num}/${den})=${whole}.`]);}
    if(mode==='reduce'){const n=(i+1)*(l+2),d=(i+l+3)*(l+2),out=one(`Skrati ${n}/${d} do neskrativog razlomka.`,S(R(n).div(d)),[`NZD(${n},${d})=${M.gcd(n,d)}.`,`Podijeli brojilac i nazivnik njihovim NZD: ${S(R(n).div(d))}.`]);out.fields[0].format='reducedFraction';return out;}
    if(mode==='expand'){const numerator=i+1,denominator=i+l+3,factor=l+2;return many(`Proširi razlomak ${numerator}/${denominator} faktorom ${factor}. Upiši novi brojilac i nazivnik.`,[f('numerator','Brojilac',numerator*factor),f('denominator','Nazivnik',denominator*factor)],[`${numerator}/${denominator}=(${numerator}·${factor})/(${denominator}·${factor})=${numerator*factor}/${denominator*factor}.`]);}
    if(mode==='order'){const arr=[left.add(b),left,left.sub(b),b];return list(`Poredaj rastuće razlomke: ${arr.map(S).join('; ')}.`,[...arr].sort((x,y)=>N(x)-N(y)).map(S),[`Uporedi vrijednosti: ${[...arr].sort((x,y)=>N(x)-N(y)).map(S).join('; ')}.`],undefined,true);}
    if(mode==='mixed'){const n=i+den,whole=Math.floor(n/den),rem=n%den;return many(`Razlomak ${n}/${den} pretvori u mješoviti broj. Unesi cijeli dio i razlomački dio (0 ako ga nema).`,[f('whole','Cijeli dio',whole),f('fraction','Razlomački dio',S(R(rem).div(den)))],[`${n}=${den}·${whole}+${rem}.`,`${n}/${den}=${whole}+${S(R(rem).div(den))}.`]);}
    if(mode==='improper'){const whole=i+1,num=l,denominator=l+2;return one(`Mješoviti broj ${whole} + ${num}/${denominator} pretvori u nepravi razlomak.`,S(R(whole).add(R(num).div(denominator))),[`Brojilac: ${whole}·${denominator}+${num}=${whole*denominator+num}.`,`Rezultat je ${S(R(whole).add(R(num).div(denominator)))}.`]);}
    if(mode==='reciprocal')return one(`Odredi recipročnu vrijednost broja ${S(left)}.`,S(R(1).div(left)),[`Recipročno znači 1 podijeljeno datim brojem: 1:(${S(left)})=${S(R(1).div(left))}.`]);
    if(mode==='complex'){const top=left.add(b),bottom=b.add(1),v=top.div(bottom);return one(`Izračunaj dvojni razlomak [${S(left)} + ${S(b)}] / [${S(b)} + 1].`,S(v),[`Brojilac = ${S(top)}; nazivnik = ${S(bottom)}.`,`Dijelimo recipročnim: ${S(top)}:${S(bottom)}=${S(v)}.`]);}
  }
  handlers.fraction=c=>rationalFamily(c,'fraction');handlers.rational=c=>rationalFamily(c,'rational');
  handlers.decimal=c=>{
    const mode=c.t.practice.mode,{i,l,p}=c,a=R(1001+i*19).div(10**(Number(p.decimals)||l)),b=R(c.b).div(10),num=dec(a);
    if(['add','subtract','multiply','divide'].includes(mode)){const [op,v]={add:['+',a.add(b)],subtract:['−',a.sub(b)],multiply:['·',a.mul(b)],divide:[':',a.div(b)]}[mode];return one(`Izračunaj ${num} ${op} ${dec(b)}.`,S(v),[`Tačan razlomački zapis: ${S(a)} ${op} ${S(b)}.`,`Rezultat: ${S(v)} (decimalno: ${dec(v)}).`]);}
    if(mode==='convert')return one(`Decimalni broj ${num} pretvori u neskrativ razlomak.`,S(a),[`Pomjeri zarez za broj decimalnih mjesta i podijeli odgovarajućim stepenom 10.`,`Neskrativ zapis je ${S(a)}.`]);
    if(mode==='round'){const digits=Number(p.roundPlaces??Math.max(0,l-1)),value=a.toDecimal(digits);return one(`Zaokruži ${num} na ${digits} decimalnih mjesta.`,value,[`Posmatraj prvu odbačenu decimalu.`,`Zaokružen zapis je ${value.replace('.',',')}.`]);}
    if(mode==='place'){const places=Number(p.decimalPlace||l),scaled=a.mul(10**places),digit=scaled.n/scaled.d%10n;return one(`Odredi cifru na ${places}. decimalnom mjestu u broju ${num}.`,digit,[`Pomnoži sa ${10**places} i posmatraj cifru jedinica cjelobrojnog dijela: ${digit}.`]);}
    if(mode==='compare')return text(`Uporedi ${num} i ${dec(a.add(R(i%5-2).div(100)))}: <, > ili =.`,i%5<2?'>':i%5>2?'<':'=',[`Drugi broj se razlikuje za ${S(R(i%5-2).div(100))}.`]);
    if(mode==='expression'){const value=a.add(b).mul(l+2);return one(`Izračunaj (${num} + ${dec(b)}) · ${l+2}.`,S(value),[`Zagrada: ${dec(a.add(b))}.`,`Rezultat: ${S(value)}.`]);}
  };
  handlers.integer=c=>{
    const mode=c.t.practice.mode,a=-(c.i+11)*c.l,b=c.b*(c.i%2?-1:1);
    if(mode==='absolute')return one(`Izračunaj |${a}|.`,Math.abs(a),[`Apsolutna vrijednost je udaljenost od nule: |${a}|=${Math.abs(a)}.`]);
    if(mode==='opposite')return one(`Odredi suprotan broj broju ${a}.`,-a,[`Suprotan broj ima isti iznos i obrnut predznak: ${-a}.`]);
    if(mode==='compare')return text(`Uporedi cijele brojeve ${a} i ${b}. Upiši <, > ili =.`,a<b?'<':a>b?'>':'=',[`Na brojevnoj pravoj veći broj leži desno: ${a} ${a<b?'<':a>b?'>':'='} ${b}.`]);
    if(mode==='order'){const arr=[a,b,a-b,-a];return list(`Poredaj rastuće: ${arr.join('; ')}.`,[...arr].sort((x,y)=>x-y),[`Rastući niz: ${[...arr].sort((x,y)=>x-y).join('; ')}.`],undefined,true);}
    if(mode==='distance')return one(`Koliko je udaljenost tačaka ${a} i ${b} na brojevnoj pravoj?`,Math.abs(a-b),[`d=|${a}−(${b})|=${Math.abs(a-b)}.`]);
    if(['add','subtract','multiply','divide'].includes(mode)){const left=mode==='divide'?a*b:a,[op,v]={add:['+',left+b],subtract:['−',left-b],multiply:['·',left*b],divide:[':',left/b]}[mode];return one(`Izračunaj (${left}) ${op} (${b}).`,v,[`Primijeni pravilo predznaka.`,`(${left}) ${op} (${b}) = ${v}.`]);}
    if(mode==='expression')return one(`Izračunaj (${a} + ${b}) · (−${c.l+2}) − (${b}).`,(a+b)*(-c.l-2)-b,[`Zagrada: ${a}+(${b})=${a+b}.`,`Rezultat: (${a+b})·(−${c.l+2})−(${b})=${(a+b)*(-c.l-2)-b}.`]);
  };
  handlers.percent=c=>{
    const mode=c.t.practice.mode,a=R(100+c.i*10),p=R(5+c.l*5+c.i%13),part=a.mul(p).div(100);
    if(mode==='part')return one(`Koliko iznosi ${S(p)}% od ${S(a)}?`,S(part),[`p%·a=p·a/100=${S(p)}·${S(a)}/100=${S(part)}.`]);
    if(mode==='whole')return one(`${S(p)}% nekog broja iznosi ${S(part)}. Odredi taj broj.`,S(a),[`Cjelina = dio·100/p=${S(part)}·100/${S(p)}=${S(a)}.`]);
    if(mode==='rate')return one(`Koliko procenata od ${S(a)} predstavlja ${S(part)}?`,S(p),[`Procenat=${S(part)}·100/${S(a)}=${S(p)}%.`]);
    if(mode==='increase'||mode==='decrease'){const sign=mode==='increase'?1:-1,v=a.mul(R(100).add(p.mul(sign))).div(100);return one(`Cijena ${S(a)} KM ${sign>0?'povećava':'smanjuje'} se za ${S(p)}%. Odredi novu cijenu.`,S(v),[`Promjena=${S(part)} KM.`,`Nova cijena=${S(a)} ${sign>0?'+':'−'} ${S(part)}=${S(v)} KM.`]);}
    if(mode==='successive'){const q=5+c.l,v=a.mul(R(100).sub(p)).div(100).mul(R(100).sub(q)).div(100);return one(`Cijena je ${S(a)} KM. Prvo se smanji za ${S(p)}%, zatim nova cijena za još ${q}%. Odredi konačnu cijenu.`,S(v),[`Poslije prvog popusta: ${S(a.mul(R(100).sub(p)).div(100))} KM.`,`Drugi popust primjenjuje se na tu cijenu; konačno ${S(v)} KM.`]);}
  };
  handlers.ratio=c=>{
    const mode=c.t.practice.mode,{i,l,p}=c,a=i+2,b=l+3,k=l+2,total=(a+b)*(i+10);
    if(mode==='simplify'){const g=M.gcd(a*k,b*k);return many(`Skrati razmjeru ${a*k}:${b*k} na uzajamno proste članove.`,[f('first','Prvi član',BigInt(a*k)/g),f('second','Drugi član',BigInt(b*k)/g)],[`NZD=${g}; dijelimo oba člana sa ${g}.`]);}
    if(mode==='share')return many(`Podijeli ${total} KM u razmjeri ${a}:${b}.`,[f('first','Prvi dio',a*(i+10)),f('second','Drugi dio',b*(i+10))],[`Jedan dio=${total}/(${a}+${b})=${i+10}.`,`Dijelovi: ${a*(i+10)} KM i ${b*(i+10)} KM.`]);
    if(mode==='proportion')return one(`Odredi x u proporciji ${a}:${b}=x:${k}.`,S(R(a).mul(k).div(b)),[`Unakrsno: ${b}x=${a}·${k}.`,`x=${S(R(a).mul(k).div(b))}.`]);
    if(mode==='direct')return one(`${b} kg materijala košta ${a*b} KM. Koliko košta ${k} kg pri istoj cijeni po kilogramu?`,a*k,[`Cijena po kg=${a*b}/${b}=${a}.`,`Za ${k} kg: ${a}·${k}=${a*k} KM.`]);
    if(mode==='inverse')return one(`${b} radnika završi posao za ${a} dana. Za koliko dana isti posao završi ${k} jednako efikasnih radnika?`,S(R(a).mul(b).div(k)),[`Broj radnika × vrijeme je stalno: ${b}·${a}=${a*b}.`,`Vrijeme=${a*b}/${k}=${S(R(a).mul(b).div(k))} dana.`]);
    if(mode==='scale'){const denominator=p.scale||10000,cmap=R(i+1).div(10),distance=cmap.mul(denominator).div(100000);return one(`Na karti razmjere 1:${denominator} udaljenost je ${dec(cmap)} cm. Odredi stvarnu udaljenost u km.`,S(distance),[`Stvarno=${S(cmap)}·${denominator}=${S(cmap.mul(denominator))} cm.`,`Pretvori cm u km: podijeli sa 100000, dobije se ${S(distance)} km.`]);}
  };
  handlers.angle=c=>{
    const mode=c.t.practice.mode,{i,l}=c,a=R(10).add(R(i+1).div(4)),b=R(20+l*5),supp=R(180).sub(a),comp=R(90).sub(a);
    if(mode==='classify'){const x=c.t.grade===5?R(i+1):R(i*7+13).div(4),v=N(x),kind=v<90?'oštri':v===90?'pravi':v<180?'tupi':v===180?'ispruženi':v<360?'nekonveksni':'puni';return text(`Klasifikuj ugao ${S(x)}° (oštri, pravi, tupi, ispruženi, nekonveksni ili puni).`,kind,[`Uporedi ${S(x)}° sa 90°, 180° i 360°: ugao je ${kind}.`]);}
    if(mode==='complement')return one(`Odredi ugao komplementan uglu ${S(a)}°.`,S(comp),[`Komplementni uglovi imaju zbir 90°: 90°−${S(a)}°=${S(comp)}°.`]);
    if(mode==='supplement')return one(`Odredi ugao suplementan uglu ${S(a)}°.`,S(supp),[`Suplementni uglovi imaju zbir 180°: 180°−${S(a)}°=${S(supp)}°.`]);
    if(mode==='vertical')return one(`Dvije prave se sijeku. Jedan ugao je ${S(a)}°. Koliki je njemu unakrsni ugao?`,S(a),[`Unakrsni uglovi su jednaki: ${S(a)}°.`]);
    if(mode==='parallel')return many(`Dvije paralelne prave presijeca transverzala. Jedan ugao je ${S(a)}°. Odredi njegov saglasni ugao i unutrašnji ugao s iste strane transverzale.`,[f('equal','Saglasni ugao (°)',S(a)),f('supplement','Unutrašnji s iste strane (°)',S(supp))],[`Saglasni ugao=${S(a)}°.`,`Unutrašnji s iste strane=180°−${S(a)}°=${S(supp)}°.`]);
    if(mode==='triangle')return one(`U trouglu su dva unutrašnja ugla ${S(a)}° i ${S(b)}°. Odredi treći.`,S(R(180).sub(a).sub(b)),[`Zbir unutrašnjih uglova je 180°.`,`Treći=180−${S(a)}−${S(b)}=${S(R(180).sub(a).sub(b))}°.`]);
    if(mode==='exterior')return one(`Dva nesusjedna unutrašnja ugla trougla su ${S(a)}° i ${S(b)}°. Odredi pripadni vanjski ugao kod trećeg vrha.`,S(a.add(b)),[`Vanjski ugao jednak je zbiru nesusjednih unutrašnjih uglova: ${S(a)}+${S(b)}=${S(a.add(b))}°.`]);
    if(mode==='polygon'){const sides=i+l+3;return many(`Konveksni mnogougao ima ${sides} stranica. Odredi zbir unutrašnjih uglova i ugao ako je mnogougao pravilan.`,[f('sum','Zbir uglova (°)',180*(sides-2)),f('angle','Ugao pravilnog mnogougla (°)',S(R(180*(sides-2)).div(sides)))],[`Zbir=(n−2)·180°=${180*(sides-2)}°.`,`Pravilni ugao=zbir/n=${S(R(180*(sides-2)).div(sides))}°.`]);}
    if(mode==='clock'){const total=60+c.i*2+c.l,hour=Math.floor(total/60)%12,minute=total%60,delta=Math.abs(hour*30+minute*.5-minute*6),small=Math.min(delta,360-delta);return one(`Odredi manji ugao između kazaljki sata u ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}.`,small,[`Satna kazaljka: ${hour*30+minute*.5}° od 12; minutna: ${minute*6}°.`,`Razlika=${delta}°; manji ugao=${small}°.`]);}
    if(mode==='parts'){const p=i+2,q=l+5,whole=180;return many(`Ugao od ${whole}° podijeljen je u razmjeri ${p}:${q}. Odredi oba dijela.`,[f('first','Prvi ugao (°)',S(R(whole*p).div(p+q))),f('second','Drugi ugao (°)',S(R(whole*q).div(p+q)))],[`Jedan dio=${whole}/(${p}+${q}).`,`Uglovi su ${S(R(whole*p).div(p+q))}° i ${S(R(whole*q).div(p+q))}°.`]);}
  };
  handlers.triangle=c=>{
    const mode=c.t.practice.mode,{i,l}=c,a=i+5,b=a+l+1,h=R(i+3).div(2),area=R(a).mul(h).div(2),side=a+2;
    if(mode==='classify'){const kind=i%3===0?'jednakostranični':i%3===1?'jednakokraki':'raznostranični',sides=i%3===0?[a,a,a]:i%3===1?[a,a,a+1]:[a,a+1,a+2];return text(`Trougao ima stranice ${sides.join(', ')} cm. Klasifikuj ga prema stranicama.`,kind,[`Uporedi stranice. ${kind==='jednakostranični'?'Sve tri su jednake.':kind==='jednakokraki'?'Dvije su jednake.':'Sve tri su različite.'}`,`Vrsta: ${kind}.`]);}
    if(mode==='inequality'){const d=i%2?2*a+c.l+2:a+2,ok=a+b>d&&a+d>b&&b+d>a;return text(`Mogu li dužine ${a} cm, ${b} cm i ${d} cm biti stranice trougla? Upiši da ili ne.`,ok?'da':'ne',[`Svaki zbir dvije stranice mora biti strogo veći od treće.`,`Provjera: ${a}+${b} ${a+b>d?'>':'≤'} ${d}; odgovor ${ok?'da':'ne'}.`]);}
    if(mode==='perimeter')return one(`Trougao ima stranice ${a} cm, ${b} cm i ${side} cm. Odredi obim.`,a+b+side,[`O=a+b+c=${a}+${b}+${side}=${a+b+side} cm.`]);
    if(mode==='area')return one(`Trougao ima osnovicu ${a} cm i odgovarajuću visinu ${S(h)} cm. Odredi površinu.`,S(area),[`P=ah/2=${a}·${S(h)}/2=${S(area)} cm².`]);
    if(mode==='base')return one(`Površina trougla je ${S(area)} cm², a visina na osnovicu ${S(h)} cm. Odredi osnovicu.`,a,[`a=2P/h=2·${S(area)}/${S(h)}=${a} cm.`]);
    if(mode==='height')return one(`Površina trougla je ${S(area)} cm², a osnovica ${a} cm. Odredi odgovarajuću visinu.`,S(h),[`h=2P/a=2·${S(area)}/${a}=${S(h)} cm.`]);
    if(mode==='midline')return one(`Srednja linija trougla paralelna je stranici dužine ${a} cm. Kolika je dužina srednje linije?`,S(R(a).div(2)),[`Srednja linija je polovina paralelne stranice: ${a}/2=${S(R(a).div(2))} cm.`]);
  };
  handlers.quadrilateral=c=>{
    const mode=c.t.practice.mode,{i,l,p}=c,a=R(i+5),b=R(l+3),h=R(l+2),shape=p.shape||mode;
    if(mode==='midline')return one(`Trapez ima osnovice ${S(a)} cm i ${S(b)} cm. Odredi srednju liniju.`,S(a.add(b).div(2)),[`m=(a+b)/2=(${S(a)}+${S(b)})/2=${S(a.add(b).div(2))} cm.`]);
    if(mode==='unknown'){const area=a.mul(b);return one(`Pravougaonik ima površinu ${S(area)} cm² i jednu stranicu ${S(b)} cm. Odredi drugu stranicu.`,S(a),[`a=P/b=${S(area)}/${S(b)}=${S(a)} cm.`]);}
    let perimeter,area,prompt,steps;
    if(shape==='rectangle'){perimeter=a.add(b).mul(2);area=a.mul(b);prompt=`Pravougaonik ima stranice ${S(a)} cm i ${S(b)} cm.`;steps=[`O=2(a+b)=${S(perimeter)} cm.`,`P=ab=${S(area)} cm².`];}
    if(shape==='square'){perimeter=a.mul(4);area=a.mul(a);prompt=`Kvadrat ima stranicu ${S(a)} cm.`;steps=[`O=4a=${S(perimeter)} cm.`,`P=a²=${S(area)} cm².`];}
    if(shape==='parallelogram'){perimeter=a.add(b).mul(2);area=a.mul(h);prompt=`Paralelogram ima osnovicu ${S(a)} cm, drugu stranicu ${S(b)} cm i visinu na osnovicu ${S(h)} cm.`;steps=[`O=2(a+b)=${S(perimeter)} cm.`,`P=ah=${S(area)} cm².`];}
    if(shape==='rhombus'){const t=R(i+2),d1=t.mul(6),d2=t.mul(8),side=t.mul(5);perimeter=side.mul(4);area=d1.mul(d2).div(2);prompt=`Romb ima dijagonale ${S(d1)} cm i ${S(d2)} cm, te stranicu ${S(side)} cm.`;steps=[`P=d₁d₂/2=${S(area)} cm².`,`O=4a=${S(perimeter)} cm.`];}
    if(shape==='trapezoid'){const base=a.add(6),small=a,leg=R(5),height=R(4);perimeter=base.add(small).add(leg.mul(2));area=base.add(small).mul(height).div(2);prompt=`Jednakokraki trapez ima osnovice ${S(base)} cm i ${S(small)} cm, krake ${S(leg)} cm i visinu ${S(height)} cm.`;steps=[`O=a+b+2c=${S(perimeter)} cm.`,`P=(a+b)h/2=${S(area)} cm².`];}
    if(shape==='kite'){const t=R(i+2),d1=t.mul(8),d2=t.mul(4);area=d1.mul(d2).div(2);prompt=`Deltoid ima međusobno okomite dijagonale ${S(d1)} cm i ${S(d2)} cm.`;return one(prompt+' Odredi površinu.',S(area),[`P=d₁d₂/2=${S(area)} cm².`]);}
    if(!prompt)return;
    if(p.measure==='area'||p.target==='area')return one(prompt+' Odredi površinu.',S(area),steps);
    if(p.measure==='perimeter'||p.target==='perimeter')return one(prompt+' Odredi obim.',S(perimeter),steps);
    return many(prompt+' Odredi obim i površinu.',[f('perimeter','Obim (cm)',S(perimeter)),f('area','Površina (cm²)',S(area))],steps);
  };
  handlers.circle=c=>{
    const mode=c.t.practice.mode,r=R(c.i+10).div(10),diam=r.mul(2),pi=R('3.14'),alpha=R(15+c.i),prompt=`Krug ima poluprečnik ${S(r)} cm. Koristi π = 3,14.`;
    if(mode==='radius')return one(`Prečnik kruga je ${S(diam)} cm. Odredi poluprečnik.`,S(r),[`r=d/2=${S(diam)}/2=${S(r)} cm.`]);
    if(mode==='diameter')return one(prompt+' Odredi prečnik.',S(diam),[`d=2r=2·${S(r)}=${S(diam)} cm.`]);
    if(mode==='perimeter')return one(prompt+' Odredi obim kružnice.',S(pi.mul(r).mul(2)),[`O=2πr=2·3,14·${S(r)}=${S(pi.mul(r).mul(2))} cm.`]);
    if(mode==='area')return one(prompt+' Odredi površinu kruga.',S(pi.mul(r.pow(2))),[`P=πr²=3,14·(${S(r)})²=${S(pi.mul(r.pow(2)))} cm².`]);
    if(mode==='arc')return one(prompt+` Odredi dužinu luka kojem pripada centralni ugao ${S(alpha)}°.`,S(pi.mul(r).mul(2).mul(alpha).div(360)),[`l=(α/360)·2πr=${S(pi.mul(r).mul(2).mul(alpha).div(360))} cm.`]);
    if(mode==='sector')return one(prompt+` Odredi površinu isječka centralnog ugla ${S(alpha)}°.`,S(pi.mul(r.pow(2)).mul(alpha).div(360)),[`Pᵢ=(α/360)·πr²=${S(pi.mul(r.pow(2)).mul(alpha).div(360))} cm².`]);
    if(mode==='ring'){const outer=r.add(c.l);return one(`Kružni prsten ima vanjski poluprečnik ${S(outer)} cm i unutrašnji ${S(r)} cm. Koristi π=3,14. Odredi površinu.`,S(pi.mul(outer.pow(2).sub(r.pow(2)))),[`P=π(R²−r²)=3,14·[(${S(outer)})²−(${S(r)})²]=${S(pi.mul(outer.pow(2).sub(r.pow(2))))} cm².`]);}
  };
  handlers.coordinate=c=>{
    const mode=c.t.practice.mode,x=c.i-101,y=(c.i%19+1)*(c.i%2?-1:1),dx=c.l+2,dy=c.l+3;
    if(mode==='quadrant'){const q=x===0||y===0?'na osi':x>0?(y>0?'I':'IV'):(y>0?'II':'III');return text(`U kojem je kvadrantu tačka A(${x}; ${y})? Upiši I, II, III, IV ili na osi.`,q,[`Predznaci koordinata: x ${x>0?'>':x<0?'<':'='} 0, y ${y>0?'>':'<'} 0; položaj ${q}.`]);}
    if(mode==='reflect'){const axis=c.p.axis||['x','y','origin'][c.l-1],rx=axis==='x'?x:-x,ry=axis==='y'?y:-y;return many(`Preslikaj A(${x}; ${y}) simetrijom ${axis==='x'?'u odnosu na x-os':axis==='y'?'u odnosu na y-os':'u odnosu na koordinatni početak'}.`,[f('x','Nova x-koordinata',rx),f('y','Nova y-koordinata',ry)],[`Promijeni predznak ${axis==='x'?'y-koordinate':axis==='y'?'x-koordinate':'obje koordinate'}.`,`Slika je (${rx}; ${ry}).`]);}
    if(mode==='translate')return many(`Pomjeri A(${x}; ${y}) za vektor (${dx}; ${dy}).`,[f('x','Nova x-koordinata',x+dx),f('y','Nova y-koordinata',y+dy)],[`Saberi odgovarajuće koordinate: (${x}+${dx}; ${y}+${dy})=(${x+dx}; ${y+dy}).`]);
    if(mode==='distance'){const t=c.i+2,x2=x+3*t,y2=y+4*t;return one(`Odredi udaljenost A(${x}; ${y}) i B(${x2}; ${y2}).`,5*t,[`d=√[(${x2}−(${x}))²+(${y2}−(${y}))²]=√[${3*t}²+${4*t}²]=${5*t}.`]);}
    if(mode==='midpoint'){const x2=x+dx,y2=y+dy;return many(`Odredi središte duži A(${x}; ${y}), B(${x2}; ${y2}).`,[f('x','x središta',S(R(x+x2).div(2))),f('y','y središta',S(R(y+y2).div(2)))],[`S=((x₁+x₂)/2;(y₁+y₂)/2)=(${S(R(x+x2).div(2))};${S(R(y+y2).div(2))}).`]);}
  };
  handlers.vector=c=>{
    const mode=c.t.practice.mode,a=c.i-80,b=c.l+3,d=c.l+2,e=c.l-5;
    if(mode==='add'||mode==='subtract'){const sign=mode==='add'?1:-1;return many(`Za u=(${a};${b}) i v=(${d};${e}) odredi u ${sign>0?'+':'−'} v.`,[f('x','x-komponenta',a+sign*d),f('y','y-komponenta',b+sign*e)],[`Računaj po komponentama: (${a+sign*d};${b+sign*e}).`]);}
    if(mode==='scale'){const k=c.l+1;return many(`Odredi ${k}u za u=(${a};${b}).`,[f('x','x-komponenta',a*k),f('y','y-komponenta',b*k)],[`Svaku komponentu pomnoži sa ${k}: (${a*k};${b*k}).`]);}
    if(mode==='magnitude'){const t=c.i+2;return one(`Odredi dužinu vektora u=(${3*t};${4*t}).`,5*t,[`|u|=√[(${3*t})²+(${4*t})²]=${5*t}.`]);}
    if(mode==='parallel'){const k=c.l+2,u=[a,b],v=c.i%2?[a*k,b*k]:[a*k+1,b*k],det=u[0]*v[1]-u[1]*v[0];return text(`Jesu li u=(${u.join(';')}) i v=(${v.join(';')}) paralelni? Upiši da ili ne.`,det===0?'da':'ne',[`Determinanta uₓvᵧ−uᵧvₓ=${det}; paralelnost vrijedi kada je 0.`]);}
    if(mode==='midpoint')return handlers.coordinate({...c,t:{...c.t,practice:{...c.t.practice,mode:'midpoint'}}});
  };
  handlers.power=c=>{
    const mode=c.t.practice.mode,{i,l}=c,a=BigInt(i+2),m=l+1,n=l+2;
    if(mode==='value')return one(`Izračunaj (${i%2?-a:a})^${n}.`,(i%2?-a:a)**BigInt(n),[`Pomnoži osnovu samu sa sobom ${n} puta.`,`Predznak zavisi od parnosti eksponenta: rezultat ${(i%2?-a:a)**BigInt(n)}.`]);
    if(mode==='product')return many(`Pojednostavi ${a}^${m} · ${a}^${n}. Upiši novi eksponent i vrijednost.`,[f('exponent','Eksponent',m+n),f('value','Vrijednost',a**BigInt(m+n))],[`aᵐ·aⁿ=aᵐ⁺ⁿ; ${m}+${n}=${m+n}.`,`${a}^${m+n}=${a**BigInt(m+n)}.`]);
    if(mode==='quotient')return many(`Pojednostavi ${a}^${m+n} : ${a}^${n}. Upiši eksponent i vrijednost.`,[f('exponent','Eksponent',m),f('value','Vrijednost',a**BigInt(m))],[`Pri dijeljenju oduzmi eksponente: ${m+n}−${n}=${m}.`,`${a}^${m}=${a**BigInt(m)}.`]);
    if(mode==='power')return many(`Pojednostavi (${a}^${m})^${n}. Upiši eksponent i vrijednost.`,[f('exponent','Eksponent',m*n),f('value','Vrijednost',a**BigInt(m*n))],[`(aᵐ)ⁿ=aᵐⁿ; ${m}·${n}=${m*n}.`,`${a}^${m*n}=${a**BigInt(m*n)}.`]);
    if(mode==='negative')return one(`Izračunaj ${a}^−${m}.`,S(R(1).div(R(a).pow(m))),[`a⁻ᵐ=1/aᵐ; rezultat je 1/${a**BigInt(m)}.`]);
    if(mode==='zero')return one(`Izračunaj (${a})^0.`,1,[`Svaka nenulta osnova na stepen 0 daje 1. Osnova ${a} nije nula.`]);
    if(mode==='scientific'){const coeff=R(i+101).div(100),e=l+3,value=coeff.mul(10**e);return many(`Broj ${S(value)} napiši u naučnom obliku k·10ⁿ, 1≤k<10. Odredi k i n.`,[f('coefficient','k',S(coeff)),f('exponent','n',e)],[`${S(value)}=${S(coeff)}·10^${e}.`]);}
    if(mode==='scientific-inverse'){const coeff=R(i+101).div(100),e=-(l+1);return one(`Naučni zapis ${dec(coeff)}·10^${e} pretvori u običan broj.`,S(coeff.mul(R(10).pow(e))),[`Negativan eksponent pomjera zarez ${-e} mjesta ulijevo.`,`Rezultat ${S(coeff.mul(R(10).pow(e)))}.`]);}
  };
  handlers.root=c=>{
    const mode=c.t.practice.mode,{i,l}=c,a=i+2,b=l+2;
    if(mode==='value')return one(`Odredi glavni kvadratni korijen broja ${a*a}.`,a,[`${a}²=${a*a}; glavni korijen je nenegativan, pa je √${a*a}=${a}.`]);
    if(mode==='estimate'){const n=a*a+l;return many(`Između kojih susjednih cijelih brojeva je √${n}?`,[f('lower','Donji broj',a),f('upper','Gornji broj',a+1)],[`${a}²=${a*a}<${n}<${(a+1)**2}=(${a+1})².`,`${a}<√${n}<${a+1}.`]);}
    if(mode==='simplify'){const squareFree=[2,3,5][l-1],n=a*a*squareFree;return many(`Pojednostavi √${n} u oblik k√m, gdje m nema kvadratni faktor veći od 1.`,[f('coefficient','k',a),f('radicand','m',squareFree)],[`${n}=${a}²·${squareFree}.`,`√${n}=${a}√${squareFree}.`]);}
    if(mode==='product')return one(`Izračunaj √${a*a} · √${b*b}.`,a*b,[`√${a*a}=${a}; √${b*b}=${b}.`,`Proizvod=${a}·${b}=${a*b}.`]);
    if(mode==='quotient')return one(`Izračunaj √${a*a} : √${b*b}.`,S(R(a).div(b)),[`Korijeni su ${a} i ${b}.`,`Količnik=${a}/${b}=${S(R(a).div(b))}.`]);
  };
  handlers.polynomial=c=>{
    const mode=c.t.practice.mode,{i,l}=c,a=i+2,b=l+3,d=l+1,e=l+4,x=i-80;
    if(mode==='value'){const value=BigInt(a)*BigInt(x)**2n+BigInt(b)*BigInt(x)+BigInt(d);return one(`Za P(x)=${a}x²+${b}x+${d} odredi P(${x}).`,value,[`(${x})²=${x*x}.`,`P(${x})=${a}·${x*x}+${b}·(${x})+${d}=${value}.`]);}
    if(mode==='collect')return many(`Sredi polinom ${a}x²+${b}x+${d}x²−${e}x+${i}. Unesi koeficijente uz x², x i slobodni član.`,[f('quadratic','Uz x²',a+d),f('linear','Uz x',b-e),f('constant','Slobodni član',i)],[`Saberi slične članove: (${a}+${d})x²+(${b}−${e})x+${i}.`,`Rezultat: ${a+d}x² ${signed(b-e)}x+${i}.`]);
    if(mode==='add'||mode==='subtract'){const s=mode==='add'?1:-1;return many(`Odredi (${a}x²+${b}x+${i}) ${s>0?'+':'−'} (${d}x²+${e}x+${l}). Unesi koeficijente uz x², x i konstantu.`,[f('quadratic','Uz x²',a+s*d),f('linear','Uz x',b+s*e),f('constant','Konstanta',i+s*l)],[`Ukloni zagrade ${s<0?'uz promjenu predznaka članova drugog polinoma':'bez promjene predznaka'}.`,`Saberi koeficijente istih stepena: (${a+s*d}, ${b+s*e}, ${i+s*l}).`]);}
    if(mode==='monomial')return many(`Pomnoži (${a}x^${l+1})·(${b}x^${l+2}). Odredi koeficijent i eksponent.`,[f('coefficient','Koeficijent',a*b),f('exponent','Eksponent',2*l+3)],[`Koeficijenti: ${a}·${b}=${a*b}.`,`Eksponenti se sabiraju: ${l+1}+${l+2}=${2*l+3}.`]);
    if(mode==='product')return many(`Razvij (${a}x+${b})(${d}x+${e}). Unesi koeficijente uz x², x i konstantu.`,[f('quadratic','Uz x²',a*d),f('linear','Uz x',a*e+b*d),f('constant','Konstanta',b*e)],[`Distributivno: ${a*d}x²+(${a*e}+${b*d})x+${b*e}.`,`Koeficijenti su ${a*d}, ${a*e+b*d}, ${b*e}.`]);
    if(mode==='square')return many(`Razvij (${a}x+${b})². Unesi koeficijente uz x², x i konstantu.`,[f('quadratic','Uz x²',a*a),f('linear','Uz x',2*a*b),f('constant','Konstanta',b*b)],[`(u+v)²=u²+2uv+v².`,`Rezultat ${a*a}x²+${2*a*b}x+${b*b}.`]);
    if(mode==='difference')return many(`Rastavi ${a*a}x²−${b*b} kao (px−q)(px+q), uz p,q>0. Odredi p i q.`,[f('p','p',a),f('q','q',b)],[`u²−v²=(u−v)(u+v).`,`Ovdje u=${a}x, v=${b}; p=${a}, q=${b}.`]);
    if(mode==='factor')return many(`Rastavi ${a*d}x²+${a*b}x izdvajanjem faktora ${a}x, u obliku ${a}x(px+q). Odredi p i q.`,[f('p','p',d),f('q','q',b)],[`Podijeli članove sa ${a}x: ${a*d}x²/(${a}x)=${d}x i ${a*b}x/(${a}x)=${b}.`,`Rastav ${a}x(${d}x+${b}).`]);
  };
  handlers.equation=c=>{
    const mode=c.t.practice.mode,{i,l}=c,x=R(i-85).div(l===3?3:1),a=l+2,b=i%17-8,r=x.mul(a).add(b),d=l+1;
    if(mode==='simple')return one(`Riješi jednačinu ${a}x ${signed(b)} = ${S(r)}.`,S(x),[`Oduzmi ${b} s obje strane: ${a}x=${S(r.sub(b))}.`,`Podijeli sa ${a}: x=${S(x)}.`]);
    if(mode==='both'){const right=x.mul(a-d).add(b);return one(`Riješi ${a}x ${signed(b)} = ${d}x ${signed(right)}.`,S(x),[`Prebaci x-članove lijevo: (${a}−${d})x=${S(right.sub(b))}.`,`x=${S(x)}.`]);}
    if(mode==='parentheses'){const right=x.add(b).mul(a);return one(`Riješi ${a}(x ${signed(b)}) = ${S(right)}.`,S(x),[`Podijeli sa ${a}: x ${signed(b)}=${S(right.div(a))}.`,`Izoluj x: ${S(x)}.`]);}
    if(mode==='fraction'){const right=x.div(a).add(R(b).div(d));return one(`Riješi x/${a} ${signed(R(b).div(d))} = ${S(right)}.`,S(x),[`Oduzmi ${S(R(b).div(d))}: x/${a}=${S(right.sub(R(b).div(d)))}.`,`Pomnoži sa ${a}: x=${S(x)}.`]);}
    if(mode==='word'){const amount=i+10,total=amount*a+b;return one(`Broj pomnožen sa ${a}, a zatim ${b<0?'umanjen za '+(-b):'uvećan za '+b}, daje ${total}. Odredi broj.`,amount,[`${a}x ${signed(b)}=${total}.`,`x=(${total}−(${b}))/${a}=${amount}.`]);}
    if(mode==='identity')return text(`Odredi broj rješenja jednačine ${a}(x+${i+1})=${a}x+${a*(i+1)}. Upiši jedno, nijedno ili beskonačno.`, 'beskonačno',[`Razvijanjem lijeve strane dobije se ${a}x+${a*(i+1)}.`,`Obje strane su identične za svaki realni x: beskonačno mnogo rješenja.`]);
    if(mode==='contradiction')return text(`Odredi broj rješenja ${a}x+${i+1}=${a}x+${i+2}. Upiši jedno, nijedno ili beskonačno.`, 'nijedno',[`Oduzimanjem ${a}x ostaje ${i+1}=${i+2}, što je netačno.`,`Nema rješenja.`]);
  };
  handlers.inequality=c=>{
    const mode=c.t.practice.mode,{i,l}=c,x=R(i-85).div(l===3?3:1),a=mode==='negative'?-(l+2):l+2,b=i%17-8,right=x.mul(a).add(b);
    if(mode==='simple'||mode==='negative'){const relation=a<0?'>':'<';return text(`Riješi nejednačinu ${a}x ${signed(b)} < ${S(right)}. Upiši u obliku x ${relation} broj.`,`x ${relation} ${S(x)}`,[`Oduzmi ${b}: ${a}x<${S(right.sub(b))}.`,`Podijeli sa ${a}${a<0?' i obrni znak nejednakosti':''}: x ${relation} ${S(x)}.`]);}
    if(mode==='compound'){const lower=x,upper=x.add(l+2);return many(`Riješi dvostruku nejednačinu ${S(lower.mul(a).add(b))} ≤ ${a}x ${signed(b)} < ${S(upper.mul(a).add(b))}. Upiši donju i gornju granicu.`,[f('lower','Donja uključena granica',S(lower)),f('upper','Gornja isključena granica',S(upper))],[`Oduzmi ${b} od sva tri dijela, pa podijeli pozitivnim brojem ${a}.`,`Rješenje: ${S(lower)} ≤ x < ${S(upper)}.`]);}
    if(mode==='check'){const candidate=x.add(i%3-1),ok=N(candidate)<N(x);return text(`Provjeri je li x=${S(candidate)} rješenje nejednačine ${a}x ${signed(b)} < ${S(right)}. Upiši da ili ne.`,ok?'da':'ne',[`Lijeva strana=${S(candidate.mul(a).add(b))}.`,`Poređenje sa ${S(right)}: ${ok?'vrijedi':'ne vrijedi'}.`]);}
    if(mode==='word'){const budget=(i+10)*a+b;return one(`Učenik ima ${budget} KM. Fiksni trošak je ${b<0?0:b} KM, a jedna sveska košta ${a} KM. Koliko najviše cijelih svezaka može kupiti?`,Math.floor((budget-Math.max(0,b))/a),[`Za n svezaka vrijedi ${a}n+${Math.max(0,b)}≤${budget}.`,`n≤${S(R(budget-Math.max(0,b)).div(a))}; najveći cijeli n=${Math.floor((budget-Math.max(0,b))/a)}.`]);}
  };
  handlers.function=c=>{
    const mode=c.t.practice.mode,{i,l}=c,k=R(i+2).div(l===3?2:1),n=R(i%19-9),x=R(i-85).div(l===3?3:1),y=k.mul(x).add(n),line=`${S(k)}x ${signed(n)}`;
    if(mode==='value')return one(`Za funkciju y=${line} odredi y kada je x=${S(x)}.`,S(y),[`Uvrsti x: y=${S(k)}·(${S(x)}) ${signed(n)}=${S(y)}.`]);
    if(mode==='zero')return one(`Odredi nulu funkcije y=${line}.`,S(n.neg().div(k)),[`Postavi y=0: ${S(k)}x=${S(n.neg())}.`,`x=${S(n.neg().div(k))}.`]);
    if(mode==='slope'){const dx=l+2,y2=y.add(k.mul(dx));return one(`Prava prolazi kroz A(${S(x)};${S(y)}) i B(${S(x.add(dx))};${S(y2)}). Odredi koeficijent smjera.`,S(k),[`k=(y₂−y₁)/(x₂−x₁)=${S(y2.sub(y))}/${dx}=${S(k)}.`]);}
    if(mode==='intercept')return one(`Prava ima koeficijent k=${S(k)} i prolazi kroz A(${S(x)};${S(y)}). Odredi slobodni član n.`,S(n),[`n=y−kx=${S(y)}−${S(k)}·(${S(x)})=${S(n)}.`]);
    if(mode==='points'){const x2=x.add(l+2),y2=k.mul(x2).add(n);return many(`Odredi k i n funkcije y=kx+n kroz A(${S(x)};${S(y)}) i B(${S(x2)};${S(y2)}).`,[f('k','k',S(k)),f('n','n',S(n))],[`k=(y₂−y₁)/(x₂−x₁)=${S(k)}.`,`n=y₁−kx₁=${S(n)}.`]);}
    if(mode==='intersection'){const k2=k.add(l+2),n2=n.sub(x.mul(l+2));return many(`Odredi presjek y=${line} i y=${S(k2)}x ${signed(n2)}.`,[f('x','x presjeka',S(x)),f('y','y presjeka',S(y))],[`Izjednači funkcije: (${S(k)}−${S(k2)})x=${S(n2.sub(n))}.`,`x=${S(x)}; y=${S(y)}.`]);}
    if(mode==='inverse'){const product=R((i+2)*(l+3)),x2=l+5;return one(`Za funkciju y=${S(product)}/x odredi y kada je x=${x2}.`,S(product.div(x2)),[`y=k/x=${S(product)}/${x2}=${S(product.div(x2))}.`]);}
    if(mode==='monotonic'){const slope=i%2?k.neg():k;return text(`Je li funkcija y=${S(slope)}x ${signed(n)} rastuća ili opadajuća?`,N(slope)>0?'rastuća':'opadajuća',[`Koeficijent smjera je ${S(slope)} ${N(slope)>0?'>':'<'} 0, pa je funkcija ${N(slope)>0?'rastuća':'opadajuća'}.`]);}
    if(mode==='parameter')return one(`Za koji parametar m prava y=mx ${signed(n)} prolazi kroz A(${i+2};${S(k.mul(i+2).add(n))})?`,S(k),[`Uvrsti tačku: ${S(k.mul(i+2).add(n))}=m·${i+2} ${signed(n)}.`,`m=${S(k)}.`]);
  };
  handlers.system=c=>{
    const mode=c.t.practice.mode,{i,l}=c,x=R(i-85).div(l===3?3:1),y=R(i%13-6),a=l+2,b=l+1,d=l+3,e=l+2,u=x.mul(a).add(y.mul(b)),v=x.mul(d).add(y.mul(e)),equations=`${a}x+${b}y=${S(u)}; ${d}x+${e}y=${S(v)}`;
    if(mode==='substitution'||mode==='elimination')return many(`Riješi sistem metodom ${mode==='substitution'?'zamjene':'suprotnih koeficijenata'}: ${equations}.`,[f('x','x',S(x)),f('y','y',S(y))],mode==='substitution'?[`Iz prve jednačine: y=(${S(u)}−${a}x)/${b}.`,`Uvrsti u drugu jednačinu i riješi: x=${S(x)}.`,`Vrati x u prvu: y=${S(y)}.`]:[`Prvu jednačinu pomnoži sa ${e}, drugu sa ${b} i oduzmi.`,`${a*e-b*d}x=${S(u.mul(e).sub(v.mul(b)))}; x=${S(x)}.`,`Uvrštavanjem: y=${S(y)}.`]);
    if(mode==='classification'){const type=i%3,mult=l+2,second=type===0?`${d}x+${e}y=${S(v)}`:`${a*mult}x+${b*mult}y=${S(u.mul(mult).add(type===2?1:0))}`,kind=type===0?'jedno':type===1?'beskonačno':'nijedno';return text(`Odredi broj rješenja sistema ${a}x+${b}y=${S(u)}; ${second}. Upiši jedno, nijedno ili beskonačno.`,kind,[type===0?`Determinanta=${a*e-b*d}, različita od nule.`:type===1?`Druga jednačina je prva pomnožena sa ${mult}.`:`Lijeva strana druge je višekratnik prve, a desna nije.`,`Broj rješenja: ${kind}.`]);}
    if(mode==='word'){const children=i+10,adults=l+5,total=children+adults,priceChildren=3,priceAdults=5,revenue=priceChildren*children+priceAdults*adults;return many(`Prodato je ${total} ulaznica. Dječija košta ${priceChildren} KM, a odrasla ${priceAdults} KM. Ukupan prihod je ${revenue} KM. Odredi broj dječijih i odraslih ulaznica.`,[f('children','Dječije',children),f('adults','Odrasle',adults)],[`x+y=${total}; ${priceChildren}x+${priceAdults}y=${revenue}.`,`Rješavanjem: x=${children}, y=${adults}.`]);}
    if(mode==='parameter')return one(`Za koju vrijednost m sistem ${a}x+${b}y=${S(u)}; ${a*(l+2)}x+${b*(l+2)}y=m ima beskonačno mnogo rješenja?`,S(u.mul(l+2)),[`Druga lijeva strana je ${l+2} puta prva.`,`Desna mora biti isti višekratnik: m=${S(u)}·${l+2}=${S(u.mul(l+2))}.`]);
  };
  handlers.pythagoras=c=>{
    const mode=c.t.practice.mode,t=R(c.i+2).div(c.l===3?2:1),a=t.mul(3),b=t.mul(4),hyp=t.mul(5);
    if(mode==='hypotenuse')return one(`Pravougli trougao ima katete ${S(a)} cm i ${S(b)} cm. Odredi hipotenuzu.`,S(hyp),[`c²=a²+b²=${S(a.pow(2))}+${S(b.pow(2))}=${S(hyp.pow(2))}.`,`c=${S(hyp)} cm.`]);
    if(mode==='leg')return one(`Hipotenuza je ${S(hyp)} cm, a jedna kateta ${S(a)} cm. Odredi drugu katetu.`,S(b),[`b²=c²−a²=${S(hyp.pow(2))}−${S(a.pow(2))}=${S(b.pow(2))}.`,`b=${S(b)} cm.`]);
    if(mode==='rectangle')return one(`Pravougaonik ima stranice ${S(a)} cm i ${S(b)} cm. Odredi dijagonalu.`,S(hyp),[`Dijagonala je hipotenuza: d=√(a²+b²)=${S(hyp)} cm.`]);
    if(mode==='triangle')return text(`Je li trougao sa stranicama ${S(a)} cm, ${S(b)} cm i ${S(hyp)} cm pravougli? Upiši da ili ne.`, 'da',[`${S(a)}²+${S(b)}²=${S(hyp)}².`,`Prema obratu Pitagorine teoreme trougao je pravougli.`]);
    if(mode==='height')return one(`Jednakokraki trougao ima krake ${S(hyp)} cm i osnovicu ${S(a.mul(2))} cm. Odredi visinu na osnovicu.`,S(b),[`Visina prepolavlja osnovicu: polovina=${S(a)} cm.`,`h²=${S(hyp.pow(2))}−${S(a.pow(2))}=${S(b.pow(2))}; h=${S(b)} cm.`]);
    if(mode==='distance')return handlers.coordinate({...c,t:{...c.t,practice:{...c.t.practice,mode:'distance'}}});
  };
  handlers.similarity=c=>{
    const mode=c.t.practice.mode,{i,l}=c,k=R(l+1).div(l===3?2:1),a=R(i+3),b=R(l+5),area=a.mul(b);
    if(mode==='scale')return one(`Odgovarajuće stranice prvog i drugog sličnog trougla su ${S(a)} cm i ${S(a.mul(k))} cm. Odredi faktor od prvog prema drugom.`,S(k),[`k=a₂/a₁=${S(a.mul(k))}/${S(a)}=${S(k)}.`]);
    if(mode==='side')return one(`Faktor sličnosti od prvog prema drugom trouglu je ${S(k)}. Stranica prvog je ${S(a)} cm. Odredi odgovarajuću stranicu drugog.`,S(a.mul(k)),[`a₂=k·a₁=${S(k)}·${S(a)}=${S(a.mul(k))} cm.`]);
    if(mode==='perimeter')return one(`Slični mnogouglovi imaju faktor ${S(k)} od prvog prema drugom. Obim prvog je ${S(a)} cm. Odredi obim drugog.`,S(a.mul(k)),[`Obimi se mijenjaju faktorom k: O₂=kO₁=${S(a.mul(k))} cm.`]);
    if(mode==='area')return one(`Slični mnogouglovi imaju faktor ${S(k)} od prvog prema drugom. Površina prvog je ${S(area)} cm². Odredi površinu drugog.`,S(area.mul(k.pow(2))),[`Površine se mijenjaju faktorom k²: P₂=${S(area)}·(${S(k)})²=${S(area.mul(k.pow(2)))} cm².`]);
    if(mode==='thales')return one(`U trouglu ABC duž DE je paralelna BC, D∈AB i E∈AC. AD=${S(a)} cm, AB=${S(a.mul(k.add(1)))} cm, AE=${S(b)} cm. Odredi AC.`,S(b.mul(k.add(1))),[`AD/AB=AE/AC.`,`AC=AB·AE/AD=${S(a.mul(k.add(1)))}·${S(b)}/${S(a)}=${S(b.mul(k.add(1)))} cm.`]);
  };
  handlers.solid=c=>{
    const mode=c.t.practice.mode,{i,l,p}=c,a=R(i+10).div(5),b=R(l+3),h=R(l+4),pi=R('3.14');
    if(mode==='inverse'){const shape=p.shape||'cuboid',measure=p.measure||'height';if(shape==='cube'){const volume=a.pow(3),surface=a.pow(2).mul(6);return one(`Kocka ima ${measure==='surface'?'površinu '+S(surface)+' cm²':'zapreminu '+S(volume)+' cm³'}. Odredi ivicu.`,S(a),[measure==='surface'?`a²=P/6=${S(a.pow(2))}; a=${S(a)} cm.`:`a³=V=${S(volume)}; a=${S(a)} cm.`]);}const base=a.mul(b),volume=base.mul(h);return one(`Prizma ima površinu osnove ${S(base)} cm² i zapreminu ${S(volume)} cm³. Odredi visinu.`,S(h),[`h=V/B=${S(volume)}/${S(base)}=${S(h)} cm.`]);}
    if(mode==='diagonal'){const t=R(i+2),aa=t.mul(2),bb=t.mul(3),cc=t.mul(6),diag=t.mul(7);return one(`Kvadar ima ivice ${S(aa)} cm, ${S(bb)} cm i ${S(cc)} cm. Odredi prostornu dijagonalu.`,S(diag),[`d=√(a²+b²+c²)=√(${S(aa.pow(2).add(bb.pow(2)).add(cc.pow(2)))})=${S(diag)} cm.`]);}
    let P,V,prompt,steps;
    if(mode==='cube'){P=a.pow(2).mul(6);V=a.pow(3);prompt=`Kocka ima ivicu ${S(a)} cm.`;steps=[`P=6a²=${S(P)} cm².`,`V=a³=${S(V)} cm³.`];}
    if(mode==='cuboid'){P=a.mul(b).add(a.mul(h)).add(b.mul(h)).mul(2);V=a.mul(b).mul(h);prompt=`Kvadar ima ivice ${S(a)} cm, ${S(b)} cm i ${S(h)} cm.`;steps=[`P=2(ab+ac+bc)=${S(P)} cm².`,`V=abc=${S(V)} cm³.`];}
    if(mode==='prism'){const base=a.pow(2).mul(6),perimeter=a.mul(12);P=base.mul(2).add(perimeter.mul(h));V=base.mul(h);prompt=`Prava prizma ima pravouglu trougaonu osnovu sa katetama ${S(a.mul(3))} cm i ${S(a.mul(4))} cm i hipotenuzom ${S(a.mul(5))} cm. Visina prizme je ${S(h)} cm.`;steps=[`B=ab/2=${S(base)} cm²; O=${S(perimeter)} cm.`,`P=2B+Oh=${S(P)} cm².`,`V=Bh=${S(V)} cm³.`];}
    if(mode==='pyramid'){const side=a.mul(6),height=a.mul(4),apothem=a.mul(5);P=side.pow(2).add(side.mul(apothem).mul(2));V=side.pow(2).mul(height).div(3);prompt=`Pravilna četverostrana piramida ima osnovnu ivicu ${S(side)} cm, visinu ${S(height)} cm i apotemu ${S(apothem)} cm.`;steps=[`B=a²=${S(side.pow(2))} cm²; M=2as=${S(side.mul(apothem).mul(2))} cm².`,`P=B+M=${S(P)} cm².`,`V=Bh/3=${S(V)} cm³.`];}
    if(mode==='cylinder'){P=pi.mul(a).mul(a.add(h)).mul(2);V=pi.mul(a.pow(2)).mul(h);prompt=`Valjak ima poluprečnik ${S(a)} cm i visinu ${S(h)} cm. Koristi π=3,14.`;steps=[`P=2πr(r+h)=${S(P)} cm².`,`V=πr²h=${S(V)} cm³.`];}
    if(mode==='cone'){const radius=a.mul(3),height=a.mul(4),slant=a.mul(5);P=pi.mul(radius).mul(radius.add(slant));V=pi.mul(radius.pow(2)).mul(height).div(3);prompt=`Kupa ima poluprečnik ${S(radius)} cm, visinu ${S(height)} cm i izvodnicu ${S(slant)} cm. Koristi π=3,14.`;steps=[`P=πr(r+s)=${S(P)} cm².`,`V=πr²h/3=${S(V)} cm³.`];}
    if(mode==='sphere'){P=pi.mul(a.pow(2)).mul(4);V=pi.mul(a.pow(3)).mul(4).div(3);prompt=`Lopta ima poluprečnik ${S(a)} cm. Koristi π=3,14.`;steps=[`P=4πr²=${S(P)} cm².`,`V=4πr³/3=${S(V)} cm³.`];}
    if(!prompt)return;
    if(p.measure==='surface'||p.target==='surface')return one(prompt+' Odredi ukupnu površinu.',S(P),steps);
    if(p.measure==='volume'||p.target==='volume')return one(prompt+' Odredi zapreminu.',S(V),steps);
    return many(prompt+' Odredi ukupnu površinu i zapreminu.',[f('surface','Ukupna površina (cm²)',S(P)),f('volume','Zapremina (cm³)',S(V))],steps);
  };
  handlers.spatial=c=>{
    const mode=c.t.practice.mode,{i,l}=c,a=R(i+10).div(2);
    if(mode==='diedar'||mode==='normal')return one(`Ravan okomita na ivicu diedra siječe njegove strane po polupravama koje zaklapaju ugao ${S(a)}°. Odredi mjeru diedra.`,S(a),[`Mjera diedra jednaka je uglu njegovog normalnog presjeka: ${S(a)}°.`]);
    if(mode==='supplement')return one(`Diedar ima mjeru ${S(a)}°. Odredi susjedni diedar kada njihove nezajedničke strane čine jednu ravan.`,S(R(180).sub(a)),[`Zbir tih diedara je 180°: β=180°−${S(a)}°=${S(R(180).sub(a))}°.`]);
    if(mode==='ratio'){const p=i+2,q=l+5;return many(`Susjedni diedri imaju nezajedničke strane u istoj ravni i odnos ${p}:${q}. Odredi obje mjere.`,[f('first','Prvi diedar (°)',S(R(180*p).div(p+q))),f('second','Drugi diedar (°)',S(R(180*q).div(p+q)))],[`Zbir je 180°.`,`Mjere su 180·${p}/(${p}+${q})=${S(R(180*p).div(p+q))}° i ${S(R(180*q).div(p+q))}°.`]);}
    if(mode==='planes'){const kind=i%3===0?'paralelne':i%3===1?'okomite':'sijeku se',prompt=i%3===0?`Dvije različite ravni nemaju zajedničkih tačaka. Razmak im je ${i+1} cm.`:i%3===1?`Normalni presjek dvije ravni daje ugao 90°, a dio njihove zajedničke prave dug je ${i+1} cm.`:`Dvije ravni imaju zajedničku pravu i diedar ${S(a)}°.`;return text(prompt+' Odredi odnos ravni: paralelne, okomite ili sijeku se.',kind,[`Iz zadanog svojstva slijedi da su ravni ${kind}.`]);}
  };
  handlers.statistics=c=>{
    const mode=c.t.practice.mode,{i,l}=c,base=i+l*10,data=[base+7,base,base+2,base+2,base+5],sorted=[...data].sort((a,b)=>a-b),sum=data.reduce((a,b)=>a+b,0);
    if(mode==='mean')return one(`Odredi aritmetičku sredinu: ${data.join('; ')}.`,S(R(sum).div(data.length)),[`Zbir=${sum}, broj podataka=${data.length}.`,`Sredina=${sum}/${data.length}=${S(R(sum).div(data.length))}.`]);
    if(mode==='median')return one(`Odredi medijan: ${data.join('; ')}.`,sorted[2],[`Poredani podaci: ${sorted.join('; ')}.`,`Srednji, treći podatak je ${sorted[2]}.`]);
    if(mode==='mode')return one(`Odredi mod: ${data.join('; ')}.`,base+2,[`${base+2} pojavljuje se dva puta, a ostali jednom.`,`Mod je ${base+2}.`]);
    if(mode==='range')return one(`Odredi raspon: ${data.join('; ')}.`,7,[`Maksimum=${base+7}, minimum=${base}.`,`Raspon=${base+7}−${base}=7.`]);
    if(mode==='weighted'){const value1=i+2,value2=l+3,w1=l+2,w2=l+1,mean=R(value1*w1+value2*w2).div(w1+w2);return one(`Vrijednost ${value1} ima frekvenciju ${w1}, a vrijednost ${value2} frekvenciju ${w2}. Odredi ponderisanu sredinu.`,S(mean),[`Sredina=(${value1}·${w1}+${value2}·${w2})/(${w1}+${w2})=${S(mean)}.`]);}
    if(mode==='frequency'){const target=base+2;return many(`U nizu ${data.join('; ')} odredi apsolutnu i relativnu frekvenciju vrijednosti ${target}. Relativnu izrazi razlomkom.`,[f('absolute','Apsolutna frekvencija',2),f('relative','Relativna frekvencija','2/5')],[`${target} se pojavljuje dva puta među pet podataka.`,`Apsolutna=2; relativna=2/5.`]);}
  };
  handlers.probability=c=>{
    const mode=c.t.practice.mode,{i,l}=c,red=i+2,blue=l+5,total=red+blue,p=R(red).div(total),q=R(blue).div(total),prefix=`Vrećica sadrži ${red} crvenih i ${blue} plavih kuglica. Svaka ima jednaku šansu izbora.`;
    if(mode==='simple')return one(prefix+' Odredi P(crvena).',S(p),[`P=povoljni/svi=${red}/${total}=${S(p)}.`]);
    if(mode==='complement')return one(prefix+' Odredi P(nije crvena).',S(q),[`P(nije crvena)=1−P(crvena)=1−${S(p)}=${S(q)}.`]);
    if(mode==='independent')return one(prefix+' Izvlačimo kuglicu, vraćamo je i ponovo izvlačimo. Odredi P(obje crvene).',S(p.pow(2)),[`Izbori su nezavisni zbog vraćanja.`,`P=${S(p)}·${S(p)}=${S(p.pow(2))}.`]);
    if(mode==='union'){const green=l+2,n=total+green;return one(`U vrećici je ${red} crvenih, ${blue} plavih i ${green} zelenih kuglica. Odredi P(crvena ili plava) pri jednom izvlačenju.`,S(R(red+blue).div(n)),[`Događaji su disjunktni.`,`P=(${red}+${blue})/${n}=${S(R(red+blue).div(n))}.`]);}
    if(mode==='without-replacement')return one(prefix+' Izvlačimo dvije kuglice bez vraćanja. Odredi P(obje crvene).',S(p.mul(R(red-1).div(total-1))),[`Prva crvena: ${red}/${total}.`,`Poslije nje ostaje ${red-1} crvenih od ${total-1}; P=${S(p.mul(R(red-1).div(total-1)))}.`]);
    if(mode==='counting'){const shirts=i+2,pants=l+2,shoes=l+3;return one(`Na raspolaganju su ${shirts} majice, ${pants} hlače i ${shoes} para obuće. Koliko odjevnih kombinacija sa po jednim od svakog možeš napraviti?`,shirts*pants*shoes,[`Princip proizvoda: ${shirts}·${pants}·${shoes}=${shirts*pants*shoes}.`]);}
  };
  // Catalog parameters select the taught operation; they are not decorative tags.
  const baseHandlers={...handlers};
  handlers.numeral=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,n=1234567+i*379+l*100003;
    if(mode==='expand'){const out=String(n).split('').map((d,j)=>Number(d)*10**(String(n).length-j-1)).filter(x=>x!==0);return list(`Rastavi ${n} na nenulte mjesne sabirke, od najvećeg do najmanjeg.`,out,[`${n}=${out.join('+')}.`],undefined,true);}
    if(mode==='compose'){const parts=String(n).split('').map((d,j)=>Number(d)*10**(String(n).length-j-1)).filter(x=>x);return one(`Sastavi broj iz mjesnih vrijednosti ${parts.join(' + ')}.`,n,[`Sabiranjem zadatih mjesnih vrijednosti dobije se ${n}.`]);}
    if(mode==='compare'&&p.digitsDifferent){const a=10000+i*13,b=100000+i*31;return text(`Uporedi ${i%2?a:b} i ${i%2?b:a}. Upiši <, > ili =.`,i%2?'<':'>',[`Petocifreni prirodni broj ${a} manji je od šestocifrenog ${b}.`]);}
    if(mode==='interval'&&p.inclusive===false){const lo=1000+i*7,hi=lo+l+4,out=Array.from({length:l+3},(_,j)=>lo+j+1);return list(`Napiši prirodne brojeve strogo između ${lo} i ${hi}. Granice ne uključi.`,out,[`Brojevi su ${out.join('; ')}.`],undefined,true);}
    return baseHandlers.numeral(c);
  };
  handlers.arithmetic=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode;let a=BigInt(101+i*17)*BigInt(p.scale||10**(l-1)),b=BigInt(c.b),d=BigInt(l+2);
    const digits=(code,offset)=>{let out=0n,power=1n;for(let j=0;j<4;j++){out+=BigInt(code%5+offset)*power;code=Math.floor(code/5);power*=10n;}return out;};
    if(p.carry===false){a=digits(i,1);b=2222n;}
    if(p.carry==='one'){a=10000n+BigInt(i)*100n+18n;b=25n;}
    if(p.carry==='multiple'){a=1000n+BigInt(i)*1000n+888n;b=777n;}
    if(p.borrow===false){a=digits(i,4);b=1234n;}
    if(p.borrow===true){a=10000n+BigInt(i)*100n+12n;b=27n;}
    if(p.zeros){a=BigInt(i+1)*10000n;b=1234n;}
    if(p.factorDigits)b=BigInt(10**(p.factorDigits-1)+i%(9*10**(p.factorDigits-1)));
    if(p.divisorDigits)b=BigInt(10**(p.divisorDigits-1)+i%(9*10**(p.divisorDigits-1)));
    if(p.powerTen)b=BigInt(p.powerTen);
    if(p.goal==='commutative')return many(`Dopuni ${a} ${mode==='multiply'?'·':'+'} ${b} = ${b} ${mode==='multiply'?'·':'+'} □ i izračunaj vrijednost.`,[f('missing','Broj u praznom polju',a),f('value','Vrijednost',mode==='multiply'?a*b:a+b)],[`Zamjena redoslijeda ${mode==='multiply'?'faktora':'sabiraka'} ne mijenja rezultat.`,`□=${a}; vrijednost=${mode==='multiply'?a*b:a+b}.`]);
    if(p.goal==='associative'){const value=mode==='multiply'?a*b*d:a+b+d;return one(`Izračunaj (${a} ${mode==='multiply'?'·':'+'} ${b}) ${mode==='multiply'?'·':'+'} ${d} koristeći drugo grupisanje.`,value,[`Asocijativnost: ${a} ${mode==='multiply'?'·':'+'} (${b} ${mode==='multiply'?'·':'+'} ${d}).`,`Vrijednost=${value}.`]);}
    if(mode==='expression'&&p.pattern){const t=p.pattern;let expression,value,steps;if(t==='distribute-add'){expression=`${a}·(${b}+${d})`;value=a*(b+d);steps=[`Distributivno: ${a}·${b}+${a}·${d}=${a*b}+${a*d}=${value}.`];}else if(t==='distribute-subtract'){expression=`${a}·(${b+d}−${d})`;value=a*b;steps=[`Distributivno: ${a}·${b+d}−${a}·${d}=${a*(b+d)}−${a*d}=${value}.`];}else if(t==='precedence'){expression=`${a+b*d}−${b}·${d}+${a*d}:${d}`;value=a*2n;steps=[`Prvo množenje ${b}·${d}=${b*d} i dijeljenje ${a*d}:${d}=${a}.`,`Zatim ${a+b*d}−${b*d}+${a}=${value}.`];}else if(t==='nested'){expression=`${d}·[${a}+(${b*d}−${d}):${d}]`;value=d*(a+b-1n);steps=[`Unutrašnja zagrada: ${b*d}−${d}=${(b-1n)*d}.`,`Dijeljenje daje ${b-1n}; ukupno ${value}.`];}else if(t==='identity'){expression=`${a}·1+0·${b}−0`;value=a;steps=[`Množenje jedinicom čuva broj; množenje nulom daje nulu.`,`Rezultat je ${a}.`];}else{expression=`(${a}−${b})·${d}`;value=(a-b)*d;steps=[`Zagrada: ${a}−${b}=${a-b}.`,`Proizvod: ${a-b}·${d}=${value}.`];}return one(`Izračunaj ${expression}.`,value,steps);}
    if(mode==='estimate'&&p.operation==='multiply'){const place=BigInt(p.place||10),left=a,right=b+BigInt(i)*3n,ra=(left+place/2n)/place*place,rb=(right+place/2n)/place*place;return one(`Procijeni proizvod ${left}·${right}: oba faktora zaokruži na ${place} i zatim pomnoži.`,ra*rb,[`Zaokruženi faktori su ${ra} i ${rb}.`,`Procijenjeni proizvod=${ra}·${rb}=${ra*rb}.`]);}
    if(mode==='add'||mode==='subtract'||mode==='multiply'||mode==='divide'){const terms=p.terms===3,borrow=p.borrow!==undefined||p.zeros,left=mode==='divide'?a*b:a,value=mode==='add'?a+b+(terms?d:0n):mode==='subtract'?(borrow?a-b:a):mode==='multiply'?a*b*(terms?d:1n):a,expression=mode==='add'?`${a}+${b}${terms?'+'+d:''}`:mode==='subtract'?`${borrow?a:a+b}−${b}`:mode==='multiply'?`${a}·${b}${terms?'·'+d:''}`:`${left}:${b}`;return one(`Izračunaj ${expression}.`,value,[`${expression}=${value}.`,`Provjeri ${mode==='divide'?'množenjem količnika djeliocem':mode==='subtract'?'sabiranjem razlike i umanjioca':'obrnutom operacijom'}.`]);}
    return baseHandlers.arithmetic(c);
  };
  handlers.word=c=>{
    const {i,l,p,a,b}=c,mode=c.t.practice.mode;
    if(mode==='total'&&p.context==='biblioteka')return one(`Biblioteka ima ${a+1000} knjiga. Nabavila je ${b*10}, a otpisala ${l*7}. Koliko sada ima knjiga?`,a+1000+b*10-l*7,[`Nabavka: ${a+1000}+${b*10}=${a+1000+b*10}.`,`Otpis: ${a+1000+b*10}−${l*7}=${a+1000+b*10-l*7}.`]);
    if(mode==='total'&&p.context==='proizvodnja'){const target=(a+b)*4,first=a,second=b;return one(`Plan proizvodnje je ${target} komada. Prve smjene proizvode ${first} i ${second}. Koliko još treba proizvesti?`,target-first-second,[`Proizvedeno=${first}+${second}=${first+second}.`,`Preostaje=${target}−${first+second}=${target-first-second}.`]);}
    if(mode==='packs'&&p.context==='olovke'){const used=l*7;return one(`${a} kutija sadrži po ${b} olovaka. Podijeljeno je ${used}. Koliko olovaka ostaje?`,a*b-used,[`Ukupno=${a}·${b}=${a*b}.`,`Ostaje=${a*b}−${used}=${a*b-used}.`]);}
    if(mode==='equal-share'&&p.context==='ucenici')return one(`${a*b} učenika podijeljeno je u ${b} jednakih grupa. Koliko učenika ima jedna grupa?`,a,[`${a*b}:${b}=${a} učenika.`]);
    if(mode==='price'){const price=l+2,extra=b,total=a*price+extra;if(p.context==='izlet')return one(`${a} učenika plaća po ${price} KM za ulaznicu. Autobus košta još ${extra} KM. Koliki je ukupan trošak?`,total,[`${a}·${price}=${a*price}.`,`Ukupno=${a*price}+${extra}=${total} KM.`]);const paid=total+10+i;return many(`Kupljeno je ${a} svezaka po ${price} KM i knjiga za ${extra} KM. Plaćeno je ${paid} KM. Odredi račun i kusur.`,[f('total','Račun (KM)',total),f('change','Kusur (KM)',paid-total)],[`Račun=${a}·${price}+${extra}=${total} KM.`,`Kusur=${paid}−${total}=${paid-total} KM.`]);}
    if(mode==='distance'&&p.stages){const third=i+l+10;return one(`Put se sastoji od etapa dugih ${a} km, ${b} km i ${third} km. Kolika je ukupna dužina puta?`,a+b+third,[`Ukupno=${a}+${b}+${third}=${a+b+third} km.`]);}
    if(mode==='time'){const first=i+20,pause=l*5,second=i+25,total=first+pause+second;return many(`Prva aktivnost traje ${first} min, pauza ${pause} min, a druga aktivnost ${second} min. Odredi ukupne minute te zapis u satima i preostalim minutama.`,[f('minutes','Ukupno minuta',total),f('hours','Cijeli sati',Math.floor(total/60)),f('remaining','Preostale minute',total%60)],[`Ukupno=${first}+${pause}+${second}=${total} min.`,`${total}=60·${Math.floor(total/60)}+${total%60}.`]);}
    if(mode==='age'){const child=5+i%10,difference=25+Math.floor(i/10),parent=child+difference,years=l+2;return many(`Roditelj ima ${parent} godina, a dijete ${child}. Koliko će oboje imati za ${years} godina i kolika je razlika njihovih godina?`,[f('parent','Roditelj',parent+years),f('child','Dijete',child+years),f('difference','Razlika',difference)],[`Dodaj ${years} objema starostima: ${parent+years} i ${child+years}.`,`Razlika ostaje ${parent}−${child}=${difference}.`]);}
    return baseHandlers.word(c);
  };
  handlers.sequence=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode;
    if(p.kind==='geometric'){const a=i+2,q=l+2,terms=Array.from({length:4},(_,j)=>BigInt(a)*BigInt(q)**BigInt(j));return one(`Niz prati pravilo „pomnoži sa ${q}“: ${terms.join(', ')}, … Odredi sljedeći član.`,BigInt(a)*BigInt(q)**4n,[`Posljednji poznati član ${terms[3]} pomnoži sa ${q}: ${BigInt(a)*BigInt(q)**4n}.`]);}
    if(p.kind==='natural'&&mode==='sum'){const n=i+5;return one(`Izračunaj 1+2+…+${n}.`,n*(n+1)/2,[`S=n(n+1)/2=${n}·${n+1}/2=${n*(n+1)/2}.`]);}
    return baseHandlers.sequence(c);
  };
  handlers.units=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,normalize=u=>String(u).replace(/2$/,'²').replace(/3$/,'³'),from=normalize(p.from||({length:'m',mass:'kg',time:'h',area:'m²',volume:'l',money:'KM'}[mode])),to=normalize(p.to||({length:'cm',mass:'g',time:'min',area:'cm²',volume:'ml',money:'fening'}[mode])),u=unitFactors[from],v=unitFactors[to];
    if(!u||!v||u[0]!==v[0])throw new Error('Nepoznata jedinica '+from+'/'+to);
    if(p.compound){if(N(u[1])<N(v[1])){const quantity=(i+1)*60+l*7,whole=Math.floor(quantity/60),rem=quantity%60;return many(`Pretvori ${quantity} ${from} u cijele ${to} i preostale ${from}.`,[f('whole','Cijele '+to,whole),f('remainder','Preostale '+from,rem)],[`${quantity}=60·${whole}+${rem}; zapis ${whole} ${to} ${rem} ${from}.`]);}const factor=R(u[1]).div(v[1]),whole=i+2,rem=l*7,value=factor.mul(whole).add(rem);return one(`Pretvori ${whole} ${from} i ${rem} ${to} u ${to}.`,S(value),[`${whole} ${from}=${S(factor.mul(whole))} ${to}.`,`Dodaj ostatak: ${S(value)} ${to}.`]);}
    if(p.integerOnly){const factor=R(u[1]).div(v[1]),quantity=R(i+1).div(factor);return one(`Pretvori ${S(quantity)} ${from} u ${to}.`,i+1,[`${S(quantity)}·${S(factor)}=${i+1} ${to}.`]);}return baseHandlers.units({...c,p:{...p,from,to}});
  };
  handlers.primes=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode;
    if(mode==='classify'&&p.kind==='one')return many(`Uporedi broj 1 s brojem ${i+2}. Koliko pozitivnih djelilaca ima 1 i je li 1 prost ili složen?`,[f('count','Broj djelilaca broja 1',1),f('kind','Vrsta broja 1','ni prost ni složen','text'),f('other','Vrsta drugog broja',M.isPrime(i+2)?'prost':'složen','text')],[`Jedini pozitivni djelilac broja 1 je 1.`,`Prost broj treba tačno dva djelioca; 1 nije ni prost ni složen. Drugi broj je ${M.isPrime(i+2)?'prost':'složen'}.`]);
    if(mode==='classify'&&['prime','composite'].includes(p.kind)){let n=p.kind==='prime'?i*5+2:(i+2)*(l+2);while(p.kind==='prime'&&!M.isPrime(n))n++;return many(`Odredi broj pozitivnih djelilaca broja ${n} i klasifikuj ga.`,[f('count','Broj pozitivnih djelilaca',M.factorize(n).factors.reduce((n,x)=>n*(x.exponent+1),1)),f('kind','Vrsta broja',p.kind==='prime'?'prost':'složen','text')],[`Rastav ${n}=${M.factorize(n).expression}.`,`Broj djelilaca je proizvod (eksponent+1); vrsta ${p.kind==='prime'?'prost':'složen'}.`]);}
    if(mode==='factor'&&p.kind){const n=p.kind==='odd'?(2*i+3)*(2*l+3):(i+2)*2*(l+2),factors=[];for(const part of M.factorize(n).factors)for(let j=0;j<part.exponent;j++)factors.push(part.prime);return list(`Rastavi ${p.kind==='odd'?'neparni':'parni'} broj ${n} na proste faktore s ponavljanjem.`,factors,[`${n}=${M.factorize(n).expression}.`]);}
    if(mode==='count'&&(p.distinct||p.target==='divisor-count')){const n=(i+2)*12*l,factors=M.factorize(n).factors,value=p.distinct?factors.length:factors.reduce((v,x)=>v*(x.exponent+1),1);return one(`Broj ${n} rastavi na proste faktore pa odredi broj ${p.distinct?'različitih prostih faktora':'pozitivnih djelilaca'}.`,value,[`${n}=${M.factorize(n).expression}.`,p.distinct?`Različitih prostih faktora ima ${value}.`:`Broj djelilaca = ${factors.map(x=>'('+x.exponent+'+1)').join('·')} = ${value}.`]);}
    return baseHandlers.primes(c);
  };
  handlers.gcdlcm=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode;
    if(p.coprime){const a=i+2,b=a+1;return one(`Odredi NZD(${a},${b}) i provjeri da su uzajamno prosti.`,1,[`${b}−${a}=1, pa zajednički djelilac dijeli 1.`,`NZD=1.`]);}
    if(mode==='word-gcd'&&p.context==='tiles'){const a=(i+2)*6,b=(i+2)*8,v=M.gcd(a,b);return one(`Pravougaonik ${a} cm × ${b} cm treba bez rezanja pokriti najvećim jednakim kvadratnim pločicama. Odredi stranicu pločice.`,v,[`Stranica mora dijeliti obje dužine.`,`Najveća je NZD(${a},${b})=${v} cm.`]);}
    const task=baseHandlers.gcdlcm(c);
    if(p.method==='euclid'){const g=i+2,a=g*(l+2),b=g*(l+5),steps=[];let x=a,y=b;while(y){steps.push(`${x}=${y}·${Math.floor(x/y)}+${x%y}.`);[x,y]=[y,x%y];}task.steps=[...steps,`Posljednji nenulti ostatak je NZD=${x}.`];}
    if(p.method==='factor'){const g=i+2,a=g*(l+2),b=g*(l+5);task.steps.unshift(`Rastavi: ${a}=${M.factorize(a).expression}; ${b}=${M.factorize(b).expression}.`);}
    return task;
  };
  function variedRational(c){
    const {i,l,p}=c,mode=c.t.practice.mode,family=c.t.practice.family,den=l+4;
    let a=R(i+l+5).div(den),b=R(l+1).div(p.sameDenominator?den:l+5),aLabel=S(a),bLabel=S(b);
    if(p.sameNumerator){a=R(i+2).div(i+l+5);b=R(i+2).div(i+l+9);}
    if(p.sameDenominator){a=R(i+l+5).div(den);b=R(l+1).div(den);}
    if(p.signs==='negative-negative'||p.negativeOnly){a=a.neg();b=b.neg();}
    if(p.signs==='mixed'||p.rightSign==='negative'){if(p.rightSign==='negative')b=b.neg();else a=a.neg();}
    if(p.signed&&i%2)a=a.neg();
    if(p.mixed){const da=l+4,whole=i+l+3,part=p.borrow?1:l+1,wholeB=l+1,partB=p.borrow?da-1:2;a=R(whole).add(R(part).div(da));b=R(wholeB).add(R(partB).div(da));if(family==='rational')a=a.neg();aLabel=family==='rational'?`−(${whole} + ${part}/${da})`:`${whole} + ${part}/${da}`;bLabel=`${wholeB} + ${partB}/${da}`;}
    else{aLabel=p.sameDenominator?`${i+l+5}/${den}`:p.sameNumerator?`${i+2}/${i+l+5}`:S(a);bLabel=p.sameDenominator?`${l+1}/${den}`:p.sameNumerator?`${i+2}/${i+l+9}`:S(b);}
    if(p.wholeLeft){a=R(i+l+5);aLabel=S(a);}
    if(p.wholeRight){b=R(l+2);bLabel=S(b);}
    if(mode==='part'&&p.target==='representation'){const whole=i+5,chosen=l+1;return one(`Cjelina je podijeljena na ${whole} jednakih dijelova. Obojeno je ${chosen}. Koji razlomak cjeline je obojen?`,S(R(chosen).div(whole)),[`Brojilac je broj obojenih dijelova (${chosen}), nazivnik broj svih (${whole}).`,`Razlomak=${chosen}/${whole}=${S(R(chosen).div(whole))}.`]);}
    if(mode==='part'&&p.target==='remaining'){const aa=R(i+1).div(i+l+7),bb=R(1).div(i+l+7),v=R(1).sub(aa).sub(bb);return one(`Potrošeno je ${S(aa)} i ${S(bb)} cjeline. Koji dio cjeline ostaje?`,S(v),[`Potrošeno ukupno=${S(aa.add(bb))}.`,`Preostaje 1−${S(aa)}−${S(bb)}=${S(v)}.`]);}
    if(mode==='compare'&&p.target==='classify'){const numerator=i%3===0?i+1:i%3===1?2*(i+2)+1:2*(i+2),denominator=i+2,kind=numerator<denominator?'pravi':numerator%denominator===0?'prividni':'nepravi';return text(`Klasifikuj ${numerator}/${denominator} kao pravi, nepravi (necjelobrojni) ili prividni razlomak.`,kind,[`Poredi brojilac i nazivnik; provjeri je li količnik cijeli.`,`Razlomak je ${kind}.`]);}
    if(mode==='compare'&&p.target==='between'){const lower=family==='rational'?R(i+1).div(i+l+5).neg().sub(1):R(i+1).div(i+l+5),upper=lower.add(R(1).div(l+3)),mid=lower.add(upper).div(2);return one(`Nađi razlomak tačno na sredini između ${S(lower)} i ${S(upper)}.`,S(mid),[`Sredina=(a+b)/2=(${S(lower)}+${S(upper)})/2=${S(mid)}.`]);}
    if(mode==='compare'&&p.target==='interval'){const value=R(i*3+7).div(4),lo=value.n/value.d;return many(`Odredi susjedne cijele brojeve između kojih se nalazi ${S(value)}. Donju granicu uključi.`,[f('lower','Donja granica',lo),f('upper','Gornja granica',lo+1n)],[`${lo} ≤ ${S(value)} < ${lo+1n}.`]);}
    if(mode==='expand'){const numerator=i+1,denominator=i+l+3,factor=p.factor||l+2;if(p.target==='numerator'||p.target==='denominator')return one(`Dopuni jednakost ${numerator}/${denominator}=x/${denominator*factor}.`,numerator*factor,[`Nazivnik je pomnožen sa ${factor}, pa i brojilac: x=${numerator}·${factor}=${numerator*factor}.`]);return many(`Proširi ${numerator}/${denominator} faktorom ${factor}.`,[f('numerator','Novi brojilac',numerator*factor),f('denominator','Novi nazivnik',denominator*factor)],[`Pomnoži brojilac i nazivnik sa ${factor}: ${numerator*factor}/${denominator*factor}.`]);}
    if(mode==='reduce'&&p.stepwise){const factor=l+2,n=(i+1)*factor,d=(i+2)*factor;return many(`Skrati ${n}/${d} dijeljenjem brojioca i nazivnika faktorom ${factor}.`,[f('numerator','Novi brojilac',i+1),f('denominator','Novi nazivnik',i+2)],[`${n}:${factor}=${i+1}; ${d}:${factor}=${i+2}.`,`Dobiveni razlomak=${i+1}/${i+2}.`]);}
    if(mode==='order'){const count=p.count||4,arr=[a,b,a.add(b),a.sub(b)].slice(0,count);return list(`Poredaj rastuće ${count} razlomka: ${arr.map(S).join('; ')}.`,[...arr].sort((x,y)=>N(x)-N(y)).map(S),[`Rastući niz: ${[...arr].sort((x,y)=>N(x)-N(y)).map(S).join('; ')}.`],undefined,true);}
    if(mode==='add'&&p.target==='unknown'){const sum=a.add(b);return one(`Riješi x + ${S(b)} = ${S(sum)}.`,S(a),[`Nepoznati sabirak=zbir−poznati: x=${S(sum)}−${S(b)}=${S(a)}.`]);}
    if(mode==='divide'&&p.context==='pieces'){const length=(i+2)*3,piece=R(3).div(l+2);return one(`Traka duga ${length} m reže se na komade dužine ${S(piece)} m. Koliko cijelih komada nastaje?`,(i+2)*(l+2),[`Broj komada=${length}:(${S(piece)})=${(i+2)*(l+2)}.`]);}
    if(['add','subtract','multiply','divide'].includes(mode)){if(p.crossCancel){a=R(2*(i+2)).div(3);b=R(3*(l+1)).div(2*(i+2)+1);aLabel=`${2*(i+2)}/3`;bLabel=`${3*(l+1)}/${2*(i+2)+1}`;}const op={add:'+',subtract:'−',multiply:'·',divide:':'},v=mode==='add'?a.add(b):mode==='subtract'?a.sub(b):mode==='multiply'?a.mul(b):a.div(b),third=R(1).div(l+6),value=p.terms===3&&mode==='add'?v.add(third):v,prompt=p.context==='area'?`Pravougaonik ima stranice ${S(a)} m i ${S(b)} m. Odredi površinu.`:`Izračunaj (${aLabel}) ${op[mode]} (${bLabel})${p.terms===3?' + '+S(third):''}.`;return one(prompt,S(value),[...(p.mixed?[`Pretvori mješovite brojeve: ${S(a)} i ${S(b)}.`]:[]),...(p.crossCancel?[`Prije množenja možeš skratiti zajednički faktor 3 u suprotnom brojicu i nazivniku.`]:[]),`(${S(a)}) ${op[mode]} (${S(b)})=${S(v)}.`,...(p.terms===3?[`Dodaj treći razlomak ${S(third)}: ${S(value)}.`]:[]),`Neskrativ konačni rezultat=${S(value)}.`]);}
    if(mode==='complex'){const pattern=p.pattern||'sum-top',top=pattern==='simple'||pattern==='difference-bottom'?a:a.add(b),bottom=pattern==='difference-bottom'?b.add(1).sub(R(1).div(3)):b,prompt=`Izračunaj dvojni razlomak (${pattern==='simple'||pattern==='difference-bottom'?S(a):S(a)+'+'+S(b)}) / (${pattern==='difference-bottom'?S(b.add(1))+'−1/3':S(b)}).`;return one(prompt,S(top.div(bottom)),[`Brojilac=${S(top)}; nazivnik=${S(bottom)}.`,`Količnik=${S(top)}:${S(bottom)}=${S(top.div(bottom))}.`]);}
    if(mode==='expression'&&p.pattern==='outer-minus')return one(`Izračunaj −[${S(a)} − ${S(b)}].`,S(a.sub(b).neg()),[`Zagrada=${S(a.sub(b))}.`,`Promijeni predznak: ${S(a.sub(b).neg())}.`]);
    if(mode==='expression'&&p.pattern==='nested'){const divisor=R(l+2).div(l+5).neg(),v=a.add(b).div(divisor);return one(`Izračunaj [${S(a)}+${S(b)}] : (${S(divisor)}).`,S(v),[`Zbir u zagradi=${S(a.add(b))}.`,`Dijeljenjem negativnim razlomkom: ${S(v)}.`]);}
    if(mode==='expression'){const v=a.add(b).mul(R(l+2).div(l+5));return one(`Izračunaj [(${aLabel})+(${bLabel})]·${l+2}/${l+5}.`,S(v),[`Zagrada=${S(a.add(b))}.`,`Proizvod=${S(v)}.`]);}
    if(mode==='compare')return text(`Uporedi ${aLabel} i ${bLabel}. Upiši <, > ili =.`,N(a)<N(b)?'<':N(a)>N(b)?'>':'=',[`Razlika=${S(a.sub(b))}.`,`Po predznaku razlike odredi znak poređenja.`]);
    return baseHandlers[family](c);
  }
  handlers.fraction=variedRational;handlers.rational=variedRational;
  handlers.decimal=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=R(100001+i*19).div(1000);
    if(mode==='place'){const place=p.place||1/10,places=Math.round(-Math.log10(place)),scaled=a.mul(10**places),digit=scaled.n/scaled.d%10n;return one(`Koja cifra stoji na ${places}. decimalnom mjestu broja ${dec(a)}?`,digit,[`Pomnoži broj sa ${10**places} i uzmi cifru jedinica cijelog dijela: ${digit}.`]);}
    if(mode==='round'){const digits=p.places??Math.max(0,l-1),v=a.toDecimal(digits);return one(`Zaokruži ${dec(a)} na ${digits} decimalnih mjesta.`,v,[`Prva odbačena cifra određuje zaokruživanje.`,`Rezultat=${v.replace('.',',')}.`]);}
    if(mode==='convert'&&p.direction==='to-decimal'){const n=i+1,d=20,v=R(n).div(d);return one(`Razlomak ${n}/${d} napiši decimalno.`,v.toDecimal(2),[`${n}/${d}=${n*5}/100=${v.toDecimal(2).replace('.',',')}.`]);}
    if(p.powerTen){const op=mode==='multiply'?'·':':',v=mode==='multiply'?a.mul(p.powerTen):a.div(p.powerTen);return one(`Izračunaj ${dec(a)} ${op} ${p.powerTen}.`,S(v),[`Zarez pomjeri ${Math.log10(p.powerTen)} mjesta ${mode==='multiply'?'udesno':'ulijevo'}.`,`Rezultat=${dec(v)}.`]);}
    if(mode==='subtract'&&p.zeros){const x=R(i+3),y=R(2347).div(1000),v=x.sub(y);return one(`Izračunaj ${x.toDecimal(3)} − ${dec(y)}.`,S(v),[`Dopiši tri decimalne nule prvom broju i posuđuj kroz nule.`,`Razlika=${dec(v)}.`]);}
    return baseHandlers.decimal(c);
  };
  handlers.integer=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode;let a=-(i+11)*l,b=c.b;
    if(mode==='absolute'&&p.expression)return one(`Izračunaj |${a}−${b}|.`,Math.abs(a-b),[`Unutar oznake: ${a}−${b}=${a-b}.`,`Apsolutna vrijednost=${Math.abs(a-b)}.`]);
    if(mode==='compare'){if(p.negativeOnly)b=-b;else if(p.mixedSigns)b=Math.abs(b);return text(`Uporedi ${a} i ${b}. Upiši <, > ili =.`,a<b?'<':a>b?'>':'=',[`Na brojevnoj pravoj ${a} ${a<b?'<':a>b?'>':'='} ${b}.`]);}
    if(['add','subtract','multiply','divide'].includes(mode)){const signs=p.signs||'',leftSign=p.leftSign||(signs.startsWith('positive')?'positive':'negative'),rightSign=p.rightSign||(signs.endsWith('negative')?'negative':'positive');a=(leftSign==='positive'?1:-1)*(i+11)*l;b=(rightSign==='negative'?-1:1)*(l+2);if(p.resultSign==='negative'){a=i+2;b=-(i+l+5);}if(p.resultSign==='positive'){a=i+l+5;b=-(i+2);}if(p.opposites)b=-a;if(mode==='divide')a=a*Math.abs(b);const extra=p.terms===3?-(l+3):1,value=mode==='add'?a+b:mode==='subtract'?a-b:mode==='multiply'?a*b*extra:a/b,expression=`(${a}) ${{add:'+',subtract:'−',multiply:'·',divide:':'}[mode]} (${b})${p.terms===3?'·('+extra+')':''}`;return one(p.context==='temperature'?`Temperatura se promijeni sa ${b}°C na ${a}°C. Odredi promjenu u °C.`:`Izračunaj ${expression}.`,value,[`Primijeni pravila predznaka: ${expression}=${value}.`,...(p.terms===3?[`Broj negativnih faktora odlučuje predznak proizvoda.`]:[])]);}
    return baseHandlers.integer(c);
  };
  handlers.ratio=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=i+2,b=l+3,k=l+2;
    if(mode==='simplify'&&p.convertUnits){const metres=i+1,cm=(l+1)*10,g=M.gcd(metres*100,cm);return many(`Skrati omjer ${metres} m : ${cm} cm. Najprije izjednači jedinice.`,[f('first','Prvi član',BigInt(metres*100)/g),f('second','Drugi član',BigInt(cm)/g)],[`${metres} m=${metres*100} cm.`,`Podijeli ${metres*100}:${cm} sa NZD=${g}.`]);}
    if(mode==='share'&&p.parts===3){const d=l+4,total=(a+b+d)*(i+10);return many(`Podijeli ${total} KM u omjeru ${a}:${b}:${d}.`,[f('first','Prvi dio',a*(i+10)),f('second','Drugi dio',b*(i+10)),f('third','Treći dio',d*(i+10))],[`Jedan dio=${total}/(${a}+${b}+${d})=${i+10}.`,`Pomnoži svaki član omjera sa ${i+10}.`]);}
    if(mode==='proportion'&&p.position==='inner')return one(`Odredi x: ${a}:x=${a*k}:${b*k}.`,b,[`Unakrsno: ${a*k}x=${a}·${b*k}.`,`x=${b}.`]);
    if(mode==='direct'&&p.target==='constant')return one(`Direktna proporcionalnost ima y=${a*b} kada je x=${b}. Odredi k u y=kx.`,a,[`k=y/x=${a*b}/${b}=${a}.`]);
    if(mode==='inverse'&&p.target==='constant')return one(`Obrnuta proporcionalnost ima y=${a} kada je x=${b}. Odredi k u y=k/x.`,a*b,[`k=xy=${b}·${a}=${a*b}.`]);
    if(mode==='direct'&&p.context==='distance')return one(`Za ${b} h pređe se ${a*b} km. Koliko kilometara se pređe za ${k} h pri istoj brzini?`,a*k,[`Brzina=${a*b}/${b}=${a} km/h.`,`Put za ${k} h=${a*k} km.`]);
    if(mode==='direct'&&p.context==='recipe')return one(`Za ${b} osoba potrebno je ${a*b} g brašna. Koliko treba za ${k} osoba uz isti recept?`,a*k,[`Po osobi treba ${a} g.`,`Za ${k} osoba: ${a}·${k}=${a*k} g.`]);
    if(mode==='inverse'&&p.context==='speed')return one(`Put se prelazi za ${a} h brzinom ${b} km/h. Za koliko sati isti put prelazimo brzinom ${k} km/h?`,S(R(a*b).div(k)),[`Put=${a}·${b}=${a*b} km.`,`Novo vrijeme=${a*b}/${k}=${S(R(a*b).div(k))} h.`]);
    if(mode==='scale'&&p.direction==='map'){const scale=100000,distance=R(i+2).div(10);return one(`Stvarna udaljenost je ${dec(distance)} km. Kolika je dužina na karti razmjere 1:${scale}, u cm?`,S(distance),[`Stvarno u cm=${S(distance.mul(100000))}.`,`Na karti=${S(distance.mul(100000))}/${scale}=${S(distance)} cm.`]);}
    return baseHandlers.ratio(c);
  };
  handlers.percent=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=R(100+i*10),rate=R(l*5+10);
    if(p.inverse){const multiplier=R(100).add(rate.mul(mode==='increase'?1:-1)).div(100),final=a.mul(multiplier);return one(`Poslije ${mode==='increase'?'povećanja':'smanjenja'} cijene za ${S(rate)}% nova cijena je ${S(final)} KM. Odredi početnu cijenu.`,S(a),[`Novi iznos=početni·${S(multiplier)}.`,`Početni=${S(final)}/${S(multiplier)}=${S(a)} KM.`]);}
    if(mode==='successive'&&p.changes){const [r1,r2]=p.changes,first=a.mul(R(100+r1)).div(100),second=first.mul(R(100+r2)).div(100);return one(`Početni iznos ${S(a)} KM promijeni se prvo za ${r1>0?'+':''}${r1}%, zatim za ${r2>0?'+':''}${r2}% nove osnovice. Odredi završni iznos.`,S(second),[`Prva promjena: ${S(a)}·${S(R(100+r1).div(100))}=${S(first)}.`,`Druga promjena: ${S(first)}·${S(R(100+r2).div(100))}=${S(second)} KM.`]);}
    if(mode==='rate'&&p.target==='percentage-points'){const before=10+i/4,after=before+l+2;return many(`Stopa poraste sa ${before}% na ${after}%. Odredi rast u procentnim poenima i relativni rast u procentima početne stope.`,[f('points','Procentni poeni',l+2),f('relative','Relativni rast (%)',S(R(l+2).mul(100).div(before)))],[`Procentni poeni=${after}−${before}=${l+2}.`,`Relativni rast=${l+2}·100/${before}=${S(R(l+2).mul(100).div(before))}%.`]);}
    return baseHandlers.percent(c);
  };
  handlers.angle=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=c.t.grade===5?R(p.operation==='divide'?(i%50+1)*(l+3):i+20):R(10).add(R(i+1).div(4));
    if(mode==='parts'&&p.operation){const b=R(l+3),v=p.operation==='add'?a.add(b):p.operation==='subtract'?a.add(b).sub(b):a.div(b),prompt=p.operation==='add'?`${S(a)}°+${S(b)}°`:p.operation==='subtract'?`${S(a.add(b))}°−${S(b)}°`:`${S(a)}° podijeljeno na ${S(b)} jednakih dijelova`;return one(`Izračunaj ${prompt}.`,S(v),[`${prompt} daje ${S(v)}°.`]);}
    if(['complement','supplement'].includes(mode)&&p.target){const whole=mode==='complement'?90:180,diff=R(i+1).div(4),r=i+2,s=l+4,first=p.target==='difference'?R(whole).sub(diff).div(2):R(whole*r).div(r+s),second=R(whole).sub(first);return many(`${mode==='complement'?'Komplementni':'Suplementni'} uglovi ${p.target==='difference'?'razlikuju se za '+S(diff)+'°':'imaju odnos '+r+':'+s}. Odredi oba (manji pa veći u zadatku s razlikom).`,[f('first','Prvi ugao (°)',S(first)),f('second','Drugi ugao (°)',S(second))],[`Zbir=${whole}°.`,p.target==='difference'?`2α=${whole}−${S(diff)}; α=${S(first)}°, β=${S(second)}°.`:`Podjela na ${r+s} dijelova: α=${S(first)}°, β=${S(second)}°.`]);}
    if(mode==='parallel'&&p.context){const other=R(180).sub(a);return many(`${p.context==='parallelogram'?'Paralelogram':'Jednakokraki trapez'} ima ${p.context==='parallelogram'?'jedan unutrašnji ugao':'ugao uz donju osnovicu'} ${S(a)}°. Odredi ${p.context==='parallelogram'?'susjedni i naspramni':'ugao uz gornju osnovicu i drugi uz donju'}.`,[f('supplement','Suplementni ugao (°)',S(other)),f('equal','Jednaki ugao (°)',S(a))],[`Uglovi uz isti krak/zajedničku stranicu su suplementni: ${S(other)}°.`,`Naspramni/uz istu osnovicu su jednaki: ${S(a)}°.`]);}
    if(mode==='parallel'&&p.target){const same=p.target!=='same-side',out=same?a:R(180).sub(a);return one(`Paralelne prave presijeca transverzala. Zadani ugao je ${S(a)}°. Odredi ${p.target==='corresponding'?'saglasni':p.target==='alternate'?'naizmjenični':'unutrašnji ugao s iste strane'}.`,S(out),[same?`Takvi uglovi su jednaki: ${S(out)}°.`:`Zbir je 180°: drugi=${S(out)}°.`]);}
    if(mode==='polygon'&&p.sides){const n=p.sides,sum=180*(n-2);if(p.target==='missing'){const aa=R(50).add(R(i).div(4)),bb=R(70),cc=R(80),out=R(360).sub(aa).sub(bb).sub(cc);return one(`Četverougao ima tri unutrašnja ugla ${S(aa)}°, 70° i 80°. Odredi četvrti.`,S(out),[`Zbir uglova je 360°.`,`Četvrti=360−${S(aa)}−70−80=${S(out)}°.`]);}if(p.target==='sum')return one(`Mnogougao sa ${n} stranica ima prvi ugao ${S(a)}°. Bez računanja pojedinačnih uglova odredi njihov ukupan zbir.`,sum,[`Zbir zavisi samo od n: (n−2)·180°=${sum}°.`]);return one(`Odredi unutrašnji ugao pravilnog ${n}-ougla koristeći zbir svih uglova.`,S(R(sum).div(n)),[`Zbir=${sum}°.`,`Svaki unutrašnji ugao=${sum}/${n}=${S(R(sum).div(n))}°.`]);}
    if(mode==='clock'&&p.fullHour){const hour=i%12;return one(`Sat prikazuje ${hour}:00. Koliki je manji ugao između kazaljki?`,Math.min(hour*30,360-hour*30),[`Satna je na ${hour*30}°, minutna na 0°.`,`Manji ugao=${Math.min(hour*30,360-hour*30)}°.`]);}
    return baseHandlers.angle(c);
  };
  handlers.triangle=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=p.decimal?R(i+50).div(10):R(i+5),b=a.add(l+1),third=a.add(2),alpha=R(20).add(R(i).div(4));
    if(mode==='classify'&&p.criterion==='angles'){const largest=i%3===0?R(60).add(R(i).div(20)):i%3===1?R(90):R(100).add(R(i).div(10)),other=R(180).sub(largest).div(2),kind=N(largest)<90?'oštrougli':N(largest)===90?'pravougli':'tupougli';return text(`Trougao ima uglove ${S(other)}°, ${S(other)}° i ${S(largest)}°. Klasifikuj ga prema uglovima.`,kind,[`Najveći ugao je ${S(largest)}°, pa je trougao ${kind}.`]);}
    if(mode==='classify'&&p.target){const isIso=p.kind==='isosceles';if(p.target==='vertex')return one(`Jednakokraki trougao ima uglove na osnovici po ${S(alpha)}°. Odredi ugao pri vrhu.`,S(R(180).sub(alpha.mul(2))),[`Vrh=180−2·${S(alpha)}=${S(R(180).sub(alpha.mul(2)))}°.`]);if(isIso)return one(`Jednakokraki trougao ima ugao pri vrhu ${S(alpha)}°. Odredi svaki ugao na osnovici.`,S(R(180).sub(alpha).div(2)),[`Dva jednaka ugla dijele 180°−${S(alpha)}°; svaki=${S(R(180).sub(alpha).div(2))}°.`]);const beta=R(l+35);return one(`Dva unutrašnja ugla su ${S(alpha)}° i ${S(beta)}°. Odredi ${p.target==='exterior'?'vanjski ugao kod trećeg vrha':'treći unutrašnji ugao'}.`,S(p.target==='exterior'?alpha.add(beta):R(180).sub(alpha).sub(beta)),[p.target==='exterior'?`Vanjski=zbir udaljenih unutrašnjih=${S(alpha.add(beta))}°.`:`Treći=180−${S(alpha)}−${S(beta)}=${S(R(180).sub(alpha).sub(beta))}°.`]);}
    if(mode==='inequality'&&p.target==='range'){const aa=i+5,bb=aa+l+2;return many(`Uz stranice ${aa} cm i ${bb} cm odredi najmanju i najveću moguću cjelobrojnu treću stranicu trougla.`,[f('min','Najmanja (cm)',Math.abs(aa-bb)+1),f('max','Najveća (cm)',aa+bb-1)],[`|a−b|<c<a+b, dakle ${Math.abs(aa-bb)}<c<${aa+bb}.`,`Cijele granice=${Math.abs(aa-bb)+1} i ${aa+bb-1}.`]);}
    if(mode==='perimeter'){const aa=a,bb=p.kind==='equilateral'?a:p.kind==='isosceles'?a:b,cc=p.kind==='equilateral'?a:p.kind==='isosceles'?a.add(2):third,total=aa.add(bb).add(cc);if(p.target==='side')return one(`Obim trougla je ${S(total)} cm, a dvije stranice ${S(aa)} cm i ${S(bb)} cm. Odredi treću.`,S(cc),[`c=O−a−b=${S(total)}−${S(aa)}−${S(bb)}=${S(cc)} cm.`]);return one(`Trougao ima stranice ${p.decimal?dec(aa):S(aa)} cm, ${p.decimal?dec(bb):S(bb)} cm i ${p.decimal?dec(cc):S(cc)} cm. Odredi obim.`,S(total),[`O=a+b+c=${S(total)} cm.`]);}
    if(mode==='area'&&p.decimal){const base=R(i+5),height=R(i+3).div(2),P=base.mul(height).div(2);return one(`Trougao ima osnovicu ${S(base)} cm i odgovarajuću visinu ${dec(height)} cm. Odredi površinu.`,S(P),[`P=ah/2=${S(base)}·${dec(height)}/2=${dec(P)} cm².`]);}
    if(mode==='area'&&p.kind){const t=R(i+2),aa=t.mul(3),bb=t.mul(4),hyp=t.mul(5);if(p.kind==='right')return one(`Pravougli trougao ima katete ${S(aa)} cm i ${S(bb)} cm. Odredi površinu.`,S(aa.mul(bb).div(2)),[`Katete su međusobno okomite: P=ab/2=${S(aa.mul(bb).div(2))} cm².`]);return one(`Jednakokraki trougao ima krake ${S(hyp)} cm i osnovicu ${S(aa.mul(2))} cm. Odredi površinu.`,S(aa.mul(bb)),[`Visina=√[(${S(hyp)})²−(${S(aa)})²]=${S(bb)} cm.`,`P=(${S(aa.mul(2))}·${S(bb)})/2=${S(aa.mul(bb))} cm².`]);}
    if(mode==='midline'&&p.inverse)return one(`Srednja linija trougla iznosi ${S(a)} cm. Odredi paralelnu stranicu.`,S(a.mul(2)),[`Paralelna stranica je dvostruka: 2·${S(a)}=${S(a.mul(2))} cm.`]);
    return baseHandlers.triangle(c);
  };
  handlers.quadrilateral=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=R(i+5),b=R(l+3),h=R(l+2),perimeter=a.add(b).mul(2),area=a.mul(b);
    if(mode==='rectangle'&&p.measure==='side-from-area')return one(`Pravougaonik ima površinu ${S(area)} cm² i stranicu ${S(b)} cm. Odredi drugu stranicu.`,S(a),[`a=P/b=${S(area)}/${S(b)}=${S(a)} cm.`]);
    if(mode==='rectangle'&&p.measure==='side-from-perimeter')return one(`Pravougaonik ima obim ${S(perimeter)} cm i stranicu ${S(b)} cm. Odredi drugu.`,S(a),[`a=O/2−b=${S(perimeter)}/2−${S(b)}=${S(a)} cm.`]);
    if(mode==='square'&&p.measure==='side-from-perimeter')return one(`Kvadrat ima obim ${S(a.mul(4))} cm. Odredi stranicu.`,S(a),[`a=O/4=${S(a.mul(4))}/4=${S(a)} cm.`]);
    if(p.measure==='composite'){const v=area.add(h.mul(l+1));return one(`Lik je sastavljen od dva pravougaonika bez preklapanja: ${S(a)}×${S(b)} cm i ${S(h)}×${l+1} cm. Odredi ukupnu površinu.`,S(v),[`Saberi površine: ${S(area)}+${S(h.mul(l+1))}=${S(v)} cm².`]);}
    if(p.measure==='height'){const P=mode==='trapezoid'?a.add(b).mul(h).div(2):a.mul(h);return one(`${mode==='trapezoid'?'Trapez s osnovicama '+S(a)+' cm i '+S(b)+' cm':'Paralelogram s osnovicom '+S(a)+' cm'} ima površinu ${S(P)} cm². Odredi visinu.`,S(h),[mode==='trapezoid'?`h=2P/(a+b)=${S(h)} cm.`:`h=P/a=${S(h)} cm.`]);}
    if(mode==='trapezoid'&&p.measure==='base'){const P=a.add(b).mul(h).div(2);return one(`Trapez ima površinu ${S(P)} cm², visinu ${S(h)} cm i jednu osnovicu ${S(b)} cm. Odredi drugu.`,S(a),[`a=2P/h−b=${S(a)} cm.`]);}
    if(p.measure==='diagonal'){const d1=a.mul(2),d2=b.mul(3),P=d1.mul(d2).div(2);return one(`${mode==='rhombus'?'Romb':'Deltoid'} ima površinu ${S(P)} cm² i dijagonalu ${S(d1)} cm. Odredi drugu dijagonalu.`,S(d2),[`d₂=2P/d₁=${S(d2)} cm.`]);}
    if(mode==='rhombus'&&p.measure==='area-height')return one(`Romb ima stranicu ${S(a)} cm i visinu ${S(h)} cm. Odredi površinu.`,S(a.mul(h)),[`P=ah=${S(a)}·${S(h)}=${S(a.mul(h))} cm².`]);
    return baseHandlers.quadrilateral(c);
  };
  handlers.coordinate=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode;
    if(mode==='quadrant'&&p.onAxis)return text(`Tačka A(0;${i+1}) nalazi se na osi ili u kvadrantu? Upiši na osi.`, 'na osi',[`x=0, pa tačka leži na y-osi.`]);
    if(mode==='distance'&&p.kind){const a=i-90,b=a+l+5,other=l+2;return one(`Odredi rastojanje A(${p.kind==='horizontal'?a:other};${p.kind==='horizontal'?other:a}) i B(${p.kind==='horizontal'?b:other};${p.kind==='horizontal'?other:b}).`,b-a,[`Jedna koordinata je ista, pa je rastojanje apsolutna razlika druge: |${b}−(${a})|=${b-a}.`]);}
    if(mode==='midpoint'&&p.target==='endpoint'){const ax=i-90,ay=l+3,mx=i+2,my=l+5,bx=2*mx-ax,by=2*my-ay;return many(`A(${ax};${ay}), M(${mx};${my}). M je središte AB. Odredi B.`,[f('x','x tačke B',bx),f('y','y tačke B',by)],[`B=2M−A=(${2*mx}−(${ax});${2*my}−${ay})=(${bx};${by}).`]);}
    return baseHandlers.coordinate(c);
  };
  handlers.power=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=R(i+2);
    if(mode==='value'){const base=p.baseType==='negative'?a.neg():p.baseType==='fraction'?a.div(l+3):a,n=p.parity==='even'?2*l:p.parity==='odd'?2*l+1:l+1;return one(`Izračunaj (${S(base)})^${n}.`,S(base.pow(n)),[`Pomnoži osnovu samu sa sobom ${n} puta.`,`(${S(base)})^${n}=${S(base.pow(n))}.`]);}
    if(mode==='negative'&&p.target==='precedence')return many(`Uporedi (−${S(a)})² i −${S(a)}². Izračunaj oba izraza.`,[f('parentheses','S negativnom osnovom',S(a.pow(2))),f('outside','Predznak izvan stepena',S(a.pow(2).neg()))],[`(−a)²=a²=${S(a.pow(2))}.`,`−a²=−(a²)=${S(a.pow(2).neg())}.`]);
    if(mode==='scientific'||mode==='scientific-inverse'){const coeff=R(i+101).div(100),exponent=p.kind==='small'?-(l+2):l+4,value=coeff.mul(R(10).pow(exponent));if(mode==='scientific')return many(`Napiši ${dec(value)} u naučnom obliku k·10ⁿ, 1≤k<10.`,[f('coefficient','Koeficijent k',S(coeff)),f('exponent','Eksponent n',exponent)],[`${S(value)}=${S(coeff)}·10^${exponent}.`]);return one(`Naučni zapis ${dec(coeff)}·10^${exponent} napiši običnim decimalnim zapisom.`,S(value),[`Pomjeri zarez ${Math.abs(exponent)} mjesta ${exponent<0?'ulijevo':'udesno'}.`,`Vrijednost=${dec(value)}.`]);}
    if(mode==='product'&&p.scientific){const coeff=R(i+101).div(100),factor=R(l+2),exp1=l+2,exp2=l+1,product=coeff.mul(factor);let normalized=product,e=exp1+exp2;while(N(normalized)>=10){normalized=normalized.div(10);e++;}return many(`Pomnoži (${dec(coeff)}·10^${exp1})(${S(factor)}·10^${exp2}) i napiši rezultat k·10ⁿ sa 1≤k<10.`,[f('coefficient','k',S(normalized)),f('exponent','n',e)],[`Množimo koeficijente: ${S(product)}; sabiramo eksponente: ${exp1+exp2}.`,`Normalizovan zapis ${S(normalized)}·10^${e}.`]);}
    return baseHandlers.power(c);
  };
  handlers.root=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode;
    if(mode==='value'&&p.kind){const base=R(i+2),v=p.kind==='fraction'?base.div(l+3):p.kind==='decimal'?base.div(10):base;if(p.kind==='square-root-expression'){const extra=l+2;return one(`Izračunaj (√${S(v.pow(2))})² + ${extra}.`,S(v.pow(2).add(extra)),[`Kvadrat glavnog korijena nenegativnog broja vraća taj broj.`,`Rezultat=${S(v.pow(2))}+${extra}=${S(v.pow(2).add(extra))}.`]);}if(p.kind==='negative-square')return one(`Izračunaj √[(${S(v.neg())})²].`,S(v),[`√(a²)=|a|, pa √[(${S(v.neg())})²]=|${S(v.neg())}|=${S(v)}.`]);return one(`Odredi glavni kvadratni korijen ${p.kind==='decimal'?dec(v.pow(2)):S(v.pow(2))}.`,S(v),[`${S(v)}²=${S(v.pow(2))}.`,`Glavni korijen je nenegativan: ${S(v)}.`]);}
    if(mode==='product'||mode==='quotient'){const a=i+2,b=l+2,d=[2,3,5][l-1],left=a*a*d,right=b*b*d,value=mode==='product'?R(a*b*d):R(a).div(b);return one(`Izračunaj √${left} ${mode==='product'?'·':':'} √${right}.`,S(value),[mode==='product'?`Korijen proizvoda: √(${left}·${right})=√${left*right}=${S(value)}.`:`Korijen količnika: √(${left}/${right})=√(${a*a}/${b*b})=${S(value)}.`]);}
    if(mode==='simplify'&&p.target==='collect'){const a=i+2,b=l+3;return one(`Sredi ${a}√2 + ${b}√2. Odredi koeficijent ispred √2.`,a+b,[`Slični korijeni imaju isti korijenski dio: (${a}+${b})√2=${a+b}√2.`]);}
    return baseHandlers.root(c);
  };
  handlers.polynomial=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=i+2,b=l+3,d=l+1,x=i-80,y=l+2;
    if(mode==='collect'&&p.variables===2)return many(`Sredi ${a}x+${b}y+${d}x−${l}y. Odredi koeficijente x i y.`,[f('x','Uz x',a+d),f('y','Uz y',b-l)],[`Slični članovi: (${a}+${d})x+(${b}−${l})y=${a+d}x+${b-l}y.`]);
    if(mode==='collect'&&p.degree===1)return one(`Sredi ${a}x+${b}x−${d}x. Odredi koeficijent x.`,a+b-d,[`Koeficijent=${a}+${b}−${d}=${a+b-d}.`]);
    if(mode==='value'&&p.variables===2)return one(`Za x=${x}, y=${y} izračunaj ${a}x+${b}y.`,a*x+b*y,[`Uvrsti: ${a}·(${x})+${b}·${y}=${a*x+b*y}.`]);
    if(mode==='value'&&p.degree===1)return one(`Odredi vrijednost ${a}x+${b} za x=${x}.`,a*x+b,[`${a}·(${x})+${b}=${a*x+b}.`]);
    if(mode==='monomial'&&p.operation==='divide')return many(`Podijeli ${a*b}x^${2*l+3} sa ${b}x^${l+1}, x≠0. Odredi koeficijent i eksponent.`,[f('coefficient','Koeficijent',a),f('exponent','Eksponent',l+2)],[`Koeficijent=${a*b}/${b}=${a}; eksponent=${2*l+3}−${l+1}=${l+2}.`]);
    if(mode==='product'&&p.pattern==='monomial')return many(`Razvij ${d}x(${a}x+${b}). Odredi koeficijente x² i x.`,[f('quadratic','Uz x²',d*a),f('linear','Uz x',d*b)],[`Distributivno: ${d*a}x²+${d*b}x.`]);
    if(mode==='square'&&p.sign==='minus')return many(`Razvij (${a}x−${b})². Odredi koeficijente x², x i konstantu.`,[f('quadratic','Uz x²',a*a),f('linear','Uz x',-2*a*b),f('constant','Konstanta',b*b)],[`(u−v)²=u²−2uv+v².`,`Rezultat ${a*a}x²−${2*a*b}x+${b*b}.`]);
    if(mode==='factor'&&p.pattern==='square')return many(`Rastavi ${a*a}x²+${2*a*b}x+${b*b} kao (px+q)², p,q>0. Odredi p i q.`,[f('p','p',a),f('q','q',b)],[`Prepoznaj p²=${a*a}, 2pq=${2*a*b}, q²=${b*b}.`,`p=${a}, q=${b}.`]);
    if(mode==='factor'&&p.pattern==='rational-cancel')return one(`Skrati algebarski razlomak ${a}x(x+${b})/(${a}x), x≠0. U pojednostavljenom obliku x+q odredi q.`,b,[`Zajednički nenulti faktor ${a}x skrati se.`,`Ostaje x+${b}, pa je q=${b}.`]);
    if(mode==='difference'&&p.numeric){const left=i+102,right=i+98;return one(`Koristeći razliku kvadrata izračunaj ${left}²−${right}².`,left*left-right*right,[`a²−b²=(a−b)(a+b)=(${left}−${right})(${left}+${right})=${left-right}·${left+right}=${left*left-right*right}.`]);}
    return baseHandlers.polynomial(c);
  };
  handlers.equation=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,x=R(i-85).div(l===3?3:1),a=p.shape==='additive'?R(1):p.coefficientType==='decimal'?R(l+2).div(10):R(p.coefficientSign==='negative'?-(l+2):l+2),b=R(i%17-8),right=a.mul(x).add(b);
    if(mode==='simple')return one(`Riješi ${p.coefficientType==='decimal'?dec(a):S(a)}x ${signed(b)} = ${S(right)}.`,S(x),[`Oduzmi ${S(b)}: ${S(a)}x=${S(right.sub(b))}.`,`Podijeli sa ${S(a)}: x=${S(x)}.`]);
    if(mode==='parentheses'&&p.parentheses===2){const d=l+1,e=l+3,r=a.mul(x.add(b)).sub(R(d).mul(x.add(e)));return one(`Riješi ${S(a)}(x ${signed(b)}) = ${d}(x+${e}) ${signed(r)}.`,S(x),[`Otvori zagrade i izdvoji x: (${S(a)}−${d})x=${S(R(d*e).add(r).sub(a.mul(b)))}.`,`x=${S(x)}.`]);}
    if(mode==='fraction'&&p.shape==='coefficient'){const coefficient=R(l+2).div(l+5),r=coefficient.mul(x).add(b);return one(`Riješi (${S(coefficient)})x ${signed(b)} = ${S(r)}.`,S(x),[`Oduzmi ${S(b)}, pa podijeli sa ${S(coefficient)}.`,`x=${S(r.sub(b))}:(${S(coefficient)})=${S(x)}.`]);}
    if(mode==='word'&&p.context==='rectangle'){const short=i+5,difference=l+3,perimeter=2*(2*short+difference);return one(`Pravougaonik ima obim ${perimeter} cm. Jedna stranica je za ${difference} cm duža od druge. Odredi kraću.`,short,[`Stranice su x i x+${difference}.`,`2(x+x+${difference})=${perimeter}; x=${short} cm.`]);}
    if(mode==='word'&&p.context==='consecutive'){const first=i-100,sum=3*first+3;return one(`Zbir tri uzastopna cijela broja je ${sum}. Odredi najmanji.`,first,[`x+(x+1)+(x+2)=${sum}; 3x+3=${sum}.`,`x=${first}.`]);}
    return baseHandlers.equation(c);
  };
  handlers.inequality=c=>{
    if(c.p.bothSides){const x=R(c.i-85).div(c.l===3?3:1),a=c.l+3,b=c.l+1,n=c.i%17-8,r=x.mul(a-b).add(n);return text(`Riješi ${a}x ${signed(n)} < ${b}x ${signed(r)}.`,`x < ${S(x)}`,[`(${a}−${b})x<${S(r.sub(n))}.`,`Podijeli pozitivnim ${a-b}: x<${S(x)}.`]);}
    return baseHandlers.inequality(c);
  };
  handlers.vector=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=i-80,b=l+3,d=l+2,e=l-5;
    if(mode==='subtract'&&p.target==='points')return many(`Odredi vektor AB za A(${a};${b}), B(${a+d};${b+e}).`,[f('x','x-komponenta',d),f('y','y-komponenta',e)],[`AB=B−A=(${a+d}−(${a});${b+e}−${b})=(${d};${e}).`]);
    if(mode==='scale'&&p.sign==='negative'){const k=-(l+1);return many(`Odredi ${k}u za u=(${a};${b}).`,[f('x','x-komponenta',a*k),f('y','y-komponenta',b*k)],[`Pomnoži obje komponente sa ${k}: (${a*k};${b*k}).`]);}
    if(mode==='add'&&p.target==='unknown')return many(`Za u=(${a};${b}) i u+v=(${a+d};${b+e}) odredi nepoznati v.`,[f('x','x-komponenta',d),f('y','y-komponenta',e)],[`v=(u+v)−u=(${d};${e}).`]);
    return baseHandlers.vector(c);
  };
  handlers.pythagoras=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,t=i+2;
    if(mode==='rectangle'&&p.kind==='square'){const value=t*Math.SQRT2;return many(`Kvadrat ima stranicu ${t} cm. Odredi dijagonalu na dvije decimale.`,[f('answer','Dijagonala (cm)',value,'number',0.0051)],[`d²=a²+a²=2a²; d=a√2=${t}√2≈${value.toFixed(2)} cm.`]);}
    if(mode==='height'&&p.kind==='equilateral'){const side=2*t,value=t*Math.sqrt(3);return many(`Jednakostranični trougao ima stranicu ${side} cm. Odredi visinu na dvije decimale.`,[f('answer','Visina (cm)',value,'number',0.0051)],[`h²=${side}²−${t}²=${3*t*t}.`,`h=${t}√3≈${value.toFixed(2)} cm.`]);}
    if(mode==='leg'&&p.context==='ladder')return one(`Ljestve dužine ${5*t} m naslonjene su na zid. Donji kraj je ${3*t} m od zida. Koliko visoko na zidu doseže gornji kraj?`,4*t,[`h²=(${5*t})²−(${3*t})²=${16*t*t}.`,`h=${4*t} m.`]);
    return baseHandlers.pythagoras(c);
  };
  handlers.circle=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,r=R(i+10).div(10),pi=R('3.14');
    if(p.inverse&&mode==='perimeter'){const perimeter=pi.mul(r).mul(2);return one(`Kružnica ima obim ${S(perimeter)} cm. Uz π=3,14 odredi poluprečnik.`,S(r),[`r=O/(2π)=${S(perimeter)}/6,28=${S(r)} cm.`]);}
    if(p.inverse&&mode==='area'){const area=pi.mul(r.pow(2));return one(`Krug ima površinu ${S(area)} cm². Uz π=3,14 odredi poluprečnik.`,S(r),[`r²=P/π=${S(r.pow(2))}.`,`r=${S(r)} cm.`]);}
    if(mode==='arc'&&p.target==='angle'){const angle=R(i+15),arc=pi.mul(r).mul(2).mul(angle).div(360);return one(`Kružnica ima poluprečnik ${S(r)} cm i luk dužine ${S(arc)} cm. Uz π=3,14 odredi pripadni centralni ugao.`,S(angle),[`α=360·l/(2πr)=${S(angle)}°.`]);}
    return baseHandlers.circle(c);
  };
  handlers.function=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,k=R(i+2).div(p.coefficientType==='fraction'||l===3?2:1),n=p.intercept===0?R(0):R(i%19+1),x=R(i-85).div(l===3?3:1),y=k.mul(x).add(n);
    if(mode==='intercept'&&p.target!=='from-point')return many(`Odredi presjek grafika y=${S(k)}x ${signed(n)} sa y-osom.`,[f('x','x presjeka',0),f('y','y presjeka',S(n))],[`Na y-osi je x=0.`,`y=${S(k)}·0 ${signed(n)}=${S(n)}; presjek je (0;${S(n)}).`]);
    if(mode==='value'&&p.degree===2){const a=l+1,b=i%7-3,d=i+5,value=R(a).mul(x.pow(2)).add(x.mul(b)).add(d);return one(`Za y=${a}x² ${signed(b)}x+${d} odredi y za x=${S(x)}.`,S(value),[`Prvo x²=${S(x.pow(2))}.`,`y=${a}·(${S(x.pow(2))})+(${b})·(${S(x)})+${d}=${S(value)}.`]);}
    if(mode==='value'&&p.target==='x')return one(`Funkcija y=${S(k)}x ${signed(n)} ima vrijednost y=${S(y)}. Odredi x.`,S(x),[`kx=y−n=${S(y.sub(n))}.`,`x=${S(y.sub(n))}/${S(k)}=${S(x)}.`]);
    if(mode==='value'&&p.target==='membership'){const proposed=i%2?y:y.add(1);return text(`Pripada li A(${S(x)};${S(proposed)}) grafiku y=${S(k)}x ${signed(n)}? Upiši da ili ne.`,i%2?'da':'ne',[`Za x=${S(x)} funkcija daje ${S(y)}.`,`To ${i%2?'jeste':'nije'} zadata y-koordinata.`]);}
    if(mode==='value')return one(`Za y=${S(k)}x ${signed(n)} izračunaj y kada je x=${S(x)}.`,S(y),[`Uvrsti: y=${S(k)}·(${S(x)}) ${signed(n)}=${S(y)}.`]);
    if(mode==='monotonic'){const slope=p.slopeSign==='zero'?R(0):p.slopeSign==='negative'?k.neg():k,kind=N(slope)===0?'konstantna':N(slope)>0?'rastuća':'opadajuća';return text(`Kakva je funkcija y=${S(slope)}x ${signed(n)}: rastuća, opadajuća ili konstantna?`,kind,[`k=${S(slope)}, pa je funkcija ${kind}.`]);}
    if(mode==='slope'&&p.target==='parallel'){const k2=i%2?k:k.add(1);return text(`Jesu li grafici y=${S(k)}x+${i+1} i y=${S(k2)}x−${i+2} paralelni? Upiši da ili ne.`,i%2?'da':'ne',[`Paralelne različite prave imaju isti koeficijent smjera.`,`Koeficijenti ${S(k)} i ${S(k2)} ${i%2?'jednaki':'nisu jednaki'}.`]);}
    if(mode==='parameter'&&p.target==='zero'){const zero=i+2,m=i+3;return one(`Funkcija y=mx−${m*zero} ima nulu x=${zero}. Odredi parametar m.`,m,[`Za nulu je y=0: 0=${zero}m−${m*zero}.`,`m=${m*zero}/${zero}=${m}.`]);}
    if(mode==='inverse'&&p.target==='constant'){const xx=i+2,yy=l+4;return one(`Funkcija y=k/x prolazi kroz (${xx};${yy}). Odredi k.`,xx*yy,[`k=xy=${xx}·${yy}=${xx*yy}.`]);}
    return baseHandlers.function(c);
  };
  handlers.system=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode;let x=R(i-85).div(p.solutionType==='fraction'?3:1),y=R(i%13-6),a=R(l+2),b=R(l+1),d=R(l+3),e=R(l+2);
    if(p.solutionSign==='mixed'){x=R(i+2).neg();y=R(l+3);}
    if(p.coefficientType==='decimal'){a=a.div(10);b=b.div(10);d=d.div(10);e=e.div(10);}
    let u=a.mul(x).add(b.mul(y)),v=d.mul(x).add(e.mul(y));
    if(mode==='classification'&&p.kind){const multiplier=l+2,second=u.mul(multiplier).add(p.kind==='none'?1:0);return text(`Odredi broj rješenja sistema ${S(a)}x+${S(b)}y=${S(u)}; ${S(a.mul(multiplier))}x+${S(b.mul(multiplier))}y=${S(second)}. Upiši jedno, nijedno ili beskonačno.`,p.kind==='none'?'nijedno':'beskonačno',[`Lijeva strana druge je ${multiplier} puta prva.`,p.kind==='none'?'Desna strana nije odgovarajući višekratnik: nema rješenja.':'Desna je isti višekratnik: beskonačno mnogo rješenja.']);}
    if(mode==='classification'&&p.target==='verify'){const candidate=i%2?y:y.add(1);return text(`Je li (${S(x)};${S(candidate)}) rješenje sistema ${S(a)}x+${S(b)}y=${S(u)}; ${S(d)}x+${S(e)}y=${S(v)}? Upiši da ili ne.`,i%2?'da':'ne',[`Provjeri obje jednačine. Za zadani par prva lijeva strana je ${S(a.mul(x).add(b.mul(candidate)))}.`,`Par ${i%2?'zadovoljava':'ne zadovoljava'} sistem.`]);}
    if(mode==='substitution'&&p.isolate){const coeff=l+2,constant=i%11-5;
      if(p.isolate==='y'){y=x.mul(coeff).add(constant);u=x.mul(a).add(y.mul(b));return many(`Metodom zamjene riješi y=${coeff}x ${signed(constant)}; ${S(a)}x+${S(b)}y=${S(u)}.`,[f('x','x',S(x)),f('y','y',S(y))],[`Uvrsti prvi izraz u drugu: (${S(a)}+${S(b)}·${coeff})x=${S(u.sub(b.mul(constant)))}.`,`x=${S(x)}; y=${S(y)}.`]);}
      x=y.mul(coeff).add(constant);v=x.mul(d).add(y.mul(e));return many(`Metodom zamjene riješi x=${coeff}y ${signed(constant)}; ${S(d)}x+${S(e)}y=${S(v)}.`,[f('x','x',S(x)),f('y','y',S(y))],[`Uvrsti x u drugu jednačinu i izdvoji y.`,`y=${S(y)}; x=${S(x)}.`]);
    }
    if(mode==='elimination'&&p.scale===false){e=b.neg();v=d.mul(x).add(e.mul(y));return many(`Eliminacijom riješi ${S(a)}x+${S(b)}y=${S(u)}; ${S(d)}x−${S(b)}y=${S(v)}.`,[f('x','x',S(x)),f('y','y',S(y))],[`Saberi jednačine: ${S(a.add(d))}x=${S(u.add(v))}.`,`x=${S(x)}; uvrštavanjem y=${S(y)}.`]);}
    if(mode==='word'&&p.context==='sum-difference'){const first=i+20,second=l+5;return many(`Zbir dva broja je ${first+second}, a razlika prvog i drugog ${first-second}. Odredi oba broja.`,[f('first','Prvi broj',first),f('second','Drugi broj',second)],[`x+y=${first+second}, x−y=${first-second}.`,`Sabiranjem: 2x=${2*first}, x=${first}; y=${second}.`]);}
    if(mode==='word'&&p.context==='age'){const child=5+i%10,diff=20+Math.floor(i/10),parent=child+diff;return many(`Zbir godina roditelja i djeteta je ${parent+child}, a razlika ${diff}. Odredi njihove godine.`,[f('parent','Roditelj',parent),f('child','Dijete',child)],[`x+y=${parent+child}; x−y=${diff}.`,`Roditelj=${parent}, dijete=${child}.`]);}
    if(mode==='word'&&p.context==='rectangle'){const first=i+10,second=l+5,O=2*(first+second);return many(`Obim pravougaonika je ${O} cm, a razlika stranica ${first-second} cm. Odredi dužu i kraću stranicu.`,[f('long','Duža (cm)',first),f('short','Kraća (cm)',second)],[`x+y=${O/2}; x−y=${first-second}.`,`Rješavanjem x=${first}, y=${second}.`]);}
    if(mode==='substitution'||mode==='elimination')return many(`Riješi sistem ${S(a)}x+${S(b)}y=${S(u)}; ${S(d)}x+${S(e)}y=${S(v)}.`,[f('x','x',S(x)),f('y','y',S(y))],[`Determinanta D=${S(a.mul(e).sub(b.mul(d)))}≠0.`,`x=(ue−bv)/D=${S(x)}; y=(av−ud)/D=${S(y)}.`,`Uvrsti dobiveni par u obje početne jednačine.`]);
    return baseHandlers.system(c);
  };
  handlers.similarity=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,k=R(l+1).div(l===3?2:1),a=R(i+3),b=R(l+5),P=a.mul(b);
    if(mode==='side'&&p.inverse)return one(`Od manjeg prema većem sličnom liku faktor je ${S(k)}. Stranica većeg je ${S(a.mul(k))} cm. Odredi odgovarajuću stranicu manjeg.`,S(a),[`a₁=a₂/k=${S(a.mul(k))}/${S(k)}=${S(a)} cm.`]);
    if(p.target==='scale'&&mode==='perimeter')return one(`Slični likovi imaju obime ${S(a)} cm i ${S(a.mul(k))} cm. Odredi faktor od prvog prema drugom.`,S(k),[`k=O₂/O₁=${S(k)}.`]);
    if(p.target==='scale'&&mode==='area')return one(`Slični likovi imaju površine ${S(P)} cm² i ${S(P.mul(k.pow(2)))} cm². Odredi faktor od prvog prema drugom.`,S(k),[`k²=P₂/P₁=${S(k.pow(2))}; k=${S(k)}>0.`]);
    if(mode==='area'&&p.inverse)return one(`Maketa i stvarni lik imaju faktor ${S(k)} od makete prema stvarnom liku. Stvarna površina je ${S(P.mul(k.pow(2)))} cm². Odredi površinu makete.`,S(P),[`P₁=P₂/k²=${S(P.mul(k.pow(2)))}/${S(k.pow(2))}=${S(P)} cm².`]);
    if(mode==='thales'&&p.target==='parallel-segment'){const AB=a.mul(k.add(1)),BC=b.mul(k.add(1));return one(`U trouglu ABC, DE∥BC, D∈AB, E∈AC. AD=${S(a)} cm, AB=${S(AB)} cm, BC=${S(BC)} cm. Odredi DE.`,S(b),[`DE/BC=AD/AB.`,`DE=${S(BC)}·${S(a)}/${S(AB)}=${S(b)} cm.`]);}
    if(mode==='thales'&&p.target==='split'){const DB=a.mul(k),AE=b,EC=b.mul(k);return one(`DE∥BC u trouglu ABC, D∈AB, E∈AC. AD=${S(a)} cm, DB=${S(DB)} cm, AE=${S(AE)} cm. Odredi EC.`,S(EC),[`AD/DB=AE/EC.`,`EC=DB·AE/AD=${S(EC)} cm.`]);}
    return baseHandlers.similarity(c);
  };
  handlers.spatial=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=R(i+10).div(2);
    if(mode==='supplement'&&p.target==='difference'){const diff=R(i+1).div(2),first=R(180).sub(diff).div(2);return many(`Dva susjedna diedra imaju nezajedničke strane u jednoj ravni. Drugi je za ${S(diff)}° veći od prvog. Odredi oba.`,[f('first','Prvi (°)',S(first)),f('second','Drugi (°)',S(first.add(diff)))],[`α+β=180°, β=α+${S(diff)}°.`,`2α=180−${S(diff)}; α=${S(first)}°, β=${S(first.add(diff))}°.`]);}
    if(mode==='normal'&&p.target==='right')return one(`U kocki ivice ${i+2} cm dvije susjedne strane imaju prav normalni presjek. Kolika je mjera njihovog diedra?`,90,[`Normalni presjek daje pravi ugao, pa je diedar 90°.`]);
    if(mode==='normal'&&p.target==='definition')return text(`Kosi presjek strana diedra pokazuje ${S(a)}°. Može li se iz tog podatka neposredno zaključiti mjera diedra? Upiši da ili ne.`, 'ne',[`Mjera diedra određena je normalnim presjekom okomitim na zajedničku ivicu.`,`Kosi presjek ne mora dati istu mjeru.`]);
    if(mode==='normal'&&p.target==='distance')return one(`Iz tačke A povučena je normala na ravan α. Nožište je N, a dužina AN=${S(a)} cm. Koliko je rastojanje A od ravni?`,S(a),[`Rastojanje tačke od ravni je dužina normale: ${S(a)} cm.`]);
    if(mode==='planes'&&p.target==='line-plane'){const type=i%3,prompt=type===0?`Prava p ima dvije različite tačke u ravni α, udaljene ${i+1} cm.`:type===1?`Prava p nema zajedničkih tačaka s ravni α i njena tačka je udaljena ${i+1} cm od ravni.`:`Prava p ima tačno jednu zajedničku tačku s ravni α; dio p izvan ravni dug je ${i+1} cm.`,answer=type===0?'leži u ravni':type===1?'paralelna':'siječe';return text(prompt+' Odredi odnos: leži u ravni, paralelna ili siječe.',answer,[`Iz broja zajedničkih tačaka slijedi odnos „${answer}“.`]);}
    if(mode==='planes'&&p.target==='skew')return text(`Na kvadru ivica ${i+2}, ${l+3}, ${l+4} cm posmatraj AB i CC₁ u standardnom označavanju ABCD–A₁B₁C₁D₁. One nisu paralelne i ne sijeku se. Kako se zovu takve prave?`, 'mimoilazne',[`Prave koje nisu u jednoj ravni, nisu paralelne i ne sijeku se zovu se mimoilazne.`]);
    if(mode==='planes'){const kind=i%2?'sijeku se':'paralelne';return text(i%2?`Dvije ravni imaju zajedničku pravu i diedar ${S(a)}°. Odredi odnos: paralelne ili sijeku se.`:`Dvije različite ravni nemaju zajedničkih tačaka, a rastojanje je ${i+1} cm. Odredi odnos: paralelne ili sijeku se.`,kind,[`Odnos je „${kind}“ prema zajedničkim tačkama.`]);}
    return baseHandlers.spatial(c);
  };
  handlers.solid=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,a=R(i+10).div(5),b=R(l+3),h=R(l+4),pi=R('3.14');
    if(mode==='cube'&&p.measure==='edge'){const V=a.pow(3);return one(`Kocka ima zapreminu ${S(V)} cm³. Odredi ivicu.`,S(a),[`a³=V=${S(V)}; a=${S(a)} cm jer (${S(a)})³=${S(V)}.`]);}
    if(mode==='diagonal'&&p.shape==='cube'){const side=i+2,value=side*Math.sqrt(3);return many(`Kocka ima ivicu ${side} cm. Odredi prostornu dijagonalu na dvije decimale.`,[f('answer','Dijagonala (cm)',value,'number',0.0051)],[`d=√(a²+a²+a²)=a√3=${side}√3≈${value.toFixed(2)} cm.`]);}
    if(mode==='cuboid'&&p.measure==='height'){const V=a.mul(b).mul(h);return one(`Kvadar ima zapreminu ${S(V)} cm³ i osnovne ivice ${S(a)} cm i ${S(b)} cm. Odredi visinu.`,S(h),[`h=V/(ab)=${S(V)}/(${S(a)}·${S(b)})=${S(h)} cm.`]);}
    if(mode==='cuboid'&&p.measure==='open-surface'){const P=a.mul(b).add(a.add(b).mul(h).mul(2));return one(`Otvorena pravougaona posuda nema poklopac. Dno je ${S(a)}×${S(b)} cm, visina ${S(h)} cm. Odredi površinu materijala.`,S(P),[`Jedno dno i četiri bočne strane: P=ab+2ah+2bh=${S(P)} cm².`]);}
    if(mode==='prism'&&p.measure==='height'){const B=a.pow(2).mul(6),V=B.mul(h);return one(`Prava prizma ima površinu osnove ${S(B)} cm² i zapreminu ${S(V)} cm³. Odredi visinu.`,S(h),[`h=V/B=${S(V)}/${S(B)}=${S(h)} cm.`]);}
    if(mode==='prism'&&p.measure==='lateral'){const O=a.mul(12),M=O.mul(h);return one(`Prava prizma ima obim osnove ${S(O)} cm i visinu ${S(h)} cm. Odredi omotač.`,S(M),[`M=Oh=${S(O)}·${S(h)}=${S(M)} cm².`]);}
    if(mode==='pyramid'&&p.measure==='height'){const B=a.mul(6).pow(2),height=a.mul(4),V=B.mul(height).div(3);return one(`Piramida ima površinu osnove ${S(B)} cm² i zapreminu ${S(V)} cm³. Odredi visinu.`,S(height),[`h=3V/B=3·${S(V)}/${S(B)}=${S(height)} cm.`]);}
    if(mode==='cylinder'&&p.measure==='height'){const V=pi.mul(a.pow(2)).mul(h);return one(`Valjak ima poluprečnik ${S(a)} cm i zapreminu ${S(V)} cm³. Uz π=3,14 odredi visinu.`,S(h),[`h=V/(πr²)=${S(h)} cm.`]);}
    if(mode==='cone'&&p.measure==='slant'){const r=a.mul(3),height=a.mul(4),s=a.mul(5);return one(`Kupa ima poluprečnik ${S(r)} cm i visinu ${S(height)} cm. Odredi izvodnicu.`,S(s),[`s²=r²+h²=${S(s.pow(2))}; s=${S(s)} cm.`]);}
    if(mode==='sphere'&&p.measure==='radius'){const P=pi.mul(a.pow(2)).mul(4);return one(`Sfera ima površinu ${S(P)} cm². Uz π=3,14 odredi poluprečnik.`,S(a),[`r²=P/(4π)=${S(a.pow(2))}; r=${S(a)} cm.`]);}
    return baseHandlers.solid(c);
  };
  handlers.statistics=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode,base=i+l*10,data=[base,base+2,base+4,base+6],sum=data.reduce((a,b)=>a+b,0);
    if(mode==='median'&&p.parity==='even'){const mixed=[data[3],data[0],data[2],data[1]],median=R(data[1]+data[2]).div(2);return one(`Odredi medijan parnog broja podataka: ${mixed.join('; ')}.`,S(median),[`Poredaj: ${data.join('; ')}.`,`Medijan=(drugi+treći)/2=(${data[1]}+${data[2]})/2=${S(median)}.`]);}
    if(mode==='mean'&&p.target==='missing'){const unknown=base+8,mean=R(sum+unknown).div(5);return one(`Pet podataka ima sredinu ${S(mean)}. Četiri su ${data.join('; ')}. Odredi peti.`,unknown,[`Ukupan zbir=5·${S(mean)}=${sum+unknown}.`,`Peti=${sum+unknown}−${sum}=${unknown}.`]);}
    if(mode==='mean'&&p.target==='updated'){const mean=R(sum).div(4),added=base+l+10,newMean=R(sum+added).div(5);return one(`Četiri podatka imaju aritmetičku sredinu ${S(mean)}. Dodan je podatak ${added}. Odredi novu sredinu pet podataka.`,S(newMean),[`Stari zbir=4·${S(mean)}=${sum}.`,`Novi zbir=${sum}+${added}=${sum+added}; nova sredina=${S(newMean)}.`]);}
    if(mode==='frequency'&&p.target){const values=[base,base+1,base+1,base+2,base+1,base+3],answer=p.target==='absolute'?3:'1/2';return one(`U nizu ${values.join('; ')} odredi ${p.target==='absolute'?'apsolutnu':'relativnu'} frekvenciju vrijednosti ${base+1}${p.target==='relative'?' kao razlomak':''}.`,answer,[`${base+1} se pojavljuje 3 puta u 6 podataka.`,p.target==='absolute'?'Apsolutna frekvencija=3.':'Relativna frekvencija=3/6=1/2.']);}
    return baseHandlers.statistics(c);
  };
  handlers.probability=c=>{
    const {p,i,l}=c,mode=c.t.practice.mode;
    if(mode==='simple'&&p.context==='die'){const dice=1+i%6;if(p.target==='single')return one(`Pravilna kocka s brojevima 1–6 baca se jednom. Odredi vjerovatnoću broja ${dice}.`,'1/6',[`Svih 6 ishoda je jednako vjerovatno; povoljan je samo ${dice}.`,`P=1/6.`]);return one(`Pravilna kocka s brojevima 1–6 baca se jednom. Odredi vjerovatnoću parnog broja.`,'1/2',[`Povoljni su 2,4,6: ukupno 3 od 6.`,`P=3/6=1/2.`]);}
    if(mode==='independent'&&p.context==='coin-die'){const threshold=1+i%5,count=6-threshold;return one(`Nezavisno se bacaju pravilan novčić i pravilna kocka 1–6. Odredi P(glava i broj veći od ${threshold}).`,S(R(1).div(2).mul(R(count).div(6))),[`P(glava)=1/2; P(broj>${threshold})=${count}/6.`,`Nezavisnost daje proizvod: ${S(R(count).div(12))}.`]);}
    if(mode==='union'){const total=i+20,A=l+5,B=l+7,overlap=l+1;return one(`Među ${total} jednako vjerovatnih ishoda događaj A ima ${A}, B ima ${B}, a A∩B ima ${overlap} ishoda. Odredi P(A∪B).`,S(R(A+B-overlap).div(total)),[`Broj ishoda unije=A+B−presjek=${A}+${B}−${overlap}=${A+B-overlap}.`,`P=${A+B-overlap}/${total}=${S(R(A+B-overlap).div(total))}.`]);}
    if(mode==='counting'&&p.kind==='ordered-without-repetition'){const n=i+3;return one(`Od ${n} učenika biramo predsjednika i zamjenika, dvije različite osobe. Koliko je uređenih izbora?`,n*(n-1),[`Prvi izbor ima ${n}, drugi ${n-1} mogućnosti.`,`Ukupno ${n}·${n-1}=${n*(n-1)}.`]);}
    return baseHandlers.probability(c);
  };

  function generate(topicId,seed=1,difficulty='medium'){
    const topic=topics.find(t=>t.id===topicId);
    if(!topic)return E.generate(topicId,seed,difficulty);
    const c=ctx(topic,seed,difficulty),handler=handlers[topic.practice.family];
    if(!handler)throw new Error('Nepoznata porodica zadataka: '+topic.practice.family);
    const task=handler(c);
    if(!task)throw new Error('Nepodržan način zadatka: '+topic.practice.family+'/'+topic.practice.mode);
    return {...task,id:topic.id+'-'+difficulty+'-'+(c.i+1),topicId:topic.id,grade:topic.grade,title:topic.title,difficulty,variant:c.i+1};
  }
  return Object.freeze({topics:Object.freeze(topics.map(t=>Object.freeze({...t,variantCount:variantsPerTopic}))),variantsPerTopic,generate,checkField:E.checkField,check:E.check});
});
