s = input().strip()
st = []
match = {')': '(', ']': '[', '}': '{'}
ok = True
for ch in s:
    if ch in '([{':
        st.append(ch)
    else:
        if not st or st[-1] != match[ch]:
            ok = False
            break
        st.pop()
print('DA' if ok and (not st) else 'NE')
