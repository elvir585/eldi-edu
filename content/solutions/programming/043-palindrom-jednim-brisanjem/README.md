# 043. Palindrom jednim brisanjem

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 158.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primjenjuje dva pokazivača i razmatra najviše dvije lokalne grane.

## Zadatak

Dat je string S. Dozvoljeno je obrisati najviše jedan znak. Odredi može li se dobiti palindrom. Ispiši DA ili NE.

## Ulaz

Jedan string S od malih slova engleske abecede.

## Izlaz

DA ili NE.

## Ograničenja

1 <= |S| <= 300000.

## Razumijevanje i postupak

Dok su krajnji znakovi jednaki, oba pokazivača pomjeramo prema sredini. Prvi konflikt je jedino mjesto na kojem brisanje može pomoći: brišemo ili lijevi ili desni konfliktni znak i provjerimo preostali interval.

Zašto postupak daje tačan rezultat? Monotonost sortiranog niza garantuje da pomjeranjem odgovarajuće granice odbacujemo samo kandidate koji ne mogu dati bolji odgovor od upravo analiziranog.

## Koraci

1. Postavi l=0, r=n-1 i pomjeraj dok je s[l]==s[r].
2. Ako se pokazivači sretnu, odgovor je DA.
3. Na prvom konfliktu provjeri palindrom intervala [l+1,r] ili [l,r-1].

## Složenost

Vrijeme O(N), memorija O(1).

## Važne provjere

Nakon prvog konflikta nema smisla brisati neki udaljeni znak.

Dozvoljeno je najviše jedno brisanje, ne tačno jedno.

## Primjer 1

Ulaz:

```text
abca
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
