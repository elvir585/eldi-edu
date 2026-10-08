import sys
v = list(map(int, sys.stdin.read().split()))
preostalo = v[3]
for kapacitet in v[:3]:
    pohranjeno = min(kapacitet, preostalo)
    print(pohranjeno)
    preostalo -= pohranjeno
