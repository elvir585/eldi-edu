# 160. KLIKERI

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 455.

Kantonalno takmičenje za srednje škole, 2024. · [A4], PDF str. 13.

## Zadatak

Premještaj klikere između dvije osobe dok prvi broj ne postane djeljiv drugim. Oboma mora ostati barem jedan.

## Ulaz

A i B.

## Izlaz

Najmanje premještenih klikera.

## Ograničenja

1 ≤ A,B ≤ 1000.

## Razumijevanje i postupak

Ukupan broj T = A + B ne mijenja se. Ako druga osoba na kraju ima b klikera, prva ima T − b. Uslov djeljivosti je (T − b) % b == 0.

Za izabrano b potrebno je premjestiti tačno |b − B| klikera: ako b raste, klikeri prelaze drugoj osobi; ako pada, prelaze prvoj. Isprobamo sve b od 1 do T−1. Tako oba konačna broja ostaju pozitivna.

Zašto postupak daje tačan rezultat? Svaka konačna raspodjela određena je brojem b i pojavljuje se u pretrazi. Za nju apsolutna razlika daje nužan i dovoljan broj premještanja. Najmanja vrijednost među svim dopuštenim raspodjelama zato je optimalna.

## Koraci

1. Sačuvaj ukupan broj T.
2. Za svako b od 1 do T−1 provjeri djeljivost T−b sa b.
3. Među ispravnim kandidatima minimiziraj |b−B|.

## Složenost

Vrijeme O(A+B); memorija O(1).

## Važne provjere

Ne dopustiti da druga osoba dobije nulu.

Ne tražiti samo jednake brojeve: djeljivost je širi uslov.

## Primjer 1

Ulaz:

```text
8 7
```

Izlaz:

```text
2
```

Dva klikera prelaze prvoj osobi. Nova raspodjela 10 i 5 zadovoljava djeljivost; nijedno pojedinačno premještanje nije dovoljno.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
