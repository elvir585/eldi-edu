# 017. TRKA

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 103.

Gradska/općinska takmičenja za osnovne škole, 2021. · [A1], PDF str. 29.

## Zadatak

Dva završna vremena pretvori u sekunde i izračunaj razmak između njih.

## Ulaz

Šest brojeva: h1, m1, s1, h2, m2, s2, redom u zasebnim redovima.

## Izlaz

Razlika u sekundama.

## Ograničenja

Za ovu razradu vremena pripadaju istom danu i drugo nije ranije od prvog; minute i sekunde su 0–59. Izvorne granice i primjeri nisu potpuno usklađeni.

## Razumijevanje i postupak

Sat, minuta i sekunda nisu tri nezavisne veličine koje smijemo oduzimati bez prijenosa. Najprije ih svedemo na zajedničku jedinicu. Jedan sat sadrži 3600, a minuta 60 sekundi.

Za jedno vrijeme izračunamo t = 3600·h + 60·m + s. Nakon pretvaranja više nema posebne obrade prijelaza iz minute u sat: dovoljno je oduzimanje. Tako izbjegavamo niz uslova za „posuđivanje“ minuta i sekundi.

Zašto postupak daje tačan rezultat? Pretvaranje čuva proteklo vrijeme jer svaki sat i svaku minutu zamjenjuje jednakim brojem sekundi. Zato razlika pretvorenih vrijednosti predstavlja upravo vremenski razmak.

## Koraci

1. Učitaj oba vremena.
2. Izračunaj broj sekundi za svako vrijeme.
3. Ispiši drugi broj umanjen za prvi.

## Složenost

Vrijeme O(1); dodatna memorija O(1).

## Važne provjere

Minute množiti sa 60, a sate sa 3600.

Ne oduzimati zasebne komponente kao decimalne cifre.

## Primjer 1

Ulaz:

```text
9
58
40
10
1
15
```

Izlaz:

```text
155
```

Do 10:00:00 prođe 80 sekundi, a zatim još 75. Ukupno je 155 sekundi.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
