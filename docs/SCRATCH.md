# Scratch studio u ELDI EDU 11.0

Studio koristi **službeni standalone Scratch editor 15.2.0**, sa Scratch GUI, VM, renderom, editorom kostima i editorom zvukova. Dvije webpack putanje u službenoj distribuciji prilagođene su lokalnom `file://` učitavanju; ta izmjena je označena i potpuno reprodukovana u skripti za izgradnju. Zasebna lokalna komponenta se prikazuje u iframeu, bez Node integracije i bez mrežnih servisa. Scratch Foundation i MIT su autori Scratch komponenti. ELDI EDU nije službeno izdanje Scratch Foundation.

## Korištenje

- Otvori **Scratch projekti**. Zelena zastavica pokreće projekat, a crveno dugme ga zaustavlja. Klik na pozornicu omogućava događaje tastature uživo.
- Kartice **Kod**, **Kostimi** i **Zvukovi** otvaraju službene Scratch editore. Likove, kostime, pozadine i zvukove možeš izabrati iz ugrađene biblioteke, nacrtati ili uvesti sa računara.
- **Otvori .sb3** otvara Scratch 3 projekat. Uvoz ga ne pokreće zelenom zastavicom; pokretanje bira korisnik.
- Prije izvršnog učitavanja provjeravaju se ZIP direktorij i lokalna zaglavlja: do 12 MB arhive, 2500 datoteka, 100 MB ukupne deklarisane raspakovane veličine i 5 MB za `project.json`. Prihvataju se samo `project.json` i slike/zvukovi sa MD5 imenima u korijenu. Šifriranje, ZIP64, simboličke veze, duplikati, putanje izvan korijena i preklopljene datoteke se odbijaju.
- **Čuvaj .sb3** izvozi projekat sa pripadajućim kostimima i zvukovima. Komponenta ima i vlastiti meni Datoteka za čuvanje na računar.
- **Sačuvaj rad** čuva rad u aktivnom lokalnom profilu. Izmjene se automatski čuvaju poslije kratke pauze. Rad u profilu može imati do 12 MB; veće radove sačuvaj putem menija Datoteka u Scratch editoru.
- **Riješeni primjeri** sadrže šest originalnih projekata: upravljanje strelicama, zvijezda olovkom, matematički kviz, animacija sa zvukom, igra s bodovima i priča s porukama između dva lika.
- **Veliki studio** otvara radni prostor preko cijelog prozora aplikacije.

Biblioteka sadrži 343 lika, 915 kostima, 85 pozadina i 354 zvuka. Ukupno 1348 različitih datoteka materijala ugrađeno je lokalno; svaka je provjerena prema službenom MD5 identifikatoru. Isti materijali mogu pripadati više stavki biblioteke. Za editor i te materijale internet nije potreban nakon instalacije aplikacije.

Cloud promjenljive, Scratch računi, online objava, udaljeni prevodilac/TTS i vanjski hardver nisu dio lokalnog radnog prostora. Snimanje mikrofonom/kamerom zavisi od dozvola desktop aplikacije; uvoz postojećih zvukova i slika je dostupan.

## Izgradnja iz izvornog koda

Potrebni su Node.js 24 ili noviji, npm i internet za jednokratno preuzimanje zavisnosti/materijala tokom izgradnje.

```sh
cd scratch-editor
npm ci --ignore-scripts --no-audit --no-fund
cd ..
node scripts/build-scratch.cjs
node tests/scratch.test.cjs
```

Prvi korak koristi priloženi `package-lock.json` i integritet svakog npm paketa. Skripta kopira službeni `scratch-gui-standalone.js`, njegove prateće datoteke i sourcemap datoteke, izvorne licence i obavijesti. Originalni bundle je sačuvan kao `scratch-gui-standalone.original.js`. Tačno dvije njegove webpack `publicPath` putanje `/` zamijenjene su lokalnim direktorijem skripta; manifest navodi datum izmjene, oba SHA-256 otiska i tačnu transformaciju. Izuzeti su nekorišteni regularni GUI bundle i TypeScript deklaracije; source bundle dodatno sadrži odgovarajući preferirani izvorni kod.

Skripta pravi `renderer/vendor/scratch/`, preuzima materijale sa službenog Scratch asset servera uz provjeru MD5, gradi originalne `.sb3` primjere i zapisuje `SOURCE.json` sa SHA-256 manifestom. Za pouzdan rad lokalne biblioteke svakom materijalu pripada lokalna slika/zvuk i mali skript koji vraća njegove bajtove Scratch Storage komponenti bez mrežnog zahtjeva.

Skripta takođe pravi `content/packs/ELDI-EDU-11.0.0-Scratch-izvori.zip`. Taj paket treba objaviti **uz EXE izdanje**. Sadrži puni arhiv službenog monorepozitorija na tačnoj reviziji, ELDI adapter, zaključane zavisnosti, licencu, skriptu za izgradnju i ove upute. Zaseban `ELDI-EDU-11.0.0-Scratch-primjeri.zip` sadrži svih šest `.sb3` primjera i upute.

Službeni izvor:

- Repozitorij: https://github.com/scratchfoundation/scratch-editor
- Verzija: `v15.2.0`
- Revizija: `5fe823510f3ae0cc7291d49bc824cc5c54fe7723`
- Arhiv: https://github.com/scratchfoundation/scratch-editor/archive/5fe823510f3ae0cc7291d49bc824cc5c54fe7723.zip
- npm komponenta: `@scratch/scratch-gui@15.2.0`
- Preferirani izvor samog ELDI adaptera: `scratch-editor/bootstrap.js`, `index.html`, `offline.css` u ovom repozitoriju.

Za izmjenu samih službenih Scratch komponenti raspakuj priloženi upstream arhiv, pokreni `npm ci --ignore-scripts`, a zatim slijedi skripte `build` u korijenu i paketima tog monorepozitorija. Scratch izvor sadrži vlastite build konfiguracije i zaključane zavisnosti. ELDI build kopira objavljenu službenu standalone distribuciju i primjenjuje samo opisanu lokalnu relokaciju putanja.

## Licenca i obavijesti

Službene Scratch komponente i ELDI adapter ove zasebne komponente koriste **AGPL-3.0-only**. Potpuna izvorna licenca i `TRADEMARK` sačuvani su u `scratch-editor/` i u distribuiranom `renderer/vendor/scratch/`. Licencne obavijesti drugih biblioteka u službenom bundleu sačuvane su u njegovim `*.LICENSE.txt` datotekama. Komponenta nema garanciju. Njeno uključivanje ne predstavlja odobrenje aplikacije od strane Scratch Foundation. Naziv, logotip i Scratch likovi podliježu službenom `TRADEMARK` obavještenju.

## Integracija i provjera

Roditeljski renderer poziva `ELDIScratchStudio.mount({root, profile, save, exportFile, askAI})`. Profil sadrži `scratchWork: {name, base64, savedAt, exampleId}`. `ELDIScratchProjects.normalizeState` provjerava i ograničava taj zapis. Prije promjene profila ili napuštanja studija treba sačekati `ELDIScratchStudio.flush()`, a zatim pozvati `destroy()`.

Iframe prihvata poruke samo iz roditeljskog prozora i sa tokenom trenutne sesije; roditelj dodatno provjerava tačan iframe kao pošiljaoca. Uvoz i izvoz koriste stvarni `vm.loadProject` i `vm.saveProjectSb3`. Program se pokreće stvarnim Scratch VM-om, sa događajima tastature i miša iz službenog GUI-a.

Zasebna komponenta dopušta inline skripte jer službeni Paper/SVG sandbox na `file://` koristi tekstualne skripte u `srcdoc` okviru koji nasljeđuje CSP. Sam taj unutrašnji sandbox zadržava službeni CSP sa jednokratnim nonce oznakama, `default-src 'none'`, bez `unsafe-eval` i bez pristupa DOM-u roditelja. Glavni renderer zadržava svoj odvojeni CSP i IPC dozvole; lokalni Scratch okvir nema IPC pristup. Uvoz SVG-a prolazi službenu sanitizaciju.

Native QA može sačekati `ELDIScratchStudio.ready()`, pronaći `#scratch-frame` i u njegovom okviru provjeriti `window.ELDI_SCRATCH_READY`, `window.ELDI_SCRATCH_VM` i `window.ELDI_SCRATCH_EDITOR`. Test treba obuhvatiti stvarno pokretanje, `.sb3` učitavanje/ponovno čuvanje, promjenu kostima, zvukove i tastaturu. Statički test provjerava sve materijale, lokalnu građu `.sb3` projekata, povezane blokove, licence i izvorni manifest.
