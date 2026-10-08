# 093. Koliko riječi počinje prefiksom?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 272.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi trie za skup stringova i prefiksne upite.

## Zadatak

Dato je N riječi malim slovima. Za svaki od Q prefiksa odredi koliko unesenih riječi počinje tim prefiksom.

## Ulaz

Prvi red N. Zatim N riječi. Zatim Q i Q prefiksa, svaki u svom redu.

## Izlaz

Za svaki prefiks ispisati broj riječi.

## Ograničenja

Ukupna dužina svih riječi i upita <= 5*10^5.

## Razumijevanje i postupak

Trie je stablo znakova. Svaki prolazak kroz čvor povećava cnt tog prefiksa. Upit samo prati znakove prefiksa; ako veza nedostaje, odgovor je 0.

## Koraci

1. Korijen je prazan prefiks.
2. Pri dodavanju riječi kreiraj nedostajuće dijete i povećaj cnt svakog posjećenog čvora.
3. Za upit prati znakove; rezultat je cnt posljednjeg čvora.

## Složenost

Vrijeme O(ukupnog broja znakova); memorija O(ukupnog broja znakova).

## Važne provjere

Brojač se povećava na čvoru prefiksa nakon prelaska znaka.

Trie troši više memorije od običnog seta, ali daje direktne prefiksne upite.

## Primjer 1

Ulaz:

```text
5
apple
app
ape
bat
bath
4
ap
app
ba
cat
```

Izlaz:

```text
3
2
2
0
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
