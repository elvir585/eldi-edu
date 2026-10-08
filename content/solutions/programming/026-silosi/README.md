# 026. SILOSI

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 121.

IV gradsko/općinsko takmičenje za osnovne škole, 2023. · [A3], PDF str. 35.

## Zadatak

Tri silosa pune se redom. Odredi sadržaj svakog nakon dolaska količine P.

## Ulaz

Kapaciteti S1,S2,S3, zatim P, svaki u svom redu.

## Izlaz

Tri pohranjene količine, redom.

## Ograničenja

Bilten ne zadaje numeričke gornje granice. Razrada koristi nenegativne cijele količine; u C++-u long long.

## Razumijevanje i postupak

U jedan silos možemo smjestiti najviše njegov kapacitet, ali ne možemo smjestiti više od preostale količine. To je upravo minimum te dvije vrijednosti.

Poslije punjenja prvog silosa oduzmemo spremljenu količinu i isti postupak ponovimo za sljedeći. Jedna kratka petlja zamjenjuje više dugih i gotovo jednakih grananja. Ako ukupni kapacitet nije dovoljan, ostatak se ne pripisuje nijednom silosu.

Zašto postupak daje tačan rezultat? Prije svakog koraka preostalo je tačno ono što nije stalo u ranije silose. Minimum poštuje kapacitet i raspoloživu količinu, a oduzimanje održava isto svojstvo za naredni silos.

## Koraci

1. Preostalo postavi na P.
2. Za svaki kapacitet uzmi minimum kapaciteta i preostalog.
3. Oduzmi pohranjeno i ispiši ga.

## Složenost

Vrijeme O(1); memorija O(1), jer postoje tačno tri silosa.

## Važne provjere

Ne nastaviti koristiti početni P nakon prvog punjenja.

Sadržaj silosa nikada ne smije biti veći od kapaciteta.

## Primjer 1

Ulaz:

```text
6
4
9
13
```

Izlaz:

```text
6
4
3
```

Poslije prvog silosa ostaje 7, poslije drugog 3. Treći zato nije pun.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
