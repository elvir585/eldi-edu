from collections import deque
n, m = map(int, input().split())
g = [[] for _ in range(n)]
deg = [0] * n
for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    deg[v] += 1
q = deque((i for i in range(n) if deg[i] == 0))
ord = []
while q:
    u = q.popleft()
    ord.append(u)
    for v in g[u]:
        deg[v] -= 1
        q.append(v) if deg[v] == 0 else None
NEG = -10 ** 9
d = [NEG] * n
par = [-1] * n
d[0] = 0
for u in ord:
    if d[u] == NEG:
        continue
    for v in g[u]:
        if d[u] + 1 > d[v]:
            d[v] = d[u] + 1
            par[v] = u
if d[-1] == NEG:
    print(-1)
else:
    path = []
    u = n - 1
    while u != -1:
        path.append(u + 1)
        u = par[u]
    path.reverse()
    print(d[-1])
    print(*path)
