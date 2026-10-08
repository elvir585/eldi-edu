import heapq
n, m = map(int, input().split())
g = [[] for _ in range(n)]
for _ in range(m):
    u, v, w = map(int, input().split())
    g[u - 1].append((v - 1, w))
INF = 10 ** 30
d = [[INF, INF] for _ in range(n)]
d[0][0] = 0
pq = [(0, 0, 0)]
while pq:
    du, u, z = heapq.heappop(pq)
    if du != d[u][z]:
        continue
    for v, w in g[u]:
        if du + w < d[v][z]:
            d[v][z] = du + w
            heapq.heappush(pq, (du + w, v, z))
        if z == 0 and du < d[v][1]:
            d[v][1] = du
            heapq.heappush(pq, (du, v, 1))
ans = min(d[-1])
print(-1 if ans == INF else ans)
