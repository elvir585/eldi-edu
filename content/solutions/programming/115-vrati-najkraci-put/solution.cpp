#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, M, S, T;
    cin >> N >> M >> S >> T;
    -- S;
    -- T;
    vector < vector < int >> g(N);
    while (M--) {
        int a, b;
        cin >> a >> b;
        -- a;
        -- b;
        g [a].push_back(b);
        g [b].push_back(a);
    }
    vector < int > d(N, - 1), par(N, - 1);
    queue < int > q;
    d [S] = 0;
    q.push(S);
    while (! q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : g [u]) if (d [v] == - 1) {
            d [v] = d [u] + 1;
            par [v] = u;
            q.push(v);
        }
    }
    if (d [T] == - 1) {
        cout << - 1 << "\n";
        return 0;
    }
    vector < int > p;
    for (int v = T; v != - 1; v = par [v]) p.push_back(v + 1);
    reverse(p.begin(), p.end());
    cout << d [T] << "\n";
    for (int i = 0; i < (int) p.size();++ i) {
        if (i) cout << ' ';
        cout << p [i];
    }
    cout << "\n";
}
