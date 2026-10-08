# 005. Povoljnije putovanje

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 78.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Uporediti dvije ukupne cijene i pravilno obraditi slučaj jednakosti.

## Zadatak

Ekipa može putovati autobusom ili vozom. Autobuska karta košta A KM, ali uz nju je obavezan obrok od B KM. Vozna karta košta C KM. Odredi jeftiniju opciju. Ako su cijene jednake, prednost ima autobus. U drugom redu ispiši apsolutnu razliku cijena.

## Ulaz

U tri reda nalaze se A, B i C.

## Izlaz

U prvom redu ispisati AUTOBUS ili VOZ, a u drugom apsolutnu razliku cijena.

## Ograničenja

1 ≤ A,B,C ≤ 10 000.

## Razumijevanje i postupak

Prvo formiramo ukupnu cijenu autobusom A+B. Zatim je poredimo s C. Uslov mora sadržati znak ≤ jer autobus pobjeđuje i kod jednakosti. Razlika cijena je apsolutna vrijednost (A+B)-C.

## Koraci

1. Izračunati bus = A+B.
2. Ako je bus ≤ C, ispisati AUTOBUS, inače VOZ.
3. Ispisati |bus-C|.

## Složenost

O(1) vrijeme i O(1) memorija.

## Važne provjere

Korištenje < umjesto ≤ u slučaju jednakih cijena.

Zaboravljanje apsolutne vrijednosti.

## Primjer 1

Ulaz:

```text
12
4
20
```

Izlaz:

```text
AUTOBUS
4
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
