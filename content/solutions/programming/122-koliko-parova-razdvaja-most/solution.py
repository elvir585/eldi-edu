import sys
sys.setrecursionlimit(1000000)
N, M = map(int, input().split())
g = [[] for _ in range(N)]
for eid in range(M):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append((v, eid))
    g[v].append((u, eid))
tin = [-1] * N
low = [0] * N
sz = [0] * N
timer = 0
ans = 0
def dfs(u, pe=-1):
    global timer, ans
    tin[u] = low[u] = timer
    timer += 1
    sz[u] = 1
    for v, eid in g[u]:
        if eid == pe:
            continue
        if tin[v] != -1:
            low[u] = min(low[u], tin[v])
        else:
            dfs(v, eid)
            sz[u] += sz[v]
            low[u] = min(low[u], low[v])
            if low[v] > tin[u]:
                ans += sz[v] * (N - sz[v])
dfs(0)
print(ans)
