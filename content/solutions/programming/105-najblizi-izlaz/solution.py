from collections import deque
r, c = map(int, input().split())
g = [input().strip() for _ in range(r)]
d = [[-1] * c for _ in range(r)]
q = deque()
for i in range(r):
    for j in range(c):
        if g[i][j] == 'E':
            d[i][j] = 0
            q.append((i, j))
for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
    pass
while q:
    x, y = q.popleft()
    for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        nx, ny = (x + dx, y + dy)
        if 0 <= nx < r and 0 <= ny < c and (g[nx][ny] != '#') and \
            (d[nx][ny] == -1):
            d[nx][ny] = d[x][y] + 1
            q.append((nx, ny))
ans = 0
for i in range(r):
    for j in range(c):
        if g[i][j] != '#':
            if d[i][j] == -1:
                print(-1)
                raise SystemExit
            ans = max(ans, d[i][j])
print(ans)
