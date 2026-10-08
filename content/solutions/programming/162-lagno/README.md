# 162. LAGNO

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 459.

Kantonalno takmičenje za srednje škole, 2024. · [A4], PDF str. 15.

## Zadatak

Na prazno polje table stavi crni žeton. Prebroj bijele nizove omeđene novim i postojećim crnim žetonom, u osam smjerova.

## Ulaz

Osam redova po osam znakova: . prazno, C crno, B bijelo.

## Izlaz

Najviše preokrenutih bijelih žetona; 0 ako ih nema.

## Razumijevanje i postupak

Svako prazno polje isprobavamo kao kandidat. Iz njega gledamo horizontalno, vertikalno i dijagonalno. U jednom smjeru prvo mora doći barem jedan bijeli žeton. Niz tih bijelih vrijedi samo ako se završava crnim žetonom prije izlaska iz table.

Prazno polje ili rub prekidaju mogućnost zarobljavanja. Za jedan kandidat sabiramo rezultate svih smjerova, ali tablu ne mijenjamo: svi smjerovi procjenjuju se prema istom početnom rasporedu. Tek rezultat cijelog kandidata poredi se s dotadašnjim maksimumom.

Zašto postupak daje tačan rezultat? U jednom smjeru pravilo može zahvatiti samo početni neprekinuti niz bijelih žetona. Provjera završnog crnog žetona tačno odlučuje da li je taj niz omeđen. Osam smjerova pokriva sve dopuštene pravce, a obilazak svih praznih polja sve poteze.

## Koraci

1. Obiđi sva prazna polja.
2. U svakom od osam smjerova prebroj neposredni niz B.
3. Dodaj taj broj samo ako sljedeće polje postoji i sadrži C.
4. Sačuvaj najveći zbir za jedan potez.

## Složenost

Za tablu 8 × 8 vrijeme i memorija su O(1). Za tablu K × K direktni postupak je O(K³), uz O(K²) memorije.

## Važne provjere

Bijeli niz bez završnog C ne donosi rezultat.

Ne mijenjati tablu tokom procjene smjerova jednog kandidata.

## Primjer 1

Ulaz:

```text
........
........
........
.CBB....
........
........
........
........
```

Izlaz:

```text
2
```

Crni žeton na petom polju četvrtog reda omeđuje dva bijela s postojećim crnim žetonom.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
