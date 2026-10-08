n = int(input())
a = list(map(int, input().split()))
tot = sum(a)
left = 0
for i, x in enumerate(a):
    if left == tot - left - x:
        print(i + 1)
        break
    left += x
else:
    print(-1)
