# 063. Latinski kvadrat - provjera

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 203.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Provjeriti ponavljanja u svakom redu i stupcu matrice.

## Zadatak

Data je kvadratna matrica N×N. Svako popunjeno polje sadrži broj od 1 do N, a 0 znači prazno. Trenutno stanje je ispravno ako se nijedan nenulti broj ne ponavlja u istom redu niti u istom stupcu. Odredi postoji li greška.

## Ulaz

U prvom redu N, zatim N redova sa po N cijelih brojeva.

## Izlaz

Ispisati OK ako nema ponavljanja, inače GRESKA.

## Ograničenja

1 ≤ N ≤ 200.

## Razumijevanje i postupak

Provjera reda i stupca je ista operacija: vodimo skup već viđenih nenultih vrijednosti. Ako naiđemo na broj koji je već u skupu, stanje je pogrešno. Nula se ignoriše.

## Koraci

1. Za svaki red provjeriti duplikate nenultih brojeva.
2. Za svaki stupac provjeriti duplikate.
3. Ako bilo gdje postoji duplikat, ispisati GRESKA.

## Složenost

O(N²) vrijeme i O(N) pomoćne memorije.

## Primjer 1

Ulaz:

```text
4
1 2 0 4
3 4 1 0
2 0 4 3
4 3 2 1
```

Izlaz:

```text
OK
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
