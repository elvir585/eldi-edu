# ELDI EDU 10.5.0 — 1000 blokovskih projekata + AI / Dark Edition

**Matematika i informatika od 5. do 9. razreda kao Windows aplikacija koja radi bez interneta.**

Autori: **Dino Isanović · Elvir Čajić · Damir Bajrić · Jasmin Suljkanović**.

## Preuzimanje za Windows

Otvorite **[najnovije izdanje](https://github.com/elvir585/eldi-edu/releases/latest)**:

- `ELDI-EDU-10.5.0-Portable-x64.exe` — direktno pokretanje bez instalacije.
- `ELDI-EDU-10.5.0-Setup-x64.exe` — instalacija s prečicom na radnoj površini.
- `ELDI-EDU-10.5.0-1000-Blokovskih-projekata.zip` — 1000 riješenih Blockly projekata za učitavanje i pokretanje.
- `ELDI-EDU-10.5.0-Zbirke-i-rjesenja.zip` — obje knjige, zadaci, postupci i izvorne datoteke rješenja.

Windows 10/11 x64. Paket uključuje nastavni sadržaj, Blockly, Python, GCC/G++ i Java JDK. Poslije preuzimanja internet nije potreban za nastavni sadržaj i izvršavanje programa. OpenAI asistent koristi internet; lokalni Ollama zahtijeva instaliran servis i preuzet model. [GitHub Actions](https://github.com/elvir585/eldi-edu/actions/workflows/build-windows.yml) provjerava i gradi obje EXE datoteke prije objave.

## Zbirke i rješenja

Nova zasebna sekcija povezuje originalne knjige, digitalne zadatke, pomoć po koracima, bilješke i editor. Tamni prikaz ima kartice knjiga, pretragu, filtere po cjelini i razredu, teorijske lekcije i ugrađeni PDF čitač.

- **Programiranje — Python 3 i C++17**, Elvir Čajić, Tuzla 2026: cijela knjiga od **464 stranice**, **162 zadatka**, **324 potpuna programa** i **109 teorijskih sekcija**. Zadaci čuvaju tekst, ulaz/izlaz, primjere, postupak, složenost i porijeklo. Kod se može otvoriti u editoru s primjerom ulaza ili sačuvati kao `.py` / `.cpp`.
- **Zbirka zadataka iz matematike za osnovne škole**, Pedagoški zavod Tuzlanskog kantona, januar 2016: originalnih **203 stranice**, indeks **24 oblasti** i prilog s formulama. Dodatno su obrađena **53 odabrana zadatka**: 49 s provjerom numeričkog odgovora i 4 za samostalno poređenje dokaza ili postupka. Ostatak knjige dostupan je u PDF-u. Uočene greške izvornog rješenja jasno su označene uz digitalni postupak; originalni PDF nije mijenjan.

Pomoć se otkriva postepeno. Evidencija razlikuje ličnu oznaku vježbanja, automatski provjeren matematički odgovor i korištenje pomoći. Provjera odgovora ne ocjenjuje zapisani postupak. Programerska rješenja prošla su kompilaciju/sintaksnu provjeru i izvođenje svih **324 objavljena primjera**; ovo nije dokaz ispravnosti za svaki mogući ulaz.

Dugmad **„Nova sekcija“** i **„Moj zadatak“** omogućavaju vlastite zbirke s tekstom, savjetima, postupkom, primjerima i Python/C++ kodom. Sekcije se čuvaju u profilu i mogu izvesti/uvesti kao JSON ili ZIP. Uvezeni kod se ne pokreće automatski. Naprednije teme iz knjige programiranja nisu ograničene na gradivo osnovne škole.

ZIP sadrži `pack.json`, oba originalna PDF-a, kataloge, izvještaj provjere i 162 programske mape. Svaka mapa ima `README.md`, `solution.py`, `solution.cpp`, `example-1.in` i `example-1.out`. Paket se uvozi u ovoj sekciji; PDF-i i kodovi mogu se koristiti i zasebno. ZIP sa svim izvornim knjigama čuva se direktno iz aplikacije. Bilješke učenika izvoze se kroz rezervnu kopiju profila.

Autori aplikacije ostaju **Dino Isanović, Elvir Čajić, Damir Bajrić i Jasmin Suljkanović**. Izvorne knjige zadržavaju svoje autorstvo i atribuciju.

## 500 matematičkih + 500 informatičkih cjelina

Katalog ima **100 zasebno imenovanih ciljeva učenja po razredu i predmetu**, ukupno 1000. To su tematske cjeline i pojedinačne vještine, a ne 1000 širokih naučnih oblasti. Svaka sadrži objašnjenje, razrađen primjer i praktični zadatak s unosom odgovora. Pretraga, razred i područje pomažu da se pronađe gradivo; prikaz je podijeljen na stranice.

Matematika obuhvata velike prirodne brojeve i operacije, redoslijed računanja, mjerne jedinice, djeljivost sa 2, 4, 5, 6, 9, 10, 15 i 25, NZD/NZS, proste i složene brojeve, faktorizaciju, razlomke i dvojne razlomke, decimale, cijele i racionalne brojeve, procente i proporcije, stepene i korijene, polinome, jednačine i sisteme, funkcije, uglove i diedre, ravne figure, Pitagorinu teoremu, geometrijska tijela, statistiku i vjerovatnoću.

Informatika obuhvata uređaje, datoteke i operativne sisteme, sigurnost i mreže, dokumente, prezentacije i tabele, algoritme i Scratch koncepte, binarni/oktalni/dekadni/heksadecimalni sistem, logiku, obradu podataka, web i baze podataka te Python, C, C++ i Javu. Zadaci traže konkretan račun, izlaz programa, redoslijed vrijednosti, naredbu ili precizno definisan rezultat. Tekstualna objašnjenja učenika nisu automatski ocijenjeni eseji.

Sadržaj je autorska zbirka za učenje. Nastavnik ga prilagođava svom službenom planu; potpuna usklađenost sa svakim kantonalnim kurikulumom nije potvrđena.

## Zbirka matematike i samostalno rješavanje

Zbirka koristi svih **500 matematičkih vještina**, sa po 200 indeksiranih generisanja i tri nivoa težine. Ukupno je dostupno **100.000 indeksiranih generisanja**; broj nije broj različitih tema niti garancija da su svi brojevi i odgovori međusobno različiti. Kod pojedinih stalnih pojmova, kao što je svojstvo broja 1, različiti indeksi mogu ponoviti isti koncept. Uz njih dolazi **41 problemski zadatak** s više povezanih dijelova.

- Učenik upisuje broj, razlomak, listu ili traženi tekst i vlastiti postupak.
- Svaki dio odgovora se provjerava; netačan odgovor se može ispraviti.
- Pomoć i izračunati postupci dostupni su tokom vježbanja. Evidencija razlikuje samostalno riješen zadatak i rad uz prikazano rješenje.
- **Radni listovi imaju 5, 10, 15, 20, 25, 30, 40 ili 50 zadataka** iz jedne vještine ili više vještina istog razreda.
- Odgovori i bilješke ostaju u profilu. Listovi se mogu štampati sa zadacima ili postupcima i izvesti kao tekst.
- Matematički laboratorij ostaje dostupan za slobodan račun, razlomke, djeljivost, jednačine, funkcije i geometriju.

## Provjere, ocjene, značke i diplome

Provjera može imati **bilo koji broj od 1 do 50 zadataka**, iz matematike, informatike ili oba predmeta. Biraju se razred, područje i nivo matematike. Broj provjere određuje ponovljiv izbor zadataka. Za informatičko područje s manjim brojem praktičnih zadataka aplikacija traži manji broj ili izbor svih područja, umjesto ponavljanja istih zadataka.

Svaki potpuno tačan zadatak nosi jedan bod. Pomoć i rješenja otvaraju se nakon predaje. **Ocjene su 1–5**, s početnim pragovima 50%, 65%, 80% i 90% za ocjene 2–5; nastavnik može prilagoditi pragove prije početka. Rezultat prikazuje bodove, procenat, ocjenu i pregled odgovora s postupcima.

**16 znački** osvajaju se kroz riješene zadatke, blokovske izazove, programerske testove i provjere. Za prolaznu ocjenu izdaje se diploma, a za ostale rezultate potvrda učešća. Dokument ima ime učenika, predmet, razred, broj zadataka, rezultat, ocjenu, datum, jedinstvenu oznaku, pečat ELDI EDU i stilizovana štampana imena sva četiri autora. Dostupni su pregled, štampanje i čuvanje kao **PDF**. To je potvrda rezultata u aplikaciji, a ne službena školska diploma ili ovjerena ocjena.

## Dark Edition i blokovski studio

Dark Edition zadržava tamni izgled cijele aplikacije: duboku tamnoplavu podlogu, čitljive kartice i kontrole, obojene kategorije blokova, tamnu radnu površinu, kod i konzolu. Pozornica koristi tamnu podlogu dok program ne postavi vlastitu boju. Lokalni ELDI znak, ikona, ocjene i značke prate isti izgled. Diplome i radni listovi zadržavaju svijetlu podlogu za štampanje.

Dark Edition se pri prvom pokretanju nadogradnje otvara u tamnoj temi. Dugme „Svijetla tema“ omogućava promjenu; odabir ostaje sačuvan nakon ponovnog pokretanja. Promjena teme ne briše blokove, crtež ili profil. Blockly ima kategorije lijevo, radnu površinu u sredini i pozornicu, trag vrijednosti, ulaz, konzolu i kod uživo desno; raspored ostaje upotrebljiv i na manjim Windows ekranima.

Studio ima **60 provjerljivih izazova**, 12 po razredu, s početnim blokovima, pomoći, riješenim primjerom i provjerom stvarnog izlaza ili geometrije. Podržava ulaz/izlaz, brojeve, logiku, petlje, tekst, liste, varijable i postupke; likove, koordinate, olovku, boje, crtanje, događaje, poruke, klonove i tonove. Standardni ulaz piše se red po red. Kod uživo prikazuje JavaScript ili Python; konzolni Python i uneseni podaci mogu se otvoriti u tekstualnom editoru.

Korak, pauza i brzina upravljaju prikazom izvršenih naredbi. Program se prvo računa u ograničenom interpreteru; prikaz zatim pokazuje naredbe i vrijednosti. Tastatura i položaj miša očitavaju se pri pokretanju. Klonovi su ograničeni na 30, a prikazane naredbe na 10.000. Projekti se čuvaju i uvoze kao JSON.

Studio je samostalno Blockly okruženje i ne uvozi Scratch `.sb3`. Grafički Python izvoz koristi turtle i traži punu Python instalaciju s Tkinterom; ugrađeni Python izvršava konzolne programe. Aplikacija je nezavisno napravljena, bez prepakivanja BlokBa.

## Četiri jezika i profili

Editor stvarno izvršava **Python, C, C++ i Javu**, s ulazom, izlazom, prikazom grešaka i 18 programerskih zadataka. Java koristi javnu klasu `Main`. Zadržane su i 142 dodatne lekcije s 426 kratkih pitanja i objašnjenja.

Profili čuvaju odgovore, bilješke, rezultate, provjere, diplome, Blockly projekte i nacrte koda u lokalnoj bazi. Stari profili iz verzija 10.0/10.1 učitavaju se nakon nadogradnje. Cijeli profil izvozi se i uvozi kao JSON rezervna kopija; evidencija se može izvesti kao CSV. Podaci se ne sinhronizuju između uređaja.

Tekstualni programi rade s pravima Windows korisnika; koristite svoje i provjerene školske programe. Ograničenje vremena prekida beskonačne petlje. Desktop nije OS sigurnosni sandbox.

## Razvoj i provjere

Node.js 24 ili noviji: `npm ci`, `npm run check`, `npm start`. Sadržaj za renderer generiše se iz verzionisanih JSON kataloga prilikom provjere i prije pokretanja.

Provjere uključuju strukturu svih 1000 cjelina, primjere, matematičko generisanje, tačnost odgovora, sve brojeve zadataka od 1 do 50, granice ocjena, rezultate, diplome i uvoz profila. Blockly testovi stvarno generišu i interpretiraju rješenja izazova. Windows Actions ugrađuje sva četiri jezička alata, provjerava njihov stvarni rad, pokreće desktop i zapakovanu aplikaciju, provjerava korisničke tokove i PDF diplome te objavljuje Portable i Setup EXE, ZIP zbirki, ZIP blokovskih projekata i `SHA256SUMS.txt`. Za novu sekciju provjerava pomoć, matematički odgovor, oba jezika zbirke, stvarno učitavanje PDF-a, vlastite sekcije, ZIP uvoz/izvoz i čuvanje bilješki. Svih 324 programska primjera dodatno se izvršavaju na Windowsu s ugrađenim alatima.

## 1000 riješenih blokovskih projekata

Biblioteka u Blokovskom studiju sadrži **1000 izvršivih Blockly projekata**: **100 vrsta algoritamskih zadataka × 10 prilagođenih scenarija**, odnosno **200 projekata po razredu od 5. do 9.** Broj predstavlja projekte, a ne 1000 različitih algoritama. Uz njih ostaje 60 ranijih izazova.

Teme uključuju računanje, geometriju, tekst, uslove, djeljivost, razlomke, brojne sisteme, nizove, liste, pretragu, sortiranje, statistiku, funkcije i pozornicu. Pretražite biblioteku, odaberite razred, područje i težinu, otvorite tekst zadatka, pomoć i postupak, pa učitajte početne blokove ili riješen projekat. Rješenje radi kroz isti Blockly interpreter kao vlastiti rad. Svaki projekat ima tri provjerljiva ulaza; izmijenjeni ulaz izvan tih testova može se pokrenuti, ali ne daje automatsku ocjenu prema tuđem očekivanom izlazu.

**ZIP paket** ima manifest `pack.json`, 1000 datoteka `solution.json` u pojedinačnim mapama, tekst zadatka i postupak u `README.md`, `input.txt`, `expected.txt`, `tests.json` i kontrolne SHA-256 vrijednosti. Uvoz: **Blokovski studio → Biblioteka → Uvezi JSON / ZIP**. Jedan `solution.json` može se učitati i kroz uvoz projekta u studiju. Cijeli paket i vlastite zbirke mogu se sačuvati iz aplikacije. Uvoz ne pokreće kod; dodatne zbirke ostaju u odabranom profilu.

## Pravi AI asistent

Dugme **„Pitaj AI asistenta“** otvara pomoć za odabrani zadatak ili trenutni kod. Odaberite savjet, objašnjenje, rješenje ili analizu greške. Prije slanja možete vidjeti prikazani materijal i isključiti ga. Dobiveni kod može se kopirati, sačuvati i otvoriti u editoru; ne izvršava se automatski.

- **OpenAI API:** otvorite postavke asistenta, unesite vlastiti API ključ i odaberite model koji vaš račun podržava. API potrošnja obračunava se na vašem API računu; ChatGPT pretplata je zasebna. Ključ ostaje u memoriji ili se, po izboru korisnika, čuva uz Windows sistemsku zaštitu. Ne dodaje se GitHubu, profilu niti ZIP paketima.
- **Ollama:** instalirajte i pokrenite Ollama na računaru, preuzmite model i upišite njegovo ime u postavke. Aplikacija koristi lokalni servis `127.0.0.1:11434`; bez servisa i modela nema odgovora.

Aplikacija ne isporučuje zajednički API ključ niti glumi AI odgovor kada usluga nije podešena. AI izlaz služi učenju: provjerite račun i testirajte predloženi kod. Provjere integracije koriste kontrolisane odgovore API protokola, greške, prekid zahtjeva i čuvanje ključa; nisu izvršile živi plaćeni AI poziv. Nakon stvarnog odgovora korištenje pomoći označava se uz odgovarajući zadatak.

U izdanju 10.5 dodatno su dorađeni tamni izgled, ljubičasti i tirkizni akcenti, navigacija, kartice biblioteke i pregled asistenta. Blockly raspored ostaje prilagođen manjim Windows ekranima, a diplome čitljive za štampanje.
