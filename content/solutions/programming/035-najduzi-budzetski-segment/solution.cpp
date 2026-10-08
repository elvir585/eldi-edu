#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    long long S;
    cin >> N >> S;
    vector < long long > A(N);
    for (auto & x : A) cin >> x;
    int l = 0, best = 0;
    long long cur = 0;
    for (int r = 0; r < N;++ r) {
        cur += A [r];
        while (cur > S && l <= r) cur -= A [l++];
        best = max(best, r - l + 1);
    }
    cout << best << "\n";
}
