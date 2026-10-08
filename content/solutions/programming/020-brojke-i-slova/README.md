# 020. BROJKE I SLOVA

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 109.

Gradska/općinska takmičenja za osnovne škole, 2021. · [A1], PDF str. 43.

## Zadatak

Iz devet slova ukloni slova svake od dvije riječi, nezavisno. Za svako uklanjanje uzmi prvo preostalo pojavljivanje.

## Ulaz

Tri reda: S, prva riječ, druga riječ.

## Izlaz

Dva preostala zapisa, bez promjene redoslijeda.

## Ograničenja

Riječi koriste dostupna velika slova; |S| = 9.

## Razumijevanje i postupak

Dvije riječi ne dijele isti postupak uklanjanja: obje počinju od originalnog zapisa S. To je važnije od samog načina brisanja.

Funkcija prima riječ i pravi lokalnu kopiju zapisa. Za svako slovo traži prvo trenutno pojavljivanje i briše samo njega. Metoda replace(slovo, "", 1) u Pythonu ograničava zamjenu na jedno pojavljivanje. U C++-u find određuje položaj, a erase(p, 1) briše jedan znak.

Zašto postupak daje tačan rezultat? Poslije obrade prvih k slova riječi uklonjeno je upravo k traženih prvih pojavljivanja, u propisanom redoslijedu. Sljedeće brisanje održava to svojstvo. Kopiranje S prije svake riječi osigurava nezavisnost rezultata.

## Koraci

1. Za prvu riječ postavi ostatak = S.
2. Redom ukloni po jedno prvo pojavljivanje svakog njenog slova.
3. Ponovi od novog ostatka = S za drugu riječ.

## Složenost

Za dužinu S = n i ukupno m slova riječi, vrijeme O(nm), memorija O(n). U zadatku je n = 9.

## Važne provjere

Ne ukloniti sva pojavljivanja jednog slova odjednom.

Drugu riječ ne obrađivati na ostatku prve.

## Primjer 1

Ulaz:

```text
PROGRAMER
MORE
RAME
```

Izlaz:

```text
PGRAR
POGRR
```

Za MORE uklanjamo redom prvo M, O, R i E. Za RAME ponovo polazimo od svih slova zapisa PROGRAMER.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
