n, T = map(int, input().split())
dp = [0] * (T + 1)
for _ in range(n):
    t, v = map(int, input().split())
    for x in range(T, t - 1, -1):
        dp[x] = max(dp[x], dp[x - t] + v)
print(max(dp))
