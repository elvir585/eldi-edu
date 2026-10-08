#include <bits/stdc++.h>
using namespace std;
int main() {
    const long long MOD = 1000000007;
    int R, C;
    cin >> R >> C;
    vector < long long > dp(C);
    dp [0] = 1;
    for (int r = 0; r < R;++ r) {
        string s;
        cin >> s;
        for (int c = 0; c < C;++ c) {
            if (s [c] == '#') dp [c] = 0;
            else if (c > 0) dp [c] = (dp [c] + dp [c - 1]) % MOD;
        }
    }
    cout << dp [C - 1] << "\n";
}
