import sys
sys.setrecursionlimit(1000000)
N, M = map(int, input().split())
g = [[] for _ in range(N)]
for _ in range(M):
    a, b = map(int, input().split())
    g[a - 1].append(b - 1)
color = [0] * N
def dfs(u):
    color[u] = 1
    for v in g[u]:
        if color[v] == 1:
            return True
        if color[v] == 0 and dfs(v):
            return True
    color[u] = 2
    return False
print('DA' if any((color[i] == 0 and dfs(i) for i in range(N))) else 'NE')
