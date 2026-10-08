# 045. Par najbliži cilju

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 162.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Sortira niz i dva pokazivača koristi za približavanje ciljanom zbiru.

## Zadatak

Dat je niz od N cijelih brojeva i cilj X. Izaberi dva različita elementa čiji je zbir po apsolutnoj razlici najbliži X. Ispiši minimalnu razliku |a_i+a_j-X|.

## Ulaz

N X, zatim N cijelih brojeva.

## Izlaz

Minimalna apsolutna razlika.

## Ograničenja

2 <= N <= 300000, |a_i|,|X| <= 10^9.

## Razumijevanje i postupak

Nakon sortiranja gledamo par (l,r). Ako je zbir manji od X, jedini način da ga povećamo bez vraćanja na već odbačene parove jeste l++. Ako je veći, r--. Svaki korak daje kandidat za odgovor.

Zašto postupak daje tačan rezultat? Monotonost sortiranog niza garantuje da pomjeranjem odgovarajuće granice odbacujemo samo kandidate koji ne mogu dati bolji odgovor od upravo analiziranog.

## Koraci

1. Sortiraj a.
2. l=0,r=n-1, ans=veliko.
3. Ažuriraj ans sa trenutnim parom.
4. Ako suma<X pomjeri l, inače ako suma>X pomjeri r; za jednakost odgovor je 0.

## Složenost

Vrijeme O(N log N), memorija O(N) ili O(1) dodatno nakon sortiranja.

## Važne provjere

Elementi moraju biti različite pozicije; uslov l<r to garantuje.

Koristiti 64-bitni tip za zbir.

## Primjer 1

Ulaz:

```text
6 10
1 4 7 12 -2 8
```

Izlaz:

```text
0
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
