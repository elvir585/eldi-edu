#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < long long > a(n), L(n + 1), R(n + 1);
    for (auto & x : a) cin >> x;
    for (int i = 0; i < n; i++) L [i + 1] = gcd(L [i], a [i]);
    for (int i = n - 1; i >= 0; i--) R [i] = gcd(R [i + 1], a [i]);
    long long ans = 0;
    for (int i = 0; i < n; i++) ans = max(ans, gcd(L [i], R [i + 1]));
    cout << ans << "\n";
}
