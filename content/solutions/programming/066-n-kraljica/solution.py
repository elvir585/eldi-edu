N = int(input())
cols, d1, d2 = (set(), set(), set())
def dfs(r):
    if r == N:
        return 1
    ans = 0
    for c in range(N):
        if c in cols or r - c in d1 or r + c in d2:
            continue
        cols.add(c)
        d1.add(r - c)
        d2.add(r + c)
        ans += dfs(r + 1)
        cols.remove(c)
        d1.remove(r - c)
        d2.remove(r + c)
    return ans
print(dfs(0))
