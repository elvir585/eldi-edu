# 040. Najkraći skupi segment

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 151.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi dva pokazivača za najkraći segment sa sumom barem S kod pozitivnih elemenata.

## Zadatak

Dat je niz pozitivnih cijelih brojeva. Odredi minimalnu dužinu uzastopnog segmenta čiji je zbir najmanje S. Ako takav segment ne postoji, ispiši 0.

## Ulaz

N S, zatim N pozitivnih brojeva.

## Izlaz

Minimalna dužina ili 0.

## Ograničenja

1<=N<=200000, 1<=a_i,S<=10^18.

## Razumijevanje i postupak

Kod pozitivnih brojeva povećavanje desne granice samo povećava zbir. Kada je zbir dovoljan, pomjeramo lijevu granicu koliko god možemo da segment skratimo.

Zašto postupak daje tačan rezultat? Za svaku desnu granicu petlja uklanja sve suvišne lijeve elemente i ostavlja najkraći segment koji završava u r. Globalni minimum preko svih r je traženi odgovor.

## Koraci

1. l=0,cur=0,best=N+1.
2. Za svaki r dodaj a[r].
3. Dok cur>=S: ažuriraj best, oduzmi a[l], l++.

## Složenost

Vrijeme O(N), memorija O(N) ili O(1) pored ulaza.

## Važne provjere

Algoritam se oslanja na pozitivnost elemenata.

best se ažurira prije uklanjanja lijevog elementa.

## Primjer 1

Ulaz:

```text
6 11
1 2 7 3 5 2
```

Izlaz:

```text
3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
