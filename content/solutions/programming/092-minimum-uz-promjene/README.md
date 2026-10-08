# 092. Minimum uz promjene

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 269.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi segmentno stablo za tačkasta ažuriranja i minimum na intervalu.

## Zadatak

Dat je niz i Q upita. SET i x postavlja A[i]=x. MIN l r traži najmanju vrijednost na intervalu [l,r].

## Ulaz

Prvi red N Q. Drugi red niz. Zatim Q upita.

## Izlaz

Za svaki MIN ispisati odgovor.

## Ograničenja

1 <= N,Q <= 2*10^5.

## Razumijevanje i postupak

Segmentno stablo hijerarhijski dijeli niz na intervale. Svaki čvor čuva minimum svog intervala. Ažuriranje mijenja jedan list i O(log N) predaka; upit obilazi samo O(log N) relevantnih čvorova.

## Koraci

1. Izaberi veličinu size kao prvi stepen dvojke >=N.
2. Listovi počinju na size, roditelj čuva min djece.
3. SET ažurira list pa se penje prema korijenu.
4. MIN koristi iterativni interval [l,r) i pomjera granice prema gore.

## Složenost

Izgradnja O(N); svaki upit O(log N); memorija O(N).

## Važne provjere

Upit se često implementira kao poluotvoren interval [l,r).

Fenwick je jednostavniji za zbir; segmentno stablo je fleksibilnije za minimum i druge asocijativne operacije.

## Primjer 1

Ulaz:

```text
5 4
5 2 7 1 6
MIN 2 5
SET 4 8
MIN 2 5
MIN 1 3
```

Izlaz:

```text
1
2
2
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
