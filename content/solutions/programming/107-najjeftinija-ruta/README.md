# 107. Najjeftinija ruta

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 311.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Naći najkraći put u grafu sa nenegativnim težinama.

## Zadatak

Između N mjesta postoji M dvosmjernih puteva. Svaki put ima trošak w. Odredi najmanji trošak od mjesta S do T ili -1 ako nije povezano.

## Ulaz

U prvom redu N M S T. U narednih M redova u v w.

## Izlaz

Ispisati minimalan trošak ili -1.

## Ograničenja

1 ≤ N,M ≤ 200000, 0 ≤ w ≤ 10^9.

## Razumijevanje i postupak

BFS više nije dovoljan jer putevi nemaju jednaku cijenu. Dijkstrin algoritam uvijek obrađuje trenutno najbliži nefinalizirani čvor. Prioritetni red omogućava O((N+M) log N). Kada iz reda izvučemo zastarjelu veću distancu, preskačemo je.

## Koraci

1. dist[S]=0, ostalo beskonačno.
2. U min-priority queue ubaciti (0,S).
3. Za svaku ivicu pokušati relaksaciju dist[v] > dist[u]+w.
4. Ispisati dist[T] ili -1.

## Složenost

O((N+M) log N) vrijeme i O(N+M) memorija.

## Primjer 1

Ulaz:

```text
4 5 1 4
1 2 5
2 4 4
1 3 2
3 4 20
2 3 1
```

Izlaz:

```text
7
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
