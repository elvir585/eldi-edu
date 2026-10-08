#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < pair < long long, int >> e;
    e.reserve(2 * n);
    for (int i = 0; i < n; i++) {
        long long a, b;
        cin >> a >> b;
        e.push_back({
            a, 1
        }
        );
        e.push_back({
            b, - 1
        }
        );
    }
    sort(e.begin(), e.end());
    int cur = 0, ans = 0;
    for (auto [t, d] : e) {
        cur += d;
        ans = max(ans, cur);
    }
    cout << ans << "\n";
}
