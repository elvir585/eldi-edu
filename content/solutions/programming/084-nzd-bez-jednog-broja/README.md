# 084. NZD bez jednog broja

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 251.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Kombinuje prefiksni i sufiksni NZD da obradi “sve osim jednog” u linearnom vremenu.

## Zadatak

Dat je niz pozitivnih cijelih brojeva. Za svaki izbor jednog elementa koji izbacimo posmatramo NZD svih preostalih. Ispiši najveći mogući NZD.

## Ulaz

N, zatim N pozitivnih brojeva.

## Izlaz

Najveći NZD nakon izbacivanja tačno jednog elementa.

## Ograničenja

2 <= N <= 300000, a_i <= 10^9.

## Razumijevanje i postupak

Za svaku poziciju i trebaju nam svi elementi prije i i svi poslije i. Prefiksni gcd L[i] i sufiksni gcd R[i] omogućavaju kandidat gcd(L[i],R[i+1]) bez ponovnog prolaska kroz niz.

Zašto postupak daje tačan rezultat? Asocijativnost gcd operacije omogućava da sve elemente osim a[i] podijelimo u dvije grupe i spojimo njihove NZD vrijednosti.

## Koraci

1. L[0]=0; L[i+1]=gcd(L[i],a[i]).
2. R[N]=0; R[i]=gcd(R[i+1],a[i]).
3. Za svako i kandidat je gcd(L[i],R[i+1]); uzmi maksimum.

## Složenost

Vrijeme O(N log A), memorija O(N).

## Važne provjere

gcd(0,x)=x je korisna baza za praznu stranu.

Traži se tačno jedno izbacivanje.

## Primjer 1

Ulaz:

```text
5
12 18 24 30 42
```

Izlaz:

```text
6
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
