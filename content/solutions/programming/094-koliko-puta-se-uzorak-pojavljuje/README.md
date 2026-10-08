# 094. Koliko puta se uzorak pojavljuje?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 275.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi KMP prefiks-funkciju za linearno traženje uzorka sa preklapanjima.

## Zadatak

Dat je tekst T i uzorak P. Odredi koliko puta se P pojavljuje u T, uključujući preklapajuća pojavljivanja.

## Ulaz

Prvi red T, drugi red P.

## Izlaz

Ispisati broj pojavljivanja.

## Ograničenja

1 <= |T|,|P| <= 5*10^5.

## Razumijevanje i postupak

KMP ne vraća pokazivač teksta unazad. Prefiks-funkcija pi[q] govori koliki najduži pravi prefiks uzorka je ujedno sufiks već poklopljenog dijela. Poslije punog poklapanja možemo nastaviti od pi[m-1] i tako brojati preklapanja.

## Koraci

1. Izračunaj pi za P.
2. Prolazi kroz T sa dužinom trenutnog poklapanja j.
3. Kod neslaganja vraćaj j=pi[j-1].
4. Kod j==|P| povećaj odgovor i postavi j=pi[j-1].

## Složenost

Vrijeme O(|T|+|P|); memorija O(|P|).

## Važne provjere

Nakon punog poklapanja ne postavljati j=0, jer se mogu izgubiti preklapanja.

Prefiks-funkcija se računa samo nad uzorkom.

## Primjer 1

Ulaz:

```text
aaaaa
aa
```

Izlaz:

```text
4
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
