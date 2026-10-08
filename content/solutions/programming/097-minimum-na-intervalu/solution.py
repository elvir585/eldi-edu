n, q = map(int, input().split())
a = list(map(int, input().split()))
S = 1
while S < n:
    S *= 2
INF = 10 ** 30
t = [INF] * (2 * S)
for i, x in enumerate(a):
    t[S + i] = x
for i in range(S - 1, 0, -1):
    t[i] = min(t[2 * i], t[2 * i + 1])
def upd(i, x):
    i = S + i - 1
    t[i] = x
    i //= 2
    while i:
        t[i] = min(t[2 * i], t[2 * i + 1])
        i //= 2
def qry(l, r):
    l = S + l - 1
    r = S + r
    ans = INF
    while l < r:
        if l & 1:
            ans = min(ans, t[l])
            l += 1
        if r & 1:
            r -= 1
            ans = min(ans, t[r])
        l //= 2
        r //= 2
    return ans
for _ in range(q):
    z, x, y = map(int, input().split())
    if z == 1:
        upd(x, y)
    else:
        print(qry(x, y))
