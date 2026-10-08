n, c, t, d = map(int, input().split())
iznos = n * c
if iznos >= t:
    iznos = iznos * (100 - d) // 100
print(iznos)
