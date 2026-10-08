# 129. Jedna besplatna karta

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 374.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Proširuje Dijkstrino stanje informacijom da li je jednokratna pogodnost iskorištena.

## Zadatak

U usmjerenom grafu od 1 do N svaka ivica ima cijenu w. Tokom puta smiješ najviše jednu ivicu proći besplatno. Odredi minimalan trošak.

## Ulaz

N M, zatim M redova u v w.

## Izlaz

Minimalni trošak ili -1.

## Ograničenja

N <= 200000, M <= 400000, 0 <= w <= 10^9.

## Razumijevanje i postupak

Isti čvor sa neiskorištenom i iskorištenom kartom nije isto stanje. Imamo dist[v][0/1]. Iz sloja 0 preko ivice možemo platiti w i ostati 0 ili platiti 0 i preći u 1; iz sloja 1 plaćamo normalno.

Zašto postupak daje tačan rezultat? Kada je stanje izvađeno sa najmanjom udaljenošću, nijedan put kroz neobrađene čvorove ne može ga poboljšati jer su sve dodatne težine nenegativne.

## Koraci

1. dist[1][0]=0.
2. Dijkstra nad parom (čvor,used).
3. Uvijek relaksiraj normalnu cijenu.
4. Ako used=0, relaksiraj i besplatni prelaz u used=1.
5. Odgovor min(dist[N][0],dist[N][1]).

## Složenost

Vrijeme O((N+M) log N), memorija O(N+M).

## Važne provjere

Ne birati unaprijed “najskuplju” ivicu bez znanja kojeg puta.

visited mora razlikovati sloj used=0 i used=1.

## Primjer 1

Ulaz:

```text
4 5
1 2 8
2 4 8
1 3 5
3 4 20
2 3 1
```

Izlaz:

```text
5
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
