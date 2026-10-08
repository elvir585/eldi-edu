# 058. Raspored radionica

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 189.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Rješava težinski interval scheduling pomoću sortiranja, binarnog pretraživanja i DP-a.

## Zadatak

Svaka od N radionica ima početak s_i, kraj e_i i vrijednost v_i. Ne možemo pohađati preklapajuće radionice. Ako jedna završava u trenutku kada druga počinje, mogu se obje pohađati. Odredi maksimalnu ukupnu vrijednost.

## Ulaz

N, zatim N redova s e v.

## Izlaz

Maksimalna vrijednost.

## Ograničenja

N<=200000, vremena i vrijednosti<=1e9.

## Razumijevanje i postupak

Sortiramo radionice po vremenu završetka. Za i-tu radionicu binarnim pretraživanjem nađemo posljednju radionicu koja završava <= s_i. DP odlučuje: preskoči i ili uzmi i + najbolji kompatibilni prefiks.

Zašto postupak daje tačan rezultat? U optimalnom rješenju za prvih i radionica posljednja sortirana radionica ili nije izabrana, ili jeste. Ako jeste, sve ostale izabrane moraju završiti prije njenog početka, a najbolja vrijednost tog kompatibilnog prefiksa je već u DP-u.

## Koraci

1. Sortiraj po e.
2. Napravi niz završetaka ends.
3. Za svaki i nađi j=bisect_right(ends,s_i,0,i)-1.
4. dp[i+1]=max(dp[i], v_i+dp[j+1]).

## Složenost

Vrijeme O(N log N), memorija O(N).

## Važne provjere

Binarna pretraga je po krajevima već sortiranog prefiksa.

Kompatibilnost je e<=s, ne e<s.

## Primjer 1

Ulaz:

```text
5
1 3 5
2 5 6
4 6 5
6 7 4
5 8 11
```

Izlaz:

```text
17
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
