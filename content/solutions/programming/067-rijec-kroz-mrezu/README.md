# 067. Riječ kroz mrežu

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 212.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik kombinuje DFS/backtracking, granice matrice i privremeno označavanje posjećenih polja.

## Zadatak

U matrici slova pronađi da li se zadana riječ može pročitati kretanjem gore, dolje, lijevo ili desno. Isto polje se u jednoj putanji ne smije koristiti dvaput.

## Ulaz

Prvi red R C. Zatim R redova mreže. Posljednji red je riječ W.

## Izlaz

Ispisati DA ili NE.

## Ograničenja

1 <= R,C <= 20, |W| <= R*C.

## Razumijevanje i postupak

DFS stanje je (r,c,k): nalazimo se na polju (r,c) i očekujemo W[k]. Polje privremeno označimo kao iskorišteno, istražimo četiri susjeda, pa ga vratimo.

## Koraci

1. Pokreni DFS iz svakog polja jednakog prvom slovu.
2. Ako znak ne odgovara ili je polje van mreže, grana ne uspijeva.
3. Ako je k posljednji indeks i znak odgovara, uspjeh.
4. Privremeno označi polje, probaj 4 smjera, zatim vrati znak.

## Složenost

Najgore O(R*C*4^|W|), uz rezove obično znatno manje; memorija O(|W|).

## Važne provjere

Ako se stanje ne vrati nakon DFS-a, kasniji početci dobijaju pokvarenu mrežu.

Ne dozvoliti dijagonalno kretanje.

## Primjer 1

Ulaz:

```text
3 4
ABCE
SFCS
ADEE
ABCCED
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
