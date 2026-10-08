# 036. Par najbliži cilju

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 142.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi sortiranje i dva pokazivača za optimizaciju nad parovima.

## Zadatak

Izaberi dva različita elementa niza tako da njihov zbir bude što bliži ciljnoj vrijednosti T. Ako postoji više rješenja sa istom razlikom, ispiši leksikografski manji par (manja prva, zatim manja druga vrijednost).

## Ulaz

Prvi red: N T. Drugi red: N cijelih brojeva.

## Izlaz

Ispisati dvije vrijednosti iz odabranog para u rastućem poretku.

## Ograničenja

2 <= N <= 2*10^5.

## Razumijevanje i postupak

Nakon sortiranja, ako je zbir premalen povećavamo lijevi pokazivač; ako je prevelik smanjujemo desni. Tako preskačemo cijele grupe parova koje ne mogu biti bolje u datom smjeru.

## Koraci

1. Sortiraj niz.
2. Postavi l=0, r=N-1.
3. Procijeni par A[l],A[r] i ažuriraj najbolji uz pravilo tie-breaka.
4. Ako je zbir<T povećaj l, inače smanji r.

## Složenost

Vrijeme O(N log N) zbog sortiranja; nakon toga O(N); memorija zavisi od sortiranja.

## Važne provjere

Kod tie-breaka porediti uređeni par vrijednosti.

Ne koristiti O(N^2) za N=200000.

## Primjer 1

Ulaz:

```text
6 10
1 4 7 2 9 5
```

Izlaz:

```text
1 9
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
