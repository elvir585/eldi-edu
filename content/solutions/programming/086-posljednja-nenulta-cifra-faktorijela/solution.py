n = int(input())
r = 1
c2 = c5 = 0
for x in range(2, n + 1):
    y = x
    while y % 2 == 0:
        c2 += 1
        y //= 2
    while y % 5 == 0:
        c5 += 1
        y //= 5
    r = r * (y % 10) % 10
for _ in range(c2 - c5):
    r = r * 2 % 10
print(r)
