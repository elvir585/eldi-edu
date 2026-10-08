from functools import lru_cache
N = int(input())
@lru_cache(None)
def f(pos, prev1):
    if pos == N:
        return 1
    ans = f(pos + 1, False)
    if not prev1:
        ans += f(pos + 1, True)
    return ans
print(f(0, False))
