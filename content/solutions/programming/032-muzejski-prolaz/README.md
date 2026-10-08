# 032. Muzejski prolaz

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 134.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Pronaći najduži uzastopni segment sa zbirom ograničenim odozgo.

## Zadatak

Muzej ima N sala poredanih redom. Za obilazak i-te sale potrebno je t_i minuta. Učenik ima najviše K minuta i želi posjetiti što više uzastopnih sala, počevši i završavajući gdje želi. Koliko najviše sala može obići?

## Ulaz

U prvom redu N i K, u drugom N pozitivnih trajanja.

## Izlaz

Ispisati najveću dužinu uzastopnog segmenta čiji je zbir ≤ K.

## Ograničenja

1 ≤ N ≤ 200000, 1 ≤ t_i,K ≤ 10^9.

## Razumijevanje i postupak

Svi elementi su pozitivni, pa kada zbir prozora pređe K, pomjeranje lijeve granice udesno sigurno smanjuje zbir. Zato možemo održavati klizni prozor [l,r] u ukupno linearnom vremenu.

## Koraci

1. l=0, suma=0.
2. Za svaki r dodati t[r].
3. Dok suma>K, oduzimati t[l] i povećavati l.
4. Ažurirati maksimum r-l+1.

## Složenost

O(N) vrijeme i O(N) memorija zbog niza; algoritam koristi O(1) dodatno.

## Primjer 1

Ulaz:

```text
7 10
2 1 5 1 1 4 2
```

Izlaz:

```text
5
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
