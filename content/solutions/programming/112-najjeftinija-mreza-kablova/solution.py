N, M = map(int, input().split())
edges = []
for _ in range(M):
    a, b, w = map(int, input().split())
    edges.append((w, a - 1, b - 1))
edges.sort()
p = list(range(N))
sz = [1] * N
def find(x):
    if p[x] != x:
        p[x] = find(p[x])
    return p[x]
ans = used = 0
for w, a, b in edges:
    a, b = (find(a), find(b))
    if a == b:
        continue
    if sz[a] < sz[b]:
        a, b = (b, a)
    p[b] = a
    sz[a] += sz[b]
    ans += w
    used += 1
    if used == N - 1:
        break
print(ans)
