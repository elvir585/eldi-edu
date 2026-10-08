# 109. Redoslijed preduslova

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 317.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik primjenjuje topološko sortiranje i prioritetni red za leksikografski najmanji valjan poredak.

## Zadatak

Postoji N tema i M usmjerenih zavisnosti a->b, što znači da se tema a mora obraditi prije teme b. Pretpostavlja se da ciklusa nema. Ispiši leksikografski najmanji mogući redoslijed.

## Ulaz

Prvi red N M, zatim M redova a b.

## Izlaz

Ispisati N brojeva - redoslijed tema.

## Ograničenja

1 <= N,M <= 2*10^5.

## Razumijevanje i postupak

Kahnov algoritam drži sve čvorove ulaznog stepena 0. Da bi redoslijed bio leksikografski najmanji, među trenutno dostupnim čvorovima uvijek uzimamo najmanji.

## Koraci

1. Izračunaj indegree svakog čvora.
2. Sve čvorove sa indegree 0 stavi u min-heap.
3. Vadi najmanji u, dodaj ga rezultatu i smanji indegree susjeda.
4. Susjed koji padne na 0 ulazi u heap.

## Složenost

Vrijeme O((N+M) log N); memorija O(N+M).

## Važne provjere

Obični red daje neki topološki poredak, ali ne nužno leksikografski najmanji.

Smjer ivice a->b mora odgovarati “a prije b”.

## Primjer 1

Ulaz:

```text
4 4
1 2
1 3
2 4
3 4
```

Izlaz:

```text
1 2 3 4
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
