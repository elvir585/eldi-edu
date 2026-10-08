import sys
sys.setrecursionlimit(1000000)
n, m = map(int, input().split())
g = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)
tin = [-1] * n
low = [0] * n
timer = 0
bridges = 0
def dfs(u, p):
    global timer, bridges
    tin[u] = low[u] = timer
    timer += 1
    for v in g[u]:
        if v == p:
            continue
        if tin[v] != -1:
            low[u] = min(low[u], tin[v])
        else:
            dfs(v, u)
            low[u] = min(low[u], low[v])
            if low[v] > tin[u]:
                bridges += 1
for i in range(n):
    if tin[i] == -1:
        dfs(i, -1)
print(bridges)
