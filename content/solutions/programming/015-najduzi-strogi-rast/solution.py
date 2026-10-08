n = int(input())
a = list(map(int, input().split()))
cur = best = 1
for i in range(1, n):
    cur = cur + 1 if a[i] > a[i - 1] else 1
    best = max(best, cur)
print(best)
