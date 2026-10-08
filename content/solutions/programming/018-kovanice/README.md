# 018. KOVANICE

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 105.

Gradska/općinska takmičenja za osnovne škole, 2021. · [A1], PDF str. 40.

## Zadatak

Iznos N sastavi s najmanje kovanica vrijednosti 5, 2 i 1.

## Ulaz

Jedan cijeli broj N.

## Izlaz

Broj petica, dvojki i jedinica, svaki u svom redu.

## Ograničenja

1 ≤ N ≤ 100.

## Razumijevanje i postupak

Podijelimo iznos sa 5: količnik je broj petica, a ostatak još neisplaćeni dio. Preostali iznos zatim podijelimo sa 2. Nakon toga može ostati samo 0 ili 1.

Nije dovoljno reći „uvijek uzmi najveću kovanicu“: takvo pravilo nije tačno za proizvoljne apoene. Za ove apoene dvije jedinice možemo zamijeniti jednom dvojkom. Iznos 5 isplaćen manjim kovanicama traži najmanje tri kovanice; petica taj broj smanjuje.

Zašto postupak daje tačan rezultat? Za zadani broj petica ostatak se najkraće plaća dvojkama i eventualno jednom jedinicom. Smanjivanje broja petica za jednu povećava ostatak za 5, što traži najmanje dvije dodatne manje kovanice; ukupan broj zato ne pada. Najviše mogućih petica daje minimum.

## Koraci

1. Odredi N // 5 petica i ostatak N % 5.
2. Od ostatka odredi dvojke i novi ostatak.
3. Posljednji ostatak predstavlja broj jedinica.

## Složenost

Vrijeme O(1); memorija O(1).

## Važne provjere

Ne ispisati samo ukupan broj kovanica.

Pohlepni izbor ovdje zavisi od skupa apoena.

## Primjer 1

Ulaz:

```text
47
```

Izlaz:

```text
9
1
0
```

Devet petica daje 45. Preostale 2 plaćamo jednom dvojkom; jedinice nisu potrebne.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
