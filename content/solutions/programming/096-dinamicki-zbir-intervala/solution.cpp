#include <bits/stdc++.h>
using namespace std;
struct F {
    int n;
    vector < long long > b;
    F(int n) : n(n), b(n + 1) {
    }
    void add(int i, long long d) {
        for (; i <= n; i += i & - i) b [i] += d;
    }
    long long sum(int i) {
        long long s = 0;
        for (; i; i -= i & - i) s += b [i];
        return s;
    }
}
;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector < long long > a(n + 1);
    F f(n);
    for (int i = 1; i <= n; i++) {
        cin >> a [i];
        f.add(i, a [i]);
    }
    while (q--) {
        int t, x;
        long long y;
        cin >> t >> x >> y;
        if (t == 1) {
            f.add(x, y - a [x]);
            a [x] = y;
        }
        else cout << f.sum((int) y) - f.sum(x - 1) << "\n";
    }
}
