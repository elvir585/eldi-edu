A = input().strip()
B = input().strip()
if len(B) > len(A):
    A, B = (B, A)
prev = [0] * (len(B) + 1)
for x in A:
    cur = [0] * (len(B) + 1)
    for j, y in enumerate(B, 1):
        cur[j] = prev[j - 1] + 1 if x == y else max(prev[j], cur[j - 1])
    prev = cur
print(prev[-1])
