# 096. Dinamički zbir intervala

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 279.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Fenwickovim stablom podržava tačkaste promjene i intervalne sume u O(log N).

## Zadatak

Dat je niz od N brojeva i Q operacija. Operacija 1 i x postavlja a_i=x. Operacija 2 l r traži zbir a_l+...+a_r. Ispiši odgovor za svaku operaciju tipa 2.

## Ulaz

N Q, početni niz, zatim Q operacija.

## Izlaz

Odgovori na upite tipa 2.

## Ograničenja

N,Q <= 300000, |a_i|,|x| <= 10^9.

## Razumijevanje i postupak

Obične prefiksne sume pucaju kada se elementi mijenjaju. Fenwick podržava add(delta) i prefix(i). Za postavljanje a_i=x računamo delta=x-a_i, ažuriramo Fenwick i samu vrijednost.

Zašto postupak daje tačan rezultat? Blokovi koje prefix posjeti disjunktno pokrivaju tačno prefiks 1..i; update mijenja tačno sve blokove koji sadrže promijenjenu poziciju.

## Koraci

1. Izgradi Fenwick dodavanjem početnih a[i].
2. update(i,delta): i+=i&-i.
3. prefix(i): s+=bit[i], i-=i&-i.
4. Range sum = prefix(r)-prefix(l-1).

## Složenost

Izgradnja O(N log N), svaka operacija O(log N), memorija O(N).

## Važne provjere

Fenwick koristi 1-bazne indekse.

Operacija postavljanja nije isto što i dodavanje; zato računamo delta.

## Primjer 1

Ulaz:

```text
5 5
1 2 3 4 5
2 1 5
1 3 10
2 2 4
1 1 -2
2 1 2
```

Izlaz:

```text
15
16
0
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
