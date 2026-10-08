# 007. Slatkiši do maksimuma

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 82.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Pronaći maksimum niza i izračunati zbir razlika.

## Zadatak

N učenika ima različit broj slatkiša. Nastavnik smije samo dodavati slatkiše. Koliko najmanje slatkiša mora dodati da svi na kraju imaju jednak broj?

## Ulaz

U prvom redu je N, a u drugom N cijelih brojeva a_i.

## Izlaz

Ispisati najmanji broj dodatnih slatkiša.

## Ograničenja

1 ≤ N ≤ 100000, 0 ≤ a_i ≤ 10^9.

## Razumijevanje i postupak

Pošto slatkiše ne smijemo oduzimati, svi moraju završiti na najmanje onoliko koliko ima učenik s najvećim brojem slatkiša. Najmanji mogući cilj je zato maksimum M. Odgovor je zbir M-a_i.

## Koraci

1. Naći M = max(a).
2. Za svaki element dodati M-a_i u odgovor.
3. Ispisati zbir.

## Složenost

O(N) vrijeme i O(N) memorija ako čuvamo niz; može i O(1) dodatno uz dva prolaza kada je ulaz dostupan.

## Primjer 1

Ulaz:

```text
4
2 5 5 9
```

Izlaz:

```text
15
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
