n = int(input())
a = []
for _ in range(n):
    ime, b, k = input().split()
    a.append((ime, int(b), int(k)))
a.sort(key=lambda x: (-x[1], x[2], x[0]))
for ime, _, _ in a:
    print(ime)
