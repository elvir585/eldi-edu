#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector < long long > s(n + 1);
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        s [i] = s [i - 1] + x;
    }
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << s [r] - s [l - 1] << "\n";
    }
}
