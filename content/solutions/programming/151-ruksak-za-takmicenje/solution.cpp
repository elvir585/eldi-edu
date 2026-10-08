#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, W;
    cin >> n >> W;
    vector < long long > d(W + 1);
    while (n--) {
        int w;
        long long v;
        cin >> w >> v;
        for (int c = W; c >= w; c--) d [c] = max(d [c], d [c - w] + v);
    }
    cout << d [W] << "\n";
}
