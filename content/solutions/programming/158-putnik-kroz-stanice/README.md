# 158. Putnik kroz stanice

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 447.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Bitmask DP-om rješava mali TSP: posjetiti sve tačke i vratiti se na početak.

## Zadatak

Dato je N tačaka sa cjelobrojnim koordinatama, 2<=N<=16. Putnik počinje u tački 1, mora posjetiti svaku tačku tačno jednom i vratiti se u 1. Cijena prelaska je Manhattan udaljenost. Odredi minimalnu ukupnu cijenu.

## Ulaz

N, zatim N parova x y.

## Izlaz

Minimalna cijena ture.

## Ograničenja

2 <= N <= 16, |koordinate| <= 10^6.

## Razumijevanje i postupak

dp[mask][i] je minimalna cijena puta koji počinje u 0, posjeti tačno mask i završava u i. Iz stanja dodajemo novi j. Na kraju iz punog maska dodajemo povratak iz i u 0.

Zašto postupak daje tačan rezultat? Svaka ruta odgovara jedinstvenom redoslijedu dodavanja elemenata u masku. Razmatranjem svih prethodnih stanja uz minimum dobijamo optimalnu rutu za svaku masku i kraj.

## Koraci

1. INF tabela 2^N x N; dp[1][0]=0.
2. Za svaki mask koji sadrži 0 i svaki završetak i, pokušaj svaki j koji nije u maski.
3. Relaksiraj dp[mask|1<<j][j].
4. Odgovor min_i dp[full][i]+dist(i,0).

## Složenost

Vrijeme O(N^2 2^N), memorija O(N 2^N).

## Važne provjere

N=16 je malo upravo zbog faktora 2^N.

Maska mora sadržati početnu tačku 0 u svim relevantnim stanjima.

## Primjer 1

Ulaz:

```text
4
0 0
1 0
1 1
0 1
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
