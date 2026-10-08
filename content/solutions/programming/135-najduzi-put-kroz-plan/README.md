# 135. Najduži put kroz plan

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 391.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Kombinuje topološko sortiranje, DP i rekonstrukciju jednog najdužeg puta u DAG-u.

## Zadatak

Dat je usmjeren acikličan graf. Odredi najveći broj ivica na putu od 1 do N i ispiši jedan takav put. Ako N nije dostižan, ispiši -1.

## Ulaz

N M, zatim M usmjerenih ivica.

## Izlaz

Prvo dužina, zatim čvorovi jednog najdužeg puta.

## Ograničenja

N,M <= 300000; garantovano DAG.

## Razumijevanje i postupak

Topološki red omogućava da prije obrade u znamo najbolju dužinu puta do u. Za svaku ivicu u->v relaksiramo dist[v]=max(dist[v],dist[u]+1) i pamtimo parent[v]=u kada poboljšamo. Parent zatim rekonstruira put.

Zašto postupak daje tačan rezultat? Svaki put u DAG-u prati topološki red, te kada obrađujemo u već znamo najbolju vrijednost svakog puta koji završava u u; relaksacije pokrivaju sve nastavke.

## Koraci

1. Kahn/DFS topološki red.
2. dist=-INF, dist[1]=0.
3. Prolazi u topološkom redu; za svako v relaksiraj ako je u dostižan.
4. Ako dist[N] ne postoji -> -1; inače prati parent unazad.

## Složenost

Vrijeme O(N+M), memorija O(N+M).

## Važne provjere

U opštem grafu najduži put je težak; ovdje DAG omogućava DP.

Parent se mijenja samo kada se dist strogo poboljša.

## Primjer 1

Ulaz:

```text
6 7
1 2
1 3
2 4
3 4
4 5
3 5
5 6
```

Izlaz:

```text
4
1 2 4 5 6
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
