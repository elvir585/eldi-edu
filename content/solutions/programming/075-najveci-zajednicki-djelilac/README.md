# 075. Najveći zajednički djelilac

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 232.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik primjenjuje Euklidov algoritam i razlikuje efikasan algoritam od provjere svih djelilaca.

## Zadatak

Za data pozitivna cijela broja a i b odredi njihov najveći zajednički djelilac (NZD).

## Ulaz

Jedan red sadrži dva cijela broja a i b.

## Izlaz

Ispisati NZD(a,b).

## Ograničenja

1 <= a,b <= 10^18.

## Razumijevanje i postupak

Ako je a = qb + r, svaki zajednički djelilac brojeva a i b dijeli i ostatak r. Zato par (a,b) možemo zamijeniti parom (b,a mod b). Ostatak se smanjuje i postupak brzo završava.

## Koraci

1. Dok je b različit od nule izračunaj a mod b.
2. Postavi (a,b) = (b,a mod b).
3. Kada b postane 0, a je NZD.

## Složenost

Vrijeme O(log min(a,b)); memorija O(1).

## Važne provjere

Petlja koja ide do min(a,b) je nepotrebno spora za velike brojeve.

Ne zamijeniti redoslijed ažuriranja a i b pogrešno.

## Primjer 1

Ulaz:

```text
48 18
```

Izlaz:

```text
6
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
