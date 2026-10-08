# 132. Broj komponenti poslije svake veze

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 383.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Prati broj povezanih komponenti tokom online dodavanja ivica.

## Zadatak

Imamo N izolovanih čvorova. Dodaje se M neusmjerenih veza jedna po jedna. Nakon svake dodane veze ispiši trenutni broj povezanih komponenti.

## Ulaz

N M, zatim M parova u v.

## Izlaz

M brojeva, po jedan nakon svake veze.

## Ograničenja

N,M <= 300000.

## Razumijevanje i postupak

Početno imamo N komponenti. Svaka union operacija koja zaista spaja dva različita DSU korijena smanjuje broj komponenti za jedan; redundantna ivica ga ne mijenja.

Zašto postupak daje tačan rezultat? Invariant: dva čvora imaju isti predstavnik ako i samo ako su spojena dosadašnjim union operacijama.

## Koraci

1. components=N.
2. Za svaku ivicu ako union uspije: components--.
3. Ispiši components nakon svake ivice.

## Složenost

Amortizovano O((N+M) alpha(N)), memorija O(N).

## Važne provjere

Samo uspješan union smanjuje broj komponenti.

Na početku je svaka tačka posebna komponenta.

## Primjer 1

Ulaz:

```text
5 4
1 2
2 3
4 5
1 3
```

Izlaz:

```text
4
3
2
2
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
