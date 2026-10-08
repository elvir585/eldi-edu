#include <bits/stdc++.h>
using namespace std;
struct D {
    vector < int > p, s;
    D(int n) : p(n), s(n, 1) {
        iota(p.begin(), p.end(), 0);
    }
    int f(int x) {
        return p [x] == x ? x : p [x] = f(p [x]);
    }
    void u(int a, int b) {
        a = f(a);
        b = f(b);
        if (a == b) return;
        if (s [a] < s [b]) swap(a, b);
        p [b] = a;
        s [a] += s [b];
    }
}
;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    D d(n);
    while (q--) {
        int t, a, b;
        cin >> t >> a >> b;
        -- a;
        -- b;
        if (t == 1) d.u(a, b);
        else cout << (d.f(a) == d.f(b) ? "DA" : "NE") << "\n";
    }
}
