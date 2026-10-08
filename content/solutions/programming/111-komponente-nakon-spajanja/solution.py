N, M = map(int, input().split())
parent = list(range(N))
size = [1] * N
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x
comp, best = (N, 1)
for _ in range(M):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    a, b = (find(a), find(b))
    if a != b:
        if size[a] < size[b]:
            a, b = (b, a)
        parent[b] = a
        size[a] += size[b]
        comp -= 1
        best = max(best, size[a])
print(comp, best)
