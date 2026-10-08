#include <bits/stdc++.h>
using namespace std;
struct DSU {
    vector < int > p, sz;
    DSU(int n) : p(n), sz(n, 1) {
        iota(p.begin(), p.end(), 0);
    }
    int f(int x) {
        return p [x] == x ? x : p [x] = f(p [x]);
    }
    int unite(int a, int b) {
        a = f(a);
        b = f(b);
        if (a == b) return sz [a];
        if (sz [a] < sz [b]) swap(a, b);
        p [b] = a;
        sz [a] += sz [b];
        return sz [a];
    }
}
;
int main() {
    int N, M;
    cin >> N >> M;
    DSU d(N);
    int comp = N, best = 1;
    while (M--) {
        int a, b;
        cin >> a >> b;
        -- a;
        -- b;
        int ra = d.f(a), rb = d.f(b);
        if (ra != rb) {
            best = max(best, d.unite(ra, rb));
            -- comp;
        }
    }
    cout << comp << " " << best << "\n";
}
