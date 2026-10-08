n, x = map(int, input().split())
a = sorted(map(int, input().split()))
l, r = (0, n - 1)
ans = 10 ** 30
while l < r:
    s = a[l] + a[r]
    ans = min(ans, abs(s - x))
    if s < x:
        l += 1
    elif s > x:
        r -= 1
    else:
        break
print(ans)
