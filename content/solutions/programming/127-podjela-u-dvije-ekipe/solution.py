from collections import deque
n, m = map(int, input().split())
g = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)
c = [-1] * n
for s in range(n):
    if c[s] != -1:
        continue
    c[s] = 0
    q = deque([s])
    while q:
        u = q.popleft()
        for v in g[u]:
            if c[v] == -1:
                c[v] = c[u] ^ 1
                q.append(v)
            elif c[v] == c[u]:
                print('NE')
                raise SystemExit
print('DA')
