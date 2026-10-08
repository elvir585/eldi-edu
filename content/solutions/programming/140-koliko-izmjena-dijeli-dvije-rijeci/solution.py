A = input()
B = input()
prev = list(range(len(B) + 1))
for i, ca in enumerate(A, 1):
    cur = [i] + [0] * len(B)
    for j, cb in enumerate(B, 1):
        cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb))
    prev = cur
print(prev[-1])
