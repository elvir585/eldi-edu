import sys
a, b = map(int, sys.stdin.read().split())
ukupno = a + b
odgovor = ukupno
for novo_b in range(1, ukupno):
    if (ukupno - novo_b) % novo_b == 0:
        odgovor = min(odgovor, abs(novo_b - b))
print(odgovor)
