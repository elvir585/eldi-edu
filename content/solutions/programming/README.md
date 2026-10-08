# Programiranje — Elvir Čajić

Paket sadrži **162 numerisana zadatka i 324 potpuna programska rješenja**: po jedan Python 3 i C++17 program za svaki zadatak iz knjige *Programiranje — Python 3 i C++17*, Tuzla, 2026.

U svakom direktoriju nalaze se `solution.py`, `solution.cpp`, tekst zadatka i objašnjenje u `README.md`, te objavljeni ulaz/izlaz `example-1.in` i `example-1.out`. Python uvlačenje je sačuvano.

## Pokretanje

U ELDI EDU otvorite **Knjige i rješenja**, izaberite zadatak i jezik, zatim otvorite rješenje u programskom editoru. Možete prvo napisati vlastiti program i koristiti primjer kao ulaz. Cijela rješenja otkrivajte nakon vlastitog pokušaja.

Van aplikacije, u odabranom direktoriju:

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Na Windowsu pokrenite nastali `solution.exe`. GNU g++ podržava zaglavlje `bits/stdc++.h` korišteno u dijelu primjera; ono nije standardno C++17 zaglavlje.

## Šta je provjereno

Svih 162 Python programa ima ispravnu sintaksu, svih 162 C++17 programa uspješno je kompajlirano, a sva 324 izvođenja daju objavljeni izlaz. Provjera zanemaruje razliku u razmacima i završnim novim redovima. Ovo potvrđuje primjere iz knjige; ne predstavlja dokaz tačnosti na svim ulazima ni službene skrivene testove.

Teorijski isječci ostaju odvojeni u katalogu knjige i originalnom PDF-u. Isječak može zahtijevati ranije definisane varijable; nije predstavljen kao samostalan zadatak. Originalni PDF sadržan je u paketu.

## Porijeklo i nivoi

Autor knjige i razrade: **Elvir Čajić**. Petnaest arhivskih zadataka zadržava naziv, takmičenje i oznaku izvora iz knjige; autor knjige nije predstavljen kao izvorni autor svih takmičarskih postavki. Zadaci 160–162 su dodatni srednjoškolski izazovi. Napredna poglavlja grafova i dinamičkog programiranja služe proširenju i pripremi prema znanju učenika.

Prilikom uvoza ispravljeni su nedostajući matematički znakovi u tekstualnom sloju PDF-a samo tamo gdje je značenje jasno iz konteksta i pratećeg programa. Svaka takva transkripcija navedena je u `extractionNotes` kataloga. Izvorni kodovi nisu mijenjani i odgovaraju kodovima u knjizi.

## Zadaci

| Broj | Zadatak | PDF stranica |
|---:|---|---:|
| 001 | [Takmičarski bodovi](001-takmicarski-bodovi/README.md) | 71 |
| 002 | [Mini-zoo](002-mini-zoo/README.md) | 73 |
| 003 | [Takmičarski popust](003-takmicarski-popust/README.md) | 74 |
| 004 | [Četiri ekipe](004-cetiri-ekipe/README.md) | 76 |
| 005 | [Povoljnije putovanje](005-povoljnije-putovanje/README.md) | 78 |
| 006 | [Temperaturni alarm](006-temperaturni-alarm/README.md) | 80 |
| 007 | [Slatkiši do maksimuma](007-slatkisi-do-maksimuma/README.md) | 82 |
| 008 | [Digitalni displej](008-digitalni-displej/README.md) | 84 |
| 009 | [Kod sekcije](009-kod-sekcije/README.md) | 86 |
| 010 | [Kružni raspored](010-kruzni-raspored/README.md) | 88 |
| 011 | [Porodično glasanje](011-porodicno-glasanje/README.md) | 90 |
| 012 | [Kontrolna cifra](012-kontrolna-cifra/README.md) | 92 |
| 013 | [Najduža serija](013-najduza-serija/README.md) | 94 |
| 014 | [Najčešći rezultat](014-najcesci-rezultat/README.md) | 96 |
| 015 | [Najduži strogi rast](015-najduzi-strogi-rast/README.md) | 98 |
| 016 | [Tačka ravnoteže](016-tacka-ravnoteze/README.md) | 100 |
| 017 | [TRKA](017-trka/README.md) | 103 |
| 018 | [KOVANICE](018-kovanice/README.md) | 105 |
| 019 | [PIZZA](019-pizza/README.md) | 107 |
| 020 | [BROJKE I SLOVA](020-brojke-i-slova/README.md) | 109 |
| 021 | [VISINE](021-visine/README.md) | 111 |
| 022 | [PLASTENIK](022-plastenik/README.md) | 113 |
| 023 | [SEKCIJA](023-sekcija/README.md) | 115 |
| 024 | [BAZEN](024-bazen/README.md) | 117 |
| 025 | [DOMINE](025-domine/README.md) | 119 |
| 026 | [SILOSI](026-silosi/README.md) | 121 |
| 027 | [DAN JEDNAKOSTI](027-dan-jednakosti/README.md) | 123 |
| 028 | [BLAGO](028-blago/README.md) | 125 |
| 029 | [Rang-lista](029-rang-lista/README.md) | 128 |
| 030 | [Pjesme na USB-u](030-pjesme-na-usb-u/README.md) | 130 |
| 031 | [Klikeri u kutijama](031-klikeri-u-kutijama/README.md) | 132 |
| 032 | [Muzejski prolaz](032-muzejski-prolaz/README.md) | 134 |
| 033 | [Najduži niz bez ponavljanja](033-najduzi-niz-bez-ponavljanja/README.md) | 136 |
| 034 | [Najbolji blok od K dana](034-najbolji-blok-od-k-dana/README.md) | 138 |
| 035 | [Najduži budžetski segment](035-najduzi-budzetski-segment/README.md) | 140 |
| 036 | [Par najbliži cilju](036-par-najblizi-cilju/README.md) | 142 |
| 037 | [Skoro palindrom](037-skoro-palindrom/README.md) | 144 |
| 038 | [Poredak takmičara](038-poredak-takmicara/README.md) | 146 |
| 039 | [Pakovanje poklona](039-pakovanje-poklona/README.md) | 149 |
| 040 | [Najkraći skupi segment](040-najkraci-skupi-segment/README.md) | 151 |
| 041 | [Kružna smjena](041-kruzna-smjena/README.md) | 153 |
| 042 | [Takmičarski parovi](042-takmicarski-parovi/README.md) | 155 |
| 043 | [Palindrom jednim brisanjem](043-palindrom-jednim-brisanjem/README.md) | 158 |
| 044 | [Najkraći segment sa K različitih](044-najkraci-segment-sa-k-razlicitih/README.md) | 160 |
| 045 | [Par najbliži cilju](045-par-najblizi-cilju/README.md) | 162 |
| 046 | [Dvije sijalice](046-dvije-sijalice/README.md) | 165 |
| 047 | [Najveća gužva u bazenu](047-najveca-guzva-u-bazenu/README.md) | 167 |
| 048 | [Upiti o bodovima](048-upiti-o-bodovima/README.md) | 169 |
| 049 | [Pano sa bodovima](049-pano-sa-bodovima/README.md) | 171 |
| 050 | [Raspored učionice](050-raspored-ucionice/README.md) | 173 |
| 051 | [Prvi dovoljno veliki rezultat](051-prvi-dovoljno-veliki-rezultat/README.md) | 175 |
| 052 | [Minimalni kapacitet dostave](052-minimalni-kapacitet-dostave/README.md) | 177 |
| 053 | [Spajanje vremenskih intervala](053-spajanje-vremenskih-intervala/README.md) | 179 |
| 054 | [Mnogo povećanja intervala](054-mnogo-povecanja-intervala/README.md) | 181 |
| 055 | [Zbir pravougaonika u matrici](055-zbir-pravougaonika-u-matrici/README.md) | 183 |
| 056 | [Sažmi velike koordinate](056-sazmi-velike-koordinate/README.md) | 185 |
| 057 | [Zbir pravougaonika](057-zbir-pravougaonika/README.md) | 187 |
| 058 | [Raspored radionica](058-raspored-radionica/README.md) | 189 |
| 059 | [Brzi zbir intervala](059-brzi-zbir-intervala/README.md) | 192 |
| 060 | [Najviše radionica](060-najvise-radionica/README.md) | 194 |
| 061 | [Fabrika bedževa](061-fabrika-bedzeva/README.md) | 197 |
| 062 | [Minimalni kapacitet kamiona](062-minimalni-kapacitet-kamiona/README.md) | 199 |
| 063 | [Latinski kvadrat - provjera](063-latinski-kvadrat-provjera/README.md) | 203 |
| 064 | [Izlaz iz labirinta](064-izlaz-iz-labirinta/README.md) | 205 |
| 065 | [Izaberi tačno K brojeva](065-izaberi-tacno-k-brojeva/README.md) | 208 |
| 066 | [N kraljica](066-n-kraljica/README.md) | 210 |
| 067 | [Riječ kroz mrežu](067-rijec-kroz-mrezu/README.md) | 212 |
| 068 | [Binarni nizovi bez susjednih jedinica](068-binarni-nizovi-bez-susjednih-jedinica/README.md) | 214 |
| 069 | [Tačan zbir za četrdeset brojeva](069-tacan-zbir-za-cetrdeset-brojeva/README.md) | 216 |
| 070 | [Najjeftiniji put kroz tabelu](070-najjeftiniji-put-kroz-tabelu/README.md) | 218 |
| 071 | [Putevi kroz mrežu sa preprekama](071-putevi-kroz-mrezu-sa-preprekama/README.md) | 220 |
| 072 | [Evakuacija škole](072-evakuacija-skole/README.md) | 222 |
| 073 | [Robot i jedan zid](073-robot-i-jedan-zid/README.md) | 225 |
| 074 | [Najbliži izlaz iz labirinta](074-najblizi-izlaz-iz-labirinta/README.md) | 228 |
| 075 | [Najveći zajednički djelilac](075-najveci-zajednicki-djelilac/README.md) | 232 |
| 076 | [Kada se signali ponovo poklope](076-kada-se-signali-ponovo-poklope/README.md) | 234 |
| 077 | [Da li je broj prost?](077-da-li-je-broj-prost/README.md) | 236 |
| 078 | [Brzi odgovori o prostim brojevima](078-brzi-odgovori-o-prostim-brojevima/README.md) | 238 |
| 079 | [Koliko djelilaca ima broj?](079-koliko-djelilaca-ima-broj/README.md) | 240 |
| 080 | [Jedinice u binarnom zapisu](080-jedinice-u-binarnom-zapisu/README.md) | 242 |
| 081 | [Brzo stepenovanje po modulu](081-brzo-stepenovanje-po-modulu/README.md) | 244 |
| 082 | [Rastavljanje na proste faktore](082-rastavljanje-na-proste-faktore/README.md) | 246 |
| 083 | [Koliko je prostih?](083-koliko-je-prostih/README.md) | 248 |
| 084 | [NZD bez jednog broja](084-nzd-bez-jednog-broja/README.md) | 251 |
| 085 | [Veliki stepen modulo M](085-veliki-stepen-modulo-m/README.md) | 253 |
| 086 | [Posljednja nenulta cifra faktorijela](086-posljednja-nenulta-cifra-faktorijela/README.md) | 255 |
| 087 | [Ispravno ugniježđene zagrade](087-ispravno-ugnijezdjene-zagrade/README.md) | 258 |
| 088 | [Prvi veći desno](088-prvi-veci-desno/README.md) | 260 |
| 089 | [Poništi posljednju operaciju](089-ponisti-posljednju-operaciju/README.md) | 262 |
| 090 | [Postfiksni kalkulator](090-postfiksni-kalkulator/README.md) | 264 |
| 091 | [Dinamički zbir intervala](091-dinamicki-zbir-intervala/README.md) | 266 |
| 092 | [Minimum uz promjene](092-minimum-uz-promjene/README.md) | 269 |
| 093 | [Koliko riječi počinje prefiksom?](093-koliko-rijeci-pocinje-prefiksom/README.md) | 272 |
| 094 | [Koliko puta se uzorak pojavljuje?](094-koliko-puta-se-uzorak-pojavljuje/README.md) | 275 |
| 095 | [Najkraći period poruke](095-najkraci-period-poruke/README.md) | 277 |
| 096 | [Dinamički zbir intervala](096-dinamicki-zbir-intervala/README.md) | 279 |
| 097 | [Minimum na intervalu](097-minimum-na-intervalu/README.md) | 282 |
| 098 | [Rječnik prefiksa](098-rjecnik-prefiksa/README.md) | 285 |
| 099 | [Pojavljivanja uzorka](099-pojavljivanja-uzorka/README.md) | 288 |
| 100 | [Jednaki podstringovi — tačno poređenje](100-jednaki-podstringovi-tacno-poredjenje/README.md) | 291 |
| 101 | [Sljedeći veći element](101-sljedeci-veci-element/README.md) | 295 |
| 102 | [Maksimum kliznog prozora](102-maksimum-kliznog-prozora/README.md) | 297 |
| 103 | [Povezane škole](103-povezane-skole/README.md) | 301 |
| 104 | [Najkraći hodnik](104-najkraci-hodnik/README.md) | 303 |
| 105 | [Najbliži izlaz](105-najblizi-izlaz/README.md) | 305 |
| 106 | [Dva tima](106-dva-tima/README.md) | 308 |
| 107 | [Najjeftinija ruta](107-najjeftinija-ruta/README.md) | 311 |
| 108 | [Mostovi u mreži](108-mostovi-u-mrezi/README.md) | 314 |
| 109 | [Redoslijed preduslova](109-redoslijed-preduslova/README.md) | 317 |
| 110 | [Da li zavisnosti sadrže ciklus?](110-da-li-zavisnosti-sadrze-ciklus/README.md) | 319 |
| 111 | [Komponente nakon spajanja](111-komponente-nakon-spajanja/README.md) | 321 |
| 112 | [Najjeftinija mreža kablova](112-najjeftinija-mreza-kablova/README.md) | 324 |
| 113 | [Putevi cijene 0 ili 1](113-putevi-cijene-0-ili-1/README.md) | 327 |
| 114 | [Najbliža stanica svakoj tački](114-najbliza-stanica-svakoj-tacki/README.md) | 330 |
| 115 | [Vrati najkraći put](115-vrati-najkraci-put/README.md) | 333 |
| 116 | [Može li graf u dvije ekipe?](116-moze-li-graf-u-dvije-ekipe/README.md) | 336 |
| 117 | [Najduži lanac u DAG-u](117-najduzi-lanac-u-dag-u/README.md) | 339 |
| 118 | [Svi parovi najkraćih puteva](118-svi-parovi-najkracih-puteva/README.md) | 341 |
| 119 | [Kritične raskrsnice](119-kriticne-raskrsnice/README.md) | 343 |
| 120 | [Kablovi sa obaveznim vezama](120-kablovi-sa-obaveznim-vezama/README.md) | 346 |
| 121 | [Broj najkraćih puteva](121-broj-najkracih-puteva/README.md) | 349 |
| 122 | [Koliko parova razdvaja most?](122-koliko-parova-razdvaja-most/README.md) | 352 |
| 123 | [Najjeftiniji put sa jednim popustom](123-najjeftiniji-put-sa-jednim-popustom/README.md) | 355 |
| 124 | [Put sa besplatnim portalima](124-put-sa-besplatnim-portalima/README.md) | 358 |
| 125 | [Najjeftiniji put između gradova](125-najjeftiniji-put-izmedju-gradova/README.md) | 361 |
| 126 | [Redoslijed predmeta](126-redoslijed-predmeta/README.md) | 364 |
| 127 | [Podjela u dvije ekipe](127-podjela-u-dvije-ekipe/README.md) | 367 |
| 128 | [Koliko zatvorenih regija?](128-koliko-zatvorenih-regija/README.md) | 370 |
| 129 | [Jedna besplatna karta](129-jedna-besplatna-karta/README.md) | 374 |
| 130 | [Online prijateljstva](130-online-prijateljstva/README.md) | 377 |
| 131 | [Minimalna mreža kablova](131-minimalna-mreza-kablova/README.md) | 380 |
| 132 | [Broj komponenti poslije svake veze](132-broj-komponenti-poslije-svake-veze/README.md) | 383 |
| 133 | [Tačka sastanka](133-tacka-sastanka/README.md) | 386 |
| 134 | [Prag povezivanja](134-prag-povezivanja/README.md) | 388 |
| 135 | [Najduži put kroz plan](135-najduzi-put-kroz-plan/README.md) | 391 |
| 136 | [Odabir projekata](136-odabir-projekata/README.md) | 396 |
| 137 | [Kamenčići sa krajeva](137-kamencici-sa-krajeva/README.md) | 398 |
| 138 | [Minimalni broj novčića](138-minimalni-broj-novcica/README.md) | 400 |
| 139 | [Najduži rastući podniz](139-najduzi-rastuci-podniz/README.md) | 402 |
| 140 | [Koliko izmjena dijeli dvije riječi?](140-koliko-izmjena-dijeli-dvije-rijeci/README.md) | 404 |
| 141 | [Stepenice sa zabranama](141-stepenice-sa-zabranama/README.md) | 406 |
| 142 | [Najveći zbir bez susjeda](142-najveci-zbir-bez-susjeda/README.md) | 408 |
| 143 | [Najduži zajednički podniz](143-najduzi-zajednicki-podniz/README.md) | 410 |
| 144 | [Podjela ekipe](144-podjela-ekipe/README.md) | 412 |
| 145 | [Prečnik stabla](145-precnik-stabla/README.md) | 414 |
| 146 | [Veličine podstabala](146-velicine-podstabala/README.md) | 417 |
| 147 | [Najbliži zajednički predak](147-najblizi-zajednicki-predak/README.md) | 420 |
| 148 | [Čuvari koji se ne dodiruju](148-cuvari-koji-se-ne-dodiruju/README.md) | 424 |
| 149 | [Stepenice 1-2-3](149-stepenice-1-2-3/README.md) | 427 |
| 150 | [Najmanji broj kovanica](150-najmanji-broj-kovanica/README.md) | 429 |
| 151 | [Ruksak za takmičenje](151-ruksak-za-takmicenje/README.md) | 431 |
| 152 | [Najduži rastući podniz](152-najduzi-rastuci-podniz/README.md) | 433 |
| 153 | [Najduži zajednički podniz](153-najduzi-zajednicki-podniz/README.md) | 435 |
| 154 | [Najbolji put kroz matricu](154-najbolji-put-kroz-matricu/README.md) | 437 |
| 155 | [Može li se podijeliti jednako?](155-moze-li-se-podijeliti-jednako/README.md) | 439 |
| 156 | [Broj inverzija](156-broj-inverzija/README.md) | 441 |
| 157 | [Labirint sa ključevima](157-labirint-sa-kljucevima/README.md) | 444 |
| 158 | [Putnik kroz stanice](158-putnik-kroz-stanice/README.md) | 447 |
| 159 | [Maksimalni protok kroz mrežu](159-maksimalni-protok-kroz-mrezu/README.md) | 450 |
| 160 | [KLIKERI](160-klikeri/README.md) | 455 |
| 161 | [PJESME](161-pjesme/README.md) | 457 |
| 162 | [LAGNO](162-lagno/README.md) | 459 |
