import heapq
INF = 10 ** 30
N, M = map(int, input().split())
g = [[] for _ in range(N)]
for _ in range(M):
    u, v, w = map(int, input().split())
    g[u - 1].append((v - 1, w))
d = [[INF, INF] for _ in range(N)]
d[0][0] = 0
pq = [(0, 0, 0)]
while pq:
    du, u, z = heapq.heappop(pq)
    if du != d[u][z]:
        continue
    for v, w in g[u]:
        if du + w < d[v][z]:
            d[v][z] = du + w
            heapq.heappush(pq, (d[v][z], v, z))
        if z == 0 and du + w // 2 < d[v][1]:
            d[v][1] = du + w // 2
            heapq.heappush(pq, (d[v][1], v, 1))
ans = min(d[-1])
print(-1 if ans == INF else ans)
