# 021. VISINE

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 111.

III gradsko/općinsko takmičenje za osnovne škole, 2022. · [A2], PDF str. 39.

## Zadatak

Četiri visine čine opadajući aritmetički niz. Iz najveće A i najmanje G odredi dvije srednje.

## Ulaz

A, zatim G.

## Izlaz

Dvije srednje visine, od veće prema manjoj.

## Ograničenja

125 ≤ A ≤ 190; 85 ≤ G ≤ 160; visine su cjelobrojne.

## Razumijevanje i postupak

Između četiri visine postoje tri jednaka razmaka, a ne četiri. Ako je razmak d, tada vrijedi A G = 3d.

Prva srednja visina je A − d, a druga A − 2d. Nema potrebe isprobavati sve moguće visine: jednakost razmaka već određuje jedinstveno rješenje. Učenik može nacrtati četiri tačke i između njih označiti tri razmaka d.

Zašto postupak daje tačan rezultat? Dobijeni niz je A, A−d, A−2d, A−3d. Razlike susjednih članova jednake su d, a posljednji član je G, pa su ispunjeni svi uslovi.

## Koraci

1. Izračunaj d = (A − G) // 3.
2. Ispiši A − d.
3. Ispiši A − 2d.

## Složenost

Vrijeme O(1); memorija O(1).

## Važne provjere

Dijeliti sa 3, ne sa 4.

Ne obrnuti redoslijed ispisa.

## Primjer 1

Ulaz:

```text
180
150
```

Izlaz:

```text
170
160
```

Razlika krajnjih visina je 30. Tri jednaka razmaka imaju po 10 cm.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
