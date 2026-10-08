# 118. Svi parovi najkraćih puteva

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 341.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik primjenjuje Floyd-Warshall kada je N umjeren, a broj upita velik.

## Zadatak

U ponderisanom neusmjerenom grafu treba odgovoriti na Q upita o najkraćoj udaljenosti između parova čvorova.

## Ulaz

Prvi red N M Q. Zatim M ivica a b w. Zatim Q parova s t.

## Izlaz

Za svaki upit ispisati udaljenost ili -1 ako put ne postoji.

## Ograničenja

1 <= N <= 400, 0 <= M <= N(N-1)/2, Q <= 2*10^5.

## Razumijevanje i postupak

Floyd-Warshall postepeno dozvoljava čvorove 1..k kao unutrašnje čvorove puta. Prijelaz je d[i][j]=min(d[i][j],d[i][k]+d[k][j]). Nakon O(N^3) predobrade svaki upit je O(1).

## Koraci

1. d[i][i]=0, ostalo INF; ivice postavi na minimalnu težinu.
2. Za k, pa i, pa j pokušaj put preko k.
3. Odgovori direktno iz d[s][t].

## Složenost

Vrijeme O(N^3 + Q); memorija O(N^2).

## Važne provjere

O(N^3) je prihvatljivo samo za relativno mali N.

Kod više ivica između istih čvorova čuva se najmanja težina.

## Primjer 1

Ulaz:

```text
4 4 2
1 2 5
2 3 2
1 4 10
3 4 1
1 4
2 4
```

Izlaz:

```text
8
3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
