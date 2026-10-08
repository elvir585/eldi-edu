# 064. Izlaz iz labirinta

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 205.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primijeniti BFS za najkraći put u neponderisanoj mreži.

## Zadatak

Data je mreža R×C. Znak S je početak, E izlaz, # zid, a . slobodno polje. U jednom koraku može se ići gore, dolje, lijevo ili desno. Odredi najmanji broj koraka od S do E ili -1 ako izlaz nije dostupan.

## Ulaz

U prvom redu R i C, zatim R redova mreže.

## Izlaz

Ispisati dužinu najkraćeg puta ili -1.

## Ograničenja

1 ≤ R,C ≤ 1000; postoji tačno jedno S i jedno E.

## Razumijevanje i postupak

Svaki potez ima jednaku cijenu 1, pa BFS obilazi polja po rastućoj udaljenosti od starta. Prvi put kada dođemo u polje, pronašli smo najkraći put do njega.

## Koraci

1. Pronaći koordinate S.
2. Staviti S u red i dist[S]=0.
3. Dok red nije prazan, širiti se na validne neobičene susjede.
4. Ispisati dist[E] ili -1.

## Složenost

O(R·C) vrijeme i O(R·C) memorija.

## Primjer 1

Ulaz:

```text
4 5
S...#
##..#
...#.
...E.
```

Izlaz:

```text
6
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
