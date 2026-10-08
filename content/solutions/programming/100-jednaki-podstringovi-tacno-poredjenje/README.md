# 100. Jednaki podstringovi — tačno poređenje

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 291.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Dvostrukim rolling hashom odgovara na veliki broj upita jednakosti podstringova jednake dužine.

## Zadatak

Dat je string S i Q upita. Svaki upit daje l1 r1 l2 r2, pri čemu su dužine podstringova jednake. Ispiši DA ako su S[l1..r1] i S[l2..r2] jednaki, inače NE. Indeksi su 1-bazni.

## Ulaz

S, Q, zatim Q upita.

## Izlaz

DA/NE po upitu.

## Ograničenja

1 ≤ |S| ≤ 300000; 1 ≤ Q ≤ 300000. S sadrži mala slova engleske abecede. Upiti označavaju važeće podstringove jednakih dužina.

## Razumijevanje i postupak

Umjesto numeričkih hash potpisa s mogućim kolizijama, dodjeljujemo tačne oznake klasama jednakih blokova dužine 1, 2, 4, 8, ... . Blok dužine 2k određen je parom oznaka svojih polovina. Sortiranjem parova i dodjelom jednake oznake jednakim parovima dobijamo tačnu, a ne vjerovatnosnu jednakost.

Za upit dužine L uzmemo najveći stepen dvojke p koji nije veći od L. Poredimo početne blokove dužine p i završne blokove dužine p. Budući da je 2p barem L, ta dva bloka zajedno pokrivaju cijeli podstring; njihovo preklapanje nije problem.

Zašto postupak daje tačan rezultat? Indukcijom po dužini stepena dvojke oznake su jednake tačno kada su jednaki cijeli blokovi: baza poredi znakove, a korak poredi obje polovine. U upitu su početni i završni blok zajedno pokrili svaki položaj podstringa. Jednakost oba para oznaka zato je ekvivalentna jednakosti svih znakova, bez rizika hash kolizije.

## Koraci

1. Prvi red oznaka napravi od znakova stringa.
2. Udvostručuj dužinu bloka; za svaki važeći početak formiraj par oznaka polovina.
3. Sortiraj parove i jednake parove označi istim cijelim brojem.
4. Za svaki upit uporedi oznake početnog i završnog bloka odabrane dužine.

## Složenost

Predobrada O(N log² N), upit O(1), memorija O(N log N). Oznake su u Pythonu smještene u kompaktne nizove array; konkretno vrijeme izvođenja zavisi od ulaza i okruženja.

## Važne provjere

Oznake se porede samo unutar istog nivoa, odnosno za istu dužinu bloka.

Završni blok uključivog intervala [l,r] počinje na r − p + 1.

Nije dovoljno provjeriti samo početni blok kada L nije stepen dvojke.

## Primjer 1

Ulaz:

```text
abrakadabra
3
1 3 8 10
1 4 4 7
4 6 6 8
```

Izlaz:

```text
DA
NE
NE
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
