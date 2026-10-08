N, D = map(int, input().split())
w = list(map(int, input().split()))
def ok(C):
    days, cur = (1, 0)
    for x in w:
        if cur + x > C:
            days += 1
            cur = 0
        cur += x
    return days <= D
l, r = (max(w), sum(w))
while l < r:
    m = (l + r) // 2
    if ok(m):
        r = m
    else:
        l = m + 1
print(l)
