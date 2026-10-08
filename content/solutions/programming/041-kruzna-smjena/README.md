# 041. Kružna smjena

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 153.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Modelira kružni niz i koristi dupliranje + klizni prozor.

## Zadatak

N učenika sjedi u krugu. Svaki ima vrijednost a_i. Odredi najveći zbir K uzastopnih učenika u kružnom poretku (segment smije preći preko kraja niza).

## Ulaz

N K, zatim N cijelih vrijednosti.

## Izlaz

Najveći zbir kružnog segmenta dužine K.

## Ograničenja

1<=K<=N<=200000, |a_i|<=10^9.

## Razumijevanje i postupak

Krug pretvaramo u linearni niz tako što konceptualno ponovimo prvih K-1 elemenata. Tada svaki kružni segment dužine K postaje običan prozor u dupliranom nizu.

Zašto postupak daje tačan rezultat? Postoji bijekcija između N mogućih kružnih segmenata dužine K i N prozora koji počinju na pozicijama 0..N-1 u dupliranom nizu.

## Koraci

1. Napraviti b=a+a ili indeksirati modulo N.
2. Izračunati prvi prozor dužine K.
3. Pomjeriti početak od 1 do N-1.

## Složenost

Vrijeme O(N), memorija O(N) uz dupliranje.

## Važne provjere

best ne inicijalizovati nulom zbog negativnih vrijednosti.

Razmatrati tačno N početnih pozicija.

## Primjer 1

Ulaz:

```text
5 3
4 -2 7 1 5
```

Izlaz:

```text
13
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
