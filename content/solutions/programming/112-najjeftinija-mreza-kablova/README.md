# 112. Najjeftinija mreža kablova

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 324.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik primjenjuje Kruskalov algoritam i DSU za minimalno razapinjuće stablo.

## Zadatak

N škola treba povezati kablovima. Postoji M mogućih veza sa cijenama. Pretpostavi da je graf povezan. Odredi minimalnu ukupnu cijenu da sve škole budu međusobno povezane.

## Ulaz

Prvi red N M. Zatim M redova a b w.

## Izlaz

Ispisati minimalnu ukupnu cijenu.

## Ograničenja

1 <= N,M <= 2*10^5, 0 <= w <= 10^9.

## Razumijevanje i postupak

Kruskal sortira ivice po težini i uzima najjeftiniju ivicu koja ne pravi ciklus. DSU brzo provjerava da li su krajevi već povezani.

## Koraci

1. Sortiraj ivice po w.
2. Za svaku ivicu, ako su krajevi u različitim DSU skupovima, uzmi je.
3. Dodaj cijenu i spoji skupove.
4. Zaustavi se nakon N-1 uzetih ivica.

## Složenost

Vrijeme O(M log M); memorija O(N+M).

## Važne provjere

MST minimizira zbir izabranih ivica, ne pojedinačne najkraće puteve od jednog čvora.

Ne uzimati ivicu koja spaja već povezane komponente.

## Primjer 1

Ulaz:

```text
4 5
1 2 3
1 3 5
2 3 1
2 4 6
3 4 2
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
