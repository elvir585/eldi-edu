# 126. Redoslijed predmeta

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 364.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Nalazi leksikografski najmanji topološki redoslijed pomoću indegree-a i min-heap-a.

## Zadatak

N školskih modula imaju M preduvjeta u->v: modul u mora biti završen prije v. Ispiši leksikografski najmanji valjan redoslijed 1..N. Ako postoji ciklus, ispiši -1.

## Ulaz

N M, zatim M usmjerenih ivica u v.

## Izlaz

Redoslijed ili -1.

## Ograničenja

N,M <= 300000.

## Razumijevanje i postupak

Kahn algoritam koristi čvorove indegree 0. Da bismo dobili najmanji mogući sljedeći broj, držimo sve trenutno dostupne čvorove u min-heap-u.

Zašto postupak daje tačan rezultat? Svaka emitovana tačka u tom trenutku nema neobrađenog prethodnika. Ako se obrade svi čvorovi, redoslijed poštuje svaku usmjerenu ivicu; inače postoji ciklus.

## Koraci

1. Izračunaj indegree svih čvorova.
2. Sve indegree=0 stavi u min-heap.
3. Uzimaj najmanji u, dodaj ga u odgovor i smanji indegree susjeda.
4. Ako odgovor nema N čvorova, postoji ciklus.

## Složenost

Vrijeme O((N+M) log N), memorija O(N+M).

## Važne provjere

Obični queue daje neki topološki red, ne nužno najmanji.

Ciklus se prepoznaje po tome što nije obrađeno svih N čvorova.

## Primjer 1

Ulaz:

```text
5 4
1 3
2 3
3 4
2 5
```

Izlaz:

```text
1 2 3 4 5
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
