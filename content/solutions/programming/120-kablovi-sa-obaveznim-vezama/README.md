# 120. Kablovi sa obaveznim vezama

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 346.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Kombinuje DSU i Kruskal uz unaprijed spojene komponente.

## Zadatak

N računara treba povezati uz minimalan dodatni trošak. Dato je M mogućih kablova sa cijenama i K postojećih besplatnih veza koje su već izgrađene. Odredi minimalan dodatni trošak da cijela mreža postane povezana, ili -1 ako nije moguće.

## Ulaz

N M K; zatim M redova u v w; zatim K redova u v.

## Izlaz

Minimalan dodatni trošak ili -1.

## Ograničenja

N<=200000, M<=300000.

## Razumijevanje i postupak

Postojeće veze prvo besplatno spajamo u DSU-u. Zatim standardni Kruskal sortira samo kablove koji se plaćaju i uzima one koji spajaju različite komponente.

Zašto postupak daje tačan rezultat? Kruskalov exchange argument ostaje važeći nakon kontrakcije već povezanih komponenti. Besplatne postojeće veze možemo smatrati ivicama težine 0 koje su unaprijed odabrane.

## Koraci

1. DSU inicijalizacija.
2. Union za K postojećih veza.
3. Sortiraj M kablova po cijeni.
4. Za svaku ivicu: ako union uspije, dodaj cijenu.
5. Na kraju provjeri da je ostala jedna komponenta.

## Složenost

Vrijeme O(M log M + (N+M) alpha(N)), memorija O(N+M).

## Važne provjere

Postojeće veze ne dodaju cijenu.

Ne pretpostaviti da M kablova garantuje povezivost.

## Primjer 1

Ulaz:

```text
4 4 1
1 2 5
2 3 2
3 4 4
1 4 10
1 2
```

Izlaz:

```text
6
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
