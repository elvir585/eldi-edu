class DSU:
    def __init__(self, n):
        self.p = list(range(n))
        self.sz = [1] * n
    def f(self, x):
        while x != self.p[x]:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x
    def u(self, a, b):
        a, b = (self.f(a), self.f(b))
        if a == b:
            return False
        if self.sz[a] < self.sz[b]:
            a, b = (b, a)
        self.p[b] = a
        self.sz[a] += self.sz[b]
        return True
N, M, K = map(int, input().split())
E = []
for _ in range(M):
    u, v, w = map(int, input().split())
    E.append((w, u - 1, v - 1))
d = DSU(N)
comps = N
for _ in range(K):
    u, v = map(int, input().split())
    comps -= d.u(u - 1, v - 1)
ans = 0
for w, u, v in sorted(E):
    if d.u(u, v):
        ans += w
        comps -= 1
print(ans if comps == 1 else -1)
