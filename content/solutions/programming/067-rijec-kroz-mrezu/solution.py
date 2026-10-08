R, C = map(int, input().split())
g = [list(input().strip()) for _ in range(R)]
w = input().strip()
def dfs(r, c, k):
    if r < 0 or r >= R or c < 0 or (c >= C) or (g[r][c] != w[k]):
        return False
    if k == len(w) - 1:
        return True
    ch = g[r][c]
    g[r][c] = '#'
    ok = dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1) or dfs(r, c + 1, k + \
        1) or dfs(r, c - 1, k + 1)
    g[r][c] = ch
    return ok
ans = any((dfs(r, c, 0) for r in range(R) for c in range(C)))
print('DA' if ans else 'NE')
