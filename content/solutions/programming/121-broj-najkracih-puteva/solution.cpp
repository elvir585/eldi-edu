#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
int main() {
    int N, M;
    cin >> N >> M;
    vector < vector < int >> g(N);
    while (M--) {
        int u, v;
        cin >> u >> v;
        -- u;
        -- v;
        g [u].push_back(v);
        g [v].push_back(u);
    }
    vector < int > d(N, - 1);
    vector < long long > w(N);
    queue < int > q;
    d [0] = 0;
    w [0] = 1;
    q.push(0);
    while (! q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : g [u]) {
            if (d [v] == - 1) {
                d [v] = d [u] + 1;
                w [v] = w [u];
                q.push(v);
            }
            else if (d [v] == d [u] + 1) w [v] = (w [v] + w [u]) % MOD;
        }
    }
    cout << (d [N - 1] < 0 ? - 1 : d [N - 1]) << ' ' << w [N - 1] << "\n";
}
