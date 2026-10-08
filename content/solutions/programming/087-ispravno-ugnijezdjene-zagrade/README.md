# 087. Ispravno ugniježđene zagrade

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 258.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi stek za provjeru pravilnog ugniježđivanja tri vrste zagrada.

## Zadatak

Dat je string sastavljen samo od znakova (), [] i {}. Odredi da li je zapis pravilno ugniježđen.

## Ulaz

Jedan string S.

## Izlaz

Ispisati DA ili NE.

## Ograničenja

1 <= |S| <= 2*10^5.

## Razumijevanje i postupak

Zatvorena zagrada mora odgovarati posljednjoj još nezatvorenoj otvorenoj zagradi. Upravo to radi LIFO struktura - stek.

## Koraci

1. Za otvorenu zagradu stavi znak na stek.
2. Za zatvorenu provjeri da stek nije prazan i da vrh odgovara.
3. Na kraju stek mora biti prazan.

## Složenost

Vrijeme O(N); memorija O(N).

## Važne provjere

Samo prebrojavanje broja otvorenih i zatvorenih zagrada nije dovoljno.

Provjeriti praznost steka prije čitanja vrha.

## Primjer 1

Ulaz:

```text
{[()()]}
```

Izlaz:

```text
DA
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
