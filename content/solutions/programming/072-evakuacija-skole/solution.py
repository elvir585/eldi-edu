from collections import deque
R, C = map(int, input().split())
g = [input().strip() for _ in range(R)]
d = [[-1] * C for _ in range(R)]
q = deque()
for r in range(R):
    for c in range(C):
        if g[r][c] == 'I':
            d[r][c] = 0
            q.append((r, c))
while q:
    r, c = q.popleft()
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nr, nc = (r + dr, c + dc)
        if 0 <= nr < R and 0 <= nc < C and (g[nr][nc] != '#') and \
            (d[nr][nc] == -1):
            d[nr][nc] = d[r][c] + 1
            q.append((nr, nc))
ans = 0
for r in range(R):
    for c in range(C):
        if g[r][c] == 'U':
            if d[r][c] == -1:
                print(-1)
                raise SystemExit
            ans = max(ans, d[r][c])
print(ans)
