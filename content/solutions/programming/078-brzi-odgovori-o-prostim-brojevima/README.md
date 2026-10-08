# 078. Brzi odgovori o prostim brojevima

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 238.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi Eratostenovo sito kada se postavlja mnogo upita o prostosti.

## Zadatak

Za sve brojeve od 0 do N unaprijed odredi prostost, a zatim odgovori na Q upita.

## Ulaz

Prvi red: N Q. Drugi red: Q brojeva x_i.

## Izlaz

Za svaki upit ispisati DA ili NE u posebnom redu.

## Ograničenja

2 <= N <= 10^6, 1 <= Q <= 2*10^5, 0 <= x_i <= N.

## Razumijevanje i postupak

Kod mnogo upita nije dobro svaki broj zasebno testirati do sqrt(x). Sito jednom označi sve složene brojeve, a svaki kasniji upit postaje O(1).

## Koraci

1. Kreiraj niz prime veličine N+1 i inicijalno ga postavi na True.
2. 0 i 1 postavi na False.
3. Za p od 2 do sqrt(N), ako je p prost, označi p*p, p*p+p, ... kao složene.
4. Odgovori na upite direktnim pristupom nizu.

## Složenost

Priprema O(N log log N); svaki upit O(1); memorija O(N).

## Važne provjere

Označavanje višekratnika može početi od p*p, jer su manji već obrađeni.

Ne zaboraviti da 0 i 1 nisu prosti.

## Primjer 1

Ulaz:

```text
20 5
2 9 17 20 19
```

Izlaz:

```text
DA
NE
DA
NE
DA
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
