R, C = map(int, input().split())
dp = [10 ** 30] * C
for r in range(R):
    row = list(map(int, input().split()))
    for c in range(C):
        if r == 0 and c == 0:
            dp[c] = row[c]
        elif r == 0:
            dp[c] = dp[c - 1] + row[c]
        elif c == 0:
            dp[c] = dp[c] + row[c]
        else:
            dp[c] = min(dp[c], dp[c - 1]) + row[c]
print(dp[-1])
