# ELDI EDU 12.0.0 — UPINITK web centar

Mapa `eldi-edu/` je statična stranica za adresu
`https://upinitk.com/eldi-edu/`. Raspakovati web ZIP u `public_html` prema
uputi `POSTAVLJANJE.txt`. Nije potreban backend ni baza.

Dugmad vode na Setup EXE, Portable EXE, kompletan paket i zbirke izdanja
`v12.0.0` na GitHubu. Windows workflow objavljuje datoteke tek nakon
provjera koda, jezika, interaktivnih modula i zapakovane aplikacije.

Novi prikazi početnog ekrana, funkcija, prostornih tijela i Blockly studija
snimljeni su tokom provjere stvarnog desktop renderera. Preostale slike i
kratki video prikazuju osnovne module prethodnog izdanja 11.0.1; video je
na stranici tako označen. Slike nisu zamišljeni prikazi budućih funkcija.

Aplikacija ima link na centar u odjeljku **O aplikaciji**. Stranica sadrži
pregled po razredima, upute za nastavnike, početne korake, autore i GitHub
prijavu problema. Nema automatske objave na UPINITK hostingu.

Izrada ZIP-a: `node scripts/build-web-package.cjs` iz korijena repozitorija.
Izlaz je `release/ELDI-EDU-12.0.0-UPINITK-public_html.zip`.

Prije objave provjereni su svi lokalni resursi, izbor pet razreda i prikaz
na širinama 1366 i 390 piksela. Nema horizontalnog pomjeranja stranice.

Zadaci, programi, projekti i rezultati koriste se u Windows aplikaciji.
Mrežna učionica, zajednički nalozi i QR provjera rezultata nisu dio web
paketa. Detalji desktop izdanja su u `docs/IZDANJE-12.md` repozitorija.
