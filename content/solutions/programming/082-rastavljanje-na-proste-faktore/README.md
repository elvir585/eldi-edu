# 082. Rastavljanje na proste faktore

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 246.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik rastavlja broj na proste faktore i evidentira eksponente.

## Zadatak

Rastavi pozitivan cijeli broj n>1 na proste faktore. Faktore ispiši rastuće u obliku p^e.

## Ulaz

Jedan broj n.

## Izlaz

Ispisati faktore odvojene razmakom.

## Ograničenja

2 <= n <= 10^12.

## Razumijevanje i postupak

Kada pronađemo djelilac p, dijelimo n sa p sve dok je djeljiv i brojimo eksponent. Nakon što isprobamo sve p sa p*p<=n, eventualni preostali n>1 mora biti prost.

## Koraci

1. Za p od 2 naviše dok p*p<=n.
2. Ako p dijeli n, broj ponavljanja čuvaj u e i potpuno ukloni p iz n.
3. Na kraju, ako je n>1, dodaj n^1.

## Složenost

Vrijeme O(sqrt(n)) u najgorem slučaju; memorija O(broja različitih prostih faktora).

## Važne provjere

Uslov p*p<=n se mijenja dok se n smanjuje - to je ispravno i ubrzava rad.

Preostali n>1 se ne smije zaboraviti.

## Primjer 1

Ulaz:

```text
360
```

Izlaz:

```text
2^3 3^2 5^1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
