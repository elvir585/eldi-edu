n, q = map(int, input().split())
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
for _ in range(q):
    t, a, b = map(int, input().split())
    a -= 1
    b -= 1
    if t == 1:
        un(a, b)
    else:
        print('DA' if f(a) == f(b) else 'NE')
