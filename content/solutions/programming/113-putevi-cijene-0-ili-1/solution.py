from collections import deque
N, M, S, T = map(int, input().split())
S -= 1
T -= 1
g = [[] for _ in range(N)]
for _ in range(M):
    a, b, w = map(int, input().split())
    a -= 1
    b -= 1
    g[a].append((b, w))
    g[b].append((a, w))
INF = 10 ** 30
d = [INF] * N
d[S] = 0
q = deque([S])
while q:
    u = q.popleft()
    for v, w in g[u]:
        if d[u] + w < d[v]:
            d[v] = d[u] + w
            (q.appendleft if w == 0 else q.append)(v)
print(-1 if d[T] == INF else d[T])
