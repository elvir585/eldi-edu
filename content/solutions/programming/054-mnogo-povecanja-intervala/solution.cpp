#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, Q;
    cin >> N >> Q;
    vector < long long > A(N), d(N + 1);
    for (auto & x : A) cin >> x;
    while (Q--) {
        int l, r;
        long long x;
        cin >> l >> r >> x;
        d [l - 1] += x;
        d [r] -= x;
    }
    long long cur = 0;
    for (int i = 0; i < N;++ i) {
        cur += d [i];
        A [i] += cur;
        if (i) cout << ' ';
        cout << A [i];
    }
    cout << "\n";
}
