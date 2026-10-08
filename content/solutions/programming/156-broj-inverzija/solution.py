n = int(input())
a = list(map(int, input().split()))
def solve(a):
    if len(a) <= 1:
        return (a, 0)
    m = len(a) // 2
    L, x = solve(a[:m])
    R, y = solve(a[m:])
    i = j = 0
    c = x + y
    z = []
    while i < len(L) and j < len(R):
        if L[i] <= R[j]:
            z.append(L[i])
            i += 1
        else:
            z.append(R[j])
            j += 1
            c += len(L) - i
    z += L[i:]
    z += R[j:]
    return (z, c)
print(solve(a)[1])
