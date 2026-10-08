#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n;
    unordered_set < string > s;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        s.insert(w);
    }
    cin >> m;
    int broj = 0, ans = - 1;
    for (int i = 1; i <= m; i++) {
        string w;
        cin >> w;
        if (s.erase(w)) broj++;
        if (ans == - 1 && 2 * broj >= n) ans = i;
    }
    cout << ans << '\n';
}
