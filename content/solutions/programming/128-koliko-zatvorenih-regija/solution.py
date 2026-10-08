import sys
sys.setrecursionlimit(1000000)
n, m = map(int, input().split())
g = [[] for _ in range(n)]
rg = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    rg[v].append(u)
vis = [0] * n
order = []
def dfs(s, gr, out=False):
    st = [(s, 0)]
    vis[s] = 1
    while st:
        u, i = st[-1]
        if i < len(gr[u]):
            v = gr[u][i]
            st[-1] = (u, i + 1)
            if not vis[v]:
                vis[v] = 1
                st.append((v, 0))
        else:
            st.pop()
            if out:
                order.append(u)
for i in range(n):
    if not vis[i]:
        dfs(i, g, True)
vis = [0] * n
ans = 0
for s in reversed(order):
    if not vis[s]:
        dfs(s, rg, False)
        ans += 1
print(ans)
