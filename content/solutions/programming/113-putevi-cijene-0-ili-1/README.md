# 113. Putevi cijene 0 ili 1

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 327.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik primjenjuje 0-1 BFS sa deque strukturom.

## Zadatak

U neusmjerenom grafu svaka ivica ima cijenu 0 ili 1. Odredi minimalnu cijenu puta od S do T.

## Ulaz

Prvi red N M S T. Zatim M redova a b w, gdje je w 0 ili 1.

## Izlaz

Ispisati najkraću cijenu ili -1 ako T nije dostupan.

## Ograničenja

1 <= N,M <= 2*10^5.

## Razumijevanje i postupak

Kod težina samo 0 i 1 nije potreban heap. Ako relaksiramo ivicu težine 0, novi čvor ide na početak deque-a; za težinu 1 ide na kraj. Time čuvamo red približno po rastućoj udaljenosti.

## Koraci

1. dist[S]=0, ostalo INF; S u deque.
2. Vadi s lijeve strane.
3. Ako dist[u]+w poboljšava dist[v], ažuriraj.
4. Za w=0 dodaj v lijevo, za w=1 desno.

## Složenost

Vrijeme O(N+M); memorija O(N+M).

## Važne provjere

0-1 BFS važi samo kada su težine tačno 0 ili 1.

Deque nije obični queue: koristi se i push_front.

## Primjer 1

Ulaz:

```text
5 6 1 5
1 2 0
2 3 1
1 4 1
4 5 0
3 5 0
2 5 1
```

Izlaz:

```text
1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
