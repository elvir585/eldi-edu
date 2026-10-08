#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector < vector < int >> g(n);
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        -- u;
        -- v;
        g [u].push_back(v);
        g [v].push_back(u);
    }
    int L = 1;
    while ((1 << L) <= n) L++;
    vector < vector < int >> up(L, vector < int > (n));
    vector < int > d(n), p(n, - 1), ord {
        0
    }
    ;
    p [0] = 0;
    for (int k = 0; k < (int) ord.size(); k++) {
        int u = ord [k];
        for (int v : g [u]) if (p [v] == - 1) {
            p [v] = u;
            d [v] = d [u] + 1;
            ord.push_back(v);
        }
    }
    up [0] = p;
    for (int k = 1; k < L; k++) for (int v = 0; v < n; v++) up [k] [v] = up
        [k - 1]
        [up [k - 1] [v]];
    auto lca = [&] (int a, int b) {
        if (d [a] < d [b]) swap(a, b);
        int z = d [a] - d [b];
        for (int k = 0; k < L; k++) if (z >> k & 1) a = up [k] [a];
        if (a == b) return a;
        for (int k = L - 1; k >= 0; k--) if (up [k] [a] != up [k] [b]) {
            a = up [k] [a];
            b = up [k] [b];
        }
        return up [0] [a];
    }
    ;
    while (q--) {
        int a, b;
        cin >> a >> b;
        cout << lca(-- a,-- b) + 1 << "\n";
    }
}
