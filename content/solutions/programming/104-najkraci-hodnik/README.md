# 104. Najkraći hodnik

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 303.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Naći najkraći broj ivica između dva čvora u neponderisanom grafu.

## Zadatak

Školski kompleks ima N prostorija i M dvosmjernih hodnika. Svaki prolazak kroz jedan hodnik računa se kao jedan korak. Odredi najmanji broj hodnika od prostorije S do T ili -1 ako put ne postoji.

## Ulaz

U prvom redu N M S T, zatim M veza u v.

## Izlaz

Ispisati najkraći broj hodnika ili -1.

## Ograničenja

1 ≤ N,M ≤ 200000.

## Razumijevanje i postupak

BFS je tačan jer sve ivice imaju jednaku težinu 1. Kada prvi put posjetimo čvor, njegova distanca je minimalna.

## Koraci

1. Izgraditi listu susjedstva.
2. dist[S]=0, S staviti u red.
3. Za svaki neobiđeni susjed v postaviti dist[v]=dist[u]+1.
4. Ispisati dist[T].

## Složenost

O(N+M) vrijeme i memorija.

## Primjer 1

Ulaz:

```text
5 5 1 5
1 2
2 3
3 5
1 4
4 5
```

Izlaz:

```text
2
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
