# 090. Postfiksni kalkulator

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 264.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik evaluira postfiksni izraz pomoću steka i pravilno poštuje redoslijed operanada.

## Zadatak

Dat je ispravan postfiksni izraz od cijelih brojeva i operatora +, - i *. Izračunaj njegovu vrijednost.

## Ulaz

Prvi red N - broj tokena. Drugi red sadrži N tokena razdvojenih razmakom.

## Izlaz

Ispisati vrijednost izraza.

## Ograničenja

1 <= N <= 2*10^5; rezultat staje u 64-bitni cijeli broj.

## Razumijevanje i postupak

Kada čitamo broj, stavljamo ga na stek. Kada čitamo operator, skidamo desni operand b pa lijevi operand a i vraćamo rezultat a op b.

## Koraci

1. Za broj: push.
2. Za operator: b=pop(), a=pop().
3. Izračunaj a op b i push rezultat.
4. Na kraju je na steku tačno jedna vrijednost.

## Složenost

Vrijeme O(N); memorija O(N).

## Važne provjere

Kod oduzimanja redoslijed je a-b, ne b-a.

Token -5 je broj, ali u ovom zadatku se negativni brojevi mogu pojaviti; provjera t tačno protiv operatora to ispravno razlikuje.

## Primjer 1

Ulaz:

```text
7
3 4 + 2 * 5 -
```

Izlaz:

```text
9
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
