# 091. Dinamički zbir intervala

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 266.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi Fenwickovo stablo za tačkasto ažuriranje i upite prefiksnog/intervalnog zbira.

## Zadatak

Dat je niz od N brojeva i Q upita. Upit ADD i x povećava A[i] za x. Upit SUM l r traži zbir A[l]+...+A[r].

## Ulaz

Prvi red N Q. Drugi red početni niz. Zatim Q redova sa ADD i x ili SUM l r.

## Izlaz

Za svaki SUM upit ispisati odgovor u posebnom redu.

## Ograničenja

1 <= N,Q <= 2*10^5, vrijednosti staju u 64-bitni cijeli broj.

## Razumijevanje i postupak

Prefiksna suma je odlična kada se niz ne mijenja, ali nakon svakog ADD morali bismo prepraviti mnogo prefiksa. Fenwickovo stablo čuva parcijalne sume tako da i ažuriranje i prefiksni upit traju O(log N).

## Koraci

1. add(i,x): dok i<=N dodaj x u bit[i] i uradi i += i&-i.
2. sum(i): dok i>0 saberi bit[i] i uradi i -= i&-i.
3. SUM(l,r)=sum(r)-sum(l-1).
4. Početni niz ubaci pozivima add.

## Složenost

Izgradnja O(N log N); svaki upit O(log N); memorija O(N).

## Važne provjere

Fenwick se najjednostavnije koristi sa indeksima od 1.

U SUM upitu treći broj je indeks r, iako se u parseru privremeno čuva u 64-bitnoj varijabli.

## Primjer 1

Ulaz:

```text
5 4
1 2 3 4 5
SUM 2 4
ADD 3 5
SUM 1 3
SUM 4 5
```

Izlaz:

```text
9
11
9
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
