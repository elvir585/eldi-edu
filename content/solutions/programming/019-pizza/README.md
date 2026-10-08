# 019. PIZZA

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 107.

Gradska/općinska takmičenja za osnovne škole, 2021. · [A1], PDF str. 42.

## Zadatak

Osam količina raspoređeno je u krug. Odaberi četiri susjedne s najvećim zbirom.

## Ulaz

Osam cijelih brojeva, svaki u svom redu.

## Izlaz

Najveći zbir.

## Ograničenja

Svaka količina je 0–50.

## Razumijevanje i postupak

Početak odabranog dijela može biti bilo koji od osam položaja. Za svaki početak saberemo četiri člana. Pošto je raspored kružan, iza položaja 7 slijedi položaj 0.

Indeks (p + korak) % 8 automatski obavlja taj povratak. Ne treba posebno praviti niz uslova za početke 5, 6 i 7. Broj kandidata je samo osam, pa je potpuno pretraživanje ovdje jednostavno i dovoljno.

Zašto postupak daje tačan rezultat? Svaki dopušteni izbor ima tačno jedan početni položaj u kružnom redoslijedu. Algoritam obrađuje svih osam početaka i za svaki računa odgovarajući zbir, pa maksimum obuhvata i optimalni izbor.

## Koraci

1. Učitaj osam vrijednosti.
2. Za svaki početak p saberi članove s indeksima (p+j) % 8, za j od 0 do 3.
3. Sačuvaj najveći od osam zbirova.

## Složenost

Za osam dijelova vrijeme i memorija su O(1). Za krug od n dijelova i blok dužine k ovaj neposredni postupak je O(nk).

## Važne provjere

Ne čitati početni broj N: ovdje je unaprijed poznato da ima osam vrijednosti.

Ne preskočiti blokove koji prelaze kraj zapisa.

## Primjer 1

Ulaz:

```text
9
0
0
1
2
0
0
8
```

Izlaz:

```text
17
```

Blok koji obuhvata posljednji i prvi položaj može sadržavati 8 + 9 + 0 + 0 = 17.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
