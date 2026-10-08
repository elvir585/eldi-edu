# 097. Minimum na intervalu

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 282.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Segmentnim stablom podržava tačkasto postavljanje i minimum na intervalu.

## Zadatak

Dat je niz i Q operacija. 1 i x postavlja a_i=x. 2 l r traži minimalnu vrijednost na indeksima l..r.

## Ulaz

N Q, početni niz, zatim Q operacija.

## Izlaz

Odgovori za upite tipa 2.

## Ograničenja

N,Q <= 300000, |vrijednost| <= 10^9.

## Razumijevanje i postupak

Koristimo iterativno segmentno stablo sa bazom size kao sljedećim stepenom dvojke. Listovi čuvaju elemente, a roditelj minimum djece. Upit [l,r] pretvaramo u poluotvoreni [l,r+1).

Zašto postupak daje tačan rezultat? Agregat roditelja je tačno kombinacija agregata djece. Nakon ažuriranja svih predaka i spajanja pokrivenih čvorova dobijamo tačan odgovor.

## Koraci

1. Izaberi S=2^k >= N i napuni tree[S+i].
2. Izgradi roditelje min(tree[2p],tree[2p+1]).
3. Update mijenja list pa sve pretke.
4. Query skuplja rubne čvorove dok se l i r penju.

## Složenost

Izgradnja O(N), update O(log N), query O(log N), memorija O(N).

## Važne provjere

Neutralni element za min mora biti +INF, ne 0.

Paziti na poluotvoreni interval u iterativnom upitu.

## Primjer 1

Ulaz:

```text
5 4
7 2 9 4 6
2 2 5
1 2 8
2 1 3
2 4 4
```

Izlaz:

```text
2
7
4
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
