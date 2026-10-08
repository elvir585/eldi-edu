# 098. Rječnik prefiksa

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 285.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Gradi Trie i odgovara koliko riječi počinje datim prefiksom.

## Zadatak

Dato je N riječi malih slova i Q prefiksnih upita. Za svaki prefiks P odredi koliko od N riječi počinje sa P. Duplikati riječi računaju se posebno.

## Ulaz

N Q, zatim N riječi, zatim Q prefiksa.

## Izlaz

Po jedan broj za svaki prefiks.

## Ograničenja

Ukupan broj znakova u svim riječima i upitima <= 1000000.

## Razumijevanje i postupak

Svaki Trie čvor predstavlja prefiks. Pri umetnju riječi povećamo cnt u svakom čvoru kroz koji riječ prolazi. Upit samo prati znakove prefiksa; ako put ne postoji odgovor je 0, inače cnt posljednjeg čvora.

Zašto postupak daje tačan rezultat? Umetanje povećava brojač tačno na čvorovima svih prefiksa riječi. Zato čvor do kojeg dođemo nakon čitanja prefiksa sadrži tačan broj riječi sa tim prefiksom.

## Koraci

1. Korijen je čvor 0.
2. Za svaku riječ prolazi znakove, kreiraj nedostajuće dijete i povećaj cnt tog djeteta.
3. Za upit prati put bez kreiranja.
4. Ispiši cnt na kraju ili 0.

## Složenost

Vrijeme O(ukupnom broju znakova), memorija O(ukupnom broju različitih prefiksa).

## Važne provjere

Brojač se povećava pri prolasku svakog umetnutog primjerka.

Upit ne smije slučajno kreirati nove čvorove.

## Primjer 1

Ulaz:

```text
5 4
ana
ananas
anto
ban
ana
an
ana
b
x
```

Izlaz:

```text
4
3
1
0
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
