N, K, S = map(int, input().split())
A = list(map(int, input().split()))
def dfs(i, chosen, total):
    if chosen == K:
        return 1 if total == S else 0
    if i == N or total > S or chosen + (N - i) < K:
        return 0
    return dfs(i + 1, chosen, total) + dfs(i + 1, chosen + 1, total + A[i])
print(dfs(0, 0, 0))
