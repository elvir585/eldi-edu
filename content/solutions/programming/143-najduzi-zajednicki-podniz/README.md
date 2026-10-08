# 143. Najduži zajednički podniz

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 410.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Formuliše LCS DP i optimizuje memoriju na dva reda.

## Zadatak

Data su dva stringa A i B. Odredi dužinu njihovog najdužeg zajedničkog podniza (znakovi ne moraju biti uzastopni, ali redoslijed se čuva).

## Ulaz

Dva reda: A i B.

## Izlaz

Dužina LCS-a.

## Ograničenja

|A|,|B|<=4000.

## Razumijevanje i postupak

dp[i][j] za prefikse ima klasičan prijelaz: ako su posljednji znakovi jednaki, možemo ih upariti; inače odbacujemo jedan od posljednja dva znaka. Za dužinu su dovoljna dva reda.

Zašto postupak daje tačan rezultat? Optimalni zajednički podniz prefiksa ili koristi oba posljednja jednaka znaka, ili kada se razlikuju mora izostaviti barem jedan od njih. Prijelaz razmatra upravo te slučajeve.

## Koraci

1. Neka B bude kraći string.
2. prev = nule.
3. Za svaki znak A izgradi cur: ako isti znak -> prev[j-1]+1; inače max(prev[j],cur[j-1]).

## Složenost

Vrijeme O(|A||B|), memorija O(min(|A|,|B|)).

## Važne provjere

Podniz nije isto što i podstring.

Kod dva reda cur[j-1] pripada trenutnom redu.

## Primjer 1

Ulaz:

```text
ALGORITAM
LOGARITAM
```

Izlaz:

```text
7
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
