#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < vector < int >> g(n);
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        -- u;
        -- v;
        g [u].push_back(v);
        g [v].push_back(u);
    }
    vector < int > p(n, - 1), ord {
        0
    }
    ;
    for (int k = 0; k < (int) ord.size(); k++) {
        int u = ord [k];
        for (int v : g [u]) if (v != p [u] && v != 0) {
            p [v] = u;
            ord.push_back(v);
        }
    }
    vector < int > d0(n), d1(n, 1);
    for (int k = n - 1; k >= 0; k--) {
        int u = ord [k];
        for (int v : g [u]) if (p [v] == u) {
            d1 [u] += d0 [v];
            d0 [u] += max(d0 [v], d1 [v]);
        }
    }
    cout << max(d0 [0], d1 [0]) << "\n";
}
