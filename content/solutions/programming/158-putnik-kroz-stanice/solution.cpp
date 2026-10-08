#include <bits/stdc++.h>
using namespace std;
using ll = long long;
int main() {
    int n;
    cin >> n;
    vector < pair < ll, ll >> p(n);
    for (auto & z : p) cin >> z.first >> z.second;
    auto dist = [&] (int i, int j) {
        return llabs(p [i].first - p [j].first) + llabs(p [i].second - p
            [j].second);
    }
    ;
    int S = 1 << n;
    const ll INF = 4e18;
    vector < vector < ll >> d(S, vector < ll > (n, INF));
    d [1] [0] = 0;
    for (int m = 0; m < S; m++) if (m & 1) for (int i = 0; i < n; i++) if
        (d [m] [i]
        < INF) for (int j = 0; j < n; j++) if (! (m >> j & 1)) {
        int nm = m | 1 << j;
        d [nm] [j] = min(d [nm] [j], d [m] [i] + dist(i, j));
    }
    ll ans = INF;
    for (int i = 0; i < n; i++) ans = min(ans, d [S - 1] [i] + dist(i, 0));
    cout << ans << "\n";
}
