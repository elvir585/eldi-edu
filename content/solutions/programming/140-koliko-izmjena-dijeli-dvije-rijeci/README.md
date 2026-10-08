# 140. Koliko izmjena dijeli dvije riječi?

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 404.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik primjenjuje Levenshteinovu udaljenost i razumije DP sa tri moguća posljednja poteza.

## Zadatak

Dozvoljene su operacije: umetanje jednog znaka, brisanje jednog znaka i zamjena jednog znaka. Odredi minimalan broj operacija kojim se string A pretvara u string B.

## Ulaz

Prvi red A, drugi red B.

## Izlaz

Ispisati minimalan broj operacija.

## Ograničenja

0 <= |A|,|B| <= 2000.

## Razumijevanje i postupak

dp[i][j] je minimalan broj operacija da prvih i znakova A postanu prvih j znakova B. Posljednja operacija je brisanje, umetanje ili zamjena; ako su zadnji znakovi jednaki, zamjena košta 0.

## Koraci

1. Baza: dp[0][j]=j i dp[i][0]=i.
2. Prijelaz: min(brisi, umetni, zamijeni/ostavi).
3. Za memoriju su dovoljne prethodna i trenutna vrsta.

## Složenost

Vrijeme O(|A|*|B|); memorija O(|B|).

## Važne provjere

Paziti da zamjena koristi dp[i-1][j-1].

Prazan string je dozvoljen u ograničenjima, zato baze moraju biti ispravne.

## Primjer 1

Ulaz:

```text
kitten
sitting
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
