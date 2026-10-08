# 079. Koliko djelilaca ima broj?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 240.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi parove djelilaca i pravilno obrađuje savršene kvadrate.

## Zadatak

Za dati pozitivan cijeli broj n odredi broj njegovih pozitivnih djelilaca.

## Ulaz

Jedan broj n.

## Izlaz

Ispisati broj pozitivnih djelilaca broja n.

## Ograničenja

1 <= n <= 10^12.

## Razumijevanje i postupak

Djelitelji dolaze u parovima d i n/d. Za svaki d<sqrt(n) dobijamo dva djelitelja. Ako je n savršen kvadrat, sqrt(n) se računa samo jednom.

## Koraci

1. Postavi brojač na 0.
2. Za d=1 dok d*d<=n, ako d dijeli n dodaj 2.
3. Ako je d*d==n dodaj samo 1.

## Složenost

Vrijeme O(sqrt(n)); memorija O(1).

## Važne provjere

Za 36 parovi su (1,36),(2,18),(3,12),(4,9) i srednji djelilac 6.

Ne brojati sqrt(n) dvaput.

## Primjer 1

Ulaz:

```text
36
```

Izlaz:

```text
9
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
