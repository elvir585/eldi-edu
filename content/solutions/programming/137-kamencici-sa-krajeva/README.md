# 137. Kamenčići sa krajeva

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 398.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Rješavati igru optimalnih poteza pomoću DP-a po intervalima.

## Zadatak

U nizu je N hrpica kamenčića, a i-ta vrijedi a_i bodova. Dva igrača naizmjenično uzimaju lijevu ili desnu krajnju hrpicu; prvi igrač počinje i oba igraju optimalno. Odredi najveću moguću razliku (bodovi prvog - bodovi drugog) koju prvi može garantovati.

## Ulaz

U prvom redu N, u drugom N vrijednosti.

## Izlaz

Ispisati optimalnu razliku.

## Ograničenja

1 ≤ N ≤ 2000, |a_i| ≤ 10^9.

## Razumijevanje i postupak

Neka dp[l][r] označava najbolju razliku koju igrač na potezu može ostvariti na segmentu l..r. Ako uzme lijevo, dobija a[l], ali protivnik zatim može ostvariti dp[l+1][r], pa je neto a[l]-dp[l+1][r]. Slično za desno. Uzimamo maksimum.

## Koraci

1. Baza: dp[i][i]=a[i].
2. Za dužine 2..N računati dp[l][r]=max(a[l]-dp[l+1][r], a[r]-dp[l][r-1]).
3. Odgovor dp[0][N-1].

## Složenost

O(N²) vrijeme i O(N²) memorija u jasnoj verziji.

## Primjer 1

Ulaz:

```text
4
4 7 2 9
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
