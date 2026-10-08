# 125. Najjeftiniji put između gradova

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 361.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi Dijkstrin algoritam za najkraći put u grafu sa nenegativnim težinama.

## Zadatak

Dat je usmjeren graf sa pozitivnim cijenama putovanja. Odredi minimalan trošak od grada 1 do grada N.

## Ulaz

N M, zatim M redova u v w.

## Izlaz

Minimalni trošak ili -1.

## Ograničenja

N <= 200000, M <= 400000, 1 <= w <= 10^9.

## Razumijevanje i postupak

Težine više nisu jednake pa BFS nije dovoljan. Priority queue uvijek daje trenutno najmanju udaljenost; iz nje relaksiramo susjede. Stare zapise u heap-u samo preskočimo.

Zašto postupak daje tačan rezultat? Kada je stanje izvađeno sa najmanjom udaljenošću, nijedan put kroz neobrađene čvorove ne može ga poboljšati jer su sve dodatne težine nenegativne.

## Koraci

1. dist[1]=0 i push(0,1).
2. Pop najmanji (du,u); ako du!=dist[u], preskoči.
3. Za svaku ivicu izračunaj nd=du+w i relaksiraj.
4. Odgovor je dist[N].

## Složenost

Vrijeme O((N+M) log N), memorija O(N+M).

## Važne provjere

Udaljenosti moraju biti 64-bitne.

Dijkstra zahtijeva nenegativne težine.

## Primjer 1

Ulaz:

```text
5 6
1 2 4
1 3 2
3 2 1
2 4 5
3 4 8
4 5 3
```

Izlaz:

```text
11
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
