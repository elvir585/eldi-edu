# 117. Najduži lanac u DAG-u

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 339.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik računa najduži put u usmjerenom acikličkom grafu dinamičkim programiranjem po topološkom poretku.

## Zadatak

Za DAG odredi maksimalan broj ivica na usmjerenom putu.

## Ulaz

Prvi red N M, zatim M ivica a b.

## Izlaz

Ispisati dužinu najdužeg puta u broju ivica.

## Ograničenja

1 <= N,M <= 2*10^5.

## Razumijevanje i postupak

U topološkom poretku svi prethodnici čvora dolaze ranije. Zato kada obrađujemo u, njegova najbolja dužina je konačna i možemo relaksirati dp[v]=max(dp[v],dp[u]+1).

## Koraci

1. Kahnovim algoritmom dobij topološki poredak.
2. dp inicijalno 0.
3. Za svaki u u poretku, za svaku ivicu u->v ažuriraj dp[v].
4. Odgovor je max(dp).

## Složenost

Vrijeme O(N+M); memorija O(N+M).

## Važne provjere

Ovaj jednostavni DP vrijedi zato što nema ciklusa.

Dužina se ovdje mjeri brojem ivica, ne brojem čvorova.

## Primjer 1

Ulaz:

```text
5 5
1 2
1 3
2 4
3 4
4 5
```

Izlaz:

```text
3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
