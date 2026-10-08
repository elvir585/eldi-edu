# 157. Labirint sa ključevima

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 444.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

BFS proširuje stanjem skupa ključeva i provjerava uslove prolaska kroz vrata.

## Zadatak

Data je mreža sa S, T, zidovima #, ključevima a,b,c i vratima A,B,C. Na ključ se može stati i tada ostaje trajno prikupljen; kroz vrata X može se proći samo ako imamo odgovarajući ključ x. Odredi minimalan broj poteza od S do T ili -1.

## Ulaz

R C, zatim mapa.

## Izlaz

Minimalan broj poteza ili -1.

## Ograničenja

R*C <= 100000, najviše 3 vrste ključeva.

## Razumijevanje i postupak

Pozicija sama nije dovoljno stanje: dolazak na isto polje sa različitim skupom ključeva mijenja koje su buduće ivice dozvoljene. Bitmask 0..7 kodira a,b,c. BFS nad (r,c,mask) ima jedinične poteze.

Zašto postupak daje tačan rezultat? Prošireni graf ima R*C*2^K stanja i jedinične prelaze, pa BFS daje najkraći legalni put uz tačno modelovane ključeve/vrata.

## Koraci

1. Na S počni mask=0.
2. Pri ulasku na malo slovo uključi odgovarajući bit.
3. Na veliko slovo dopusti prelaz samo ako bit postoji.
4. visited[r][c][mask]; prvi T je optimalan.

## Složenost

Vrijeme O(R*C*8), memorija O(R*C*8).

## Važne provjere

Kod provjere vrata koristi se stari mask m prije ulaska u vrata; vrata sama nisu ključ.

visited mora imati dimenziju mask.

## Primjer 1

Ulaz:

```text
4 7
S.a#..T
.#A#.#.
..bB...
#######
```

Izlaz:

```text
10
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
