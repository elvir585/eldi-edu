# 116. Može li graf u dvije ekipe?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 336.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik testira bipartitnost BFS/DFS bojenjem.

## Zadatak

N učenika povezano je M parova sukoba. Treba ih podijeliti u dvije ekipe tako da nijedan sukobljeni par ne bude u istoj ekipi. Odredi da li je to moguće.

## Ulaz

Prvi red N M. Zatim M neusmjerenih ivica.

## Izlaz

Ispisati DA ili NE.

## Ograničenja

1 <= N,M <= 2*10^5.

## Razumijevanje i postupak

Graf je bipartitan ako se može obojiti sa dvije boje tako da svaka ivica spaja različite boje. Svaka nova komponenta počinje proizvoljnom bojom.

## Koraci

1. color=-1.
2. Za svaki neobojeni čvor pokreni BFS i dodijeli boju 0.
3. Susjed dobija 1-color[u].
4. Ako susjed već ima istu boju kao u, odgovor je NE.

## Složenost

Vrijeme O(N+M); memorija O(N+M).

## Važne provjere

Graf može biti nepovezan, zato treba pokrenuti BFS iz svake komponente.

Neparan ciklus onemogućava bipartitnost.

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
