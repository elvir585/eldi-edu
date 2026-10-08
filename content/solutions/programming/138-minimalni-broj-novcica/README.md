# 138. Minimalni broj novčića

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 400.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primijeniti jednodimenzionalni DP za neograničen broj elemenata.

## Zadatak

Postoji K vrsta novčića vrijednosti c_i. Svaka vrsta se može koristiti neograničeno mnogo puta. Odredi najmanji broj novčića potreban za tačan iznos S ili -1 ako ga nije moguće sastaviti.

## Ulaz

U prvom redu K S, u drugom K vrijednosti c_i.

## Izlaz

Ispisati minimalan broj novčića ili -1.

## Ograničenja

1 ≤ K ≤ 100, 1 ≤ S ≤ 100000, 1 ≤ c_i ≤ S.

## Razumijevanje i postupak

DP[x] je minimalan broj novčića za iznos x. Počinjemo sa dp[0]=0, ostalo beskonačno. Za svaki x pokušavamo dodati svaki novčić c: ako x≥c i dp[x-c] postoji, kandidat je dp[x-c]+1.

## Koraci

1. dp[0]=0, ostalo INF.
2. Za x=1..S, za svaki c≤x ažurirati dp[x].
3. Ako dp[S] ostane INF, ispisati -1.

## Složenost

O(K·S) vrijeme i O(S) memorija.

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
