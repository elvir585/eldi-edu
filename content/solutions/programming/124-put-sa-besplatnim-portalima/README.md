# 124. Put sa besplatnim portalima

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 358.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Prepoznaje graf sa težinama 0/1 i koristi 0-1 BFS.

## Zadatak

Dat je usmjeren graf sa N čvorova i M ivica. Svaka ivica ima cijenu 0 ili 1. Odredi minimalnu cijenu puta od 1 do N.

## Ulaz

N M, zatim M redova u v w gdje je w 0 ili 1.

## Izlaz

Minimalna cijena ili -1.

## Ograničenja

N <= 300000, M <= 500000.

## Razumijevanje i postupak

Obični BFS minimizira broj ivica, ne zbir težina. Dijkstra bi radila, ali zbog težina samo 0 i 1 možemo koristiti deque: poboljšanje težine 0 ide naprijed, a težine 1 nazad.

Zašto postupak daje tačan rezultat? Deque održava stanja u neopadajućoj privremenoj udaljenosti, analogno Dijkstri, ali bez heap-a jer postoje samo dvije moguće težine.

## Koraci

1. dist[1]=0, ostalo INF.
2. Izvadi u sa početka deque-a.
3. Za ivicu u->v težine w relaksiraj dist[v].
4. Ako w=0 stavi v na početak, inače na kraj.

## Složenost

Vrijeme O(N+M), memorija O(N+M).

## Važne provjere

Ne označavati čvor trajno visited pri prvom viđenju; može se relaksirati boljom 0-ivicom.

0-ivice moraju ići na početak deque-a.

## Primjer 1

Ulaz:

```text
5 6
1 2 1
1 3 0
3 4 0
4 2 0
2 5 1
4 5 1
```

Izlaz:

```text
1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
