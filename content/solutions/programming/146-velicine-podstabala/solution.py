n = int(input())
g = [[] for _ in range(n)]
for _ in range(n - 1):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)
p = [-1] * n
order = [0]
for u in order:
    for v in g[u]:
        if v != p[u] and v != 0:
            p[v] = u
            order.append(v)
sz = [1] * n
for v in reversed(order[1:]):
    sz[p[v]] += sz[v]
print(*sz)
