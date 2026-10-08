# 153. Najduži zajednički podniz

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 435.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Definiše dvodimenzionalni DP za LCS i optimizuje memoriju na dva reda.

## Zadatak

Data su dva stringa A i B. Odredi dužinu najdužeg stringa koji je podniz i A i B (znakovi ne moraju biti uzastopni).

## Ulaz

String A, zatim string B.

## Izlaz

Dužina LCS-a.

## Ograničenja

1 <= |A|,|B| <= 3000.

## Razumijevanje i postupak

Za prefikse A[:i] i B[:j], ako su posljednji znakovi jednaki možemo ih upariti i dodati 1 na LCS prethodnih prefiksa. Inače optimalno rješenje izostavlja barem jedan od ta dva znaka.

Zašto postupak daje tačan rezultat? Princip optimalnosti: optimalno rješenje se sastoji od optimalnih rješenja relevantnih manjih stanja; prijelaz razmatra sve legalne posljednje odluke.

## Koraci

1. prev je DP red za i-1, cur za i.
2. Ako A[i-1]==B[j-1]: cur[j]=prev[j-1]+1.
3. Inače cur[j]=max(prev[j],cur[j-1]).
4. Nakon reda postavi prev=cur.

## Složenost

Vrijeme O(|A||B|), memorija O(|B|).

## Važne provjere

Podniz ne mora biti uzastopan.

Kod memorijske optimizacije cur[j-1] je tekući red, prev[j] prethodni.

## Primjer 1

Ulaz:

```text
ABCBDAB
BDCABA
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
