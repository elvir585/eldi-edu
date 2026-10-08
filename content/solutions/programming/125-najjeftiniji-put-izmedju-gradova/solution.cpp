#include <bits/stdc++.h>
using namespace std;
using ll = long long;
int main() {
    int n, m;
    cin >> n >> m;
    vector < vector < pair < int, ll >> > g(n);
    while (m--) {
        int u, v;
        ll w;
        cin >> u >> v >> w;
        g [-- u].push_back({
            -- v, w
        }
        );
    }
    const ll INF = 4e18;
    vector < ll > d(n, INF);
    priority_queue < pair < ll, int >, vector < pair < ll, int >>, greater
        < pair <
        ll, int >> > pq;
    d [0] = 0;
    pq.push({
        0, 0
    }
    );
    while (! pq.empty()) {
        auto [du, u] = pq.top();
        pq.pop();
        if (du != d [u]) continue;
        for (auto [v, w] : g [u]) if (du + w < d [v]) {
            d [v] = du + w;
            pq.push({
                d [v], v
            }
            );
        }
    }
    cout << (d [n - 1] >= INF / 2 ? - 1 : d [n - 1]) << "\n";
}
