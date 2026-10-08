N, X = map(int, input().split())
A = list(map(int, input().split()))
l, r = (0, N)
while l < r:
    m = (l + r) // 2
    if A[m] >= X:
        r = m
    else:
        l = m + 1
print(-1 if l == N else l + 1)
