k, S = map(int, input().split())
c = list(map(int, input().split()))
INF = 10 ** 9
dp = [INF] * (S + 1)
dp[0] = 0
for x in range(1, S + 1):
    for v in c:
        if v <= x and dp[x - v] != INF:
            dp[x] = min(dp[x], dp[x - v] + 1)
print(-1 if dp[S] == INF else dp[S])
