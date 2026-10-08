# 016. Tačka ravnoteže

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 100.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi ukupan zbir i tekući prefiks za pronalazak indeksa ravnoteže.

## Zadatak

Dat je niz od N cijelih brojeva. Nađi najmanji 1-bazni indeks i takav da je zbir elemenata strogo lijevo od i jednak zbiru elemenata strogo desno od i. Ako ne postoji, ispiši -1.

## Ulaz

N, zatim N cijelih brojeva.

## Izlaz

Najmanji indeks ili -1.

## Ograničenja

1 <= N <= 300000, |a_i| <= 10^9.

## Razumijevanje i postupak

Ako je left zbir prije i, tada je right = total-left-a[i]. Nema potrebe računati svaki desni zbir iznova. Prolazimo slijeva nadesno da automatski dobijemo najmanji indeks.

Zašto postupak daje tačan rezultat? Svaki element intervala [l,r] pojavljuje se u s[r+1], a svi elementi prije l poništavaju se oduzimanjem s[l].

## Koraci

1. Izračunaj total.
2. left=0. Za svaki i izračunaj right=total-left-a[i].
3. Ako left==right, ispiši i+1.
4. Inače left+=a[i].

## Složenost

Vrijeme O(N), memorija O(1) dodatno.

## Važne provjere

Element a[i] ne pripada ni lijevom ni desnom zbiru.

Traži se najmanji indeks, zato završiti na prvom pronađenom.

## Primjer 1

Ulaz:

```text
7
-7 1 5 2 -4 3 0
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
