n, k = map(int, input().split())
t = list(map(int, input().split()))
lo, hi = (0, min(t) * k)
while lo < hi:
    mid = (lo + hi) // 2
    s = 0
    for x in t:
        s += mid // x
        if s >= k:
            break
    if s >= k:
        hi = mid
    else:
        lo = mid + 1
print(lo)
