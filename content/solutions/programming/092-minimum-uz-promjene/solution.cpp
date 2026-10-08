#include <bits/stdc++.h>
using namespace std;
int main() {
    int N, Q;
    cin >> N >> Q;
    int s = 1;
    while (s < N) s *= 2;
    const long long INF = 4e18;
    vector < long long > seg(2 * s, INF);
    for (int i = 0; i < N;++ i) cin >> seg [s + i];
    for (int i = s - 1; i;-- i) seg [i] = min(seg [2 * i], seg [2 * i + 1]);
    auto setv = [&] (int i, long long x) {
        i += s;
        seg [i] = x;
        for (i /= 2; i; i /= 2) seg [i] = min(seg [2 * i], seg [2 * i + 1]);
    }
    ;
    auto qry = [&] (int l, int r) {
        long long ans = INF;
        for (l += s, r += s; l < r; l /= 2, r /= 2) {
            if (l & 1) ans = min(ans, seg [l++]);
            if (r & 1) ans = min(ans, seg [-- r]);
        }
        return ans;
    }
    ;
    while (Q--) {
        string t;
        int a;
        long long b;
        cin >> t >> a >> b;
        if (t == "SET") setv(a - 1, b);
        else cout << qry(a - 1, (int) b) << "\n";
    }
}
