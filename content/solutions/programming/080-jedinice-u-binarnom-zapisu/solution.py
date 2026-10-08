n = int(input())
ans = 0
while n:
    ans += n & 1
    n >>= 1
print(ans)
