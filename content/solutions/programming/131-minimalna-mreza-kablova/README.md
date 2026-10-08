# 131. Minimalna mreža kablova

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 380.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Kruskalom gradi minimalno razapinjuće stablo i provjerava povezanost.

## Zadatak

N računara treba povezati tako da postoji put između svakog para. Dato je M mogućih kablova sa cijenama. Odredi minimalan ukupan trošak ili -1 ako povezivanje nije moguće.

## Ulaz

N M, zatim M redova u v w.

## Izlaz

Minimalni ukupni trošak ili -1.

## Ograničenja

N <= 200000, M <= 400000, w <= 10^9.

## Razumijevanje i postupak

Najjeftinije ivice prvo daju najbolju šansu, ali ne smijemo napraviti ciklus. Kruskal sortira ivice po cijeni, a DSU kaže spajaju li dvije različite komponente.

Zašto postupak daje tačan rezultat? Cut property garantuje da je najlakša ivica koja prelazi odgovarajući rez sigurna za neko minimalno razapinjuće stablo.

## Koraci

1. Sortiraj ivice po w.
2. DSU sa N komponenti.
3. Ako union(u,v) uspije, dodaj w i smanji broj komponenti.
4. Na kraju treba biti 1 komponenta.

## Složenost

Vrijeme O(M log M), memorija O(N+M).

## Važne provjere

MST ima N-1 izabranih ivica samo kada je graf povezan.

Ne sabirati ivicu koja spaja već povezane čvorove.

## Primjer 1

Ulaz:

```text
4 5
1 2 4
2 3 2
3 4 3
1 4 10
1 3 5
```

Izlaz:

```text
9
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
