n = int(input())
a = list(map(int, input().split()))
tot = sum(a)
r = [False] * (tot + 1)
r[0] = True
for x in a:
    for s in range(tot, x - 1, -1):
        if r[s - x]:
            r[s] = True
for s in range(tot // 2, -1, -1):
    if r[s]:
        print(tot - 2 * s)
        break
