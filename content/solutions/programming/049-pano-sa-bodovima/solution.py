r, c, q = map(int, input().split())
p = [[0] * (c + 1) for _ in range(r + 1)]
for i in range(1, r + 1):
    row = list(map(int, input().split()))
    for j in range(1, c + 1):
        p[i][j] = row[j - 1] + p[i - 1][j] + p[i][j - 1] - p[i - 1][j - 1]
for _ in range(q):
    r1, c1, r2, c2 = map(int, input().split())
    ans = p[r2][c2] - p[r1 - 1][c2] - p[r2][c1 - 1] + p[r1 - 1][c1 - 1]
    print(ans)
