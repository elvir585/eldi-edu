s = input().strip()
dozvoljene = set('018')
ok_cifre = all((c in dozvoljene for c in s))
ok_pal = s == s[::-1]
print('DA' if ok_cifre and ok_pal else 'NE')
