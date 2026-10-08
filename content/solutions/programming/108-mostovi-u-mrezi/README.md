# 108. Mostovi u mreži

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 314.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Prepoznati mostove u neusmjerenom grafu pomoću vremena ulaska i low vrijednosti.

## Zadatak

U mreži N računara postoji M dvosmjernih veza. Veza je kritična ako njenim uklanjanjem broj povezanih komponenti mreže poraste. Odredi broj kritičnih veza.

## Ulaz

U prvom redu N M, zatim M parova u v.

## Izlaz

Ispisati broj mostova.

## Ograničenja

1 ≤ N,M ≤ 200000; nema petlji ni višestrukih ivica.

## Razumijevanje i postupak

Tokom DFS-a tin[u] je vrijeme ulaska u u, a low[u] najmanji tin dostupan iz podstabla u koristeći nula ili više stabloskih i najviše jednu povratnu ivicu. Za DFS ivicu u-v, ako low[v] > tin[u], iz podstabla v ne postoji povratak do u ili nekog njegovog pretka bez te ivice, pa je u-v most.

## Koraci

1. Pokrenuti DFS iz svake komponente.
2. Postaviti tin[u]=low[u]=timer++.
3. Za povratnu ivicu ažurirati low[u] sa tin[v].
4. Poslije DFS djeteta v: low[u]=min(low[u],low[v]); ako low[v]>tin[u], povećati odgovor.

## Složenost

O(N+M) vrijeme i O(N+M) memorija.

## Primjer 1

Ulaz:

```text
5 5
1 2
2 3
3 1
3 4
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
