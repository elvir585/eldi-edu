n = int(input())
xs = []
ys = []
for _ in range(n):
    x, y = map(int, input().split())
    xs.append(x)
    ys.append(y)
xs.sort()
ys.sort()
mx = xs[n // 2]
my = ys[n // 2]
print(sum((abs(x - mx) for x in xs)) + sum((abs(y - my) for y in ys)))
