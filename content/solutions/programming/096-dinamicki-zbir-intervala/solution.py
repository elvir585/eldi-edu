n, q = map(int, input().split())
a = [0] + list(map(int, input().split()))
bit = [0] * (n + 1)
def addb(i, d):
    while i <= n:
        bit[i] += d
        i += i & -i
def pref(i):
    s = 0
    while i:
        s += bit[i]
        i -= i & -i
    return s
for i in range(1, n + 1):
    addb(i, a[i])
for _ in range(q):
    t, x, y = map(int, input().split())
    if t == 1:
        addb(x, y - a[x])
        a[x] = y
    else:
        print(pref(y) - pref(x - 1))
