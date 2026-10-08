#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, M, Q;
    cin >> N >> M >> Q;
    const long long INF = 4e18;
    vector < vector < long long >> d(N, vector < long long > (N, INF));
    for (int i = 0; i < N;++ i) d [i] [i] = 0;
    while (M--) {
        int a, b;
        long long w;
        cin >> a >> b >> w;
        -- a;
        -- b;
        d [a] [b] = d [b] [a] = min(d [a] [b], w);
    }
    for (int k = 0; k < N;++ k) for (int i = 0; i < N;++ i) if (d [i] [k] <
        INF) for
        (int j = 0; j < N;++ j) if (d [k] [j] < INF) d [i] [j] = min(d [i]
            [j], d [i]
        [k] + d [k] [j]);
    while (Q--) {
        int s, t;
        cin >> s >> t;
        long long x = d [s - 1] [t - 1];
        cout << (x == INF ? - 1 : x) << "\n";
    }
}
