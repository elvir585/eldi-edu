MOD = 1000000007
n = int(input())
dp = [0] * (n + 1)
dp[0] = 1
for i in range(1, n + 1):
    for k in (1, 2, 3):
        if i >= k:
            dp[i] = (dp[i] + dp[i - k]) % MOD
print(dp[n])
