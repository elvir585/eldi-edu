# 074. Najbliži izlaz iz labirinta

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 228.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Modelira mrežu kao neponderisani graf i koristi BFS za najkraći broj koraka.

## Zadatak

Data je mreža R x C sa početkom S, prolazima . i zidovima #. Izlaz je bilo koje prohodno polje na ivici mreže (uključujući S ako je na ivici). Odredi minimalan broj poteza do izlaza.

## Ulaz

R C, zatim R redova mreže.

## Izlaz

Minimalan broj poteza ili -1.

## Ograničenja

R*C <= 500000.

## Razumijevanje i postupak

Svaka prohodna ćelija je čvor, a potez u četiri smjera ivica težine 1. BFS od S prvi put dostiže svaku ćeliju najkraćim brojem poteza; čim prvi put dođemo na prohodnu ivicu, imamo optimalan izlaz.

Zašto postupak daje tačan rezultat? Kada se čvor prvi put izvadi/dohvati, nijedan kasniji put sa više ivica ne može biti kraći; slojevi redom predstavljaju udaljenosti 0,1,2,...

## Koraci

1. Nađi koordinate S.
2. dist[S]=0 i stavi S u red.
3. BFS kroz četiri susjeda koji nisu # i nisu posjećeni.
4. Kada izvadimo ćeliju na ivici, ispiši njenu udaljenost.

## Složenost

Vrijeme O(RC), memorija O(RC).

## Važne provjere

Izlaz nije poseban znak nego prohodna ćelija na ivici.

Ne zaboraviti da S može već biti izlaz.

## Primjer 1

Ulaz:

```text
4 5
#####
#S..#
#...#
##..#
```

Izlaz:

```text
3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
