# 146. Veličine podstabala

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 417.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Korijeni stablo i postorder akumulacijom računa veličinu svakog podstabla.

## Zadatak

Dato je stablo ukorijenjeno u čvoru 1. Za svaki čvor v odredi broj čvorova u njegovom podstablu, uključujući v.

## Ulaz

N, zatim N-1 ivica.

## Izlaz

N brojeva sz[1] ... sz[N].

## Ograničenja

1 <= N <= 300000.

## Razumijevanje i postupak

Najprije formiramo roditelje i red obilaska od korijena. Zatim u obrnutom redoslijedu svaki čvor dodaje svoju veličinu roditelju. List počinje sa 1, a roditelj dobija zbir 1 + veličine djece.

Zašto postupak daje tačan rezultat? Bez ciklusa, svaki čvor osim korijena prvi put se dostiže preko jedinog roditelja, pa postorder/preorder akumulacije ne dvostruko broje čvorove.

## Koraci

1. DFS/BFS od 1: parent i order.
2. sz[v]=1 za sve.
3. Prođi reversed(order) bez korijena i dodaj sz[v] u sz[parent[v]].

## Složenost

Vrijeme O(N), memorija O(N).

## Važne provjere

Roditelj se mora fiksirati da se ne vraćamo nazad.

Podstablo zavisi od izabranog korijena 1.

## Primjer 1

Ulaz:

```text
5
1 2
1 3
3 4
3 5
```

Izlaz:

```text
5 1 3 1 1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
