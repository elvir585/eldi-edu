n = int(input())
a = [list(map(int, input().split())) for _ in range(n)]
def valid(v):
    s = set()
    for x in v:
        if x == 0:
            continue
        if x in s:
            return False
        s.add(x)
    return True
ok = all((valid(row) for row in a))
if ok:
    for j in range(n):
        if not valid((a[i][j] for i in range(n))):
            ok = False
            break
print('OK' if ok else 'GRESKA')
