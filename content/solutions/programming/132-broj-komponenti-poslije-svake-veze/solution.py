n, m = map(int, input().split())
p = list(range(n))
sz = [1] * n
c = n
def f(x):
    while x != p[x]:
        p[x] = p[p[x]]
        x = p[x]
    return x
for _ in range(m):
    a, b = map(int, input().split())
    a = f(a - 1)
    b = f(b - 1)
    if a != b:
        if sz[a] < sz[b]:
            a, b = (b, a)
        p[b] = a
        sz[a] += sz[b]
        c -= 1
    print(c)
