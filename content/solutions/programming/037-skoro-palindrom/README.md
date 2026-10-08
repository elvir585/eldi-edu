# 037. Skoro palindrom

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 144.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi dva pokazivača i razmatra mali broj mogućih odluka kada se pojavi prvo neslaganje.

## Zadatak

Za string S odredi može li postati palindrom brisanjem najviše jednog znaka.

## Ulaz

Jedan string S sastavljen od malih slova.

## Izlaz

Ispisati DA ili NE.

## Ograničenja

1 <= |S| <= 2*10^5.

## Razumijevanje i postupak

Dok su krajnji znakovi jednaki, odluke nema. Kod prvog neslaganja jedine realne mogućnosti su izbrisati lijevi ili desni znak. Nakon toga preostali dio mora već biti palindrom.

## Koraci

1. Pomjeraj l i r dok su S[l]==S[r].
2. Na prvom neslaganju provjeri segment (l+1,r) i segment (l,r-1).
3. Ako je barem jedan palindrom, odgovor je DA.

## Složenost

Vrijeme O(N); memorija O(1).

## Važne provjere

Ne pokušavati brisanje svakog znaka posebno - to bi bilo O(N²).

Brisanje nije obavezno; već palindrom je takođe DA.

## Primjer 1

Ulaz:

```text
abca
```

Izlaz:

```text
DA
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
