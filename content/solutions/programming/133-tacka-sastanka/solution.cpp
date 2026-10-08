#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < long long > x(n), y(n);
    for (int i = 0; i < n; i++) cin >> x [i] >> y [i];
    sort(x.begin(), x.end());
    sort(y.begin(), y.end());
    long long X = x [n / 2], Y = y [n / 2], ans = 0;
    for (long long v : x) ans += llabs(v - X);
    for (long long v : y) ans += llabs(v - Y);
    cout << ans << "\n";
}
