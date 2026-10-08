T = input().strip()
P = input().strip()
m = len(P)
pi = [0] * m
for i in range(1, m):
    j = pi[i - 1]
    while j and P[i] != P[j]:
        j = pi[j - 1]
    if P[i] == P[j]:
        j += 1
    pi[i] = j
ans = 0
j = 0
for ch in T:
    while j and ch != P[j]:
        j = pi[j - 1]
    if ch == P[j]:
        j += 1
    if j == m:
        ans += 1
        j = pi[j - 1]
print(ans)
