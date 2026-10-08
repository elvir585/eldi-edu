# 149. Stepenice 1-2-3

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 427.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Definiše jednodimenzionalno DP stanje za broj načina dolaska do pozicije.

## Zadatak

Do vrha sa N stepenika može se u jednom potezu preći 1, 2 ili 3 stepenika. Koliko različitih nizova poteza vodi tačno na vrh? Odgovor dati modulo 1 000 000 007.

## Ulaz

N.

## Izlaz

Broj načina modulo 1 000 000 007.

## Ograničenja

0 <= N <= 1000000.

## Razumijevanje i postupak

Posljednji potez do n može biti dužine 1,2 ili 3. Zato dp[n]=dp[n-1]+dp[n-2]+dp[n-3]. Baza dp[0]=1 predstavlja prazan niz poteza.

Zašto postupak daje tačan rezultat? Princip optimalnosti: optimalno rješenje se sastoji od optimalnih rješenja relevantnih manjih stanja; prijelaz razmatra sve legalne posljednje odluke.

## Koraci

1. dp0=1.
2. Za i=1..N saberi dostupna prethodna tri stanja.
3. Svaki zbir uzmi modulo MOD.

## Složenost

Vrijeme O(N), memorija O(N) ili O(1) uz kružne tri vrijednosti.

## Važne provjere

dp[0]=1 je važna kombinatorna baza.

Redoslijed poteza je bitan.

## Primjer 1

Ulaz:

```text
5
```

Izlaz:

```text
13
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
