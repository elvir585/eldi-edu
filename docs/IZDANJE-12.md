# ELDI EDU 12.0.0

Windows izdanje: novi radni prostor, 2D/3D laboratorij i prošireni Blockly studio. Osnovni rad ostaje lokalni; profili iz prethodnog izdanja dobijaju nova polja tek kada se novi alati koriste.

## Crtanje 2D / 3D

- Tri funkcije, parametri a/b/c, pomjeranje koordinatnog sistema, tabela vrijednosti, numeričke nule i presjeci prve dvije funkcije. Izrazi se čitaju posebnim parserom, bez izvršavanja JavaScripta. Numeričko uzorkovanje ne garantuje sve nule, posebno tangencijalne ili usko razmaknute.
- Trougao s pomjerljivim vrhovima: težišnice, visine, simetrale uglova, upisana i opisana kružnica, obim i površina. Kolinearne tačke jasno su označene.
- Kocka, kvadar, pravilna prizma, pravilna piramida, valjak, kupa i lopta. Rotacija, dimenzije, površina, zapremina i presjek paralelan osnovi. Proizvoljno kosi presjeci nisu podržani.
- Razmjerne ravne mreže tijela i postepeno otkrivanje dijelova; ovo nije fizička animacija savijanja. Lopta nema tačnu ravnu mrežu.
- Diedar s klizačem ugla i normalnim presjekom. Rotacija kamere ne mijenja ugao diedra.
- Sortiranje, linearna pretraga, zbir, maksimum i prosjek kroz korake algoritma.
- Bilješke, 30 sačuvanih istraživanja, JSON uvoz/izvoz, SVG/PNG prikaza i štampa. SVG/PNG izvozi glavni grafički prikaz; mreža i bilješke dostupne su u štampi.

JSXGraph i Three.js ugrađeni su u aplikaciju; laboratorij ne učitava biblioteke s interneta. 3D prikaz koristi vektorski SVG renderer.

## Blockly studio

- Pretraga blokova na bosanskom, početni i napredni izbor kategorija, uređivanje rasporeda, poništavanje/ponavljanje i prikaz cijelog projekta.
- Ruksak s 20 grupa i 20 verzija projekta. Prije vraćanja verzije pravi se kopija trenutnog rada. Grupe i verzije čuvaju se po profilu.
- Živo izvršavanje u interpreteru: pauza, korak prije narednog bloka, tačke prekida i prikaz stvarnih vrijednosti. CPU ograničenje ne računa vrijeme pauze. Bez živog režima ostaje raniji animirani prikaz.
- Tipke i miš u živom režimu, mjerač proteklog vremena i dodir likova prema udaljenosti središta manjoj od 20 koraka. Za igre koristi kratko čekanje u petlji; projekti i dalje imaju ograničenje broja naredbi. Ovo nije fizikalni engine.
- Blok za izradu 3D tijela prenosi vrstu i dimenzije u laboratorij, koji se otvara dugmetom. Osnovni oblici i kornjača ostaju dostupni na pozornici.
- Klik na mapirani Python red označava blok; izbor bloka označava pripadajuće redove. Konzolni Python se može izvršiti u editoru. Turtle grafika traži punu Python/Tkinter instalaciju; 3D blok u izvoznom Pythonu ispisuje parametre modela.
- Dugme **Svi testovi** izvršava svaku provjeru u zasebnom interpreteru i čuva izvještaj s djelimičnim bodovima. Pojedinačno Pokreni i provjeri zadržava provjeru odabranog primjera.
- Nastavnički izazovi: opis, trenutni blokovi kao početni projekat, do 20 tekstualnih testova, bodovi i dozvoljeni tipovi blokova. JSON prenos, do 30 izazova i 50 izvještaja po profilu. Nastavnička ocjena i komentar čuvaju se odvojeno od automatskih bodova.

Lokalni izvještaji služe nastavnom radu; nisu kriptografski ovjerene potvrde. Mrežna učionica i zajednička baza nisu dio ovog izdanja.

## Paketi

Setup EXE služi instalaciji, Portable EXE direktnom pokretanju. Kompletan ZIP objedinjuje Portable EXE, zbirke, Scratch primjere/izvore, web paket i upute. Web ZIP sadrži mapu `eldi-edu/`; raspakovati u `public_html` za adresu `https://upinitk.com/eldi-edu/`. EXE i velike zbirke preuzimaju se s GitHuba. Web stranica je centar za preuzimanje i podršku.

Izdanje nije digitalno potpisano. Svaki EXE i ZIP ima SHA256 u objavljenoj datoteci SHA256SUMS.txt.

## Provjere

`npm run check` provjerava sadržaj, sintaksu, matematičke formule, interpreter, parser, profile i postojeće module. `desktop/lab-smoke.cjs` radi s pravim Electron rendererom i provjerava nacrtane grafove, sedam tijela, konstrukcije, debugger, ruksak, verzije, vlastite izazove, djelimične bodove i izvoz profila. Windows postupak zatim provjerava sva četiri jezika, Scratch i zapakovani EXE prije objave.

Autori: Dino Isanović · Elvir Čajić · Damir Bajrić · Jasmin Suljkanović.
