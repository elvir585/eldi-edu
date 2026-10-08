# 004. Četiri ekipe

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 76.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Prebrojati oznake, pronaći jedinstveni maksimum i obraditi neriješen rezultat.

## Zadatak

Na završnici učestvuju ekipe A, B, C i D. Za svakog od N gledalaca poznata je oznaka ekipe za koju navija. Pobjedničkom publikom smatra se ekipa koja ima strogo više navijača od svake druge. Ako takva ekipa ne postoji, ispisati NEMA.

## Ulaz

U prvom redu je N. U drugom redu je niz od N znakova iz skupa A, B, C, D.

## Izlaz

Ispisati oznaku jedinstveno najzastupljenije ekipe ili NEMA.

## Ograničenja

1 ≤ N ≤ 1000.

## Razumijevanje i postupak

Potrebna su četiri brojača. Nakon prebrojavanja tražimo najveću vrijednost i provjeravamo pojavljuje li se samo jednom. Važno je ne proglasiti pobjednika kada dvije ekipe dijele maksimum.

## Koraci

1. Napraviti brojače za A,B,C,D.
2. Proći kroz N oznaka i povećavati odgovarajući brojač.
3. Naći maksimum.
4. Ako maksimum ima tačno jedna ekipa, ispisati je; inače NEMA.

## Složenost

O(N) vrijeme i O(1) dodatna memorija.

## Važne provjere

Proglašavanje prve ekipe s maksimumom bez provjere izjednačenja.

## Primjer 1

Ulaz:

```text
7
A B A C A B D
```

Izlaz:

```text
A
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
