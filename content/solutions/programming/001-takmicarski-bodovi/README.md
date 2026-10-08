# 001. Takmičarski bodovi

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 71.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primijeniti jednostavnu formulu i pravilno učitati/ispisati cijele brojeve.

## Zadatak

Na školskom takmičenju svako kolo nosi najviše P bodova. Učenik će nastupiti na N kola. Odredi najveći broj bodova koji može osvojiti ako na svakom kolu osvoji svih P bodova.

## Ulaz

U jednom redu data su dva prirodna broja N i P.

## Izlaz

Ispisati najveći mogući ukupan broj bodova.

## Ograničenja

1 ≤ N ≤ 100, 1 ≤ P ≤ 1000.

## Razumijevanje i postupak

Ovdje nema potrebe za petljom. Isti broj bodova P sabrao bi se N puta, pa je rezultat proizvod N·P. Takmičarski zadaci često počinju ovakvim direktnim modeliranjem: najvažnije je iz teksta izdvojiti dvije veličine i odnos među njima.

## Koraci

1. Učitati N i P.
2. Izračunati N * P.
3. Ispisati rezultat.

## Složenost

O(1) vrijeme i O(1) memorija.

## Važne provjere

Korištenje petlje iako nije potrebna.

Zamjena proizvoda sa zbirom.

## Primjer 1

Ulaz:

```text
6 100
```

Izlaz:

```text
600
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
