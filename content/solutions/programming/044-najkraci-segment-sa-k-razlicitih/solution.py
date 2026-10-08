from collections import defaultdict
n, k = map(int, input().split())
a = list(map(int, input().split()))
f = defaultdict(int)
l = 0
d = 0
ans = n + 1
for r, x in enumerate(a):
    if f[x] == 0:
        d += 1
    f[x] += 1
    while d >= k:
        ans = min(ans, r - l + 1)
        y = a[l]
        f[y] -= 1
        if f[y] == 0:
            d -= 1
        l += 1
print(-1 if ans == n + 1 else ans)
