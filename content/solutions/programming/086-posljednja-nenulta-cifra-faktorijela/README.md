# 086. Posljednja nenulta cifra faktorijela

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 255.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Kontroliše faktore 2 i 5 da ukloni završne nule bez izgradnje ogromnog faktorijela.

## Zadatak

Za dato N odredi posljednju nenultu decimalnu cifru broja N!.

## Ulaz

Jedan cijeli broj N.

## Izlaz

Jedna cifra 1-9 (za N=0 odgovor je 1).

## Ograničenja

0 <= N <= 1000000.

## Razumijevanje i postupak

Završna nula nastaje parom 2*5. Pri množenju 1..N iz svakog faktora izbacujemo sve dvojke i petice, množimo ostatke modulo 10, a na kraju vraćamo višak dvojki.

Zašto postupak daje tačan rezultat? Ako je stanje ispravno poslije prvih i elemenata, lokalno pravilo ga tačno ažurira nakon elementa i+1. Indukcijom stanje je tačno na kraju.

## Koraci

1. cnt2=cnt5=0, res=1.
2. Za svaki x izdvoji faktore 2 i 5, ostatak pomnoži u res modulo 10.
3. Upari min(cnt2,cnt5); ostaje cnt2-cnt5 dvojki.
4. Pomnoži res sa 2^(višak) modulo 10.

## Složenost

Vrijeme O(N log N) u najgorem faktorizacionom smislu, praktično O(N log N) sa vrlo malom konstantom; memorija O(1).

## Važne provjere

Ne brisati nule tek na kraju iz ogromnog broja.

Višak faktora 2 je uvijek nenegativan u faktorijelu.

## Primjer 1

Ulaz:

```text
10
```

Izlaz:

```text
8
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
