#include <iostream>
#include <vector>
#include <queue>
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
    for (int s = 0; s < n; s++) if (c [s] == - 1) {
        queue < int > q;
        q.push(s);
        c [s] = 0;
        while (! q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : g [u]) {
                if (c [v] == - 1) c [v] = 1 - c [u], q.push(v);
                else if (c [v] == c [u]) {
                    cout << "NE\n";
                    return 0;
                }
            }
        }
    }
    cout << "DA\n";
}
