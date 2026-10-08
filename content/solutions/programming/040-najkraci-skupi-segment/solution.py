N, S = map(int, input().split())
a = list(map(int, input().split()))
l = 0
cur = 0
best = N + 1
for r, x in enumerate(a):
    cur += x
    while cur >= S:
        best = min(best, r - l + 1)
        cur -= a[l]
        l += 1
print(0 if best == N + 1 else best)
