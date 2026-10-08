# 130. Online prijateljstva

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 377.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi DSU za dinamičko spajanje komponenti i upite povezanosti.

## Zadatak

N učenika u početku nisu povezani. Slijedi Q operacija: 1 a b znači dodaj prijateljsku vezu između a i b; 2 a b pita jesu li a i b u istoj povezanoj grupi. Za svaki tip 2 ispiši DA ili NE.

## Ulaz

N Q, zatim Q operacija.

## Izlaz

Odgovori na upite tipa 2.

## Ograničenja

N,Q <= 300000.

## Razumijevanje i postupak

Ne trebamo čuvati cijeli graf niti raditi BFS nakon svake veze. DSU održava samo komponente: union spaja predstavnike, a find poredi pripadnost.

Zašto postupak daje tačan rezultat? Invariant: dva čvora imaju isti predstavnik ako i samo ako su spojena dosadašnjim union operacijama.

## Koraci

1. parent[i]=i, size[i]=1.
2. find sa path compression.
3. union po veličini.
4. Za tip 2 poredi find(a)==find(b).

## Složenost

Amortizovano O((N+Q) alpha(N)), memorija O(N).

## Važne provjere

DSU odgovara na povezanost, ali ne čuva najkraći put.

Spajati korijene, ne proizvoljne čvorove.

## Primjer 1

Ulaz:

```text
5 5
1 1 2
1 2 3
2 1 3
2 1 5
1 4 5
```

Izlaz:

```text
DA
NE
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
