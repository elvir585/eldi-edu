# 071. Putevi kroz mrežu sa preprekama

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 220.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi DP na mreži sa zabranjenim stanjima i modularnim brojanjem.

## Zadatak

U mreži R x C znak . označava slobodno polje, a # prepreku. Iz (1,1) se kreće samo desno ili dolje do (R,C). Odredi broj različitih puteva modulo 1 000 000 007.

## Ulaz

Prvi red R C. Zatim R redova mreže.

## Izlaz

Ispisati broj puteva modulo 1 000 000 007.

## Ograničenja

1 <= R,C <= 2000; početno i završno polje su slobodni.

## Razumijevanje i postupak

Do slobodnog polja možemo doći samo odozgo ili slijeva. Prepreka ima 0 puteva. Zbog velikog broja puteva sabiranje se radi modulo M.

## Koraci

1. dp[0]=1 na početku.
2. Prolazi red po red. Ako je #, dp[c]=0.
3. Inače za c>0: dp[c]=(dp[c]+dp[c-1]) mod M.
4. Na kraju dp[C-1] je odgovor.

## Složenost

Vrijeme O(R*C); memorija O(C).

## Važne provjere

Kod prepreke dp[c] se mora resetovati na 0, jer vrijednost odozgo više ne smije prolaziti.

Modul se primjenjuje nakon sabiranja.

## Primjer 1

Ulaz:

```text
3 4
....
.#..
....
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
