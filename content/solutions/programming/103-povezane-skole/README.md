# 103. Povezane škole

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 301.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Prebrojati povezane komponente u neusmjerenom grafu pomoću DFS/BFS.

## Zadatak

U mreži je N škola. Između nekih parova postoji direktna saradnja, ukupno M veza. Saradnja se može prenositi preko više škola. Koliko odvojenih grupa škola postoji?

## Ulaz

U prvom redu N M. U narednih M redova dva broja u v koji označavaju neusmjerenu vezu.

## Izlaz

Ispisati broj povezanih komponenti.

## Ograničenja

1 ≤ N,M ≤ 200000; nema višestrukih veza ni petlji.

## Razumijevanje i postupak

Svaki put kada pronađemo neposjećen čvor, on započinje novu povezanu komponentu. Jednim BFS/DFS obilaskom označimo sve čvorove koji su s njim povezani.

## Koraci

1. Napraviti listu susjedstva.
2. visited=false za sve.
3. Za svaki čvor: ako nije posjećen, povećati broj komponenti i pokrenuti BFS/DFS.

## Složenost

O(N+M) vrijeme i O(N+M) memorija.

## Primjer 1

Ulaz:

```text
6 3
1 2
2 3
5 6
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
