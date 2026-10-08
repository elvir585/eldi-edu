# 046. Dvije sijalice

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 165.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Izračunati dužinu unije i presjeka dva poluotvorena intervala.

## Zadatak

Plava sijalica svijetli od trenutka P1 do P2, a žuta od Z1 do Z2. Intervali su oblika [početak, kraj), pa trajanje iznosi kraj-početak. Odredi koliko vremena svijetli samo plava, koliko obje istovremeno i koliko samo žuta.

## Ulaz

U jednom redu P1 P2 Z1 Z2.

## Izlaz

Ispisati tri broja: samo_plava obje samo_žuta.

## Ograničenja

0 ≤ P1 < P2 ≤ 10^9, 0 ≤ Z1 < Z2 ≤ 10^9.

## Razumijevanje i postupak

Presjek dva intervala ima lijevu granicu max(P1,Z1) i desnu min(P2,Z2). Njegova dužina je max(0, desna-lijeva). Samo plava je dužina plavog intervala minus presjek, a analogno za žutu.

## Koraci

1. izračunati overlap=max(0,min(P2,Z2)-max(P1,Z1)).
2. samo_plava=(P2-P1)-overlap.
3. samo_žuta=(Z2-Z1)-overlap.

## Složenost

O(1).

## Primjer 1

Ulaz:

```text
1 7 4 10
```

Izlaz:

```text
3 3 3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
