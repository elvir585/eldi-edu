#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, d;
    cin >> n >> d;
    vector < long long > a(n);
    long long lo = 0, hi = 0;
    for (auto & x : a) {
        cin >> x;
        lo = max(lo, x);
        hi += x;
    }
    auto ok = [&] (long long c) {
        int rides = 1;
        long long s = 0;
        for (long long x : a) {
            if (s + x > c) {
                rides++;
                s = 0;
            }
            s += x;
        }
        return rides <= d;
    }
    ;
    while (lo < hi) {
        long long m = lo + (hi - lo) / 2;
        if (ok(m)) hi = m;
        else lo = m + 1;
    }
    cout << lo << "\n";
}
