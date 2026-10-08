N = int(input())
A = list(map(int, input().split()))
vals = sorted(set(A))
rank = {x: i + 1 for i, x in enumerate(vals)}
print(*(rank[x] for x in A))
