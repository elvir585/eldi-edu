#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, D;
    cin >> N >> D;
    vector < long long > w(N);
    long long l = 0, r = 0;
    for (auto & x : w) {
        cin >> x;
        l = max(l, x);
        r += x;
    }
    auto ok = [&] (long long C) {
        int days = 1;
        long long cur = 0;
        for (long long x : w) {
            if (cur + x > C) {
                ++ days;
                cur = 0;
            }
            cur += x;
        }
        return days <= D;
    }
    ;
    while (l < r) {
        long long m = l + (r - l) / 2;
        if (ok(m)) r = m;
        else l = m + 1;
    }
    cout << l << "\n";
}
