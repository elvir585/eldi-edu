# 039. Pakovanje poklona

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 149.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Primjenjuje pohlepno sparivanje nakon sortiranja i argumentira izbor.

## Zadatak

Imamo N kutija nosivosti c_i i N poklona masa w_i. Svaka kutija može sadržati najviše jedan poklon, a poklon stane ako je w_i <= c_j. Odredi najveći broj poklona koje možemo spakovati.

## Ulaz

Prvi red N. Drugi red mase poklona. Treći red nosivosti kutija.

## Izlaz

Najveći broj uspješno spakovanih poklona.

## Ograničenja

1 <= N <= 200000, vrijednosti <= 10^9.

## Razumijevanje i postupak

Sortiramo i poklone i kutije. Najlakši još nesmješten poklon treba pokušati staviti u najmanju kutiju koja ga može primiti. Korištenje veće kutije ne može pomoći lakšem poklonu više nego što može pomoći težem.

Zašto postupak daje tačan rezultat? Ako najmanja raspoloživa kutija može primiti najlakši preostali poklon, njihovo sparivanje ne može smanjiti optimum: u bilo kojem optimalnom rješenju taj poklon je ili nesparen ili u istoj/većoj kutiji, pa zamjena čuva izvodljivost.

## Koraci

1. Sortiraj w i c.
2. i=0 pokazuje najlakši neupakovan poklon.
3. Za svaku kutiju rastuće: ako c>=w[i], spakuj ga i povećaj i.
4. Odgovor je i.

## Složenost

Vrijeme O(N log N), memorija O(N).

## Važne provjere

Ne sparivati po originalnim indeksima.

Uslov je <=, ne <.

## Primjer 1

Ulaz:

```text
5
4 8 2 6 3
3 5 7 4 10
```

Izlaz:

```text
5
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
