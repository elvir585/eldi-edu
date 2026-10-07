# ELDI EDU 10.0 — desktop

**Matematika i informatika od 5. do 9. razreda, na vašem računaru.**

Autori: **Dino Isanović · Elvir Čajić · Damir Bajrić · Jasmin Suljkanović**.

## Preuzimanje za Windows

Otvorite **[Releases / izdanja](https://github.com/elvir585/eldi-edu/releases/latest)** i izaberite:

- `ELDI-EDU-10.0.0-Portable-x64.exe` — direktno pokretanje bez instalacije.
- `ELDI-EDU-10.0.0-Setup-x64.exe` — instalacija sa prečicom na radnoj površini.

Windows 10/11 x64. Za rad se ne otvara ChatGPT stranica. Windows paket uključuje Python, GCC/G++ i Java JDK. Internet nije potreban poslije preuzimanja. Prva izgradnja može potrajati jer preuzima i provjerava sva četiri programska alata. Ako još nema izdanja, pogledajte **[Actions — Build Windows EXE](https://github.com/elvir585/eldi-edu/actions/workflows/build-windows.yml)**. EXE postoji tek kada izgradnja prođe sve korake.

## Sadržaj

- Tematske lekcije matematike i informatike po razredima, po tri pitanja sa objašnjenjem.
- Veliki cijeli brojevi, četiri operacije, decimalni brojevi, razlomci i dvojni razlomci.
- Djeljivost sa 2, 3, 4, 5, 6, 9, 10, 15 i 25; NZD/NZS, prosti i složeni brojevi, rastav na faktore.
- Procenti, jednačine i sistemi, linearne funkcije, uglovi, trouglovi, diedar i tijela.
- Tačno racionalno računanje s proizvoljno velikim cijelim brojevima (uz ograničenje dužine unosa).
- Binarni, oktalni, dekadni i heksadecimalni brojni sistemi.
- Scratch pojmovi od događaja do petlji, uslova, lista, poruka, klonova i vlastitih blokova.
- Vlastiti Blockly studio: slaganje i povezivanje blokova, tri lika, kretanje, crtanje, ispis, varijable, liste, petlje, uslovi i postupci.
- Python, C, C++ i Java: editor, stvarno lokalno izvršavanje, standardni ulaz/izlaz, greške i automatska provjera zadataka.
- Lokalni profili učenika, čuvanje projekata i nacrta, napredak i izvoz rezultata.

Teme su raspoređene kao obrazovni program za razrede 5–9; nastavnik raspored usklađuje sa svojim službenim nastavnim planom. Potpuna akreditacija ili usklađenost sa svakim kantonalnim kurikulumom nije potvrđena. Ovo je nezavisna aplikacija, ne izmijenjeni BlokBa. Blokovski studio nije puni Scratch editor i ne uvozi `.sb3` datoteke. Python izvoz crtanja koristi turtle i traži punu Python instalaciju s Tkinterom (ugrađeni Python izvršava konzolne programe); poruke i klonovi su funkcije ELDI pozornice i nisu preneseni kao potpuni Python grafički projekat.

## Programiranje

Izaberite jezik, napišite program, unesite standardni ulaz i kliknite **Pokreni**. Java koristi javnu klasu `Main`. Za školske zadatke izaberite zadatak i kliknite **Provjeri zadatak**. Testovi porede izlaz; dodatne bjeline se zanemaruju. Programi se izvršavaju lokalno s pravima vašeg Windows korisnika, pa pokrećite svoj ili provjeren školski kod. Beskonačna petlja prekida se nakon vremenskog ograničenja. Desktop nije OS sigurnosni sandbox.

## Razvoj

Node.js 24 ili noviji. `npm ci`, zatim `npm run check` i `npm start`.

`npm test` provjerava izvršavanje dostupnih lokalnih jezičkih alata. `node --test tests/math.test.cjs` provjerava matematički modul. Windows GitHub Actions gradi i provjerava ugrađene alate, desktop prozor i zapakovanu aplikaciju, zatim objavljuje dvije EXE datoteke i SHA256SUMS.txt. Izvorne datoteke nalaze se u ovom repozitoriju; alati se pripremaju u `runtimes/` tokom izgradnje.

Napredak i nacrti čuvaju se na računaru; nisu sinhronizovani između uređaja. Izvozite rezultate kao rezervnu kopiju.
