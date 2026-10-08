from collections import deque
R, C = map(int, input().split())
g = [input().strip() for _ in range(R)]
for r in range(R):
    for c in range(C):
        if g[r][c] == 'S':
            sr, sc = (r, c)
        if g[r][c] == 'T':
            tr, tc = (r, c)
d = [[[-1] * 2 for _ in range(C)] for __ in range(R)]
d[sr][sc][0] = 0
q = deque([(sr, sc, 0)])
while q:
    r, c, u = q.popleft()
    if (r, c) == (tr, tc):
        print(d[r][c][u])
        break
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nr, nc = (r + dr, c + dc)
        if 0 <= nr < R and 0 <= nc < C:
            nu = u + (g[nr][nc] == '#')
            if nu <= 1 and d[nr][nc][nu] == -1:
                d[nr][nc][nu] = d[r][c][u] + 1
                q.append((nr, nc, nu))
else:
    print(-1)
