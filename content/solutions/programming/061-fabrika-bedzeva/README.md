# 061. Fabrika bedževa

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 197.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Binarno pretražuje najmanje vrijeme koje omogućava proizvodnju najmanje K komada.

## Zadatak

Imamo N mašina. Mašina i napravi jedan bedž svakih t_i sekundi i sve počinju u trenutku 0. Odredi najmanje cijelo vrijeme T nakon kojeg je proizvedeno najmanje K bedževa.

## Ulaz

N K, zatim N pozitivnih vremena t_i.

## Izlaz

Minimalno vrijeme T.

## Ograničenja

1 <= N <= 200000, 1 <= K <= 10^18, 1 <= t_i <= 10^9.

## Razumijevanje i postupak

Za fiksno vrijeme T mašina i proizvede floor(T/t_i) komada. Predikat “ukupno >= K” je monoton: kada jednom postane tačan, ostaje tačan za svako veće vrijeme.

Zašto postupak daje tačan rezultat? Ako je rješenje moguće sa X, moguće je i sa svakim većim X; zato skup odgovora ima oblik F...F T...T i binarna pretraga nalazi prvu T poziciju.

## Koraci

1. feasible(T)=sum(T//t_i)>=K; prekini sumu čim dosegne K.
2. Donja granica 0, gornja min(t_i)*K.
3. Klasično traži prvu vrijednost za koju je feasible tačan.

## Složenost

Vrijeme O(N log(min(t)*K)), memorija O(N).

## Važne provjere

Ne binarno pretraživati broj bedževa nego vrijeme.

Gornja granica min(t)*K može tražiti 64-bitni tip.

## Primjer 1

Ulaz:

```text
3 10
2 3 7
```

Izlaz:

```text
12
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
