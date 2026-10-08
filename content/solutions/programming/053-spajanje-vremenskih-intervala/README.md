# 053. Spajanje vremenskih intervala

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 179.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik sortira intervale i računa dužinu unije bez dvostrukog brojanja preklapanja.

## Zadatak

Dato je N zatvorenih vremenskih intervala [l,r] na realnoj osi. Izračunaj ukupnu dužinu vremena pokrivenu barem jednim intervalom.

## Ulaz

Prvi red N. Zatim N redova l r, gdje je l<=r.

## Izlaz

Ispisati ukupnu dužinu unije intervala.

## Ograničenja

1 <= N <= 2*10^5, koordinate su cijeli brojevi.

## Razumijevanje i postupak

Sortiranjem po lijevoj granici svi intervali koji mogu produžiti trenutni spojeni blok dolaze uzastopno. Ako novi interval počinje prije ili na kraju trenutnog, spajamo ga; inače zatvaramo blok.

## Koraci

1. Sortiraj intervale po l pa r.
2. Drži trenutni [L,R].
3. Ako l<=R, postavi R=max(R,r).
4. Inače dodaj R-L rezultatu i započni novi blok.
5. Na kraju dodaj posljednji blok.

## Složenost

Vrijeme O(N log N); memorija O(N) za intervale.

## Važne provjere

Dužina realnog intervala [L,R] je R-L, ne R-L+1.

Ne zaboraviti posljednji otvoreni blok.

## Primjer 1

Ulaz:

```text
4
1 4
3 7
10 12
11 15
```

Izlaz:

```text
11
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
