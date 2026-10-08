n, q = map(int, input().split())
a = list(map(int, input().split()))
s = [0]
for x in a:
    s.append(s[-1] + x)
for _ in range(q):
    l, r = map(int, input().split())
    print(s[r] - s[l - 1])
