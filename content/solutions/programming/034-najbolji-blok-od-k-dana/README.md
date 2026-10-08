# 034. Najbolji blok od K dana

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 138.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi klizni prozor za zbir fiksne dužine.

## Zadatak

Za niz dnevnih bodova odredi najveći zbir tačno K uzastopnih dana.

## Ulaz

Prvi red: N K. Drugi red: N cijelih brojeva.

## Izlaz

Ispisati najveći zbir prozora dužine K.

## Ograničenja

1 <= K <= N <= 2*10^5, |A[i]| <= 10^9.

## Razumijevanje i postupak

Umjesto da za svaki početak ponovo sabiramo K elemenata, iz starog prozora izbacimo lijevi element i dodamo novi desni.

## Koraci

1. Izračunaj zbir prvih K elemenata.
2. Za i=K..N-1 uradi sum += A[i]-A[i-K].
3. Pamti najveći zbir.

## Složenost

Vrijeme O(N); memorija O(1) pored ulaza.

## Važne provjere

best se mora inicijalizirati prvim prozorom, ne nulom, jer svi brojevi mogu biti negativni.

## Primjer 1

Ulaz:

```text
8 3
2 -1 4 5 -2 3 1 6
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
