#include <bits/stdc++.h>
using namespace std;
using i128 = __int128_t;
int main() {
    int n;
    unsigned long long k;
    cin >> n >> k;
    vector < unsigned long long > t(n);
    for (auto & x : t) cin >> x;
    unsigned long long mn = * min_element(t.begin(), t.end()), lo = 0, hi =
        mn * k;
    while (lo < hi) {
        auto mid = lo + (hi - lo) / 2;
        i128 s = 0;
        for (auto x : t) {
            s += mid / x;
            if (s >= k) break;
        }
        if (s >= k) hi = mid;
        else lo = mid + 1;
    }
    cout << lo << "\n";
}
