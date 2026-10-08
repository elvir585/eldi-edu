# 123. Najjeftiniji put sa jednim popustom

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 355.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Proširuje Dijkstru stanjem iskorištenog popusta.

## Zadatak

U usmjerenom grafu putujemo od 1 do N. Jednom tokom puta smijemo izabrati jednu ivicu cijene w i platiti floor(w/2). Odredi minimalan ukupan trošak. Popust se može i ne mora iskoristiti.

## Ulaz

N M, zatim M usmjerenih ivica u v w.

## Izlaz

Minimalni trošak ili -1 ako N nije dostižan.

## Ograničenja

N<=200000,M<=300000,w<=1e9.

## Razumijevanje i postupak

Stanje je (čvor, used). Iz stanja used=0 preko svake ivice imamo dva prelaza: puna cijena i sniženje uz prelazak u used=1. Iz used=1 imamo samo punu cijenu.

Zašto postupak daje tačan rezultat? Prošireni graf ima 2N stanja i nenegativne težine, pa Dijkstra daje optimalnu udaljenost. Svaki stvarni put sa izborom najviše jedne snižene ivice odgovara tačno jednom putu u proširenom grafu.

## Koraci

1. dist[N][2], dist[1][0]=0.
2. Priority queue Dijkstra.
3. Relaksiraj normalni prelaz.
4. Ako used=0, relaksiraj i w//2 u drugi sloj.
5. Odgovor min(dist[N][0],dist[N][1]).

## Složenost

Vrijeme O((N+M) log N), memorija O(N+M).

## Važne provjere

Ne označavati čvor visited bez razlikovanja used.

Dijeljenje je cjelobrojno floor.

## Primjer 1

Ulaz:

```text
4 5
1 2 8
2 4 8
1 3 5
3 4 20
2 3 1
```

Izlaz:

```text
12
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
