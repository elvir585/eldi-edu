#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, M, K;
    cin >> N >> M >> K;
    vector < vector < int >> g(N);
    vector < int > d(N, - 1);
    queue < int > q;
    for (int i = 0; i < K;++ i) {
        int s;
        cin >> s;
        -- s;
        if (d [s] == - 1) {
            d [s] = 0;
            q.push(s);
        }
    }
    while (M--) {
        int a, b;
        cin >> a >> b;
        -- a;
        -- b;
        g [a].push_back(b);
        g [b].push_back(a);
    }
    while (! q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : g [u]) if (d [v] == - 1) {
            d [v] = d [u] + 1;
            q.push(v);
        }
    }
    cout << * max_element(d.begin(), d.end()) << "\n";
}
