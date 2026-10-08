# 031. Klikeri u kutijama

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 132.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristiti prefiksne sume za minimalan broj prenosa između susjednih pozicija.

## Zadatak

U n kutija poredanih u nizu nalazi se a_i klikera. Ukupan broj klikera djeljiv je sa n. U jednom potezu jedan kliker može se prebaciti iz kutije i u susjednu kutiju i-1 ili i+1. Odredi najmanji broj takvih pojedinačnih prenosa da sve kutije imaju jednak broj klikera.

## Ulaz

U prvom redu N, u drugom N nenegativnih cijelih brojeva.

## Izlaz

Ispisati minimalan broj prenosa.

## Ograničenja

1 ≤ N ≤ 200000, zbir a_i ≤ 10^14 i djeljiv je sa N.

## Razumijevanje i postupak

Neka je cilj M = zbir/N. Nakon prvih i kutija, višak u tom prefiksu mora preći granicu između i i i+1, ili manjak mora biti dopunjen preko te granice. Količina koja nužno pređe tu granicu jednaka je apsolutnoj prefiksnoj neravnoteži. Zbir tih apsolutnih vrijednosti je optimum.

## Koraci

1. Izračunati M.
2. Voditi bal += a_i - M.
3. Za svaku granicu poslije kutije i dodati |bal| u odgovor (i=0..N-2).

## Složenost

O(N) vrijeme i O(N) memorija za niz; O(1) dodatne memorije nakon učitavanja.

## Primjer 1

Ulaz:

```text
4
0 4 0 4
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
