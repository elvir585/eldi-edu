# 062. Minimalni kapacitet kamiona

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 199.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Binarno pretražuje minimalni kapacitet uz greedy provjeru broja potrebnih dana/vožnji.

## Zadatak

Paketi težina a_1..a_N moraju se prevesti redom, bez promjene poretka. U jednoj vožnji kamion uzima uzastopne pakete ukupne težine najviše C. Dozvoljeno je najviše D vožnji. Odredi minimalni kapacitet C.

## Ulaz

N D, zatim N pozitivnih težina.

## Izlaz

Minimalni kapacitet.

## Ograničenja

1 <= D <= N <= 300000, a_i <= 10^9.

## Razumijevanje i postupak

Za fiksni C greedy puni svaku vožnju što je više moguće redom. To minimizira broj vožnji za taj C. Ako treba <=D vožnji, svaki veći kapacitet je takođe moguć.

Zašto postupak daje tačan rezultat? Ako je rješenje moguće sa X, moguće je i sa svakim većim X; zato skup odgovora ima oblik F...F T...T i binarna pretraga nalazi prvu T poziciju.

## Koraci

1. lo=max(a), hi=sum(a).
2. feasible(C): prolazi niz i počinje novu vožnju kada bi sljedeći paket prešao C.
3. Ako broj vožnji<=D, smanji hi; inače povećaj lo.

## Složenost

Vrijeme O(N log(sum a)), memorija O(N) ili O(1) dodatno.

## Važne provjere

Redoslijed paketa se ne smije mijenjati.

Greedy provjera računa minimalan broj vožnji za dati C.

## Primjer 1

Ulaz:

```text
5 3
7 2 5 10 8
```

Izlaz:

```text
14
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
