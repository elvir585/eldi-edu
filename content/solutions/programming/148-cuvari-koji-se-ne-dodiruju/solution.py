n = int(input())
g = [[] for _ in range(n)]
for _ in range(n - 1):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)
p = [-1] * n
ord = [0]
for u in ord:
    for v in g[u]:
        if v != p[u] and v != 0:
            p[v] = u
            ord.append(v)
d0 = [0] * n
d1 = [1] * n
for u in reversed(ord):
    for v in g[u]:
        if p[v] == u:
            d1[u] += d0[v]
            d0[u] += max(d0[v], d1[v])
print(max(d0[0], d1[0]))
