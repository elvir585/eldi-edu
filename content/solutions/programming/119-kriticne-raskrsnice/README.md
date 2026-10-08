# 119. Kritične raskrsnice

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 343.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik proširuje low-link ideju sa mostova na artikulacijske tačke.

## Zadatak

U neusmjerenom grafu čvor je kritičan ako njegovo uklanjanje (zajedno sa incidentnim ivicama) povećava broj povezanih komponenti. Odredi broj kritičnih čvorova.

## Ulaz

Prvi red N M, zatim M ivica.

## Izlaz

Ispisati broj artikulacijskih tačaka.

## Ograničenja

1 <= N,M <= 2*10^5.

## Razumijevanje i postupak

Za neroot čvor u, ako postoji DFS dijete v sa low[v]>=tin[u], podstablo v nema povratni put iznad u, pa uklanjanje u odvaja taj dio. Korijen DFS stabla je artikulacija samo ako ima najmanje dva DFS djeteta.

## Koraci

1. Pokreni DFS iz svake komponente.
2. Računaj tin i low kao kod mostova.
3. Za neroot u označi kritičnim ako low[v]>=tin[u] za neko dijete v.
4. Root je kritičan ako ima više od jednog DFS djeteta.

## Složenost

Vrijeme O(N+M); memorija O(N+M).

## Važne provjere

Root DFS stabla ima posebno pravilo.

Uslov za artikulaciju je >=, dok je za most low[v]>tin[u].

## Primjer 1

Ulaz:

```text
5 4
1 2
2 3
2 4
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
