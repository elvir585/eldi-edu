# 014. Najčešći rezultat

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 96.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi frekvencijsku mapu i primjenjuje jasno pravilo za izjednačenje.

## Zadatak

Dato je N cijelih rezultata. Odredi vrijednost koja se pojavljuje najviše puta. Ako više vrijednosti ima istu najveću frekvenciju, ispiši najmanju od njih.

## Ulaz

Prvi red N. Drugi red N cijelih brojeva.

## Izlaz

Jedan cijeli broj - tražena vrijednost.

## Ograničenja

1 <= N <= 200000, |a_i| <= 10^9.

## Razumijevanje i postupak

Direktno prebrojavanje parovima elemenata bilo bi O(N^2). Mapa nam omogućava da u jednom prolazu izgradimo tačnu frekvenciju svake vrijednosti, a zatim izaberemo najbolji par (frekvencija velika, vrijednost mala).

Zašto postupak daje tačan rezultat? Nakon obrade prvih i elemenata mapa sadrži tačan broj pojavljivanja svake vrijednosti u tom prefiksu. Zato konačna mapa sadrži frekvencije cijelog niza.

## Koraci

1. Prođi niz i povećaj cnt[x].
2. Čuvaj najbolju vrijednost ili nakon prebrojavanja prođi ključeve.
3. Kod izjednačenja frekvencije biraj manju vrijednost.

## Složenost

Vrijeme O(N) očekivano, memorija O(K), gdje je K broj različitih vrijednosti.

## Važne provjere

Ne birati najveću vrijednost kod izjednačenja.

Ne pretpostaviti da su vrijednosti dovoljno male za običan frekvencijski niz.

## Primjer 1

Ulaz:

```text
8
4 1 4 2 2 4 2 2
```

Izlaz:

```text
2
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
