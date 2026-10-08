# 128. Koliko zatvorenih regija?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 370.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi Kosaraju algoritam za broj jako povezanih komponenti u usmjerenom grafu.

## Zadatak

Dat je usmjeren graf. Dva čvora pripadaju istoj zatvorenoj regiji ako se iz svakog može stići do drugog. Odredi broj takvih maksimalnih regija (jako povezanih komponenti).

## Ulaz

N M, zatim M usmjerenih ivica.

## Izlaz

Broj SCC komponenti.

## Ograničenja

N,M <= 300000.

## Razumijevanje i postupak

Jedan DFS nije dovoljan jer dostižnost nije simetrična. Kosaraju radi dva prolaza: prvo zapisuje čvorove po vremenu završetka, zatim na obrnutom grafu pokreće DFS tim redom unazad; svaki novi DFS daje jednu SCC.

Zašto postupak daje tačan rezultat? Red završetka kondenzacionog DAG-a osigurava da u drugom prolazu ne “pobjegnemo” iz trenutne SCC u još neobrađenu SCC.

## Koraci

1. Izgradi g i obrnuti rg.
2. Prvi DFS na g: nakon djece dodaj u u order.
3. Reset visited.
4. Prolazi reversed(order); svaki neposjećen u pokreće DFS na rg i povećava odgovor.

## Složenost

Vrijeme O(N+M), memorija O(N+M).

## Važne provjere

U drugom prolazu koristi se obrnuti graf.

Red je obrnuti red završetka, ne red ulaska.

## Primjer 1

Ulaz:

```text
6 7
1 2
2 1
2 3
3 4
4 3
4 5
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
