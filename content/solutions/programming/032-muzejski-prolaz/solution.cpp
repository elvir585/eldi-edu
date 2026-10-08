#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    long long K;
    cin >> n >> K;
    vector < long long > a(n);
    for (auto & x : a) cin >> x;
    int l = 0, ans = 0;
    long long s = 0;
    for (int r = 0; r < n; r++) {
        s += a [r];
        while (s > K) s -= a [l++];
        ans = max(ans, r - l + 1);
    }
    cout << ans << "\n";
}
