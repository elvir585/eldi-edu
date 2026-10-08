# 029. Rang-lista

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 128.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Sortirati složene zapise po više kriterija.

## Zadatak

Za N takmičara poznati su ime, broj bodova i kazneno vrijeme. Bolji je takmičar s više bodova; ako su bodovi jednaki, bolji je onaj s manjim kaznenim vremenom; ako je i to jednako, imena se poredaju leksikografski. Ispiši konačnu rang-listu.

## Ulaz

U prvom redu N. U narednih N redova: ime bodovi kazna.

## Izlaz

Ispisati imena takmičara redom od prvog do posljednjeg.

## Ograničenja

1 ≤ N ≤ 100000; ime bez razmaka; bodovi i kazna su nenegativni cijeli brojevi.

## Razumijevanje i postupak

Potrebna je kompozitna sortirna ključ-funkcija. U Pythonu možemo sortirati po (-bodovi, kazna, ime). U C++ comparator vraća true kada prvi zapis treba stajati prije drugog.

## Koraci

1. Učitati sve zapise.
2. Sortirati: bodovi opadajuće, kazna rastuće, ime rastuće.
3. Ispisati imena.

## Složenost

O(N log N) vrijeme i O(N) memorija.

## Primjer 1

Ulaz:

```text
4
Amina 300 120
Boris 300 100
Dino 250 20
Adna 300 100
```

Izlaz:

```text
Adna
Boris
Amina
Dino
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
