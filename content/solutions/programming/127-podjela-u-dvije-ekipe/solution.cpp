#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector < vector < int >> g(n);
    while (m--) {
        int u, v;
        cin >> u >> v;
        -- u;
        -- v;
        g [u].push_back(v);
        g [v].push_back(u);
    }
    vector < int > c(n, - 1);
    queue < int > q;
    for (int s = 0; s < n; s++) if (c [s] < 0) {
        c [s] = 0;
        q.push(s);
        while (! q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : g [u]) {
                if (c [v] < 0) {
                    c [v] = c [u] ^ 1;
                    q.push(v);
                }
                else if (c [v] == c [u]) {
                    cout << "NE\n";
                    return 0;
                }
            }
        }
    }
    cout << "DA\n";
}
