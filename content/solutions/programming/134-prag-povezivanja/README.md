# 134. Prag povezivanja

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 388.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Sortiranjem ivica i DSU-om nalazi najmanji prag težine pri kojem su dva zadana čvora povezana.

## Zadatak

Dat je neusmjeren graf sa težinama ivica. Smijemo koristiti samo ivice težine <= X. Odredi najmanji X za koji postoji put od čvora 1 do čvora N, ili -1 ako put ne postoji ni sa svim ivicama.

## Ulaz

N M, zatim M redova u v w.

## Izlaz

Minimalni prag X ili -1.

## Ograničenja

N <= 200000, M <= 400000, w <= 10^9.

## Razumijevanje i postupak

Ako ivice obrađujemo rastuće po težini, nakon obrade svih ivica <=w DSU tačno predstavlja povezanost pod pragom w. Prvi trenutak kada 1 i N postanu u istoj komponenti daje najmanji mogući prag.

Zašto postupak daje tačan rezultat? Invariant: dva čvora imaju isti predstavnik ako i samo ako su spojena dosadašnjim union operacijama.

## Koraci

1. Sortiraj ivice po w.
2. DSU početno izolovan.
3. Dodaj ivice grupu po grupu ili redom.
4. Nakon svake težine provjeri find(1)==find(N); prva takva težina je odgovor.

## Složenost

Vrijeme O(M log M), memorija O(N+M).

## Važne provjere

Ne traži se zbir težina puta nego najveća dozvoljena pojedinačna težina.

Prvi prag pri kojem se komponente spoje je optimalan.

## Primjer 1

Ulaz:

```text
5 6
1 2 8
2 5 9
1 3 4
3 4 6
4 5 7
2 3 5
```

Izlaz:

```text
7
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
