import sys
v = list(map(int, sys.stdin.read().split()))
t1 = 3600 * v[0] + 60 * v[1] + v[2]
t2 = 3600 * v[3] + 60 * v[4] + v[5]
print(t2 - t1)
