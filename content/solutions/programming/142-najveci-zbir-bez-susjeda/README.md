# 142. Najveći zbir bez susjeda

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 408.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Formuliše jednodimenzionalni DP sa izborom uzmi/preskoči.

## Zadatak

Dat je niz vrijednosti. Izaberi podskup indeksa tako da nijedna dva izabrana indeksa nisu susjedna i da zbir bude maksimalan. Dozvoljeno je ne izabrati ništa.

## Ulaz

N, zatim N cijelih vrijednosti.

## Izlaz

Maksimalan zbir.

## Ograničenja

N<=1000000, |a_i|<=10^9.

## Razumijevanje i postupak

Za element x imamo dvije mogućnosti: preskočiti ga i zadržati najbolji zbir do i-1, ili uzeti ga, pa prethodni izabrani može biti najviše i-2.

Zašto postupak daje tačan rezultat? Svako optimalno rješenje za prefiks ili ne sadrži posljednji element (prvi slučaj), ili ga sadrži i zato ne sadrži pretposljednji (drugi slučaj). Maksimum pokriva oba iscrpna slučaja.

## Koraci

1. prev2=dp[i-2], prev1=dp[i-1].
2. new=max(prev1,prev2+x).
3. Pomjeri dvije varijable.

## Složenost

Vrijeme O(N), memorija O(1).

## Važne provjere

Ako zadatak zahtijeva bar jedan izbor, početne vrijednosti bi bile drugačije; ovdje je prazan skup dozvoljen.

## Primjer 1

Ulaz:

```text
6
5 -2 7 10 -3 8
```

Izlaz:

```text
23
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
