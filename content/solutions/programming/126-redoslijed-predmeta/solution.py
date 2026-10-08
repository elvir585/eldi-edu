import heapq
n, m = map(int, input().split())
g = [[] for _ in range(n)]
deg = [0] * n
for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    deg[v] += 1
pq = [i for i in range(n) if deg[i] == 0]
heapq.heapify(pq)
ans = []
while pq:
    u = heapq.heappop(pq)
    ans.append(u + 1)
    for v in g[u]:
        deg[v] -= 1
        if deg[v] == 0:
            heapq.heappush(pq, v)
print(*ans) if len(ans) == n else print(-1)
