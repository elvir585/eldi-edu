N, K = map(int, input().split())
A = list(map(int, input().split()))
cur = sum(A[:K])
best = cur
for i in range(K, N):
    cur += A[i] - A[i - K]
    best = max(best, cur)
print(best)
