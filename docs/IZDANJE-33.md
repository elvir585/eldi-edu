# Arhivski opis osnove Studio 33

Za trenutno izdanje 33.33 pogledajte [IZDANJE-33.33.md](IZDANJE-33.33.md). Ovaj opis prikazuje osnovu prije nove online učionice i nastavnih tokova.

# ELDI EDU 33.33

Izdanje dodaje Studio 33 u postojeću Windows aplikaciju i samostalnu web radionicu za UPINITK. Tehnička verzija paketa: 33.33.0.

## Radionice

- **3D studio:** sedam vrsta tijela, više objekata, pomjeranje, rotacija, boja, prozirnost; Three.js osvjetljenje i jednostavniji SVG prikaz. Blokovi, JavaScript i Python prikaz, pauza/korak, žive varijable, snimljena stanja, verzije i poređenje, PNG/SVG.
- **Presjeci i mreže:** nagnuta ravan, površina presjeka, animirane šarke za kocku/kvadar/prizmu/piramidu; ravne mreže valjka i kupe. Zakrivljene površine i presjeci koriste poligonalnu aproksimaciju. Lopta nema tačnu ravnu mrežu. Raniji laboratorij za funkcije, trouglove i diedre ostaje u Windows aplikaciji.
- **Robot:** tri staze, kretanje, sudari, udaljenost, senzor staze i cilj; blokovi i JS. Python prikaz robota služi za čitanje.
- **Web:** lokalni HTML/CSS/JS editor, četiri početna primjera, izolovani pregled, prikaz telefona, konzola, osnovne provjere pristupačnosti i ZIP izvoz.
- **SQL:** stvarni SQLite/WASM u Workeru, tri ogledne tabele, deset upita/zadataka, poređenje rezultata i uvoz/izvoz SQLite datoteke.
- **Algoritmi:** bubble/insertion sortiranje, binarna pretraga, stek/red, binarno stablo, BFS i faktorijel s prikazom steka.
- **Logika/procesor:** AND/OR/XOR/NOT kola i tabele, binarno/heksadekadno, jednobitni sabirač, mali model instrukcija procesora.
- **Mreže/API:** animirani put paketa kroz promjenjivu mrežu, obrazovna simulacija HTTP zahtjeva i statusa; nije stvarni servis.
- **Podaci:** CSV, filter, statistika i grafikon, izvoz i Python kod analize; pravi Python u Windows izdanju.
- **Programerska radionica:** 20 originalnih zadataka za 5–9. razred, četiri načina vježbe, 80 testova, očekivani/dobijeni izlaz i vlastiti testovi.
- **Takmičarska priprema:** 40 matematičkih porodica s po četiri brojčane varijante, 20 informatičkih pitanja, vrijeme, bodovi i objašnjenja.
- **Projekti/izvještaji:** 16 projektnih uputa, prenosivi zadaci i radovi, galerija, lokalna evidencija, kriteriji, odvojena nastavnička ocjena/komentar, CSV i štampa.

## Web i Windows

Web paket se raspakuje u `public_html`; dobija se `/eldi-edu/` i `/eldi-edu/ucionica/`. Sve biblioteke dolaze sa istog hostinga. Nema Node/PHP servera ni mrežne baze. Rad se čuva u IndexedDB i prenosi JSON datotekom. Za početno otvaranje web radionice potreban je internet. Na zajedničkom pregledniku rad nije odvojen promjenom imena: koristite odvojene profile preglednika ili Windows profile.

Windows uključuje i ranije module, Scratch, Python, C/C++ i Javu. Python izvršavanje nije uključeno u web paket. Radni jezik novih blokova je ograničeni JavaScript interpreter; koraci se izvršavaju u Workeru. Povratak na snimljeno stanje služi za pregled; ponovno izvršavanje nakon izmjene počinje iznova.

## Granice

Nema zajedničkih mrežnih naloga, automatske predaje, službene rang-liste, kriptografski ovjerenih potvrda ni digitalno potpisanog instalacijskog paketa. Automatske kriterije korisnik može pročitati; nisu sistem za nadzirani ispit. Nastavnik pregleda dokaze, objašnjenja, smisao i originalnost. Nije potvrđena potpuna službena kurikularna usklađenost.

Projekat do 2,5 MB, SQLite baza do 1 MB, CSV do 1000 redova/30 kolona, galerija 20 radova, 20 verzija, 50 izvještaja. Izvozom pravite vlastitu arhivu. Ograničenja izvršavanja vraćaju jasnu grešku i zadržavaju sačuvani rad. Uvezeni rad prije zamjene sprema kopiju prethodnog rada.

## Provjera

`npm run check` uključuje postojeće testove i devet novih provjera, od čega jedna izvršava svih 80 referentnih programskih testova i provjerava da početne greške zaista padaju. `tests/studio33-ui.cjs` provjerava rad kroz Chromium. `desktop/studio33-smoke.cjs` je dio obavezne Windows provjere izvornog i zapakovanog EXE izdanja: blokovi, Python, robot, SQLite, web JS, testovi, rezultati i prenos profila. GitHub izdanje objavljuje se tek poslije uspješnih provjera.

Autori: Dino Isanović · Elvir Čajić · Damir Bajrić · Jasmin Suljkanović.
