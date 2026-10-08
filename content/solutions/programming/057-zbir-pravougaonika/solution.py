R, C, Q = map(int, input().split())
p = [[0] * (C + 1) for _ in range(R + 1)]
for r in range(1, R + 1):
    row = list(map(int, input().split()))
    for c, x in enumerate(row, 1):
        p[r][c] = x + p[r - 1][c] + p[r][c - 1] - p[r - 1][c - 1]
for _ in range(Q):
    r1, c1, r2, c2 = map(int, input().split())
    print(p[r2][c2] - p[r1 - 1][c2] - p[r2][c1 - 1] + p[r1 - 1][c1 - 1])
