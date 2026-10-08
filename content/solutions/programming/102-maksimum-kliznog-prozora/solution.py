from collections import deque
n, k = map(int, input().split())
a = list(map(int, input().split()))
d = deque()
ans = []
for i, x in enumerate(a):
    while d and d[0] < i - k + 1:
        d.popleft()
    while d and a[d[-1]] <= x:
        d.pop()
    d.append(i)
    if i >= k - 1:
        ans.append(a[d[0]])
print(*ans)
