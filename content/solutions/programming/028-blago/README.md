# 028. BLAGO

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 125.

IV gradsko/općinsko takmičenje za osnovne škole, 2023. · [A3], PDF str. 37.

## Zadatak

Prati I/Z/S/J kroz matricu O/B od gornjeg lijevog ugla i prebroj dolaske na B.

## Ulaz

Upute; M N; zatim M redova matrice.

## Izlaz

Broj posjeta poljima B.

## Ograničenja

Precizirani model: početno polje je O i sve upute ostaju u matrici. Biltenove Python i C++ verzije različito obrađuju početno B; zato ga ovdje isključujemo.

## Razumijevanje i postupak

Stanje simulacije čine red r, kolona k i broj dosadašnjih posjeta blagu. Smjer I povećava kolonu, Z je smanjuje, J povećava red, a S ga smanjuje.

Svaka naredba mijenja položaj tačno jednom. Poslije pomjeranja pogledamo novo polje. Ne trebaju BFS ni traženje puta: put je već zadan. Razmak između znakova u ulazu uklanjamo, kako bi matrica imala jedan znak po koloni.

Zašto postupak daje tačan rezultat? Indukcijom po broju naredbi: prije svake naredbe položaj odgovara kraju već izvršenog dijela puta, a brojač njegovim posjetama blagu. Pomjeranje i provjera novog polja održavaju oba svojstva.

## Koraci

1. Postavi položaj na (0,0) i brojač na nulu.
2. Pročitaj naredbu i promijeni odgovarajuću koordinatu.
3. Ako novo polje sadrži B, povećaj brojač.

## Složenost

Vrijeme O(MN + L), gdje je L broj naredbi; memorija O(MN).

## Važne provjere

Red raste prema dolje, ne prema gore.

Ovo je broj posjeta, ne broj različitih polja.

## Primjer 1

Ulaz:

```text
IJZIS
2 3
O B O
B B O
```

Izlaz:

```text
5
```

Pet pomjeranja vodi na B pet puta. Povratak na ranije posjećeno polje računa se ponovo.

## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
