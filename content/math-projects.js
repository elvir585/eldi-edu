// ELDI EDU: višekoračni zadaci s potpunim postupcima.
(function () {
  'use strict';
  const projects =
/* BEGIN_DATA */
[
  {
    "id": "project-5-biblioteka",
    "topicId": "projects",
    "grade": 5,
    "title": "Biblioteka i raspodjela knjiga",
    "prompt": "Školska biblioteka ima 14 polica sa po 32 knjige. Nabavljeno je još 175 knjiga, a zatim je učenicima posuđeno 129. Nakon toga se trima područnim odjeljenjima šalje po 80 knjiga. Izračunaj broj knjiga prije nabavke, broj nakon nabavke i konačan broj knjiga koje ostaju u biblioteci.",
    "fields": [
      {
        "key": "pocetno",
        "label": "Knjige prije nabavke",
        "answer": "448",
        "type": "number"
      },
      {
        "key": "nabavka",
        "label": "Knjige nakon nabavke",
        "answer": "623",
        "type": "number"
      },
      {
        "key": "konacno",
        "label": "Knjige koje ostaju",
        "answer": "254",
        "type": "number"
      }
    ],
    "steps": [
      "Prije nabavke ima 14 · 32 = 448 knjiga.",
      "Nakon nabavke: 448 + 175 = 623 knjige.",
      "Nakon posuđivanja: 623 − 129 = 494 knjige.",
      "Područnim odjeljenjima šalje se 3 · 80 = 240 knjiga.",
      "Konačno stanje: 494 − 240 = 254 knjige. Provjera ukupne promjene: 448 + 175 − 129 − 240 = 254."
    ],
    "hint": "Najprije izračunaj ukupan broj na policama, a promjene prati redom. Tri odjeljenja ne dobivaju ukupno 80 knjiga, nego svako po 80."
  },
  {
    "id": "project-5-budzet",
    "topicId": "projects",
    "grade": 5,
    "title": "Oprema iz milionskog budžeta",
    "prompt": "Za opremanje ustanove odobreno je 1 500 000 KM. Kupuje se 18 uređaja po 27 500 KM, a postavljanje i obuka koštaju ukupno 85 600 KM. Izračunaj cijenu svih uređaja, ukupan trošak i novac koji ostaje.",
    "fields": [
      {
        "key": "uredjaji",
        "label": "Cijena uređaja, KM",
        "answer": "495000",
        "type": "number"
      },
      {
        "key": "trosak",
        "label": "Ukupan trošak, KM",
        "answer": "580600",
        "type": "number"
      },
      {
        "key": "ostatak",
        "label": "Preostali novac, KM",
        "answer": "919400",
        "type": "number"
      }
    ],
    "steps": [
      "Cijena 18 uređaja je 18 · 27 500 = 495 000 KM.",
      "Ukupan trošak uključuje i postavljanje i obuku: 495 000 + 85 600 = 580 600 KM.",
      "Preostaje 1 500 000 − 580 600 = 919 400 KM.",
      "Provjera: 580 600 + 919 400 = 1 500 000 KM."
    ],
    "hint": "Cijenu jednog uređaja prvo pomnoži brojem uređaja. U posljednjem koraku oduzmi sve troškove od odobrenog iznosa."
  },
  {
    "id": "project-5-autobusi",
    "topicId": "projects",
    "grade": 5,
    "title": "Ekskurzija bez praznog računa",
    "prompt": "Na ekskurziju ide 287 putnika. Autobus ima 48 mjesta, a najam jednog autobusa košta 650 KM. Svi putnici trebaju sjedeće mjesto. Odredi najmanji broj autobusa, broj praznih mjesta u tim autobusima i ukupan najam.",
    "fields": [
      {
        "key": "autobusi",
        "label": "Najmanji broj autobusa",
        "answer": "6",
        "type": "number"
      },
      {
        "key": "prazna",
        "label": "Ukupno praznih mjesta",
        "answer": "1",
        "type": "number"
      },
      {
        "key": "najam",
        "label": "Ukupan najam, KM",
        "answer": "3900",
        "type": "number"
      }
    ],
    "steps": [
      "287 : 48 = 5 i ostatak 47. Pet autobusa ima samo 240 mjesta i nije dovoljno.",
      "Potrebno je 6 autobusa; imaju 6 · 48 = 288 mjesta.",
      "Prazno je 288 − 287 = 1 mjesto.",
      "Najam iznosi 6 · 650 = 3 900 KM."
    ],
    "hint": "Količnik s ostatkom govori koliko je punih autobusa. Ako ijedan putnik ostane, treba još jedan autobus."
  },
  {
    "id": "project-5-ograda",
    "topicId": "projects",
    "grade": 5,
    "title": "Vrt, prolaz i ograda",
    "prompt": "Pravougaoni vrt je dug 28 m i širok 17 m. Na granici se ostavlja prolaz širok 4 m, koji se ne ograđuje. Metar ograde košta 12 KM. Izračunaj obim vrta, potrebnu dužinu ograde, cijenu ograde i površinu vrta.",
    "fields": [
      {
        "key": "obim",
        "label": "Obim vrta, m",
        "answer": "90",
        "type": "number"
      },
      {
        "key": "ograda",
        "label": "Potrebna ograda, m",
        "answer": "86",
        "type": "number"
      },
      {
        "key": "cijena",
        "label": "Cijena ograde, KM",
        "answer": "1032",
        "type": "number"
      },
      {
        "key": "povrsina",
        "label": "Površina vrta, m²",
        "answer": "476",
        "type": "number"
      }
    ],
    "steps": [
      "Obim je 2 · (28 + 17) = 2 · 45 = 90 m.",
      "Prolaz se ne ograđuje: 90 − 4 = 86 m ograde.",
      "Cijena je 86 · 12 = 1 032 KM.",
      "Površina je 28 · 17 = 476 m². Obim i površina imaju različite jedinice."
    ],
    "hint": "Obim broji sve četiri stranice; prolaz oduzmi samo jednom. Površinu izračunaj odvojeno množenjem dužine i širine."
  },
  {
    "id": "project-5-plocice",
    "topicId": "projects",
    "grade": 5,
    "title": "Pločice i puna pakovanja",
    "prompt": "Pod učionice je pravougaonik dimenzija 9 m i 6 m. Pokriva se kvadratnim pločicama stranice 30 cm. Nema otpada ni fuga i stranice pločica su paralelne sa stranicama poda. U kutiji je 25 pločica, a kutija košta 18 KM. Odredi broj pločica, broj kutija i ukupnu cijenu.",
    "fields": [
      {
        "key": "plocice",
        "label": "Broj pločica",
        "answer": "600",
        "type": "number"
      },
      {
        "key": "kutije",
        "label": "Broj kutija",
        "answer": "24",
        "type": "number"
      },
      {
        "key": "cijena",
        "label": "Ukupna cijena, KM",
        "answer": "432",
        "type": "number"
      }
    ],
    "steps": [
      "Pretvori dužine poda: 9 m = 900 cm i 6 m = 600 cm.",
      "U jednom redu stane 900 : 30 = 30 pločica, a ima 600 : 30 = 20 redova.",
      "Treba 30 · 20 = 600 pločica. Obje podne dimenzije djeljive su sa 30 cm, pa nema rezanja.",
      "Kutija treba 600 : 25 = 24. Cijena je 24 · 18 = 432 KM."
    ],
    "hint": "Sve dužine pretvori u centimetre. Prvo odredi broj pločica po dužini i širini."
  },
  {
    "id": "project-5-stampanje",
    "topicId": "projects",
    "grade": 5,
    "title": "Dvostrano štampanje zbirke",
    "prompt": "Štampa se 3 850 primjeraka zbirke. Svaki primjerak ima 24 stranice, a na jedan list štampaju se dvije stranice, po jedna sa svake strane. Papir se kupuje u pakovanjima od 500 listova. Odredi broj potrebnih listova, najmanji broj pakovanja i broj neiskorištenih listova iz kupljenih pakovanja.",
    "fields": [
      {
        "key": "listovi",
        "label": "Potrebni listovi",
        "answer": "46200",
        "type": "number"
      },
      {
        "key": "pakovanja",
        "label": "Najmanji broj pakovanja",
        "answer": "93",
        "type": "number"
      },
      {
        "key": "visak",
        "label": "Neiskorišteni listovi",
        "answer": "300",
        "type": "number"
      }
    ],
    "steps": [
      "Jedan primjerak koristi 24 : 2 = 12 listova.",
      "Za sve primjerke treba 3 850 · 12 = 46 200 listova.",
      "46 200 : 500 = 92 i ostatak 200. Trebaju 93 puna pakovanja.",
      "Kupljeno je 93 · 500 = 46 500 listova. Ostaje 46 500 − 46 200 = 300 listova."
    ],
    "hint": "Razlikuj stranicu od lista. Pakovanja se kupuju cijela, zato ostatak pri dijeljenju povećava broj pakovanja."
  },
  {
    "id": "project-5-pakovanje",
    "topicId": "projects",
    "grade": 5,
    "title": "Olovke i ostatak",
    "prompt": "Treba upakovati 2 650 olovaka u kutije koje primaju po 36 olovaka. Najprije se pune kutije do vrha, pa se ostatak stavlja u još jednu kutiju. Izračunaj broj potpuno punih kutija, broj olovaka u posljednjoj nepotpunoj kutiji, ukupan broj kutija i broj praznih mjesta u posljednjoj kutiji.",
    "fields": [
      {
        "key": "pune",
        "label": "Potpuno pune kutije",
        "answer": "73",
        "type": "number"
      },
      {
        "key": "ostatak",
        "label": "Olovke u nepotpunoj kutiji",
        "answer": "22",
        "type": "number"
      },
      {
        "key": "kutije",
        "label": "Ukupno kutija",
        "answer": "74",
        "type": "number"
      },
      {
        "key": "prazna",
        "label": "Prazna mjesta u posljednjoj kutiji",
        "answer": "14",
        "type": "number"
      }
    ],
    "steps": [
      "2 650 = 36 · 73 + 22, jer 36 · 73 = 2 628.",
      "Potpuno su pune 73 kutije, a ostaju 22 olovke.",
      "Za ostatak treba još jedna kutija: ukupno 74.",
      "Posljednja kutija ima 36 − 22 = 14 praznih mjesta. Provjera: 74 · 36 − 14 = 2 650."
    ],
    "hint": "Upotrijebi jednakost djeljenik = djelilac · količnik + ostatak. Ostatak mora biti manji od 36."
  },
  {
    "id": "project-5-putovanje",
    "topicId": "projects",
    "grade": 5,
    "title": "Vrijeme putovanja i pauza",
    "prompt": "Voz polazi u 8 h 35 min. Prva dionica traje 2 h 48 min, zatim pauza 26 min, a druga dionica 1 h 19 min. Sve se događa istog dana. Izračunaj ukupno trajanje s pauzom u minutama te sat i minutu dolaska. Sat i minutu unesi u odvojena polja.",
    "fields": [
      {
        "key": "trajanje",
        "label": "Ukupno trajanje, min",
        "answer": "273",
        "type": "number"
      },
      {
        "key": "sat",
        "label": "Sat dolaska",
        "answer": "13",
        "type": "number"
      },
      {
        "key": "minuta",
        "label": "Minuta dolaska",
        "answer": "8",
        "type": "number"
      }
    ],
    "steps": [
      "Prva dionica traje 2 · 60 + 48 = 168 min; druga 60 + 19 = 79 min.",
      "Ukupno s pauzom: 168 + 26 + 79 = 273 min = 4 h 33 min.",
      "8 h 35 min + 4 h 33 min = 12 h 68 min.",
      "68 min je 1 h 8 min, pa je dolazak u 13 h 08 min."
    ],
    "hint": "Jedan sat ima 60 minuta. Trajanje s pauzom prvo pretvori u minute, pa ga dodaj vremenu polaska."
  },
  {
    "id": "project-6-autobuski-red",
    "topicId": "projects",
    "grade": 6,
    "title": "Zajednički polasci autobusa",
    "prompt": "Dvije autobuske linije kreću zajedno u 9 h. Prva zatim polazi svakih 24 min, a druga svakih 36 min. Odredi najmanji razmak između zajedničkih polazaka, sat i minutu prvog narednog zajedničkog polaska te broj zajedničkih polazaka od 9 h do 13 h, uključujući 9 h, a ne uključujući 13 h.",
    "fields": [
      {
        "key": "razmak",
        "label": "Razmak zajedničkih polazaka, min",
        "answer": "72",
        "type": "number"
      },
      {
        "key": "sat",
        "label": "Sat prvog narednog polaska",
        "answer": "10",
        "type": "number"
      },
      {
        "key": "minuta",
        "label": "Minuta prvog narednog polaska",
        "answer": "12",
        "type": "number"
      },
      {
        "key": "broj",
        "label": "Broj zajedničkih polazaka u intervalu",
        "answer": "4",
        "type": "number"
      }
    ],
    "steps": [
      "24 = 2³ · 3, a 36 = 2² · 3². NZS je 2³ · 3² = 72 min.",
      "9 h + 72 min = 10 h 12 min.",
      "Zajednički polasci su u 9:00, 10:12, 11:24 i 12:36.",
      "Sljedeći je u 13:48 i izlazi iz intervala. Zato brojimo četiri zajednička polaska."
    ],
    "hint": "Traži najmanji zajednički sadržalac intervala, a zatim ponavljaj taj interval od 9 h."
  },
  {
    "id": "project-6-kompleti",
    "topicId": "projects",
    "grade": 6,
    "title": "Najveći broj jednakih kompleta",
    "prompt": "Na raspolaganju su 84 crvene, 126 plavih i 210 bijelih perli. Treba napraviti najveći mogući broj potpuno jednakih kompleta, upotrijebiti sve perle i zadržati isti broj perli svake boje u svakom kompletu. Koliko kompleta možeš napraviti i koliko perli svake boje ide u jedan?",
    "fields": [
      {
        "key": "kompleti",
        "label": "Broj kompleta",
        "answer": "42",
        "type": "number"
      },
      {
        "key": "crvene",
        "label": "Crvene perle po kompletu",
        "answer": "2",
        "type": "number"
      },
      {
        "key": "plave",
        "label": "Plave perle po kompletu",
        "answer": "3",
        "type": "number"
      },
      {
        "key": "bijele",
        "label": "Bijele perle po kompletu",
        "answer": "5",
        "type": "number"
      }
    ],
    "steps": [
      "Broj kompleta mora dijeliti 84, 126 i 210 bez ostatka. Tražimo njihov NZD.",
      "84 = 2² · 3 · 7; 126 = 2 · 3² · 7; 210 = 2 · 3 · 5 · 7.",
      "Zajednički prosti faktori daju NZD = 2 · 3 · 7 = 42.",
      "Svaki komplet ima 84 : 42 = 2 crvene, 126 : 42 = 3 plave i 210 : 42 = 5 bijelih perli."
    ],
    "hint": "NZD određuje najveći broj jednakih kompleta bez ostatka. Zatim svaku količinu podijeli tim brojem."
  },
  {
    "id": "project-6-napitak",
    "topicId": "projects",
    "grade": 6,
    "title": "Napitak i potpuno pune čaše",
    "prompt": "Pomiješano je 3/4 L mlijeka i 2/3 L vode. Čaša prima 1/6 L. Odredi ukupnu količinu napitka, broj potpuno punih čaša i količinu koja ostaje. Oba odgovora u litrima zapiši kao potpuno skraćen razlomak a/b, bez mješovitog broja.",
    "fields": [
      {
        "key": "ukupno",
        "label": "Ukupno napitka, L; skraćen a/b",
        "answer": "17/12",
        "type": "text"
      },
      {
        "key": "case",
        "label": "Broj potpuno punih čaša",
        "answer": "8",
        "type": "number"
      },
      {
        "key": "ostatak",
        "label": "Ostatak, L; skraćen a/b",
        "answer": "1/12",
        "type": "text"
      }
    ],
    "steps": [
      "3/4 + 2/3 = 9/12 + 8/12 = 17/12 L.",
      "Broj čaša prema količini: (17/12) : (1/6) = (17/12) · 6 = 17/2 = 8 1/2.",
      "Možemo napuniti 8 čaša. One sadrže 8 · 1/6 = 8/6 = 16/12 L.",
      "Ostaje 17/12 − 16/12 = 1/12 L, što je manje od 1/6 L."
    ],
    "hint": "Saberi razlomke uz zajednički nazivnik. Količnik količine i zapremine čaše nije uvijek cijeli broj."
  },
  {
    "id": "project-6-planinarenje",
    "topicId": "projects",
    "grade": 6,
    "title": "Dio preostalog puta",
    "prompt": "Planinarska staza je duga 45 km. Prvog dana grupa prelazi 2/5 cijele staze. Drugog dana prelazi 1/3 puta koji je ostao nakon prvog dana. Odredi dužinu prvog i drugog dnevnog puta te koliko kilometara ostaje za treći dan.",
    "fields": [
      {
        "key": "prvi",
        "label": "Prvi dan, km",
        "answer": "18",
        "type": "number"
      },
      {
        "key": "drugi",
        "label": "Drugi dan, km",
        "answer": "9",
        "type": "number"
      },
      {
        "key": "treci",
        "label": "Preostali put, km",
        "answer": "18",
        "type": "number"
      }
    ],
    "steps": [
      "Prvi dan: 45 · 2/5 = 18 km.",
      "Poslije prvog dana ostaje 45 − 18 = 27 km.",
      "Drugi dan je trećina preostalog puta: 27 · 1/3 = 9 km.",
      "Ostaje 27 − 9 = 18 km. Provjera: 18 + 9 + 18 = 45 km."
    ],
    "hint": "Trećina drugog dana odnosi se na preostali put, a ne na početnih 45 km."
  },
  {
    "id": "project-6-glazura",
    "topicId": "projects",
    "grade": 6,
    "title": "Dvojni razlomak u pripremi glazure",
    "prompt": "Za glazuru se spaja 3/4 kg jedne i 1/6 kg druge smjese. Za jedan kolač treba 5/8 kg glazure. Bez otpada odredi ukupnu masu, količinu izraženu u broju porcija za jedan kolač, broj cijelih kolača koji se mogu premazati i preostalu masu. Masu i količnik zapiši kao potpuno skraćen a/b.",
    "fields": [
      {
        "key": "masa",
        "label": "Ukupna masa, kg; a/b",
        "answer": "11/12",
        "type": "text"
      },
      {
        "key": "kolicnik",
        "label": "Količnik mase i jedne porcije; a/b",
        "answer": "22/15",
        "type": "text"
      },
      {
        "key": "kolaci",
        "label": "Broj potpuno premazanih kolača",
        "answer": "1",
        "type": "number"
      },
      {
        "key": "ostatak",
        "label": "Preostala masa, kg; a/b",
        "answer": "7/24",
        "type": "text"
      }
    ],
    "steps": [
      "Ukupna masa je 3/4 + 1/6 = 9/12 + 2/12 = 11/12 kg.",
      "Dvojni razlomak znači dijeljenje: (11/12)/(5/8) = 11/12 · 8/5 = 22/15.",
      "22/15 je veće od 1, a manje od 2. Može se potpuno premazati jedan kolač.",
      "Preostaje 11/12 − 5/8 = 22/24 − 15/24 = 7/24 kg."
    ],
    "hint": "Glavna razlomačka crta dijeli cjelokupnu raspoloživu masu masom potrebnom za jedan kolač."
  },
  {
    "id": "project-6-kupovina",
    "topicId": "projects",
    "grade": 6,
    "title": "Decimalne cijene i kusur",
    "prompt": "Kupljeno je 2,5 kg jabuka po 3,20 KM/kg i 1,75 kg trešanja po 4,80 KM/kg. Plaćeno je novčanicom od 20 KM. Izračunaj posebno cijenu jabuka i trešanja, ukupan račun i kusur.",
    "fields": [
      {
        "key": "jabuke",
        "label": "Jabuke, KM",
        "answer": "8",
        "type": "number"
      },
      {
        "key": "tresnje",
        "label": "Trešnje, KM",
        "answer": "8.4",
        "type": "number",
        "tolerance": 1e-08
      },
      {
        "key": "racun",
        "label": "Ukupan račun, KM",
        "answer": "16.4",
        "type": "number",
        "tolerance": 1e-08
      },
      {
        "key": "kusur",
        "label": "Kusur, KM",
        "answer": "3.6",
        "type": "number",
        "tolerance": 1e-08
      }
    ],
    "steps": [
      "Jabuke koštaju 2,5 · 3,20 = 8,00 KM.",
      "Trešnje koštaju 1,75 · 4,80 = 8,40 KM.",
      "Račun je 8,00 + 8,40 = 16,40 KM.",
      "Kusur je 20,00 − 16,40 = 3,60 KM."
    ],
    "hint": "Cijenu po kilogramu pomnoži masom za svaku vrstu voća. Decimalne zareze poravnaj tek pri sabiranju."
  },
  {
    "id": "project-6-trougaoni-vrt",
    "topicId": "projects",
    "grade": 6,
    "title": "Trougaoni vrt i otvor u ogradi",
    "prompt": "Vrt je jednakokraki trougao sa osnovicom 10 m i kracima po 13 m. Visina na osnovicu je 12 m. Ostavlja se prolaz od 2 m bez ograde. Travnjak košta 8 KM po m². Izračunaj površinu, potrebnu dužinu ograde i cijenu travnjaka.",
    "fields": [
      {
        "key": "povrsina",
        "label": "Površina, m²",
        "answer": "60",
        "type": "number"
      },
      {
        "key": "ograda",
        "label": "Dužina ograde, m",
        "answer": "34",
        "type": "number"
      },
      {
        "key": "travnjak",
        "label": "Cijena travnjaka, KM",
        "answer": "480",
        "type": "number"
      }
    ],
    "steps": [
      "Površina je 10 · 12 : 2 = 60 m². Visina i osnovica moraju biti odgovarajući par.",
      "Obim je 10 + 13 + 13 = 36 m.",
      "Zbog prolaza treba 36 − 2 = 34 m ograde.",
      "Travnjak košta 60 · 8 = 480 KM."
    ],
    "hint": "Za površinu koristi visinu, za obim krakove. Ograda i travnjak ne računaju se iz iste veličine."
  },
  {
    "id": "project-6-oznake",
    "topicId": "projects",
    "grade": 6,
    "title": "Oznake djeljive sa 15 i 25",
    "prompt": "Za oznake paketa dozvoljeni su cijeli brojevi od 200 do 400, uključujući oba kraja. Oznaka mora biti djeljiva i sa 15 i sa 25, ali ne smije biti djeljiva sa 9. Napiši sve dozvoljene oznake rastućim redom, zatim najmanju oznaku i njihov broj. Listu unesi kao brojeve odvojene razmacima.",
    "fields": [
      {
        "key": "oznake",
        "label": "Sve dozvoljene oznake",
        "answer": "300 375",
        "type": "list",
        "ordered": true
      },
      {
        "key": "najmanja",
        "label": "Najmanja oznaka",
        "answer": "300",
        "type": "number"
      },
      {
        "key": "broj",
        "label": "Broj dozvoljenih oznaka",
        "answer": "2",
        "type": "number"
      }
    ],
    "steps": [
      "15 = 3 · 5 i 25 = 5², pa je NZS(15,25) = 3 · 5² = 75.",
      "Sadržaoci 75 u intervalu su 225, 300 i 375.",
      "225 ima zbir cifara 9 i djeljivo je sa 9; izostavljamo ga.",
      "300 ima zbir cifara 3, a 375 zbir 15. Nijedan nije djeljiv sa 9.",
      "Dozvoljene oznake su 300 i 375. Najmanja je 300, a ukupno su dvije."
    ],
    "hint": "Najprije kombinuj djeljivost sa 15 i 25 pomoću NZS, pa provjeri zabranu djeljivosti sa 9."
  },
  {
    "id": "project-7-dvostruka-promjena",
    "topicId": "projects",
    "grade": 7,
    "title": "Poskupljenje pa popust",
    "prompt": "Jakna je prvobitno koštala 480 KM. Cijena je povećana za 12,5%, a zatim je na tu novu cijenu dat popust od 20%. Izračunaj cijenu nakon poskupljenja, cijenu nakon popusta i za koliko procenata je konačna cijena niža od prvobitne.",
    "fields": [
      {
        "key": "poskupljenje",
        "label": "Cijena nakon poskupljenja, KM",
        "answer": "540",
        "type": "number"
      },
      {
        "key": "popust",
        "label": "Konačna cijena, KM",
        "answer": "432",
        "type": "number"
      },
      {
        "key": "procenat",
        "label": "Konačno sniženje prema prvobitnoj cijeni, %",
        "answer": "10",
        "type": "number"
      }
    ],
    "steps": [
      "Poskupljenje je 480 · 12,5/100 = 60 KM. Nova cijena je 480 + 60 = 540 KM.",
      "Popust se računa od 540 KM: 540 · 20/100 = 108 KM.",
      "Konačna cijena je 540 − 108 = 432 KM.",
      "U odnosu na početnih 480 KM cijena je niža za 48 KM. Relativno sniženje je 48/480 · 100% = 10%.",
      "Procenti imaju različite osnovice; ne oduzimamo samo 20% − 12,5%."
    ],
    "hint": "Popust koristi već povećanu cijenu. Konačnu razliku poredi s prvobitnih 480 KM."
  },
  {
    "id": "project-7-odjeljenje",
    "topicId": "projects",
    "grade": 7,
    "title": "Promjena udjela u odjeljenju",
    "prompt": "Odjeljenje ima 30 učenika, od toga 18 djevojčica. Pridružuje mu se još 6 dječaka. Nakon toga na jednom času izostane 9 učenika. Izračunaj procenat djevojčica prije proširenja, procenat djevojčica nakon proširenja i procenat odsutnih među svim učenicima proširenog odjeljenja.",
    "fields": [
      {
        "key": "prije",
        "label": "Djevojčice prije proširenja, %",
        "answer": "60",
        "type": "number"
      },
      {
        "key": "poslije",
        "label": "Djevojčice nakon proširenja, %",
        "answer": "50",
        "type": "number"
      },
      {
        "key": "odsutni",
        "label": "Odsutni u proširenom odjeljenju, %",
        "answer": "25",
        "type": "number"
      }
    ],
    "steps": [
      "Prvobitni udio djevojčica je 18/30 · 100% = 60%.",
      "Nakon šest novih dječaka odjeljenje ima 30 + 6 = 36 učenika; djevojčica i dalje ima 18.",
      "Novi udio djevojčica je 18/36 · 100% = 50%.",
      "Devet odsutnih od 36 učenika daje 9/36 · 100% = 25%. Udio ne računamo od prvobitnih 30."
    ],
    "hint": "Prije svakog procenta provjeri koja je cjelina. Broj djevojčica se pri dolasku dječaka ne mijenja."
  },
  {
    "id": "project-7-radnici",
    "topicId": "projects",
    "grade": 7,
    "title": "Isti posao i drugačije radno vrijeme",
    "prompt": "Šest radnika završi posao za 4 dana, radeći po 8 sati dnevno. Svi radnici imaju jednak i nepromjenjiv učinak po satu. Koliko dana treba osmorici radnika koji rade po 6 sati dnevno? U novoj ekipi svaki radnik dobiva 55 KM za radni dan. Izračunaj ukupan broj radnik-sati za posao, potrebno trajanje nove ekipe i ukupnu isplatu nove ekipe.",
    "fields": [
      {
        "key": "radniksati",
        "label": "Potreban broj radnik-sati",
        "answer": "192",
        "type": "number"
      },
      {
        "key": "dani",
        "label": "Broj dana nove ekipe",
        "answer": "4",
        "type": "number"
      },
      {
        "key": "isplata",
        "label": "Ukupna isplata, KM",
        "answer": "1760",
        "type": "number"
      }
    ],
    "steps": [
      "Ukupan posao mjerimo radnik-satima: 6 · 4 · 8 = 192.",
      "Nova ekipa dnevno ostvaruje 8 · 6 = 48 radnik-sati.",
      "Trajanje je 192 : 48 = 4 dana.",
      "Isplata za jedan dan je 8 · 55 = 440 KM; za 4 dana 440 · 4 = 1 760 KM.",
      "Vrijeme zavisi i od broja radnika i od broja dnevnih sati, a ne samo od veličine ekipe."
    ],
    "hint": "Ukupan broj radnik-sati je konstantan. Najprije pronađi dnevni učinak nove ekipe."
  },
  {
    "id": "project-7-raspodjela",
    "topicId": "projects",
    "grade": 7,
    "title": "Raspodjela i novi odnos",
    "prompt": "Za tri učenička projekta raspodjeljuje se 360 KM u odnosu 5:7:8. Izračunaj početni iznos svakog projekta. Zatim se 18 KM prenosi iz trećeg projekta u prvi. Napiši novi odnos tri iznosa najmanjim mogućim pozitivnim cijelim brojevima, odvojenim razmacima, u istom redoslijedu.",
    "fields": [
      {
        "key": "prvi",
        "label": "Početni iznos prvog projekta, KM",
        "answer": "90",
        "type": "number"
      },
      {
        "key": "drugi",
        "label": "Početni iznos drugog projekta, KM",
        "answer": "126",
        "type": "number"
      },
      {
        "key": "treci",
        "label": "Početni iznos trećeg projekta, KM",
        "answer": "144",
        "type": "number"
      },
      {
        "key": "odnos",
        "label": "Novi skraćeni odnos",
        "answer": "6 7 7",
        "type": "list",
        "ordered": true
      }
    ],
    "steps": [
      "Odnos ima ukupno 5 + 7 + 8 = 20 jednakih dijelova. Jedan dio vrijedi 360 : 20 = 18 KM.",
      "Početni iznosi su 5 · 18 = 90 KM, 7 · 18 = 126 KM i 8 · 18 = 144 KM.",
      "Nakon prenosa iznosi su 90 + 18 = 108 KM, 126 KM i 144 − 18 = 126 KM.",
      "Odnos 108:126:126 dijelimo njihovim NZD 18 i dobijamo 6:7:7. Zbir sredstava ostaje 360 KM."
    ],
    "hint": "Odnos prvo pretvori u jednake dijelove. Prenos povećava jedan i smanjuje drugi iznos; ukupan zbir ostaje isti."
  },
  {
    "id": "project-7-taksi",
    "topicId": "projects",
    "grade": 7,
    "title": "Dvije taksi tarife",
    "prompt": "Taksi A naplaćuje 4 KM početka i 1,80 KM po kilometru. Taksi B naplaćuje 7 KM početka i 1,20 KM po kilometru. Za potrebe zadatka nema drugih naknada. Za koju dužinu puta su računi jednaki, koliki je tada račun i za koliko je B jeftiniji od A na putu od 20 km?",
    "fields": [
      {
        "key": "put",
        "label": "Dužina za jednake račune, km",
        "answer": "5",
        "type": "number"
      },
      {
        "key": "racun",
        "label": "Jednak račun, KM",
        "answer": "13",
        "type": "number"
      },
      {
        "key": "razlika",
        "label": "Ušteda s B na 20 km, KM",
        "answer": "9",
        "type": "number"
      }
    ],
    "steps": [
      "Za put x km računi su A = 4 + 1,80x i B = 7 + 1,20x.",
      "Jednakost daje 4 + 1,80x = 7 + 1,20x, pa 0,60x = 3 i x = 5 km.",
      "Za 5 km oba računa su 13 KM: 4 + 9 = 7 + 6.",
      "Za 20 km A košta 4 + 36 = 40 KM, a B košta 7 + 24 = 31 KM.",
      "B je jeftiniji za 40 − 31 = 9 KM."
    ],
    "hint": "Jednačinu napravi od ukupnih računa, uključujući početnu naknadu. Izračunaj obje tarife prije poređenja."
  },
  {
    "id": "project-7-transverzala",
    "topicId": "projects",
    "grade": 7,
    "title": "Uglovi uz paralelne prave",
    "prompt": "Dvije paralelne prave siječe transverzala. Unutrašnji uglovi na istoj strani transverzale su α = (3x + 10)° i β = (5x + 10)°. Odredi x, oba ugla i komplement ugla α.",
    "fields": [
      {
        "key": "x",
        "label": "Vrijednost x",
        "answer": "20",
        "type": "number"
      },
      {
        "key": "alfa",
        "label": "Ugao α, °",
        "answer": "70",
        "type": "number"
      },
      {
        "key": "beta",
        "label": "Ugao β, °",
        "answer": "110",
        "type": "number"
      },
      {
        "key": "komplement",
        "label": "Komplement ugla α, °",
        "answer": "20",
        "type": "number"
      }
    ],
    "steps": [
      "Unutrašnji uglovi na istoj strani transverzale uz paralelne prave imaju zbir 180°.",
      "(3x + 10) + (5x + 10) = 180 daje 8x + 20 = 180.",
      "8x = 160, pa je x = 20.",
      "α = 3 · 20 + 10 = 70°, a β = 5 · 20 + 10 = 110°. Provjera: 70° + 110° = 180°.",
      "Komplement ugla α je 90° − 70° = 20°. Suplement od 110° nije njegov komplement."
    ],
    "hint": "Prvo odredi geometrijski odnos uglova. Komplement ima zbir 90°, a suplement 180°."
  },
  {
    "id": "project-7-statistika",
    "topicId": "projects",
    "grade": 7,
    "title": "Mjerenja i novo mjerenje",
    "prompt": "Izmjerene su vrijednosti 6, 8, 6, 9, 11, 6 i 10. Odredi aritmetičku sredinu, medijanu i mod. Zatim se dodaje novo mjerenje 12. Kolika je aritmetička sredina svih osam mjerenja?",
    "fields": [
      {
        "key": "sredina",
        "label": "Sredina prvih sedam mjerenja",
        "answer": "8",
        "type": "number"
      },
      {
        "key": "medijana",
        "label": "Medijana prvih sedam mjerenja",
        "answer": "8",
        "type": "number"
      },
      {
        "key": "mod",
        "label": "Mod prvih sedam mjerenja",
        "answer": "6",
        "type": "number"
      },
      {
        "key": "nova",
        "label": "Sredina nakon dodavanja 12",
        "answer": "8.5",
        "type": "number",
        "tolerance": 1e-08
      }
    ],
    "steps": [
      "Zbir prvih sedam mjerenja je 6 + 8 + 6 + 9 + 11 + 6 + 10 = 56. Sredina je 56 : 7 = 8.",
      "Uređeni niz je 6, 6, 6, 8, 9, 10, 11. Srednji, četvrti podatak je 8, pa je medijana 8.",
      "Najčešća vrijednost je 6, koja se pojavljuje tri puta; mod je 6.",
      "Poslije dodavanja 12 zbir je 68, a podataka je 8. Nova sredina je 68 : 8 = 8,5."
    ],
    "hint": "Za medijanu prvo poredaj podatke. Pri dodavanju podatka mijenjaju se i zbir i broj mjerenja."
  },
  {
    "id": "project-7-kuglice",
    "topicId": "projects",
    "grade": 7,
    "title": "Vjerovatnoća poslije dopunjavanja",
    "prompt": "U vrećici su 4 crvene, 3 plave i 3 zelene jednake kuglice. Svaka kuglica ima jednaku mogućnost nasumičnog izbora. Odredi vjerovatnoću crvene. Dodaje se još 5 crvenih; odredi novu vjerovatnoću crvene. Koliko zatim treba dodati plavih kuglica da vjerovatnoća crvene bude tačno 1/2? Obje vjerovatnoće zapiši kao potpuno skraćen a/b.",
    "fields": [
      {
        "key": "prije",
        "label": "Početna vjerovatnoća crvene; a/b",
        "answer": "2/5",
        "type": "text"
      },
      {
        "key": "poslije",
        "label": "Vjerovatnoća nakon pet crvenih; a/b",
        "answer": "3/5",
        "type": "text"
      },
      {
        "key": "plave",
        "label": "Dodatne plave kuglice",
        "answer": "3",
        "type": "number"
      }
    ],
    "steps": [
      "U početku ima 10 kuglica, od toga 4 crvene. P(crvena) = 4/10 = 2/5.",
      "Poslije pet novih crvenih ima 15 kuglica i 9 crvenih. P(crvena) = 9/15 = 3/5.",
      "Pri dodavanju plavih broj crvenih ostaje 9. Za udio 1/2 ukupan broj treba biti 18.",
      "Zato se dodaju 18 − 15 = 3 plave kuglice. Provjera: 9/(15 + 3) = 1/2."
    ],
    "hint": "Vjerovatnoća je povoljan broj kroz ukupan broj kuglica. Dodavanje kuglica mijenja nazivnik, a često i brojnik."
  },
  {
    "id": "project-8-dijagonalni-put",
    "topicId": "projects",
    "grade": 8,
    "title": "Pravolinijski i rubni put",
    "prompt": "Prazno pravougaono dvorište ima dimenzije 9 m i 12 m. Ide se od jednog vrha do naspramnog vrha. Prva putanja prati dvije susjedne stranice, a druga ide ravno po dijagonali. Odredi dužinu dijagonale, dužinu putanje uz rub i uštedu puta pri ravnom prolazu.",
    "fields": [
      {
        "key": "dijagonala",
        "label": "Dijagonala, m",
        "answer": "15",
        "type": "number"
      },
      {
        "key": "rub",
        "label": "Put uz dvije stranice, m",
        "answer": "21",
        "type": "number"
      },
      {
        "key": "usteda",
        "label": "Kraći put za, m",
        "answer": "6",
        "type": "number"
      }
    ],
    "steps": [
      "Stranice i dijagonala čine pravougli trougao: d² = 9² + 12² = 81 + 144 = 225.",
      "Dijagonala je d = √225 = 15 m.",
      "Put uz rub je 9 + 12 = 21 m.",
      "Pravolinijski prolaz je kraći za 21 − 15 = 6 m. Oba puta spajaju iste naspramne vrhove."
    ],
    "hint": "Dijagonala je hipotenuza. Upoređuj dužine između istih krajnjih tačaka."
  },
  {
    "id": "project-8-ukrute",
    "topicId": "projects",
    "grade": 8,
    "title": "Dijagonalne ukrute i rezerva",
    "prompt": "Pravougaoni okvir širok je 5 m i visok 12 m. Za jednu dijagonalnu ukrutu treba komad dužine dijagonale. Za nabavku se za svaki komad dodaje 20% te dužine kao rezerva za obradu. Odredi dužinu dijagonale, nabavnu dužinu za jedan komad i ukupnu nabavnu dužinu za četiri takva komada.",
    "fields": [
      {
        "key": "dijagonala",
        "label": "Dužina dijagonale, m",
        "answer": "13",
        "type": "number"
      },
      {
        "key": "komad",
        "label": "Nabavna dužina jednog komada, m",
        "answer": "15.6",
        "type": "number",
        "tolerance": 1e-08
      },
      {
        "key": "ukupno",
        "label": "Ukupno za četiri komada, m",
        "answer": "62.4",
        "type": "number",
        "tolerance": 1e-08
      }
    ],
    "steps": [
      "Dijagonala zadovoljava d² = 5² + 12² = 25 + 144 = 169, pa je d = 13 m.",
      "Rezerva je 20% od 13 m, odnosno 2,6 m.",
      "Nabavna dužina jednog komada je 13 + 2,6 = 15,6 m.",
      "Za četiri komada treba 4 · 15,6 = 62,4 m. Rezerva se dodaje za nabavku, ne mijenja dijagonalu okvira."
    ],
    "hint": "Najprije izračunaj tačnu dijagonalu, tek zatim dodaj procenat rezerve."
  },
  {
    "id": "project-8-prosirenje-bazena",
    "topicId": "projects",
    "grade": 8,
    "title": "Proširenje kvadratne površine",
    "prompt": "Kvadratna površina ima stranicu x metara. Nakon proširenja postaje pravougaonik sa stranicama x + 4 i x + 2 metra. Nova površina je za 68 m² veća od stare. Odredi x, površinu novog pravougaonika i njegov obim.",
    "fields": [
      {
        "key": "x",
        "label": "Prvobitna stranica x, m",
        "answer": "10",
        "type": "number"
      },
      {
        "key": "povrsina",
        "label": "Nova površina, m²",
        "answer": "168",
        "type": "number"
      },
      {
        "key": "obim",
        "label": "Novi obim, m",
        "answer": "52",
        "type": "number"
      }
    ],
    "steps": [
      "Stara površina je x², a nova (x + 4)(x + 2) = x² + 6x + 8.",
      "Razlika je 6x + 8. Jednačina glasi 6x + 8 = 68.",
      "6x = 60, pa je x = 10 m. Nove stranice su 14 m i 12 m.",
      "Nova površina je 14 · 12 = 168 m², a obim 2 · (14 + 12) = 52 m.",
      "Provjera razlike: 168 − 10² = 68 m²."
    ],
    "hint": "Razvij proizvod i oduzmi staru površinu. Kvadratni članovi će se poništiti, pa ostaje linearna jednačina."
  },
  {
    "id": "project-8-memorija",
    "topicId": "projects",
    "grade": 8,
    "title": "Stepeni dvojke i količina podataka",
    "prompt": "Memorija ima 2¹² lokacija, a svaka lokacija sadrži 16 bajtova. Za ovaj zadatak 1 KiB znači tačno 1 024 bajta. Podaci se prenose stalnom brzinom 4 096 bajtova u sekundi, bez dodatnog vremena. Odredi broj lokacija, ukupnu količinu u KiB i vrijeme prenosa cijele memorije.",
    "fields": [
      {
        "key": "lokacije",
        "label": "Broj lokacija",
        "answer": "4096",
        "type": "number"
      },
      {
        "key": "kib",
        "label": "Ukupno, KiB",
        "answer": "64",
        "type": "number"
      },
      {
        "key": "vrijeme",
        "label": "Vrijeme prenosa, s",
        "answer": "16",
        "type": "number"
      }
    ],
    "steps": [
      "2¹² = 4 096 lokacija.",
      "16 = 2⁴, pa ukupno ima 2¹² · 2⁴ = 2¹⁶ = 65 536 bajtova.",
      "Pošto je 1 KiB = 2¹⁰ bajtova, količina je 2¹⁶ : 2¹⁰ = 2⁶ = 64 KiB.",
      "Vrijeme prenosa je 65 536 : 4 096 = 16 s."
    ],
    "hint": "Pri množenju stepena iste baze saberi eksponente, a pri dijeljenju ih oduzmi."
  },
  {
    "id": "project-8-slicni-trouglovi",
    "topicId": "projects",
    "grade": 8,
    "title": "Uvećanje pravouglog trougla",
    "prompt": "Pravougli trougao ima katete 6 cm i 8 cm. Uvećava se tako da kateta koja odgovara kateti od 6 cm postane 9 cm. Uvećanje čuva oblik. Odredi drugu katetu novog trougla, njegovu hipotenuzu i njegovu površinu.",
    "fields": [
      {
        "key": "kateta",
        "label": "Druga kateta, cm",
        "answer": "12",
        "type": "number"
      },
      {
        "key": "hipotenuza",
        "label": "Hipotenuza, cm",
        "answer": "15",
        "type": "number"
      },
      {
        "key": "povrsina",
        "label": "Površina novog trougla, cm²",
        "answer": "54",
        "type": "number"
      }
    ],
    "steps": [
      "Faktor sličnosti je k = 9/6 = 1,5.",
      "Druga kateta postaje 8 · 1,5 = 12 cm.",
      "Stara hipotenuza je √(6² + 8²) = 10 cm. Nova je 10 · 1,5 = 15 cm.",
      "Nova površina je 9 · 12 : 2 = 54 cm².",
      "Provjera: stara površina 24 cm² množi se sa k² = 2,25 i daje 54 cm²."
    ],
    "hint": "Sve odgovarajuće dužine množe se istim faktorom, dok se površina množi njegovim kvadratom."
  },
  {
    "id": "project-8-vektorski-put",
    "topicId": "projects",
    "grade": 8,
    "title": "Dva vektorska pomjeranja",
    "prompt": "Robot počinje u A = (−3, 2), zatim se pomjeri vektorom v = (5, −4), pa vektorom u = (−1, 5). Odredi konačne koordinate, zbirni vektor i pravolinijsku udaljenost početka od završetka. Zbirni vektor unesi kao dvije komponente odvojene razmakom. Udaljenost zaokruži na tri decimale.",
    "fields": [
      {
        "key": "x",
        "label": "Konačna x-koordinata",
        "answer": "1",
        "type": "number"
      },
      {
        "key": "y",
        "label": "Konačna y-koordinata",
        "answer": "3",
        "type": "number"
      },
      {
        "key": "vektor",
        "label": "Zbirni vektor: x y",
        "answer": "4 1",
        "type": "list",
        "ordered": true
      },
      {
        "key": "udaljenost",
        "label": "Pravolinijska udaljenost",
        "answer": "4.123",
        "type": "number",
        "tolerance": 0.0005
      }
    ],
    "steps": [
      "Nakon prvog pomjeranja robot je u (−3 + 5, 2 − 4) = (2, −2).",
      "Nakon drugog je u (2 − 1, −2 + 5) = (1, 3).",
      "Zbirni vektor je (5, −4) + (−1, 5) = (4, 1), što odgovara razlici (1 − (−3), 3 − 2).",
      "Udaljenost početka i završetka je √(4² + 1²) = √17 ≈ 4,123. Ovo nije zbir dužina dviju dionica."
    ],
    "hint": "Koordinate sabiraj po komponentama. Za traženu udaljenost koristi ukupno pomjeranje i Pitagorinu teoremu."
  },
  {
    "id": "project-8-kopirnica",
    "topicId": "projects",
    "grade": 8,
    "title": "Nejednačina i cijeli broj plakata",
    "prompt": "Kopirnica naplaćuje pripremu 14 KM i dodatno 0,75 KM za svaki plakat. Na raspolaganju je najviše 60 KM. Odredi najveći cijeli broj plakata koji se može naručiti, cijenu te narudžbe i preostali novac.",
    "fields": [
      {
        "key": "plakati",
        "label": "Najveći broj plakata",
        "answer": "61",
        "type": "number"
      },
      {
        "key": "cijena",
        "label": "Cijena narudžbe, KM",
        "answer": "59.75",
        "type": "number",
        "tolerance": 1e-08
      },
      {
        "key": "ostatak",
        "label": "Preostali novac, KM",
        "answer": "0.25",
        "type": "number",
        "tolerance": 1e-08
      }
    ],
    "steps": [
      "Za n plakata cijena je 14 + 0,75n. Budžet daje nejednačinu 14 + 0,75n ≤ 60.",
      "0,75n ≤ 46, pa n ≤ 46/0,75 = 61 1/3.",
      "Broj plakata je nenegativan cijeli broj; najveći dozvoljeni je 61.",
      "Cijena je 14 + 0,75 · 61 = 59,75 KM; ostaje 60 − 59,75 = 0,25 KM.",
      "Provjera maksimalnosti: 62 plakata bi koštala 60,50 KM i prešla budžet."
    ],
    "hint": "Rješenje nejednačine nije dovoljno: broj plakata mora biti cijeli. Provjeri i prvi veći cijeli broj."
  },
  {
    "id": "project-8-pravougaonik-u-trouglu",
    "topicId": "projects",
    "grade": 8,
    "title": "Pravougaonik u jednakokrakom trouglu",
    "prompt": "Jednakokraki trougao ima osnovicu 10 cm i krake po 13 cm. U njega je upisan pravougaonik: donja strana leži na osnovici trougla, a gornja je cijela presječna duž paralelna osnovici, na visini 6 cm iznad nje. Odredi visinu trougla, širinu pravougaonika i njegovu površinu.",
    "fields": [
      {
        "key": "visina",
        "label": "Visina trougla, cm",
        "answer": "12",
        "type": "number"
      },
      {
        "key": "sirina",
        "label": "Širina pravougaonika, cm",
        "answer": "5",
        "type": "number"
      },
      {
        "key": "povrsina",
        "label": "Površina pravougaonika, cm²",
        "answer": "30",
        "type": "number"
      }
    ],
    "steps": [
      "Visina jednakokrakog trougla dijeli osnovicu na dva dijela od 5 cm.",
      "Po Pitagorinoj teoremi h² + 5² = 13², pa h = √144 = 12 cm.",
      "Iznad gornje strane pravougaonika ostaje sličan trougao visine 12 − 6 = 6 cm, sa faktorom sličnosti 6/12 = 1/2.",
      "Presječna duž, ujedno širina pravougaonika, iznosi 10 · 1/2 = 5 cm.",
      "Visina pravougaonika je 6 cm, pa je površina 5 · 6 = 30 cm²."
    ],
    "hint": "Prvo pronađi visinu pomoću polovine osnovice. Gornji mali trougao sličan je cijelom trouglu."
  },
  {
    "id": "project-9-ulaznice",
    "topicId": "projects",
    "grade": 9,
    "title": "Dvije vrste ulaznica",
    "prompt": "Za predstavu je prodano 85 ulaznica. Ulaznica za odrasle košta 12 KM, a dječija 7 KM. Prihod je 770 KM. Nema drugih vrsta ulaznica ni popusta. Odredi broj ulaznica za odrasle, broj dječijih i prihod od odraslih.",
    "fields": [
      {
        "key": "odrasli",
        "label": "Ulaznice za odrasle",
        "answer": "35",
        "type": "number"
      },
      {
        "key": "djeca",
        "label": "Dječije ulaznice",
        "answer": "50",
        "type": "number"
      },
      {
        "key": "prihod",
        "label": "Prihod od odraslih, KM",
        "answer": "420",
        "type": "number"
      }
    ],
    "steps": [
      "Neka je a broj odraslih, a d broj dječijih ulaznica. Sistem je a + d = 85 i 12a + 7d = 770.",
      "Prvu jednačinu pomnoži sa 7: 7a + 7d = 595.",
      "Oduzimanjem od druge dobijamo 5a = 175, pa je a = 35.",
      "d = 85 − 35 = 50. Prihod od odraslih je 12 · 35 = 420 KM.",
      "Provjera ukupnog prihoda: 420 + 7 · 50 = 770 KM."
    ],
    "hint": "Jedna jednačina broji ulaznice, a druga novac. Nepoznate moraju zadovoljiti obje."
  },
  {
    "id": "project-9-energetske-tarife",
    "topicId": "projects",
    "grade": 9,
    "title": "Presjek dvije linearne tarife",
    "prompt": "Model računa A je A(x) = 6 + 0,12x KM, a model B je B(x) = 2 + 0,16x KM, gdje je x nenegativna potrošnja u kWh. Drugih naknada nema. Odredi potrošnju pri kojoj su računi jednaki, tadašnji račun i koliko je B skuplji od A pri potrošnji 150 kWh.",
    "fields": [
      {
        "key": "potrosnja",
        "label": "Potrošnja za jednake račune, kWh",
        "answer": "100",
        "type": "number"
      },
      {
        "key": "racun",
        "label": "Jednak račun, KM",
        "answer": "18",
        "type": "number"
      },
      {
        "key": "razlika",
        "label": "B minus A za 150 kWh, KM",
        "answer": "2",
        "type": "number"
      }
    ],
    "steps": [
      "Jednakost računa: 6 + 0,12x = 2 + 0,16x.",
      "4 = 0,04x, pa je x = 100 kWh.",
      "A(100) = 6 + 12 = 18 KM i B(100) = 2 + 16 = 18 KM.",
      "A(150) = 6 + 18 = 24 KM, a B(150) = 2 + 24 = 26 KM.",
      "Razlika B − A je 26 − 24 = 2 KM. Presjek grafova je tačka (100, 18)."
    ],
    "hint": "Izjednači funkcije da pronađeš presjek. Pri poređenju za 150 kWh uvrsti istu potrošnju u oba modela."
  },
  {
    "id": "project-9-rezervoari",
    "topicId": "projects",
    "grade": 9,
    "title": "Pad, rast i presjek grafova",
    "prompt": "U trenutku t = 0 prvi rezervoar ima 240 L i prazni se stalno 18 L/min. Drugi ima 60 L i puni se stalno 12 L/min. Posmatramo vrijeme od početka do pražnjenja prvog rezervoara, bez ograničenja zapremine drugog. Prvi model napišemo V₁(t) = kt + n. Odredi k i n, vrijeme jednakih količina, tu količinu i vrijeme pražnjenja prvog. Posljednje vrijeme zapiši kao potpuno skraćen a/b minuta.",
    "fields": [
      {
        "key": "k",
        "label": "Koeficijent k, L/min",
        "answer": "-18",
        "type": "number"
      },
      {
        "key": "n",
        "label": "Početna količina n, L",
        "answer": "240",
        "type": "number"
      },
      {
        "key": "jednako",
        "label": "Vrijeme jednakih količina, min",
        "answer": "6",
        "type": "number"
      },
      {
        "key": "kolicina",
        "label": "Jednaka količina, L",
        "answer": "132",
        "type": "number"
      },
      {
        "key": "prazan",
        "label": "Vrijeme pražnjenja prvog, min; a/b",
        "answer": "40/3",
        "type": "text"
      }
    ],
    "steps": [
      "Prvi model je V₁(t) = 240 − 18t, pa su k = −18 i n = 240. Drugi je V₂(t) = 60 + 12t.",
      "Jednakost količina daje 240 − 18t = 60 + 12t.",
      "180 = 30t, pa je t = 6 min.",
      "Tada V₁ = 240 − 108 = 132 L i V₂ = 60 + 72 = 132 L; presjek grafova je (6, 132).",
      "Prvi se prazni kada 240 − 18t = 0, odnosno t = 240/18 = 40/3 min.",
      "Model prvog rezervoara primjenjujemo za 0 ≤ t ≤ 40/3; ne tumačimo negativnu zapreminu poslije pražnjenja."
    ],
    "hint": "Pražnjenje daje negativan nagib, punjenje pozitivan. Za presjek izjednači dvije funkcije, a za pražnjenje postavi prvu na nulu."
  },
  {
    "id": "project-9-kutije",
    "topicId": "projects",
    "grade": 9,
    "title": "Pakovanje kvadara i površina kartona",
    "prompt": "Mala zatvorena kutija ima dimenzije 30 cm × 20 cm × 15 cm. Veliki pravougaoni prostor ima dimenzije 90 cm × 60 cm × 45 cm. Kutije su orijentisane tako da 30 cm odgovara 90 cm, 20 cm odgovara 60 cm, a 15 cm odgovara 45 cm; slažu se bez razmaka. Odredi zapreminu male kutije u litrima, broj kutija koje stanu i ukupnu površinu kartona za te male kutije u m². Za karton računaj svih šest strana, zanemari preklop i otpad.",
    "fields": [
      {
        "key": "litri",
        "label": "Zapremina male kutije, L",
        "answer": "9",
        "type": "number"
      },
      {
        "key": "broj",
        "label": "Broj kutija",
        "answer": "27",
        "type": "number"
      },
      {
        "key": "karton",
        "label": "Ukupna površina kartona, m²",
        "answer": "7.29",
        "type": "number",
        "tolerance": 1e-08
      }
    ],
    "steps": [
      "Mala zapremina je 30 · 20 · 15 = 9 000 cm³ = 9 L, jer je 1 L = 1 000 cm³.",
      "Po zadatim smjerovima stane 90/30 = 3, 60/20 = 3 i 45/15 = 3 kutije. Ukupno je 3 · 3 · 3 = 27.",
      "Površina jedne kutije je 2 · (30 · 20 + 30 · 15 + 20 · 15) = 2 · 1 350 = 2 700 cm².",
      "Za 27 kutija treba 27 · 2 700 = 72 900 cm².",
      "Pošto je 1 m² = 10 000 cm², ukupno je 7,29 m² kartona."
    ],
    "hint": "Broj kutija računaj po sva tri smjera. Površinu i zapreminu pretvaraj različitim faktorima."
  },
  {
    "id": "project-9-cisterna",
    "topicId": "projects",
    "grade": 9,
    "title": "Valjak i trajanje zalihe",
    "prompt": "Cisterna ima oblik pravog kružnog valjka poluprečnika 0,5 m i visine 1,2 m. Napunjena je do 75% zapremine. Troši se stalno 47,1 L dnevno, bez drugih gubitaka. Koristi π = 3,14. Odredi punu zapreminu u litrima, početnu zalihu vode i za koliko dana se ta zaliha potpuno potroši.",
    "fields": [
      {
        "key": "kapacitet",
        "label": "Puna zapremina, L",
        "answer": "942",
        "type": "number"
      },
      {
        "key": "zaliha",
        "label": "Početna zaliha, L",
        "answer": "706.5",
        "type": "number",
        "tolerance": 1e-08
      },
      {
        "key": "dani",
        "label": "Trajanje zalihe, dana",
        "answer": "15",
        "type": "number"
      }
    ],
    "steps": [
      "Puna zapremina je πr²H = 3,14 · 0,5² · 1,2 = 0,942 m³.",
      "1 m³ = 1 000 L, pa je puna zapremina 942 L.",
      "Početna zaliha je 942 · 0,75 = 706,5 L.",
      "Trajanje je 706,5 : 47,1 = 15 dana. Provjera: 15 · 47,1 = 706,5 L."
    ],
    "hint": "Prvo izračunaj punu zapreminu i pretvori je u litre. Procenat punjenja primijeni prije dijeljenja dnevnom potrošnjom."
  },
  {
    "id": "project-9-kupasti-sator",
    "topicId": "projects",
    "grade": 9,
    "title": "Kupasti šator bez poda",
    "prompt": "Matematički model šatora je prava kružna kupa poluprečnika 3 m i visine 4 m. Platno pokriva samo omotač, bez kružne osnove. Za nabavku treba dodati 10% površine omotača kao rezervu. Koristi π = 3,14. Odredi izvodnicu, potrebnu površinu platna s rezervom i unutrašnju zapreminu.",
    "fields": [
      {
        "key": "izvodnica",
        "label": "Izvodnica, m",
        "answer": "5",
        "type": "number"
      },
      {
        "key": "platno",
        "label": "Platno s rezervom, m²",
        "answer": "51.81",
        "type": "number",
        "tolerance": 1e-08
      },
      {
        "key": "zapremina",
        "label": "Unutrašnja zapremina, m³",
        "answer": "37.68",
        "type": "number",
        "tolerance": 1e-08
      }
    ],
    "steps": [
      "Izvodnica je s = √(r² + H²) = √(9 + 16) = 5 m.",
      "Omotač ima površinu M = πrs = 3,14 · 3 · 5 = 47,1 m².",
      "S rezervom treba 47,1 · 1,10 = 51,81 m² platna. Osnova se ne dodaje jer šator nema platneni pod.",
      "Zapremina je V = πr²H/3 = 3,14 · 9 · 4/3 = 37,68 m³.",
      "Visina H koristi se za zapreminu, a izvodnica s za omotač."
    ],
    "hint": "Razlikuj visinu i izvodnicu. Najprije izračunaj omotač bez osnove, pa uvećaj za rezervu."
  },
  {
    "id": "project-9-piramida",
    "topicId": "projects",
    "grade": 9,
    "title": "Model pravilne piramide",
    "prompt": "Pun model pravilne četverostrane piramide ima kvadratnu osnovu stranice 6 cm i normalnu visinu 4 cm. Materijal ima gustinu 0,8 g/cm³. Odredi apotemu bočne strane, ukupnu površinu svih strana uključujući osnovu, zapreminu i masu modela. Model nema šupljina.",
    "fields": [
      {
        "key": "apotema",
        "label": "Apotema bočne strane, cm",
        "answer": "5",
        "type": "number"
      },
      {
        "key": "povrsina",
        "label": "Ukupna površina, cm²",
        "answer": "96",
        "type": "number"
      },
      {
        "key": "zapremina",
        "label": "Zapremina, cm³",
        "answer": "48",
        "type": "number"
      },
      {
        "key": "masa",
        "label": "Masa, g",
        "answer": "38.4",
        "type": "number",
        "tolerance": 1e-08
      }
    ],
    "steps": [
      "Apotema je hipotenuza trougla s katetama H = 4 cm i a/2 = 3 cm: s = √(16 + 9) = 5 cm.",
      "Osnova je B = 6² = 36 cm². Omotač je Oₒs/2 = (4 · 6) · 5/2 = 60 cm².",
      "Ukupna površina je 36 + 60 = 96 cm².",
      "Zapremina je BH/3 = 36 · 4/3 = 48 cm³.",
      "Masa punog modela je gustina puta zapremina: 0,8 · 48 = 38,4 g."
    ],
    "hint": "Apotema ne koristi cijelu osnovnu ivicu, nego njenu polovinu. Površina i zapremina koriste različite visine i formule."
  },
  {
    "id": "project-9-lopte",
    "topicId": "projects",
    "grade": 9,
    "title": "Tri lopte i premaz",
    "prompt": "Tri pune lopte imaju poluprečnik po 5 cm. Premazuje se cijela površina svake lopte. Jedan gram premaza dovoljan je za 200 cm². Koristi π = 3,14, zanemari gubitke. Odredi ukupnu zapreminu u cm³ i litrima, ukupnu površinu i masu potrebnog premaza.",
    "fields": [
      {
        "key": "zapremina",
        "label": "Ukupna zapremina, cm³",
        "answer": "1570",
        "type": "number"
      },
      {
        "key": "litri",
        "label": "Ukupna zapremina, L",
        "answer": "1.57",
        "type": "number",
        "tolerance": 1e-08
      },
      {
        "key": "povrsina",
        "label": "Ukupna površina, cm²",
        "answer": "942",
        "type": "number"
      },
      {
        "key": "premaz",
        "label": "Potreban premaz, g",
        "answer": "4.71",
        "type": "number",
        "tolerance": 1e-08
      }
    ],
    "steps": [
      "Jedna lopta ima zapreminu 4πr³/3. Tri lopte zajedno imaju 3 · 4π · 5³/3 = 4 · 3,14 · 125 = 1 570 cm³.",
      "1 570 cm³ = 1,57 L, jer je 1 L = 1 000 cm³.",
      "Jedna sfera ima površinu 4πr² = 4 · 3,14 · 25 = 314 cm². Tri daju 942 cm².",
      "Potrebna masa premaza je 942 : 200 = 4,71 g. Za premaz koristimo površinu, a ne zapreminu."
    ],
    "hint": "Množi tri zapremine i tri površine. Jedinica potrošnje premaza pokazuje da se ona veže za površinu."
  },
  {
    "id": "project-9-krov-diedar",
    "topicId": "projects",
    "grade": 9,
    "title": "Krov, diedar i potkrovlje",
    "prompt": "Simetričan dvovodni krov ima horizontalni raspon 8 m i visinu sljemena 4 m iznad poda potkrovlja. Sljeme je dugo 10 m. Presjek normalan na sljeme je jednakokraki trougao, a krovne ravni su bez prepusta. Odredi ugao diedra između krovnih ravni, dužinu kosog kraka presjeka, ukupnu površinu dvije krovne ravni i zapreminu potkrovlja. Dužinu i površinu zaokruži na tri decimale.",
    "fields": [
      {
        "key": "diedar",
        "label": "Ugao diedra, °",
        "answer": "90",
        "type": "number"
      },
      {
        "key": "krak",
        "label": "Kosi krak presjeka, m",
        "answer": "5.657",
        "type": "number",
        "tolerance": 0.0005
      },
      {
        "key": "povrsina",
        "label": "Površina krova, m²",
        "answer": "113.137",
        "type": "number",
        "tolerance": 0.0005
      },
      {
        "key": "zapremina",
        "label": "Zapremina potkrovlja, m³",
        "answer": "160",
        "type": "number"
      }
    ],
    "steps": [
      "Visina dijeli raspon na dvije katete po 4 m. Svaka polovina presjeka je jednakokraki pravougli trougao s oštrim uglovima 45°.",
      "Ugao na sljemenu je 180° − 45° − 45° = 90°. Presjek je normalan na sljeme, zato taj ugao mjeri diedar krovnih ravni.",
      "Kosi krak je √(4² + 4²) = 4√2 ≈ 5,657 m.",
      "Svaka krovna ravan je pravougaonik dimenzija 10 m i 4√2 m. Ukupna površina je 2 · 10 · 4√2 = 80√2 ≈ 113,137 m².",
      "Površina trougaonog presjeka je 8 · 4/2 = 16 m². Potkrovlje je prava prizma zapremine 16 · 10 = 160 m³.",
      "Za površinu koristi tačnu vrijednost 4√2, a zaokruži tek konačan rezultat."
    ],
    "hint": "Diedar mjeri normalni presjek. Poslije Pitagorine teoreme razlikuj krovnu površinu od zapremine trougaone prizme."
  }
]
/* END_DATA */
;
  if (typeof module !== 'undefined' && module.exports) module.exports = projects;
  if (typeof globalThis !== 'undefined') globalThis.ELDI_MATH_PROJECTS = projects;
})();
