# 066. N kraljica

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 210.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi backtracking sa skupovima zauzetih kolona i dijagonala.

## Zadatak

Na šahovsku tablu N x N postavi N kraljica tako da se nijedne dvije ne napadaju. Odredi broj različitih rasporeda.

## Ulaz

Jedan broj N.

## Izlaz

Ispisati broj rasporeda.

## Ograničenja

1 <= N <= 12.

## Razumijevanje i postupak

Postavljamo po jednu kraljicu u svaki red. Za polje (r,c) moraju biti slobodni kolona c, dijagonala r-c i dijagonala r+c. Time se broj grana dramatično smanjuje.

## Koraci

1. Rekurzija obrađuje red r.
2. Probaj svaku kolonu c koja nije zauzeta ni po jednoj dijagonali.
3. Označi, pozovi sljedeći red, zatim poništi oznake.
4. Kada r==N, pronađen je raspored.

## Složenost

Eksponencijalno, ali uz jake rezove dovoljno za N<=12; memorija O(N).

## Važne provjere

Obavezno vratiti stanje nakon rekurzivnog poziva - backtracking znači “uradi pa poništi”.

Dijagonale se mogu kodirati sa r-c i r+c.

## Primjer 1

Ulaz:

```text
4
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
