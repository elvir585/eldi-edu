MOD = 1000000007
R, C = map(int, input().split())
dp = [0] * C
dp[0] = 1
for _ in range(R):
    row = input().strip()
    for c in range(C):
        if row[c] == '#':
            dp[c] = 0
        elif c > 0:
            dp[c] = (dp[c] + dp[c - 1]) % MOD
print(dp[-1])
