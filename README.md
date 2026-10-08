# ELDI EDU 10.1 — velika zbirka i blokovski studio

**Matematika i informatika od 5. do 9. razreda, kao Windows aplikacija koja radi bez interneta.**

Autori: **Dino Isanović · Elvir Čajić · Damir Bajrić · Jasmin Suljkanović**.

## Preuzimanje za Windows

Otvorite **[najnovije izdanje](https://github.com/elvir585/eldi-edu/releases/latest)**:

- `ELDI-EDU-10.1.0-Portable-x64.exe` — direktno pokretanje bez instalacije.
- `ELDI-EDU-10.1.0-Setup-x64.exe` — instalacija sa prečicom na radnoj površini.

Windows 10/11 x64. Paket uključuje aplikaciju, nastavni sadržaj, Blockly, Python, GCC/G++ i Java JDK. Poslije preuzimanja internet nije potreban za učenje ni za izvršavanje školskih programa. Izgradnja i provjera paketa prate se u [GitHub Actions](https://github.com/elvir585/eldi-edu/actions/workflows/build-windows.yml).

## Zbirka matematike: učenik rješava zadatke

Nova stavka **Zbirka i radni listovi** sadrži **95 oblasti i 19.000 generisanih varijanti**: 200 indeksiranih varijanti po oblasti. Osnovni, srednji i napredni nivo mijenjaju podatke i složenost. Broj varijanti označava zadatke generisane iz obrazaca, ne 19.000 različitih nastavnih tema. Uz njih dolazi **41 razrađen problemski zadatak**, najmanje osam po razredu, sa više povezanih dijelova.

- Učenik upisuje broj, decimalni broj, razlomak, listu brojeva ili traženi tekst; nema ponuđenih odgovora u zbirci.
- Svaki dio odgovora ima svoju provjeru. Pogrešan odgovor može se popraviti i ponovo provjeriti.
- Polje **Moj postupak** služi za vlastiti račun i obrazloženje. Bilješke se čuvaju; automatska provjera ocjenjuje rezultat, a nastavnik može pregledati pisani postupak.
- **Pomoć** daje smjernicu; **Prikaži postupak** otvara izračunate međukorake i završna rješenja. Evidencija razlikuje riješene zadatke uz prikazan postupak i samostalno riješene zadatke.
- Radni listovi imaju 5, 10 ili 20 zadataka iz jedne oblasti ili više oblasti istog razreda. Broj lista omogućava ponavljanje istog izbora zadataka.
- List se može štampati za rad na papiru, odvojeno štampati s postupcima ili izvesti kao tekst sa zadacima i rješenjima. Otvoreni rad, odgovori i bilješke ostaju u profilu.

Oblasti obuhvataju velike prirodne brojeve i sve operacije; redoslijed operacija i mjerne jedinice; djeljivost sa 2, 4, 5, 6, 9, 10, 15 i 25; NZD/NZS, proste i složene brojeve, faktorizaciju; skraćivanje, poređenje i sve operacije s razlomcima, dvojne razlomke i decimale; cijele i racionalne brojeve; procente, proporcije i razmjeru; stepene, korijene, polinome i jednačine; sisteme i funkcije; uglove i diedre, ravne figure, Pitagorinu teoremu i geometrijska tijela; statistiku i vjerovatnoću. Matematički laboratorij s tačnim racionalnim računanjem ostaje dostupan za slobodno istraživanje.

## Blokovsko programiranje: 60 praktičnih izazova

Studio sadrži **60 provjerljivih izazova**, 12 po razredu. Svaki ima zahtjev, početne blokove, pomoć, riješen primjer i provjeru stvarnog izlaza programa ili geometrije crteža. Odabir izazova sam ne briše projekat; početni ili riješeni program učitava se posebnom tipkom.

Kategorije uključuju ulaz/izlaz, brojeve i matematičke funkcije, logiku, petlje, tekst, liste, varijable i vlastite postupke; kretanje, likove, koordinate i senzore; olovku, boje, debljinu crte, krugove i pravougaonike; događaje, poruke, klonove i tonove.

Praktični zadaci napreduju od zbira i pozdrava do uslova i petlji, razlomaka, NZD, obrade lista, prostih brojeva, sita, teksta, šifrovanja i simulacija. Standardni ulaz upisuje se red po red. Prikaz koda uživo može se prebaciti na JavaScript ili Python. Konzolni Python može se otvoriti u ugrađenom editoru i stvarno pokrenuti.

**Korak, Pauza i brzina upravljaju prikazom izvršenih naredbi.** Program se prvo računa u ograničenom interpreteru; pozornica i trag varijabli zatim prikazuju naredbe. Ovo nije debugger koji zaustavlja sam interpreter prije svake naredbe. Tastatura i položaj miša očitavaju se pri pokretanju. Klonovi su ograničeni na 30, a prikazane naredbe na 10.000. Blockly projekti čuvaju se i uvoze kao JSON.

Studio je vlastito Blockly okruženje, nije puni Scratch editor i ne uvozi `.sb3`. Grafički Python izvoz koristi turtle i traži punu Python instalaciju s Tkinterom; ugrađeni Python izvršava konzolne programe. Senzori u grafičkom Python izvozu imaju ograničenja navedena u generisanom kodu.

## Lekcije, četiri jezika i napredak

Zadržane su **142 tematske lekcije i 426 pitanja s objašnjenjima**, uz 18 programerskih zadataka za Python, C, C++ i Javu. Editor omogućava stvarno lokalno izvršavanje, standardni ulaz i izlaz, prikaz grešaka i provjeru zadataka. Java koristi javnu klasu `Main`.

Profili učenika pamte rezultate lekcija, zbirku, pisane postupke, blokovske projekte, izazove i nacrte koda. Cijeli profil izvozi se kao JSON rezervna kopija; evidencija se izvozi kao CSV. Podaci se čuvaju na računaru i nisu automatski sinhronizovani između uređaja. Postojeći profili iz verzije 10.0 ostaju dostupni nakon nadogradnje.

Programi u tekstualnom editoru pokreću se s pravima vašeg Windows korisnika; koristite svoje i provjerene školske programe. Ograničenje vremena prekida beskonačne petlje. Desktop nije OS sigurnosni sandbox.

Teme služe za učenje u razredima 5–9; nastavnik ih usklađuje sa svojim službenim planom. Potpuna usklađenost sa svakim kantonalnim kurikulumom nije potvrđena. Aplikacija je nezavisno napravljena i nije izmijenjena distribucija BlokBa.

## Razvoj i provjere

Node.js 24 ili noviji. Pokrenite `npm ci`, `npm run check` i `npm start`.

`npm test` provjerava matematički modul, generisane zadatke, problemske zadatke, stvarno generisanje i interpretaciju Blockly rješenja, te dostupne lokalne programske alate. Windows Actions ugrađuje sva četiri jezička alata, provjerava njihov stvarni rad, otvara desktop prozor, provjerava zbirku i radne listove, gradi dvije EXE datoteke i pokreće zapakovanu aplikaciju prije objave. Izdanje uključuje i `SHA256SUMS.txt`.
