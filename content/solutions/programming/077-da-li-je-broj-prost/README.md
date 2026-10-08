# 077. Da li je broj prost?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 236.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik provjerava prostost jednog broja u O(sqrt(n)) i pravilno obrađuje n<2.

## Zadatak

Za dati cijeli broj n odredi da li je prost. Prost broj ima tačno dva pozitivna djelitelja: 1 i samog sebe.

## Ulaz

Jedan broj n.

## Izlaz

Ispisati DA ako je n prost, inače NE.

## Ograničenja

0 <= n <= 2*10^9.

## Razumijevanje i postupak

Ako n ima djelilac veći od sqrt(n), uz njega postoji odgovarajući djelilac manji od sqrt(n). Zato je dovoljno tražiti djelioce samo do kvadratnog korijena.

## Koraci

1. Ako je n<2, odgovor je NE.
2. Provjeri djelioce d od 2 dok d*d<=n.
3. Ako neki d dijeli n, broj nije prost; inače jeste.

## Složenost

Vrijeme O(sqrt(n)); memorija O(1).

## Važne provjere

Broj 1 nije prost.

Uslov d*d<=n mora uključiti jednakost zbog savršenih kvadrata.

## Primjer 1

Ulaz:

```text
97
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
