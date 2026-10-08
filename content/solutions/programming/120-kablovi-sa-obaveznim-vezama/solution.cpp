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
        if (a == b) return false;
        if (s [a] < s [b]) swap(a, b);
        p [b] = a;
        s [a] += s [b];
        return true;
    }
}
;
int main() {
    int N, M, K;
    cin >> N >> M >> K;
    vector < tuple < long long, int, int >> e;
    while (M--) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        e.push_back({
            w,-- u,-- v
        }
        );
    }
    D d(N);
    int comps = N;
    while (K--) {
        int u, v;
        cin >> u >> v;
        if (d.u(-- u,-- v))-- comps;
    }
    sort(e.begin(), e.end());
    long long ans = 0;
    for (auto [w, u, v] : e) if (d.u(u, v)) {
        ans += w;
        -- comps;
    }
    cout << (comps == 1 ? ans : - 1) << "\n";
}
