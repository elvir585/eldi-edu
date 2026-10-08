# 065. Izaberi tačno K brojeva

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 208.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik oblikuje backtracking sa parametrima pozicije, broja izabranih elemenata i trenutnog zbira.

## Zadatak

Dat je niz N različitih pozitivnih brojeva. Prebroj koliko podskupova od tačno K elemenata ima zbir S.

## Ulaz

Prvi red: N K S. Drugi red: N različitih pozitivnih brojeva.

## Izlaz

Ispisati broj odgovarajućih izbora.

## Ograničenja

1 <= N <= 25, 0 <= K <= N, S <= 10^9.

## Razumijevanje i postupak

Na svakoj poziciji imamo dvije odluke: preskočiti element ili ga uzeti. Stanje je dovoljno opisati sa i, chosen i sum. Pozitivnost omogućava rez ako sum>S.

## Koraci

1. Ako chosen==K, doprinos je 1 samo ako sum==S.
2. Ako i==N ili chosen>K ili sum>S, nema rješenja.
3. Rekurzivno saberi granu bez A[i] i granu sa A[i].

## Složenost

Najgore O(2^N), praktično manje zbog K i rezova; dubina O(N).

## Važne provjere

Rez sum>S važi zato što su svi brojevi pozitivni.

Ne brojati permutacije istog podskupa; indeks uvijek ide naprijed.

## Primjer 1

Ulaz:

```text
5 2 7
1 2 3 4 5
```

Izlaz:

```text
2
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
