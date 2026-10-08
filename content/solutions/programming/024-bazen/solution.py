n = int(input())
dogadjaji = []
for _ in range(n):
    a, b = map(int, input().split())
    dogadjaji.append((a, 1))
    dogadjaji.append((b, -1))
dogadjaji.sort()
trenutno = najbolje = 0
for vrijeme, promjena in dogadjaji:
    trenutno += promjena
    najbolje = max(najbolje, trenutno)
print(najbolje)
