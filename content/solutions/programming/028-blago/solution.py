upute = input().strip()
m, n = map(int, input().split())
polje = ["".join(input().split()) for _ in range(m)]
smjer = {"I": (0, 1), "Z": (0, -1), "S": (-1, 0), "J": (1, 0)}
r = k = broj = 0
for znak in upute:
    dr, dk = smjer[znak]
    r += dr
    k += dk
    broj += polje[r][k] == "B"
print(broj)
