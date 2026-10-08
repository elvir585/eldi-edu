#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, M;
    cin >> N >> M;
    vector < vector < int >> g(N);
    vector < int > ind(N);
    while (M--) {
        int a, b;
        cin >> a >> b;
        -- a;
        -- b;
        g [a].push_back(b);
        ++ ind [b];
    }
    priority_queue < int, vector < int >, greater < int >> pq;
    for (int i = 0; i < N;++ i) if (! ind [i]) pq.push(i);
    vector < int > ord;
    while (! pq.empty()) {
        int u = pq.top();
        pq.pop();
        ord.push_back(u + 1);
        for (int v : g [u]) if (-- ind [v] == 0) pq.push(v);
    }
    for (int i = 0; i < N;++ i) {
        if (i) cout << ' ';
        cout << ord [i];
    }
    cout << "\n";
}
