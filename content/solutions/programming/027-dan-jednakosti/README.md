# 027. DAN JEDNAKOSTI

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 123.

IV gradsko/općinsko takmičenje za osnovne škole, 2023. · [A3], PDF str. 36.

## Zadatak

Samo povećavanjem vrijednosti izjednači niz uz najmanji ukupan dodatak.

## Ulaz

N, zatim N vrijednosti.

## Izlaz

Najmanji potreban dodatak.

## Ograničenja

1 ≤ N ≤ 100; 0 ≤ ai ≤ 1 000 000.

## Razumijevanje i postupak

Najveća početna vrijednost ne može se smanjiti. Zato zajednička konačna vrijednost ne može biti manja od maksimuma. Izbor baš maksimuma zahtijeva najmanje dodavanja.

Za svaki element doplata je maksimum − element. Zbir tih razlika možemo računati neposredno ili kao N·maksimum − zbir. Drugi zapis otkriva zašto nema potrebe za sortiranjem: dovoljan je maksimum i suma.

Zašto postupak daje tačan rezultat? Svaki dopušten zajednički cilj x mora biti barem max(ai). Potreban dodatak je N·x − suma(ai), rastuća funkcija od x. Najmanji dopušten cilj zato daje najmanji dodatak.

## Koraci

1. Odredi maksimum niza.
2. Saberi razlike maksimum − ai.
3. Ispiši zbir.

## Složenost

Vrijeme O(N); memorija O(N) u prikazanom zapisu.

## Važne provjere

Prosjek nije dopušten cilj ako traži smanjivanje nekog elementa.

Veći zajednički cilj samo povećava trošak.

## Primjer 1

Ulaz:

```text
4
3 1 6 2
```

Izlaz:

```text
12
```

Do zajedničke vrijednosti 6 nedostaje redom 3, 5, 0 i 4. Njihov zbir je 12.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
