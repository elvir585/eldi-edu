N, K = map(int, input().split())
a = list(map(int, input().split()))
b = a + a
cur = sum(b[:K])
best = cur
for s in range(1, N):
    cur += b[s + K - 1] - b[s - 1]
    best = max(best, cur)
print(best)
