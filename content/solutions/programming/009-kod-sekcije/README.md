# 009. Kod sekcije

Izvor: **Elvir Čajić — Programiranje, Python 3 i C++17**, Tuzla, 2026, PDF str. 86.

Autorska vježba iz knjige Elvira Čajića; nije označena kao arhivski zadatak.

## Cilj

Pristupiti tačno određenim pozicijama u stringu i prebrojati zapise koji ispunjavaju uslov.

## Zadatak

Članovi informatičke sekcije imaju šifru oblika GG-RR-B, gdje su GG dvije cifre godine, RR dvije cifre razreda, a B jedna cifra grupe, npr. 25-08-3. Prebroj koliko od N učenika ima razred najmanje 08 i grupu 3.

## Ulaz

U prvom redu je N. U narednih N redova po jedna šifra tačno navedenog oblika.

## Izlaz

Ispisati broj odgovarajućih učenika.

## Ograničenja

1 ≤ N ≤ 10000.

## Razumijevanje i postupak

Format je fiksan, pa možemo izvući podstring na pozicijama 3 i 4 kao razred, te posljednji znak kao grupu. U Pythonu je jednostavno koristiti s[3:5], a u C++ substr(3,2).

## Koraci

1. Za svaku šifru izdvojiti RR.
2. Pretvoriti RR u cijeli broj.
3. Provjeriti RR ≥ 8 i posljednji znak == 3.
4. Povećati brojač.

## Složenost

O(N) vrijeme jer je dužina svake šifre konstantna.

## Primjer 1

Ulaz:

```text
4
25-08-3
25-07-3
24-09-2
26-09-3
```

Izlaz:

```text
2
```



## Pokretanje

```sh
python solution.py < example-1.in
g++ -std=c++17 -O2 solution.cpp -o solution
./solution < example-1.in
```

Provjera primjera potvrđuje navedeni primjer; ne zamjenjuje dokaz algoritma ni službene skrivene testove.
