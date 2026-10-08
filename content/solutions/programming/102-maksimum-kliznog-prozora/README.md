# 102. Maksimum kliznog prozora

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 297.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Monotonim deque-om računa maksimum svakog prozora dužine K u linearnom vremenu.

## Zadatak

Dat je niz od N brojeva i K. Za svaki uzastopni segment dužine K ispiši njegov maksimum.

## Ulaz

N K, zatim N cijelih brojeva.

## Izlaz

N-K+1 maksimuma.

## Ograničenja

1 <= K <= N <= 500000.

## Razumijevanje i postupak

Deque čuva indekse kandidata u opadajućem redoslijedu vrijednosti. Prvo izbacimo indekse koji su izašli iz prozora; zatim sa kraja izbacimo vrijednosti <= novoj jer novi indeks traje duže i nije slabiji. Prednji je maksimum.

Zašto postupak daje tačan rezultat? Prednji indeks je uvijek najveća vrijednost u trenutnom prozoru, a uklanjanje slabijeg kandidata je sigurno jer novi kandidat traje barem jednako dugo i nije manji.

## Koraci

1. Za svaki i: izbaci front < i-K+1.
2. Dok deque i a[back]<=a[i], pop back.
3. Push i.
4. Kada i>=K-1, odgovor je a[front].

## Složenost

Vrijeme O(N), memorija O(K).

## Važne provjere

Indekse van prozora izbacivati prije čitanja maksimuma.

Deque mora čuvati indekse, ne samo vrijednosti.

## Primjer 1

Ulaz:

```text
8 3
1 3 -1 -3 5 3 6 7
```

Izlaz:

```text
3 3 5 5 6 7
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
