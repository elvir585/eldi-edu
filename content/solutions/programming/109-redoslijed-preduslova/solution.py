import heapq
N, M = map(int, input().split())
g = [[] for _ in range(N)]
ind = [0] * N
for _ in range(M):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    g[a].append(b)
    ind[b] += 1
h = [i for i in range(N) if ind[i] == 0]
heapq.heapify(h)
order = []
while h:
    u = heapq.heappop(h)
    order.append(u + 1)
    for v in g[u]:
        ind[v] -= 1
        if ind[v] == 0:
            heapq.heappush(h, v)
print(*order)
