s = input().strip()
cur = best = 1
for i in range(1, len(s)):
    cur = cur + 1 if s[i] == s[i - 1] else 1
    best = max(best, cur)
print(best)
