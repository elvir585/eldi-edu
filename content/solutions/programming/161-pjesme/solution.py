n = int(input())
trazene = {input().strip() for _ in range(n)}
m = int(input())
broj = 0
odgovor = -1
for pozicija in range(1, m + 1):
    rijec = input().strip()
    if rijec in trazene:
        trazene.remove(rijec)
        broj += 1
    if odgovor == -1 and 2 * broj >= n:
        odgovor = pozicija
print(odgovor)
