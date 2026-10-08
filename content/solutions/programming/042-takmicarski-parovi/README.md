# 042. Takmičarski parovi

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 155.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Pohlepno uparuje dvije sortirane grupe uz minimalni prag razlike.

## Zadatak

Imamo N mlađih i M starijih učenika sa nivoima znanja. Par je dozvoljen ako je apsolutna razlika nivoa najviše D. Svaki učenik može biti u najviše jednom paru. Odredi najveći broj parova.

## Ulaz

N M D, zatim N nivoa prve i M nivoa druge grupe.

## Izlaz

Maksimalan broj parova.

## Ograničenja

N,M<=200000, D<=10^9.

## Razumijevanje i postupak

Nakon sortiranja gledamo najmanje neiskorištene vrijednosti. Ako su dovoljno blizu, uparimo ih. Ako je A[i] previše mali, ni sa jednim kasnijim većim B neće biti bliži, pa i možemo odbaciti; simetrično za B[j].

Zašto postupak daje tačan rezultat? Kada najmanji element jedne strane više ne može biti uparen sa najmanjim druge zbog prevelike razlike u jednom smjeru, budući elementi druge strane su još nepovoljniji. Zato je odbacivanje sigurno.

## Koraci

1. Sortiraj oba niza.
2. i=j=0.
3. Ako |A[i]-B[j]|<=D, napravi par i povećaj oba.
4. Ako A[i]<B[j]-D, povećaj i; inače j.

## Složenost

Vrijeme O(N log N + M log M), memorija O(N+M).

## Važne provjere

Nije dovoljno porediti elemente istog indeksa.

Sortiranje je dio dokaza, ne samo optimizacija.

## Primjer 1

Ulaz:

```text
5 4 2
1 4 7 10 12
2 6 9 13
```

Izlaz:

```text
4
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
