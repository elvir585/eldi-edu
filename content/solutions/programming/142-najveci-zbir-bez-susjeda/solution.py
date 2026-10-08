n = int(input())
a = list(map(int, input().split()))
prev2 = prev1 = 0
for x in a:
    prev2, prev1 = (prev1, max(prev1, prev2 + x))
print(prev1)
