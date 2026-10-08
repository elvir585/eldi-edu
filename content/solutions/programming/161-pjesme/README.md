# 161. PJESME

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 457.

Kantonalno takmičenje za srednje škole, 2024. · [A4], PDF str. 14.

## Zadatak

Nađi najraniju riječ teksta do koje se pojavila barem polovina različitih riječi naslova.

## Ulaz

N i N riječi naslova; M i M riječi teksta, riječi u zasebnim redovima.

## Izlaz

Pozicija prve dovoljne riječi, brojeći od 1.

## Ograničenja

N ≤ 50; M ≤ 10 000; naslovne riječi su različite; rješenje postoji.

## Razumijevanje i postupak

Ponavljanje iste riječi ne povećava broj prepoznatih naslovnih riječi. Zato u skupu čuvamo samo riječi koje još nisu pronađene. Kad pročitamo takvu riječ, uklonimo je i povećamo brojač.

Ako je N neparan, barem polovina znači zaokruživanje naviše. Umjesto realnog dijeljenja provjeravamo 2·broj ≥ N. Čim uslov prvi put postane tačan, trenutna pozicija je odgovor. Ne smijemo je kasnije prepisati.

Zašto postupak daje tačan rezultat? Nakon i riječi brojač je broj različitih naslovnih riječi u tom prefiksu, jer svaku uklanjamo najviše jednom. Redoslijed obrade osigurava da je prvi dovoljan prefiks ujedno najkraći.

## Koraci

1. U skup smjesti riječi naslova.
2. Redom čitaj tekst i uklanjaj novopronađene naslovne riječi.
3. Sačuvaj prvu poziciju za koju vrijedi 2·broj ≥ N.

## Složenost

Očekivano vrijeme O(N+M) za riječi ograničene dužine; memorija O(N).

## Važne provjere

Ponavljanje ne povećava broj različitih prepoznatih riječi.

Za N=3 treba pronaći 2 riječi, ne jednu.

## Primjer 1

Ulaz:

```text
3
more
sunce
put
6
put
i
put
more
je
tu
```

Izlaz:

```text
4
```

Riječ put nalazi se i na poziciji 1 i 3, ali vrijedi samo jednom. Druga različita naslovna riječ more dolazi na poziciji 4.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
