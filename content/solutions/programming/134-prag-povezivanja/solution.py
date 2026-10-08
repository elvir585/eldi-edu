n, m = map(int, input().split())
e = []
for _ in range(m):
    u, v, w = map(int, input().split())
    e.append((w, u - 1, v - 1))
p = list(range(n))
sz = [1] * n
def f(x):
    while x != p[x]:
        p[x] = p[p[x]]
        x = p[x]
    return x
def un(a, b):
    a, b = (f(a), f(b))
    if a == b:
        return
    if sz[a] < sz[b]:
        a, b = (b, a)
    p[b] = a
    sz[a] += sz[b]
for w, u, v in sorted(e):
    un(u, v)
    if f(0) == f(n - 1):
        print(w)
        break
else:
    print(-1)
