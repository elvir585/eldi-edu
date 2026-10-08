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
    bool u(int a, int b) {
        a = f(a);
        b = f(b);
        if (a == b) return 0;
        if (s [a] < s [b]) swap(a, b);
        p [b] = a;
        s [a] += s [b];
        return 1;
    }
}
;
int main() {
    int n, m;
    cin >> n >> m;
    vector < tuple < long long, int, int >> e;
    while (m--) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        e.push_back({
            w,-- u,-- v
        }
        );
    }
    sort(e.begin(), e.end());
    D d(n);
    long long ans = 0;
    int k = 0;
    for (auto [w, u, v] : e) if (d.u(u, v)) {
        ans += w;
        k++;
    }
    cout << (k == n - 1 ? ans : - 1) << "\n";
}
