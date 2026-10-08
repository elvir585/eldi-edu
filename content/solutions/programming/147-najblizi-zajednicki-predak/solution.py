from collections import deque
n, q = map(int, input().split())
g = [[] for _ in range(n)]
for _ in range(n - 1):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)
LOG = n.bit_length()
up = [[0] * n for _ in range(LOG)]
dep = [0] * n
par = [-1] * n
par[0] = 0
dq = deque([0])
while dq:
    u = dq.popleft()
    for v in g[u]:
        if par[v] == -1:
            par[v] = u
            dep[v] = dep[u] + 1
            dq.append(v)
up[0] = par[:]
for k in range(1, LOG):
    for v in range(n):
        up[k][v] = up[k - 1][up[k - 1][v]]
def lca(a, b):
    if dep[a] < dep[b]:
        a, b = (b, a)
    diff = dep[a] - dep[b]
    for k in range(LOG):
        if diff >> k & 1:
            a = up[k][a]
    if a == b:
        return a
    for k in range(LOG - 1, -1, -1):
        if up[k][a] != up[k][b]:
            a = up[k][a]
            b = up[k][b]
    return up[0][a]
for _ in range(q):
    a, b = map(int, input().split())
    print(lca(a - 1, b - 1) + 1)
