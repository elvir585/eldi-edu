N, M, D = map(int, input().split())
a = sorted(map(int, input().split()))
b = sorted(map(int, input().split()))
i = j = ans = 0
while i < N and j < M:
    if abs(a[i] - b[j]) <= D:
        ans += 1
        i += 1
        j += 1
    elif a[i] < b[j]:
        i += 1
    else:
        j += 1
print(ans)
