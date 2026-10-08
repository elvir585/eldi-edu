n = int(input())
a = list(map(int, input().split()))
m = sum(a) // n
bal = 0
ans = 0
for i in range(n - 1):
    bal += a[i] - m
    ans += abs(bal)
print(ans)
