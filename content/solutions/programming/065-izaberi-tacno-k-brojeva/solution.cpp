#include <bits/stdc++.h>
using namespace std;
int N, K;
long long S;
vector < long long > A;
long long dfs(int i, int chosen, long long sum) {
    if (chosen == K) return sum == S;
    if (i == N || sum > S || chosen + (N - i) < K) return 0;
    return dfs(i + 1, chosen, sum) + dfs(i + 1, chosen + 1, sum + A [i]);
}
int main() {
    cin >> N >> K >> S;
    A.resize(N);
    for (auto & x : A) cin >> x;
    cout << dfs(0, 0, 0) << "\n";
}
