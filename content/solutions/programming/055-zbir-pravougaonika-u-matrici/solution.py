R, C, Q = map(int, input().split())
P = [[0] * (C + 1) for _ in range(R + 1)]
for r in range(1, R + 1):
    row = list(map(int, input().split()))
    for c in range(1, C + 1):
        P[r][c] = row[c - 1] + P[r - 1][c] + P[r][c - 1] - P[r - 1][c - 1]
for _ in range(Q):
    r1, c1, r2, c2 = map(int, input().split())
    print(P[r2][c2] - P[r1 - 1][c2] - P[r2][c1 - 1] + P[r1 - 1][c1 - 1])
