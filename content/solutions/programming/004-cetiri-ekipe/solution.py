n = int(input())
oznake = input().split()
broj = {c: 0 for c in 'ABCD'}
for c in oznake:
    broj[c] += 1
m = max(broj.values())
pobjednici = [c for c in 'ABCD' if broj[c] == m]
print(pobjednici[0] if len(pobjednici) == 1 else 'NEMA')
