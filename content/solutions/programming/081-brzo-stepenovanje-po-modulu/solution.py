a, b, m = map(int, input().split())
res = 1 % m
a %= m
while b:
    if b & 1:
        res = res * a % m
    a = a * a % m
    b >>= 1
print(res)
