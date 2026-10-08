n = int(input())
ans = []
p = 2
while p * p <= n:
    if n % p == 0:
        e = 0
        while n % p == 0:
            n //= p
            e += 1
        ans.append((p, e))
    p += 1
if n > 1:
    ans.append((n, 1))
print(' '.join((f'{p}^{e}' for p, e in ans)))
