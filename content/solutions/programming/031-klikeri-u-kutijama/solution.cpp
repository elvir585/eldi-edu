#include <iostream>
#include <vector>
#include <cstdlib>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < long long > a(n);
    long long s = 0;
    for (auto & x : a) {
        cin >> x;
        s += x;
    }
    long long m = s / n, bal = 0, ans = 0;
    for (int i = 0; i < n - 1; i++) {
        bal += a [i] - m;
        ans += llabs(bal);
    }
    cout << ans << "\n";
}
