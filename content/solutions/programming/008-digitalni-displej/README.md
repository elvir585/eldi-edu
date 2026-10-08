# 008. Digitalni displej

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 84.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Raditi sa ciframa kao znakovima i provjeriti dva uslova nad stringom.

## Zadatak

Digitalni displej ostaje čitljiv nakon okretanja za 180 stepeni samo ako se broj sastoji od cifara 0, 1 i 8. U ovoj pojednostavljenoj verziji broj je „stabilan“ ako su sve cifre iz tog skupa i ako je zapis palindrom. Odredi je li zadani broj stabilan.

## Ulaz

U jednom redu dat je zapis prirodnog broja bez vodećih nula.

## Izlaz

Ispisati DA ili NE.

## Ograničenja

Dužina zapisa je od 1 do 100000.

## Razumijevanje i postupak

Broj tretiramo kao tekst. Prvi uslov provjerava da nema zabranjenih cifara. Drugi uslov provjerava jednakost stringa i njegovog obrnutog zapisa.

## Koraci

1. Učitati string s.
2. Provjeriti da je svaki znak u skupu {0,1,8}.
3. Provjeriti s == obrnuti(s).
4. DA samo ako oba uslova vrijede.

## Složenost

O(|s|) vrijeme i O(|s|) memorija u prikazanom Python rješenju zbog obrnutog stringa.

## Primjer 1

Ulaz:

```text
81018
```

Izlaz:

```text
DA
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
