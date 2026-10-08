# 088. Prvi veći desno

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 260.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik primjenjuje monotoni stek i svodi kvadratnu pretragu na linearno vrijeme.

## Zadatak

Za svaki element niza pronađi prvi element desno od njega koji je strogo veći. Ako ga nema, ispiši -1.

## Ulaz

Prvi red N. Drugi red N cijelih brojeva.

## Izlaz

Ispisati N odgovora.

## Ograničenja

1 <= N <= 2*10^5.

## Razumijevanje i postupak

Na steku čuvamo indekse elemenata koji još čekaju prvi veći element. Kada stigne nova vrijednost x, ona rješava sve vrhove steka čija je vrijednost manja od x.

## Koraci

1. ans inicijalno -1.
2. Za svaki i: dok stek nije prazan i A[vrh]<A[i], postavi ans[vrh]=A[i] i skini vrh.
3. Stavi i na stek.

## Složenost

Vrijeme O(N), jer svaki indeks ulazi i izlazi iz steka najviše jednom; memorija O(N).

## Važne provjere

Uslov je strogo veći, zato se jednaki elementi ne skidaju.

Na steku su indeksi, ne nužno same vrijednosti.

## Primjer 1

Ulaz:

```text
5
2 1 4 3 5
```

Izlaz:

```text
4 4 5 5 -1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
