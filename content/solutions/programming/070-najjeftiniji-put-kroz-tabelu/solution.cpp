#include <bits/stdc++.h>
using namespace std;
int main() {
    int R, C;
    cin >> R >> C;
    const long long INF = 4e18;
    vector < long long > dp(C, INF);
    for (int r = 0; r < R;++ r) {
        for (int c = 0; c < C;++ c) {
            long long x;
            cin >> x;
            if (r == 0 && c == 0) dp [c] = x;
            else if (r == 0) dp [c] = dp [c - 1] + x;
            else if (c == 0) dp [c] = dp [c] + x;
            else dp [c] = min(dp [c], dp [c - 1]) + x;
        }
    }
    cout << dp [C - 1] << "\n";
}
