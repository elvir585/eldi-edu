N, S = map(int, input().split())
A = list(map(int, input().split()))
l = 0
cur = 0
best = 0
for r, x in enumerate(A):
    cur += x
    while cur > S and l <= r:
        cur -= A[l]
        l += 1
    best = max(best, r - l + 1)
print(best)
