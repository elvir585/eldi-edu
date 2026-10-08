# 110. Da li zavisnosti sadrže ciklus?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 319.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi DFS bojenje 0/1/2 za detekciju ciklusa u usmjerenom grafu.

## Zadatak

Za usmjereni graf odredi postoji li usmjereni ciklus.

## Ulaz

Prvi red N M, zatim M usmjerenih ivica a b.

## Izlaz

Ispisati DA ako ciklus postoji, inače NE.

## Ograničenja

1 <= N,M <= 2*10^5.

## Razumijevanje i postupak

Boja 0 znači neobrađen, 1 znači čvor je trenutno na rekurzivnom putu, a 2 znači potpuno završen. Ivica prema čvoru boje 1 zatvara ciklus.

## Koraci

1. Pokreni DFS iz svakog neobrađenog čvora.
2. Na ulazu postavi boju 1.
3. Ako vidiš susjeda boje 1, ciklus postoji.
4. Po završetku postavi boju 2.

## Složenost

Vrijeme O(N+M); memorija O(N+M), uz rekurzivni stek O(N).

## Važne provjere

U neusmjerenom grafu pravilo je drugačije zbog roditeljske ivice.

Boju 2 postaviti tek nakon obrade svih potomaka.

## Primjer 1

Ulaz:

```text
4 4
1 2
2 3
3 1
3 4
```

Izlaz:

```text
DA
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
