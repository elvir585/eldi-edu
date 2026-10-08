n = int(input())
a = list(map(int, input().split()))
m = max(a)
print(sum((m - x for x in a)))
