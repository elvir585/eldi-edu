from collections import deque
MOD = 1000000007
N, M = map(int, input().split())
g = [[] for _ in range(N)]
for _ in range(M):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)
d = [-1] * N
w = [0] * N
d[0] = 0
w[0] = 1
q = deque([0])
while q:
    u = q.popleft()
    for v in g[u]:
        if d[v] == -1:
            d[v] = d[u] + 1
            w[v] = w[u]
            q.append(v)
        elif d[v] == d[u] + 1:
            w[v] = (w[v] + w[u]) % MOD
print(-1 if d[-1] < 0 else d[-1], w[-1])
