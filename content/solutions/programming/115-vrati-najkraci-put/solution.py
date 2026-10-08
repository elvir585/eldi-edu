from collections import deque
N, M, S, T = map(int, input().split())
S -= 1
T -= 1
g = [[] for _ in range(N)]
for _ in range(M):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    g[a].append(b)
    g[b].append(a)
d = [-1] * N
par = [-1] * N
q = deque([S])
d[S] = 0
while q:
    u = q.popleft()
    for v in g[u]:
        if d[v] == -1:
            d[v] = d[u] + 1
            par[v] = u
            q.append(v)
if d[T] == -1:
    print(-1)
else:
    path = []
    v = T
    while v != -1:
        path.append(v + 1)
        v = par[v]
    path.reverse()
    print(d[T])
    print(*path)
