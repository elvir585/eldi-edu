# 003. Takmičarski popust

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 74.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Kombinovati proizvod, procenat i uslov.

## Zadatak

Organizator kupuje N identičnih USB memorija po cijeni C KM. Ako je početni račun najmanje T KM, prodavnica odobrava popust D posto na cijeli račun. Odredi konačnu cijenu. Garantovano je da će rezultat biti cijeli broj.

## Ulaz

U jednom redu dati su N, C, T i D.

## Izlaz

Ispisati konačnu cijenu u KM.

## Ograničenja

1 ≤ N,C,T ≤ 100000, 0 ≤ D ≤ 100; rezultat je cijeli broj.

## Razumijevanje i postupak

Najprije računamo početni iznos N·C. Tek nakon toga provjeravamo prag T. Ako je prag dostignut, ostaje (100-D)% iznosa.

## Koraci

1. račun = N*C.
2. Ako račun ≥ T, račun = račun*(100-D)/100.
3. Ispisati račun.

## Složenost

O(1) vrijeme i memorija.

## Primjer 1

Ulaz:

```text
10 20 150 10
```

Izlaz:

```text
180
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
