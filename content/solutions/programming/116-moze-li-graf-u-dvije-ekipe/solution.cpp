#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, M;
    cin >> N >> M;
    vector < vector < int >> g(N);
    while (M--) {
        int a, b;
        cin >> a >> b;
        -- a;
        -- b;
        g [a].push_back(b);
        g [b].push_back(a);
    }
    vector < int > c(N, - 1);
    for (int s = 0; s < N;++ s) if (c [s] == - 1) {
        queue < int > q;
        c [s] = 0;
        q.push(s);
        while (! q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : g [u]) if (c [v] == - 1) {
                c [v] = c [u] ^ 1;
                q.push(v);
            }
            else if (c [v] == c [u]) {
                cout << "NE\n";
                return 0;
            }
        }
    }
    cout << "DA\n";
}
