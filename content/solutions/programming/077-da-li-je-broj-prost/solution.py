n = int(input())
if n < 2:
    print('NE')
else:
    d = 2
    prime = True
    while d * d <= n:
        if n % d == 0:
            prime = False
            break
        d += 1
    print('DA' if prime else 'NE')
