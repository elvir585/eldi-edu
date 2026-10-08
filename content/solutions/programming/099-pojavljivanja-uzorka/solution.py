t = input().strip()
p = input().strip()
m = len(p)
pi = [0] * m
for i in range(1, m):
    j = pi[i - 1]
    while j and p[i] != p[j]:
        j = pi[j - 1]
    if p[i] == p[j]:
        j += 1
    pi[i] = j
ans = 0
j = 0
for ch in t:
    while j and ch != p[j]:
        j = pi[j - 1]
    if ch == p[j]:
        j += 1
    if j == m:
        ans += 1
        j = pi[j - 1]
print(ans)
