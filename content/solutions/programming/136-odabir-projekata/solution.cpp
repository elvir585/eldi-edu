#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n, T;
    cin >> n >> T;
    vector < long long > dp(T + 1, 0);
    for (int i = 0; i < n; i++) {
        int t;
        long long v;
        cin >> t >> v;
        for (int x = T; x >= t; x--) dp [x] = max(dp [x], dp [x - t] + v);
    }
    cout << * max_element(dp.begin(), dp.end()) << "\n";
}
