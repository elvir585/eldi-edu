#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < tuple < long long, long long, long long >> a;
    for (int i = 0; i < n; i++) {
        long long s, e, v;
        cin >> s >> e >> v;
        a.push_back({
            e, s, v
        }
        );
    }
    sort(a.begin(), a.end());
    vector < long long > ends(n), dp(n + 1);
    for (int i = 0; i < n; i++) ends [i] = get < 0 > (a [i]);
    for (int i = 0; i < n; i++) {
        auto [e, s, v] = a [i];
        int j = upper_bound(ends.begin(), ends.begin() + i, s) -
            ends.begin() - 1;
        dp [i + 1] = max(dp [i], v + dp [j + 1]);
    }
    cout << dp [n] << "\n";
}
