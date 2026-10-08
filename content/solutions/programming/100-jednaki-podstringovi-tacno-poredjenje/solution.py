from array import array
s = input().strip()
n = len(s)
q = int(input())
redovi = [array('i', (ord(c) for c in s))]
duzina = 1
while 2 * duzina <= n:
    prethodni = redovi[-1]
    koliko = n - 2 * duzina + 1
    parovi = [(prethodni[i], prethodni[i + duzina], i) for i in range(koliko)]
    parovi.sort()
    novi = array('i', [0]) * koliko
    oznaka = -1
    zadnji = None
    for lijevi, desni, i in parovi:
        kljuc = (lijevi, desni)
        if kljuc != zadnji:
            oznaka += 1
            zadnji = kljuc
        novi[i] = oznaka
    redovi.append(novi)
    duzina *= 2
for _ in range(q):
    l1, r1, l2, r2 = map(int, input().split())
    l1 -= 1
    r1 -= 1
    l2 -= 1
    r2 -= 1
    nivo = (r1 - l1 + 1).bit_length() - 1
    p = 1 << nivo
    a = redovi[nivo]
    jednaki = a[l1] == a[l2] and a[r1 - p + 1] == a[r2 - p + 1]
    print('DA' if jednaki else 'NE')
