p1, p2, z1, z2 = map(int, input().split())
preklop = max(0, min(p2, z2) - max(p1, z1))
print(p2 - p1 - preklop, preklop, z2 - z1 - preklop)
