# 154. Najbolji put kroz matricu

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 437.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi grid DP za maksimalni zbir uz poteze desno i dolje.

## Zadatak

Data je matrica R x C cijelih vrijednosti. Kreće se iz (1,1) do (R,C) samo desno ili dolje. Odredi najveći mogući zbir posjećenih ćelija.

## Ulaz

R C, zatim R redova po C brojeva.

## Izlaz

Maksimalni zbir.

## Ograničenja

R*C <= 1000000, |a_ij| <= 10^9.

## Razumijevanje i postupak

Do ćelije (r,c) možemo doći samo odozgo ili slijeva, pa je najbolji zbir vrijednost ćelije plus maksimum ta dva prethodna stanja. Negativne vrijednosti zahtijevaju pravilnu -INF inicijalizaciju granica.

Zašto postupak daje tačan rezultat? Princip optimalnosti: optimalno rješenje se sastoji od optimalnih rješenja relevantnih manjih stanja; prijelaz razmatra sve legalne posljednje odluke.

## Koraci

1. Koristi jedan DP red dužine C+1 inicijalizovan na -INF; dp[1]=0 prije prve ćelije.
2. Za svaku ćeliju j: dp[j]=a+max(dp[j],dp[j-1]).
3. Odgovor dp[C].

## Složenost

Vrijeme O(RC), memorija O(C).

## Važne provjere

Ne inicijalizovati sve dp vrijednosti nulom kada postoje negativni brojevi.

Paziti na redoslijed: dp[j] još predstavlja odozgo, dp[j-1] već slijeva.

## Primjer 1

Ulaz:

```text
3 4
5 1 2 3
2 10 -5 1
1 2 20 4
```

Izlaz:

```text
43
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
