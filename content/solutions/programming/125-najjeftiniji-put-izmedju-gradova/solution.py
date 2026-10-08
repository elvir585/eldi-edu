import heapq
n, m = map(int, input().split())
g = [[] for _ in range(n)]
for _ in range(m):
    u, v, w = map(int, input().split())
    g[u - 1].append((v - 1, w))
INF = 10 ** 30
d = [INF] * n
d[0] = 0
pq = [(0, 0)]
while pq:
    du, u = heapq.heappop(pq)
    if du != d[u]:
        continue
    for v, w in g[u]:
        nd = du + w
        if nd < d[v]:
            d[v] = nd
            heapq.heappush(pq, (nd, v))
print(-1 if d[-1] == INF else d[-1])
