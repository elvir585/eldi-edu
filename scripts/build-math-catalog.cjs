/* Curated learning skills, not 500 renamed random-number templates.
 * Every line names a distinct goal and includes an independently worked example.
 * Grade placement is an editorial progression, not a certified regional syllabus.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const items=[];
const rules={
 numeral:['U decimalnom sistemu mjesto cifre određuje njenu vrijednost. Svako mjesto lijevo vrijedi deset puta više; nula čuva prazno mjesto. Broj se može rastaviti na zbir cifara pomnoženih mjesnim vrijednostima.','Poređenje provjeri od najviše mjesne vrijednosti. Pri zaokruživanju pogledaj prvu odbačenu cifru: 0–4 ne mijenjaju zadržani dio, a 5–9 ga povećavaju za jedan.'],
 arithmetic:['Sabiranje i oduzimanje su obrnute operacije, kao i množenje i dijeljenje nenultim brojem. Zagrade imaju prednost; množenje i dijeljenje izvode se prije sabiranja i oduzimanja, slijeva nadesno unutar iste prednosti.','Provjeri rezultat obrnutom operacijom i procjenom veličine. Pri dijeljenju s ostatkom mora vrijediti a=dq+r i 0≤r<d; dijeljenje nulom nije definisano.'],
 word:['Tekst prevedi na podatke, nepoznatu i odnose. Riječi „ukupno“, „razlika“, „po“ ili „jednako dijelimo“ često upućuju na operaciju, ali cijeli smisao teksta odlučuje koji izraz treba napisati.','Zapiši račun s mjernom jedinicom i rečenicu odgovora. Dobiveni broj uvrsti u prvobitni odnos; negativna količina knjiga ili neintegralan broj osoba traži ponovni pregled modela.'],
 units:['Jednake veličine mogu se zapisati različitim jedinicama. Dužina se pretvara linearnim faktorom, površina kvadratom tog faktora, a zapremina njegovim kubom. Vrijeme koristi 60 minuta u satu, a ne decimalni faktor 100.','Sve sabirke najprije pretvori u istu jedinicu. U odgovoru razlikuj cm, cm² i cm³. Prilikom pretvaranja u manju jedinicu broj raste, dok sama veličina ostaje ista.'],
 sets:['Skup određuju njegovi elementi bez obzira na redoslijed i ponavljanje. Presjek sadrži zajedničke elemente, unija sve elemente iz oba skupa, a razlika A\\B elemente prvog koji nisu u drugom.','Broji različite elemente samo jednom. Kod komplementa prvo odredi univerzalni skup; bez njega izraz „svi ostali elementi“ nije jednoznačan.'],
 sequence:['Pravilo niza opisuje kako se članovi povezuju. Kod stalne razlike važi aₙ=a₁+(n−1)d; kod stalnog količnika svaki sljedeći član dobiva se množenjem istim faktorom.','Pronađeno pravilo provjeri na svim ponuđenim članovima. Konačan niz može imati više nastavaka, zato koristi zadano pravilo i ne tvrdi da je jedan nastavak jedini mogući bez dodatnog uslova.'],
 divisibility:['Broj je djeljiv d ako pri dijeljenju ima ostatak nula. Za 2, 5 i 10 odlučuje posljednja cifra; za 4 i 25 posljednje dvije; za 3 i 9 zbir cifara. Za 6 trebaju istovremeno 2 i 3, a za 15 istovremeno 3 i 5.','Pravilo koristi kao skraćenu provjeru, zatim po potrebi pokaži jednakost n=dq. Kod nepoznate cifre pregledaj sve cifre 0–9 i izostavi vodeću nulu ako bi promijenila broj cifara.'],
 primes:['Prost prirodan broj veći od 1 ima tačno dva pozitivna djelioca. Složen broj ima više od dva; broj 1 nije ni prost ni složen. Rastav na proste faktore zapisan je kao proizvod prostih brojeva, s ponavljanjem.','Za provjeru prostosti dovoljno je provjeriti proste djelioce do kvadratnog korijena. Proizvod faktora mora vratiti prvobitni broj; jedinica nije prost faktor.'],
 gcdlcm:['NZD je najveći zajednički djelilac, a NZS najmanji pozitivni zajednički sadržalac. Pri rastavu NZD uzima najmanje eksponente zajedničkih prostih faktora; NZS uzima najveće eksponente svih faktora.','Za dva pozitivna broja provjeri NZD(a,b)·NZS(a,b)=a·b. Pri raspodjeli u najveće jednake grupe koristi NZD; kod prvog ponovnog istovremenog događaja obično koristi NZS.'],
 fraction:['Razlomak a/b predstavlja količnik uz b≠0. Proširivanje i skraćivanje istim nenultim faktorom čuvaju vrijednost. Sabiranje i oduzimanje traže zajednički nazivnik; množenje množi brojioce i nazivnike, a dijeljenje koristi recipročan drugi razlomak.','Rezultat skrati do neskrativog oblika. Poređenje provjeri zajedničkim nazivnikom ili unakrsnim proizvodima uz pozitivne nazivnike. Reciprocitet nule nije definisan.'],
 decimal:['Decimalni zapis ima desetine, stotine i hiljadite. Pri sabiranju poravnaj decimalne zareze; pri množenju broj decimalnih mjesta dolazi iz oba faktora. Pri dijeljenju pomjeri zarez u oba broja jednako da djelilac postane cijeli broj.','Procijeni rezultat prije računa. Nule na kraju decimalnog dijela ne mijenjaju vrijednost. Konačan decimalni zapis pretvori u razlomak s nazivnikom 10, 100 ili 1000 i zatim skrati.'],
 integer:['Cijeli brojevi uključuju negativne brojeve, nulu i pozitivne brojeve. Apsolutna vrijednost je udaljenost od nule. Oduzimanje je sabiranje suprotnog broja; pri množenju i dijeljenju jednaki predznaci daju plus, različiti minus.','Negativan broj piši u zagradi kada je faktor ili oduzimani član. Veći negativan broj po apsolutnoj vrijednosti nalazi se lijevo na brojevnoj pravoj i zato je manji.'],
 rational:['Racionalni brojevi imaju oblik a/b, gdje su a i b cijeli i b≠0. Predznak se može zapisati ispred razlomka. Računska pravila razlomaka primjenjuju se uz pravila predznaka cijelih brojeva.','Koristi tačne razlomke do završetka postupka. Zagrade razdvajaju negativnu osnovu od predznaka ispred izraza; posebno provjeri nazivnik i zabranu dijeljenja nulom.'],
 percent:['Procenat p% znači p/100 cjeline. Dio se računa množenjem cjeline p/100; cjelina se dobiva dijeljenjem poznatog dijela tim razlomkom. Povećanje ili smanjenje množi početni iznos sa 1±p/100.','Uvijek napiši na koju se osnovicu procenat odnosi. Uzastopne promjene primjenjuju se na novu osnovicu, pa se stope ne smiju jednostavno sabrati. Razlikuj procenat i procentni poen.'],
 ratio:['Omjer a:b poredi dvije veličine istih ili navedenih jedinica. Proporcija izjednačava dva omjera; proizvod vanjskih članova jednak je proizvodu unutrašnjih. Direktna proporcionalnost ima stalan količnik, obrnuta stalan proizvod.','Kod podjele u omjeru cjelinu podijeli zbirom omjernih brojeva. Na karti prvo primijeni razmjeru u istoj jedinici, zatim pretvori dužinu u traženu jedinicu.'],
 angle:['Komplementni uglovi imaju zbir 90°, suplementni 180°. Unakrsni uglovi su jednaki. Uz paralelne prave saglasni i naizmjenični uglovi su jednaki, a unutrašnji s iste strane transverzale suplementni.','U trouglu zbir unutrašnjih uglova iznosi 180°, a u n-terouglu (n−2)·180°. Nacrtaj odnos i provjeri da li računaš unutrašnji, vanjski, centralni ili diedarski ugao.'],
 triangle:['Trougao ima tri stranice i tri ugla. Zbir dva ugla oduzima se od 180° za treći; svaka stranica mora biti manja od zbira druge dvije. Površina je osnovica puta odgovarajuća normalna visina, podijeljeno sa dva.','Ne zamijeni visinu kosom stranicom. Kod jednakokrakog trougla uglovi na osnovici su jednaki; kod jednakostraničnog svi uglovi su 60°. Obim je zbir dužina svih stranica.'],
 quadrilateral:['Četverougao ima zbir unutrašnjih uglova 360°. Pravougaonik ima P=ab, kvadrat P=a², paralelogram P=ah, trapez P=(a+b)h/2, a romb i deltoid P=d₁d₂/2 kada su dijagonale normalne.','Formulu uskladi s poznatim veličinama: visina je normalno rastojanje, a ne susjedna stranica. Provjeri da zbir stranica daje obim i da površina ima kvadratnu jedinicu.'],
 circle:['Krug ima prečnik d=2r, obim O=2πr i površinu P=πr². Luk i isječak zauzimaju α/360 punog kruga. Površina prstena je razlika površina vanjskog i unutrašnjeg kruga.','Razlikuj poluprečnik i prečnik te površinu i obim. Ako je zadano π=3,14, koristi tu vrijednost u cijelom računu; kada koristiš π s kalkulatora, zaokruži tek završni rezultat.'],
 coordinate:['Tačka u ravni ima uređeni par (x,y): prvo se kreće po horizontalnoj osi, zatim po vertikalnoj. Središte duži dobiva se sredinama odgovarajućih koordinata, a rastojanje Pitagorinom teoremom.','Tačke na osama nisu u kvadrantima. Zrcaljenje u x-osi mijenja znak y, u y-osi znak x, a u ishodištu oba znaka. Uređeni par nije neuređen skup.'],
 vector:['Vektor u koordinatama ima horizontalnu i vertikalnu komponentu. Sabiranje, oduzimanje i množenje skalarom izvode se po komponentama. Vektor AB dobiva se oduzimanjem koordinata A od B.','Redoslijed početne i završne tačke je važan: BA=−AB. Dužina vektora je nenegativna. Paralelnost u ravni može se provjeriti nultom determinantnom komponenti.'],
 power:['Stepen aⁿ je proizvod n jednakih faktora. Pri množenju iste osnove eksponenti se sabiraju, pri dijeljenju oduzimaju, a pri stepenu stepena množe. Za a≠0 važi a⁰=1 i a⁻ⁿ=1/aⁿ.','Negativnu osnovu stavi u zagradu: (−a)² i −a² nisu jednaki. Naučni zapis ima koeficijent najmanje 1 i manji od 10. Pravila iste osnove ne primjenjuju se na zbir stepena.'],
 root:['Glavni kvadratni korijen je nenegativan broj čiji kvadrat daje zadanu nenegativnu vrijednost. Korijen proizvoda nenegativnih brojeva može se razdvojiti; potpuni kvadrat izdvaja se iz korijena.','Za realne brojeve √(a²)=|a|. Korijen zbira uglavnom nije zbir korijena. Procjenu potvrdi između susjednih potpunih kvadrata prije decimalnog zaokruživanja.'],
 polynomial:['Polinom se sređuje sabiranjem sličnih članova, koji imaju isti promjenljivi dio. Pri množenju svaki član prvog faktora množi svaki član drugog. Vrijednost polinoma dobiva se uvrštavanjem broja umjesto promjenljive.','Sačuvaj predznake pri oduzimanju polinoma. Formule (a±b)²=a²±2ab+b² i a²−b²=(a−b)(a+b) sadrže različite srednje članove; provjeri ih razvojem proizvoda.'],
 equation:['Jednačina traži vrijednosti za koje su dvije strane jednake. Istom dozvoljenom operacijom na obje strane čuvamo skup rješenja. Zagrade prvo otvori, slične članove sredi i nepoznatu izdvoji.','Rješenje obavezno uvrsti u početnu jednačinu. Jednačina 0x=0 vrijedi za svaku dopuštenu vrijednost, a 0x=c≠0 nema rješenja. Ne dijeli promjenljivim izrazom bez provjere može li biti nula.'],
 inequality:['Nejednačina opisuje skup brojeva. Pri dodavanju ili oduzimanju istog broja znak ostaje; množenje ili dijeljenje negativnim brojem obrće smjer znaka. Složeni uslovi traže presjek pojedinačnih skupova rješenja.','Razlikuj strogu i nestrogu granicu. Probni broj iz skupa i jedan izvan njega uvrsti u početnu nejednačinu. Cjelobrojni odgovor traži najveći ili najmanji dopušteni cijeli broj, ne samo realnu granicu.'],
 function:['Funkcija svakom dopuštenom x pridružuje jedno y. Linearna funkcija y=kx+n ima koeficijent smjera k i presjek y-ose n; njena nula za k≠0 je −n/k. Za y=k/x domen isključuje nulu.','Tačku provjeri uvrštavanjem koordinata. Za dvije tačke s različitim x vrijedi k=(y₂−y₁)/(x₂−x₁). Pozitivan k znači rast, negativan pad; x-osa ima y=0, a y-osa x=0.'],
 system:['Rješenje sistema mora zadovoljavati obje jednačine istovremeno. Metoda zamjene izražava jednu nepoznatu i uvrštava je u drugu jednačinu; eliminacija sabira odgovarajuće višekratnike da ukloni jednu nepoznatu.','Uvrsti dobiveni par u obje početne jednačine. Paralelne različite prave nemaju zajedničko rješenje, podudarne imaju beskonačno mnogo, a prave koje se sijeku jedno.'],
 pythagoras:['U pravouglom trouglu kvadrat hipotenuze jednak je zbiru kvadrata kateta: c²=a²+b². Ako je kateta nepoznata, od kvadrata hipotenuze oduzima se kvadrat druge katete.','Najprije odredi koja stranica leži nasuprot pravom uglu. Hipotenuza mora biti najduža. Kod dijagonale, visine i rastojanja nacrtaj pravougli trougao na koji primjenjuješ teoremu.'],
 similarity:['Slični likovi imaju jednake odgovarajuće uglove i proporcionalne odgovarajuće stranice. Ako je faktor sličnosti k, dužine i obimi mijenjaju se faktorom k, a površine faktorom k².','Napiši korespondenciju vrhova prije proporcije. Talesova teorema traži paralelnost određenih pravih; razmjera površina ne smije se zamijeniti razmjerom stranica.'],
 solid:['Zapremina prizme i valjka je B·h, a piramide i kupe B·h/3. Površina se sastoji od osnova i omotača. Kocka ima P=6a² i V=a³, kvadar P=2(ab+ac+bc) i V=abc.','Razlikuj visinu tijela, apotemu i izvodnicu. Površina ima kvadratnu, zapremina kubnu jedinicu. U zadatku s otvorenom posudom računaju se samo prisutne strane.'],
 spatial:['Prostorne odnose opisujemo tačkama, pravama i ravnima. Diedar čine dvije poluravni sa zajedničkom ivicom; njegova mjera je ugao normalnog presjeka ravni okomite na tu ivicu.','Ne mjeri diedar proizvoljnim kosim presjekom. Susjedni diedri čije nezajedničke strane čine ravan imaju zbir 180°. Mimoilazne prave nisu ni paralelne ni presječne.'],
 statistics:['Aritmetička sredina je zbir podataka podijeljen njihovim brojem. Medijan se dobiva iz uređenog niza; mod je najčešća vrijednost, a raspon razlika najveće i najmanje. Frekvencija govori koliko puta se vrijednost pojavljuje.','Ponovljene podatke uključi u zbir. Za paran broj podataka medijan je sredina dvije srednje vrijednosti. Kod ponderisane sredine dijeli zbirom težina, ne brojem različitih kategorija.'],
 probability:['Za konačan skup jednako vjerovatnih ishoda P(A) je broj povoljnih podijeljen brojem svih ishoda. Komplement ima vjerovatnoću 1−P(A). Za nezavisne događaje vjerovatnoća zajedničkog nastupa je proizvod.','Vjerovatnoća mora biti između 0 i 1. Bez vraćanja drugi izbor mijenja broj preostalih elemenata. Kod unije koja preklapa događaje zajednički ishodi se oduzimaju da se ne broje dvaput.']
};
function block(grade,category,family,text){
 for(const line of text.trim().split('\n')){
  const [title,mode,example,raw,note]=line.split('|').map(x=>x.trim());
  if(!title||!mode||!example) throw new Error('Incomplete catalog line '+line);
  const params=raw?JSON.parse(raw):{};
  const count=items.filter(x=>x.grade===grade).length+1;
  const [rule,check]=rules[family];
  const description=note||`Uvježbati postupak za temu „${title}“ i obrazložiti svaki korak računanja.`;
  items.push({id:`m${grade}-${String(count).padStart(3,'0')}`,grade,subject:'math',title,category,description,
   body:[description,rule,`Razrađeni primjer: ${example} Zapiši međurezultate i navedi zašto je svaka upotrijebljena operacija dopuštena.`,check],
   example,hint:check,practice:{family,mode,params}});
 }
}

// 5. razred: 100 learning skills.
block(5,'Brojevi i decimalni sistem','numeral',`
Cifra jedinica i njen položaj | digit | U broju 57 248 cifra jedinica je 8. | {"place":1}
Cifra desetica i njena vrijednost | place | U broju 57 248 cifra 4 na mjestu desetica vrijedi 40. | {"place":10}
Stotine unutar višecifrenog broja | place | U broju 57 248 cifra stotina 2 vrijedi 200. | {"place":100}
Hiljade u broju | place | U broju 57 248 cifra hiljada 7 vrijedi 7 000. | {"place":1000}
Desetine hiljada | place | U broju 57 248 cifra desetina hiljada 5 vrijedi 50 000. | {"place":10000}
Stotine hiljada | place | U broju 357 248 cifra stotina hiljada 3 vrijedi 300 000. | {"place":100000}
Milioni i brojevi preko miliona | place | U broju 4 357 248 cifra miliona 4 vrijedi 4 000 000. | {"place":1000000}
Rastavljanje broja na mjesne sabirke | expand | 30 406 = 30 000 + 400 + 6; nule se ne dodaju kao posebne vrijednosti.
Sastavljanje broja iz mjesnih vrijednosti | compose | 70 000 + 2 000 + 40 + 9 = 72 049.
Prethodnik prirodnog broja | before | Prethodnik broja 10 000 je 9 999 jer je 10 000−1=9 999.
Sljedbenik prirodnog broja | after | Sljedbenik broja 999 999 je 1 000 000.
Poređenje brojeva različite dužine | compare | 99 999 < 100 000 jer šestocifren prirodan broj nadmašuje svaki petocifren. | {"digitsDifferent":true}
Poređenje brojeva istog broja cifara | compare | 735 206 > 734 999: prve dvije cifre su jednake, a 5>4. | {"digitsDifferent":false}
Uređivanje skupa velikih brojeva | order | 405 060, 405 006, 450 006 u rastućem redu: 405 006; 405 060; 450 006.
Brojevi između zadanih granica | interval | Između 998 i 1 002, bez granica, nalaze se 999, 1 000 i 1 001. | {"inclusive":false}
`);
block(5,'Četiri računske operacije','arithmetic',`
Sabiranje bez prenosa | add | 23 412+14 253=37 665; u svakom stupcu zbir cifara je manji od 10. | {"carry":false}
Sabiranje s jednim prenosom | add | 2 346+1 227=3 573; 6+7=13 donosi prenos 1 u desetice. | {"carry":"one"}
Sabiranje s višestrukim prenosom | add | 28 785+14 697=43 482; prenos se prati u svakom stupcu. | {"carry":"multiple"}
Sabiranje tri velika broja | add | 125 000+75 500+24 500=225 000. | {"terms":3}
Sabiranje brojeva preko miliona | add | 1 234 567+2 345 678=3 580 245. | {"scale":1000000}
Oduzimanje bez posuđivanja | subtract | 85 764−23 421=62 343. | {"borrow":false}
Oduzimanje s posuđivanjem | subtract | 5 302−2 178=3 124; posuđivanje mijenja susjedne mjesne vrijednosti. | {"borrow":true}
Oduzimanje preko više nula | subtract | 10 000−2 347=7 653; provjera 7 653+2 347=10 000. | {"zeros":true}
Razlika velikih brojeva preko miliona | subtract | 4 000 000−1 234 567=2 765 433. | {"scale":1000000}
Množenje jednocifrenim faktorom | multiply | 2 347·6=14 082. | {"factorDigits":1}
Množenje dvocifrenim faktorom | multiply | 234·23=234·20+234·3=4 680+702=5 382. | {"factorDigits":2}
Množenje trocifrenim faktorom | multiply | 124·203=124·200+124·3=24 800+372=25 172. | {"factorDigits":3}
Množenje sa 10, 100 i 1000 | multiply | 47·1 000=47 000. | {"powerTen":1000}
Dijeljenje jednocifrenim djeliocem | divide | 7 392:6=1 232 jer 1 232·6=7 392. | {"divisorDigits":1}
Dijeljenje dvocifrenim djeliocem | divide | 8 736:24=364; 24·364=8 736. | {"divisorDigits":2}
Dijeljenje sa 10, 100 i 1000 | divide | 452 000:1 000=452. | {"powerTen":1000}
Količnik i ostatak | remainder | 157:12 daje q=13, r=1 jer 157=12·13+1.
Nepoznati sabirak | missing-addend | x+2 478=6 030 ⇒ x=6 030−2 478=3 552.
Nepoznati umanjenik | missing-minuend | x−2 135=4 602 ⇒ x=4 602+2 135=6 737.
Nepoznati umanjilac | missing-subtrahend | 9 020−x=3 478 ⇒ x=9 020−3 478=5 542.
Nepoznati faktor | missing-factor | 24·x=1 512 ⇒ x=1 512:24=63.
Nepoznati djeljenik | missing-dividend | x:18=47 ⇒ x=18·47=846.
Nepoznati djelilac | missing-divisor | 936:x=24 ⇒ x=936:24=39.
Procjena zbira zaokruživanjem | estimate | 2 986+4 021≈3 000+4 000=7 000; tačan zbir je 7 007. | {"operation":"add","place":1000}
Procjena proizvoda zaokruživanjem | estimate | 198·31≈200·30=6 000; tačan proizvod je 6 138. | {"operation":"multiply","place":10}
`);
block(5,'Izrazi i svojstva operacija','arithmetic',`
Komutativnost sabiranja | add | 47+83=83+47=130. | {"goal":"commutative"}
Asocijativnost sabiranja | add | (125+75)+38=125+(75+38)=238. | {"goal":"associative","terms":3}
Komutativnost množenja | multiply | 25·16=16·25=400. | {"goal":"commutative"}
Asocijativnost množenja | multiply | (4·25)·7=4·(25·7)=700. | {"goal":"associative","terms":3}
Distributivnost prema sabiranju | expression | 18·(20+3)=18·20+18·3=414. | {"pattern":"distribute-add"}
Distributivnost prema oduzimanju | expression | 24·(50−2)=24·50−24·2=1 152. | {"pattern":"distribute-subtract"}
Izraz bez zagrada | expression | 80−6·7+24:4=80−42+6=44. | {"pattern":"precedence"}
Izraz s jednom zagradom | expression | (80−6)·7=74·7=518. | {"pattern":"parentheses"}
Izraz s ugniježđenim zagradama | expression | 5·[12+(18−6):3]=5·16=80. | {"pattern":"nested"}
Nula i jedinica u računskim izrazima | expression | 36·1+0·8−0=36; 36:1=36. | {"pattern":"identity"}
`);
block(5,'Problemski zadaci s prirodnim brojevima','word',`
Nabavka i otpis u biblioteci | total | 1 450 knjiga+320 novih−75 otpisanih=1 695 knjiga. | {"context":"biblioteka"}
Pakovanja i preostali proizvodi | packs | 18 kutija po 24 olovke daje 432; nakon 75 podijeljenih ostaje 357. | {"context":"olovke"}
Jednaka raspodjela učenika | equal-share | 168 učenika u 7 jednakih grupa daje 168:7=24 po grupi. | {"context":"ucenici"}
Račun kupovine i kusur | price | 3 sveske po 4 KM i knjiga od 18 KM koštaju 30 KM; od 50 KM kusur je 20 KM.
Dužina puta u više etapa | distance | Etape 125 km, 80 km i 95 km daju ukupno 300 km. | {"stages":3}
Trajanje dvije aktivnosti | time | 45 min časa+15 min pauze+45 min časa=105 min=1 h 45 min.
Odnos godina članova porodice | age | Otac ima 36, dijete 9 godina; za 5 godina imaju 41 i 14, a razlika ostaje 27.
Zbir uzastopnih prirodnih brojeva | consecutive | Tri uzastopna broja sa zbirom 72 su 23, 24 i 25. | {"count":3}
Plan dnevne proizvodnje | total | Cilj 900 komada, proizvedeno 275+310=585; preostaje 315. | {"context":"proizvodnja"}
Trošak prijevoza po osobama | price | 28 učenika po 12 KM daje 336 KM; uz 84 KM za autobus ukupno je 420 KM. | {"context":"izlet"}
`);
block(5,'Skupovi i pravilnosti','sets',`
Unija dva skupa | union | A={1,2,4}, B={2,3,4}; A∪B={1,2,3,4}.
Presjek dva skupa | intersection | A={1,2,4}, B={2,3,4}; A∩B={2,4}.
Razlika prvog i drugog skupa | difference | A={1,2,4}, B={2,3,4}; A\\B={1}.
Komplement unutar univerzalnog skupa | complement | U={1,2,3,4,5}, A={2,4}; U\\A={1,3,5}.
Broj elemenata unije | cardinality | Ako A ima 8, B ima 7 i presjek 3 elementa, unija ima 8+7−3=12.
Prepoznavanje podskupa | subset | {2,4} je podskup {1,2,3,4} jer su oba njegova elementa u većem skupu.
`);
block(5,'Skupovi i pravilnosti','sequence',`
Nastavljanje niza stalne razlike | next | Uz pravilo +7, niz 5,12,19,26 nastavlja se brojem 33. | {"kind":"arithmetic"}
Pronalaženje određenog člana niza | term | Za a₁=3 i d=4, a₁₀=3+9·4=39. | {"kind":"arithmetic"}
Nastavljanje niza stalnog količnika | next | Uz pravilo ·3, niz 2,6,18,54 nastavlja se sa 162. | {"kind":"geometric"}
Zbir prvih uzastopnih brojeva | sum | 1+2+…+10=10·11:2=55. | {"kind":"natural"}
`);
block(5,'Mjerenje i jedinice','units',`
Metri u centimetre | length | 7 m=7·100=700 cm. | {"from":"m","to":"cm"}
Centimetri u metre | length | 400 cm=400:100=4 m. | {"from":"cm","to":"m","integerOnly":true}
Kilometri i metri u jednoj jedinici | length | 3 km 240 m=3 240 m. | {"from":"km","to":"m","compound":true}
Kilogrami u grame | mass | 4 kg 250 g=4 250 g. | {"from":"kg","to":"g","compound":true}
Tone u kilograme | mass | 3 t=3 000 kg. | {"from":"t","to":"kg"}
Sati i minute u minute | time | 2 h 35 min=2·60+35=155 min. | {"from":"h","to":"min","compound":true}
Minute u sate i ostatak | time | 185 min=3 h 5 min. | {"from":"min","to":"h","compound":true}
Kvadratni metri u kvadratne centimetre | area | 2 m²=20 000 cm² jer je 1 m²=10 000 cm². | {"from":"m2","to":"cm2"}
Hektari i ari | area | 3 ha=300 a jer je 1 ha=100 a. | {"from":"ha","to":"a"}
Konvertibilne marke i fening | money | 8 KM 35 feninga=835 feninga. | {"from":"KM","to":"fening","compound":true}
`);
block(5,'Geometrija i početno mjerenje','triangle',`
Obim trougla iz tri stranice | perimeter | Stranice 7,8,9 cm daju O=7+8+9=24 cm.
Jednakostranični trougao: obim | perimeter | Za a=12 cm, O=3a=36 cm. | {"kind":"equilateral"}
Jednakokraki trougao: obim | perimeter | Osnovica 10 i kraci po 13 cm daju O=10+26=36 cm. | {"kind":"isosceles"}
Nepoznata stranica iz obima trougla | perimeter | O=30 cm, a=8, b=9 ⇒ c=30−8−9=13 cm. | {"target":"side"}
`);
block(5,'Geometrija i početno mjerenje','quadrilateral',`
Obim pravougaonika | rectangle | a=8,b=5 cm ⇒ O=2(8+5)=26 cm. | {"measure":"perimeter"}
Površina pravougaonika | rectangle | a=8,b=5 cm ⇒ P=8·5=40 cm². | {"measure":"area"}
Stranica pravougaonika iz površine | rectangle | P=72 cm², a=9 cm ⇒ b=72:9=8 cm. | {"measure":"side-from-area"}
Stranica pravougaonika iz obima | rectangle | O=34 cm, a=10 cm ⇒ b=34:2−10=7 cm. | {"measure":"side-from-perimeter"}
Obim kvadrata | square | a=7 cm ⇒ O=4·7=28 cm. | {"measure":"perimeter"}
Površina kvadrata | square | a=7 cm ⇒ P=7²=49 cm². | {"measure":"area"}
Stranica kvadrata iz obima | square | O=48 cm ⇒ a=48:4=12 cm. | {"measure":"side-from-perimeter"}
Složena površina dva pravougaonika | rectangle | Dva nepoklopljena dijela 6·4 i 3·2 cm² imaju ukupno P=24+6=30 cm². | {"measure":"composite"}
`);
block(5,'Geometrija i početno mjerenje','angle',`
Vrste uglova prema mjeri | classify | 35° je oštar, 90° prav, 125° tup, 180° ispružen ugao.
Sabiranje mjera uglova | parts | 28°+47°=75°. | {"operation":"add"}
Oduzimanje mjera uglova | parts | 120°−38°=82°. | {"operation":"subtract"}
Ugao podijeljen na jednake dijelove | parts | 84° podijeljeno na 3 jednaka dijela daje 28° po dijelu. | {"operation":"divide"}
`);
block(5,'Brojevi i decimalni sistem','numeral',`
Zaokruživanje na desetice | round | 3 247≈3 250 jer je cifra jedinica 7≥5. | {"place":10}
Zaokruživanje na stotine | round | 28 349≈28 300 jer je cifra desetica 4<5. | {"place":100}
Zaokruživanje na hiljade | round | 47 650≈48 000 jer je odbačeni dio najmanje 500. | {"place":1000}
Zaokruživanje na stotine hiljada | round | 1 274 300≈1 300 000. | {"place":100000}
`);
// 6. razred: number theory, fractions and geometry.
for(const [d,example,digitExample] of [
 [2,'348=2·174; broj je djeljiv sa 2 jer se završava parnom cifrom.','U broju 34x cifre x=0,2,4,6,8 daju djeljivost sa 2.'],
 [3,'672 ima zbir cifara 15, pa je djeljiv sa 3; 672=3·224.','Za 42x zbir cifara je 6+x; x=0,3,6,9 daje djeljivost sa 3.'],
 [4,'1 236 je djeljiv sa 4 jer je 36 djeljivo sa 4; količnik je 309.','Za 12x posljednje dvije cifre 2x moraju dati 20,24 ili 28; x=0,4,8.'],
 [5,'735 je djeljiv sa 5 jer je posljednja cifra 5; količnik je 147.','Broj 47x djeljiv je sa 5 za x=0 ili x=5.'],
 [6,'534 je djeljiv sa 2 i sa 3, pa sa 6; količnik je 89.','Za 12x treba parna cifra i zbir 3+x djeljiv sa 3; x=0 ili 6.'],
 [9,'729 ima zbir cifara 18 i djeljiv je sa 9; 729=9·81.','Za 43x zbir je 7+x; jedina cifra koja daje višekratnik 9 je x=2.'],
 [10,'2 340 je djeljiv sa 10 jer se završava nulom; količnik je 234.','Broj 57x djeljiv je sa 10 samo za x=0.'],
 [15,'645 se završava cifrom 5 i ima zbir cifara 15; 645=15·43.','Za 12x treba x=0 ili 5 i zbir 3+x djeljiv sa 3; jedino x=0.'],
 [25,'1 275 je djeljiv sa 25 jer se završava sa 75; 1 275=25·51.','Za 1x5 završetak mora biti 25 ili 75, pa je x=2 ili x=7.']
]){
 block(6,'Djeljivost brojeva','divisibility',`Djeljivost sa ${d}: odluka i obrazloženje | test | ${example} | {"divisor":${d}}\nNepoznata cifra i djeljivost sa ${d} | digit | ${digitExample} | {"divisor":${d}}`);
}
block(6,'Djeljivost brojeva','divisibility',`
Istovremena djeljivost sa 4 i 9 | test | 252 je djeljiv sa 4 i sa 9, pa sa NZS(4,9)=36. | {"divisor":36,"components":[4,9]}
Djelioci i sadržalaci nisu isto | divisors | Djelioci broja 12 su 1,2,3,4,6,12; sadržalaci počinju 12,24,36,48. | {"target":"divisors"}
`);
block(6,'Prosti brojevi i faktorizacija','primes',`
Zašto broj jedan nije prost | classify | Broj 1 ima samo jedan pozitivni djelilac, pa nije ni prost ni složen. | {"kind":"one"}
Prepoznavanje prostog broja | classify | 29 ima samo djelioce 1 i 29, pa je prost. | {"kind":"prime"}
Prepoznavanje složenog broja | classify | 39=3·13, pa je složen. | {"kind":"composite"}
Prosti brojevi u zadanom intervalu | list | Prosti brojevi između 20 i 35 su 23,29,31.
Rastav parnog broja na proste faktore | factor | 84=2·2·3·7=2²·3·7. | {"kind":"even"}
Rastav neparnog složenog broja | factor | 315=3·3·5·7=3²·5·7. | {"kind":"odd"}
Broj različitih prostih faktora | count | 180=2²·3²·5 ima 3 različita prosta faktora. | {"distinct":true}
Broj pozitivnih djelilaca iz rastava | count | 72=2³·3² ima (3+1)(2+1)=12 pozitivnih djelilaca. | {"target":"divisor-count"}
`);
block(6,'NZD, NZS i njihove primjene','gcdlcm',`
NZD iz prostih faktora | gcd | 36=2²·3² i 48=2⁴·3 ⇒ NZD=2²·3=12. | {"method":"factor"}
NZD Euklidovim algoritmom | gcd | 84=60+24; 60=2·24+12; 24=2·12 ⇒ NZD(84,60)=12. | {"method":"euclid"}
NZD tri prirodna broja | gcd-three | NZD(24,36,60)=12.
Uzajamno prosti brojevi | gcd | NZD(35,48)=1, pa su brojevi uzajamno prosti. | {"coprime":true}
NZS iz prostih faktora | lcm | 12=2²·3 i 18=2·3² ⇒ NZS=2²·3²=36. | {"method":"factor"}
NZS preko veze s NZD | lcm | NZS(24,30)=24·30:NZD(24,30)=720:6=120. | {"method":"gcd"}
NZS tri prirodna broja | lcm-three | NZS(6,8,15)=120.
Najveće jednake grupe | word-gcd | 24 crvene i 36 plavih olovaka čine najviše 12 istih paketa: po 2 crvene i 3 plave.
Prvo ponovno zajedničko zvono | word-lcm | Zvona se javljaju svakih 12 i 18 minuta; ponovo zajedno nakon NZS=36 minuta.
Popločavanje najvećim kvadratima | word-gcd | Pravougaonik 180×240 cm pokriva se najvećim kvadratima stranice NZD=60 cm. | {"context":"tiles"}
`);
block(6,'Zapis i vrijednost razlomka','fraction',`
Razlomak kao dio cjeline | part | Tri od osam jednakih dijelova čine 3/8 cjeline. | {"target":"representation"}
Razlomak od prirodnog broja | part | 3/5 od 40 je (40:5)·3=24.
Cjelina iz poznatog razlomljenog dijela | whole | Ako 2/3 cjeline iznosi 18, cjelina je 18:(2/3)=27.
Proširivanje zadanim faktorom | expand | 3/7 proširen sa 4 daje 12/28. | {"factor":4}
Proširivanje na zadani nazivnik | expand | 5/6=20/24 jer se brojilac i nazivnik množe sa 4. | {"target":"denominator"}
Skraćivanje jednim faktorom | reduce | 18/30 skraćeno sa 6 daje 3/5. | {"stepwise":true}
Svođenje na neskrativ razlomak | reduce | 42/56=3/4 jer je NZD(42,56)=14.
Pravi, nepravi i prividni razlomci | compare | 3/5<1, 7/5>1, a 10/5=2 je cijeli broj. | {"target":"classify"}
Nepravi razlomak u mješoviti broj | mixed | 17/5=3+2/5 jer je 17=3·5+2.
Mješoviti broj u nepravi razlomak | improper | 4 2/3=(4·3+2)/3=14/3.
Recipročna vrijednost razlomka | reciprocal | Recipročna vrijednost 3/7 je 7/3; njihov proizvod je 1.
Jednaki razlomci i nedostajući brojilac | expand | 3/4=x/20 ⇒ x=15. | {"target":"numerator"}
`);
block(6,'Poređenje i uređivanje razlomaka','fraction',`
Poređenje istih nazivnika | compare | 3/11<7/11 jer je 3<7. | {"sameDenominator":true}
Poređenje istih brojilaca | compare | 5/8>5/12: kod istog pozitivnog brojioca manji nazivnik daje veći dio. | {"sameNumerator":true}
Poređenje različitih nazivnika | compare | 5/6>7/9 jer je 5·9=45>42=7·6.
Uređivanje tri razlomka | order | 1/2=6/12, 2/3=8/12, 3/4=9/12 ⇒ 1/2<2/3<3/4. | {"count":3}
Razlomak između dva razlomka | compare | Između 1/3 i 1/2 je 5/12, jer 4/12<5/12<6/12. | {"target":"between"}
Razlomci na brojevnoj pravoj | compare | 7/4=1 3/4 nalazi se između 1 i 2, bliže broju 2. | {"target":"interval"}
`);
block(6,'Operacije s razlomcima','fraction',`
Sabiranje razlomaka istog nazivnika | add | 2/9+4/9=6/9=2/3. | {"sameDenominator":true}
Sabiranje razlomaka različitih nazivnika | add | 2/3+3/4=8/12+9/12=17/12.
Sabiranje mješovitih brojeva | add | 1 1/2+2 1/3=3 5/6. | {"mixed":true}
Sabiranje tri razlomka | add | 1/2+1/3+1/6=3/6+2/6+1/6=1. | {"terms":3}
Oduzimanje razlomaka istog nazivnika | subtract | 8/11−3/11=5/11. | {"sameDenominator":true}
Oduzimanje različitih nazivnika | subtract | 5/6−1/4=10/12−3/12=7/12.
Oduzimanje razlomka od cijelog broja | subtract | 3−4/5=15/5−4/5=11/5. | {"wholeLeft":true}
Oduzimanje mješovitih brojeva s posuđivanjem | subtract | 4 1/5−2 3/5=3 6/5−2 3/5=1 3/5. | {"mixed":true,"borrow":true}
Množenje razlomka prirodnim brojem | multiply | (3/7)·14=6. | {"wholeRight":true}
Množenje dva razlomka | multiply | (2/5)·(3/7)=6/35.
Skraćivanje prije množenja | multiply | (14/15)·(25/21)=10/9 nakon unakrsnog skraćivanja. | {"crossCancel":true}
Množenje mješovitih brojeva | multiply | 1 1/2·2 2/3=(3/2)·(8/3)=4. | {"mixed":true}
Dijeljenje razlomka prirodnim brojem | divide | (3/4):6=(3/4)·(1/6)=1/8. | {"wholeRight":true}
Dijeljenje prirodnog broja razlomkom | divide | 5:(2/3)=5·(3/2)=15/2. | {"wholeLeft":true}
Dijeljenje dva razlomka | divide | (4/9):(2/3)=(4/9)·(3/2)=2/3.
Dijeljenje mješovitih brojeva | divide | 2 1/4:1 1/2=(9/4):(3/2)=3/2. | {"mixed":true}
Dvojni razlomak s dva jednostavna razlomka | complex | (3/4)/(5/8)=(3/4)·(8/5)=6/5. | {"pattern":"simple"}
Dvojni razlomak sa zbirom u brojiocu | complex | (1/2+1/3)/(5/6)=(5/6)/(5/6)=1. | {"pattern":"sum-top"}
Dvojni razlomak s razlikom u nazivniku | complex | (3/4)/(2/3−1/6)=(3/4)/(1/2)=3/2. | {"pattern":"difference-bottom"}
Razlomački izraz sa zagradama | expression | (2/3+1/6)·3/5=(5/6)·3/5=1/2. | {"pattern":"parentheses"}
Preostali dio cjeline | part | Potrošeno 2/5 i 1/4 cjeline; ostaje 1−2/5−1/4=7/20. | {"target":"remaining"}
Nepoznati razlomak u zbiru | add | x+2/7=5/7 ⇒ x=3/7. | {"target":"unknown"}
Broj razlomljenih komada | divide | Iz 6 m trake izreže se 6:(3/4)=8 komada po 3/4 m. | {"context":"pieces"}
Površina pravougaonika s razlomljenim stranicama | multiply | Stranice 3/2 m i 4/3 m daju P=(3/2)·(4/3)=2 m². | {"context":"area"}
`);
block(6,'Geometrija: trouglovi','triangle',`
Vrste trouglova prema stranicama | classify | Stranice 7,7,10 daju jednakokraki trougao. | {"criterion":"sides"}
Vrste trouglova prema uglovima | classify | Uglovi 30°,60°,90° daju pravougli trougao. | {"criterion":"angles"}
Uslov postojanja trougla | inequality | Od 4,7,12 cm nema trougla jer je 4+7<12.
Mogući cjelobrojni raspon treće stranice | inequality | Uz 5 i 8 cm treba 3<c<13, pa su cijeli c od 4 do 12. | {"target":"range"}
Treći ugao trougla | classify | Za uglove 47° i 68° treći je 180°−115°=65°. | {"target":"third-angle"}
Uglovi jednakokrakog trougla | classify | Vrh je 40°; svaki ugao na osnovici je (180°−40°)/2=70°. | {"kind":"isosceles","target":"angles"}
Vanjski ugao trougla | classify | Udaljeni unutrašnji uglovi 35° i 75° daju vanjski ugao 110°. | {"target":"exterior"}
Srednja linija trougla | midline | Stranica 18 cm daje paralelnu srednju liniju od 9 cm.
Površina trougla iz osnovice i visine | area | a=12 cm,h=7 cm ⇒ P=12·7/2=42 cm².
Visina trougla iz površine | height | P=36 cm²,a=9 cm ⇒ h=2·36/9=8 cm.
`);
block(6,'Geometrija: četverouglovi i uglovi','quadrilateral',`
Obim paralelograma | parallelogram | Stranice 11 i 7 cm daju O=2(11+7)=36 cm. | {"measure":"perimeter"}
Površina paralelograma | parallelogram | a=11,h=6 cm ⇒ P=66 cm². | {"measure":"area"}
Obim romba | rhombus | a=9 cm ⇒ O=4·9=36 cm. | {"measure":"perimeter"}
Površina romba iz dijagonala | rhombus | d₁=10,d₂=16 cm ⇒ P=10·16/2=80 cm². | {"measure":"area"}
Srednja linija trapeza | midline | Osnovice 8 i 14 cm daju m=(8+14)/2=11 cm.
Površina trapeza | trapezoid | Osnovice 8 i 14 cm,h=5 cm ⇒ P=11·5=55 cm². | {"measure":"area"}
Površina deltoida | kite | Normalne dijagonale 12 i 7 cm daju P=12·7/2=42 cm². | {"measure":"area"}
`);
block(6,'Geometrija: četverouglovi i uglovi','angle',`
Zbir unutrašnjih uglova četverougla | polygon | Za tri ugla 80°,95°,110° četvrti je 360°−285°=75°. | {"sides":4,"target":"missing"}
Uglovi paralelograma | parallel | Ako je jedan unutrašnji ugao 65°, susjedni je 115°, a naspramni 65°. | {"context":"parallelogram"}
Uglovi uz krake jednakokrakog trapeza | parallel | Uz donju osnovicu oba su 70°; uz gornju oba 110°. | {"context":"isosceles-trapezoid"}
`);
// 7. razred: signed arithmetic, ratios, percentages and coordinates.
block(7,'Cijeli brojevi i brojevna prava','integer',`
Apsolutna vrijednost negativnog broja | absolute | abs(−17)=17 jer je udaljenost od nule 17. | {"sign":"negative"}
Apsolutna vrijednost razlike | absolute | abs(−8−5)=abs(−13)=13. | {"expression":true}
Suprotan broj | opposite | Suprotan broj broju −24 je 24; njihov zbir je 0.
Poređenje negativnih brojeva | compare | −12<−7 jer se −12 nalazi lijevo od −7. | {"negativeOnly":true}
Poređenje cijelih brojeva različitog predznaka | compare | −4<3; svaki negativan broj manji je od pozitivnog. | {"mixedSigns":true}
Uređivanje pozitivnih i negativnih brojeva | order | −2,5,−8,0,3 u rastućem redu: −8,−2,0,3,5.
Rastojanje cijelih brojeva na pravoj | distance | Između −6 i 9 rastojanje je abs(9−(−6))=15.
Sabiranje dva negativna broja | add | (−14)+(−9)=−23. | {"signs":"negative-negative"}
Sabiranje različitih predznaka: pozitivan zbir | add | 18+(−7)=11. | {"signs":"positive-negative","resultSign":"positive"}
Sabiranje različitih predznaka: negativan zbir | add | 7+(−18)=−11. | {"signs":"positive-negative","resultSign":"negative"}
Zbir suprotnih brojeva | add | (−31)+31=0. | {"opposites":true}
Oduzimanje negativnog broja | subtract | 8−(−12)=8+12=20. | {"rightSign":"negative"}
Oduzimanje od negativnog broja | subtract | −8−12=−20. | {"leftSign":"negative","rightSign":"positive"}
Množenje dva negativna broja | multiply | (−7)·(−9)=63. | {"signs":"negative-negative"}
Množenje različitih predznaka | multiply | (−8)·6=−48. | {"signs":"negative-positive"}
Predznak proizvoda više faktora | multiply | (−2)·(−3)·(−4)=−24: tri negativna faktora daju minus. | {"terms":3}
Dijeljenje dva negativna broja | divide | (−84):(−7)=12. | {"signs":"negative-negative"}
Dijeljenje različitih predznaka | divide | 96:(−8)=−12. | {"signs":"positive-negative"}
Izraz s cijelim brojevima i zagradama | expression | −3·(5−9)+8=−3·(−4)+8=20. | {"pattern":"parentheses"}
Temperaturna promjena kao razlika | subtract | Od −6°C do 4°C temperatura poraste za 4−(−6)=10°C. | {"context":"temperature"}
`);
block(7,'Racionalni brojevi s predznakom','rational',`
Sabiranje negativnih razlomaka | add | −2/3−1/4=−8/12−3/12=−11/12. | {"signs":"negative-negative"}
Zbir razlomaka različitih predznaka | add | −3/5+7/10=−6/10+7/10=1/10. | {"signs":"mixed"}
Oduzimanje negativnog razlomka | subtract | 1/3−(−2/5)=1/3+2/5=11/15. | {"rightSign":"negative"}
Proizvod negativnih razlomaka | multiply | (−3/4)·(−8/9)=2/3. | {"signs":"negative-negative"}
Količnik razlomaka različitih predznaka | divide | (−5/6):(2/3)=−5/4. | {"signs":"mixed"}
Poređenje negativnih razlomaka | compare | −3/4<−2/3 jer je −9/12<−8/12. | {"negativeOnly":true}
Izraz s predznakom ispred zagrade | expression | −(1/2−3/4)=−(−1/4)=1/4. | {"pattern":"outer-minus"}
Izraz s negativnim mješovitim brojem | expression | −1 1/2+2 1/4=−3/2+9/4=3/4. | {"mixed":true}
Višekoračni racionalni izraz | expression | (−2/3+1/6):(-1/2)=(-1/2):(-1/2)=1. | {"pattern":"nested"}
Racionalni broj između dvije granice | compare | −7/12 je između −2/3=−8/12 i −1/2=−6/12. | {"target":"between"}
`);
block(7,'Decimalni brojevi','decimal',`
Cifra desetina decimalnog broja | place | U broju 24,736 cifra desetina je 7 i vrijedi 0,7. | {"place":0.1}
Cifra stotinki decimalnog broja | place | U broju 24,736 cifra stotinki je 3 i vrijedi 0,03. | {"place":0.01}
Cifra hiljaditih decimalnog broja | place | U broju 24,736 cifra hiljaditih je 6 i vrijedi 0,006. | {"place":0.001}
Zaokruživanje na jednu decimalu | round | 3,746≈3,7 jer je sljedeća cifra 4. | {"places":1}
Zaokruživanje na dvije decimale | round | 3,746≈3,75 jer je sljedeća cifra 6. | {"places":2}
Decimalni broj u neskrativ razlomak | convert | 0,375=375/1000=3/8. | {"direction":"to-fraction"}
Razlomak u konačan decimalni zapis | convert | 7/20=35/100=0,35. | {"direction":"to-decimal"}
Poređenje decimalnih brojeva uz dopisane nule | compare | 2,4=2,400>2,395.
Sabiranje decimalnih brojeva različite preciznosti | add | 12,7+0,385=13,085.
Oduzimanje decimalnih brojeva preko nula | subtract | 5,000−2,347=2,653. | {"zeros":true}
Množenje dva decimalna broja | multiply | 1,25·0,8=1.
Dijeljenje decimalnim djeliocem | divide | 4,32:0,12=432:12=36.
Pomjeranje zareza pri množenju stepenom deset | multiply | 0,047·1000=47. | {"powerTen":1000}
Pomjeranje zareza pri dijeljenju stepenom deset | divide | 47,5:100=0,475. | {"powerTen":100}
Decimalni izraz sa zagradama | expression | (1,2+0,8)·2,5−1,5=3,5.
`);
block(7,'Omjeri i proporcionalnost','ratio',`
Skraćivanje omjera | simplify | 18:24=3:4 nakon dijeljenja oba člana sa 6.
Omjer veličina različito zapisanih jedinica | simplify | 2 m:50 cm=200 cm:50 cm=4:1. | {"convertUnits":true}
Podjela u omjeru dva člana | share | 70 KM u omjeru 2:5 daje 20 KM i 50 KM. | {"parts":2}
Podjela u omjeru tri člana | share | 90 KM u omjeru 2:3:4 daje 20,30 i 40 KM. | {"parts":3}
Nepoznati unutrašnji član proporcije | proportion | 3:x=9:12 ⇒ 9x=36 ⇒ x=4. | {"position":"inner"}
Nepoznati vanjski član proporcije | proportion | x:5=18:15 ⇒ 15x=90 ⇒ x=6. | {"position":"outer"}
Direktna proporcionalnost cijene | direct | 4 kg košta 12 KM; 7 kg košta 12·7/4=21 KM. | {"context":"price"}
Direktna proporcionalnost pri stalnoj brzini | direct | Za 2 h prijeđe se 120 km; za 5 h pri istoj brzini 300 km. | {"context":"distance"}
Direktna proporcionalnost recepta | direct | Za 6 osoba treba 450 g brašna; za 10 osoba 750 g. | {"context":"recipe"}
Obrnuta proporcionalnost broja radnika | inverse | 6 radnika radi 8 dana; 12 jednako efikasnih radnika radi 4 dana. | {"context":"workers"}
Obrnuta proporcionalnost brzine i vremena | inverse | Put traje 6 h pri 40 km/h; pri 60 km/h traje 4 h. | {"context":"speed"}
Konstanta direktne proporcionalnosti | direct | Za y=12 pri x=3 konstanta k=y/x=4. | {"target":"constant"}
Konstanta obrnute proporcionalnosti | inverse | Za x=3,y=8 konstanta k=xy=24. | {"target":"constant"}
Stvarna udaljenost iz razmjere karte | scale | Na 1:50 000, 4 cm znači 200 000 cm=2 km. | {"direction":"real"}
Dužina na karti iz stvarne udaljenosti | scale | 3 km=300 000 cm na 1:100 000 daje 3 cm. | {"direction":"map"}
`);
block(7,'Procentni račun','percent',`
Procenat od zadane cjeline | part | 15% od 240 je 0,15·240=36.
Cjelina iz procentnog dijela | whole | Ako 20% iznosi 48, cjelina je 48:0,2=240.
Procentna stopa iz dijela i cjeline | rate | 18 od 60 učenika čini (18/60)·100%=30%.
Nova cijena nakon popusta | decrease | Cijena 80 KM uz popust 15% postaje 80·0,85=68 KM.
Nova cijena nakon poskupljenja | increase | Cijena 120 KM uz rast 10% postaje 132 KM.
Početna cijena prije popusta | decrease | Nakon 20% popusta cijena je 64 KM; početna je 64:0,8=80 KM. | {"inverse":true}
Početna cijena prije poskupljenja | increase | Poslije 25% povećanja iznos je 100 KM; početni je 100:1,25=80 KM. | {"inverse":true}
Dva uzastopna popusta | successive | 100 KM uz popuste 20% i 10% postaje 100·0,8·0,9=72 KM. | {"changes":[-20,-10]}
Povećanje pa smanjenje istom stopom | successive | 100 KM povećano 10%, pa smanjeno 10%, iznosi 99 KM. | {"changes":[10,-10]}
Procentni poeni i relativna promjena | rate | Stopa raste sa 20% na 25%: rast je 5 procentnih poena, odnosno 25% početne stope. | {"target":"percentage-points"}
`);
block(7,'Uglovi i odnosi u ravni','angle',`
Komplement zadane mjere ugla | complement | Komplement 38° je 90°−38°=52°.
Suplement zadane mjere ugla | supplement | Suplement 72° je 180°−72°=108°.
Komplementni uglovi u zadanoj razlici | complement | β=α+20°, α+β=90° ⇒ α=35°,β=55°. | {"target":"difference"}
Suplementni uglovi u zadanoj razlici | supplement | β=α+40°, α+β=180° ⇒ α=70°,β=110°. | {"target":"difference"}
Komplementni uglovi u zadanoj razmjeri | complement | Omjer 2:3 i zbir 90° daju 36° i 54°. | {"target":"ratio"}
Suplementni uglovi u zadanoj razmjeri | supplement | Omjer 4:5 i zbir 180° daju 80° i 100°. | {"target":"ratio"}
Unakrsni uglovi | vertical | Jedan ugao je 117°; njemu unakrsni također je 117°.
Saglasni uglovi uz paralelne prave | parallel | Uz paralelne prave saglasni ugao uglu 64° također je 64°. | {"target":"corresponding"}
Naizmjenični uglovi uz paralelne prave | parallel | Ugao 73° i njegov naizmjenični ugao uz paralelne prave imaju istu mjeru 73°. | {"target":"alternate"}
Unutrašnji uglovi s iste strane transverzale | parallel | Ako je jedan 68°, drugi je 180°−68°=112°. | {"target":"same-side"}
Treći ugao s decimalnim mjerama | triangle | 48,5°+72,25°=120,75°; treći ugao je 59,25°. | {"decimal":true}
Vanjski ugao i udaljeni unutrašnji uglovi | exterior | Vanjski je 125°, a jedan udaljeni unutrašnji 47°; drugi je 78°.
Zbir uglova petougla | polygon | Za n=5 zbir je (5−2)·180°=540°. | {"sides":5,"target":"sum"}
Unutrašnji ugao pravilnog šestougla | polygon | Svaki ugao pravilnog šestougla je 720°:6=120°. | {"sides":6,"target":"regular"}
Ugao kazaljki u puni sat | clock | U 4:00 manji ugao kazaljki je 4·30°=120°. | {"fullHour":true}
`);
block(7,'Koordinatni sistem','coordinate',`
Određivanje kvadranta tačke | quadrant | A(−3,5) pripada drugom kvadrantu.
Tačka na koordinatnoj osi | quadrant | B(0,−4) leži na y-osi i ne pripada nijednom kvadrantu. | {"onAxis":true}
Zrcaljenje tačke u x-osi | reflect | A(3,−5) prelazi u A′(3,5). | {"axis":"x"}
Zrcaljenje tačke u y-osi | reflect | A(3,−5) prelazi u A′(−3,−5). | {"axis":"y"}
Zrcaljenje tačke u ishodištu | reflect | A(3,−5) prelazi u A′(−3,5). | {"axis":"origin"}
Translacija tačke zadanim pomakom | translate | A(−2,3) uz pomak (5,−1) prelazi u A′(3,2).
Horizontalno rastojanje tačaka | distance | A(−4,2),B(7,2) imaju rastojanje 11. | {"kind":"horizontal"}
Vertikalno rastojanje tačaka | distance | A(3,−6),B(3,2) imaju rastojanje 8. | {"kind":"vertical"}
Središte duži u koordinatama | midpoint | A(−2,4),B(6,8) imaju središte M(2,6).
Nepoznata krajnja tačka iz središta | midpoint | A(1,−2),M(4,3) ⇒ B=2M−A=(7,8). | {"target":"endpoint"}
`);
block(7,'Mjerenje trouglova s racionalnim dužinama','triangle',`
Obim trougla s decimalnim stranicama | perimeter | Stranice 3,5;4,2;5,3 cm daju O=13 cm. | {"decimal":true}
Površina trougla s decimalnom visinom | area | a=8 cm,h=3,5 cm ⇒ P=14 cm². | {"decimal":true}
Osnovica trougla iz površine i visine | base | P=27 cm²,h=6 cm ⇒ a=2P/h=9 cm.
Stranica iz srednje linije trougla | midline | Srednja linija 6,5 cm znači da je paralelna stranica 13 cm. | {"inverse":true}
Uglovi jednakokrakog trougla iz ugla osnovice | classify | Uglovi na osnovici su po 52°; ugao pri vrhu je 76°. | {"kind":"isosceles","target":"vertex"}
`);
// 8. razred: algebra, vectors, roots and metric geometry.
block(8,'Stepeni i naučni zapis','power',`
Stepen pozitivnog cijelog broja | value | 4³=4·4·4=64. | {"baseType":"positive"}
Paran stepen negativne osnove | value | (−3)⁴=81. | {"baseType":"negative","parity":"even"}
Neparan stepen negativne osnove | value | (−3)³=−27. | {"baseType":"negative","parity":"odd"}
Stepen racionalne osnove | value | (2/3)³=8/27. | {"baseType":"fraction"}
Razlika negativne osnove i predznaka | negative | (−4)²=16, dok je −4²=−16. | {"target":"precedence"}
Proizvod stepena iste osnove | product | 2³·2⁵=2⁸=256.
Količnik stepena iste osnove | quotient | 3⁷:3⁴=3³=27.
Stepen stepena | power | (2³)⁴=2¹²=4 096.
Stepen s eksponentom nula | zero | 7⁰=1; uslov je da je osnova nenulta.
Negativni eksponent | negative | 5⁻²=1/5²=1/25. | {"target":"reciprocal"}
Naučni zapis velikog broja | scientific | 4 700 000=4,7·10⁶. | {"kind":"large"}
Naučni zapis malog decimalnog broja | scientific | 0,00052=5,2·10⁻⁴. | {"kind":"small"}
`);
block(8,'Kvadratni korijen','root',`
Glavni korijen potpunog kvadrata | value | √144=12, jer je 12²=144 i 12≥0. | {"kind":"integer"}
Korijen kvadrata negativnog broja | value | √((−9)²)=√81=9, a ne −9. | {"kind":"negative-square"}
Korijen kvadratnog razlomka | value | √(49/81)=7/9. | {"kind":"fraction"}
Korijen decimalnog potpunog kvadrata | value | √0,0225=0,15. | {"kind":"decimal"}
Korijen između susjednih prirodnih brojeva | estimate | 6²<45<7² ⇒ 6<√45<7.
Izdvajanje kvadratnog faktora | simplify | √72=√(36·2)=6√2.
Sabiranje sličnih korijena | simplify | 3√5+2√5=5√5. | {"target":"collect"}
Množenje korijena | product | √6·√24=√144=12.
Dijeljenje korijena | quotient | √75:√3=√25=5.
Kvadrat korijena i redoslijed operacija | value | (2√7)²=4·7=28. | {"kind":"square-root-expression"}
`);
block(8,'Polinomi i algebarski izrazi','polynomial',`
Sabiranje sličnih linearnih članova | collect | 3x+5x−2x=6x. | {"degree":1}
Sređivanje kvadratnih i linearnih članova | collect | 2x²+3x−x²+4x= x²+7x. | {"degree":2}
Sređivanje članova dvije promjenljive | collect | 3a+2b−a+5b=2a+7b. | {"variables":2}
Vrijednost linearne forme | value | Za x=−2, 3x+5=−1. | {"degree":1}
Vrijednost kvadratnog polinoma | value | Za x=−2, 2x²−3x+1=8+6+1=15. | {"degree":2}
Vrijednost izraza dvije promjenljive | value | Za a=2,b=−3, a²+2ab+b²=4−12+9=1. | {"variables":2}
Sabiranje dva polinoma | add | (2x²+3x+1)+(x²−5x+4)=3x²−2x+5.
Oduzimanje dva polinoma | subtract | (3x²+2x−1)−(x²−4x+5)=2x²+6x−6.
Množenje monoma | monomial | (3x²)·(−2x³)=−6x⁵. | {"operation":"multiply"}
Dijeljenje monoma | monomial | 12x⁵:(3x²)=4x³ uz x≠0. | {"operation":"divide"}
Množenje polinoma monomom | product | 3x(2x²−x+4)=6x³−3x²+12x. | {"pattern":"monomial"}
Množenje dva binoma | product | (2x+3)(x−4)=2x²−5x−12. | {"pattern":"binomials"}
Kvadrat zbira | square | (x+5)²=x²+10x+25. | {"sign":"plus"}
Kvadrat razlike | square | (2x−3)²=4x²−12x+9. | {"sign":"minus"}
Razlika kvadrata | difference | 9x²−16=(3x−4)(3x+4).
Izdvajanje zajedničkog faktora | factor | 6x²+9x=3x(2x+3). | {"pattern":"common"}
Faktorizacija potpunog kvadrata | factor | x²−10x+25=(x−5)². | {"pattern":"square"}
Skraćivanje algebarskog razlomka | factor | (x²−9)/(x−3)=x+3 uz x≠3. | {"pattern":"rational-cancel"}
`);
block(8,'Jednačine s jednom nepoznatom','equation',`
Jednačina s nepoznatim sabirkom u algebraičkom zapisu | simple | x−7=12 ⇒ x=19. | {"shape":"additive"}
Jednačina s nepoznatim faktorom i dodatkom | simple | 4x+3=27 ⇒ 4x=24 ⇒ x=6. | {"shape":"ax+b"}
Jednačina s negativnim koeficijentom | simple | −3x+4=19 ⇒ −3x=15 ⇒ x=−5. | {"coefficientSign":"negative"}
Nepoznata na obje strane jednačine | both | 5x−2=2x+13 ⇒ 3x=15 ⇒ x=5.
Jednačina s jednom zagradom | parentheses | 3(x−2)=15 ⇒ x−2=5 ⇒ x=7. | {"parentheses":1}
Jednačina sa zagradama na obje strane | parentheses | 2(x+3)=3(x−1) ⇒ 2x+6=3x−3 ⇒ x=9. | {"parentheses":2}
Jednačina s razlomljenim koeficijentom | fraction | (2/3)x+1=5 ⇒ (2/3)x=4 ⇒ x=6. | {"shape":"coefficient"}
Jednačina s razlomljenim članovima | fraction | x/3−1/2=5/6 ⇒ x/3=4/3 ⇒ x=4. | {"shape":"denominators"}
Jednačina s decimalnim koeficijentima | simple | 0,5x+1,2=3,7 ⇒ x=5. | {"coefficientType":"decimal"}
Jednačina kao model tekstualnog zadatka | word | Broj uvećan za svoju polovinu daje 30: x+x/2=30 ⇒ x=20. | {"context":"number"}
Identična jednačina | identity | 2(x+3)=2x+6 vrijedi za svaki realni x.
Protivrječna jednačina | contradiction | 2(x+3)=2x+5 vodi na 6=5, pa nema rješenja.
`);
block(8,'Linearne nejednačine','inequality',`
Nejednačina s pozitivnim koeficijentom | simple | 3x+2<14 ⇒ x<4.
Nejednačina s negativnim koeficijentom | negative | −2x+3≤11 ⇒ −2x≤8 ⇒ x≥−4.
Nepoznata na obje strane nejednačine | simple | 5x−1≥2x+8 ⇒ 3x≥9 ⇒ x≥3. | {"bothSides":true}
Složena dvostruka nejednačina | compound | −2<3x+1≤10 ⇒ −1<x≤3.
Provjera pripadnosti skupu rješenja | check | x=2 zadovoljava 3x+1<8 jer je 7<8.
Najveći broj komada u budžetu | word | Uz 5 KM po komadu i 12 KM troška, 5n+12≤47 ⇒ n≤7; najviše 7 komada.
`);
block(8,'Vektori u ravni','vector',`
Vektor između zadanih tačaka | subtract | A(−1,2),B(4,−3) daju AB=(5,−5). | {"target":"points"}
Zbir dva vektora | add | (3,−2)+(−1,5)=(2,3).
Razlika dva vektora | subtract | (3,−2)−(−1,5)=(4,−7).
Množenje vektora pozitivnim skalarom | scale | 3·(2,−4)=(6,−12). | {"sign":"positive"}
Množenje vektora negativnim skalarom | scale | −2·(3,−1)=(−6,2). | {"sign":"negative"}
Dužina vektora | magnitude | Vektor (6,8) ima dužinu √(36+64)=10.
Provjera paralelnosti vektora | parallel | (2,3) i (6,9) su paralelni jer je drugi 3 puta prvi.
Vektorski opis središta duži | midpoint | OA=(2,4),OB=(8,10) ⇒ OM=(OA+OB)/2=(5,7).
`);
block(8,'Pitagorina teorema i primjene','pythagoras',`
Hipotenuza pravouglog trougla | hypotenuse | Katete 9 i 12 cm daju c=√(81+144)=15 cm.
Nepoznata kateta pravouglog trougla | leg | c=13,a=5 cm ⇒ b=√(169−25)=12 cm.
Dijagonala pravougaonika | rectangle | Stranice 6 i 8 cm daju dijagonalu 10 cm.
Dijagonala kvadrata | rectangle | Kvadrat stranice 5 cm ima dijagonalu √50=5√2 cm. | {"kind":"square"}
Visina jednakokrakog trougla | height | Krak 13 i osnovica 10 cm daju h=√(169−25)=12 cm. | {"kind":"isosceles"}
Visina jednakostraničnog trougla | height | a=8 cm ⇒ h=√(64−16)=4√3 cm. | {"kind":"equilateral"}
Obrnuta Pitagorina teorema | triangle | Stranice 5,12,13 zadovoljavaju 5²+12²=13², pa je trougao pravougli.
Rastojanje tačaka u koordinatama | distance | A(−1,2),B(2,6) imaju rastojanje √(3²+4²)=5.
`);
block(8,'Površine ravnih likova','triangle',`
Površina pravouglog trougla iz kateta | area | Katete 9 i 12 cm daju P=9·12/2=54 cm². | {"kind":"right"}
Površina jednakokrakog trougla uz Pitagorinu teoremu | area | Krak 13 i osnovica 10 cm daju h=12, pa P=60 cm². | {"kind":"isosceles"}
`);
block(8,'Površine ravnih likova','quadrilateral',`
Visina paralelograma iz površine | parallelogram | P=84 cm²,a=12 cm ⇒ h=7 cm. | {"measure":"height"}
Površina romba iz stranice i visine | rhombus | a=10,h=8 cm ⇒ P=80 cm². | {"measure":"area-height"}
Dijagonala romba iz površine | rhombus | P=60 cm²,d₁=12 cm ⇒ d₂=2P/d₁=10 cm. | {"measure":"diagonal"}
Visina trapeza iz površine | trapezoid | P=72 cm²,a=8,b=16 cm ⇒ h=2P/(a+b)=6 cm. | {"measure":"height"}
Nepoznata osnovica trapeza | trapezoid | P=50 cm²,h=5,a=8 cm ⇒ b=2P/h−a=12 cm. | {"measure":"base"}
Nepoznata dijagonala deltoida | kite | P=45 cm²,d₁=9 cm ⇒ d₂=2P/d₁=10 cm. | {"measure":"diagonal"}
`);
block(8,'Krug, luk i kružni isječak','circle',`
Poluprečnik iz prečnika | radius | Prečnik 18 cm daje r=9 cm.
Prečnik iz poluprečnika | diameter | Poluprečnik 6,5 cm daje d=13 cm.
Obim kruga iz poluprečnika | perimeter | r=5 cm,π=3,14 ⇒ O=31,4 cm.
Površina kruga iz poluprečnika | area | r=5 cm,π=3,14 ⇒ P=78,5 cm².
Poluprečnik kruga iz obima | perimeter | O=43,96 cm,π=3,14 ⇒ r=O/(2π)=7 cm. | {"inverse":true}
Dužina kružnog luka | arc | r=6 cm,α=120°,π=3,14 ⇒ l=(120/360)·2·3,14·6=12,56 cm.
Površina kružnog isječka | sector | r=6 cm,α=90°,π=3,14 ⇒ P=(1/4)·3,14·36=28,26 cm².
Površina kružnog prstena | ring | R=5,r=3 cm,π=3,14 ⇒ P=3,14(25−9)=50,24 cm².
`);
block(8,'Stepeni i naučni zapis','power',`
Veliki naučni zapis u običan zapis | scientific-inverse | 6,25·10⁵=625 000. | {"kind":"large"}
Mali naučni zapis u običan decimalni zapis | scientific-inverse | 7,2·10⁻³=0,0072. | {"kind":"small"}
Proizvod u naučnom zapisu | product | (2·10³)(3·10⁴)=6·10⁷. | {"scientific":true}
`);
block(8,'Polinomi i algebarski izrazi','polynomial',`
Računanje razlike kvadrata bez dugog množenja | difference | 103²−97²=(103−97)(103+97)=6·200=1 200. | {"numeric":true}
`);
block(8,'Jednačine s jednom nepoznatom','equation',`
Jednačina za obim pravougaonika | word | Stranice x i x+3 imaju obim 34 cm: 2(2x+3)=34 ⇒ x=7 cm. | {"context":"rectangle"}
Jednačina za uzastopne cijele brojeve | word | Zbir x i x+1 iznosi 45: 2x+1=45 ⇒ x=22, drugi broj 23. | {"context":"consecutive"}
`);
block(8,'Vektori u ravni','vector',`
Nepoznati vektor u vektorskom zbiru | add | u+(2,−3)=(7,1) ⇒ u=(5,4). | {"target":"unknown"}
`);
block(8,'Krug, luk i kružni isječak','circle',`
Centralni ugao iz dužine luka | arc | r=6 cm,l=12,56 cm,π=3,14 ⇒ α=360·l/(2πr)=120°. | {"target":"angle"}
Poluprečnik kruga iz površine | area | P=50,24 cm²,π=3,14 ⇒ r²=16 ⇒ r=4 cm. | {"inverse":true}
`);
block(8,'Pitagorina teorema i primjene','pythagoras',`
Visina oslonca ljestvi | leg | Ljestve 5 m i odmak podnožja 3 m daju visinu √(25−9)=4 m. | {"context":"ladder"}
`);

// 9. razred: functions, systems, similarity, space and data.
block(9,'Linearne i druge funkcije','function',`
Vrijednost direktno proporcionalne funkcije | value | y=3x za x=−2 daje y=−6. | {"intercept":0}
Vrijednost linearne funkcije s dodatkom | value | y=2x−5 za x=4 daje y=3. | {"intercept":"nonzero"}
Vrijednost linearne funkcije s racionalnim koeficijentom | value | y=(3/2)x+1 za x=2 daje y=4. | {"coefficientType":"fraction"}
Nepoznata x-koordinata iz vrijednosti funkcije | value | y=3x−2 i y=10 daju 3x=12 ⇒ x=4. | {"target":"x"}
Nula linearne funkcije | zero | y=4x−12 ima nulu x=3.
Presjek funkcije s y-osom | intercept | y=−2x+7 siječe y-os u (0,7).
Koeficijent smjera iz dvije tačke | slope | A(1,3),B(4,9) daju k=(9−3)/(4−1)=2.
Slobodni član iz koeficijenta i tačke | intercept | Za k=3 i A(2,8), n=8−3·2=2. | {"target":"from-point"}
Jednačina prave kroz dvije tačke | points | A(1,4),B(3,8) ⇒ k=2,n=2, pa y=2x+2.
Pripadnost tačke grafiku funkcije | value | A(3,5) pripada y=2x−1 jer je 2·3−1=5. | {"target":"membership"}
Rastuća linearna funkcija | monotonic | y=4x−7 raste jer je k=4>0. | {"slopeSign":"positive"}
Opadajuća linearna funkcija | monotonic | y=−3x+2 opada jer je k=−3<0. | {"slopeSign":"negative"}
Konstantna funkcija | monotonic | y=6 je konstantna jer je k=0. | {"slopeSign":"zero"}
Presjek grafika dvije funkcije | intersection | 2x+1=−x+7 ⇒ x=2,y=5; presjek je (2,5).
Paralelnost grafika linearnih funkcija | slope | y=3x+2 i y=3x−5 imaju isti k i različit n, pa su paralelne. | {"target":"parallel"}
Parametar za prolazak grafika kroz tačku | parameter | y=(m+1)x−2 prolazi kroz (3,10): 10=3(m+1)−2 ⇒ m=3. | {"target":"point"}
Parametar za zadanu nulu funkcije | parameter | y=2x+m ima nulu 4 kada 0=8+m ⇒ m=−8. | {"target":"zero"}
Konstanta obrnuto proporcionalne funkcije | inverse | Tačka (3,8) na y=k/x daje k=24. | {"target":"constant"}
Vrijednost obrnuto proporcionalne funkcije | inverse | y=18/x za x=−3 daje y=−6; x=0 nije dopušteno. | {"target":"value"}
Vrijednost kvadratnog izraza kao funkcije | value | y=x²−2x+3 za x=−2 daje y=11. | {"degree":2}
`);
block(9,'Sistemi linearnih jednačina','system',`
Sistem riješen zamjenom iz oblika y=ax+b | substitution | y=x+2, x+y=10 ⇒ 2x+2=10 ⇒ x=4,y=6. | {"isolate":"y"}
Sistem riješen zamjenom iz oblika x=ay+b | substitution | x=2y−1, x+y=8 ⇒ 3y−1=8 ⇒ y=3,x=5. | {"isolate":"x"}
Sistem eliminacijom suprotnih koeficijenata | elimination | x+y=9, x−y=3 ⇒ 2x=12 ⇒ x=6,y=3. | {"scale":false}
Sistem eliminacijom uz množenje jednačine | elimination | 2x+3y=13, x−y=−1 ⇒ 5y=15 ⇒ y=3,x=2. | {"scale":true}
Sistem s negativnim rješenjem | elimination | x+y=1, 2x−y=−7 ⇒ 3x=−6 ⇒ x=−2,y=3. | {"solutionSign":"mixed"}
Sistem s racionalnim rješenjem | substitution | x+y=2, x−y=1 ⇒ x=3/2,y=1/2. | {"solutionType":"fraction"}
Sistem s decimalnim koeficijentima | elimination | 0,5x+y=4, x−y=2 ⇒ x=4,y=2. | {"coefficientType":"decimal"}
Sistem bez rješenja | classification | x+y=2, 2x+2y=5 ⇒ jednake lijeve strane traže 4=5; nema rješenja. | {"kind":"none"}
Sistem s beskonačno mnogo rješenja | classification | x+y=3, 2x+2y=6 opisuju istu pravu. | {"kind":"infinite"}
Provjera uređenog para kao rješenja sistema | classification | Par (2,3) zadovoljava x+y=5 i 2x−y=1. | {"target":"verify"}
Brojevi iz zbira i razlike | word | x+y=40, x−y=8 ⇒ x=24,y=16. | {"context":"sum-difference"}
Broj ulaznica dvije cijene | word | 10 ulaznica po 4 ili 7 KM ukupno 52 KM: x+y=10,4x+7y=52 ⇒ x=6,y=4. | {"context":"tickets"}
Dob članova porodice kao sistem | word | Otac i sin imaju ukupno 50 godina; otac je 30 stariji ⇒ 40 i 10 godina. | {"context":"age"}
Pravougaonik iz obima i razlike stranica | word | O=36 cm i a−b=4 ⇒ a+b=18 ⇒ a=11,b=7. | {"context":"rectangle"}
Parametar i broj rješenja sistema | parameter | x+y=2, 2x+2y=m ima beskonačno mnogo rješenja za m=4; inače nijedno. | {"target":"classification"}
`);
block(9,'Sličnost i proporcionalna geometrija','similarity',`
Faktor sličnosti iz odgovarajućih stranica | scale | Stranice 6 i 15 cm daju k=15/6=5/2.
Nepoznata stranica sličnog trougla | side | Faktor k=3 i stranica 4 cm daju odgovarajuću stranicu 12 cm.
Stranica manjeg sličnog lika | side | Veća stranica 18 cm uz k=3 znači manju 6 cm. | {"inverse":true}
Obim sličnog lika | perimeter | O₁=24 cm,k=3/2 ⇒ O₂=36 cm.
Faktor sličnosti iz obima | perimeter | O₁=18,O₂=30 cm ⇒ k=30/18=5/3. | {"target":"scale"}
Površina sličnog lika | area | P₁=20 cm²,k=3 ⇒ P₂=9·20=180 cm².
Faktor sličnosti iz površina | area | P₂/P₁=81/9=9 ⇒ k=√9=3. | {"target":"scale"}
Talesova teorema u trouglu | thales | DE∥BC, AD/AB=2/3 i BC=12 ⇒ DE=8 cm. | {"target":"parallel-segment"}
Talesova teorema za dijelove stranica | thales | DE∥BC, AD/DB=2/3 i AE=6 ⇒ EC=9 cm. | {"target":"split"}
Razmjera makete i površina | area | Model u razmjeri 1:10 ima površinu 25 cm²; stvarna odgovarajuća površina je 2 500 cm². | {"context":"model","inverse":true}
`);
block(9,'Prostorni odnosi i diedar','spatial',`
Mjera diedra iz normalnog presjeka | diedar | Normalni presjek ima ugao 64°; diedar također ima mjeru 64°.
Susjedni suplementni diedar | supplement | Diedar 72° ima susjedni suplementni diedar od 108°.
Susjedni diedri u zadanoj razmjeri | ratio | Omjer 2:3 uz zbir 180° daje 72° i 108°.
Susjedni diedri u zadanoj razlici | supplement | β=α+30°,α+β=180° ⇒ α=75°,β=105°. | {"target":"difference"}
Diedar u pravom normalnom presjeku | normal | Ako normalni presjek daje prav ugao, dvije ravni su normalne i diedar je 90°. | {"target":"right"}
Zašto kosi presjek ne određuje diedar | normal | Diedar se mjeri presjekom okomitim na njegovu ivicu; ugao proizvoljnog kosog presjeka nije njegova definisana mjera. | {"target":"definition"}
Paralelne i presječne ravni | planes | Dvije različite paralelne ravni nemaju zajedničku tačku; dvije presječne imaju zajedničku pravu. | {"target":"planes"}
Odnos prave i ravni | planes | Prava može ležati u ravni, sjeći je u jednoj tački ili biti paralelna s njom bez presjeka. | {"target":"line-plane"}
Mimoilazne prave u prostoru | planes | Na kvadru neke ivice nisu paralelne i ne sijeku se; tada su mimoilazne i nisu u istoj ravni. | {"target":"skew"}
Normalna prava i udaljenost do ravni | normal | Udaljenost tačke do ravni je dužina normalne duži: kod vertikalne visine 7 cm udaljenost je 7 cm. | {"target":"distance"}
`);
block(9,'Geometrijska tijela','solid',`
Površina kocke | cube | a=4 cm ⇒ P=6·4²=96 cm². | {"measure":"surface"}
Zapremina kocke | cube | a=4 cm ⇒ V=4³=64 cm³. | {"measure":"volume"}
Ivica kocke iz zapremine | cube | V=125 cm³ ⇒ a=∛125=5 cm. | {"measure":"edge","from":"volume"}
Prostorna dijagonala kocke | diagonal | a=3 cm ⇒ D=√(3a²)=3√3 cm. | {"shape":"cube"}
Površina kvadra | cuboid | a=3,b=4,c=5 cm ⇒ P=2(12+15+20)=94 cm². | {"measure":"surface"}
Zapremina kvadra | cuboid | a=3,b=4,c=5 cm ⇒ V=60 cm³. | {"measure":"volume"}
Visina kvadra iz zapremine | cuboid | V=120 cm³,a=5,b=4 cm ⇒ c=120/(5·4)=6 cm. | {"measure":"height"}
Prostorna dijagonala kvadra | diagonal | a=3,b=4,c=12 cm ⇒ D=√(9+16+144)=13 cm. | {"shape":"cuboid"}
Površina otvorene pravougaone posude | cuboid | Posuda bez poklopca 3×4×5 cm ima P=3·4+2·3·5+2·4·5=82 cm². | {"measure":"open-surface"}
Zapremina prave prizme | prism | B=24 cm²,h=10 cm ⇒ V=240 cm³. | {"measure":"volume"}
Omotač prave prizme | prism | Obim osnove 18 cm,h=7 cm ⇒ M=126 cm². | {"measure":"lateral"}
Ukupna površina prave prizme | prism | B=24 cm²,O=18 cm,h=7 cm ⇒ P=48+126=174 cm². | {"measure":"surface"}
Visina prizme iz zapremine | prism | V=360 cm³,B=30 cm² ⇒ h=12 cm. | {"measure":"height"}
Zapremina piramide | pyramid | B=36 cm²,h=10 cm ⇒ V=36·10/3=120 cm³. | {"measure":"volume"}
Površina pravilne četverostrane piramide | pyramid | a=6,s=5 cm ⇒ P=a²+2as=36+60=96 cm². | {"measure":"surface"}
Visina piramide iz zapremine | pyramid | V=96 cm³,B=36 cm² ⇒ h=3V/B=8 cm. | {"measure":"height"}
Zapremina valjka | cylinder | r=3,h=5 cm,π=3,14 ⇒ V=3,14·9·5=141,3 cm³. | {"measure":"volume","pi":3.14}
Površina valjka | cylinder | r=3,h=5 cm,π=3,14 ⇒ P=2·3,14·3·8=150,72 cm². | {"measure":"surface","pi":3.14}
Visina valjka iz zapremine | cylinder | V=157 cm³,r=2 cm,π=3,14 ⇒ h=157/(3,14·4)=12,5 cm. | {"measure":"height","pi":3.14}
Zapremina kupe | cone | r=3,h=4 cm,π=3,14 ⇒ V=3,14·9·4/3=37,68 cm³. | {"measure":"volume","pi":3.14}
Površina kupe | cone | r=3,s=5 cm,π=3,14 ⇒ P=3,14·3·(3+5)=75,36 cm². | {"measure":"surface","pi":3.14}
Izvodnica kupe iz visine i poluprečnika | cone | r=6,h=8 cm ⇒ s=√(36+64)=10 cm. | {"measure":"slant"}
Površina sfere | sphere | r=3 cm,π=3,14 ⇒ P=4·3,14·9=113,04 cm². | {"measure":"surface","pi":3.14}
Zapremina lopte | sphere | r=3 cm,π=3,14 ⇒ V=4·3,14·27/3=113,04 cm³. | {"measure":"volume","pi":3.14}
Poluprečnik sfere iz površine | sphere | P=314 cm²,π=3,14 ⇒ r²=314/(4·3,14)=25 ⇒ r=5 cm. | {"measure":"radius","from":"surface","pi":3.14}
`);
block(9,'Statistika i obrada podataka','statistics',`
Aritmetička sredina pojedinačnih podataka | mean | Podaci 6,8,10 imaju sredinu 24/3=8.
Medijan neparnog broja podataka | median | Za 3,7,9,11,15 medijan je treći podatak 9. | {"parity":"odd"}
Medijan parnog broja podataka | median | Za 2,5,8,11 medijan je (5+8)/2=6,5. | {"parity":"even"}
Mod kao najčešća vrijednost | mode | U nizu 2,3,3,5,7 najčešća vrijednost je 3.
Raspon podataka | range | Za 4,11,7,2 raspon je 11−2=9.
Ponderisana aritmetička sredina | weighted | Dvije ocjene 3 i tri ocjene 5 daju sredinu (2·3+3·5)/5=4,2.
Apsolutna frekvencija podatka | frequency | U 2,4,2,5,2,4 frekvencija broja 2 je 3. | {"target":"absolute"}
Relativna frekvencija podatka | frequency | Ako se podatak javlja 6 puta među 24, relativna frekvencija je 6/24=1/4=25%. | {"target":"relative"}
Nedostajući podatak iz poznate sredine | mean | Sredina četiri broja je 8; tri su 5,7,10 ⇒ četvrti je 32−22=10. | {"target":"missing"}
Promjena sredine dodavanjem podatka | mean | Tri broja imaju sredinu 6; dodatkom 10 nova je sredina (18+10)/4=7. | {"target":"updated"}
`);
block(9,'Vjerovatnoća i prebrojavanje','probability',`
Vjerovatnoća zadanog broja na kocki | simple | Na pravilnoj kocki P(broj 4)=1/6. | {"context":"die","target":"single"}
Vjerovatnoća parnog broja na kocki | simple | P(paran)=3/6=1/2 jer su povoljni 2,4,6. | {"context":"die","target":"even"}
Vjerovatnoća izvlačenja boje | simple | 3 crvene i 5 plavih kuglica daju P(crvena)=3/8. | {"context":"balls"}
Vjerovatnoća komplementarnog događaja | complement | Ako je P(crvena)=3/8, P(nije crvena)=5/8.
Nezavisno bacanje novčića i kocke | independent | P(pismo i šest)=1/2·1/6=1/12. | {"context":"coin-die"}
Dvije uzastopne kuglice uz vraćanje | independent | Uz 3 crvene od 8, P(dvije crvene)=3/8·3/8=9/64. | {"context":"replacement"}
Dvije uzastopne kuglice bez vraćanja | without-replacement | Uz 3 crvene od 8, P(dvije crvene)=3/8·2/7=3/28.
Unija događaja s preklapanjem | union | Na kocki A=paran,B=veći od 3; unija je {2,4,5,6}, pa P=4/6=2/3.
Princip proizvoda pri prebrojavanju | counting | 3 majice i 4 hlače daju 3·4=12 kombinacija. | {"kind":"product"}
Uređeni izbor bez ponavljanja | counting | Prvo i drugo mjesto među 5 takmičara daju 5·4=20 uređenih izbora. | {"kind":"ordered-without-repetition"}
`);

function build(){
 const counts=Object.fromEntries([5,6,7,8,9].map(g=>[g,items.filter(x=>x.grade===g).length]));
 if(items.length!==500||Object.values(counts).some(n=>n!==100)) throw new Error('Expected 100 per grade: '+JSON.stringify(counts));
 if(new Set(items.map(x=>x.title)).size!==500) throw new Error('Duplicate learning-skill title');
 for(const item of items){
  if(item.body.length<3||item.body.some(p=>p.length<50)) throw new Error('Insufficient lesson content '+item.id);
  if(!rules[item.practice.family]) throw new Error('Unknown family '+item.practice.family);
 }
 const target=path.join(__dirname,'../content/math-catalog.json');
 fs.writeFileSync(target,JSON.stringify(items,null,2)+'\n');
 return {items,counts,target};
}
if(require.main===module){const {counts,target}=build();console.log('Math catalog: 500 skills, '+JSON.stringify(counts)+' -> '+target);}
module.exports={build,items};
