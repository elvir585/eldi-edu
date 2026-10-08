# 023. SEKCIJA

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 115.

III gradsko/općinsko takmičenje za osnovne škole, 2022. · [A2], PDF str. 41.

## Zadatak

Prebroj zapise ocjena čija je šesta ocjena barem 4, a deveta 5.

## Ulaz

N, zatim N redova sa po 11 cifara ocjena.

## Izlaz

Broj odgovarajućih zapisa.

## Ograničenja

1 ≤ N ≤ 200; cifre su 1–5.

## Razumijevanje i postupak

Redni broj u tekstu i indeks u programu razlikuju se za jedan. Šesta cifra je s[5], a deveta s[8].

Oba uslova moraju biti ispunjena, zato koristimo logičko I. Pošto je svaka ocjena jedna cifra, možemo porediti znakove sa "4" i "5" ili ih pretvoriti u brojeve. Ne treba računati prosjek, niti pregledati sve ostale ocjene: za odluku su bitna samo dva mjesta.

Zašto postupak daje tačan rezultat? Za svaki zapis program provjerava tačno dvije propisane ocjene. Brojač se povećava jednom i samo jednom za svaki odgovarajući zapis, pa nakon svih redova daje traženi broj.

## Koraci

1. Brojač postavi na nulu.
2. Za svaki zapis provjeri šestu i devetu cifru.
3. Povećaj brojač samo ako su oba uslova tačna.

## Složenost

Vrijeme O(N), jer svaki zapis ima stalnu dužinu 11; dodatna memorija O(1).

## Važne provjere

Ne koristiti indekse 6 i 9.

Operator OR nije zamjena za AND.

## Primjer 1

Ulaz:

```text
3
11111411511
55555355555
22222522522
```

Izlaz:

```text
2
```

Prvi i treći zapis prolaze oba uslova. Drugi ima matematiku 3.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
