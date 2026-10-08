# 072. Evakuacija škole

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 222.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primjenjuje multi-source BFS na mreži sa preprekama.

## Zadatak

Data je mapa škole R x C. Znak # je zid, . prolaz, U učenik, a I izlaz. Svi učenici se kreću istovremeno po susjednim poljima gore/dolje/lijevo/desno. Odredi minimalan broj sekundi nakon kojeg svi učenici mogu stići do nekog izlaza. Ako neki učenik ne može do izlaza, ispiši -1.

## Ulaz

R C, zatim R redova mape.

## Izlaz

Maksimalna udaljenost učenika do najbližeg izlaza ili -1.

## Ograničenja

R*C<=500000.

## Razumijevanje i postupak

Umjesto BFS-a od svakog učenika, pokrenemo jedan BFS od svih izlaza odjednom. Dobijena distanca svake ćelije je udaljenost do najbližeg izlaza.

Zašto postupak daje tačan rezultat? Multi-source BFS je ekvivalentan dodavanju zamišljenog super-izvora spojenog nultim ivicama sa svim izlazima. Prvi dolazak u ćeliju daje najkraću udaljenost do bilo kojeg izlaza.

## Koraci

1. Sve izlaze stavi u red sa dist=0.
2. BFS kroz sve nezidne ćelije.
3. Za svaku U provjeri dist; uzmi maksimum.

## Složenost

Vrijeme O(RC), memorija O(RC).

## Važne provjere

Ne pokretati BFS posebno za svakog učenika.

Zidovi se ne smiju posjećivati.

## Primjer 1

Ulaz:

```text
4 6
I...#.
.##.U.
..U...
#...I.
```

Izlaz:

```text
3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
