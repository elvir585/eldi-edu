N, Q = map(int, input().split())
A = list(map(int, input().split()))
d = [0] * (N + 1)
for _ in range(Q):
    l, r, x = map(int, input().split())
    d[l - 1] += x
    d[r] -= x
cur = 0
for i in range(N):
    cur += d[i]
    A[i] += cur
print(*A)
