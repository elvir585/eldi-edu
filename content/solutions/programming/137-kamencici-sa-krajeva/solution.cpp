#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector < long long > a(n);
    for (auto & x : a) cin >> x;
    vector < vector < long long >> dp(n, vector < long long > (n));
    for (int i = 0; i < n; i++) dp [i] [i] = a [i];
    for (int len = 2; len <= n; len++) for (int l = 0; l + len <= n; l++) {
        int r = l + len - 1;
        dp [l] [r] = max(a [l] - dp [l + 1] [r], a [r] - dp [l] [r - 1]);
    }
    cout << dp [0] [n - 1] << "\n";
}
