import heapq
n, m, s, t = map(int, input().split())
s -= 1
t -= 1
g = [[] for _ in range(n)]
for _ in range(m):
    u, v, w = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append((v, w))
    g[v].append((u, w))
INF = 10 ** 30
d = [INF] * n
d[s] = 0
pq = [(0, s)]
while pq:
    du, u = heapq.heappop(pq)
    if du != d[u]:
        continue
    for v, w in g[u]:
        nd = du + w
        if nd < d[v]:
            d[v] = nd
            heapq.heappush(pq, (nd, v))
print(-1 if d[t] == INF else d[t])
