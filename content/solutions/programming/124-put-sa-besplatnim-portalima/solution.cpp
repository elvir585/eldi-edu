#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector < vector < pair < int, int >> > g(n);
    while (m--) {
        int u, v, w;
        cin >> u >> v >> w;
        g [-- u].push_back({
            -- v, w
        }
        );
    }
    const int INF = 1e9;
    vector < int > d(n, INF);
    deque < int > q;
    d [0] = 0;
    q.push_back(0);
    while (! q.empty()) {
        int u = q.front();
        q.pop_front();
        for (auto [v, w] : g [u]) if (d [u] + w < d [v]) {
            d [v] = d [u] + w;
            if (w == 0) q.push_front(v);
            else q.push_back(v);
        }
    }
    cout << (d [n - 1] == INF ? - 1 : d [n - 1]) << "\n";
}
