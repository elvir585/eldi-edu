n, q = map(int, input().split())
a = list(map(int, input().split()))
p = [0]
for x in a:
    p.append(p[-1] + x)
for _ in range(q):
    l, r = map(int, input().split())
    print(p[r] - p[l - 1])
