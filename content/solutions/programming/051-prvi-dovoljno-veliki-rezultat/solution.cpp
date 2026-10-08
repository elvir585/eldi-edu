#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    long long X;
    cin >> N >> X;
    vector < long long > A(N);
    for (auto & v : A) cin >> v;
    int l = 0, r = N;
    while (l < r) {
        int m = (l + r) / 2;
        if (A [m] >= X) r = m;
        else l = m + 1;
    }
    cout << (l == N ? - 1 : l + 1) << "\n";
}
