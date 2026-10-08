# 035. Najduži budžetski segment

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 140.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi dva pokazivača na nizu nenegativnih vrijednosti.

## Zadatak

Dat je niz nenegativnih troškova. Nađi najveći broj uzastopnih elemenata čiji zbir ne prelazi S.

## Ulaz

Prvi red: N S. Drugi red: N nenegativnih brojeva.

## Izlaz

Ispisati maksimalnu dužinu segmenta.

## Ograničenja

1 <= N <= 2*10^5, 0 <= A[i] <= 10^9.

## Razumijevanje i postupak

Desni kraj samo ide naprijed. Kada zbir postane prevelik, pomjeramo lijevi kraj dok ponovo ne bude dozvoljen. Nenegativnost je ključna: uklanjanje lijevog elementa ne može povećati zbir.

## Koraci

1. l=0, sum=0.
2. Za svaki r dodaj A[r].
3. Dok sum>S, oduzimaj A[l] i povećavaj l.
4. Ažuriraj najbolju dužinu r-l+1.

## Složenost

Vrijeme O(N), jer svaki indeks ulazi i izlazi iz prozora najviše jednom; memorija O(1).

## Važne provjere

Ovaj algoritam nije ispravan ako niz sadrži negativne brojeve.

Ne vraćati l unazad.

## Primjer 1

Ulaz:

```text
7 10
2 1 5 1 3 2 4
```

Izlaz:

```text
4
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
