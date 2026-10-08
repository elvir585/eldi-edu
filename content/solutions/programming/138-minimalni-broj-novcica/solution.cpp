#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int k, S;
    cin >> k >> S;
    vector < int > c(k);
    for (int & x : c) cin >> x;
    const int INF = 1e9;
    vector < int > dp(S + 1, INF);
    dp [0] = 0;
    for (int x = 1; x <= S; x++) for (int v : c) if (v <= x && dp [x - v]
        != INF) dp
        [x] = min(dp [x], dp [x - v] + 1);
    cout << (dp [S] == INF ? - 1 : dp [S]) << "\n";
}
