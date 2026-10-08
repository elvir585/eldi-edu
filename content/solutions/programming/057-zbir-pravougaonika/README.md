# 057. Zbir pravougaonika

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 187.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi 2D prefiksne sume za mnogo pravougaonih upita.

## Zadatak

Data je matrica bodova R x C i Q upita. Svaki upit daje r1,c1,r2,c2 (1-bazirano) i traži zbir svih elemenata unutar tog pravougaonika.

## Ulaz

R C Q, zatim R redova matrice, zatim Q upita.

## Izlaz

Za svaki upit ispisati zbir.

## Ograničenja

1<=R,C<=700, Q<=200000, |a|<=10^6.

## Razumijevanje i postupak

pref[r][c] čuva zbir pravougaonika od (1,1) do (r,c). Zbir proizvoljnog pravougaonika dobija se uključenjem-isključenjem četiri prefiksa.

Zašto postupak daje tačan rezultat? Svaki element se u prefiksnoj matrici uključi tačno prema definiciji. Formula uklanja područja iznad i lijevo od upita, a njihov preklop vraća jednom.

## Koraci

1. Izgradi pref sa dodatnim nultim redom i kolonom.
2. Za upit koristi P[r2][c2]-P[r1-1][c2]-P[r2][c1-1]+P[r1-1][c1-1].

## Složenost

Predobrada O(RC), svaki upit O(1), memorija O(RC).

## Važne provjere

Paziti na 1-bazirane koordinate i dodatnu nultu granicu.

Koristiti 64-bitni zbir.

## Primjer 1

Ulaz:

```text
3 4 2
1 2 3 4
5 6 7 8
9 10 11 12
1 2 2 4
2 1 3 2
```

Izlaz:

```text
30
30
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
