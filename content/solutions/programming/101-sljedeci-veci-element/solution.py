n = int(input())
a = list(map(int, input().split()))
ans = [-1] * n
st = []
for i, x in enumerate(a):
    while st and x > a[st[-1]]:
        ans[st.pop()] = x
    st.append(i)
print(*ans)
