from bisect import bisect_left
n = int(input())
a = list(map(int, input().split()))
t = []
for x in a:
    p = bisect_left(t, x)
    if p == len(t):
        t.append(x)
    else:
        t[p] = x
print(len(t))
