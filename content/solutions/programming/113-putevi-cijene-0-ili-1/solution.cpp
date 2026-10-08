#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, M, S, T;
    cin >> N >> M >> S >> T;
    -- S;
    -- T;
    vector < vector < pair < int, int >> > g(N);
    while (M--) {
        int a, b, w;
        cin >> a >> b >> w;
        -- a;
        -- b;
        g [a].push_back({
            b, w
        }
        );
        g [b].push_back({
            a, w
        }
        );
    }
    const long long INF = 4e18;
    vector < long long > d(N, INF);
    deque < int > q;
    d [S] = 0;
    q.push_back(S);
    while (! q.empty()) {
        int u = q.front();
        q.pop_front();
        for (auto [v, w] : g [u]) if (d [u] + w < d [v]) {
            d [v] = d [u] + w;
            if (w == 0) q.push_front(v);
            else q.push_back(v);
        }
    }
    cout << (d [T] == INF ? - 1 : d [T]) << "\n";
}
