# 056. Sažmi velike koordinate

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 185.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik primjenjuje koordinatnu kompresiju bez gubitka poretka i jednakosti.

## Zadatak

Dat je niz cijelih brojeva koji mogu biti veoma veliki ili negativni. Zamijeni svaku vrijednost njenim rangom među različitim vrijednostima niza, počevši od 1.

## Ulaz

Prvi red N. Drugi red N cijelih brojeva.

## Izlaz

Ispisati N kompresovanih rangova.

## Ograničenja

1 <= N <= 2*10^5, |A[i]| <= 10^18.

## Razumijevanje i postupak

Kompresija ne čuva razlike između vrijednosti, ali čuva njihov poredak i jednakost. Sortiramo jedinstvene vrijednosti i svakoj dodijelimo indeks.

## Koraci

1. unique=sort(set(A)).
2. Napravi mapu vrijednost -> pozicija+1.
3. Svaki A[i] zamijeni njegovim rangom.

## Složenost

Vrijeme O(N log N); memorija O(N).

## Važne provjere

Jednake originalne vrijednosti moraju dobiti isti rang.

Kompresija nije normalizacija na interval [0,1]; važan je samo redoslijed.

## Primjer 1

Ulaz:

```text
5
100 -5 100 7 20
```

Izlaz:

```text
4 1 4 2 3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
