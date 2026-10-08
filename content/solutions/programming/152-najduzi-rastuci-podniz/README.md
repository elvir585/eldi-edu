# 152. Najduži rastući podniz

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 433.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Računa dužinu LIS-a u O(N log N) pomoću tails i lower_bound.

## Zadatak

Dat je niz. Odredi dužinu najdužeg strogo rastućeg podniza, pri čemu izabrani elementi ne moraju biti uzastopni, ali njihov redoslijed mora ostati isti.

## Ulaz

N, zatim N cijelih brojeva.

## Izlaz

Dužina LIS-a.

## Ograničenja

1 <= N <= 300000.

## Razumijevanje i postupak

tails[k] čuva najmanji mogući završetak rastućeg podniza dužine k+1. Za x nalazimo prvi tails>=x; zamjenom taj završetak činimo što manjim, ili x produžava strukturu ako je veći od svih.

Zašto postupak daje tačan rezultat? Manji završetak za istu dužinu nikada nije lošiji za buduća proširenja. Zato zamjena održava mogućnost svih optimalnih nastavaka, a broj elemenata u tails jednak je LIS dužini.

## Koraci

1. Počni praznim tails.
2. Za svaki x nađi p=lower_bound(tails,x).
3. Ako p==len, append; inače tails[p]=x.
4. Dužina tails je odgovor.

## Složenost

Vrijeme O(N log N), memorija O(N).

## Važne provjere

Traži se podniz, ne segment.

Za strogo rastući koristi lower_bound, ne upper_bound.

## Primjer 1

Ulaz:

```text
8
10 9 2 5 3 7 101 18
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
