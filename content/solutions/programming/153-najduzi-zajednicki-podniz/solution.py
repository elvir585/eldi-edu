a = input().strip()
b = input().strip()
prev = [0] * (len(b) + 1)
for x in a:
    cur = [0] * (len(b) + 1)
    for j, y in enumerate(b, 1):
        cur[j] = prev[j - 1] + 1 if x == y else max(prev[j], cur[j - 1])
    prev = cur
print(prev[-1])
