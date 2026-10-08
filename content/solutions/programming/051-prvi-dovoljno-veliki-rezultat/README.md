# 051. Prvi dovoljno veliki rezultat

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 175.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik primjenjuje binarno pretraživanje na sortiranom nizu i nalazi prvu poziciju koja zadovoljava uslov.

## Zadatak

Dat je neopadajuće sortiran niz A i vrijednost X. Nađi prvu poziciju na kojoj je A[i] >= X. Pozicije su numerisane od 1. Ako takva pozicija ne postoji, ispiši -1.

## Ulaz

Prvi red: N X. Drugi red: N cijelih brojeva.

## Izlaz

Ispisati traženu 1-baziranu poziciju ili -1.

## Ograničenja

1 <= N <= 2*10^5.

## Razumijevanje i postupak

Ne tražimo samo da li X postoji. Tražimo granicu: lijevo su vrijednosti <X, a od odgovora nadalje vrijednosti su >=X. To je tipičan lower_bound obrazac.

## Koraci

1. Postavi l=0, r=N.
2. Dok l<r, uzmi m=(l+r)//2.
3. Ako A[m] >= X, pomjeri r=m; inače l=m+1.
4. Ako l==N, nema odgovora; inače odgovor je l+1.

## Složenost

Vrijeme O(log N); memorija O(1).

## Važne provjere

Binarno pretraživanje zahtijeva monotoni poredak.

Granice [l,r) smanjuju rizik od beskonačne petlje.

## Primjer 1

Ulaz:

```text
7 8
1 3 5 8 8 10 14
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
