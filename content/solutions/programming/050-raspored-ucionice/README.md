# 050. Raspored učionice

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 173.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Izabrati maksimalan broj međusobno nepreklapajućih termina.

## Zadatak

Za N radionica poznati su početak s_i i kraj e_i. U jednoj učionici može se održati samo jedna radionica u isto vrijeme. Radionica koja završava u trenutku t ne preklapa se s onom koja počinje u t. Odredi najveći broj radionica koje se mogu održati u jednoj učionici.

## Ulaz

U prvom redu N, zatim N redova s_i e_i.

## Izlaz

Ispisati maksimalan broj radionica.

## Ograničenja

1 ≤ N ≤ 200000, 0 ≤ s_i < e_i ≤ 10^9.

## Razumijevanje i postupak

Optimalna greedy strategija je uvijek izabrati među dostupnim terminima onaj koji najranije završava. Time ostavljamo najviše prostora za buduće radionice. Sortiramo po vremenu završetka i uzimamo termin ako počinje nakon ili tačno kada je prethodni završio.

## Koraci

1. Sortirati intervale po e_i rastuće.
2. Voditi last_end.
3. Ako s_i ≥ last_end, izabrati radionicu i postaviti last_end=e_i.

## Složenost

O(N log N) vrijeme, O(N) memorija.

## Primjer 1

Ulaz:

```text
5
1 3
2 5
3 4
4 7
6 8
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
