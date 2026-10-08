# 024. BAZEN

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 117.

III gradsko/općinsko takmičenje za osnovne škole, 2022. · [A2], PDF str. 42.

## Zadatak

Za intervale prisustva [a,b) nađi najveći broj istovremenih posjetilaca.

## Ulaz

N, zatim N parova dolaska i odlaska.

## Izlaz

Najveći broj prisutnih.

## Ograničenja

1 ≤ N ≤ 50 000; vremena su prirodni brojevi.

## Razumijevanje i postupak

Vrijeme može biti veliko, ali broj promjena je samo dvostruko veći od broja posjetilaca. Za dolazak zapisujemo +1, za odlazak −1. Zatim sortiramo događaje.

U istom trenutku odlazak se obrađuje prije dolaska. To nije tehnička sitnica: posjetilac u trenutku odlaska više nije prisutan. Sortiranje parova (vrijeme, promjena) upravo postavlja −1 ispred +1. Tek nakon promjene ažuriramo najveći broj prisutnih.

Zašto postupak daje tačan rezultat? Poslije obrade događaja u trenutku t tekući zbir jednak je broju započetih, a nezavršenih intervala. Između događaja se ništa ne mijenja. Zato se najveća prisutnost nalazi među provjerenim stanjima.

## Koraci

1. Formiraj 2N događaja.
2. Sortiraj po vremenu pa promjeni.
3. Sabiraj promjene i pamti najveći dostignuti zbir.

## Složenost

Vrijeme O(N log N); memorija O(N).

## Važne provjere

Ne brojati odlazećeg posjetioca u trenutku b.

Ne obilaziti svaku jedinicu velike vremenske ose.

## Primjer 1

Ulaz:

```text
4
1 4
4 6
2 5
3 4
```

Izlaz:

```text
3
```

Od 3 do 4 prisutna su tri posjetioca. U trenutku 4 dva odlaze i jedan dolazi, pa ostaju dva.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
