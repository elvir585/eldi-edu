#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < long long > w(n), c(n);
    for (auto & x : w) cin >> x;
    for (auto & x : c) cin >> x;
    sort(w.begin(), w.end());
    sort(c.begin(), c.end());
    int i = 0;
    for (long long cap : c) if (i < n && w [i] <= cap)++ i;
    cout << i << "\n";
}
