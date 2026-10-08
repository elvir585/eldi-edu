#include <bits/stdc++.h>
using namespace std;
int main() {
    int N;
    long long T;
    cin >> N >> T;
    vector < long long > A(N);
    for (auto & x : A) cin >> x;
    sort(A.begin(), A.end());
    int l = 0, r = N - 1;
    long long bestDiff = LLONG_MAX, bx = 0, by = 0;
    while (l < r) {
        long long x = A [l], y = A [r], diff = llabs(x + y - T);
        if (diff < bestDiff || (diff == bestDiff && make_pair(x, y) <
            make_pair(bx,
            by))) {
            bestDiff = diff;
            bx = x;
            by = y;
        }
        if (x + y < T)++ l;
        else-- r;
    }
    cout << bx << " " << by << "\n";
}
