#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector < vector < int >> g(n);
    vector < int > deg(n);
    while (m--) {
        int u, v;
        cin >> u >> v;
        g [-- u].push_back(-- v);
        deg [v]++;
    }
    queue < int > q;
    for (int i = 0; i < n; i++) if (! deg [i]) q.push(i);
    vector < int > ord;
    while (! q.empty()) {
        int u = q.front();
        q.pop();
        ord.push_back(u);
        for (int v : g [u]) if (-- deg [v] == 0) q.push(v);
    }
    const int NEG = - 1e9;
    vector < int > d(n, NEG), p(n, - 1);
    d [0] = 0;
    for (int u : ord) if (d [u] != NEG) for (int v : g [u]) if (d [u] + 1 >
        d [v]) {
        d [v] = d [u] + 1;
        p [v] = u;
    }
    if (d [n - 1] == NEG) {
        cout << - 1 << "\n";
        return 0;
    }
    vector < int > path;
    for (int u = n - 1; u != - 1; u = p [u]) path.push_back(u + 1);
    reverse(path.begin(), path.end());
    cout << d [n - 1] << "\n";
    for (int i = 0; i < (int) path.size(); i++) cout << path [i] << (i + 1
        == (int)
        path.size() ? '\n' : ' ');
}
