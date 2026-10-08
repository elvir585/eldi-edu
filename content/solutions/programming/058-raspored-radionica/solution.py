from bisect import bisect_right
n = int(input())
a = []
for _ in range(n):
    s, e, v = map(int, input().split())
    a.append((e, s, v))
a.sort()
ends = [x[0] for x in a]
dp = [0] * (n + 1)
for i, (e, s, v) in enumerate(a):
    j = bisect_right(ends, s, 0, i) - 1
    dp[i + 1] = max(dp[i], v + dp[j + 1])
print(dp[n])
