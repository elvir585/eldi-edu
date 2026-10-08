#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < vector < int >> g(n);
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        -- u;
        -- v;
        g [u].push_back(v);
        g [v].push_back(u);
    }
    auto far = [&] (int s) {
        vector < int > d(n, - 1);
        queue < int > q;
        d [s] = 0;
        q.push(s);
        while (! q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : g [u]) if (d [v] < 0) {
                d [v] = d [u] + 1;
                q.push(v);
            }
        }
        int a = max_element(d.begin(), d.end()) - d.begin();
        return pair < int, int > {
            a, d [a]
        }
        ;
    }
    ;
    auto [a, x] = far(0);
    auto [b, ans] = far(a);
    cout << ans << "\n";
}
