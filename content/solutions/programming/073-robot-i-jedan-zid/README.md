# 073. Robot i jedan zid

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 225.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Proširuje BFS stanje dodatnom binarnom informacijom.

## Zadatak

Robot ide od S do T u mreži. Može se kretati 4-smjerno. Znak # je zid, ali robot tokom cijelog puta smije srušiti najviše jedan zid. Odredi minimalan broj koraka ili -1.

## Ulaz

R C, zatim mapa sa S,T,.,#.

## Izlaz

Minimalan broj koraka.

## Ograničenja

R*C<=300000.

## Razumijevanje i postupak

Ista ćelija nije jedno stanje: dolazak bez potrošenog rušenja je vredniji od dolaska nakon rušenja. Zato stanje mora biti (r,c,used), gdje used=0/1.

Zašto postupak daje tačan rezultat? Graf stanja ima najviše 2RC čvorova i sve ivice težine 1. Standardni BFS zato daje najkraći put među svim legalnim sekvencama, uključujući izbor zida koji se ruši.

## Koraci

1. BFS od (S,0).
2. Prelaz na . ili T zadržava used.
3. Prelaz na # dozvoljen je samo kada used=0 i tada postaje 1.
4. Prvi dolazak do T u BFS-u je optimalan.

## Složenost

Vrijeme O(RC), memorija O(RC).

## Važne provjere

visited[r][c] bez used informacije nije dovoljno.

Ne dozvoliti rušenje S ili T; samo # povećava used.

## Primjer 1

Ulaz:

```text
4 5
S.#..
##.#.
...#.
.#..T
```

Izlaz:

```text
7
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
