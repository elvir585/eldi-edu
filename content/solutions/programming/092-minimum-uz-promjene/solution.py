N, Q = map(int, input().split())
A = list(map(int, input().split()))
size = 1
while size < N:
    size *= 2
INF = 10 ** 30
seg = [INF] * (2 * size)
for i, x in enumerate(A):
    seg[size + i] = x
for i in range(size - 1, 0, -1):
    seg[i] = min(seg[2 * i], seg[2 * i + 1])
def setv(i, x):
    i += size
    seg[i] = x
    i //= 2
    while i:
        seg[i] = min(seg[2 * i], seg[2 * i + 1])
        i //= 2
def query(l, r):
    l += size
    r += size
    ans = INF
    while l < r:
        if l & 1:
            ans = min(ans, seg[l])
            l += 1
        if r & 1:
            r -= 1
            ans = min(ans, seg[r])
        l //= 2
        r //= 2
    return ans
for _ in range(Q):
    t, a, b = input().split()
    a = int(a)
    b = int(b)
    if t == 'SET':
        setv(a - 1, b)
    else:
        print(query(a - 1, b))
