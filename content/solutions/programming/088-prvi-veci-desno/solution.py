N = int(input())
A = list(map(int, input().split()))
ans = [-1] * N
st = []
for i, x in enumerate(A):
    while st and A[st[-1]] < x:
        ans[st.pop()] = x
    st.append(i)
print(*ans)
