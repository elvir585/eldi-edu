from collections import deque
n, m = map(int, input().split())
cap = [[0] * n for _ in range(n)]
g = [[] for _ in range(n)]
for _ in range(m):
    u, v, c = map(int, input().split())
    u -= 1
    v -= 1
    if cap[u][v] == 0 and cap[v][u] == 0:
        g[u].append(v)
        g[v].append(u)
    cap[u][v] += c
s = 0
t = n - 1
flow = 0
while True:
    par = [-1] * n
    par[s] = s
    q = deque([s])
    while q and par[t] == -1:
        u = q.popleft()
        for v in g[u]:
            if par[v] == -1 and cap[u][v] > 0:
                par[v] = u
                q.append(v)
    if par[t] == -1:
        break
    add = 10 ** 30
    v = t
    while v != s:
        add = min(add, cap[par[v]][v])
        v = par[v]
    v = t
    while v != s:
        u = par[v]
        cap[u][v] -= add
        cap[v][u] += add
        v = u
    flow += add
print(flow)
