#include <bits/stdc++.h>
using namespace std;
int main() {
    string t, p;
    cin >> t >> p;
    int m = p.size();
    vector < int > pi(m);
    for (int i = 1; i < m; i++) {
        int j = pi [i - 1];
        while (j && p [i] != p [j]) j = pi [j - 1];
        if (p [i] == p [j]) j++;
        pi [i] = j;
    }
    long long ans = 0;
    int j = 0;
    for (char c : t) {
        while (j && c != p [j]) j = pi [j - 1];
        if (c == p [j]) j++;
        if (j == m) {
            ans++;
            j = pi [j - 1];
        }
    }
    cout << ans << "\n";
}
