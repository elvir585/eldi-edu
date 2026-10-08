from collections import deque
N, M, K = map(int, input().split())
sources = [x - 1 for x in map(int, input().split())]
g = [[] for _ in range(N)]
for _ in range(M):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    g[a].append(b)
    g[b].append(a)
d = [-1] * N
q = deque()
for s in sources:
    if d[s] == -1:
        d[s] = 0
        q.append(s)
while q:
    u = q.popleft()
    for v in g[u]:
        if d[v] == -1:
            d[v] = d[u] + 1
            q.append(v)
print(max(d))
