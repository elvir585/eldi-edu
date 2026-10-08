from math import gcd
n = int(input())
a = list(map(int, input().split()))
L = [0] * (n + 1)
R = [0] * (n + 1)
for i, x in enumerate(a):
    L[i + 1] = gcd(L[i], x)
for i in range(n - 1, -1, -1):
    R[i] = gcd(R[i + 1], a[i])
print(max((gcd(L[i], R[i + 1]) for i in range(n))))
