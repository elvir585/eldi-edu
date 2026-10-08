from collections import deque
n, m, s, t = map(int, input().split())
s -= 1
t -= 1
g = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)
d = [-1] * n
d[s] = 0
q = deque([s])
while q:
    u = q.popleft()
    for v in g[u]:
        if d[v] == -1:
            d[v] = d[u] + 1
            q.append(v)
print(d[t])
