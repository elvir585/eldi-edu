#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    long long S;
    cin >> N >> S;
    vector < long long > a(N);
    for (auto & x : a) cin >> x;
    int l = 0, best = N + 1;
    long long cur = 0;
    for (int r = 0; r < N; r++) {
        cur += a [r];
        while (cur >= S) {
            best = min(best, r - l + 1);
            cur -= a [l++];
        }
    }
    cout << (best == N + 1 ? 0 : best) << "\n";
}
