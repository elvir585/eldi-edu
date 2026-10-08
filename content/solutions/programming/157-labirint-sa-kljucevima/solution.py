from collections import deque
R, C = map(int, input().split())
g = [input().strip() for _ in range(R)]
for r in range(R):
    for c in range(C):
        if g[r][c] == 'S':
            sr, sc = (r, c)
D = [[[-1] * 8 for _ in range(C)] for __ in range(R)]
D[sr][sc][0] = 0
q = deque([(sr, sc, 0)])
while q:
    r, c, m = q.popleft()
    if g[r][c] == 'T':
        print(D[r][c][m])
        break
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nr, nc = (r + dr, c + dc)
        if not (0 <= nr < R and 0 <= nc < C) or g[nr][nc] == '#':
            continue
        ch = g[nr][nc]
        nm = m
        if ch in 'abc':
            nm |= 1 << ord(ch) - 97
        if ch in 'ABC' and (not m >> ord(ch) - 65 & 1):
            continue
        if D[nr][nc][nm] < 0:
            D[nr][nc][nm] = D[r][c][m] + 1
            q.append((nr, nc, nm))
else:
    print(-1)
