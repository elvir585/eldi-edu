import sys
a = list(map(int, sys.stdin.read().split()))
najbolje = 0
for p in range(8):
    zbir = 0
    for j in range(4):
        zbir += a[(p + j) % 8]
    najbolje = max(najbolje, zbir)
print(najbolje)
