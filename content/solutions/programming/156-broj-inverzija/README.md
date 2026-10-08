# 156. Broj inverzija

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 441.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Broji parove i<j sa a_i>a_j u O(N log N) pomoću merge sorta.

## Zadatak

Dat je niz od N cijelih brojeva. Inverzija je par indeksa i<j za koji je a_i>a_j. Odredi ukupan broj inverzija.

## Ulaz

N, zatim N cijelih brojeva.

## Izlaz

Broj inverzija.

## Ograničenja

N <= 300000.

## Razumijevanje i postupak

Dvostruka petlja je O(N^2). U merge sortu su obje polovine već sortirane. Kada b[j] iz desne polovine ide prije a[i] iz lijeve, on je manji od svih preostalih lijevih elemenata, pa odmah dodajemo njihov broj.

Zašto postupak daje tačan rezultat? Svaka inverzija pripada tačno jednom nivou rekurzije: nivou na kojem su njena dva elementa prvi put u različitim polovinama. Merge je zato broji tačno jednom.

## Koraci

1. Rekurzivno riješi lijevu i desnu polovinu.
2. Merge sa pokazivačima i,j.
3. Ako left[i]<=right[j], uzmi lijevi. Inače dodaj len(left)-i inverzija i uzmi desni.

## Složenost

Vrijeme O(N log N), memorija O(N).

## Važne provjere

Broj inverzija može biti oko N^2/2, pa treba 64-bitni tip.

Jednaki elementi nisu inverzija jer uslov traži >.

## Primjer 1

Ulaz:

```text
5
2 4 1 3 5
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
