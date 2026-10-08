n, k = map(int, input().split())
a = list(map(int, input().split()))
l = 0
s = 0
ans = 0
for r, x in enumerate(a):
    s += x
    while s > k:
        s -= a[l]
        l += 1
    ans = max(ans, r - l + 1)
print(ans)
