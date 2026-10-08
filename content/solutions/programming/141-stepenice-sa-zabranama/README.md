# 141. Stepenice sa zabranama

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 406.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Dinamičkim programiranjem broji puteve uz zabranjena stajališta.

## Zadatak

Do stepenika N može se skočiti za 1 ili 2 stepenika. Neki stepenici su zabranjeni i na njih se ne smije stati. Koliko načina postoji da se dođe sa 0 na N? Rezultat modulo 1e9+7.

## Ulaz

N K, zatim K različitih zabranjenih indeksa između 1 i N-1.

## Izlaz

Broj načina modulo 1e9+7.

## Ograničenja

N<=1000000.

## Razumijevanje i postupak

dp[i] je broj načina da se stigne tačno na i. Ako je i zabranjen, dp[i]=0; inače posljednji skok dolazi sa i-1 ili i-2.

Zašto postupak daje tačan rezultat? Svaki legalan put do i završava tačno jednim od dva moguća posljednja skoka. Te dvije grupe puteva se ne preklapaju, pa se brojevi sabiraju.

## Koraci

1. dp[0]=1.
2. Za i=1..N: ako zabranjen ->0, inače dp[i]=dp[i-1]+dp[i-2].

## Složenost

Vrijeme O(N+K), memorija O(N) ili O(1)+set zabrana.

## Važne provjere

Ne zaboraviti dp[0]=1.

Zabranjeni stepenik mora imati nula načina.

## Primjer 1

Ulaz:

```text
7 2
3 5
```

Izlaz:

```text
2
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
