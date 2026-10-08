#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
vector < vector < int >> g;
vector < int > tin, low;
int timer_ = 0;
long long bridges = 0;
void dfs(int u, int p) {
    tin [u] = low [u] = timer_++;
    for (int v : g [u]) {
        if (v == p) continue;
        if (tin [v] != - 1) low [u] = min(low [u], tin [v]);
        else {
            dfs(v, u);
            low [u] = min(low [u], low [v]);
            if (low [v] > tin [u]) bridges++;
        }
    }
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    g.assign(n, {
    }
    );
    tin.assign(n, - 1);
    low.resize(n);
    while (m--) {
        int u, v;
        cin >> u >> v;
        -- u;
        -- v;
        g [u].push_back(v);
        g [v].push_back(u);
    }
    for (int i = 0; i < n; i++) if (tin [i] == - 1) dfs(i, - 1);
    cout << bridges << "\n";
}
