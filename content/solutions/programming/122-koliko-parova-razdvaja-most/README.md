# 122. Koliko parova razdvaja most?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 352.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Kombinuje DFS low-link sa veličinama podstabala za doprinos svakog mosta.

## Zadatak

Dat je povezan neusmjeren graf sa N čvorova. Za svaku ivicu koja je most odredi koliko neuređenih parova čvorova postaje nepovezano njenim uklanjanjem. Ispiši zbir tih vrijednosti preko svih mostova.

## Ulaz

N M, zatim M ivica.

## Izlaz

Zbir doprinosa svih mostova.

## Ograničenja

N<=200000, M<=300000.

## Razumijevanje i postupak

U DFS stablu, ako je ivica parent-v most, uklanjanje odvaja podstablo v veličine sz[v] od ostatka N-sz[v]. Broj razdvojenih neuređenih parova je njihov proizvod.

Zašto postupak daje tačan rezultat? Low-link uslov tačno karakteriše most. Kada je ivica most, jedina veza između podstabla v i ostatka prolazi kroz nju, pa svaki izbor jednog čvora sa svake strane daje razdvojeni par, ukupno sz*(N-sz).

## Koraci

1. DFS čuva tin, low i sz.
2. Za tree-edge u-v nakon povratka ažuriraj low[u] i sz[u].
3. Ako low[v]>tin[u], dodaj sz[v]*(N-sz[v]).
4. Za paralelne ivice identifikovati ivicu ID-em.

## Složenost

Vrijeme O(N+M), memorija O(N+M).

## Važne provjere

Kod neusmjerenog grafa preskače se samo parent edge ID, ne svaki čvor roditelj.

Proizvod traži 64-bitni tip.

## Primjer 1

Ulaz:

```text
5 5
1 2
2 3
3 4
4 5
3 5
```

Izlaz:

```text
10
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
