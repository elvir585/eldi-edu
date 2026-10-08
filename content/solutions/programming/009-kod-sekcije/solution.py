n = int(input())
ans = 0
for _ in range(n):
    s = input().strip()
    razred = int(s[3:5])
    grupa = int(s[-1])
    if razred >= 8 and grupa == 3:
        ans += 1
print(ans)
