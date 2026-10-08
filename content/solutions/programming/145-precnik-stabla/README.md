# 145. Prečnik stabla

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 414.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi svojstvo stabla i dva obilaska za nalaženje najdužeg jednostavnog puta.

## Zadatak

Dato je stablo sa N čvorova. Odredi broj ivica na njegovom najdužem jednostavnom putu (prečnik stabla).

## Ulaz

N, zatim N-1 neusmjerenih ivica.

## Izlaz

Dužina prečnika u broju ivica.

## Ograničenja

1 <= N <= 300000.

## Razumijevanje i postupak

U stablu, najudaljeniji čvor od proizvoljnog starta je jedan kraj nekog prečnika. Zato prvo BFS/DFS od 1 nađe A, a drugi obilazak od A nađe najudaljeniji B; dist(A,B) je prečnik.

Zašto postupak daje tačan rezultat? Bez ciklusa, svaki čvor osim korijena prvi put se dostiže preko jedinog roditelja, pa postorder/preorder akumulacije ne dvostruko broje čvorove.

## Koraci

1. Pokreni BFS od 1 i nađi čvor A sa najvećom udaljenošću.
2. Pokreni BFS od A.
3. Najveća udaljenost u drugom obilasku je odgovor.

## Složenost

Vrijeme O(N), memorija O(N).

## Važne provjere

Prečnik se traži u broju ivica, ne broju čvorova.

Ovo svojstvo važi za stablo; u opštem grafu dva BFS-a nisu opšti algoritam za prečnik.

## Primjer 1

Ulaz:

```text
6
1 2
2 3
3 4
2 5
5 6
```

Izlaz:

```text
4
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
