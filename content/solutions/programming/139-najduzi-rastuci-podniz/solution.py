from bisect import bisect_left
N = int(input())
A = list(map(int, input().split()))
tails = []
for x in A:
    i = bisect_left(tails, x)
    if i == len(tails):
        tails.append(x)
    else:
        tails[i] = x
print(len(tails))
