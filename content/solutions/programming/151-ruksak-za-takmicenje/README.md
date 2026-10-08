# 151. Ruksak za takmičenje

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 431.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primjenjuje 0/1 knapsack i razumije zašto se kapacitet obilazi opadajuće.

## Zadatak

N predmeta ima težinu w_i i vrijednost v_i. Ruksak nosi najviše W. Svaki predmet se može uzeti najviše jednom. Odredi najveću ukupnu vrijednost.

## Ulaz

N W, zatim N redova w v.

## Izlaz

Maksimalna vrijednost.

## Ograničenja

N <= 300, W <= 200000.

## Razumijevanje i postupak

dp[c] je najbolja vrijednost sa kapacitetom c nakon obrađenih predmeta. Za predmet (w,v) prolazimo c opadajuće da se isto ažuriranje ne iskoristi ponovo u istoj iteraciji.

Zašto postupak daje tačan rezultat? Princip optimalnosti: optimalno rješenje se sastoji od optimalnih rješenja relevantnih manjih stanja; prijelaz razmatra sve legalne posljednje odluke.

## Koraci

1. dp[0..W]=0.
2. Za svaki predmet: for c=W..w: dp[c]=max(dp[c],dp[c-w]+v).
3. Odgovor dp[W].

## Složenost

Vrijeme O(NW), memorija O(W).

## Važne provjere

Kapacitet mora ići opadajuće za 0/1 verziju.

Vrijednost može tražiti 64-bitni tip.

## Primjer 1

Ulaz:

```text
4 7
1 1
3 4
4 5
5 7
```

Izlaz:

```text
9
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
