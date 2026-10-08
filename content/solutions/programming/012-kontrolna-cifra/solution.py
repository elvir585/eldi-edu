s = input().strip()
ans = sum((int(ch) * (i + 1) for i, ch in enumerate(s)))
print(ans % 11)
