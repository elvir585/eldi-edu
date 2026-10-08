a = [input().strip() for _ in range(8)]
smjerovi = [(dr, dk) for dr in (-1, 0, 1)
             for dk in (-1, 0, 1) if (dr, dk) != (0, 0)]
najbolje = 0
for r in range(8):
    for k in range(8):
        if a[r][k] != ".":
            continue
        ukupno = 0
        for dr, dk in smjerovi:
            x, y = r + dr, k + dk
            broj = 0
            while 0 <= x < 8 and 0 <= y < 8 and a[x][y] == "B":
                broj += 1
                x += dr
                y += dk
            if 0 <= x < 8 and 0 <= y < 8 and a[x][y] == "C":
                ukupno += broj
        najbolje = max(najbolje, ukupno)
print(najbolje)
