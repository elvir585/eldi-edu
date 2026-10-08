# 015. Najduži strogi rast

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 98.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Jednim prolazom nalazi najduži uzastopni strogo rastući segment.

## Zadatak

Dat je niz od N cijelih brojeva. Odredi dužinu najdužeg uzastopnog segmenta u kojem je svaki sljedeći element strogo veći od prethodnog.

## Ulaz

N, zatim N cijelih brojeva.

## Izlaz

Dužina najdužeg segmenta.

## Ograničenja

1 <= N <= 300000.

## Razumijevanje i postupak

Dovoljno je znati dužinu trenutnog rastućeg segmenta koji završava na i. Ako a[i] > a[i-1], segment se produžava; inače novi segment počinje na i.

Zašto postupak daje tačan rezultat? Ako je stanje ispravno poslije prvih i elemenata, lokalno pravilo ga tačno ažurira nakon elementa i+1. Indukcijom stanje je tačno na kraju.

## Koraci

1. Postavi cur=best=1.
2. Za i od 1 do N-1: ako a[i]>a[i-1], cur++; inače cur=1.
3. Ažuriraj best=max(best,cur).

## Složenost

Vrijeme O(N), memorija O(1) osim ulaznog niza.

## Važne provjere

Strogo rastući znači >, ne >=.

Traži se uzastopni segment, ne proizvoljan podniz.

## Primjer 1

Ulaz:

```text
9
1 2 5 3 4 7 8 2 3
```

Izlaz:

```text
4
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
