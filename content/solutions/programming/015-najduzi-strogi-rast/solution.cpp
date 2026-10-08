#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < long long > a(n);
    for (auto & x : a) cin >> x;
    int cur = 1, best = 1;
    for (int i = 1; i < n; i++) {
        cur = a [i] > a [i - 1] ? cur + 1 : 1;
        best = max(best, cur);
    }
    cout << best << "\n";
}
