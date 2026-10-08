# 155. Može li se podijeliti jednako?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 439.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi 0/1 subset-sum za odluku postoji li podskup zbira polovine ukupne sume.

## Zadatak

Dato je N pozitivnih brojeva. Možemo li ih podijeliti u dvije grupe tako da zbirovi grupa budu jednaki? Svaki broj mora pripasti tačno jednoj grupi.

## Ulaz

N, zatim N pozitivnih brojeva.

## Izlaz

DA ili NE.

## Ograničenja

N <= 200, zbir svih brojeva <= 200000.

## Razumijevanje i postupak

Ako je total neparan, odgovor je odmah NE. Inače trebamo podskup zbira total/2. Boolean DP označava koje sume možemo postići koristeći svaki element najviše jednom.

Zašto postupak daje tačan rezultat? Princip optimalnosti: optimalno rješenje se sastoji od optimalnih rješenja relevantnih manjih stanja; prijelaz razmatra sve legalne posljednje odluke.

## Koraci

1. Ako total%2==1 -> NE.
2. target=total//2; dp[0]=True.
3. Za svaki x prolazi s od target naniže i postavi dp[s] |= dp[s-x].
4. Odgovor dp[target].

## Složenost

Vrijeme O(N*SUM), memorija O(SUM).

## Važne provjere

Sume se ažuriraju opadajuće.

Brojevi nisu neograničene kovanice; svaki se koristi jednom.

## Primjer 1

Ulaz:

```text
6
1 5 11 5 2 2
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
