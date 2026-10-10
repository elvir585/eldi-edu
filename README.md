# ELDI EDU 33.33.0 — digitalna učionica / Dark Edition

**Matematika i informatika od 5. do 9. razreda kao Windows aplikacija.**

Autori: **Dino Isanović · Elvir Čajić · Damir Bajrić · Jasmin Suljkanović**.

## Novo u 33.33

Korisnička oznaka: **33.33**. Tehnička verzija: **33.33.0**. Jedno objedinjeno izdanje za Windows i UPINITK hosting.

## Šta je novo

- Početni putevi **Uči, Vježbaj, Takmiči se, Stvaraj**. Napredne radionice ostaju u meniju „Sve radionice“.
- **35 vođenih nastavnih cjelina**: sedam po razredu od 5. do 9, ukupno 20 matematičkih i 15 informatičkih. Objašnjenje, riješen primjer, tri nivoa, savjet, provjera brojčanog odgovora i preporuka za radionicu.
- **Čas od 45 minuta**: uvod 5, primjer 10, samostalan rad 20, provjera 7, osvrt 3 minute. Pauza i nastavak poslije osvježavanja; tajmer ne upravlja drugim računarima.
- **Diferencirana vježba**: osnovni, srednji i napredni nivo. Preporuka cjelina na osnovu posljednjih pokušaja. Najviše 300 pokušaja u lokalnom pregledu. Pomoć se bilježi.
- **Lični vremenski izazov**: deset zadataka, 20 minuta, izbor razreda/predmeta/nivoa, nastavak tekuće provjere nakon osvježavanja, objašnjenja na kraju. Lokalna priprema, ne nadzirano takmičenje ili službena rang-lista.
- **Stvarni 3D studio**: postojeći modeli, blokovi, presjeci i mreže; novi predlošci scena, četiri pogleda, analitička površina i zapremina. Novi blok za površinu/zapreminu radi u JS interpreteru i Python mostu Windows aplikacije.
- **Radni listovi** za pet razreda, odvojena nastavnička rješenja i **105 JSON provjera** za online uvoz (35 cjelina × tri nivoa, po šest pitanja). Osnovni štampani paket ima 105 zadataka, nije 105 različitih naučnih oblasti.
- **Offline web radionica**: ručna priprema dugmetom „Rad bez interneta“. Čuva samo javne datoteke radionice na tom uređaju. Online računi, predaje i AI i dalje trebaju internet. Brisanje podataka preglednika uklanja offline kopiju.
- **PHP/MySQL online učionica**: nastavnički račun, odjeljenja, grupno kreiranje učeničkih pristupa, zadaci i rokovi, serverom bodovane brojčane provjere, JSON projekti i tekst, pregled, komentar, zasebna nastavnički unesena ocjena, CSV rezultati i arhiva odjeljenja. Jedna konačna predaja po zadatku. Zatvaranje/otvaranje predaje i reset učeničke lozinke.


[Postavljanje na hosting](docs/POSTAVLJANJE-33.33.txt) · [Potpuni opis i granice](docs/IZDANJE-33.33.md)

## Prethodni Studio 33 i očuvani moduli

**Studio 33** povezuje 3D blokove i mreže, robota, web razvoj, stvarni SQLite, algoritme, logiku/procesor, mreže/API simulaciju, podatke i grafikone, programerske vježbe, takmičarsku pripremu, projekte i izvještaje. Tamni/svijetli/kontrastni prikaz, Projektor, Olovka, žive varijable, snimljeni koraci i prenosivi JSON radovi.

**Web radionica za UPINITK:** raspakujte web ZIP u `public_html`. Učenici zatim otvaraju `/eldi-edu/ucionica/` bez instalacije. Windows izdanje dodatno uključuje Scratch, postojeće zbirke i Python/C/C++/Java. Radionica čuva rad lokalno; zasebna nova online učionica ima mrežne naloge, zadatke i predaje JSON datotekom.

**Novi sadržaj:** 16 projektnih zadataka, 20 zadataka za ispravku s 80 testova, 160 matematičkih postavki i 20 informatičkih pitanja za 5–9. razred. To su originalne vježbe za pripremu, ne službeni takmičarski zadaci.

[Detaljan opis i granice 33.33](docs/IZDANJE-33.md) · [Plan prvog časa](website/eldi-edu/PRVI-CAS-33.txt) · [Postavljanje na hosting](website/POSTAVLJANJE.txt).

Raniji matematički laboratorij, 1000 blokovskih projekata i ostali Windows moduli ostaju dostupni.

## Preuzimanje i pokretanje

Otvorite **[najnovije GitHub izdanje](https://github.com/elvir585/eldi-edu/releases/latest)**.

| Datoteka | Namjena |
|---|---|
| `ELDI-EDU-33.33.0-Kompletan-paket.zip` | Portable EXE, zbirke, Scratch izvori/primjeri, web paket i upute zajedno |
| `ELDI-EDU-33.33.0-Portable-x64.exe` | Direktno pokretanje bez instalacije |
| `ELDI-EDU-33.33.0-UPINITK-public_html.zip` | Web centar i rad u pregledniku: raspakovati u public_html |
| `ELDI-EDU-33.33.0-Radionice-i-takmicenja.zip` | Novi projekti, zadaci, rješenja i plan prvog časa |
| `ELDI-EDU-33.33.0-Setup-x64.exe` | Instalacija s prečicom |
| `ELDI-EDU-33.33.0-1000-Blokovskih-projekata.zip` | 1000 riješenih Blockly projekata |
| `ELDI-EDU-33.33.0-Zbirke-i-rjesenja.zip` | Obje originalne knjige i digitalna rješenja |
| `ELDI-EDU-33.33.0-Programerski-izazovi.zip` | 55 zadataka, Python/C++ rješenja i početni kodovi |
| `ELDI-EDU-33.33.0-Scratch-primjeri.zip` | Šest originalnih Scratch `.sb3` projekata |
| `ELDI-EDU-33.33.0-Scratch-izvori.zip` | Odgovarajući izvori i licenca Scratch komponente |

Windows 10/11 x64. Ugrađeni su nastavni sadržaj, Scratch/Blockly, Python, GCC/G++ i Java JDK. Poslije preuzimanja internet nije potreban za nastavu i školske programe. ChatGPT i API odgovori trebaju internet. Aplikacija nije digitalno potpisana.

## ChatGPT bez API ključa

**Uključena ispravka iz 11.0.1:** povezani račun u 11.0.0 mogao je završiti prijavu, ali slanje pitanja je odbijeno zbog eksperimentalne `granular` politike odobravanja i zastarjelog `readOnly.access` parametra. Za ugrađeni Codex 0.161.0 sada se koristi stabilna politika `never` i podržani read-only format. Alati ostaju isključeni. Windows provjera uključuje stvarno parsiranje zahtjeva u službenom servisu bez prijave i bez inferencije. Nije potreban novi API ključ ni druga pretplata.

1. Otvorite **Pitaj AI asistenta**.
2. Kliknite **Prijavi se ChatGPT računom** i dovršite službenu prijavu u pregledniku. Dostupna je i prijava kodom uređaja.
3. Osvježite ponuđenu listu modela. Odaberite model i nivo razmišljanja koje servis nudi vašem računu.
4. Pregledajte kontekst zadatka i pošaljite pitanje.

Za ovu prijavu **ne unosi se API ključ**. Ugrađeni službeni Codex app-server koristi pristup prijavljenog ChatGPT računa. Podrazumijevani traženi izbor je **GPT‑6.1 Sol / Ultra**; ako nije ponuđen, aplikacija to prikazuje i traži da korisnik odabere dostupnu opciju. Lista modela nije dokaz da je svaki model odobren: uspješno završen zahtjev potvrđuje pristup za taj poziv. Model se ne zamjenjuje automatski. Limiti i potrošnja slijede račun i pretplatu korisnika; ovo izdanje ne daje Pro pretplatu drugim korisnicima.

Svaki korisnik prijavljuje vlastiti račun. Prijava je odvojena od postojećih Codex instalacija i profila učenika. Pristupne tokene upravlja službeni servis uz sistemsku zaštitu; ELDI ih ne čita, ne prikazuje i ne dodaje GitHubu, profilima ili ZIP paketima. Dostupna je odjava.

Pomoć ima savjet, objašnjenje, rješenje i analizu greške. Kontekst se može isključiti prije slanja. Kod se kopira, čuva ili otvara u editoru, bez automatskog izvršavanja. Asistent radi kao tekstualni tutor s isključenim alatima i odvojenim radnim prostorom. Osnovna nastava ostaje dostupna bez prijave.

**Dodatne opcije:** OpenAI API sa vlastitim API ključem i lokalni Ollama servis sa preuzetim modelom. API obračun je zaseban od ChatGPT pretplate. Ollama model nije uključen u EXE.

Službena dokumentacija: [Codex app-server](https://learn.chatgpt.com/docs/app-server), [prijava](https://learn.chatgpt.com/docs/auth), [modeli](https://learn.chatgpt.com/docs/models). Protokol i stvarni ugrađeni servis provjeravaju se bez prijave/inferencije; živa prijava i odgovor trebaju korisnikov račun.

## Digitalna matematička sveska

Nova sekcija čuva redove postupka i bilješke, tačno provjerava podržane računske jednakosti i linearne jednačine i prikazuje prvu grešku. Osam porodica: operacije, razlomci, dvojni razlomci, NZD, NZS, djeljivost, linearne jednačine i procenti. Dostupne vrste prilagođene su razredu, kroz 32 kombinacije razreda i porodice.

Do 60 bodova donose različiti tačni međukoraci, a 40 konačan odgovor. Ponavljanje istog reda ne povećava rezultat. Netačan korak zaustavlja potpuno priznavanje daljeg postupka dok se ne ispravi. Ovo je provjera definisanih oblika koraka, a ne automatsko ocjenjivanje proizvoljnih dokaza ili eseja.

Sačuvani radovi, JSON uvoz/izvoz, štampa praznog lista ili postupka, pomoć i evidencija samostalnog rada. Geometrija prikazuje pravougaonik, trougao i krug, a koordinatni sistem funkcije i tačke koje se mogu pomicati ili unositi tastaturom. Matematički laboratorij i postojeća velika zbirka ostaju dostupni.

## Nastavnički centar

Odjeljenja i spiskovi za 5–9. razred, povezivanje učenika s lokalnim profilima, zaduženja od **1 do 50** zadataka, izbor predmeta/oblasti/nivoa, upute i rok. Nastavnik dodjeljuje zadatke profilima na istom računaru ili ih prenosi JSON datotekama. Učenik otvara dodijeljeni rad, unosi odgovore i postupak i predaje ga.

Automatski rezultat i nastavnička ocjena prikazuju se odvojeno. Nastavnik pregledava učenikov zapis, dodaje komentar i preporuku. Rezultati ostaju u nastavničkoj evidenciji i kada zajednička historija provjera pređe 100 zapisa. Dostupni su CSV izvještaji, štampa i diplome/potvrde rezultata. CSV zaštita sprečava da se ime ili komentar protumači kao formula.

Ovaj raniji Nastavnički centar je lokalni. Nova zasebna PHP/MySQL online učionica dostupna je na /eldi-edu/online/ nakon konfiguracije hostinga.

## Scratch studio

Posebna sekcija koristi službeni Scratch editor **15.2.0**, ugrađen za rad bez interneta. Otvaranje/čuvanje `.sb3`, zelena zastavica, događaji, tastatura, likovi, kostimi, pozadine, zvukovi, crtanje i uređivanje medija. Projekti se čuvaju u profilu uz mogućnost zasebnog izvoza. Uvoz ne pokreće program.

Šest originalnih ELDI primjera: upravljanje strelicama, zvijezda s olovkom, matematički kviz, animacija kostima, klik-brojač i simulacija kretanja. Ugrađena offline biblioteka ima **1348 provjerenih medijskih datoteka**. Vanjski servisi, uređaji i prijava na Scratch web nisu dio offline rada; mikrofon se ne uključuje automatski.

Komponenta se učitava u zasebnom lokalnom okviru. Službeni bundle ima dokumentovanu prilagodbu putanja za `file://`, tako da kostimi i zvukovi mogu otvoriti potrebne dijelove editora. Originalni bundle, kontrolne vrijednosti, licenca, povezivanje na tačan izvorni commit i deterministički build uključeni su u pripadajuću dokumentaciju i izvore. Detalji: [docs/SCRATCH.md](docs/SCRATCH.md).

## Put učenja i kurikulum

**91 cjelina** organizuje svih **500 matematičkih + 500 informatičkih vještina** i njihove preduslove. Svaka lekcija vodi kroz objašnjenje, riješen primjer, samostalan zadatak, stvarnu provjeru odgovora i preporuku. Dnevni izbor od 1–5 vještina koristi zabilježene pokušaje i preporučuje ponavljanje ili sljedeći korak.

Mapa kurikuluma omogućava nastavničko dodavanje ishoda, povezivanje vještina, oznaku, izvor, stranicu, školsku godinu, pregled i bilješke o nedostajućem sadržaju. Uvoz/izvoz JSON dopunjava mapu.

Početna mapa je **urednički plan**, sa **0 službeno potvrđenih povezivanja**. Korisnički status „pregledano“ nije odobrenje Pedagoškog zavoda. Programi TK uvode se postepeno, pa nastavnik bira važeći dokument i godinu. Službeni izvor: [Pedagoški zavod TK](https://pztz.ba/Page.aspx?id1=62). Detalji: [docs/CURRICULUM.md](docs/CURRICULUM.md).

## Programerski izazovi i četiri jezika

**55 različitih originalnih zadataka**, po 11 za svaki razred. Od velikih brojeva, uslova i petlji do teksta, nizova, brojnih sistema, teorije brojeva, pretrage i grafova. Svaki zadatak ima **8 testova**: dva javna primjera i šest skrivenih slučajeva. U editoru se program stvarno pokreće i ocjenjuje u Pythonu, C-u, C++-u ili Javi.

Prikazuju se rezultat testova, procenat, ocjena 1–5, historija i samostalan/pomognut rad. Za skrivene slučajeve povratna poruka ne otkriva ulaz ni očekivani izlaz. Početni kodovi postoje za sva četiri jezika, a riješeni primjeri za Python i C++. Pregled rješenja označava korištenje pomoći.

Svih **110 Python/C++ referentnih programa** provjereno je kroz **880 stvarnih izvršavanja**. ZIP sa 608 datoteka sadrži tekstove, javne primjere, početne kodove i rješenja; ne sadrži skrivene testove. Slobodni editor s ranijih 18 zadataka ostaje zaseban. Java koristi javnu klasu `Main`.

Tekstualni programi rade s pravima Windows korisnika. Vremenska i izlazna ograničenja prekidaju petlje i prevelik izlaz; to nije OS sandbox.

## Postojeće zbirke i blokovski projekti

- **1000 imenovanih ciljeva učenja:** po 100 za svaki razred i predmet. Broj označava cjeline i vještine, ne 1000 širokih naučnih oblasti.
- Matematička zbirka: **500 vještina × 200 indeksa = 100.000 indeksiranih generisanja**, tri nivoa, **41 problemski zadatak**, odgovori, bilješke i radni listovi do 50 zadataka. Indeksi ne garantuju sve različite koncepte/brojeve.
- **1000 Blockly projekata = 100 porodica × 10 scenarija**, 200 po razredu, uz 60 ranijih izazova. Biblioteka, pretraga, koraci, stvarno izvršavanje, testni ulazi i ZIP/JSON uvoz/izvoz. Ovo je zaseban studio u odnosu na Scratch.
- Programiranje — Python 3 i C++17, Elvir Čajić, 2026: **464 stranice, 162 zadatka, 324 programa, 109 teorijskih sekcija**. Provjereni su svi objavljeni primjeri.
- Matematička zbirka PZTK, januar 2016: originalnih **203 stranice**, 24 oblasti i **53 odabrana digitalna zadatka**, od kojih 49 imaju provjeru numeričkog odgovora. Ostali zadaci čitaju se u PDF-u.
- Vlastite knjige, sekcije i zadaci sa uvozom/izvozom JSON/ZIP.
- **142 dodatne lekcije**, 426 pitanja i objašnjenja.

## Ocjene, značke i diplome

Provjere imaju 1–50 zadataka. Ocjene su 1–5, s početnim pragovima 50/65/80/90%, prilagodljivim prije provjere. **16 znački** prati sačuvane uspjehe; nova matematička sveska i programerski izazovi doprinose odgovarajućim značkama.

Diplome/potvrde sadrže ime učenika, rezultat, ocjenu, datum, oznaku, pečat ELDI EDU i stilizovana štampana imena četiri autora. Štampa i PDF su dostupni. Dokument potvrđuje rezultat u aplikaciji; imena nisu digitalni potpisi i diploma nije službena školska isprava.

## Izgled, profili i sigurnosne kopije

Dark Edition ima dublju tamnu podlogu, tirkizne i ljubičaste akcente, novi pregled rada, grupisanu navigaciju i pretragu sadržaja **Ctrl+K**. Dostupni su veći tekst, svijetla tema i nastavak posljednjeg odjeljka. Diplome i radni listovi zadržavaju svijetli papir za štampanje.

Profili, nacrti i projekti čuvaju se lokalno. Nadogradnja koristi istu bazu i prihvata stare profile. Izvoz profila ostaje JSON schema3 radi kompatibilnosti. Nova sekcija **Kopije i nova izdanja** čuva pet posljednjih lokalnih kopija cijele učionice, omogućava pregled/vraćanje i JSON prenos. Prije vraćanja čuva se trenutno stanje. AI pristupni podaci nisu dio kopije.

Provjera GitHub izdanja pokreće se na dugme; preuzimanje otvara odgovarajuće GitHub izdanje. Aplikacija se ne zamjenjuje automatski.

## Razvoj i provjere

Node.js24 ili noviji. `npm ci`, `npm run scratch:bundle`, `npm run check`, `npm start`. Windows jezički alati: `npm run runtime:bundle`, zatim `npm run chatgpt:bundle` (prvi postupak prazni mapu runtimes). `npm run build:win` gradi Portable i Setup.

Scratch je zasebna prikvačena zavisnost u `scratch-editor/package-lock.json`. Build provjerava bundle i MD5 medijskih datoteka, priprema primjere i odgovarajuće izvore. Codex binary je prikvačen na službenu verziju0.161.0 sa SHA256 provjerom; aplikacija ne traži terminal/npm od krajnjeg korisnika.

GitHub Actions provjerava sve modele podataka i matematičke primjere, Blockly rješenja, 324 primjera programske knjige i 880 slučajeva novih izazova. Stvarni Windows testovi pokrivaju četiri jezika, nastavnički tok, svesku, grafikone, Scratch VM/SB3/kostime/zvukove, uvoz/izvoz i backup, ChatGPT servis bez prijave, kompaktan izgled i jednu A4 PDF diplomu. Iste korisničke provjere pokreću se i u zapakovanoj aplikaciji prije objave.

Službene komponente zadržavaju pripadajuće licence i autorstvo; vidi [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
