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
    vector < char > vis(n, 0);
    int comp = 0;
    for (int s = 0; s < n; s++) if (! vis [s]) {
        comp++;
        queue < int > q;
        q.push(s);
        vis [s] = 1;
        while (! q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : g [u]) if (! vis [v]) vis [v] = 1, q.push(v);
        }
    }
    cout << comp << "\n";
}
