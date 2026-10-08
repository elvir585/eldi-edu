# 038. Poredak takmičara

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 146.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Sortira rezultate i dodjeljuje rang sa jednakim mjestima za jednake bodove.

## Zadatak

N takmičara ima bodove. Veći broj bodova znači bolji plasman. Takmičari sa jednakim brojem bodova imaju isti rang, a sljedeći rang preskače odgovarajući broj mjesta (npr. 1,2,2,4). Za svaki takmičarov rezultat u originalnom redoslijedu ispiši rang.

## Ulaz

Prvi red N. Drugi red N cijelih bodova.

## Izlaz

N rangova u jednom redu.

## Ograničenja

1 <= N <= 200000, 0 <= bodovi <= 10^9.

## Razumijevanje i postupak

Sortiramo parove (-bodovi, indeks). Nakon sortiranja, element na poziciji i dobija rang i+1 samo ako mu se rezultat razlikuje od prethodnog; inače zadržava prethodni rang.

Zašto postupak daje tačan rezultat? Sortirani redoslijed je tačno redoslijed plasmana. Kod jednakih bodova zadržavamo isti rang, a kod prvog manjeg rezultata rang postaje njegova 1-bazirana pozicija, čime se automatski preskaču mjesta.

## Koraci

1. Formiraj (bodovi, indeks).
2. Sortiraj opadajuće po bodovima.
3. Prođi sortirani niz i odredi rang.
4. Upiši rang na originalni indeks.

## Složenost

Vrijeme O(N log N), memorija O(N).

## Važne provjere

Ne koristiti gusti rang 1,2,2,3 - tekst traži standardni takmičarski rang 1,2,2,4.

Sačuvati originalne indekse.

## Primjer 1

Ulaz:

```text
6
100 80 80 60 100 50
```

Izlaz:

```text
1 3 3 5 1 6
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
