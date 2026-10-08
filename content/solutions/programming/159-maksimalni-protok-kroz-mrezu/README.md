# 159. Maksimalni protok kroz mrežu

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 450.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Modelira kapacitete i implementira Edmonds-Karp na rezidualnom grafu.

## Zadatak

Dat je usmjeren graf sa izvorom 1 i ponorom N. Svaka ivica ima nenegativan cjelobrojni kapacitet c. Odredi maksimalnu količinu toka koju je moguće poslati od 1 do N.

## Ulaz

N M, zatim M redova u v c.

## Izlaz

Vrijednost maksimalnog toka.

## Ograničenja

2 <= N <= 200, M <= 2000, 0 <= c <= 10^9.

## Razumijevanje i postupak

Rezidualni graf čuva koliko još možemo poslati svakom ivicom i koliko možemo “vratiti” prethodno poslani tok. BFS nalazi augmentirajući put sa pozitivnim rezidualnim kapacitetom. Najmanji kapacitet na putu je dodatni tok koji možemo poslati.

Zašto postupak daje tačan rezultat? Teorem max-flow/min-cut garantuje optimalnost kada više nema augmentirajućeg puta. Svaka augmentacija čuva ograničenja kapaciteta i konzervaciju toka.

## Koraci

1. Izgradi cap[u][v] sabiranjem paralelnih kapaciteta i listu susjeda u oba smjera.
2. BFS od s do t čuva parent samo po ivicama sa cap>0.
3. Ako nema puta - završili smo.
4. Nađi bottleneck, smanji naprijed cap i povećaj nazad; dodaj u flow.

## Složenost

Edmonds-Karp: O(V*E^2), memorija O(V^2+E) u ovoj matričnoj implementaciji.

## Važne provjere

Obrnuta rezidualna ivica je ključna čak i ako nije postojala u originalnom grafu.

Paralelne ivice treba sabrati u matrici kapaciteta.

## Primjer 1

Ulaz:

```text
4 5
1 2 3
1 3 2
2 3 1
2 4 2
3 4 4
```

Izlaz:

```text
5
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
