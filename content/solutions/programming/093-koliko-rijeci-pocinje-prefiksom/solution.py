N = int(input())
nxt = [{}]
cnt = [0]
for _ in range(N):
    s = input().strip()
    u = 0
    for ch in s:
        if ch not in nxt[u]:
            nxt[u][ch] = len(nxt)
            nxt.append({})
            cnt.append(0)
        u = nxt[u][ch]
        cnt[u] += 1
Q = int(input())
for _ in range(Q):
    p = input().strip()
    u = 0
    ok = True
    for ch in p:
        if ch not in nxt[u]:
            ok = False
            break
        u = nxt[u][ch]
    print(cnt[u] if ok else 0)
