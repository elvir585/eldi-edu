# 054. Mnogo povećanja intervala

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 181.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi diferencni niz za veliki broj intervalnih ažuriranja.

## Zadatak

Dat je početni niz A i Q operacija. Svaka operacija l r x dodaje x svim elementima od l do r. Nakon svih operacija ispiši konačni niz.

## Ulaz

Prvi red N Q. Drugi red N brojeva. Zatim Q redova l r x.

## Izlaz

Ispisati konačni niz.

## Ograničenja

1 <= N,Q <= 2*10^5.

## Razumijevanje i postupak

Umjesto da svako ažuriranje dira svaki element intervala, u diferencnom nizu označimo početak promjene sa +x i mjesto odmah poslije intervala sa -x. Jedan završni prefiks pretvara razlike u stvarne dodatke.

## Koraci

1. Napravi diff veličine N+1.
2. Za update l,r,x: diff[l-1]+=x; ako r<N, diff[r]-=x.
3. Prefiksno saberi diff i dodaj tekući zbir A[i].

## Složenost

Vrijeme O(N+Q); memorija O(N).

## Važne provjere

Diferencni niz je posebno koristan kada odgovori trebaju tek nakon svih ažuriranja.

Indeksi l,r iz ulaza su 1-bazirani.

## Primjer 1

Ulaz:

```text
5 3
1 2 3 4 5
2 4 10
1 2 -1
5 5 7
```

Izlaz:

```text
0 11 13 14 12
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
