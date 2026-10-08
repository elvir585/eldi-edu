import sys
a, g = map(int, sys.stdin.read().split())
d = (a - g) // 3
print(a - d)
print(a - 2 * d)
