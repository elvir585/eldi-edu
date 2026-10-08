n, d = map(int, input().split())
a = list(map(int, input().split()))
lo = max(a)
hi = sum(a)
def ok(c):
    rides = 1
    s = 0
    for x in a:
        if s + x > c:
            rides += 1
            s = 0
        s += x
    return rides <= d
while lo < hi:
    m = (lo + hi) // 2
    if ok(m):
        hi = m
    else:
        lo = m + 1
print(lo)
