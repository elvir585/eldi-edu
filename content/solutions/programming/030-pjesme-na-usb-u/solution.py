n, t = map(int, input().split())
a = sorted(map(int, input().split()))
s = 0
cnt = 0
for x in a:
    if s + x > t:
        break
    s += x
    cnt += 1
print(cnt)
