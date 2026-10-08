# 106. Dva tima

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 308.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Provjeriti može li se graf obojiti sa dvije boje.

## Zadatak

N učenika imaju M parova koji ne smiju biti u istoj ekipi. Treba ih podijeliti u dvije ekipe tako da svaki takav par bude u različitim ekipama. Odredi je li podjela moguća.

## Ulaz

U prvom redu N M, zatim M parova u v.

## Izlaz

Ispisati DA ako je moguća, inače NE.

## Ograničenja

1 ≤ N,M ≤ 200000.

## Razumijevanje i postupak

Graf je bipartitan ako se njegovi čvorovi mogu obojiti sa dvije boje tako da svaka ivica spaja različite boje. BFS/DFS dodjeljuje susjedu suprotnu boju; sukob nastaje kada dva susjedna čvora dobiju istu boju.

## Koraci

1. color=-1 za sve.
2. Za svaku komponentu pokrenuti BFS i obojiti početak sa 0.
3. Susjed dobija 1-color[u].
4. Ako susjed već ima istu boju kao u, odgovor NE.

## Složenost

O(N+M) vrijeme i memorija.

## Primjer 1

Ulaz:

```text
5 4
1 2
2 3
3 4
4 5
```

Izlaz:

```text
DA
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
