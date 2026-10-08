# 121. Broj najkraćih puteva

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 349.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Uz BFS računa i broj najkraćih puteva u neusmjerenom neponderisanom grafu.

## Zadatak

U neusmjerenom grafu od 1 do N odredi udaljenost od 1 do N i broj različitih najkraćih puteva modulo 1 000 000 007. Ako put ne postoji, ispiši -1 0.

## Ulaz

N M, zatim M ivica.

## Izlaz

dist broj_puteva.

## Ograničenja

N,M<=300000.

## Razumijevanje i postupak

BFS daje slojeve udaljenosti. ways[v] je broj najkraćih puteva do v. Kada v vidimo prvi put, nasljeđuje ways[u]. Ako kasnije do v dolazimo sa iste prethodne udaljenosti dist[u]+1=dist[v], dodajemo ways[u].

Zašto postupak daje tačan rezultat? Svaki najkraći put do v završava ivicom iz nekog u sa dist[u]=dist[v]-1. BFS obrađuje upravo te prethodnike, a ways[v] sabira disjunktne izbore posljednje ivice.

## Koraci

1. dist[1]=0,ways[1]=1.
2. BFS.
3. Prvi dolazak: postavi dist i ways.
4. Jednako kratak dodatni dolazak: saberi ways modulo MOD.

## Složenost

Vrijeme O(N+M), memorija O(N+M).

## Važne provjere

Ne sabirati puteve koji daju veću udaljenost.

ways se inicijalizuje samo na izvoru.

## Primjer 1

Ulaz:

```text
5 6
1 2
1 3
2 4
3 4
4 5
2 5
```

Izlaz:

```text
2 1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
