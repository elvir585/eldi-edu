# 127. Podjela u dvije ekipe

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 367.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

BFS/DFS bojenjem provjerava može li se graf podijeliti u dvije grupe bez unutrašnjih konflikata.

## Zadatak

N učenika i M parova koji ne smiju biti u istoj ekipi. Odredi može li se svih N učenika podijeliti u dvije ekipe tako da svaki konfliktni par bude u različitim ekipama.

## Ulaz

N M, zatim M neusmjerenih ivica.

## Izlaz

DA ili NE.

## Ograničenja

N,M <= 300000.

## Razumijevanje i postupak

Problem je tačno provjera bipartitnosti. Svaku još neobojenu komponentu započinjemo bojom 0 i susjedima dajemo 1-color. Konflikt istih boja znači nemogućnost.

Zašto postupak daje tačan rezultat? Ako ikad ivica spaja iste boje, postoji neparni ciklus i biparticija nije moguća. Ako konflikta nema, svaka ivica ide između dvije klase.

## Koraci

1. color=-1 za sve.
2. Za svaki neobojeni start pokreni BFS i postavi boju 0.
3. Susjed dobija suprotnu boju; ako već ima istu boju, ispiši NE.

## Složenost

Vrijeme O(N+M), memorija O(N+M).

## Važne provjere

Pokrenuti BFS iz svake komponente, ne samo iz čvora 1.

Samopetlja odmah znači NE.

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
