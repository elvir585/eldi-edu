N = int(input())
seg = [tuple(map(int, input().split())) for _ in range(N)]
seg.sort()
L, R = seg[0]
ans = 0
for l, r in seg[1:]:
    if l <= R:
        R = max(R, r)
    else:
        ans += R - L
        L, R = (l, r)
ans += R - L
print(ans)
