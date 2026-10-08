# 080. Jedinice u binarnom zapisu

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 242.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik razumije binarni zapis i osnovnu bitovsku operaciju n & 1.

## Zadatak

Za nenegativan cijeli broj n odredi koliko jedinica sadrži njegov binarni zapis bez vodećih nula.

## Ulaz

Jedan broj n.

## Izlaz

Ispisati broj jedinica u binarnom zapisu.

## Ograničenja

0 <= n < 2^63.

## Razumijevanje i postupak

Najniži bit broja n je 1 upravo kada je n neparan. Operacija n & 1 čita taj bit, a pomjeranje n >>= 1 uklanja ga.

## Koraci

1. Postavi brojač na 0.
2. Dok je n>0, dodaj n&1.
3. Pomjeri n za jedan bit udesno.

## Složenost

Vrijeme O(log n); memorija O(1).

## Važne provjere

Za n=0 odgovor je 0 i petlja se ne izvršava.

Bitovsko & nije isto što i logičko &&.

## Primjer 1

Ulaz:

```text
45
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
