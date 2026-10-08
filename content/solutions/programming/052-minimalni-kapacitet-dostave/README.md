# 052. Minimalni kapacitet dostave

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 177.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik prepoznaje binarno pretraživanje po odgovoru i gradi monotoni test izvodljivosti.

## Zadatak

Paketi moraju biti poslani zadanim redoslijedom u najviše D dana. Svaki dan kamion može ponijeti uzastopne pakete ukupne mase najviše C. Nađi najmanji mogući kapacitet C.

## Ulaz

Prvi red: N D. Drugi red: mase N paketa.

## Izlaz

Ispisati minimalni kapacitet.

## Ograničenja

1 <= N <= 2*10^5, 1 <= D <= N, mase <= 10^9.

## Razumijevanje i postupak

Ako kapacitet C radi, svaki veći kapacitet takođe radi. To je monotono svojstvo. Donja granica je najteži paket, gornja zbir svih masa.

## Koraci

1. Napiši funkciju days_needed(C) koja pohlepno puni svaki dan.
2. Binarno pretražuj C između max(masa) i sum(masa).
3. Ako je broj dana <=D, pokušaj manji C; inače veći.

## Složenost

Vrijeme O(N log(sum A)); memorija O(1) pored ulaza.

## Važne provjere

Test izvodljivosti mora biti O(N), ne još jedno binarno pretraživanje.

Donja granica mora biti barem najveća pojedinačna masa.

## Primjer 1

Ulaz:

```text
5 3
4 2 7 3 5
```

Izlaz:

```text
8
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
