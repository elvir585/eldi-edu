#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, M;
    cin >> N >> M;
    vector < vector < int >> g(N);
    vector < int > ind(N), dp(N);
    while (M--) {
        int a, b;
        cin >> a >> b;
        -- a;
        -- b;
        g [a].push_back(b);
        ++ ind [b];
    }
    queue < int > q;
    for (int i = 0; i < N;++ i) if (! ind [i]) q.push(i);
    while (! q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : g [u]) {
            dp [v] = max(dp [v], dp [u] + 1);
            if (-- ind [v] == 0) q.push(v);
        }
    }
    cout << * max_element(dp.begin(), dp.end()) << "\n";
}
