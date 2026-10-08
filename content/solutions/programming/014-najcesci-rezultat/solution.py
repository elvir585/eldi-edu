from collections import Counter
n = int(input())
a = list(map(int, input().split()))
c = Counter(a)
best = min(c, key=lambda x: (-c[x], x))
print(best)
