#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long x;
    cin >> n >> x;
    vector < long long > a(n);
    for (auto & v : a) cin >> v;
    sort(a.begin(), a.end());
    int l = 0, r = n - 1;
    long long ans = LLONG_MAX;
    while (l < r) {
        long long s = a [l] + a [r];
        ans = min(ans, llabs(s - x));
        if (s < x) l++;
        else if (s > x) r--;
        else break;
    }
    cout << ans << "\n";
}
