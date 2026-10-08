# 012. Kontrolna cifra

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 92.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primjenjuje aritmetiku nad ciframa i pažljivo implementira formulu iz teksta.

## Zadatak

Dat je šestocifreni identifikacioni broj N. Kontrolna vrijednost dobija se tako što se cifre, slijeva nadesno, množe težinama 1,2,3,4,5,6, rezultati saberu, a zatim uzme ostatak pri dijeljenju sa 11. Odredi kontrolnu vrijednost.

## Ulaz

Jedan cijeli broj N sa tačno šest cifara.

## Izlaz

Jedan cijeli broj od 0 do 10.

## Ograničenja

100000 <= N <= 999999.

## Razumijevanje i postupak

Najjednostavnije je broj pretvoriti u string. Tada je redoslijed cifara očuvan, a težina cifre na indeksu i iznosi i+1. Nema potrebe za petljom sa stepenima broja 10.

Zašto postupak daje tačan rezultat? Petlja tačno jednom obrađuje svaku od šest cifara i primjenjuje definiciju iz zadatka, pa je dobijeni zbir upravo propisana kontrolna suma.

## Koraci

1. Pretvori N u string s.
2. Za i=0..5 dodaj int(s[i])*(i+1).
3. Ispiši zbir mod 11.

## Složenost

Vrijeme O(1), memorija O(1).

## Važne provjere

Težine počinju od 1, ne od 0.

Ne obrnuti redoslijed cifara pri aritmetičkom izdvajanju.

## Primjer 1

Ulaz:

```text
352714
```

Izlaz:

```text
10
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
