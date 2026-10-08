s = input().strip()
def pal(l, r):
    while l < r:
        if s[l] != s[r]:
            return False
        l += 1
        r -= 1
    return True
l, r = (0, len(s) - 1)
while l < r and s[l] == s[r]:
    l += 1
    r -= 1
print('DA' if l >= r or pal(l + 1, r) or pal(l, r - 1) else 'NE')
