MOD = 1000000007
N, K = map(int, input().split())
bad = set(map(int, input().split())) if K else set()
dp = [0] * (N + 1)
dp[0] = 1
for i in range(1, N + 1):
    if i not in bad:
        dp[i] = dp[i - 1] + (dp[i - 2] if i >= 2 else 0)
        dp[i] %= MOD
print(dp[N])
