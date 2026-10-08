# 068. Binarni nizovi bez susjednih jedinica

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 214.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik generiše kombinatorne objekte uz ograničenje i razlikuje broj posjećenih stanja od 2^N.

## Zadatak

Odredi koliko binarnih stringova dužine N ne sadrži podstring 11.

## Ulaz

Jedan broj N.

## Izlaz

Ispisati broj takvih stringova.

## Ograničenja

1 <= N <= 40.

## Razumijevanje i postupak

Rekurzivno gradimo string slijeva nadesno. Nulu uvijek smijemo dodati. Jedinicu smijemo dodati samo ako prethodni znak nije 1. Isto stanje zavisi samo od pozicije i prethodnog bita, pa ga možemo memoizirati.

## Koraci

1. Definiši f(pos,prev1).
2. Ako pos==N, vrati 1.
3. Dodaj granu sa 0; ako prev1 nije postavljen, dodaj i granu sa 1.
4. Memoiziraj stanje.

## Složenost

S memoizacijom O(N) stanja i O(N) memorije.

## Važne provjere

Bez memoizacije isti sufiksni problem se računa mnogo puta.

Za N=1 odgovori su 0 i 1, dakle 2.

## Primjer 1

Ulaz:

```text
3
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
