# 030. Pjesme na USB-u

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 130.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Prepoznati greedy strategiju „uzmi najkraće prvo“ za maksimiziranje broja stavki.

## Zadatak

USB plejer može reproducirati najviše T sekundi muzike. Na raspolaganju je N pjesama, a i-ta traje a_i sekundi. Koliko najviše cijelih pjesama možemo smjestiti ako biramo proizvoljan podskup?

## Ulaz

U prvom redu N i T, u drugom N trajanja.

## Izlaz

Ispisati najveći mogući broj pjesama.

## Ograničenja

1 ≤ N ≤ 200000, 1 ≤ a_i,T ≤ 10^9.

## Razumijevanje i postupak

Ako cilj nije maksimalno ukupno trajanje nego maksimalan broj pjesama, kratke pjesme su uvijek najmanje „skupe“. Sortiramo trajanja rastuće i dodajemo dok ukupno trajanje ne pređe T. Zamjena neke izabrane kratke pjesme dužom ne može povećati broj pjesama.

## Koraci

1. Sortirati trajanja rastuće.
2. Dodavati jedno po jedno dok zbir + sljedeća ≤ T.
3. Brojati koliko ih je stalo.

## Složenost

O(N log N) vrijeme zbog sortiranja, O(N) memorija.

## Primjer 1

Ulaz:

```text
6 15
7 2 4 3 9 5
```

Izlaz:

```text
4
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
