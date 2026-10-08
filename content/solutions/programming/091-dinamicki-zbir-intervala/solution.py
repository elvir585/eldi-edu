N, Q = map(int, input().split())
A = list(map(int, input().split()))
bit = [0] * (N + 1)
def add(i, x):
    while i <= N:
        bit[i] += x
        i += i & -i
def pref(i):
    s = 0
    while i > 0:
        s += bit[i]
        i -= i & -i
    return s
for i, x in enumerate(A, 1):
    add(i, x)
for _ in range(Q):
    t, a, b = input().split()
    a = int(a)
    b = int(b)
    if t == 'ADD':
        add(a, b)
    else:
        print(pref(b) - pref(a - 1))
