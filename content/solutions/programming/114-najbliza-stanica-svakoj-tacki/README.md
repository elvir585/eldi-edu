# 114. Najbliža stanica svakoj tački

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 330.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik pokreće multi-source BFS iz više izvora istovremeno.

## Zadatak

U neusmjerenom neponderisanom grafu dato je K stanica. Za svaki čvor posmatra se udaljenost do najbliže stanice. Odredi najveću od tih udaljenosti. Pretpostavi da je svaki čvor dostižan iz barem jedne stanice.

## Ulaz

Prvi red N M K. Drugi red K stanica. Zatim M ivica.

## Izlaz

Ispisati maksimalnu udaljenost do najbliže stanice.

## Ograničenja

1 <= N,M <= 2*10^5.

## Razumijevanje i postupak

Ako sve izvore stavimo u BFS red sa udaljenošću 0, talasi se šire istovremeno. Prvi talas koji stigne do čvora nužno dolazi od najbližeg izvora.

## Koraci

1. dist=-1 za sve.
2. Sve stanice postavi na 0 i stavi u isti red.
3. Pokreni obični BFS.
4. Ispiši max(dist).

## Složenost

Vrijeme O(N+M); memorija O(N+M).

## Važne provjere

Ne pokretati K odvojenih BFS-ova - to može biti presporo.

Svi izvori moraju u red prije širenja.

## Primjer 1

Ulaz:

```text
6 5 2
1 6
1 2
2 3
3 4
4 5
5 6
```

Izlaz:

```text
2
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
