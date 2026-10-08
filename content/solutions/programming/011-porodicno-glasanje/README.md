# 011. Porodično glasanje

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 90.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Akumulirati ponderisane glasove po kandidatu i riješiti izjednačenje.

## Zadatak

Na izborima za predsjednika vijeća učestvuje N kandidata, označenih 1..N. Glasanje obavlja M porodica: svaka porodica glasa za jednog kandidata, a njen glas vrijedi onoliko koliko porodica ima članova. Pobjeđuje kandidat s najviše ukupnih glasova; kod izjednačenja manji broj kandidata ima prednost.

## Ulaz

U prvom redu su N i M. U narednih M redova dati su kandidat a i broj članova b.

## Izlaz

Ispisati oznaku pobjednika.

## Ograničenja

2 ≤ N ≤ 100000, 1 ≤ M ≤ 200000, 1 ≤ b ≤ 100.

## Razumijevanje i postupak

Za svakog kandidata vodimo zbir njegovih pondera. Zatim prolazimo kroz kandidate redom od 1 naviše. Ako ažuriramo pobjednika samo kada nađemo strogo veći zbir, automatski zadržavamo manju oznaku pri izjednačenju.

## Koraci

1. Napraviti niz glasovi veličine N+1.
2. Za svaku porodicu dodati b u glasovi[a].
3. Proći kandidatima 1..N i čuvati najveći zbir.

## Složenost

O(N+M) vrijeme i O(N) memorija.

## Primjer 1

Ulaz:

```text
3 4
1 5
2 7
1 4
3 8
```

Izlaz:

```text
1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
