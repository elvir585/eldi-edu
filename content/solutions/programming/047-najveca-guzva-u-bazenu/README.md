# 047. Najveća gužva u bazenu

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 167.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Pretvoriti intervale prisustva u događaje i pronaći maksimum aktivnih intervala.

## Zadatak

Za svakog od N posjetilaca poznato je vrijeme dolaska A_i i odlaska B_i. Posjetilac je prisutan u intervalu [A_i,B_i), tj. onaj koji odlazi u trenutku t više nije prisutan kada drugi dođe u t. Odredi najveći broj istovremeno prisutnih.

## Ulaz

U prvom redu N, u narednih N redova A_i B_i.

## Izlaz

Ispisati maksimalan broj prisutnih.

## Ograničenja

1 ≤ N ≤ 200000, 0 ≤ A_i < B_i ≤ 10^9.

## Razumijevanje i postupak

Za svaki dolazak pravimo događaj +1, a za svaki odlazak -1. Događaje sortiramo po vremenu; za isti trenutak -1 mora biti obrađen prije +1 zbog poluotvorenog intervala. U paru (vrijeme, delta), standardno sortiranje stavlja -1 prije +1.

## Koraci

1. Dodati (A_i,+1) i (B_i,-1).
2. Sortirati događaje.
3. Prolazom akumulirati trenutno prisutne i čuvati maksimum.

## Složenost

O(N log N) vrijeme, O(N) memorija.

## Primjer 1

Ulaz:

```text
5
1 5
2 6
4 8
5 7
9 10
```

Izlaz:

```text
3
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
