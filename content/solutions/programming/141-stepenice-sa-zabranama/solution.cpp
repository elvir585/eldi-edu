#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
int main() {
    int N, K;
    cin >> N >> K;
    vector < char > bad(N + 1);
    while (K--) {
        int x;
        cin >> x;
        bad [x] = 1;
    }
    vector < long long > dp(N + 1);
    dp [0] = 1;
    for (int i = 1; i <= N; i++) if (! bad [i]) dp [i] = (dp [i - 1] + (i
        >= 2 ? dp
        [i - 2] : 0)) % MOD;
    cout << dp [N] << "\n";
}
