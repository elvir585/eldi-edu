from collections import deque
N, M = map(int, input().split())
g = [[] for _ in range(N)]
ind = [0] * N
for _ in range(M):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    g[a].append(b)
    ind[b] += 1
q = deque((i for i in range(N) if ind[i] == 0))
dp = [0] * N
while q:
    u = q.popleft()
    for v in g[u]:
        dp[v] = max(dp[v], dp[u] + 1)
        ind[v] -= 1
        if ind[v] == 0:
            q.append(v)
print(max(dp))
