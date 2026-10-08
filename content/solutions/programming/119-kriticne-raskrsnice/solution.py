import sys
sys.setrecursionlimit(1000000)
N, M = map(int, input().split())
g = [[] for _ in range(N)]
for _ in range(M):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    g[a].append(b)
    g[b].append(a)
tin = [-1] * N
low = [0] * N
cut = [False] * N
timer = 0
def dfs(u, p=-1):
    global timer
    tin[u] = low[u] = timer
    timer += 1
    children = 0
    for v in g[u]:
        if v == p:
            continue
        if tin[v] != -1:
            low[u] = min(low[u], tin[v])
        else:
            dfs(v, u)
            low[u] = min(low[u], low[v])
            if p != -1 and low[v] >= tin[u]:
                cut[u] = True
            children += 1
    if p == -1 and children > 1:
        cut[u] = True
for i in range(N):
    if tin[i] == -1:
        dfs(i)
print(sum(cut))
