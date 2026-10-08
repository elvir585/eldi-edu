# 083. Koliko je prostih?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 248.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Gradi Eratostenovo sito i prefiks broja prostih za veliki broj upita.

## Zadatak

Dato je Q upita. Svaki upit sadrži n i traži broj prostih brojeva <= n.

## Ulaz

Q, zatim Q brojeva n.

## Izlaz

Za svaki upit jedan broj.

## Ograničenja

1 <= Q <= 200000, 0 <= n <= 2000000.

## Razumijevanje i postupak

Najveći n određuje granicu predobrade. Sito jednom označi sve proste do MAX, a prefiks prime_count[i] daje broj prostih <= i u O(1) po upitu.

Zašto postupak daje tačan rezultat? Najmanji prosti djelilac složenog broja p označiće taj broj kada obrađujemo p, pa nijedan složen broj ne ostaje označen kao prost.

## Koraci

1. Pročitaj sve upite i nađi M=max(n).
2. Napravi is_prime[0..M], označi 0 i 1 kao složene.
3. Za p do sqrt(M) precrtaj višekratnike od p*p.
4. Napravi prefiks broja True vrijednosti.

## Složenost

Vrijeme O(M log log M + Q), memorija O(M).

## Važne provjere

Broj 1 nije prost.

Kod precrtavanja početi od p*p, ali koristiti 64-bitni proizvod.

## Primjer 1

Ulaz:

```text
4
1
10
20
2
```

Izlaz:

```text
0
4
8
1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
