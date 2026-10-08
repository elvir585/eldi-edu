n = int(input())
e = []
for _ in range(n):
    a, b = map(int, input().split())
    e.append((a, 1))
    e.append((b, -1))
e.sort()
tren = ans = 0
for _, d in e:
    tren += d
    ans = max(ans, tren)
print(ans)
