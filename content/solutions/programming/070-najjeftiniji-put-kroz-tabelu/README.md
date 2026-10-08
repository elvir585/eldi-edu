# 070. Najjeftiniji put kroz tabelu

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 218.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik formira 2D dinamičko programiranje sa lokalnim prijelazom iz gornjeg i lijevog polja.

## Zadatak

U matrici pozitivnih troškova kreće se iz gornjeg lijevog u donje desno polje, samo desno ili dolje. Trošak puta je zbir svih posjećenih polja. Nađi minimalni trošak.

## Ulaz

Prvi red R C. Zatim R redova sa C troškova.

## Izlaz

Ispisati minimalni trošak.

## Ograničenja

1 <= R,C <= 1000.

## Razumijevanje i postupak

Svaki put do (r,c) mora posljednjim potezom doći iz (r-1,c) ili (r,c-1). Zato je dp[r][c]=cost[r][c]+min(gore,lijevo).

## Koraci

1. Inicijalizuj dp[0][0].
2. Prvi red može doći samo slijeva, prva kolona samo odozgo.
3. Ostala polja koriste minimum dvije prethodne vrijednosti.

## Složenost

Vrijeme O(R*C); memorija O(C) u optimizovanoj verziji.

## Važne provjere

Kod 1D optimizacije dp[c] prije ažuriranja znači vrijednost odozgo, a dp[c-1] već znači vrijednost slijeva.

Početno polje se računa u trošak.

## Primjer 1

Ulaz:

```text
3 3
1 3 1
1 5 1
4 2 1
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
