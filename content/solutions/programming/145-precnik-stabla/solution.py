from collections import deque
n = int(input())
g = [[] for _ in range(n)]
for _ in range(n - 1):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)
def far(s):
    d = [-1] * n
    d[s] = 0
    q = deque([s])
    while q:
        u = q.popleft()
        for v in g[u]:
            if d[v] < 0:
                d[v] = d[u] + 1
                q.append(v)
    a = max(range(n), key=d.__getitem__)
    return (a, d[a])
a, _ = far(0)
b, diam = far(a)
print(diam)
