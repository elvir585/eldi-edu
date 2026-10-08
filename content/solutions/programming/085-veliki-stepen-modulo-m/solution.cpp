#include <bits/stdc++.h>
using namespace std;
using i128 = __int128_t;
int main() {
    unsigned long long a, b, m;
    cin >> a >> b >> m;
    unsigned long long r = 1 % m;
    a %= m;
    while (b) {
        if (b & 1) r = (unsigned long long) ((i128) r * a % m);
        a = (unsigned long long) ((i128) a * a % m);
        b >>= 1;
    }
    cout << r << "\n";
}
