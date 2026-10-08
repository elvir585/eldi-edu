N = int(input())
tokens = input().split()
st = []
for t in tokens:
    if t not in ['+', '-', '*']:
        st.append(int(t))
    else:
        b = st.pop()
        a = st.pop()
        st.append(a + b if t == '+' else a - b if t == '-' else a * b)
print(st[-1])
