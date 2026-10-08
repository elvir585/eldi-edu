# 081. Brzo stepenovanje po modulu

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 244.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi binarno stepenovanje i svodi broj množenja sa O(b) na O(log b).

## Zadatak

Za date cijele brojeve a, b i m izračunaj a^b mod m.

## Ulaz

Jedan red sadrži a b m.

## Izlaz

Ispisati ostatak a^b pri dijeljenju sa m.

## Ograničenja

0 <= a <= 10^18, 0 <= b <= 10^18, 1 <= m <= 10^18.

## Razumijevanje i postupak

Eksponent pišemo binarno. Ako je trenutni bit eksponenta 1, trenutnu bazu uključujemo u rezultat. Nakon svakog koraka bazu kvadriramo, a eksponent prepolovimo.

## Koraci

1. result=1 mod m, base=a mod m.
2. Dok je b>0: ako je b neparan, result=result*base mod m.
3. base=base*base mod m; b//=2.

## Složenost

Vrijeme O(log b); memorija O(1).

## Važne provjere

Za b=0 rezultat je 1 mod m.

Kod C++ za vrlo veliki m proizvod dva 64-bitna broja zahtijeva širi međutip; ovdje se koristi __uint128_t.

## Primjer 1

Ulaz:

```text
3 13 1000
```

Izlaz:

```text
323
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
