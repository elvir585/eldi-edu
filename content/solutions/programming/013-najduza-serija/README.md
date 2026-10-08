# 013. Najduža serija

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 94.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Jednim prolazom računa najdužu uzastopnu seriju jednakih znakova.

## Zadatak

Tokom treninga bilježi se niz rezultata sastavljen od znakova P (poen) i G (greška). Odredi dužinu najduže uzastopne serije istog znaka.

## Ulaz

Jedan string S sastavljen samo od P i G.

## Izlaz

Jedan cijeli broj - najveća dužina serije.

## Ograničenja

1 <= |S| <= 200000.

## Razumijevanje i postupak

Čuvamo dužinu trenutne serije i najbolju viđenu dužinu. Kada je novi znak jednak prethodnom, serija se produžava; inače počinje nova serija dužine 1.

Zašto postupak daje tačan rezultat? Svaka maksimalna serija završava ili promjenom znaka ili krajem stringa. best se ažurira nakon svakog proširenja, pa nijedna serija ne može biti propuštena.

## Koraci

1. Postavi cur=best=1.
2. Od drugog znaka poredi S[i] sa S[i-1].
3. Ažuriraj cur i best.

## Složenost

Vrijeme O(N), memorija O(1).

## Važne provjere

Inicijalizovati best na 1 jer string nije prazan.

Ne brojati ukupan broj P ili G - traže se uzastopni znakovi.

## Primjer 1

Ulaz:

```text
PPPGGPPPPG
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
