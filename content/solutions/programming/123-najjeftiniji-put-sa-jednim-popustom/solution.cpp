#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll INF = 4e18;
int main() {
    int N, M;
    cin >> N >> M;
    vector < vector < pair < int, ll >> > g(N);
    while (M--) {
        int u, v;
        ll w;
        cin >> u >> v >> w;
        g [-- u].push_back({
            -- v, w
        }
        );
    }
    vector < array < ll, 2 >> d(N, array < ll, 2 > {
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
            if (! z && du + w / 2 < d [v] [1]) {
                d [v] [1] = du + w / 2;
                pq.push({
                    d [v] [1], v, 1
                }
                );
            }
        }
    }
    ll ans = min(d [N - 1] [0], d [N - 1] [1]);
    cout << (ans >= INF / 2 ? - 1 : ans) << "\n";
}
