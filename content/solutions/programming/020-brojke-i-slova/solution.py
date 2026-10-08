s = input().strip()
r1 = input().strip()
r2 = input().strip()
def ostatak(rijec):
    rezultat = s
    for slovo in rijec:
        rezultat = rezultat.replace(slovo, "", 1)
    return rezultat
print(ostatak(r1))
print(ostatak(r2))
