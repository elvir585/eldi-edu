#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    int S = 1;
    while (S < n) S <<= 1;
    const long long INF = 4e18;
    vector < long long > t(2 * S, INF);
    for (int i = 0; i < n; i++) cin >> t [S + i];
    for (int i = S - 1; i; i--) t [i] = min(t [2 * i], t [2 * i + 1]);
    auto upd = [&] (int p, long long x) {
        p = S + p - 1;
        t [p] = x;
        for (p >>= 1; p; p >>= 1) t [p] = min(t [2 * p], t [2 * p + 1]);
    }
    ;
    auto qry = [&] (int l, int r) {
        long long ans = INF;
        l = S + l - 1;
        r = S + r;
        while (l < r) {
            if (l & 1) ans = min(ans, t [l++]);
            if (r & 1) ans = min(ans, t [-- r]);
            l >>= 1;
            r >>= 1;
        }
        return ans;
    }
    ;
    while (q--) {
        int z, x;
        long long y;
        cin >> z >> x >> y;
        if (z == 1) upd(x, y);
        else cout << qry(x, (int) y) << "\n";
    }
}
