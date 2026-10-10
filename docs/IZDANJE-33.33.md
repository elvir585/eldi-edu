# ELDI EDU 33.33

Korisnička oznaka: **33.33**. Tehnička verzija: **33.33.0**. Jedno objedinjeno izdanje za Windows i UPINITK hosting.

## Šta je novo

- Početni putevi **Uči, Vježbaj, Takmiči se, Stvaraj**. Napredne radionice ostaju u meniju „Sve radionice“.
- **35 vođenih nastavnih cjelina**: sedam po razredu od 5. do 9, ukupno 20 matematičkih i 15 informatičkih. Objašnjenje, riješen primjer, tri nivoa, savjet, provjera brojčanog odgovora i preporuka za radionicu.
- **Čas od 45 minuta**: uvod 5, primjer 10, samostalan rad 20, provjera 7, osvrt 3 minute. Pauza i nastavak poslije osvježavanja; tajmer ne upravlja drugim računarima.
- **Diferencirana vježba**: osnovni, srednji i napredni nivo. Preporuka cjelina na osnovu posljednjih pokušaja. Najviše 300 pokušaja u lokalnom pregledu. Pomoć se bilježi.
- **Lični vremenski izazov**: deset zadataka, 20 minuta, izbor razreda/predmeta/nivoa, nastavak tekuće provjere nakon osvježavanja, objašnjenja na kraju. Lokalna priprema, ne nadzirano takmičenje ili službena rang-lista.
- **Stvarni 3D studio**: postojeći modeli, blokovi, presjeci i mreže; novi predlošci scena, četiri pogleda, analitička površina i zapremina. Novi blok za površinu/zapreminu radi u JS interpreteru i Python mostu Windows aplikacije.
- **Radni listovi** za pet razreda, odvojena nastavnička rješenja i **105 JSON provjera** za online uvoz (35 cjelina × tri nivoa, do šest različitih pitanja, zavisno od cjeline). Osnovni štampani paket ima 105 zadataka, nije 105 različitih naučnih oblasti.
- **Offline web radionica**: ručna priprema dugmetom „Rad bez interneta“. Čuva samo javne datoteke radionice na tom uređaju. Online računi, predaje i AI i dalje trebaju internet. Brisanje podataka preglednika uklanja offline kopiju.
- **PHP/MySQL online učionica**: nastavnički račun, odjeljenja, grupno kreiranje učeničkih pristupa, zadaci i rokovi, serverom bodovane brojčane provjere, JSON projekti i tekst, pregled, komentar, zasebna nastavnički unesena ocjena, CSV rezultati i arhiva odjeljenja. Jedna konačna predaja po zadatku. Zatvaranje/otvaranje predaje i reset učeničke lozinke.

## Šta ostaje iz ranijih verzija

Windows: Scratch s offline medijima, 1000 Blockly projekata, Python/C/C++/Java, dvije knjige, zbirke, 55 programerskih izazova, digitalna sveska, matematički laboratorij, kurikularna mapa, lokalni nastavnički centar, sigurnosne kopije i AI s vlastitim računom. Studio: robot, HTML/CSS/JS, SQLite, algoritmi, logika/procesor, simulacija mreže, CSV podaci, projektni zadaci i izvještaji.

Novi časovi i Studio rade i u pregledniku. Slobodni Python/C/C++/Java programi i puni Scratch ostaju u Windows aplikaciji. Online PHP server ne pokreće učenički programski kod.

## Online učionica i hosting

Potrebni su HTTPS, PHP 8.2+ s PDO MySQL i sesijama, MySQL 8+ ili kompatibilna MariaDB, dozvola kreiranja tabela i privatna konfiguracija iznad `public_html`. Ne treba Node.js ni SSH. PRO XL opis navodi PHP i MySQL, ali konkretne verzije i PDO modul se provjeravaju na hostingu.

Online putanja je `/eldi-edu/online/`; lokalna radionica je `/eldi-edu/ucionica/`. Učenik može otvoriti radionicu bez online prijave. Njegova online prijava **ne mijenja i ne razdvaja lokalni profil radionice**. Na zajedničkim računarima koriste se odvojeni profili preglednika/Windowsa ili izvoz rada prije smjene učenika. Predaja se radi izvozom JSON projekta i njegovim prilaganjem online zadatku; nije automatska sinhronizacija cijelog profila.

Jedan nastavnički vlasnik instalacije. Učenik dobija zasebno korisničko ime i početnu lozinku; može je promijeniti. Nema javne registracije ni potrebe za učeničkom e-mail adresom. Lozinke su hashirane, konfiguracija je izvan javnog direktorija, promjene zahtijevaju CSRF token, sesije su HttpOnly/SameSite, prijava ima ograničenje pokušaja. Reset lozinke poništava ranije sesije. Svaka predaja i pregled provjeravaju pripadnost odjeljenju. Bodovanje brojčanih provjera obavlja server; projektne radove pregleda nastavnik. Server ne vraća ključ odgovora učeniku prije konačne predaje.

Arhiva odjeljenja je čitljiv JSON za čuvanje i pregled; nema automatski uvoz/obnovu cijelog servera. Za obnovu napravite cPanel kopiju baze i privatne konfiguracije. Uklanjanje učenika briše njegov račun i predaje. Imena/oznake, radovi i rezultati su pod kontrolom nastavnika i vlasnika hostinga. Nema e-mail obavijesti, zajedničkog uređivanja uživo ni nadzora ispita.

## Matematičke i tehničke granice

Površina i zapremina odnose se na cijelo tijelo; presjek ne mijenja definiciju tijela. Prizme i piramide su pravilne i uspravne. Analitičke formule koriste punu vrijednost π; prikaz zaokružuje na četiri decimale. Zakrivljeni presjeci koriste poligonalnu aproksimaciju. Lopta nema tačnu ravnu mrežu. Valjak i kupa imaju ravne mreže; animacija šarki je za kocku, kvadar, pravilnu prizmu i piramidu.

Brojčani odgovori prihvataju decimalnu tačku/zarez ili jedan razlomak. Tolerancija je relativna `max(1, |odgovor|) × 10⁻⁶`, osim nastavnički zadane tolerancije. Tekstualni dokazi i proizvoljni postupci nisu automatski ocijenjeni.

Projektna predaja: do 2,5 MB; online provjera: 1–30 pitanja; kreiranje učenika: 1–40 u grupi; rok: do 366 dana. Lokalni Studio zadržava ranija ograničenja galerije/baze/CSV-a. Nastavni raspored je urednički dopunski prijedlog, bez tvrdnje o službenom kurikularnom odobrenju. Instalacijski EXE nije digitalno potpisan. Stvarna prijava i AI odgovor zahtijevaju korisnikov račun i dostupnost servisa.

## Provjera izdanja

Objava je uslovljena Linux web provjerom i Windows provjerom. Web testovi koriste stvarni MySQL i PHP HTTP API, provjeravaju pristup, odjeljenja, bodovanje, rokove, povratne informacije, reset sesija, JSON projekte i brisanje; Chromium provjerava nastavne tokove, čuvanje, 3D, offline osvježavanje i male ekrane. Windows zadržava testove zbirki, ugrađenih jezika, Scratcha i pakovanog EXE-a. Snimke u izdanju nastaju iz testirane aplikacije, ne iz generisane ilustracije.

Autori: Dino Isanović · Elvir Čajić · Damir Bajrić · Jasmin Suljkanović.
