N, M, Q = map(int, input().split())
INF = 10 ** 30
d = [[INF] * N for _ in range(N)]
for i in range(N):
    d[i][i] = 0
for _ in range(M):
    a, b, w = map(int, input().split())
    a -= 1
    b -= 1
    if w < d[a][b]:
        d[a][b] = d[b][a] = w
for k in range(N):
    for i in range(N):
        dik = d[i][k]
        if dik == INF:
            continue
        for j in range(N):
            if dik + d[k][j] < d[i][j]:
                d[i][j] = dik + d[k][j]
for _ in range(Q):
    s, t = map(int, input().split())
    x = d[s - 1][t - 1]
    print(-1 if x == INF else x)
