q = int(input())
qs = [int(input()) for _ in range(q)]
m = max(qs, default=0)
p = [True] * (m + 1)
if m >= 0:
    if m >= 0 and len(p) > 0:
        p[0] = False
    if m >= 1:
        p[1] = False
i = 2
while i * i <= m:
    if p[i]:
        p[i * i:m + 1:i] = [False] * ((m - i * i) // i + 1)
    i += 1
pref = [0] * (m + 1)
for i in range(1, m + 1):
    pref[i] = pref[i - 1] + p[i]
for x in qs:
    print(pref[x])
