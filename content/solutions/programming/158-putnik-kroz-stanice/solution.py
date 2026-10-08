n = int(input())
p = [tuple(map(int, input().split())) for _ in range(n)]
def d(i, j):
    return abs(p[i][0] - p[j][0]) + abs(p[i][1] - p[j][1])
INF = 10 ** 30
S = 1 << n
dp = [[INF] * n for _ in range(S)]
dp[1][0] = 0
for mask in range(S):
    if not mask & 1:
        continue
    for i in range(n):
        cur = dp[mask][i]
        if cur == INF:
            continue
        for j in range(n):
            if not mask >> j & 1:
                nm = mask | 1 << j
                v = cur + d(i, j)
                if v < dp[nm][j]:
                    dp[nm][j] = v
full = S - 1
print(min((dp[full][i] + d(i, 0) for i in range(n))))
