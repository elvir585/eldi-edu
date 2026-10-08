# 150. Najmanji broj kovanica

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 429.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Rješava unbounded coin change za minimalan broj elemenata.

## Zadatak

Dato je N vrijednosti kovanica i cilj S. Svaku vrijednost možeš koristiti neograničeno mnogo puta. Odredi najmanji broj kovanica kojim se dobija tačno S ili -1.

## Ulaz

N S, zatim N pozitivnih vrijednosti.

## Izlaz

Minimalan broj ili -1.

## Ograničenja

N <= 100, S <= 200000.

## Razumijevanje i postupak

dp[x] je najmanji broj kovanica za zbir x. Za svaku vrijednost x razmatramo posljednju kovanicu c: ako je x-c dostižan, kandidat je dp[x-c]+1.

Zašto postupak daje tačan rezultat? Princip optimalnosti: optimalno rješenje se sastoji od optimalnih rješenja relevantnih manjih stanja; prijelaz razmatra sve legalne posljednje odluke.

## Koraci

1. dp[0]=0, ostalo INF.
2. Za x od 1 do S, za svaku c<=x relaksiraj dp[x].
3. Ako dp[S] ostane INF, odgovor -1.

## Složenost

Vrijeme O(N*S), memorija O(S).

## Važne provjere

Ovo nije 0/1 ruksak: ista vrijednost se može koristiti više puta.

Greedy uzimanje najveće kovanice nije opšte tačno.

## Primjer 1

Ulaz:

```text
3 11
1 5 7
```

Izlaz:

```text
3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
