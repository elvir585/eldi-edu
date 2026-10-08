# 099. Pojavljivanja uzorka

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 288.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

KMP algoritmom broji sva, uključujući preklapajuća, pojavljivanja uzorka u tekstu.

## Zadatak

Data su stringovi T (tekst) i P (uzorak). Odredi koliko puta se P pojavljuje u T kao uzastopni podstring. Pojavljivanja se smiju preklapati.

## Ulaz

Tekst T, zatim uzorak P.

## Izlaz

Broj pojavljivanja.

## Ograničenja

1 <= |P| <= |T|, |T| <= 1000000.

## Razumijevanje i postupak

KMP održava j - dužinu trenutno uparenog prefiksa uzorka. Pri nepodudaranju vraća j na pi[j-1], bez vraćanja indeksa teksta. Kada j dosegne |P|, pronađeno je pojavljivanje i j se vraća na pi[j-1] da omogući preklapanje.

Zašto postupak daje tačan rezultat? Skok na pi[j-1] ne preskače potencijalno podudaranje jer svaki kandidat dužine između nema odgovarajuću prefiks-sufiks strukturu.

## Koraci

1. Izračunaj prefiks-funkciju pi za P.
2. j=0; prolazi znakove T.
3. Dok konflikt i j>0: j=pi[j-1].
4. Ako jednakost: j++; ako j==m: ans++, j=pi[j-1].

## Složenost

Vrijeme O(|T|+|P|), memorija O(|P|).

## Važne provjere

Poslije punog poklapanja ne vraćati j na 0 nego na pi[m-1].

Uzorak nije prazan po ograničenju.

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
