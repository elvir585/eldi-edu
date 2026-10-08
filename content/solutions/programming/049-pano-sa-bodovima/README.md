# 049. Pano sa bodovima

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 171.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Proširiti prefiksne sume sa niza na matricu.

## Zadatak

Na panou R×C svaki element predstavlja broj bodova u jednoj ćeliji. Za Q pravougaonih upita (r1,c1,r2,c2) treba izračunati zbir svih vrijednosti unutar pravougaonika, uključujući granice.

## Ulaz

U prvom redu R C Q. Slijedi R redova matrice. Zatim Q upita.

## Izlaz

Za svaki upit ispisati zbir pravougaonika.

## Ograničenja

1 ≤ R,C ≤ 1000, 1 ≤ Q ≤ 200000, |a_ij| ≤ 10^6.

## Razumijevanje i postupak

2D prefiks P[i][j] je zbir pravougaonika od (1,1) do (i,j). Pri izračunu pravougaonika koristimo princip uključivanja-isključivanja: P[r2][c2]-P[r1-1][c2]-P[r2][c1-1]+P[r1-1][c1-1].

## Koraci

1. Izgraditi 2D prefiks.
2. Za svaki upit primijeniti formulu uključivanja-isključivanja.

## Složenost

O(R·C + Q) vrijeme i O(R·C) memorija.

## Primjer 1

Ulaz:

```text
3 4 2
1 2 3 4
5 6 7 8
9 1 2 3
1 2 2 4
2 1 3 2
```

Izlaz:

```text
30
21
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
