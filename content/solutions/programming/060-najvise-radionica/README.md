# 060. Najviše radionica

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 194.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primjenjuje i dokazuje klasični greedy izbor najranijeg završetka.

## Zadatak

Dato je N radionica sa vremenima početka s_i i završetka e_i. Jedna osoba može prisustvovati radionici ako se ne preklapa sa prethodno izabranom; radionica koja počinje tačno kada druga završava je dozvoljena. Odredi najveći broj radionica.

## Ulaz

N, zatim N redova s e.

## Izlaz

Maksimalan broj izabranih radionica.

## Ograničenja

1 <= N <= 300000, 0 <= s_i < e_i <= 10^9.

## Razumijevanje i postupak

Sortiranje po završetku ostavlja što više prostora za budućnost. Uzimamo prvi interval, zatim svaki naredni čiji je početak >= kraj posljednjeg izabranog.

Zašto postupak daje tačan rezultat? Exchange argument: ako optimalno rješenje prvo uzima interval koji završava kasnije, možemo ga zamijeniti najranije završavajućim bez smanjenja broja budućih mogućnosti.

## Koraci

1. Sortiraj parove po e rastuće.
2. last=-inf, ans=0.
3. Ako s>=last, izaberi interval: ans++, last=e.

## Složenost

Vrijeme O(N log N), memorija O(N).

## Važne provjere

Sortirati po završetku, ne po početku.

Kompatibilnost je s>=last_end.

## Primjer 1

Ulaz:

```text
6
1 4
3 5
0 6
5 7
8 9
5 9
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
