# 010. Kružni raspored

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 88.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primijeniti operator ostatka pri cikličnom kretanju.

## Zadatak

Učenici stoje u krugu i numerisani su od 1 do N. Trenutno je na potezu učenik S. Nakon K koraka u smjeru kazaljke na satu, ko će biti na potezu? Jedan korak prelazi na sljedećeg učenika.

## Ulaz

U jednom redu dati su N, S i K.

## Izlaz

Ispisati broj učenika nakon K koraka.

## Ograničenja

1 ≤ N ≤ 10^9, 1 ≤ S ≤ N, 0 ≤ K ≤ 10^18.

## Razumijevanje i postupak

Numeraciju 1..N privremeno prebacimo na 0..N-1. Početak je S-1. Nakon K koraka pozicija je (S-1+K) mod N. Na kraju dodamo 1.

## Koraci

1. Pretvoriti S u nulti indeks S-1.
2. Dodati K i uzeti ostatak pri dijeljenju s N.
3. Vratiti se na numeraciju od 1 dodavanjem 1.

## Složenost

O(1) vrijeme i O(1) memorija.

## Primjer 1

Ulaz:

```text
8 7 4
```

Izlaz:

```text
3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
