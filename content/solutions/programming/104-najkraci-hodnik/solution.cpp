#include <iostream>
#include <vector>
#include <queue>
using namespace std;
int main() {
    int n, m, s, t;
    cin >> n >> m >> s >> t;
    -- s;
    -- t;
    vector < vector < int >> g(n);
    while (m--) {
        int u, v;
        cin >> u >> v;
        -- u;
        -- v;
        g [u].push_back(v);
        g [v].push_back(u);
    }
    vector < int > d(n, - 1);
    queue < int > q;
    d [s] = 0;
    q.push(s);
    while (! q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : g [u]) if (d [v] == - 1) {
            d [v] = d [u] + 1;
            q.push(v);
        }
    }
    cout << d [t] << "\n";
}
