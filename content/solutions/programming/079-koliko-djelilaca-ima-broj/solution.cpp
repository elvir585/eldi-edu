#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long ans = 0;
    for (long long d = 1; d * d <= n;++ d) if (n % d == 0) ans += (d * d ==
        n ? 1 : 2);
    cout << ans << "\n";
}
