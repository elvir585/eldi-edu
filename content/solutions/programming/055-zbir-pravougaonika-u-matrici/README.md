# 055. Zbir pravougaonika u matrici

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 183.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Učenik koristi 2D prefiksne sume i princip uključenja-isključenja.

## Zadatak

Za matricu R x C odgovori na Q upita: koliki je zbir elemenata u pravougaoniku od (r1,c1) do (r2,c2), uključivo.

## Ulaz

Prvi red R C Q. Zatim matrica. Nakon toga Q redova r1 c1 r2 c2.

## Izlaz

Za svaki upit ispisati zbir.

## Ograničenja

1 <= R,C <= 1000, 1 <= Q <= 2*10^5.

## Razumijevanje i postupak

P[r][c] čuva zbir pravougaonika od (1,1) do (r,c). Željeni pravougaonik dobijamo kao veliki prefiks minus gornji pojas minus lijevi pojas plus dio koji smo oduzeli dvaput.

## Koraci

1. Izgradi P sa dodatnim nultim redom i kolonom.
2. P[r][c]=A+P[r-1][c]+P[r][c-1]-P[r-1][c-1].
3. Upit = P[r2][c2]-P[r1-1][c2]-P[r2][c1-1]+P[r1-1][c1-1].

## Složenost

Izgradnja O(R*C); svaki upit O(1); memorija O(R*C).

## Važne provjere

Zadnji presjek mora se dodati jer je oduzet dvaput.

Nulti rub prefiksne matrice znatno pojednostavljuje formule.

## Primjer 1

Ulaz:

```text
3 3 2
1 2 3
4 5 6
7 8 9
1 1 2 2
2 2 3 3
```

Izlaz:

```text
12
28
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
