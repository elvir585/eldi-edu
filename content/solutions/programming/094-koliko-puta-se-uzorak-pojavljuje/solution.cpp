#include <bits/stdc++.h>
using namespace std;
int main() {
    string T, P;
    cin >> T >> P;
    int m = P.size();
    vector < int > pi(m);
    for (int i = 1; i < m;++ i) {
        int j = pi [i - 1];
        while (j && P [i] != P [j]) j = pi [j - 1];
        if (P [i] == P [j])++ j;
        pi [i] = j;
    }
    long long ans = 0;
    int j = 0;
    for (char ch : T) {
        while (j && ch != P [j]) j = pi [j - 1];
        if (ch == P [j])++ j;
        if (j == m) {
            ++ ans;
            j = pi [j - 1];
        }
    }
    cout << ans << "\n";
}
