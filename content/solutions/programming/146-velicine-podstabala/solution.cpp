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
    vector < int > sz(n, 1);
    for (int i = n - 1; i > 0; i--) sz [p [ord [i]]] += sz [ord [i]];
    for (int i = 0; i < n; i++) cout << sz [i] << (i + 1 == n ? '\n' : ' ');
}
