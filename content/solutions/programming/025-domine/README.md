# 025. DOMINE

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 119.

IV gradsko/općinsko takmičenje za osnovne škole, 2023. · [A3], PDF str. 34.

## Zadatak

Na ploču M × N postavi najviše domina 2 × 1, bez preklapanja i izlaska iz ploče.

## Ulaz

M i N.

## Izlaz

Najveći broj domina.

## Ograničenja

1 ≤ M,N ≤ 16; rotacija je dopuštena.

## Razumijevanje i postupak

Jedna domina zauzima dva polja. Zato odgovor ne može biti veći od cijelog dijela broja MN/2. Ali gornja granica sama po sebi nije dokaz: treba pokazati raspored koji je dostiže.

Ako je jedna dimenzija parna, ploču popunimo parovima po toj dimenziji. Ako su obje neparne, popunimo sve osim posljednje kolone, a zatim u toj koloni uparimo sva polja osim jednog. Tako u cijeloj ploči ostaje samo jedno prazno polje.

Zašto postupak daje tačan rezultat? Svaki raspored ima najviše floor(MN/2) domina jer se nijedno polje ne smije ponoviti. Opisano popločavanje ostvaruje tu vrijednost i za parnu i za neparnu površinu, pa je granica optimalna.

## Koraci

1. Izračunaj broj polja M·N.
2. Podijeli cjelobrojno sa 2.
3. Ispiši rezultat.

## Složenost

Vrijeme O(1); memorija O(1).

## Važne provjere

Ne zaokruživati naviše.

Izraz (M//2)·N nije dovoljan kada je M neparan, a N paran.

## Primjer 1

Ulaz:

```text
5 7
```

Izlaz:

```text
17
```

Površina je 35. Sedamnaest domina pokriva 34 polja, a jedno ostaje prazno.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
