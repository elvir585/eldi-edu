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
    int N, M;
    cin >> N >> M;
    vector < tuple < long long, int, int >> e;
    while (M--) {
        int a, b;
        long long w;
        cin >> a >> b >> w;
        e.push_back({
            w, a - 1, b - 1
        }
        );
    }
    sort(e.begin(), e.end());
    D d(N);
    long long ans = 0;
    int used = 0;
    for (auto [w, a, b] : e) if (d.u(a, b)) {
        ans += w;
        if (++ used == N - 1) break;
    }
    cout << ans << "\n";
}
