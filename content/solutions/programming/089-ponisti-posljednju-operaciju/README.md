# 089. Poništi posljednju operaciju

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 262.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik modelira undo mehanizam stekom.

## Zadatak

Dato je N operacija. Pozitivan ili negativan broj x različit od 0 znači “dodaj x”. Vrijednost 0 znači “poništi posljednje još neponišteno dodavanje”, ako postoji. Na kraju ispiši zbir preostalih vrijednosti.

## Ulaz

Prvi red N. Drugi red N cijelih brojeva koji opisuju operacije.

## Izlaz

Ispisati konačni zbir.

## Ograničenja

1 <= N <= 2*10^5.

## Razumijevanje i postupak

Undo uvijek djeluje na posljednju aktivnu operaciju. To je ponovo LIFO obrazac. Zbir možemo održavati zajedno sa stekom da ne sabiramo sve na kraju.

## Koraci

1. Ako je x!=0, stavi x na stek i dodaj ga sumi.
2. Ako je x==0 i stek nije prazan, skini vrh i oduzmi ga od sume.
3. Ispiši sumu.

## Složenost

Vrijeme O(N); memorija O(N).

## Važne provjere

Nula je naredba, ne podatak koji se stavlja na stek.

Poništavanje praznog steka se samo ignoriše prema tekstu zadatka.

## Primjer 1

Ulaz:

```text
7
5 3 0 8 2 0 4
```

Izlaz:

```text
17
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
