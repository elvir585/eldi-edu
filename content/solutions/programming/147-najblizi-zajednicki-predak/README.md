# 147. Najbliži zajednički predak

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 420.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Predobrađuje binarne pretke i odgovara na veliki broj LCA upita u O(log N).

## Zadatak

Dato je stablo ukorijenjeno u 1 i Q upita (u,v). Za svaki upit ispiši njihov najbliži zajednički predak.

## Ulaz

N Q, N-1 ivica, zatim Q parova u v.

## Izlaz

Po jedan LCA za svaki upit.

## Ograničenja

N,Q <= 200000.

## Razumijevanje i postupak

Tabela up[k][v] čuva 2^k-tog pretka. Prvo dublji čvor podignemo na dubinu drugog. Ako nisu jednaki, podižemo oba od najvećeg k naniže kada im se 2^k-ti preci razlikuju. Njihov neposredni roditelj tada je LCA.

Zašto postupak daje tačan rezultat? Nakon izjednačavanja dubina LCA se ne može izgubiti. Pri simultanom podizanju zadržavamo oba čvora strogo ispod LCA dok god je moguće; njihov roditelj je zato LCA.

## Koraci

1. BFS/DFS od 1 izračuna parent i depth.
2. LOG=ceil(log2 N)+1; popuni up[0], pa up[k][v]=up[k-1][up[k-1][v]].
3. Za upit izjednači dubine bitovima razlike.
4. Podiži oba naniže po k; vrati up[0][u].

## Složenost

Predobrada O(N log N), upit O(log N), memorija O(N log N).

## Važne provjere

Tabela parent mora za korijen pokazivati na korijen da ne izlazimo iz opsega.

Najprije izjednačiti dubine.

## Primjer 1

Ulaz:

```text
7 3
1 2
1 3
2 4
2 5
3 6
6 7
4 5
4 7
6 7
```

Izlaz:

```text
2
1
6
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
