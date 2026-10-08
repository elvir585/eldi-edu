# 059. Brzi zbir intervala

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 192.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Predobrađuje prefiksne sume i odgovara na mnogo intervalnih upita.

## Zadatak

Dat je niz od N cijelih brojeva i Q upita. Svaki upit daje 1-bazne indekse l i r. Za svaki upit ispiši zbir a_l+...+a_r.

## Ulaz

N Q, zatim N brojeva, zatim Q redova l r.

## Izlaz

Po jedan zbir za svaki upit.

## Ograničenja

1 <= N,Q <= 300000, |a_i| <= 10^9.

## Razumijevanje i postupak

Jedan upit se može sabirati O(N), ali Q može biti velik. Prefiks s[i] = zbir prvih i elemenata omogućava odgovor s[r]-s[l-1] u O(1).

Zašto postupak daje tačan rezultat? Svaki element intervala [l,r] pojavljuje se u s[r+1], a svi elementi prije l poništavaju se oduzimanjem s[l].

## Koraci

1. Napravi s dužine N+1 sa s[0]=0.
2. s[i]=s[i-1]+a[i-1].
3. Za svaki 1-bazni l,r ispiši s[r]-s[l-1].

## Složenost

Predobrada O(N), svaki upit O(1), memorija O(N).

## Važne provjere

U C++ zbir mora biti long long.

Ne koristiti s[r]-s[l] za 1-bazne granice.

## Primjer 1

Ulaz:

```text
5 3
2 -1 4 7 3
1 3
2 5
4 4
```

Izlaz:

```text
5
13
7
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
