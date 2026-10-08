from collections import deque
r, c = map(int, input().split())
g = [list(input().strip()) for _ in range(r)]
for i in range(r):
    for j in range(c):
        if g[i][j] == 'S':
            sr, sc = (i, j)
        if g[i][j] == 'E':
            er, ec = (i, j)
dist = [[-1] * c for _ in range(r)]
dist[sr][sc] = 0
q = deque([(sr, sc)])
for_pop = [(1, 0), (-1, 0), (0, 1), (0, -1)]
while q:
    x, y = q.popleft()
    for dx, dy in for_pop:
        nx, ny = (x + dx, y + dy)
        if 0 <= nx < r and 0 <= ny < c and (g[nx][ny] != '#') and \
            (dist[nx][ny] == -1):
            dist[nx][ny] = dist[x][y] + 1
            q.append((nx, ny))
print(dist[er][ec])
