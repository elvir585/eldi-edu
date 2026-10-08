# 048. Upiti o bodovima

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 169.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Odgovarati na veliki broj upita o zbiru intervala u O(1).

## Zadatak

Tokom N dana učenik osvaja a_i bodova. Zatim dobija Q upita: za svaki interval [L,R] treba izračunati koliko je bodova osvojio od L-tog do R-tog dana uključivo.

## Ulaz

U prvom redu N i Q, u drugom N brojeva a_i, zatim Q redova L R.

## Izlaz

Za svaki upit ispisati zbir na intervalu.

## Ograničenja

1 ≤ N,Q ≤ 200000, |a_i| ≤ 10^9.

## Razumijevanje i postupak

Prefiks p[i] je zbir prvih i elemenata. Tada je zbir L..R jednak p[R]-p[L-1]. Izgradnja traje O(N), a svaki upit O(1), što je mnogo brže od ponovnog sabiranja.

## Koraci

1. Napraviti p[0]=0.
2. Za i=1..N: p[i]=p[i-1]+a[i-1].
3. Za upit L,R ispisati p[R]-p[L-1].

## Složenost

O(N+Q) vrijeme i O(N) memorija.

## Primjer 1

Ulaz:

```text
5 3
3 1 4 1 5
1 3
2 5
4 4
```

Izlaz:

```text
8
11
1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
