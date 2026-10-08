#include <bits/stdc++.h>
using namespace std;
int main() {
    const int M = 1000000007;
    int n;
    cin >> n;
    vector < int > d(n + 1);
    d [0] = 1;
    for (int i = 1; i <= n; i++) for (int k = 1; k <= 3; k++) if (i >= k) d
        [i] = (d
        [i] + d [i - k]) % M;
    cout << d [n] << "\n";
}
