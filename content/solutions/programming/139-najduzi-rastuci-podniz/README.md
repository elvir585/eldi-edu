# 139. Najduži rastući podniz

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 402.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik razumije O(N log N) algoritam za dužinu LIS-a pomoću niza tails i binarnog pretraživanja.

## Zadatak

Za niz A odredi dužinu najdužeg strogo rastućeg podniza. Elementi podniza ne moraju biti susjedni, ali redoslijed mora ostati isti.

## Ulaz

Prvi red N. Drugi red N cijelih brojeva.

## Izlaz

Ispisati dužinu LIS-a.

## Ograničenja

1 <= N <= 2*10^5.

## Razumijevanje i postupak

tails[k] čuva najmanju moguću završnu vrijednost nekog rastućeg podniza dužine k+1. Za novi x nalazimo prvu poziciju tails[pos]>=x i zamjenjujemo je sa x; ako takve nema, produžujemo listu.

## Koraci

1. Počni sa praznim tails.
2. Za svaki x nađi lower_bound u tails.
3. Zamijeni pronađenu vrijednost ili dodaj x na kraj.
4. Dužina tails je odgovor.

## Složenost

Vrijeme O(N log N); memorija O(N).

## Važne provjere

tails nije nužno stvarni LIS - njegova dužina jeste ispravna.

Za strogo rastući podniz koristi se lower_bound; za neopadajući bi se koristio upper_bound.

## Primjer 1

Ulaz:

```text
8
3 1 5 2 6 4 9 7
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
