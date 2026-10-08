#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int m, n;
    cin >> s >> m >> n;
    vector < string > a(m, string(n, 'O'));
    for (int r = 0; r < m; r++) for (int k = 0; k < n; k++) cin >> a [r] [k];
    int r = 0, k = 0, broj = 0;
    for (char c : s) {
        if (c == 'I') k++;
        else if (c == 'Z') k--;
        else if (c == 'S') r--;
        else r++;
        if (a [r] [k] == 'B') broj++;
    }
    cout << broj << '\n';
}
