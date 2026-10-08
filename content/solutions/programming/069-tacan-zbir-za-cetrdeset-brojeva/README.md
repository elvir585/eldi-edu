# 069. Tačan zbir za četrdeset brojeva

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 216.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik upoznaje meet-in-the-middle tehniku za smanjenje 2^N na približno 2^(N/2).

## Zadatak

Za N cijelih brojeva odredi postoji li podskup čiji je zbir tačno S. Svaki element se može uzeti najviše jednom.

## Ulaz

Prvi red: N S. Drugi red: N cijelih brojeva.

## Izlaz

Ispisati DA ili NE.

## Ograničenja

1 <= N <= 40, |A[i]| <= 10^9.

## Razumijevanje i postupak

Direktnih 2^40 podskupova je previše. Podijelimo niz na dvije polovine. Generišemo sve sume svake polovine; zatim za svaku lijevu sumu x tražimo S-x među desnim sumama.

## Koraci

1. Podijeli niz na L i R.
2. Generiši sve podskupne sume L i R.
3. Sortiraj desne sume.
4. Za svaku x iz lijevih suma binarno potraži S-x.

## Složenost

O(2^(N/2) * N + 2^(N/2) log 2^(N/2)); memorija O(2^(N/2)).

## Važne provjere

Ne pokušavati 2^40 eksplicitno.

Kod generisanja suma paziti da se iterira samo kroz staru veličinu liste prije dodavanja novih elemenata.

## Primjer 1

Ulaz:

```text
5 11
2 4 7 9 12
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
