# 002. Mini-zoo

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 73.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Prevesti svakodnevnu situaciju u linearnu formulu.

## Zadatak

Na školskom danu otvorenih vrata u mini-zoo prostoru nalazi se U učenika i P pasa. Pretpostavi da svaki učenik ima dvije noge, a svaki pas četiri. Koliko je ukupno nogu u prostoru?

## Ulaz

U jednom redu data su U i P.

## Izlaz

Ispisati ukupan broj nogu.

## Ograničenja

0 ≤ U,P ≤ 1000.

## Razumijevanje i postupak

Broj nogu je zbir dvije nezavisne grupe: 2·U za učenike i 4·P za pse. Nema potrebe simulirati osobu po osobu.

## Koraci

1. Učitati U i P.
2. Izračunati 2*U + 4*P.
3. Ispisati rezultat.

## Složenost

O(1) vrijeme, O(1) memorija.

## Primjer 1

Ulaz:

```text
7 5
```

Izlaz:

```text
34
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
