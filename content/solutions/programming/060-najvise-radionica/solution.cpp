#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < pair < long long, long long >> a;
    while (n--) {
        long long s, e;
        cin >> s >> e;
        a.push_back({
            e, s
        }
        );
    }
    sort(a.begin(), a.end());
    long long last = LLONG_MIN;
    int ans = 0;
    for (auto [e, s] : a) if (s >= last) {
        ans++;
        last = e;
    }
    cout << ans << "\n";
}
