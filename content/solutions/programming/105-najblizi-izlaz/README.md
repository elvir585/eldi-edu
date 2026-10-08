# 105. Najbliži izlaz

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 305.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Pokrenuti BFS istovremeno iz više izvora.

## Zadatak

U mreži R×C postoje slobodna polja ., zidovi # i više izlaza E. Za svako slobodno polje treba odrediti udaljenost do najbližeg izlaza. Za potrebe takmičenja traži se samo najveća od tih minimalnih udaljenosti; ako neko slobodno polje ne može doći ni do jednog izlaza, ispisati -1.

## Ulaz

U prvom redu R C, zatim R redova mreže.

## Izlaz

Ispisati najveću udaljenost do najbližeg izlaza ili -1 ako postoji nedostupno slobodno polje.

## Ograničenja

1 ≤ R,C ≤ 1000; postoji barem jedan E.

## Razumijevanje i postupak

Umjesto BFS-a iz svakog polja, sve izlaze stavimo u red na početku sa distancom 0. BFS zatim širi „talas“ i svakom polju dodjeljuje udaljenost do najbližeg izlaza. Ovo je ekvivalentno pokretanju svih BFS-ova paralelno, ali linearno.

## Koraci

1. Sve E staviti u red i dist=0.
2. Pokrenuti BFS kroz sva nezidna polja.
3. Ako neko . ostane na -1, odgovor je -1.
4. Inače uzeti maksimum svih distanci.

## Složenost

O(R·C) vrijeme i memorija.

## Primjer 1

Ulaz:

```text
3 5
E....
.###.
....E
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
