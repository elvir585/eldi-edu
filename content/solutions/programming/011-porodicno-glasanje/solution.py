n, m = map(int, input().split())
glasovi = [0] * (n + 1)
for _ in range(m):
    a, b = map(int, input().split())
    glasovi[a] += b
pobjednik = 1
for i in range(2, n + 1):
    if glasovi[i] > glasovi[pobjednik]:
        pobjednik = i
print(pobjednik)
