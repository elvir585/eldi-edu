#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector < long long > a(n);
    for (auto & x : a) cin >> x;
    unordered_map < long long, int > f;
    int l = 0, d = 0, ans = n + 1;
    for (int r = 0; r < n; r++) {
        if (f [a [r]]++ == 0) d++;
        while (d >= k) {
            ans = min(ans, r - l + 1);
            if (-- f [a [l]] == 0) d--;
            l++;
        }
    }
    cout << (ans == n + 1 ? - 1 : ans) << "\n";
}
