#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    cin >> N;
    vector < pair < long long, long long >> s(N);
    for (auto & p : s) cin >> p.first >> p.second;
    sort(s.begin(), s.end());
    long long L = s [0].first, R = s [0].second, ans = 0;
    for (int i = 1; i < N;++ i) {
        auto [l, r] = s [i];
        if (l <= R) R = max(R, r);
        else {
            ans += R - L;
            L = l;
            R = r;
        }
    }
    ans += R - L;
    cout << ans << "\n";
}
