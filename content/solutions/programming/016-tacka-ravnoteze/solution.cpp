#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < long long > a(n);
    long long tot = 0;
    for (auto & x : a) {
        cin >> x;
        tot += x;
    }
    long long l = 0;
    for (int i = 0; i < n; i++) {
        if (l == tot - l - a [i]) {
            cout << i + 1 << "\n";
            return 0;
        }
        l += a [i];
    }
    cout << - 1 << "\n";
}
