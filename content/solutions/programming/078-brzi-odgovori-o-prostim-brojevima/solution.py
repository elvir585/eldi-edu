N, Q = map(int, input().split())
queries = list(map(int, input().split()))
prime = [True] * (N + 1)
prime[0] = prime[1] = False
p = 2
while p * p <= N:
    if prime[p]:
        for x in range(p * p, N + 1, p):
            prime[x] = False
    p += 1
for x in queries:
    print('DA' if prime[x] else 'NE')
