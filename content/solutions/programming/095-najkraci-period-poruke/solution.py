s = input().strip()
n = len(s)
pi = [0] * n
for i in range(1, n):
    j = pi[i - 1]
    while j and s[i] != s[j]:
        j = pi[j - 1]
    if s[i] == s[j]:
        j += 1
    pi[i] = j
p = n - pi[-1]
print(p if n % p == 0 else n)
