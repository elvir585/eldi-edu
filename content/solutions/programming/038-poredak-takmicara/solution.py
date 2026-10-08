n = int(input())
a = list(map(int, input().split()))
p = sorted([(-x, i) for i, x in enumerate(a)])
ans = [0] * n
rank = 0
prev = None
for pos, (neg, idx) in enumerate(p, 1):
    x = -neg
    if x != prev:
        rank = pos
        prev = x
    ans[idx] = rank
print(*ans)
