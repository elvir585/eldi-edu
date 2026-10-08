#include <bits/stdc++.h>
using namespace std;
int main() {
    unsigned long long n;
    cin >> n;
    int ans = 0;
    while (n) {
        ans += (n & 1ULL);
        n >>= 1;
    }
    cout << ans << "\n";
}
