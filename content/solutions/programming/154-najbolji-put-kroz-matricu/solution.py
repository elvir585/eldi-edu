r, c = map(int, input().split())
NEG = -10 ** 30
dp = [NEG] * (c + 1)
dp[1] = 0
for _ in range(r):
    row = list(map(int, input().split()))
    for j, x in enumerate(row, 1):
        dp[j] = x + max(dp[j], dp[j - 1])
print(dp[c])
