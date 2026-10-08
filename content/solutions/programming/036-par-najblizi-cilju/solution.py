N, T = map(int, input().split())
A = sorted(map(int, input().split()))
l, r = (0, N - 1)
best = None
while l < r:
    pair = (A[l], A[r])
    key = (abs(A[l] + A[r] - T), pair)
    if best is None or key < best[0]:
        best = (key, pair)
    if A[l] + A[r] < T:
        l += 1
    else:
        r -= 1
print(*best[1])
