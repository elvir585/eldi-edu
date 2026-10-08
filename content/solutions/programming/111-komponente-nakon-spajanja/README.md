# 111. Komponente nakon spajanja

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 321.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi DSU (union-find) sa kompresijom putanje i spajanjem po veličini.

## Zadatak

N računara je na početku nepovezano. Nakon M dvosmjernih veza odredi broj povezanih komponenti i veličinu najveće komponente.

## Ulaz

Prvi red N M, zatim M parova a b.

## Izlaz

Ispisati: broj_komponenti najveća_veličina.

## Ograničenja

1 <= N,M <= 2*10^5.

## Razumijevanje i postupak

DSU ne čuva cijeli graf. Svaki skup ima predstavnika. find pronalazi predstavnika, a union spaja dva različita skupa. Kompresija putanje i spajanje manjeg pod veći daju gotovo konstantno vrijeme.

## Koraci

1. parent[i]=i, size[i]=1.
2. Za svaku vezu nađi korijene.
3. Ako su različiti, spoji manji skup pod veći, smanji broj komponenti i ažuriraj najveću veličinu.

## Složenost

Amortizirano O((N+M) alpha(N)); memorija O(N).

## Važne provjere

Ako su čvorovi već u istoj komponenti, broj komponenti se ne smanjuje.

Veličina se ažurira samo pri stvarnom spajanju.

## Primjer 1

Ulaz:

```text
6 3
1 2
2 3
4 5
```

Izlaz:

```text
3 3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
