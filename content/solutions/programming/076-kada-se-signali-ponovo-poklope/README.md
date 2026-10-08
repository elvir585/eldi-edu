# 076. Kada se signali ponovo poklope

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 234.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik povezuje NZS sa periodičnim događajima i koristi NZD za sigurno računanje NZS-a.

## Zadatak

Dva signalna uređaja trepnu istovremeno u trenutku 0. Prvi zatim trepće svakih a sekundi, a drugi svakih b sekundi. Nakon koliko sekundi će ponovo trepnuti istovremeno?

## Ulaz

Jedan red sadrži a i b.

## Izlaz

Ispisati najmanji pozitivan zajednički trenutak.

## Ograničenja

1 <= a,b <= 10^9.

## Razumijevanje i postupak

Traži se najmanji zajednički sadržalac. Formula NZS(a,b)=a/NZD(a,b)*b izbjegava nepotrebno rano množenje velikih brojeva.

## Koraci

1. Izračunaj g=NZD(a,b).
2. Izračunaj a/g*b.
3. Ispiši rezultat.

## Složenost

Vrijeme O(log min(a,b)); memorija O(1).

## Važne provjere

Ne koristiti a*b/g ako postoji rizik prelijevanja u drugim zadacima.

Ne zamijeniti NZD i NZS.

## Primjer 1

Ulaz:

```text
6 8
```

Izlaz:

```text
24
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
