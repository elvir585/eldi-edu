# 101. Sljedeći veći element

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 295.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Monotonim stekom nalazi prvi strogo veći element desno za svaki indeks.

## Zadatak

Za svaki element niza a_i odredi vrijednost prvog elementa desno od i koji je strogo veći od a_i. Ako takav ne postoji, ispiši -1.

## Ulaz

N, zatim N cijelih brojeva.

## Izlaz

N odgovora u jednom redu.

## Ograničenja

N <= 500000.

## Razumijevanje i postupak

Stek čuva indekse čiji prvi veći element još nije pronađen. Kada dođe x=a[i], dok je x veći od vrijednosti na vrhu, upravo x je prvi veći za taj indeks pa ga skidamo i upisujemo odgovor.

Zašto postupak daje tačan rezultat? Element se stavlja na stek jednom i skida najviše jednom. Kada ga novi element skine, taj novi element je prvi desno koji zadovoljava uslov jer su svi između već bili nepovoljni.

## Koraci

1. ans=-1 za sve; st prazan.
2. Za i=0..N-1: dok st i a[i]>a[st[-1]], odgovori tom indeksu i pop.
3. Push i.

## Složenost

Vrijeme O(N), memorija O(N).

## Važne provjere

Uslov je >, ne >=.

Stek čuva indekse, jer nam treba pristup vrijednosti i poziciji odgovora.

## Primjer 1

Ulaz:

```text
6
2 1 2 4 3 5
```

Izlaz:

```text
4 2 4 5 5 -1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
