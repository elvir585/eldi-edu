n = int(input())
a = list(map(int, input().split()))
cilj = max(a)
print(sum(cilj - x for x in a))
