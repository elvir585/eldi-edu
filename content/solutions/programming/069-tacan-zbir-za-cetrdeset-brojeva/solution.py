from bisect import bisect_left
N, S = map(int, input().split())
A = list(map(int, input().split()))
mid = N // 2
def sums(arr):
    res = [0]
    for x in arr:
        res += [v + x for v in res]
    return res
L = sums(A[:mid])
R = sorted(sums(A[mid:]))
ok = False
for x in L:
    y = S - x
    i = bisect_left(R, y)
    if i < len(R) and R[i] == y:
        ok = True
        break
print('DA' if ok else 'NE')
