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
    vector < array < ll, 2 >> d(n, array < ll, 2 > {
        INF, INF
    }
    );
    using S = tuple < ll, int, int >;
    priority_queue < S, vector < S >, greater < S >> pq;
    d [0] [0] = 0;
    pq.push({
        0, 0, 0
    }
    );
    while (! pq.empty()) {
        auto [du, u, z] = pq.top();
        pq.pop();
        if (du != d [u] [z]) continue;
        for (auto [v, w] : g [u]) {
            if (du + w < d [v] [z]) {
                d [v] [z] = du + w;
                pq.push({
                    d [v] [z], v, z
                }
                );
            }
            if (! z && du < d [v] [1]) {
                d [v] [1] = du;
                pq.push({
                    du, v, 1
                }
                );
            }
        }
    }
    ll ans = min(d [n - 1] [0], d [n - 1] [1]);
    cout << (ans >= INF / 2 ? - 1 : ans) << "\n";
}
