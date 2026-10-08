from collections import deque
r, c = map(int, input().split())
g = [input().strip() for _ in range(r)]
for i in range(r):
    for j in range(c):
        if g[i][j] == 'S':
            s = (i, j)
d = [[-1] * c for _ in range(r)]
d[s[0]][s[1]] = 0
q = deque([s])
while q:
    x, y = q.popleft()
    if x == 0 or x == r - 1 or y == 0 or (y == c - 1):
        print(d[x][y])
        break
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nx, ny = (x + dx, y + dy)
        if 0 <= nx < r and 0 <= ny < c and (g[nx][ny] != '#') and \
            (d[nx][ny] < 0):
            d[nx][ny] = d[x][y] + 1
            q.append((nx, ny))
else:
    print(-1)
