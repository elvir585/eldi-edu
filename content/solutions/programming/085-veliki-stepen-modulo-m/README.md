# 085. Veliki stepen modulo M

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 253.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Implementira binarno stepenovanje i sprječava eksploziju veličine brojeva modularnim računanjem.

## Zadatak

Data su cijela A, B i M. Izračunaj A^B mod M.

## Ulaz

A B M.

## Izlaz

Jedan cijeli broj.

## Ograničenja

0 <= A <= 10^18, 0 <= B <= 10^18, 1 <= M <= 10^9+7.

## Razumijevanje i postupak

Množenje baze B puta je presporo. Eksponent prepolovljavamo: ako je bit neparan, trenutnu bazu uključimo u rezultat; zatim bazu kvadriramo modulo M.

Zašto postupak daje tačan rezultat? Invariant je result * base^exp ≡ početna_baza^početni_exp (mod M). Svaki korak ga čuva, a kada exp postane 0 result je odgovor.

## Koraci

1. a%=m; res=1%m.
2. Dok b>0: ako b&1, res=res*a%m.
3. a=a*a%m; b//=2.

## Složenost

Vrijeme O(log B), memorija O(1).

## Važne provjere

Ne računati A^B prije uzimanja modula.

Paziti na overflow pri množenju u C++; koristiti __int128.

## Primjer 1

Ulaz:

```text
7 13 1000
```

Izlaz:

```text
407
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
