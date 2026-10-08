from collections import deque
n, m = map(int, input().split())
g = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)
vis = [False] * n
comp = 0
for s in range(n):
    if vis[s]:
        continue
    comp += 1
    vis[s] = True
    q = deque([s])
    while q:
        u = q.popleft()
        for v in g[u]:
            if not vis[v]:
                vis[v] = True
                q.append(v)
print(comp)
