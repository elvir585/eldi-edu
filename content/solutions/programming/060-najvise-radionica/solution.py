n = int(input())
a = []
for _ in range(n):
    s, e = map(int, input().split())
    a.append((e, s))
a.sort()
last = -10 ** 30
ans = 0
for e, s in a:
    if s >= last:
        ans += 1
        last = e
print(ans)
