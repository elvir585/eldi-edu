#include <bits/stdc++.h>
using namespace std;
using ll = long long;
int main() {
    int n, m;
    cin >> n >> m;
    vector < vector < ll >> cap(n, vector < ll > (n));
    vector < vector < int >> g(n);
    while (m--) {
        int u, v;
        ll c;
        cin >> u >> v >> c;
        -- u;
        -- v;
        if (cap [u] [v] == 0 && cap [v] [u] == 0) {
            g [u].push_back(v);
            g [v].push_back(u);
        }
        cap [u] [v] += c;
    }
    int s = 0, t = n - 1;
    ll flow = 0;
    while (true) {
        vector < int > p(n, - 1);
        queue < int > q;
        p [s] = s;
        q.push(s);
        while (! q.empty() && p [t] < 0) {
            int u = q.front();
            q.pop();
            for (int v : g [u]) if (p [v] < 0 && cap [u] [v] > 0) {
                p [v] = u;
                q.push(v);
            }
        }
        if (p [t] < 0) break;
        ll add = LLONG_MAX;
        for (int v = t; v != s; v = p [v]) add = min(add, cap [p [v]] [v]);
        for (int v = t; v != s; v = p [v]) {
            int u = p [v];
            cap [u] [v] -= add;
            cap [v] [u] += add;
        }
        flow += add;
    }
    cout << flow << "\n";
}
