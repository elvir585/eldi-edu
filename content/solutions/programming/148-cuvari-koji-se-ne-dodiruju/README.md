# 148. Čuvari koji se ne dodiruju

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 424.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primjenjuje DP na stablu za maksimalni nezavisni skup.

## Zadatak

Na čvorove stabla želimo postaviti što više čuvara, ali nijedna dva čvora spojena ivicom ne smiju oba imati čuvara. Odredi maksimalan broj čuvara.

## Ulaz

N, zatim N-1 ivica.

## Izlaz

Maksimalan broj čuvara.

## Ograničenja

1 <= N <= 300000.

## Razumijevanje i postupak

Za svaki čvor u računamo dp1[u] kada u ima čuvara i dp0[u] kada ga nema. Ako u ima čuvara, djeca ne smiju; ako ga nema, svako dijete bira bolju od svoje dvije opcije.

Zašto postupak daje tačan rezultat? Zbog jedinstvenih podstabala odluke djece su nezavisne kada je odluka roditelja fiksirana; zato se optimalne vrijednosti mogu sabirati/kombinovati lokalno.

## Koraci

1. Korijeni stablo u 1 i napravi postorder.
2. dp1[u]=1 + suma dp0[v] za djecu.
3. dp0[u]=suma max(dp0[v],dp1[v]).
4. Odgovor max(dp0[root],dp1[root]).

## Složenost

Vrijeme O(N), memorija O(N).

## Važne provjere

Nezavisni skup nije isto što i skup listova.

Stanja se računaju nakon djece - postorder.

## Primjer 1

Ulaz:

```text
6
1 2
1 3
2 4
2 5
3 6
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
