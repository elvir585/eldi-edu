#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, S;
    cin >> n >> S;
    vector < int > c(n);
    for (int & x : c) cin >> x;
    const int INF = 1e9;
    vector < int > d(S + 1, INF);
    d [0] = 0;
    for (int x = 1; x <= S; x++) for (int v : c) if (v <= x && d [x - v] <
        INF) d [x]
        = min(d [x], d [x - v] + 1);
    cout << (d [S] >= INF ? - 1 : d [S]) << "\n";
}
