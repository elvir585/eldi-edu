# ELDI EDU web centar

Prenosiva statička stranica za `https://upinitk.com/eldi-edu/`.
Mapa `eldi-edu/` sadrži sve javne datoteke; `POSTAVLJANJE.txt` sadrži korake za
postojeći hosting i HTML vezu za postojeći UPINITK meni. Nisu potrebne nove
zavisnosti, baza ni izmjene postojećeg PHP sajta.

## Sadržaj i preuzimanja

Preuzimanja su pinovana na provjereno izdanje **11.0.1**. Trajna veza
`https://github.com/elvir585/eldi-edu/releases/latest` omogućava provjeru novijih
izdanja. Stranica ne preuzima podatke u pozadini i ne koristi tokene ni analitiku.
Katalog je pregled tema; rad u zadacima ostaje u Windows aplikaciji.

Katalog regenerisati iz korijena repozitorija:

```sh
node scripts/build-web-catalog.cjs
```

Generator preuzima matematiku iz `content/curriculum-map.js`, Blockly teme iz
`content/block-projects.json` i izazove iz `content/program-assessments.js`.
Raspored tema je urednički plan, bez tvrdnje o potpunom službenom odobrenju.
Pri novom izdanju istovremeno pregledati tekstove, verzije, linkove, veličine,
upute i slike — generator osvježava samo katalog.

## Porijeklo slika i videa

PNG datoteke su neizmijenjeni snimci zapakovane Windows aplikacije iz uspješne
[GitHub provjere 37815152122](https://github.com/elvir585/eldi-edu/actions/runs/37815152122),
artefakt `ELDI-EDU-11.0.1-Visual-QA`, ID `11568085178`, direktorij `packaged/`.
Izvorni commit: `8805ba9850ad96fcd16f382494ebc465e9c0b6b2`.
Prikazani su demonstracijski profili, ne stvarni podaci učenika.

| Javna datoteka | Izvorna slika |
| --- | --- |
| pregled.png | 01-home.png |
| matematicka-sveska.png | 15-notebook.png |
| nastavnicki-centar.png | 16-teacher.png |
| scratch-studio.png | 18-scratch-studio.png |
| programerski-izazovi.png | 18-programming-assessment.png |

Video je 20-sekundni slideshow ovih snimaka, redom: pregled, sveska, Scratch,
programerski izazovi i nastavnički centar (četiri sekunde po slici). Bez zvuka;
VTT opis i tekstualni opis sadržaja uključeni su uz video. Logo je postojeći
`renderer/assets/eldi-mark.svg`. Scratch naziv/logo prikazuje stvarnu komponentu;
odgovarajući izvori i licenca dostupni su preko Scratch-izvori ZIP veze.

## Povezivanje iz aplikacije

Nova stavka `UPINITK · ELDI centar` otvara lokalni ekran s uputama i dugmadima.
Preload izlaže `openPortal(destination)`; glavni proces provjerava pouzdanog
pošiljaoca i prihvata samo četiri imenovane adrese. Vanjske stranice se otvaraju
u sistemskom pregledniku. Učenički podaci nisu dio URL-a ni poziva.

**Redoslijed objave:** postaviti web mapu i provjeriti URL, zatim spojiti izmjene
aplikacije i izraditi zasebno numerisano izdanje. Postojeći workflow objavljuje
11.0.1 na svakom pushu u main; zato ovaj prijedlog ne treba spajati bez pripreme
nove verzije. Ovim radom nisu prepisani postojeći EXE ni izdanje 11.0.1.
