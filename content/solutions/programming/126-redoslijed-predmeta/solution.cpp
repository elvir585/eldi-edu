#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector < vector < int >> g(n);
    vector < int > d(n);
    while (m--) {
        int u, v;
        cin >> u >> v;
        g [-- u].push_back(-- v);
        d [v]++;
    }
    priority_queue < int, vector < int >, greater < int >> q;
    for (int i = 0; i < n; i++) if (! d [i]) q.push(i);
    vector < int > a;
    while (! q.empty()) {
        int u = q.top();
        q.pop();
        a.push_back(u + 1);
        for (int v : g [u]) if (-- d [v] == 0) q.push(v);
    }
    if ((int) a.size() != n) cout << - 1 << "\n";
    else {
        for (int i = 0; i < n; i++) cout << a [i] << (i + 1 == n ? '\n' : ' ');
    }
}
