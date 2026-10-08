n, q = map(int, input().split())
nxt = [{}]
cnt = [0]
for _ in range(n):
    u = 0
    for ch in input().strip():
        if ch not in nxt[u]:
            nxt[u][ch] = len(nxt)
            nxt.append({})
            cnt.append(0)
        u = nxt[u][ch]
        cnt[u] += 1
for _ in range(q):
    u = 0
    ok = True
    for ch in input().strip():
        if ch not in nxt[u]:
            ok = False
            break
        u = nxt[u][ch]
    print(cnt[u] if ok else 0)
