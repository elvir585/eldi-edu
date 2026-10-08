# 095. Najkraći period poruke

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 277.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi prefiks-funkciju za pronalazak najmanjeg perioda stringa.

## Zadatak

Za string S odredi najmanju pozitivnu dužinu p takvu da se S može dobiti ponavljanjem svog prefiksa dužine p jedan ili više puta. Ako nema kraćeg perioda, odgovor je |S|.

## Ulaz

Jedan string S.

## Izlaz

Najmanja dužina perioda.

## Ograničenja

1<=|S|<=1000000.

## Razumijevanje i postupak

Prefiks-funkcija pi[n-1] daje dužinu najdužeg pravog prefiksa koji je i sufiks. Kandidat perioda je p=n-pi[n-1]. On je pravi period samo ako n%p==0.

Zašto postupak daje tačan rezultat? Ako string ima period p, tada prefiks dužine n-p jednak je sufiksu iste dužine, pa pi[n-1]>=n-p. Najmanji kandidat iz najdužeg bordera daje osnovni period; djeljivost osigurava cijeli broj ponavljanja.

## Koraci

1. Izračunaj KMP prefiks-funkciju.
2. p=n-pi[-1].
3. Ako n%p==0 ispiši p, inače n.

## Složenost

Vrijeme O(N), memorija O(N).

## Važne provjere

Kandidat p bez provjere n%p može biti lažan period.

pi je dužina, ne indeks.

## Primjer 1

Ulaz:

```text
abcabcabcabc
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
