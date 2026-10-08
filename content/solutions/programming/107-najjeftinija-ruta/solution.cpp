#include <iostream>
#include <vector>
#include <queue>
#include <tuple>
#include <limits>
using namespace std;
int main() {
    int n, m, s, t;
    cin >> n >> m >> s >> t;
    -- s;
    -- t;
    vector < vector < pair < int, long long >> > g(n);
    while (m--) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        -- u;
        -- v;
        g [u].push_back({
            v, w
        }
        );
        g [v].push_back({
            u, w
        }
        );
    }
    const long long INF = numeric_limits < long long >::max() / 4;
    vector < long long > d(n, INF);
    d [s] = 0;
    priority_queue < pair < long long, int >, vector < pair < long long,
        int >>,
        greater < pair < long long, int >> > pq;
    pq.push({
        0, s
    }
    );
    while (! pq.empty()) {
        auto [du, u] = pq.top();
        pq.pop();
        if (du != d [u]) continue;
        for (auto [v, w] : g [u]) if (d [v] > du + w) {
            d [v] = du + w;
            pq.push({
                d [v], v
            }
            );
        }
    }
    cout << (d [t] == INF ? - 1 : d [t]) << "\n";
}
