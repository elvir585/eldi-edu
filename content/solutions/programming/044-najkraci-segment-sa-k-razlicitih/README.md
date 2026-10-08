# 044. Najkraći segment sa K različitih

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 160.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Koristi klizni prozor i frekvencijsku mapu za uslov o broju različitih vrijednosti.

## Zadatak

Dat je niz od N cijelih brojeva i broj K. Nađi dužinu najkraćeg uzastopnog segmenta koji sadrži najmanje K različitih vrijednosti. Ako takav segment ne postoji, ispiši -1.

## Ulaz

N K, zatim N cijelih brojeva.

## Izlaz

Minimalna dužina ili -1.

## Ograničenja

1 <= N <= 300000, 1 <= K <= N.

## Razumijevanje i postupak

Desnu granicu širimo dok prozor ne sadrži najmanje K različitih vrijednosti. Tada lijevu granicu guramo naprijed koliko god možemo, bilježeći svaku valjanu dužinu. Svaki indeks ulazi i izlazi iz prozora najviše jednom.

Zašto postupak daje tačan rezultat? Svaki kandidat za minimalni/maksimalni prozor razmatra se u trenutku kada desna granica prvi put zadovolji uslov; zatim lijevu guramo dok uslov više ne važi.

## Koraci

1. freq je mapa vrijednost->broj u prozoru; distinct je broj pozitivnih frekvencija.
2. Za svaki r dodaj a[r].
3. Dok distinct>=K, ažuriraj odgovor pa izbaci a[l] i povećaj l.

## Složenost

Vrijeme O(N) očekivano, memorija O(D), gdje je D broj različitih vrijednosti u prozoru.

## Važne provjere

Ne povećavati distinct pri svakom dodavanju, samo kada frekvencija prelazi 0->1.

Pri brisanju smanjiti distinct tek kada frekvencija postane 0.

## Primjer 1

Ulaz:

```text
8 3
1 2 1 3 4 2 3 1
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
