#include <bits/stdc++.h>
using namespace std;
long long sol(vector < long long > & a, vector < long long > & tmp, int l,
    int r) {
    if (r - l <= 1) return 0;
    int m = (l + r) / 2;
    long long c = sol(a, tmp, l, m) + sol(a, tmp, m, r);
    int i = l, j = m, k = l;
    while (i < m && j < r) {
        if (a [i] <= a [j]) tmp [k++] = a [i++];
        else {
            tmp [k++] = a [j++];
            c += m - i;
        }
    }
    while (i < m) tmp [k++] = a [i++];
    while (j < r) tmp [k++] = a [j++];
    for (i = l; i < r; i++) a [i] = tmp [i];
    return c;
}
int main() {
    int n;
    cin >> n;
    vector < long long > a(n), t(n);
    for (auto & x : a) cin >> x;
    cout << sol(a, t, 0, n) << "\n";
}
