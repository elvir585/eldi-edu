s = input().strip()
last = {}
l = 0
ans = 0
for r, c in enumerate(s):
    if c in last and last[c] >= l:
        l = last[c] + 1
    last[c] = r
    ans = max(ans, r - l + 1)
print(ans)
