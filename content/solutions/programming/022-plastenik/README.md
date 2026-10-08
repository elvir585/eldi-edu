# 022. PLASTENIK

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 113.

III gradsko/općinsko takmičenje za osnovne škole, 2022. · [A2], PDF str. 40.

## Zadatak

Tri oznake DA/NE opisuju prozore. Prema broju otvorenih odredi stanje.

## Ulaz

Tri reda, po jedna oznaka.

## Izlaz

Za 3: promaha; za 1 ili 2: vjetrenje; za 0: ustajao vazduh.

## Razumijevanje i postupak

Tri logička podatka možemo prvo pretvoriti u jedan broj: koliko ih ima vrijednost DA. Tada osam mogućih kombinacija svodimo na tri smislene grupe.

Prvo provjeravamo poseban slučaj 3. Potom uslov otvoreni > 0 obuhvata preostale pozitivne mogućnosti. Preostali slučaj je nula. Ovakav redoslijed sprječava da slučaj tri otvorena prozora prerano završi u općoj grani.

Zašto postupak daje tačan rezultat? Broj otvorenih prozora pripada skupu {0,1,2,3}. Tri grane programa su međusobno isključive i zajedno pokrivaju taj skup, s izlazom koji odgovara svakoj grupi.

## Koraci

1. Prebroj oznake DA.
2. Ako je broj 3, ispiši promaha.
3. Inače, ako je pozitivan, ispiši vjetrenje; u suprotnom ustajao vazduh.

## Složenost

Vrijeme O(1); memorija O(1).

## Važne provjere

Izlazne riječi moraju biti zapisane tačno kako je propisano.

Opći uslov „barem jedan“ ne provjeravati prije posebnog slučaja „sva tri“.

## Primjer 1

Ulaz:

```text
NE
DA
NE
```

Izlaz:

```text
vjetrenje
```

Otvoren je jedan od tri prozora; njegovo mjesto ne mijenja kategoriju.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
