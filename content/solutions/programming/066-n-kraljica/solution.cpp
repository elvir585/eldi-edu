#include <bits/stdc++.h>
using namespace std;
int N;
bool col [20], d1 [40], d2 [40];
long long dfs(int r) {
    if (r == N) return 1;
    long long ans = 0;
    for (int c = 0; c < N;++ c) {
        int a = r - c + N, b = r + c;
        if (col [c] || d1 [a] || d2 [b]) continue;
        col [c] = d1 [a] = d2 [b] = true;
        ans += dfs(r + 1);
        col [c] = d1 [a] = d2 [b] = false;
    }
    return ans;
}
int main() {
    cin >> N;
    cout << dfs(0) << "\n";
}
