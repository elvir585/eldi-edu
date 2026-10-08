# 033. Najduži niz bez ponavljanja

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 136.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristiti mapu posljednjih pozicija za najduži podstring bez ponovljenih znakova.

## Zadatak

Dat je string S sastavljen od malih engleskih slova. Nađi dužinu najdužeg uzastopnog dijela u kojem se nijedno slovo ne pojavljuje više od jednom.

## Ulaz

U jednom redu string S.

## Izlaz

Ispisati traženu maksimalnu dužinu.

## Ograničenja

1 ≤ |S| ≤ 200000.

## Razumijevanje i postupak

Održavamo lijevu granicu l trenutnog prozora bez duplikata. Kada znak s[r] već postoji unutar prozora, l pomjeramo iza njegove posljednje pozicije. Potom ažuriramo posljednju poziciju znaka i dužinu.

## Koraci

1. last[znak] čuva posljednju poziciju.
2. Ako last[s[r]] ≥ l, postaviti l=last[s[r]]+1.
3. last[s[r]]=r.
4. Ažurirati maksimum r-l+1.

## Složenost

O(|S|) vrijeme i O(alfabet) memorija.

## Primjer 1

Ulaz:

```text
abcaefgh
```

Izlaz:

```text
7
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
