n = int(input())
w = sorted(map(int, input().split()))
c = sorted(map(int, input().split()))
i = 0
for cap in c:
    if i < n and w[i] <= cap:
        i += 1
print(i)
