n = int(input())
a = list(map(int, input().split()))
tot = sum(a)
if tot % 2:
    print('NE')
else:
    t = tot // 2
    dp = [False] * (t + 1)
    dp[0] = True
    for x in a:
        for s in range(t, x - 1, -1):
            dp[s] |= dp[s - x]
    print('DA' if dp[t] else 'NE')
