# 115. Vrati najkraći put

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 333.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik proširuje BFS tako da osim udaljenosti rekonstruiše i stvarnu putanju.

## Zadatak

U neusmjerenom neponderisanom grafu pronađi najkraći put od S do T. Ako put postoji, ispiši broj ivica i zatim čvorove puta. Ako ne postoji, ispiši -1.

## Ulaz

Prvi red N M S T. Zatim M ivica.

## Izlaz

Ako postoji: prvi red udaljenost, drugi red put. Inače -1.

## Ograničenja

1 <= N,M <= 2*10^5.

## Razumijevanje i postupak

Kada BFS prvi put otkrije v iz u, postavimo parent[v]=u. Nakon što stignemo do T, pratimo roditelje unazad do S i okrenemo dobijenu listu.

## Koraci

1. dist[S]=0, parent=-1.
2. Pri prvom otkrivanju v postavi dist i parent.
3. Ako T ostane neotkriven, -1.
4. Inače prati parent od T do -1 i obrni put.

## Složenost

Vrijeme O(N+M); memorija O(N+M).

## Važne provjere

Roditelj se postavlja samo pri prvom otkrivanju čvora.

Put se dobije unazad, pa ga treba obrnuti.

## Primjer 1

Ulaz:

```text
5 5 1 5
1 2
2 5
1 3
3 4
4 5
```

Izlaz:

```text
2
1 2 5
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
