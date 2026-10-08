from collections import deque
n, m = map(int, input().split())
g = [[] for _ in range(n)]
for _ in range(m):
    u, v, w = map(int, input().split())
    g[u - 1].append((v - 1, w))
INF = 10 ** 18
d = [INF] * n
d[0] = 0
q = deque([0])
while q:
    u = q.popleft()
    for v, w in g[u]:
        nd = d[u] + w
        if nd < d[v]:
            d[v] = nd
            if w == 0:
                q.appendleft(v)
            else:
                q.append(v)
print(-1 if d[-1] == INF else d[-1])
