# Putevi učenja i mapa kurikuluma

ELDI EDU 11.0 organizuje **postojećih 500 matematičkih i 500 informatičkih vještina** u 91 cjelinu, po predmetu i razredu od 5. do 9. Svaka postojeća vještina pripada tačno jednoj cjelini. Redoslijed i graf preduslova su **urednički plan ELDI EDU**, a ne potvrda potpune usklađenosti sa službenim nastavnim programom.

## Stvarni rad učenika

Put lekcije ima pet koraka: objašnjenje iz kataloga → postojeći razrađen primjer → samostalan praktični rad → provjera polja odgovora → preporuka ponavljanja ili sljedeće vještine. Matematika koristi `EduPractice` sa 200 indeksa i tri težine; informatika koristi postojeću praktičnu aktivnost svake lekcije. Bilješke o postupku čuvaju se, ali ih ovaj modul ne predstavlja kao automatski ocijenjene dokaze ili rukopis.

Učenik označava pročitano objašnjenje i primjer. Provjera čuva odgovor, pokušaje, trenutnu i ukupnu uspješnost. Prikaz pomoći, rješenja ili uspješan odgovor povezanog asistenta označava trenutnu vježbu kao rad uz pomoć. Samostalan uspjeh nastaje nakon tačne provjere bez označene pomoći. Novo matematičko pitanje dobiva sljedeći indeks; ponavljanje informatičke aktivnosti koristi isti izvorni zadatak. Indeksi matematičke zbirke nisu tvrdnja o 200 različitih nastavnih ishoda.

Dnevna preporuka bira 1–5 vještina na osnovu stvarno zabilježenih pokušaja. Posljednji netačan pokušaj ima prioritet; zatim slijedi preporuka pripreme iz preduslova, samostalnog rada nakon pomoći i novih vještina. Preduslovi ne zaključavaju lekcije. Kod svih riješenih vještina predlaže se ponavljanje. Jedan tačan odgovor nije dokaz dugoročne ovladanosti gradivom.

Rad se čuva u lokalnom profilu `learningPathWork`, uz kompatibilne rezultate `courseResults`, `mathWork.results` i `infoWork.results`. Svaki učenikov profil ima vlastitu mapu i bilješke. Ovo nije razmjena školskih podataka preko mreže.

## Službeni izvori i postepena primjena u TK

Primarni izvor pregledan **8. oktobra 2026.**: [Pedagoški zavod Tuzlanskog kantona — Nastavni planovi i programi za osnovno obrazovanje](https://pztz.ba/Page.aspx?id1=62).

Stranica navodi postepenu primjenu novog kurikuluma, počevši od prvog razreda u 2025/2026. Posebno navodi Osnove tehnike i informatike za peti razred od 2025/2026, te Informatiku i Tehničku kulturu počevši od šestog razreda u 2026/2027. Na istoj stranici navedeni su i raniji programi po razredima koji se još primjenjuju.

Iz tih navoda nije izvedena tvrdnja da je cijeli katalog vještina od 5. do 9. razreda mapiran na službene ishode. Početna mapa sadrži **0 pregledanih službenih povezivanja**. Za tačno povezivanje potrebno je pregledati odgovarajući dokument i školsku godinu za konkretan predmet i razred.

## Korisničko povezivanje ishoda

U sekciji „Mapa kurikuluma“ korisnik može dodati ili urediti ishod, odabrati postojeće vještine, navesti izvor i zapisati nedostajući sadržaj. Ishod bez povezanih vještina ostaje vidljiv kao praznina u pokrivenosti.

Tri statusa:

| Status | Značenje |
| --- | --- |
| Urednički plan | Organizacija postojećeg sadržaja ELDI EDU. |
| Nacrt povezivanja | Korisnički unos za daljnju provjeru. |
| Pregledano u profilu | Korisnik je zabilježio provjeru i popunio oznaku, dokument, godinu, stranicu, ime i datum pregleda. To nije institucionalno odobrenje. |

Pregledano povezivanje zahtijeva `officialId`, javnu http/https adresu `source`, uzastopnu školsku godinu poput `2026/2027`, stranicu/odjeljak `page`, ime `reviewer` i datum `reviewedAt`. Provjera forme ne provjerava sadržaj dokumenta niti identitet osobe. Unos treba stručno pregledati prije korištenja kao formalnog dokaza usklađenosti.

Mape se izvoze i uvoze u JSON formatu `app: "ELDI EDU curriculum map", version: 1, outcomes: [...]`. Uvoz dopunjava profil; isti `id` zamjenjuje prethodni zapis. Ograničenje je 8 MB po datoteci, 1200 ishoda, 100 vještina po ishodu i 6000 znakova bilješki. Nepoznati predmeti, razredi, vještine, neodgovarajući povezani razredi, ponovljene oznake i neispravna polja se odbijaju prije izmjene.

## Integracija i provjera

Učitajte `content/curriculum-map.js` nakon `content/catalog-data.js`. Učitajte `app/learning-paths.js` nakon matematičkog i ispitnog modula, a `renderer/learning-paths.js` nakon njega, uz `renderer/learning-paths.css`. Prikaz: `ELDILearningPaths.mount({root, profile, save, go, askAI, exportFile})`. `profile` je funkcija koja vraća aktivni profil; `exportFile(filename, text)` koristi postojeći desktop izvoz.

Normalizacija profila: `ELDILearningPlan.normalizeWork(value.learningPathWork)`. Za stari profil bez ovog polja vraća se novi prazan put učenja sa uredničkom mapom. Modul ne mijenja postojeće sačuvane programske skice, profile ili učeničke zbirke.

Pokrenite `node --test tests/learning-paths.test.cjs`. Provjera obuhvata pokrivenost svih 1000 stvarnih vještina, acikličan graf preduslova, 2000 praktičnih provjera, preporuke iz rezultata, pomoć naspram samostalnog rada, JSON mapiranje i odbijanje neispravnog uvoza.
