# 144. Podjela ekipe

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 412.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi subset-sum DP za balansiranje dvije ekipe.

## Zadatak

N učenika ima vrijednosti snage a_i. Treba ih podijeliti u dvije ekipe tako da apsolutna razlika zbirova snage bude minimalna. Svaki učenik ide u tačno jednu ekipu.

## Ulaz

N, zatim N pozitivnih vrijednosti.

## Izlaz

Minimalna moguća razlika.

## Ograničenja

N<=200, suma svih a_i <= 200000.

## Razumijevanje i postupak

Ako jedna ekipa ima zbir x, druga ima total-x, a razlika je |total-2x|. Treba naći dostižni subset-sum x što bliži total/2.

Zašto postupak daje tačan rezultat? 0/1 subset-sum DP označava tačno sve zbirove koji se mogu dobiti nekim podskupom. Za fiksni total funkcija total-2s opada dok s raste do total/2, pa je najbolji najveći dostižni s u toj polovini.

## Koraci

1. reachable[0]=True.
2. Za svaku vrijednost x ažuriraj sume opadajućim redom.
3. Nađi najveći dostižni s<=total//2.
4. Ispiši total-2*s.

## Složenost

Vrijeme O(N*SUM), memorija O(SUM).

## Važne provjere

Sume se ažuriraju opadajuće da se isti učenik ne koristi više puta.

Ograničenje je po sumi, zato pseudo-polinomijalni DP prolazi.

## Primjer 1

Ulaz:

```text
6
3 1 4 2 2 7
```

Izlaz:

```text
1
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
