#include <bits/stdc++.h>
using namespace std;
using u128 = __uint128_t;
int main() {
    unsigned long long a, b, m;
    cin >> a >> b >> m;
    unsigned long long res = 1 % m;
    a %= m;
    while (b) {
        if (b & 1) res = (u128) res * a % m;
        a = (u128) a * a % m;
        b >>= 1;
    }
    cout << res << "\n";
}
