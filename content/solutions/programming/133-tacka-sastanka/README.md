# 133. Tačka sastanka

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 386.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi svojstvo medijane za minimizaciju zbirne Manhattan udaljenosti.

## Zadatak

N učenika nalazi se u tačkama (x_i,y_i) na cjelobrojnoj mreži. Izaberi cjelobrojnu tačku (X,Y) koja minimizira zbir |x_i-X|+|y_i-Y|. Ispiši minimalni zbir udaljenosti.

## Ulaz

N, zatim N parova x y.

## Izlaz

Minimalni zbir Manhattan udaljenosti.

## Ograničenja

N <= 300000, |koordinate| <= 10^9.

## Razumijevanje i postupak

Manhattan suma se razdvaja na x-dio i y-dio. U jednoj dimenziji zbir apsolutnih odstupanja minimizira bilo koja medijana. Zato nezavisno biramo medijanu x koordinata i medijanu y koordinata.

Zašto postupak daje tačan rezultat? Ako je stanje ispravno poslije prvih i elemenata, lokalno pravilo ga tačno ažurira nakon elementa i+1. Indukcijom stanje je tačno na kraju.

## Koraci

1. Sortiraj sve x i sve y.
2. Uzmi mx=x_sorted[N//2], my=y_sorted[N//2].
3. Saberi |x-mx|+|y-my| za sve tačke.

## Složenost

Vrijeme O(N log N), memorija O(N).

## Važne provjere

Ne koristiti prosjek; apsolutna odstupanja minimizira medijana.

x i y se mogu optimizovati nezavisno.

## Primjer 1

Ulaz:

```text
4
0 0
2 0
0 2
2 2
```

Izlaz:

```text
8
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
