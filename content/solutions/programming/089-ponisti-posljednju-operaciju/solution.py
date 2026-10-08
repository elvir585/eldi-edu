N = int(input())
ops = list(map(int, input().split()))
st = []
total = 0
for x in ops:
    if x != 0:
        st.append(x)
        total += x
    elif st:
        total -= st.pop()
print(total)
