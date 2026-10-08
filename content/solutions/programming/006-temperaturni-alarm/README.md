# 006. Temperaturni alarm

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 80.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Kreirati ispravan lanac if/elif/else uslova.

## Zadatak

Senzor u računarskom kabinetu mjeri temperaturu T u °C. Ako je T < 15 ispisati HLADNO, ako je 15 ≤ T ≤ 27 ispisati NORMALNO, ako je 28 ≤ T ≤ 35 ispisati TOPLO, a za T > 35 ispisati ALARM.

## Ulaz

U jednom redu dat je cijeli broj T.

## Izlaz

Ispisati jednu od četiri riječi.

## Ograničenja

-50 ≤ T ≤ 100.

## Razumijevanje i postupak

Kod višestrukog grananja granice moraju pokriti sve moguće vrijednosti bez preklapanja i praznina. Najjednostavnije je testirati od najnižeg praga prema višem.

## Koraci

1. Ako T < 15: HLADNO.
2. Inače ako T ≤ 27: NORMALNO.
3. Inače ako T ≤ 35: TOPLO.
4. Inače: ALARM.

## Složenost

O(1).

## Primjer 1

Ulaz:

```text
36
```

Izlaz:

```text
ALARM
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
