n = int(input())
broj = 0
for _ in range(n):
    s = input().strip()
    if int(s[5]) >= 4 and s[8] == "5":
        broj += 1
print(broj)
