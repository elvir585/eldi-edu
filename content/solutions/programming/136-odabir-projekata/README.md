# 136. Odabir projekata

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 396.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Formulisati stanje DP-a za ograničen kapacitet i svaki predmet koristiti najviše jednom.

## Zadatak

Na sajmu postoji N projekata. Projekat i zahtijeva t_i minuta prezentacije i donosi v_i bodova. Učenik ima ukupno najviše T minuta i svaki projekat može pogledati najviše jednom. Koliko najviše bodova može prikupiti?

## Ulaz

U prvom redu N T. Zatim N redova t_i v_i.

## Izlaz

Ispisati maksimalan zbir bodova.

## Ograničenja

1 ≤ N ≤ 200, 1 ≤ T ≤ 20000, 1 ≤ t_i ≤ T, 0 ≤ v_i ≤ 10^9.

## Razumijevanje i postupak

DP[x] je maksimalan broj bodova uz tačno/at most x minuta kapaciteta nakon obrađenih projekata. Pošto se svaki projekat smije uzeti samo jednom, x prolazimo opadajuće; tako isti projekat ne može biti iskorišten više puta u istoj iteraciji.

## Koraci

1. dp[0..T]=0.
2. Za svaki (t,v), za x od T do t: dp[x]=max(dp[x],dp[x-t]+v).
3. Odgovor je max(dp).

## Složenost

O(N·T) vrijeme i O(T) memorija.

## Primjer 1

Ulaz:

```text
4 7
3 10
4 11
2 7
5 14
```

Izlaz:

```text
21
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
